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
                    const shortId = order.id ? order.id.toString().substring(0,8).toUpperCase() : 'N/A';
                    const productName = order.product_name || order.product || 'สินค้าชีวมวล';
                    
                    const notifHtml = `
                        <div class="notification-item" style="border-bottom: 1px solid var(--border-color); padding: 15px 0; display: flex; gap: 15px; align-items: flex-start;">
                            <div class="notification-icon" style="background-color: #dcfce7; color: #16a34a; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">🎉</div>
                            <div class="notification-content">
                                <h4 style="margin: 0 0 5px 0; font-size: 0.95rem; color: var(--text-main);">จับคู่คำสั่งซื้อสำเร็จ!</h4>
                                <p style="margin: 0; color: var(--text-muted); font-size: 0.85rem; line-height: 1.4;">ออเดอร์ <strong>${productName}</strong> (Ref: ${shortId}) ของคุณได้รับการจับคู่แล้ว <a href="javascript:void(0)" onclick="localStorage.setItem('currentContractId', '${order.id}'); window.location.href='contract.html?id=${order.id}';" style="color: var(--primary-green); text-decoration: none; font-weight: 600; cursor: pointer;">คลิกเพื่อดูสัญญา</a></p>
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
                const shortId = order.id ? order.id.toString().substring(0,8).toUpperCase() : 'N/A';
                const productName = order.product_name || order.product || 'ไม่ระบุชื่อสินค้า';
                const statusStr = order.status ? order.status.toUpperCase() : 'PENDING';
                const isMatched = statusStr === 'MATCHED' || statusStr === 'COMPLETED';
                const statusColor = isMatched ? '#10b981' : '#f59e0b';
                
                const itemHtml = `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.borderColor='#cbd5e1'; this.style.backgroundColor='white';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#f8fafc';" onclick="localStorage.setItem('activeTab', 'tab-list'); window.location.href='order.html?tab=list'">
                        <div>
                            <div style="font-weight: 600; color: #1e293b; font-size: 0.95rem; margin-bottom: 3px;">${productName}</div>
                            <div style="font-size: 0.8rem; color: #64748b;">Ref: ${shortId}</div>
                        </div>
                        <div style="text-align: right;">
                            <span style="background-color: ${statusColor}15; color: ${statusColor}; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">
                                ${statusStr}
                            </span>
                        </div>
                    </div>
                `;
                recentOrdersContainer.insertAdjacentHTML('beforeend', itemHtml);
    } catch (err) {
        console.error("Error loading dashboard data:", err);
    }
});
