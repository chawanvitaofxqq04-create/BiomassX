import re

filepath = r"C:\project-programmer\Biomassx\js\order_new.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update mockMatchOrder
match_order_target = r"""            const { error } = await window\.supabaseClient
                \.from\('orders'\)
                \.update\(\{ status: 'Matched' \}\)
                \.eq\('id', orderId\);
                
            if \(error\) throw error;"""

match_order_replacement = """            // 1. อัปเดตสถานะในตาราง orders
            const { error } = await window.supabaseClient
                .from('orders')
                .update({ status: 'Matched' })
                .eq('id', orderId);
                
            if (error) throw error;
            
            // 2. ดึงข้อมูลออเดอร์มาเพื่อสร้างสัญญา
            const { data: orderData } = await window.supabaseClient
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();
                
            if (orderData) {
                // 3. บันทึกลงตาราง contracts
                await window.supabaseClient
                    .from('contracts')
                    .insert([{
                        order_id: orderId,
                        product_name: orderData.product_name || orderData.product || '-',
                        quantity: orderData.quantity || 0,
                        price: orderData.price || 0,
                        total_value: (orderData.quantity || 0) * (orderData.price || 0),
                        status: 'Active'
                    }]);
            }"""

content = re.sub(match_order_target, match_order_replacement, content)

# 2. Update contracts tab rendering to fetch from contracts table
contracts_tab_target = r"""                const contracts = orders\.filter\(o => o\.status && o\.status\.toLowerCase\(\) !== 'pending'\);"""

contracts_tab_replacement = """                // ดึงข้อมูลสัญญาที่เชื่อมโยงกับออเดอร์ของผู้ใช้นี้
                let contracts = orders.filter(o => o.status && o.status.toLowerCase() !== 'pending');
                try {
                    const orderIds = orders.map(o => o.id);
                    if (orderIds.length > 0) {
                        const { data: realContracts, error: contractErr } = await window.supabaseClient
                            .from('contracts')
                            .select('*')
                            .in('order_id', orderIds);
                        
                        // ถ้ามีข้อมูลจากตาราง contracts จริง ให้ใช้ข้อมูลนั้น (ผสานกับ order เดิมเพื่อเอา UI เก่ามาใช้)
                        if (!contractErr && realContracts && realContracts.length > 0) {
                            contracts = realContracts.map(c => {
                                const origOrder = orders.find(o => o.id === c.order_id) || {};
                                return {
                                    ...origOrder,
                                    contract_id: c.id,
                                    status: c.status || 'Matched',
                                    contract_date: c.created_at || origOrder.created_at
                                };
                            });
                        }
                    }
                } catch(e) {
                    console.warn('Could not fetch contracts table, falling back to orders table', e);
                }"""

content = re.sub(contracts_tab_target, contracts_tab_replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("order_new.js patched successfully.")
