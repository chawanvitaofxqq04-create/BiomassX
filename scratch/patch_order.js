const fs = require('fs');

const filePath = 'C:/project-programmer/Biomassx/js/order_new.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Inject the Contracts & Market Stats logic into saveBtn
const contractsLogic = `                    const contractRef = \`MATCH-\${sortedIds[0]}-\${sortedIds[1]}\`.toUpperCase();

                    // === INSERT INTO CONTRACTS ===
                    let buyer_id = orderData.order_type === "Buy" ? session.user.id : matchedOrder.user_id;
                    let seller_id = orderData.order_type === "Buy" ? matchedOrder.user_id : session.user.id;
                    let buy_order_id = orderData.order_type === "Buy" ? newOrder.id : matchedOrder.id;
                    let sell_order_id = orderData.order_type === "Buy" ? matchedOrder.id : newOrder.id;

                    await window.supabaseClient.from("contracts").insert([{ 
                        contract_ref: contractRef, 
                        buyer_id: buyer_id, 
                        seller_id: seller_id, 
                        buy_order_id: buy_order_id, 
                        sell_order_id: sell_order_id 
                    }]);

                    // === UPDATE MARKET STATS ===
                    try {
                        const { data: stats } = await window.supabaseClient.from("market_stats").select("*").limit(1);
                        const addedVolume = parseFloat(orderData.quantity) || 0;
                        const addedCo2 = addedVolume * 1.5;
                        if (stats && stats.length > 0) {
                            await window.supabaseClient.from("market_stats").update({ 
                                total_orders: (stats[0].total_orders || 0) + 1, 
                                monthly_volume: (parseFloat(stats[0].monthly_volume) || 0) + addedVolume, 
                                total_co2_saved: (parseFloat(stats[0].total_co2_saved) || 0) + addedCo2, 
                                updated_at: new Date().toISOString() 
                            }).eq("id", stats[0].id);
                        } else {
                            await window.supabaseClient.from("market_stats").insert([{ 
                                id: 1, 
                                total_orders: 1, 
                                monthly_volume: addedVolume, 
                                countries_count: 1, 
                                total_co2_saved: addedCo2, 
                                updated_at: new Date().toISOString() 
                            }]);
                        }
                    } catch (statErr) {
                        console.error("Failed to update market stats:", statErr);
                    }

                    alert(\` จับคู่สำเร็จทันที! (Immediate Match)\\nระบบพบคำสั่งที่ตรงกันในตลาด สถานะของคุณคือ "Matched"\\n\\n รหัสสัญญาของคุณคือ: \${contractRef}\`);
`;

const oldContractsLogic = `                    const contractRef = \`MATCH-\${sortedIds[0]}-\${sortedIds[1]}\`.toUpperCase();
                    alert(\` จับคู่สำเร็จทันที! (Immediate Match)\\nระบบพบคำสั่งที่ตรงกันในตลาด สถานะของคุณคือ "Matched"\\n\\n รหัสสัญญาของคุณคือ: \${contractRef}\`);
`;

content = content.replace(oldContractsLogic, contractsLogic);

