document.addEventListener('DOMContentLoaded', () => {
    // ข้อมูลสินค้าชีวมวล (ไทย-อังกฤษ)
    const biomassProducts = [
        { th: "ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)", en: "Wood Logs (Acacia/Eucalyptus)" },
        { th: "ชานอ้อย", en: "Bagasse" },
        { th: "ชานอ้อยอัดก้อน", en: "Baled Bagasse" },
        { th: "ชานอ้อยอัดเม็ด", en: "Bagasse Pellets" },
        { th: "ไผ่", en: "Bamboo" },
        { th: "ถ่านไผ่", en: "Bamboo Charcoal" },
        { th: "ถ่านไม้อัดแท่ง", en: "Briquette Charcoal" },
        { th: "ไผ่สับ", en: "Bamboo Chips" },
        { th: "ไม้สับเบญจพรรณ", en: "Mixed Wood Chips" },
        { th: "ไม้สับยูคาลิปตัส", en: "Eucalyptus Wood Chips" },
        { th: "รากไม้/ตอไม้สับ", en: "Root/Stump Wood Chips" },
        { th: "ปีกไม้/ขี้เลื่อย", en: "Slabs/Sawdust" },
        { th: "ไม้อัดเม็ด", en: "Wood Pellets" },
        { th: "กะลาปาล์ม (PKS)", en: "Palm Kernel Shell" },
        { th: "ทะลายปาล์ม", en: "Empty Fruit Bunch (EFB)" },
        { th: "ใยปาล์ม", en: "Palm Fiber" },
        { th: "กะลามะพร้าว", en: "Coconut Shell" },
        { th: "แกลบ", en: "Rice Husk" },
        { th: "แกลบอัดก้อน", en: "Baled Rice Husk" },
        { th: "ฟางข้าวอัดก้อน", en: "Baled Rice Straw" },
        { th: "ซังข้าวโพด", en: "Corncob" },
        { th: "ลำต้น/ใบข้าวโพดอัดก้อน", en: "Baled Corn Stover" },
        { th: "ต้นมันสำปะหลัง", en: "Cassava Stems" },
        { th: "เหง้ามันสำปะหลัง", en: "Cassava Rhizomes" },
        { th: "หญ้าเนเปียร์", en: "Napier Grass" },
        { th: "ถ่านหินชีวภาพ (ทำจากไม้)", en: "Biocoal" }
    ];

    const input = document.getElementById('productInput');
    const suggestionsContainer = document.getElementById('productSuggestions');

    if (input && suggestionsContainer) {
        // ฟังก์ชันแสดงรายการที่ค้นหาเจอ
        const showSuggestions = (query) => {
            suggestionsContainer.innerHTML = ''; // ล้างของเก่า
            
            if (!query) {
                suggestionsContainer.classList.remove('active');
                return;
            }

            const lowerQuery = query.toLowerCase();
            // ค้นหาทั้งภาษาไทยและอังกฤษ
            const matches = biomassProducts.filter(p => 
                p.th.toLowerCase().includes(lowerQuery) || 
                p.en.toLowerCase().includes(lowerQuery)
            );

            if (matches.length === 0) {
                suggestionsContainer.innerHTML = '<div style="padding: 12px 15px; color: #94a3b8; font-size: 0.9rem;">ไม่พบสินค้าที่ตรงกัน...</div>';
                suggestionsContainer.classList.add('active');
                return;
            }

            matches.forEach(match => {
                const div = document.createElement('div');
                div.className = 'autocomplete-suggestion-item';
                div.innerHTML = `
                    <span class="suggestion-th">${match.th}</span>
                    <span class="suggestion-en">${match.en}</span>
                `;
                
                // เมื่อคลิกที่รายการ
                div.addEventListener('click', () => {
                    input.value = match.th; // ใส่ค่าภาษาไทยลงในช่อง
                    suggestionsContainer.classList.remove('active');
                });
                
                suggestionsContainer.appendChild(div);
            });

            suggestionsContainer.classList.add('active');
        };

        // ดักจับการพิมพ์
        input.addEventListener('input', (e) => {
            showSuggestions(e.target.value.trim());
        });
        
        // โชว์รายการทั้งหมดเมื่อคลิกที่ช่องว่างๆ (เผื่อผู้ใช้อยากดูว่ามีอะไรบ้าง)
        input.addEventListener('focus', (e) => {
            if (!e.target.value.trim()) {
                showSuggestions(' '); // ส่งสเปซบาร์ไปเพื่อโชว์ทั้งหมด (เพราะ includes(' ') จะตรงกับบางอัน หรือจะโชว์ทั้งหมดก็ได้)
                // แก้ไข: แสดงทั้งหมดถ้าช่องว่างเปล่า
                suggestionsContainer.innerHTML = '';
                biomassProducts.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-suggestion-item';
                    div.innerHTML = `
                        <span class="suggestion-th">${match.th}</span>
                        <span class="suggestion-en">${match.en}</span>
                    `;
                    div.addEventListener('click', () => {
                        input.value = match.th;
                        suggestionsContainer.classList.remove('active');
                    });
                    suggestionsContainer.appendChild(div);
                });
                suggestionsContainer.classList.add('active');
            }
        });

        // ปิดเมื่อคลิกที่อื่น
        document.addEventListener('click', (e) => {
            if (e.target !== input && e.target !== suggestionsContainer && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.classList.remove('active');
            }
        });
    }


    // ระบบบันทึกคำสั่งซื้อขาย (Save Order)
    const saveBtn = document.getElementById('saveOrderBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            // เช็คว่าล็อกอินหรือไม่
            if (!window.supabaseClient) {
                alert('กรุณาล็อกอินก่อนทำการบันทึกข้อมูล');
                return;
            }

            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (!session) {
                alert('เซสชั่นหมดอายุ กรุณาล็อกอินใหม่');
                window.location.href = 'login.html';
                return;
            }

            // รวบรวมสเปกแบบไดนามิก (เป็นข้อความ) เพื่อใส่ใน description
            let specsText = "";
            if (typeof window.getDynamicSpecs === 'function') {
                const specsObj = window.getDynamicSpecs();
                if (specsObj) {
                    specsText = "ข้อมูลจำเพาะ:\n" + Object.entries(specsObj).map(([k,v]) => `- ${k}: ${v}`).join('\n');
                }
            }

            const productValue = document.getElementById('productSelect') ? document.getElementById('productSelect').value : '';

            // ดึงข้อมูลจากฟอร์ม
            const orderData = {
                user_id: session.user.id,
                order_type: document.getElementById('orderType').value,
                product: productValue,
                product_name: productValue,
                quantity: parseFloat(document.getElementById('quantity').value) || 0,
                unit: document.getElementById('unit').value,
                price: parseFloat(document.getElementById('price').value) || 0,
                currency: document.getElementById('currency').value,
                marketplace: document.getElementById('marketplace').value,
                quality: document.getElementById('quality').value,
                contract_type: document.getElementById('contractType').value,
                payment_term: document.getElementById('paymentTerm').value,
                packing: document.getElementById('packing').value,
                province: document.querySelector('.province-select').value,
                amphoe: document.querySelectorAll('.small-select')[0] ? document.querySelectorAll('.small-select')[0].value : '',
                tambon: document.querySelectorAll('.small-select')[1] ? document.querySelectorAll('.small-select')[1].value : '',
                status: 'Open', // เปลี่ยนเป็น Open แทนการบังคับ Matched อัตโนมัติ
                created_at: new Date().toISOString()
            };

            // ตรวจสอบข้อมูลเบื้องต้น
            if (!orderData.order_type || !orderData.product || !orderData.quantity || !orderData.price) {
                alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ประเภทคำสั่ง, สินค้า, ปริมาณ, ราคา)");
                return;
            }
            
            if (orderData.quantity <= 0 || orderData.price <= 0) {
                alert("กรุณาระบุปริมาณและราคาให้ถูกต้อง (ต้องมากกว่า 0)");
                return;
            }

            // แจ้งผู้ใช้ว่ากำลังบันทึก
            const originalText = saveBtn.innerText;
            saveBtn.innerText = 'กำลังบันทึก...';
            saveBtn.disabled = true;

            try {
                // 1. ค้นหาคำสั่งที่รออยู่ (Pending) ในฝั่งตรงข้าม และสินค้าเดียวกัน
                const oppositeType = orderData.order_type === 'Buy' ? 'Sell' : 'Buy';
                let matchedOrder = null;
                let isMatched = false;
                
                let query = window.supabaseClient
                    .from('orders')
                    .select('*')
                    .in('status', ['Open', 'Pending', 'PENDING', 'open', 'pending'])
                    .eq('order_type', oppositeType)
                    .eq('product', orderData.product)
                    .neq('user_id', session.user.id); // ไม่จับคู่กับตัวเอง

                // ตรวจสอบความเข้ากันได้ของราคา (Price Compatibility)
                if (orderData.order_type === 'Buy') {
                    // ถ้าเราซื้อ ต้องหาคนขายที่ตั้งราคาขาย "น้อยกว่าหรือเท่ากับ" ราคาที่เรายอมจ่าย
                    query = query.lte('price', orderData.price);
                } else {
                    // ถ้าเราขาย ต้องหาคนซื้อที่ตั้งราคารับซื้อ "มากกว่าหรือเท่ากับ" ราคาที่เราอยากขาย
                    query = query.gte('price', orderData.price);
                }

                const { data: matchCandidates, error: matchError } = await query.limit(1);

                if (matchError) throw matchError;

                if (matchCandidates && matchCandidates.length > 0) {
                    matchedOrder = matchCandidates[0];
                    isMatched = true;
                }

                let matchedUserName = 'คู่สัญญา (Partner)';
                let myName = 'ผู้ใช้ระบบ';

                // ดึงชื่อเราเอง
                if (session && session.user && session.user.user_metadata) {
                    const meta = session.user.user_metadata;
                    if (meta.firstname) myName = meta.firstname + ' ' + (meta.lastname || '');
                }

                if (isMatched) {
                    // ดึงชื่อคู่สัญญาจากที่ซ่อนไว้ใน PENDING
                    if (matchedOrder.matched_with_name && matchedOrder.matched_with_name.startsWith('CREATOR:')) {
                        matchedUserName = matchedOrder.matched_with_name.replace('CREATOR:', '');
                    }

                    orderData.status = 'Matched';
                    orderData.matched_with_name = matchedUserName + '|' + matchedOrder.id; // ชั่วคราว
                    
                    // [สำคัญมาก] การปรับยอด (Reconciliation) ให้ตรงกับคนที่ตั้งรอก่อน (Maker)
                    orderData.price = matchedOrder.price;
                    orderData.quantity = matchedOrder.quantity;
                    
                } else {
                    orderData.status = 'Pending';
                    orderData.matched_with_name = 'CREATOR:' + myName; // ซ่อนชื่อตัวเองไว้ให้คนอื่นมาหาเจอ
                }

                // พยายามบันทึกลงตาราง orders ใน Supabase (ใช้ .select() เพื่อดึง ID กลับมา)
                const { data, error } = await window.supabaseClient
                    .from('orders')
                    .insert([orderData])
                    .select();

                if (error) throw error;
                if (!data || data.length === 0) throw new Error("ไม่สามารถบันทึกข้อมูลได้ (Empty Data)");
                
                const newOrder = data[0];

                if (isMatched) {
                    // 1. อัปเดตออเดอร์ของคู่สัญญา (ฝั่งนู้น) ให้เป็น Matched และใส่ชื่อ/ID ของเราลงไป
                    const { error: updateError } = await window.supabaseClient
                        .from('orders')
                        .update({ 
                            status: 'Matched', 
                            matched_with_name: myName + '|' + newOrder.id
                        })
                        .eq('id', matchedOrder.id);
                    
                    if (updateError) console.warn("Failed to update matched order:", updateError);
                        
                    const sortedIds = [newOrder.id.substring(0, 8), matchedOrder.id.substring(0, 8)].sort();
                    const contractRef = `MATCH-${sortedIds[0]}-${sortedIds[1]}`.toUpperCase();
                    alert(` จับคู่สำเร็จทันที! (Immediate Match)\nระบบพบคำสั่งที่ตรงกันในตลาด สถานะของคุณคือ "Matched"\n\n รหัสสัญญาของคุณคือ: ${contractRef}`);
                } else {
                    alert(' บันทึกคำสั่งซื้อขายสำเร็จ!\nคำสั่งของคุณอยู่ในสถานะ "Pending" เพื่อรอการจับคู่');
                }
                
                // สลับไปแท็บรายการคำสั่งซื้อขายและโหลดข้อมูลใหม่ (ถ้ามี)
                document.querySelector('.order-tab[data-target="tab-list"]').click();
                
                // ล้างฟอร์ม
                if (document.getElementById('productSelect')) document.getElementById('productSelect').value = '';
                document.getElementById('quantity').value = '';
                document.getElementById('price').value = '';

            } catch (err) {
                console.error("Save order error:", err);
                
                // ถอด Demo Mode ออก และให้แสดง Error ตามจริง 100%
                alert('เกิดข้อผิดพลาดจากระบบหลังบ้าน (Database Error):\n' + (err.message || 'Unknown Error') + '\n\nข้อมูลยังไม่ถูกบันทึก');
            } finally {
                saveBtn.innerText = originalText;
                saveBtn.disabled = false;
            }
        });
    }

    // === โหลดข้อมูลรายการคำสั่งซื้อจริงจาก Supabase ===
    window.loadMyOrders = async function loadMyOrders() {
        const listContainer = document.getElementById('tab-list');
        if (!listContainer || !window.supabaseClient) return;
        
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) return;

        try {
            const { data: rawOrders, error } = await window.supabaseClient
                .from('orders')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            let orders = rawOrders || [];
            
            // --- Apply Filters ---
            const searchInput = document.getElementById('orderSearchInput');
            const statusFilter = document.getElementById('orderStatusFilter');
            const typeFilter = document.getElementById('orderTypeFilter');
            const timeFilter = document.getElementById('orderTimeFilter');
            
            if (searchInput && searchInput.value) {
                const term = searchInput.value.toLowerCase();
                orders = orders.filter(o => {
                    const product = (o.product_name || o.product || '').toLowerCase();
                    const idStr = (o.id || '').toString().toLowerCase();
                    return product.includes(term) || idStr.includes(term);
                });
            }
            
            if (statusFilter && statusFilter.value !== 'ทุกสถานะ') {
                const val = statusFilter.value;
                orders = orders.filter(o => {
                    const status = (o.status || 'ACTIVE').toUpperCase();
                    if (val === 'รอดำเนินการ' && (status === 'PENDING' || status === 'ACTIVE' || status === 'OPEN')) return true;
                    if (val === 'จับคู่แล้ว' && status === 'MATCHED') return true;
                    return false;
                });
            }
            
            if (typeFilter && typeFilter.value !== 'ทุกประเภท') {
                const val = typeFilter.value;
                orders = orders.filter(o => {
                    const isBuy = o.order_type === 'Buy';
                    if (val === 'Buy Order' && isBuy) return true;
                    if (val === 'Sell Order' && !isBuy) return true;
                    return false;
                });
            }
            
            if (timeFilter && timeFilter.value !== 'ทุกช่วงเวลา') {
                const val = timeFilter.value;
                const now = new Date();
                orders = orders.filter(o => {
                    if (!o.created_at) return true;
                    const orderDate = new Date(o.created_at);
                    if (val === 'สัปดาห์นี้') {
                        const diffTime = Math.abs(now - orderDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        return diffDays <= 7;
                    }
                    if (val === 'เดือนนี้') {
                        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                    }
                    return true;
                });
            }
            // --- End Filters ---

            const countSpan = document.getElementById('orders-count');
            if (countSpan) countSpan.innerText = `${orders.length}`;

            // ลบของเดิม
            const emptyState = listContainer.querySelector('div[style*="text-align: center; padding: 40px"]');
            if (emptyState) emptyState.remove();
            
            const emptyStateClass = listContainer.querySelector('.empty-state-message');
            if (emptyStateClass) emptyStateClass.remove();

            const oldList = listContainer.querySelectorAll('.order-card');
            oldList.forEach(el => el.remove());

            if (!orders || orders.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'empty-state-message';
                empty.style = 'text-align: center; padding: 40px; color: var(--text-muted);';
                empty.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 10px; opacity: 0.5;"></div>
                    <div>ยังไม่มีรายการคำสั่งซื้อขาย</div>
                `;
                listContainer.appendChild(empty);
                // ไม่ต้อง return เพื่อให้โค้ดทำงานต่อไปอัปเดต Tab 2 (สัญญา) ด้วย
            } else {
                // สร้างการ์ดออเดอร์
                orders.forEach((order, index) => {
                    const card = document.createElement('div');
                    card.className = 'order-card';
                
                const isBuy = order.order_type === 'Buy';
                const typeColor = isBuy ? '#10b981' : '#64748b'; 
                // ค่าเริ่มต้นถ้าไม่มี order_type ให้เป็น Sell Order
                const typeLabel = order.order_type ? (isBuy ? 'Buy Order' : 'Sell Order') : 'Sell Order'; 
                const statusStr = order.status ? order.status.toUpperCase() : 'ACTIVE';
                
                let statusColor = '#64748b';
                if (statusStr === 'PENDING') statusColor = '#f59e0b'; // ส้ม
                else if (statusStr === 'MATCHED') statusColor = '#10b981'; // เขียว
                else if (statusStr === 'ACTIVE') statusColor = '#3b82f6'; // ฟ้า
                
                const dateObj = new Date(order.created_at);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' });

                const qty = parseFloat(order.quantity) || 0;
                const price = parseFloat(order.price) || 0;
                const totalValue = (qty * price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                const shortId = order.id ? order.id.toString().substring(0,6).toUpperCase() : (orders.length - index);
                
                // แก้ไขให้รองรับทั้ง product_name และ product
                const productName = window.sanitizeHTML(order.product_name || order.product || 'ไม่ระบุชื่อสินค้า');
                const unit = order.unit || 'MT';
                
                // Fallbacks สำหรับข้อมูลรายละเอียด
                const contractType = order.contract_type || 'ระยะสั้น';
                const paymentTerm = order.payment_term || 'เงินสด / โอนเต็มจำนวน';
                const marketplace = order.marketplace || 'ตลาดท้องถิ่น';
                const provinceStr = order.province ? `, ${order.province}` : '';

                card.style = `
                    background: white; 
                    border-radius: 12px; 
                    border: 1px solid #e2e8f0; 
                    overflow: hidden; 
                    margin-bottom: 20px; 
                    transition: all 0.2s ease; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
                    position: relative;
                `;

                card.onmouseover = function() { this.style.boxShadow = '0 8px 25px rgba(15,23,42,0.08)'; this.style.transform = 'translateY(-2px)'; };
                card.onmouseout = function() { this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)'; this.style.transform = 'translateY(0)'; };

                card.innerHTML = `
                    <!-- Left color accent bar -->
                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: ${isBuy ? '#10b981' : '#3b82f6'}; border-radius: 12px 0 0 12px;"></div>
                    
                    <div style="padding: 24px 30px 20px 34px;">
                        <!-- Top Row -->
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                            <div style="display: flex; gap: 18px; align-items: center;">
                                <div style="width: 52px; height: 52px; border-radius: 14px; background: ${isBuy ? '#ecfdf5' : '#eff6ff'}; color: ${isBuy ? '#10b981' : '#3b82f6'}; display: flex; align-items: center; justify-content: center; border: 1px solid ${isBuy ? '#d1fae5' : '#dbeafe'}; flex-shrink: 0;">
                                    ${isBuy ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>` 
                                    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`}
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                        <span style="font-weight: 800; color: #0f172a; font-size: 1.15rem; line-height: 1.2;">${productName}</span>
                                        <span style="background: ${isBuy ? '#f0fdf4' : '#eff6ff'}; color: ${isBuy ? '#16a34a' : '#2563eb'}; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; border: 1px solid ${isBuy ? '#bbf7d0' : '#bfdbfe'};">${typeLabel}</span>
                                    </div>
                                    <div style="color: #64748b; font-size: 0.9rem; font-weight: 600;">
                                        ORDER #${shortId}
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 24px;">
                                <div style="text-align: right;">
                                    <div style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; letter-spacing: 0.5px;">Total Value</div>
                                    <div style="font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">฿${totalValue}</div>
                                </div>
                                <div style="width: 1px; height: 40px; background: #e2e8f0;"></div>
                                ${statusStr === 'PENDING' ? `<span style="background: #fffbeb; color: #f59e0b; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; border: 1px solid #fde68a;">${statusStr}</span>` 
                                : statusStr === 'MATCHED' || statusStr === 'COMPLETED' ? `<span style="background: #ecfdf5; color: #10b981; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; border: 1px solid #a7f3d0;">${statusStr}</span>`
                                : `<span style="background: #f1f5f9; color: #64748b; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; border: 1px solid #cbd5e1;">${statusStr}</span>`}
                            </div>
                        </div>

                        <hr style="border: none; border-top: 1px dashed #e2e8f0; margin: 20px 0;">

                        <!-- Details Row -->
                        <div style="display: flex; gap: 30px; margin-bottom: 10px;">
                            <div style="flex: 1;">
                                <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">ปริมาณ / ราคา</div>
                                <div style="font-weight: 700; color: #334155; font-size: 0.95rem;">${qty.toLocaleString()} ${unit} <span style="color: #10b981; margin-left: 8px;">฿${price.toLocaleString()}/${unit}</span></div>
                            </div>
                            <div style="width: 1px; background: #e2e8f0;"></div>
                            <div style="flex: 1;">
                                <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">เงื่อนไขสัญญา</div>
                                <div style="font-weight: 600; color: #334155; font-size: 0.95rem;">${order.contract_type || 'ระยะสั้น'} • ${order.payment_term || 'เงินสด'}</div>
                            </div>
                            <div style="width: 1px; background: #e2e8f0;"></div>
                            <div style="flex: 1.5;">
                                <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">สถานที่จัดส่ง</div>
                                <div style="font-weight: 600; color: #334155; font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    ${order.marketplace || 'ตลาดท้องถิ่น'}${order.province ? ', ' + order.province : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Action -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #f1f5f9;">
                            <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 6px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                สร้างเมื่อ: ${formattedDate}
                            </div>
                            <button class="view-details-btn" data-index="${index}" style="background: white; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 24px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.02); display: flex; align-items: center; gap: 6px;" onmouseover="this.style.background='#f8fafc'; this.style.borderColor='#cbd5e1'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.04)';" onmouseout="this.style.background='white'; this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.02)';">
                                ดูรายละเอียดเอกสาร <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </div>
                `;
                listContainer.appendChild(card);
            });

            // เพิ่ม Event Listener ให้ปุ่ม ดูรายละเอียด ของ Tab 1
            document.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-index');
                    showOrderModal(orders[idx], idx);
                });
            });
        } // ปิด else block ที่ครอบส่วนการ์ดออเดอร์

        // ==========================================
            // ส่วนที่ 2: เรนเดอร์รายการสัญญา (Contracts Tab)
            // ==========================================
            const contractsContainer = document.querySelector('.contracts-list');
            if (contractsContainer) {
                contractsContainer.innerHTML = ''; // ลบ Mockup เก่าทิ้ง
                
                // กรองเอาเฉพาะออเดอร์ที่จับคู่แล้ว หรือสถานะไม่ใช่ Pending
                const contracts = orders.filter(o => o.status && o.status.toLowerCase() !== 'pending');
                
                // อัปเดตตัวเลขจำนวนสัญญา
                const contractCountSpan = document.querySelector('#tab-contract span[style*="color: var(--text-muted)"]');
                if (contractCountSpan) contractCountSpan.innerText = `${contracts.length} contracts`;

                if (contracts.length === 0) {
                    contractsContainer.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b; grid-column: 1/-1;">ยังไม่มีสัญญาที่จับคู่สำเร็จ</div>';
                } else {
                    contracts.forEach((order, index) => {
                        const isBuy = order.order_type === 'Buy';
                        const statusStr = order.status ? order.status : 'Matched';
                        
                        // กำหนดสีและป้ายตามสถานะ
                        let statusBadge = '';
                        let invoiceBtn = '';
                        
                        if (statusStr.toLowerCase() === 'matched') {
                            statusBadge = `<span style="background-color: #ecfdf5; color: #10b981; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Matched (จับคู่สำเร็จ)</span>`;
                            invoiceBtn = `<button onclick="window.location.href='invoices.html'" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem; width: 100%;">ชำระเงิน / ดูใบแจ้งหนี้</button>`;
                        } else {
                            statusBadge = `<span style="background-color: #fffbeb; color: #f59e0b; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${statusStr}</span>`;
                            invoiceBtn = `<button class="btn" style="padding: 8px 16px; font-size: 0.9rem; width: 100%; background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; cursor: not-allowed;">รอใบแจ้งหนี้</button>`;
                        }

                        const shortId = window.sanitizeHTML(order.id ? order.id.toString().substring(0,8).toUpperCase() : `CT-2026-00${index+1}`);
                        const productName = window.sanitizeHTML(order.product_name || order.product || 'ไม่ระบุชื่อสินค้า');
                        const qty = parseFloat(order.quantity) || 0;
                        const price = parseFloat(order.price) || 0;
                        const unit = order.unit || 'MT';

                        const contractCard = document.createElement('div');
                        contractCard.className = 'contract-card';
                        contractCard.style = `background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;`;
                        
                        contractCard.innerHTML = `
                            <div class="contract-info">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    ${statusBadge}
                                    <span style="color: #64748b; font-size: 0.9rem; font-weight: 600;">Ref: ${shortId}</span>
                                </div>
                                <h3 style="margin-bottom: 5px; font-size: 1.2rem; color: #1e293b;">${productName}</h3>
                                <div style="display: flex; gap: 20px; font-size: 0.95rem; margin-bottom: 10px; color: #475569;">
                                    <div>ปริมาณ: <strong style="color:#0f172a;">${qty.toLocaleString()} ${unit}</strong></div>
                                    <div>ราคา: <strong style="color:#0f172a;">${price.toLocaleString()} THB/${unit}</strong></div>
                                </div>
                                <div style="background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                                    <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 4px;">มูลค่ารวมทั้งหมด (Total Value)</div>
                                    <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">฿${(qty * price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.85rem; color: #475569;">
                                        <div><strong> การชำระเงิน:</strong> L/C at sight</div>
                                        <div><strong> การจัดส่ง:</strong> FOB แหลมฉบัง</div>
                                        <div style="grid-column: 1/-1;"><strong> คู่สัญญา:</strong> ${order.matched_with_name ? `<span style="color: #10b981; font-weight: 600;">${order.matched_with_name}</span>` : 'ปกปิดข้อมูลเพื่อความปลอดภัย (Blind Trade)'}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="contract-actions" style="text-align: right; min-width: 200px;">
                                <button onclick="localStorage.setItem('currentContractId', '${order.id}'); window.location.href='contract.html';" class="btn btn-outline" style="padding: 10px 16px; font-size: 0.9rem; margin-bottom: 10px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                    <span style="font-size: 1.1rem;"></span> ดูสัญญาฉบับเต็ม (PDF)
                                </button>
                                ${invoiceBtn}
                            </div>
                        `;
                        contractsContainer.appendChild(contractCard);
                    });
                }
            }

        } catch (err) {
            console.error("Load orders error:", err);
        }
    }

    // ฟังก์ชันสำหรับเปิดหน้าต่างรายละเอียด (Modal)
    function showOrderModal(order, index) {
        // ลบ Modal เก่าทิ้งถ้ามี
        const oldModal = document.getElementById('order-detail-modal');
        if (oldModal) oldModal.remove();

        const isBuy = order.order_type === 'Buy';
        const typeColor = isBuy ? '#10b981' : '#64748b';
        const typeLabel = isBuy ? 'เสนอซื้อ (BUY ORDER)' : 'เสนอขาย (SELL ORDER)';
        const statusStr = order.status ? order.status.toUpperCase() : 'ACTIVE';
        
        let statusColor = '#64748b';
        if (statusStr === 'PENDING') statusColor = '#f59e0b';
        else if (statusStr === 'MATCHED') statusColor = '#10b981';
        else if (statusStr === 'ACTIVE') statusColor = '#3b82f6';
        
        const dateObj = new Date(order.created_at);
        const formattedDate = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

        const qty = parseFloat(order.quantity) || 0;
        const price = parseFloat(order.price) || 0;

        const modalHtml = `
            <div id="order-detail-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; backdrop-filter: blur(4px);">
                <div style="background: white; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; border-radius: 16px; padding: 32px; position: relative; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                    <button id="close-modal-btn" style="position: absolute; top: 20px; right: 24px; background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #94a3b8; transition: color 0.2s;" onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#94a3b8'">&times;</button>
                    
                    <h2 style="font-size: 1.8rem; color: #0f172a; margin-bottom: 12px; font-weight: 800; padding-right: 30px;">${order.product || '-'}</h2>
                    
                    <div style="display: flex; gap: 12px; margin-bottom: 32px; align-items: center;">
                        <span style="background-color: ${typeColor}15; color: ${typeColor}; padding: 6px 14px; border-radius: 6px; font-size: 0.85rem; font-weight: 700;">${typeLabel}</span>
                        <span style="color: #64748b; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center;">สถานะ: <span style="color: ${statusColor}; margin-left: 6px;">${statusStr}</span></span>
                    </div>

                    <!-- Section 1: ข้อมูลสินค้า -->
                    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #f1f5f9;">
                        <div style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;"> ข้อมูลสินค้า (Product Information)</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">ปริมาณ (Quantity)</div>
                                <div style="font-size: 1.2rem; font-weight: 800; color: #10b981;">${qty.toLocaleString()} ${order.unit || 'MT'}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">มาตรฐานคุณภาพ (Quality)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${order.quality || '-'}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">การบรรจุ (Packing)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${order.packing || '-'}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">ประเภทสัญญา (Contract Type)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a; text-transform: uppercase;">${order.contract_type || '-'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: การจัดส่งและสถานที่ -->
                    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #f1f5f9;">
                        <div style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;"> การจัดส่งและสถานที่ (Delivery & Location)</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">เงื่อนไขการจัดส่ง (Marketplace)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${order.marketplace || '-'}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">ประเทศ (Country)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">ไทย (Thailand)</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">จังหวัด (Province)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${order.province || '-'}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">อำเภอ/เขต (District)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${order.amphoe || '-'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: ระยะเวลาและการชำระเงิน -->
                    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #f1f5f9;">
                        <div style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;"> ระยะเวลาและการชำระเงิน (Timeline & Payment)</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">วันที่สร้างคำสั่ง (Created Date)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${formattedDate}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">ราคาเป้าหมาย (Target Price)</div>
                                <div style="font-size: 1.05rem; font-weight: 800; color: #10b981;">฿${price.toLocaleString()}</div>
                            </div>
                            <div style="grid-column: span 2;">
                                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px; font-weight: 600;">เงื่อนไขการชำระเงิน (Payment Terms)</div>
                                <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${order.payment_term || '-'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Event สำหรับปิด Modal
        const newModal = document.getElementById('order-detail-modal');
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            newModal.remove();
        });
        
        // คลิกพื้นที่ว่างข้างนอกให้ปิดด้วย
        newModal.addEventListener('click', (e) => {
            if (e.target === newModal) {
                newModal.remove();
            }
        });
    }

    // ผูก Event ให้โหลดข้อมูลทุกครั้งที่สลับมาหน้า tab-list และ tab-contract
    const listTabBtn = document.querySelector('.order-tab[data-target="tab-list"]');
    if (listTabBtn) {
        listTabBtn.addEventListener('click', loadMyOrders);
    }
    const contractTabBtn = document.querySelector('.order-tab[data-target="tab-contract"]');
    if (contractTabBtn) {
        contractTabBtn.addEventListener('click', loadMyOrders);
    }
    
    // ระบบค้นหาในแท็บสัญญา (Mockup Filter)
    const contractSearchInput = document.getElementById('contractSearchInput');
    if (contractSearchInput) {
        contractSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const contractCards = document.querySelectorAll('#tab-contract .contract-card');
            
            contractCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // โหลดครั้งแรกตอนเปิดหน้าเว็บ (ถ้าจำเป็น)
    loadMyOrders();

    window.mockMatchOrder = async function(orderId) {
        if(!confirm('ยืนยันจำลองการจับคู่ออเดอร์นี้? (ระบบจะเปลี่ยนสถานะเป็น Matched)')) return;
        
        try {
            const { error } = await window.supabaseClient
                .from('orders')
                .update({ status: 'Matched' })
                .eq('id', orderId);
                
            if (error) throw error;
            
            alert('จำลองการจับคู่สำเร็จ! สถานะเป็น Matched แล้ว (คุณสามารถดูเอกสารได้ในแท็บสัญญา และแท็บใบแจ้งหนี้)');
            loadMyOrders();
        } catch(e) {
            console.error(e);
            alert('เกิดข้อผิดพลาด: ' + e.message);
        }
    };

});
