document.addEventListener('DOMContentLoaded', async () => {
    // 1. ตรวจสอบการล็อกอิน
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized in dashboard');
        return;
    }

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const userId = session.user.id;

    try {
        // 2. ดึงข้อมูล Orders ของผู้ใช้นี้ทั้งหมด
        const { data: orders, error } = await window.supabaseClient
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 3. คำนวณสถานะออเดอร์
        let openOrdersCount = 0;
        let closedOrdersCount = 0;
        let totalMatchedQuantity = 0;
        const matchedOrders = [];

        if (orders && orders.length > 0) {
            orders.forEach(order => {
                const status = (order.status || '').toLowerCase();
                const qty = parseFloat(order.quantity) || 0;

                if (status === 'matched' || status === 'completed') {
                    closedOrdersCount++;
                    totalMatchedQuantity += qty;
                    matchedOrders.push(order);
                } else {
                    openOrdersCount++;
                }
            });
        }

        // อัปเดตตัวเลขสรุปคำสั่งซื้อ
        const openOrdersEl = document.getElementById('open-orders-count');
        const closedOrdersEl = document.getElementById('closed-orders-count');
        if (openOrdersEl) openOrdersEl.innerText = openOrdersCount;
        if (closedOrdersEl) closedOrdersEl.innerText = closedOrdersCount;

        // 4. คำนวณการลด CO2 (สูตร: 1 ตันชีวมวล ลด CO2 ได้ประมาณ 1.5 ตัน)
        const CO2_FACTOR = 1.5;
        const totalCO2Reduced = (totalMatchedQuantity * CO2_FACTOR).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});

        const co2Total1 = document.getElementById('co2-total-1');
        const co2Total2 = document.getElementById('co2-total-2');
        if (co2Total1) co2Total1.innerText = `${totalCO2Reduced} ตัน CO2eq`;
        if (co2Total2) co2Total2.innerText = `${totalCO2Reduced} ตัน CO2eq`;

        // 5. จัดการ Notifications
        const notifContainer = document.getElementById('notifications-container');
        if (notifContainer) {
            if (matchedOrders.length > 0) {
                notifContainer.innerHTML = ''; // ล้างของเดิม
                // โชว์แค่ 3 รายการล่าสุด
                matchedOrders.slice(0, 3).forEach(order => {
                    const shortId = window.sanitizeHTML(order.id ? order.id.toString().substring(0,8).toUpperCase() : 'N/A');
                    const productName = window.sanitizeHTML(order.product_name || order.product || 'สินค้าชีวมวล');
                    
                    const notifHtml = `
                        <div class="notification-item" style="border-bottom: 1px dashed #e2e8f0; padding: 18px 0; display: flex; gap: 16px; align-items: flex-start;">
                            <div class="notification-icon" style="background-color: #ecfdf5; color: #10b981; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid #d1fae5;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div class="notification-content">
                                <h4 style="margin: 0 0 6px 0; font-size: 0.95rem; color: #0f172a; font-weight: 700;">จับคู่คำสั่งซื้อสำเร็จ!</h4>
                                <p style="margin: 0; color: #64748b; font-size: 0.85rem; line-height: 1.5;">ออเดอร์ <strong style="color: #334155;">${productName}</strong> (Ref: ${shortId}) ของคุณได้รับการจับคู่แล้ว <a href="javascript:void(0)" onclick="localStorage.setItem('currentContractId', '${order.id}'); window.location.href='contract.html?id=${order.id}';" style="color: #10b981; text-decoration: none; font-weight: 700; cursor: pointer; margin-left: 4px;">คลิกเพื่อดูสัญญา →</a></p>
                            </div>
                        </div>
                    `;
                    notifContainer.insertAdjacentHTML('beforeend', notifHtml);
                });
            }
        }

        // 6. อัปเดตกราฟ CO2 (ถ้ายอด > 0 ให้กราฟพุ่งขึ้น)
        if (totalMatchedQuantity > 0) {
            const chartPath = document.getElementById('co2-chart-path');
            const chartText = document.getElementById('co2-chart-text');
            const chartContainer = document.getElementById('co2-chart-container');
            
            if (chartPath && chartText && chartContainer) {
                // ลบรูปพื้นหลัง (กราฟปลอมๆ) ที่มาจาก CSS ออกไป เพื่อไม่ให้มันซ้อนกัน
                chartContainer.style.backgroundImage = 'none';
                
                // ซ่อนข้อความเริ่มต้น
                chartText.style.display = 'none';
                
                // วาดกราฟเส้นพุ่งขึ้น
                // รูปแบบ M x,y L x,y
                chartPath.setAttribute('d', 'M0,135 L50,110 L120,120 L200,70 L280,85 L400,20');
                chartPath.setAttribute('stroke', '#10b981'); // สีเขียว
                chartPath.setAttribute('stroke-width', '4');
                chartPath.removeAttribute('stroke-dasharray'); // เอาเส้นประออก
                
                // เติมสีใต้กราฟ (Area)
                const svg = chartPath.parentElement;
                const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                areaPath.setAttribute('d', 'M0,135 L50,110 L120,120 L200,70 L280,85 L400,20 L400,140 L0,140 Z');
                areaPath.setAttribute('fill', 'rgba(16, 185, 129, 0.15)'); // สีเขียวโปร่งใส
                svg.insertBefore(areaPath, chartPath);
            }
        }

        // 7. จัดการ "คำสั่งซื้อล่าสุด" (Recent Orders)
        const recentOrdersContainer = document.getElementById('recent-orders-container');
        if (recentOrdersContainer && orders && orders.length > 0) {
            recentOrdersContainer.innerHTML = ''; // ล้าง Mockup
            
            // เอามาแค่ 3 รายการล่าสุด
            orders.slice(0, 3).forEach(order => {
                const shortId = window.sanitizeHTML(order.id ? order.id.toString().substring(0,8).toUpperCase() : 'N/A');
                const productName = window.sanitizeHTML(order.product_name || order.product || 'ไม่ระบุชื่อสินค้า');
                const statusStr = window.sanitizeHTML(order.status ? order.status.toUpperCase() : 'PENDING');
                const isMatched = statusStr === 'MATCHED' || statusStr === 'COMPLETED';
                const statusColor = isMatched ? '#10b981' : '#f59e0b';
                
                const itemHtml = `
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.01);" onmouseover="this.style.borderColor='#cbd5e1'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.04)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.01)'; this.style.transform='translateY(0)';" onclick="localStorage.setItem('activeTab', 'tab-list'); window.location.href='order.html?tab=list'">
                        <div style="display: flex; gap: 14px; align-items: center;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: ${isMatched ? '#ecfdf5' : '#fffbeb'}; color: ${statusColor}; display: flex; align-items: center; justify-content: center; border: 1px solid ${isMatched ? '#d1fae5' : '#fef3c7'};">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <div>
                                <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem; margin-bottom: 4px;">${productName}</div>
                                <div style="font-size: 0.8rem; color: #64748b; font-weight: 500;">Ref: ${shortId}</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="background-color: ${statusColor}15; color: ${statusColor}; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; border: 1px solid ${statusColor}40;">
                                ${statusStr}
                            </span>
                        </div>
                    </div>
                `;
                recentOrdersContainer.insertAdjacentHTML('beforeend', itemHtml);
            });
        }
    } catch (err) {
        console.error("Error loading dashboard data:", err);
    }
});
