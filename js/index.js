document.addEventListener('DOMContentLoaded', async () => {
    // 1. ตรวจสอบการโหลด Supabase Client
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized in index.js');
        return;
    }

    try {
        // 2. ดึงข้อมูล Orders ทั้งหมดในระบบเพื่อทำเป็น Global Dashboard
        // (ในระบบจริงอาจจะต้องมี API แยก หรือ View แยกสำหรับข้อมูลรวม เพื่อความปลอดภัย)
        const { data: orders, error } = await window.supabaseClient
            .from('orders')
            .select('*');

        if (error) {
            console.warn("Could not fetch global orders, using fallback data. Error:", error);
            // ถ้าติด RLS ให้ข้ามไปใช้ข้อมูล Mockup
            return;
        }

        if (orders && orders.length > 0) {
            let totalOrders = orders.length;
            let totalMarketValue = 0;
            let totalCO2Reduced = 0;
            
            // ใช้ Object ในการเก็บข้อมูลแยกตามชนิดสินค้า
            const productStats = {};
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

            orders.forEach(order => {
                const qty = parseFloat(order.quantity) || 0;
                const price = parseFloat(order.price) || 0;
                const status = (order.status || '').toLowerCase();
                const type = (order.order_type || '').toLowerCase();
                
                // คลีนชื่อสินค้า
                let product = (order.product_name || order.product || 'สินค้าย่อยอื่นๆ').trim();
                
                // จัดกลุ่มชื่อให้เป็นหมวดหมู่หลัก (ถ้าจำเป็น)
                if (product.toLowerCase().includes('ไม้อัดเม็ด') || product.toLowerCase().includes('wood pellet')) {
                    product = 'Wood Pellets (ไม้อัดเม็ด)';
                } else if (product.toLowerCase().includes('กะลาปาล์ม') || product.toLowerCase().includes('pks')) {
                    product = 'Palm Kernel Shell (กะลาปาล์ม)';
                } else if (product.includes('ชานอ้อยอัดเม็ด') || product.toLowerCase().includes('bagasse pellet')) {
                    product = 'Bagasse Pellets (ชานอ้อยอัดเม็ด)';
                } else if (product.includes('ชานอ้อยอัดก้อน') || product.toLowerCase().includes('baled bagasse')) {
                    product = 'Baled Bagasse (ชานอ้อยอัดก้อน)';
                } else if (product.toLowerCase().includes('ชานอ้อย') || product.toLowerCase().includes('bagasse')) {
                    product = 'Bagasse (ชานอ้อย)';
                } else if (product.toLowerCase().includes('สับไม้') || product.toLowerCase().includes('wood chip')) {
                    product = 'Wood Chips (สับไม้)';
                } else if (product.includes('แกลบ') || product.toLowerCase().includes('rice husk')) {
                    product = 'Rice Husk (แกลบ)';
                } else if (product.includes('ซังข้าวโพด') || product.toLowerCase().includes('corncob')) {
                    product = 'Corncob (ซังข้าวโพด)';
                } else if (product.includes('มันสำปะหลัง') || product.toLowerCase().includes('cassava')) {
                    product = 'Cassava (มันสำปะหลัง)';
                } else if (product.includes('ทะลายปาล์ม') || product.toLowerCase().includes('empty fruit bunch') || product.toLowerCase().includes('efb')) {
                    product = 'EFB (ทะลายปาล์มเปล่า)';
                } else if (product.includes('มะพร้าว') || product.toLowerCase().includes('coconut')) {
                    product = 'Coconut Biomass (ชีวมวลมะพร้าว)';
                }

                // เริ่มเก็บข้อมูลของสินค้านี้ถ้ายังไม่มี
                if (!productStats[product]) {
                    productStats[product] = { buySum: 0, buyCount: 0, sellSum: 0, sellCount: 0, orderCount30Days: 0 };
                }
                
                // คำนวณมูลค่าตลาดรวม (จำนวน x ราคา)
                totalMarketValue += (qty * price);

                // คำนวณ CO2 เฉพาะออเดอร์ที่ Match หรือ Complete แล้ว
                if (status === 'matched' || status === 'completed') {
                    totalCO2Reduced += (qty * 1.5);
                }

                // นับคำสั่งซื้อใน 30 วันย้อนหลัง
                const orderDate = new Date(order.created_at || new Date());
                if (orderDate >= thirtyDaysAgo) {
                    productStats[product].orderCount30Days++;
                }

                // รวมราคาเฉลี่ย
                if (type === 'buy') {
                    productStats[product].buySum += price;
                    productStats[product].buyCount++;
                } else if (type === 'sell') {
                    productStats[product].sellSum += price;
                    productStats[product].sellCount++;
                }
            });

            // 3. อัปเดตสถิติรวม (Global Stats)
            const elTotalOrders = document.getElementById('global-total-orders');
            const elTotalValue = document.getElementById('global-total-value');
            const elTotalCo2 = document.getElementById('global-total-co2');
            
            try {
                const { data: statsData, error: statsErr } = await window.supabaseClient
                    .from('market_stats')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();
                    
                if (!statsErr && statsData) {
                    totalOrders = statsData.total_orders || totalOrders;
                    totalMarketValue = statsData.total_value || totalMarketValue;
                    totalCO2Reduced = statsData.total_co2 || totalCO2Reduced;
                }
            } catch (e) {
                console.warn('Could not fetch market_stats, using calculated values', e);
            }

            // Format large numbers function
            function formatLargeNumber(num) {
                if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
                if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
                if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
                if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
                return num.toLocaleString();
            }

            if (elTotalOrders) elTotalOrders.innerText = formatLargeNumber(totalOrders);
            if (elTotalValue) elTotalValue.innerText = '฿' + formatLargeNumber(totalMarketValue);
            if (elTotalCo2) elTotalCo2.innerText = formatLargeNumber(totalCO2Reduced);

            // 4. สร้างการ์ดดัชนีราคา (Market Index) เป็นแบบ Static ตามความต้องการ
            const marketIndexContainer = document.getElementById('market-index-container');
            if (marketIndexContainer) {
                window.globalProductStats = productStats; // Save for re-render
                
                window.renderDynamicContent = function() {
                    marketIndexContainer.innerHTML = ''; // ล้าง Loading ออก
                    
                    const t = window.t || (k => k);

                    const cardHtml = `
                        <div class="index-card" style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; width: 100%; margin-bottom: 20px;">
                            <h3 style="margin-bottom: 15px; font-size: 1rem; color: #0f172a; font-weight: 700;">No active trading data</h3>
                            <div class="index-price-row" style="display: flex; border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
                                <div class="price-box price-buy" style="flex: 1; padding: 12px 16px; background: #dcfce7;">
                                    <div class="label" style="font-size: 0.75rem; color: #16a34a; margin-bottom: 4px; font-weight: 700;">${t('เฉลี่ยซื้อ')}</div>
                                    <div class="value" style="color: #16a34a; font-weight: 700; font-size: 1.1rem;">N/A</div>
                                </div>
                                <div class="price-box price-sell" style="flex: 1; padding: 12px 16px; background: #ffe4e6;">
                                    <div class="label" style="font-size: 0.75rem; color: #e11d48; margin-bottom: 4px; font-weight: 700;">${t('เฉลี่ยขาย')}</div>
                                    <div class="value" style="color: #e11d48; font-weight: 700; font-size: 1.1rem;">N/A</div>
                                </div>
                            </div>
                            <div class="index-footer" style="font-size: 0.8rem; color: #94a3b8;">
                                <span>${t('ต่อ MT (EXW)')}</span>
                            </div>
                        </div>
                    `;
                    marketIndexContainer.insertAdjacentHTML('beforeend', cardHtml);
                    
                    // Render Recent Orders Table
                    const recentOrdersTbody = document.getElementById('recent-orders-tbody');
                    if (recentOrdersTbody) {
                        recentOrdersTbody.innerHTML = '';
                        // Sort orders by created_at descending and take top 10
                        const recentOrders = [...orders]
                            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
                            .slice(0, 10);
                            
                        if (recentOrders.length === 0) {
                            recentOrdersTbody.innerHTML = `
                                <tr>
                                    <td colspan="9" style="text-align: center; padding: 30px; color: #94a3b8;" data-i18n="index.no_orders">
                                        ยังไม่มีข้อมูลคำสั่งซื้อขายในตลาด
                                    </td>
                                </tr>
                            `;
                        } else {
                            recentOrders.forEach(order => {
                                const type = (order.order_type || '').toUpperCase();
                                const typeClass = type === 'BUY' ? 'type-buy' : 'type-sell';
                                const typeLabel = type === 'BUY' ? 'BUY' : 'SELL';
                                
                                const product = order.product_name || order.product || '-';
                                const qty = order.quantity ? `${Number(order.quantity).toLocaleString()} ${order.unit || 'MT'}` : '-';
                                
                                let location = order.province || order.location || 'ประเทศไทย';
                                if (order.marketplace === 'Global Market' || order.marketplace === 'ตลาดโลก (นำเข้า/ส่งออก)') {
                                    location = order.region ? order.region : 'Global Market';
                                } else if (location === '-') {
                                    location = 'ประเทศไทย';
                                }

                                const origin = order.origin_port || '-';
                                const dest = order.destination_port || '-';
                                const contract = order.contract_type || 'SPOT';
                                const terms = order.delivery_terms || 'EXW';
                                
                                const d = new Date(order.created_at || new Date());
                                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                
                                const tr = document.createElement('tr');
                                const isGlobal = ['ทั่วโลก', 'Global', 'Global Market', 'Worldwide'].includes(location);
                                const locationIcon = isGlobal ? '🌍' : '📍';
                                tr.innerHTML = `
                                    <td><span class="order-type-badge ${typeClass}">${typeLabel}</span></td>
                                    <td style="font-weight: 500;">${product}</td>
                                    <td>${qty}</td>
                                    <td>${locationIcon} ${location}</td>
                                    <td style="color: #64748b;">${origin}</td>
                                    <td style="color: #64748b;">${dest}</td>
                                    <td><span class="badge" style="background: #f1f5f9; color: #475569;">${contract}</span></td>
                                    <td><span class="badge" style="background: #f1f5f9; color: #475569;">${terms}</span></td>
                                    <td style="color: #64748b; font-size: 0.9rem;">${dateStr}</td>
                                `;
                                recentOrdersTbody.appendChild(tr);
                            });
                        }
                    }
                };

                // Initial render
                window.renderDynamicContent();
            }
        }

    } catch (err) {
        console.error("Error loading index dashboard data:", err);
    }
});