// 2. Inject the Insight Aggregation Logic right after saveBtn ends
const insightLogic = `

    // === Smart Market Insight Logic (Unified UI) ===
    const productSelectInput = document.getElementById('productSelect');
    const provinceSelectInput = document.getElementById('provinceSelect');
    const smartInsightBox = document.getElementById('smartInsightBox');
    
    const triggerInsightLoad = () => {
        const prod = productSelectInput && productSelectInput.value ? productSelectInput.value.trim() : '';
        const prov = provinceSelectInput && provinceSelectInput.value ? provinceSelectInput.value.trim() : '';
        if (prod) {
            if(typeof window.loadOrderBookInsight === 'function') {
                window.loadOrderBookInsight(prod, prov);
            }
        } else {
            if(smartInsightBox) smartInsightBox.style.display = 'none';
        }
    };

    if (productSelectInput) productSelectInput.addEventListener('change', triggerInsightLoad);
    if (productSelectInput) productSelectInput.addEventListener('input', triggerInsightLoad);
    if (provinceSelectInput) provinceSelectInput.addEventListener('change', triggerInsightLoad);

    window.loadOrderBookInsight = async function(contractId, province) {
        const bidsList = document.getElementById('bidsListInsight');
        const asksList = document.getElementById('asksListInsight');
        if (!bidsList || !asksList || !window.supabaseClient) return;

        if (smartInsightBox) smartInsightBox.style.display = 'block';

        const labelElement = document.getElementById('insightLocation');
        if (labelElement) {
            labelElement.innerText = contractId + \` (ทั่วประเทศ)\`;
        }

        bidsList.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px 20px; font-family: Inter, sans-serif;">กำลังโหลด...</div>';
        asksList.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px 20px; font-family: Inter, sans-serif;">กำลังโหลด...</div>';

        try {
            let bidQuery = window.supabaseClient
                .from('orders')
                .select('price, quantity, province, created_at')
                .in('status', ['Open', 'Pending', 'PENDING', 'open', 'pending'])
                .in('order_type', ['Buy', 'buy', 'BUY', 'เสนอซื้อ'])
                .eq('product_name', contractId)
                .order('price', { ascending: false })
                .order('created_at', { ascending: true })
                .limit(50);

            let askQuery = window.supabaseClient
                .from('orders')
                .select('price, quantity, province, created_at')
                .in('status', ['Open', 'Pending', 'PENDING', 'open', 'pending'])
                .in('order_type', ['Sell', 'sell', 'SELL', 'เสนอขาย'])
                .eq('product_name', contractId)
                .order('price', { ascending: true })
                .order('created_at', { ascending: true })
                .limit(50);

            const { data: bids } = await bidQuery;
            const { data: asks } = await askQuery;

            const aggregateOrders = (orders) => {
                if (!orders || orders.length === 0) return [];
                const grouped = {};
                orders.forEach(o => {
                    const p = o.price;
                    if (!grouped[p]) {
                        grouped[p] = { price: p, quantity: 0, latest_time: o.created_at, count: 0, provinces: [] };
                    }
                    grouped[p].quantity += parseFloat(o.quantity) || 0;
                    grouped[p].count += 1;
                    if (o.province && !grouped[p].provinces.includes(o.province)) grouped[p].provinces.push(o.province);
                    if (new Date(o.created_at) > new Date(grouped[p].latest_time)) {
                        grouped[p].latest_time = o.created_at;
                    }
                });
                return Object.values(grouped);
            };

            const aggBids = aggregateOrders(bids).sort((a,b) => b.price - a.price).slice(0, 5);
            const aggAsks = aggregateOrders(asks).sort((a,b) => a.price - b.price).slice(0, 5);

            if (aggBids && aggBids.length > 0) {
                bidsList.innerHTML = aggBids.map(b => \`<div class="orderbook-row bid-row" data-price="\${b.price}" title="\${b.provinces.length > 0 ? 'จังหวัด: ' + b.provinces.join(', ') : 'ไม่ระบุ'}" style="position: relative; display: flex; justify-content: space-between; padding: 12px 20px; cursor: pointer; transition: all 0.2s; align-items: center;" onmouseover="if(!this.classList.contains('highlighted-row')) this.style.background='rgba(16,185,129,0.08)'" onmouseout="if(!this.classList.contains('highlighted-row')) this.style.background='transparent'">
                    <div style="position: absolute; right: 0; top: 0; bottom: 0; width: \${Math.min((b.quantity / 1000) * 100, 100)}%; background: rgba(16,185,129,0.1); z-index: 0;"></div>
                    <div style="display: flex; flex-direction: column; align-items: flex-start; z-index: 1;">
                        <span style="color:#64748b; font-size: 1.05rem;">\${b.quantity.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:2})}</span>
                        <span style="color:#94a3b8; font-size: 0.75rem; margin-top: 2px;">\${b.count > 1 ? \`รวม \${b.count} ออเดอร์\` : \`เวลา \${new Date(b.latest_time).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.\`}</span>
                    </div>
                    <span style="color:#10b981; font-weight:700; z-index: 1; font-size: 1.1rem;">\${b.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>\`).join('');
            } else {
                bidsList.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 60px 20px; font-family: Inter, sans-serif; font-size: 1rem;">ไม่มีผู้ตั้งรับซื้อ</div>';
            }

            if (aggAsks && aggAsks.length > 0) {
                asksList.innerHTML = aggAsks.map(a => \`<div class="orderbook-row ask-row" data-price="\${a.price}" title="\${a.provinces.length > 0 ? 'จังหวัด: ' + a.provinces.join(', ') : 'ไม่ระบุ'}" style="position: relative; display: flex; justify-content: space-between; padding: 12px 20px; cursor: pointer; transition: all 0.2s; align-items: center;" onmouseover="if(!this.classList.contains('highlighted-row')) this.style.background='rgba(239,68,68,0.08)'" onmouseout="if(!this.classList.contains('highlighted-row')) this.style.background='transparent'">
                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: \${Math.min((a.quantity / 1000) * 100, 100)}%; background: rgba(239,68,68,0.1); z-index: 0;"></div>
                    <span style="color:#ef4444; font-weight:700; z-index: 1; font-size: 1.1rem;">\${a.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; z-index: 1;">
                        <span style="color:#64748b; font-size: 1.05rem;">\${a.quantity.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:2})}</span>
                        <span style="color:#94a3b8; font-size: 0.75rem; margin-top: 2px;">\${a.count > 1 ? \`รวม \${a.count} ออเดอร์\` : \`เวลา \${new Date(a.latest_time).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.\`}</span>
                    </div>
                </div>\`).join('');
            } else {
                asksList.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 60px 20px; font-family: Inter, sans-serif; font-size: 1rem;">ไม่มีผู้เสนอขาย</div>';
            }
            
            if (typeof window.highlightClosestPrice === 'function') {
                window.highlightClosestPrice();
            }
        } catch(e) {
            console.error("Error loading insight:", e);
        }
    };

    window.highlightClosestPrice = function() {
        const priceInput = document.getElementById('price');
        const typeSelect = document.getElementById('orderType');
        if (!priceInput) return;
        
        const userPrice = parseFloat(priceInput.value);
        const orderType = typeSelect ? typeSelect.value : '';
        
        const allRows = document.querySelectorAll('.orderbook-row');
        allRows.forEach(row => {
            row.classList.remove('highlighted-row');
            row.style.boxShadow = 'none';
            row.style.backgroundColor = 'transparent';
        });
        
        if (isNaN(userPrice) || userPrice <= 0 || allRows.length === 0) return;
        
        let targetRows = Array.from(allRows);
        if (orderType === 'Buy') {
            targetRows = targetRows.filter(r => r.classList.contains('ask-row') && parseFloat(r.getAttribute('data-price')) <= userPrice);
        } else if (orderType === 'Sell') {
            targetRows = targetRows.filter(r => r.classList.contains('bid-row') && parseFloat(r.getAttribute('data-price')) >= userPrice);
        }
        
        if (targetRows.length > 0) {
            const bestRow = targetRows[0];
            bestRow.classList.add('highlighted-row');
            bestRow.style.boxShadow = '0 0 0 2px #f59e0b';
            bestRow.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        }
    };
`;

content = content.replace("    // === โหลดข้อมูลรายการคำสั่งซื้อจริงจาก Supabase ===", insightLogic + "\n    // === โหลดข้อมูลรายการคำสั่งซื้อจริงจาก Supabase ===");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully patched order_new.js!");
