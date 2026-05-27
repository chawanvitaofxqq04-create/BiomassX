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

            if (elTotalOrders) elTotalOrders.innerText = totalOrders.toLocaleString();
            if (elTotalValue) elTotalValue.innerText = '฿' + totalMarketValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
            if (elTotalCo2) elTotalCo2.innerText = totalCO2Reduced.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});

            // 4. สร้างการ์ดดัชนีราคา (Market Index) แบบไดนามิก
            const marketIndexContainer = document.getElementById('market-index-container');
            if (marketIndexContainer) {
                marketIndexContainer.innerHTML = ''; // ล้าง Loading ออก

                Object.keys(productStats).forEach(prodName => {
                    const stats = productStats[prodName];
                    const avgBuy = stats.buyCount > 0 ? (stats.buySum / stats.buyCount) : 0;
                    const avgSell = stats.sellCount > 0 ? (stats.sellSum / stats.sellCount) : 0;
                    
                    // แปลงราคาเป็น Text สวยๆ
                    const txtAvgBuy = avgBuy > 0 ? '฿' + avgBuy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'ไม่มีข้อมูล';
                    const txtAvgSell = avgSell > 0 ? '฿' + avgSell.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'ไม่มีข้อมูล';

                    const cardHtml = `
                        <div class="index-card" style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; width: 100%; margin-bottom: 20px;">
                            <h3 style="margin-bottom: 20px; font-size: 1.2rem; color: #1e293b; font-weight: 700;">${prodName}</h3>
                            <div class="index-price-row" style="display: flex; border-radius: 8px; overflow: hidden; margin-bottom: 20px; gap: 10px;">
                                <div class="price-box price-buy" style="flex: 1; padding: 20px; background: #dcfce7; border-radius: 8px;">
                                    <div class="label" style="font-size: 0.85rem; color: #166534; margin-bottom: 5px; font-weight: 600; text-transform: uppercase;">เฉลี่ยซื้อ (AVG BUY)</div>
                                    <div class="value" style="color: #16a34a; font-weight: 700; font-size: ${avgBuy > 0 ? '1.8rem' : '1.2rem'};">${txtAvgBuy}</div>
                                </div>
                                <div class="price-box price-sell" style="flex: 1; padding: 20px; background: #ffe4e6; border-radius: 8px;">
                                    <div class="label" style="font-size: 0.85rem; color: #9f1239; margin-bottom: 5px; font-weight: 600; text-transform: uppercase;">เฉลี่ยขาย (AVG SELL)</div>
                                    <div class="value" style="color: #e11d48; font-weight: 700; font-size: ${avgSell > 0 ? '1.8rem' : '1.2rem'};">${txtAvgSell}</div>
                                </div>
                            </div>
                            <div class="index-footer" style="font-size: 0.85rem; color: #64748b; display: flex; flex-direction: column; gap: 5px;">
                                <span>ต่อ MT (DAP)</span>
                                <span>📊 ${stats.orderCount30Days.toLocaleString()} คำสั่งซื้อขาย (30 วัน)</span>
                            </div>
                        </div>
                    `;
                    marketIndexContainer.insertAdjacentHTML('beforeend', cardHtml);
                });
            }
        }

    } catch (err) {
        console.error("Error loading index dashboard data:", err);
    }
});
