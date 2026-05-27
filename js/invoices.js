document.addEventListener('DOMContentLoaded', async () => {
    const invoiceListContainer = document.getElementById('invoice-list-container');
    const statCount = document.getElementById('stat-invoice-count');
    const statPending = document.getElementById('stat-pending-amount');
    const statPaid = document.getElementById('stat-paid-amount');
    const filterStatus = document.getElementById('filter-status');

    let allInvoices = [];

    async function loadInvoices() {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }

        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        try {
            // ดึงออเดอร์ของตัวเองทั้งหมด แล้วค่อยกรองสถานะใน JS เพื่อเลี่ยงปัญหาตัวพิมพ์เล็ก-ใหญ่
            const { data: orders, error } = await window.supabaseClient
                .from('orders')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
        // Setup User Metadata in Window for easy access
        window.currentUserMetadata = session.user.user_metadata || {};
        let cName = "ไม่ระบุชื่อ";
        if (window.currentUserMetadata.firstname && window.currentUserMetadata.lastname) {
            cName = window.currentUserMetadata.firstname + " " + window.currentUserMetadata.lastname;
        } else if (window.currentUserMetadata.firstname) {
            cName = window.currentUserMetadata.firstname;
        }
        window.currentUserName = cName;

        // ดึงชื่อคนอื่นจากฐานข้อมูลมาจำลองเป็นคู่สัญญา
        window.mockPartnerName = 'สมชาย ดีเลิศ'; // Fallback เริ่มต้นเป็นผู้ใช้คนที่ 2 ในระบบ
        if (cName.includes('สมชาย')) {
            window.mockPartnerName = 'สมศรี นามี'; // สลับ Fallback ถ้าผู้ใช้ล็อกอินด้วยชื่อสมชาย
        } else if (cName.includes('สมศรี')) {
            window.mockPartnerName = 'สมชาย ดีเลิศ';
        }
        
        try {
            let { data: usersList, error: err } = await window.supabaseClient.from('users').select('firstname, lastname').limit(5);
            if (err || !usersList) {
                const res = await window.supabaseClient.from('profiles').select('firstname, lastname').limit(5);
                usersList = res.data;
            }
            if (usersList && usersList.length > 0) {
                const otherUser = usersList.find(u => (u.firstname + " " + (u.lastname || '')) !== cName);
                if (otherUser) {
                    window.mockPartnerName = otherUser.firstname + ' ' + (otherUser.lastname || '');
                }
            }
        } catch(e) { console.log(e); }

        // ดึงรายการคำสั่งซื้อขายทั้งหมดของผู้ใช้ปัจจุบัน matched หรือ completed (ไม่สนตัวพิมพ์เล็กใหญ่)
            const matchedOrCompleted = (orders || []).filter(o => {
                const s = (o.status || '').toLowerCase();
                return s === 'matched' || s === 'completed';
            });

            allInvoices = matchedOrCompleted;
            renderInvoices();
            updateStats();
        } catch (err) {
            console.error("Error loading invoices:", err);
            invoiceListContainer.innerHTML = `<div style="text-align:center; padding: 40px; color: #ef4444;">เกิดข้อผิดพลาดในการโหลดใบแจ้งหนี้</div>`;
        }
    }

    function renderInvoices() {
        const filterVal = filterStatus ? filterStatus.value : 'all';
        invoiceListContainer.innerHTML = '';

        const filteredInvoices = allInvoices.filter(inv => {
            const isPaid = inv.status === 'completed';
            if (filterVal === 'pending' && isPaid) return false;
            if (filterVal === 'paid' && !isPaid) return false;
            return true;
        });

        if (filteredInvoices.length === 0) {
            invoiceListContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; color: #94a3b8;">
                    ไม่มีข้อมูลใบแจ้งหนี้
                </div>`;
            return;
        }

        filteredInvoices.forEach(inv => {
            const qty = parseFloat(inv.quantity) || 0;
            const price = parseFloat(inv.price) || 0;
            const subtotal = qty * price;
            const fee = subtotal * 0.01; // ค่าธรรมเนียมแพลตฟอร์ม 1%
            const vat = (subtotal + fee) * 0.07; // VAT 7%
            const grandTotal = subtotal + fee + vat;

            const isPaid = inv.status === 'completed';
            const isCurrentUserBuyer = (inv.order_type || '').toLowerCase() === 'buy';
            const statusBadge = isPaid 
                ? `<span style="background-color: #dcfce7; color: #16a34a; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">✅ ชำระเงินแล้ว (PAID)</span>`
                : `<span style="background-color: #fffbeb; color: #f59e0b; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">⏳ รอการชำระเงิน (PENDING)</span>`;

            // Safe date parsing
            let dateStr = '-';
            let dueDateStr = '-';
            if (inv.created_at) {
                try {
                    const createdDate = new Date(inv.created_at);
                    if (!isNaN(createdDate.getTime())) {
                        dateStr = createdDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
                        const dueDate = new Date(createdDate.getTime());
                        dueDate.setDate(dueDate.getDate() + 30);
                        dueDateStr = dueDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
                    }
                } catch(e) {}
            }

            // Safe ID parsing
            const displayId = (inv.id || 'UNKNOWN').toString().substring(0,8).toUpperCase();
            
            // Override legacy partner name
            const dbPartnerName = (!inv.matched_with_name || inv.matched_with_name.includes('ชวัลวิชญ์')) ? window.mockPartnerName : inv.matched_with_name;

            const invoiceHtml = `
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                <!-- Left: Invoice Document -->
                <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 40px; border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, #10b981, #3b82f6);"></div>
                    
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; margin-bottom: 40px; align-items: flex-start;">
                        <div>
                            <div style="font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 5px;">INVOICE</div>
                            <div style="color: #64748b; font-size: 0.95rem;">INV-${displayId}</div>
                        </div>
                        <div style="text-align: right;">
                            ${statusBadge}
                            <div style="margin-top: 10px; font-size: 0.9rem; color: #64748b;">
                                วันที่ออก: <strong>${dateStr}</strong><br>
                                วันครบกำหนด: <strong>${dueDateStr}</strong>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Addresses -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
                        <div>
                            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">ผู้ขาย (Seller / Billed From)</div>
                            <h4 style="font-size: 1.1rem; color: #0f172a; margin-bottom: 5px;">${(inv.order_type || '').toLowerCase() === 'sell' ? window.currentUserName : dbPartnerName}</h4>
                            <p style="color: #475569; font-size: 0.9rem; line-height: 1.6;">
                                ${(inv.order_type || '').toLowerCase() === 'sell' ? (window.currentUserMetadata.address || 'ที่อยู่ตามระบบ') : 'ที่อยู่ตามระบบ'}<br>
                                ${(inv.order_type || '').toLowerCase() === 'sell' ? (window.currentUserMetadata.taxId ? 'เลขประจำตัวผู้เสียภาษี: ' + window.currentUserMetadata.taxId : '') : ''}
                            </p>
                        </div>
                        <div>
                            <div style="font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">ผู้ซื้อ (Buyer / Billed To)</div>
                            <h4 style="font-size: 1.1rem; color: #0f172a; margin-bottom: 5px;">${(inv.order_type || '').toLowerCase() === 'buy' ? window.currentUserName : dbPartnerName}</h4>
                            <p style="color: #475569; font-size: 0.9rem; line-height: 1.6;">
                                ${(inv.order_type || '').toLowerCase() === 'buy' ? (window.currentUserMetadata.address || 'ที่อยู่ตามระบบ') : 'ที่อยู่ตามระบบ'}<br>
                                ${(inv.order_type || '').toLowerCase() === 'buy' ? (window.currentUserMetadata.taxId ? 'เลขประจำตัวผู้เสียภาษี: ' + window.currentUserMetadata.taxId : '') : ''}
                            </p>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <div style="margin-bottom: 30px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 2px solid #e2e8f0;">
                                    <th style="text-align: left; padding: 12px 0; color: #64748b; font-size: 0.85rem;">รายการสินค้า</th>
                                    <th style="text-align: right; padding: 12px 0; color: #64748b; font-size: 0.85rem;">ปริมาณ</th>
                                    <th style="text-align: right; padding: 12px 0; color: #64748b; font-size: 0.85rem;">ราคา/หน่วย</th>
                                    <th style="text-align: right; padding: 12px 0; color: #64748b; font-size: 0.85rem;">จำนวนเงิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 16px 0;">
                                        <div style="font-weight: 600; color: #0f172a; font-size: 1.05rem;">${inv.product_name || inv.product || 'สินค้าย่อยอื่นๆ'}</div>
                                    </td>
                                    <td style="text-align: right; padding: 16px 0; color: #334155;">${qty.toLocaleString()} MT</td>
                                    <td style="text-align: right; padding: 16px 0; color: #334155;">฿${price.toLocaleString()}</td>
                                    <td style="text-align: right; padding: 16px 0; font-weight: 600; color: #0f172a;">฿${subtotal.toLocaleString()}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                    <td style="padding: 16px 0;">
                                        <div style="font-weight: 600; color: #0f172a; font-size: 1.05rem;">ค่าบริการแพลตฟอร์ม (Platform Fee 1%)</div>
                                    </td>
                                    <td style="text-align: right; padding: 16px 0; color: #334155;">-</td>
                                    <td style="text-align: right; padding: 16px 0; color: #334155;">-</td>
                                    <td style="text-align: right; padding: 16px 0; font-weight: 600; color: #0f172a;">฿${fee.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Totals -->
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
                        <div style="width: 300px;">
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #64748b; font-size: 0.95rem;">
                                <span>รวมเป็นเงิน (Subtotal)</span>
                                <span>฿${(subtotal + fee).toLocaleString()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #64748b; font-size: 0.95rem; border-bottom: 1px solid #e2e8f0;">
                                <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
                                <span>฿${vat.toLocaleString()}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 16px 0; color: #0f172a; font-size: 1.2rem; font-weight: 800;">
                                <span>ยอดสุทธิ (Grand Total)</span>
                                <span style="color: #10b981;">฿${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Action Panel -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${isCurrentUserBuyer ? (
                        !isPaid ? `
                        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0;">
                            <h3 style="font-size: 1.1rem; color: #0f172a; margin-bottom: 20px; font-weight: 700;">💳 ช่องทางการชำระเงิน</h3>
                            <button onclick="payInvoice('${inv.id}')" class="btn" style="width: 100%; padding: 14px; background-color: #10b981; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                                แจ้งชำระเงิน
                            </button>
                        </div>` : `
                        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 10px;">✅</div>
                            <h3 style="font-size: 1.1rem; color: #16a34a; font-weight: 700;">คุณชำระเงินเรียบร้อยแล้ว</h3>
                            <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">รอผู้ขายจัดส่งสินค้า</p>
                        </div>`
                    ) : (
                        !isPaid ? `
                        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 10px;">⏳</div>
                            <h3 style="font-size: 1.1rem; color: #f59e0b; font-weight: 700;">รอผู้ซื้อชำระเงิน</h3>
                            <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">ระบบจะแจ้งเตือนเมื่อผู้ซื้อโอนเงินเข้า Escrow</p>
                            <!-- ปุ่มจำลองให้ฝั่งผู้ขายกดแทนผู้ซื้อเพื่อทดสอบ Prototype -->
                            <button onclick="payInvoice('${inv.id}')" class="btn btn-outline" style="width: 100%; padding: 8px; margin-top: 15px; font-size: 0.8rem; color: #94a3b8; border-color: #e2e8f0;">
                                (Mockup) จำลองผู้ซื้อจ่ายเงิน
                            </button>
                        </div>` : `
                        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 10px;">✅</div>
                            <h3 style="font-size: 1.1rem; color: #16a34a; font-weight: 700;">ผู้ซื้อชำระเงินแล้ว</h3>
                            <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">เงินอยู่ในระบบ Escrow เรียบร้อยแล้ว<br>กรุณาเตรียมจัดส่งสินค้า</p>
                        </div>`
                    )}
                    
                    <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0;">
                        <h3 style="font-size: 1.1rem; color: #0f172a; margin-bottom: 15px; font-weight: 700;">📑 สัญญาอ้างอิง</h3>
                        <a href="javascript:void(0)" onclick="localStorage.setItem('currentContractId', '${inv.id}'); window.location.href='contract.html';" style="font-weight: 600; color: #3b82f6; text-decoration: none;">ดูสัญญาฉบับเต็ม</a>
                    </div>
                </div>
            </div>
            `;
            invoiceListContainer.insertAdjacentHTML('beforeend', invoiceHtml);
        });
    }

    function updateStats() {
        let count = allInvoices.length;
        let pendingAmt = 0;
        let paidAmt = 0;

        allInvoices.forEach(inv => {
            const qty = parseFloat(inv.quantity) || 0;
            const price = parseFloat(inv.price) || 0;
            const subtotal = qty * price;
            const fee = subtotal * 0.01; 
            const vat = (subtotal + fee) * 0.07; 
            const grandTotal = subtotal + fee + vat;

            if (inv.status === 'completed') {
                paidAmt += grandTotal;
            } else {
                pendingAmt += grandTotal;
            }
        });

        if (statCount) statCount.innerText = count.toLocaleString();
        if (statPending) statPending.innerText = '฿' + pendingAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (statPaid) statPaid.innerText = '฿' + paidAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', renderInvoices);
    }

    // ฟังก์ชันชำระเงินจำลอง
    window.payInvoice = async function(id) {
        if (!confirm('ยืนยันการทำรายการชำระเงินจำลอง?')) return;
        
        try {
            // 1. ลองอัปเดตในฐานข้อมูล (อาจโดน RLS บล็อกในบางกรณี)
            await window.supabaseClient
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', id);

            // 2. อัปเดต UI ทันที (เพื่อให้เห็นผลใน Prototype)
            alert('ชำระเงินสำเร็จ! สถานะออเดอร์ถูกอัปเดตเป็น COMPLETED แล้ว');
            
            const index = allInvoices.findIndex(o => o.id == id);
            if (index !== -1) {
                allInvoices[index].status = 'completed';
            }
            
            // ถ้า Filter อยู่ที่ Pending ให้แสดงหน้าต่างว่างๆ ถ้าไม่มีแล้ว
            // แต่เพื่อ UX ที่ดี เราจะเปลี่ยน Filter กลับไปเป็น All (ทั้งหมด) ให้ดู
            if (filterStatus) filterStatus.value = 'all';
            
            renderInvoices();
            updateStats();
            
        } catch (err) {
            console.error("Error paying:", err);
            alert("เกิดข้อผิดพลาดในการชำระเงิน");
        }
    };

    loadInvoices();
});
