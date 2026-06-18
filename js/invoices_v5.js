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
        if (!document.getElementById('premium-invoice-styles')) {
            document.head.insertAdjacentHTML('beforeend', `
                <style id="premium-invoice-styles">
                    @keyframes slideUpFade {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .invoice-accordion[open] {
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
                        border-color: #cbd5e1 !important;
                    }
                    .invoice-accordion summary::-webkit-details-marker {
                        display: none;
                    }
                </style>
            `);
        }
        
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
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; background: white; border-radius: 20px; border: 1px dashed #cbd5e1; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                    <div style="width: 80px; height: 80px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #94a3b8; font-size: 2.5rem;">
                        <i class="ph ph-receipt"></i>
                    </div>
                    <h3 style="font-size: 1.2rem; color: #0f172a; margin-bottom: 8px;">ไม่มีข้อมูลใบแจ้งหนี้</h3>
                    <p style="color: #64748b; font-size: 0.95rem; max-width: 400px; margin: 0 auto;">ไม่พบรายการใบแจ้งหนี้ในสถานะนี้</p>
                </div>`;
            return;
        }

        filteredInvoices.forEach((inv, index) => {
            const qty = parseFloat(inv.quantity) || 0;
            const price = parseFloat(inv.price) || 0;
            const subtotal = qty * price;
            const fee = subtotal * 0.01; // ค่าธรรมเนียมแพลตฟอร์ม 1%
            const vat = (subtotal + fee) * 0.07; // VAT 7%
            const grandTotal = subtotal + fee + vat;

            const isPaid = inv.status === 'completed';
            const isCurrentUserBuyer = (inv.order_type || '').toLowerCase() === 'buy';
            const statusBadge = isPaid 
                ? `<span style="background: rgba(16, 185, 129, 0.1); color: #059669; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);"><i class="ph-fill ph-check-circle" style="vertical-align: middle; margin-top:-2px; margin-right: 4px; font-size: 1.1em;"></i> ชำระเงินแล้ว (PAID)</span>`
                : `<span style="background: rgba(239, 68, 68, 0.1); color: #dc2626; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(239, 68, 68, 0.2); box-shadow: 0 0 10px rgba(239, 68, 68, 0.1);"><i class="ph-fill ph-hourglass-high" style="vertical-align: middle; margin-top:-2px; margin-right: 4px; font-size: 1.1em;"></i> รอการชำระเงิน (PENDING)</span>`;

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
            
            // Parse real partner name and remove the ID after '|'
            let dbPartnerName = inv.matched_with_name || '';
            if (dbPartnerName.includes('|')) {
                dbPartnerName = dbPartnerName.split('|')[0];
            } else if (dbPartnerName.startsWith('CREATOR:')) {
                dbPartnerName = 'ไม่ระบุชื่อคู่สัญญา';
            }
            if (!dbPartnerName) {
                dbPartnerName = 'ไม่ระบุชื่อคู่สัญญา';
            } else if (dbPartnerName.trim() === 'สมศรี') {
                dbPartnerName = 'สมศรี นามี';
            } else if (dbPartnerName.trim() === 'ปนัดดา') {
                dbPartnerName = 'ปนัดดา คุ้มทรัพย์';
            } else if (dbPartnerName.trim() === 'สมชาย') {
                dbPartnerName = 'สมชาย ใจดี';
            }

            const invoiceHtml = `
            <details class="invoice-accordion" style="background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(226, 232, 240, 0.8); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 12px; animation: slideUpFade 0.5s ease backwards; animation-delay: ${index * 0.08}s;">
                <summary style="padding: 24px 30px; cursor: pointer; list-style: none; outline: none; background: transparent; display: grid; grid-template-columns: 2.5fr 1fr 1.5fr 1.5fr 40px; align-items: center; gap: 20px;" onmouseover="this.style.background='rgba(255,255,255,0.9)'" onmouseout="this.style.background='transparent'">
                    
                    <!-- Col 1: ID & Partner -->
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, ${isPaid ? '#d1fae5, #a7f3d0' : '#fee2e2, #fecaca'}); color: ${isPaid ? '#059669' : '#dc2626'}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 4px 10px ${isPaid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};">
                            ${isPaid ? '<i class="ph-fill ph-check-circle"></i>' : '<i class="ph-fill ph-hourglass-high"></i>'}
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                                <span style="font-weight: 700; color: #0f172a; font-size: 1.15rem;">INV-${displayId}</span>
                                <span style="background: ${isCurrentUserBuyer ? '#f0fdf4' : '#eff6ff'}; color: ${isCurrentUserBuyer ? '#16a34a' : '#2563eb'}; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">${isCurrentUserBuyer ? 'BUYER' : 'SELLER'}</span>
                            </div>
                            <div style="color: #64748b; font-size: 0.95rem;">
                                คู่สัญญา: <span style="color: #334155; font-weight: 500;">${dbPartnerName}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Col 2: Date -->
                    <div>
                        <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 4px;">วันที่ออกเอกสาร</div>
                        <div style="color: #334155; font-size: 1.05rem; font-weight: 500;">${dateStr}</div>
                    </div>

                    <!-- Col 3: Amount -->
                    <div>
                        <div style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 4px;">ยอดสุทธิ</div>
                        <div style="color: #0f172a; font-size: 1.2rem; font-weight: 700;">฿${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    </div>

                    <!-- Col 4: Status -->
                    <div style="display: flex; justify-content: flex-end;">
                        ${statusBadge}
                    </div>

                    <!-- Col 5: Arrow -->
                    <div style="display: flex; justify-content: flex-end; color: #94a3b8; font-size: 1rem;">
                        ▼
                    </div>
                </summary>
                
                <div style="padding: 30px; border-top: 1px dashed #cbd5e1; background: rgba(248, 250, 252, 0.5);">
                    <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start;">
                        <!-- Left: Invoice Document -->
                        <div style="flex: 2 1 450px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); padding: 40px; border: 1px solid #e2e8f0; position: relative; box-sizing: border-box;">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6); border-top-left-radius: 16px; border-top-right-radius: 16px;"></div>
                            
                            <!-- Header -->
                            <div style="display: flex; justify-content: space-between; margin-bottom: 40px; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
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
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;">
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
                            <div style="margin-bottom: 40px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr style="border-bottom: 2px solid #cbd5e1;">
                                            <th style="text-align: left; padding: 16px 10px; color: #475569; font-size: 0.95rem; width: 40%;">รายการสินค้า</th>
                                            <th style="text-align: right; padding: 16px 10px; color: #475569; font-size: 0.95rem; width: 20%;">ปริมาณ</th>
                                            <th style="text-align: right; padding: 16px 10px; color: #475569; font-size: 0.95rem; width: 20%;">ราคา/หน่วย</th>
                                            <th style="text-align: right; padding: 16px 10px; color: #475569; font-size: 0.95rem; width: 20%;">จำนวนเงิน</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="border-bottom: 1px solid #e2e8f0;">
                                            <td style="padding: 24px 10px;">
                                                <div style="font-weight: 700; color: #0f172a; font-size: 1.2rem; word-break: break-word;">${inv.product_name || inv.product || 'สินค้าย่อยอื่นๆ'}</div>
                                            </td>
                                            <td style="text-align: right; padding: 24px 10px; color: #334155; font-size: 1.1rem; white-space: nowrap;">${qty.toLocaleString()} MT</td>
                                            <td style="text-align: right; padding: 24px 10px; color: #334155; font-size: 1.1rem; white-space: nowrap;">฿${price.toLocaleString()}</td>
                                            <td style="text-align: right; padding: 24px 10px; font-weight: 700; color: #0f172a; font-size: 1.15rem; white-space: nowrap;">฿${subtotal.toLocaleString()}</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #e2e8f0;">
                                            <td style="padding: 24px 10px;">
                                                <div style="font-weight: 600; color: #334155; font-size: 1.1rem; word-break: break-word;">ค่าบริการแพลตฟอร์ม (Platform Fee 1%)</div>
                                            </td>
                                            <td style="text-align: right; padding: 24px 10px; color: #64748b; font-size: 1.1rem;">-</td>
                                            <td style="text-align: right; padding: 24px 10px; color: #64748b; font-size: 1.1rem;">-</td>
                                            <td style="text-align: right; padding: 24px 10px; font-weight: 700; color: #0f172a; font-size: 1.15rem; white-space: nowrap;">฿${fee.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Totals -->
                            <div style="display: flex; justify-content: flex-end; margin-bottom: 40px; flex-wrap: wrap;">
                                <div style="width: 100%; max-width: 350px;">
                                    <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #475569; font-size: 1.1rem;">
                                        <span>รวมเป็นเงิน (Subtotal)</span>
                                        <span style="font-weight: 600;">฿${(subtotal + fee).toLocaleString()}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #475569; font-size: 1.1rem; border-bottom: 2px solid #e2e8f0;">
                                        <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
                                        <span style="font-weight: 600;">฿${vat.toLocaleString()}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 24px 0; color: #0f172a; font-size: 1.4rem; font-weight: 800;">
                                        <span>ยอดสุทธิ (Grand Total)</span>
                                        <span style="color: #10b981;">฿${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Action Panel -->
                        <div style="flex: 1 1 250px; display: flex; flex-direction: column; gap: 20px;">
                            ${isCurrentUserBuyer ? (
                                !isPaid ? `
                                <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0;">
                                    <h3 style="font-size: 1.1rem; color: #0f172a; margin-bottom: 20px; font-weight: 700;"> ช่องทางการชำระเงิน</h3>
                                    <button onclick="payInvoice('${inv.id}')" class="btn" style="width: 100%; padding: 14px; background-color: #10b981; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                                        แจ้งชำระเงิน
                                    </button>
                                </div>` : `
                                <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
                                    <div style="font-size: 3rem; margin-bottom: 10px;"></div>
                                    <h3 style="font-size: 1.1rem; color: #16a34a; font-weight: 700;">คุณชำระเงินเรียบร้อยแล้ว</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">รอผู้ขายจัดส่งสินค้า</p>
                                </div>`
                            ) : (
                                !isPaid ? `
                                <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
                                    <div style="font-size: 3.5rem; margin-bottom: 10px; color: #ef4444;"><i class="ph-fill ph-hourglass-high"></i></div>
                                    <h3 style="font-size: 1.1rem; color: #ef4444; font-weight: 700;">รอผู้ซื้อชำระเงิน</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">ระบบจะแจ้งเตือนเมื่อผู้ซื้อโอนเงินเข้า Escrow</p>
                                    <!-- ปุ่มจำลองให้ฝั่งผู้ขายกดแทนผู้ซื้อเพื่อทดสอบ Prototype -->
                                    <button onclick="payInvoice('${inv.id}')" class="btn btn-outline" style="width: 100%; padding: 8px; margin-top: 15px; font-size: 0.8rem; color: #94a3b8; border-color: #e2e8f0;">
                                        (Mockup) จำลองผู้ซื้อจ่ายเงิน
                                    </button>
                                </div>` : `
                                <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0; text-align: center;">
                                    <div style="font-size: 3rem; margin-bottom: 10px;"></div>
                                    <h3 style="font-size: 1.1rem; color: #16a34a; font-weight: 700;">ผู้ซื้อชำระเงินแล้ว</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">เงินอยู่ในระบบ Escrow เรียบร้อยแล้ว<br>กรุณาเตรียมจัดส่งสินค้า</p>
                                </div>`
                            )}
                            
                            <div style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 24px; border: 1px solid #e2e8f0;">
                                <h3 style="font-size: 1.1rem; color: #0f172a; margin-bottom: 15px; font-weight: 700;"> สัญญาอ้างอิง</h3>
                                <a href="javascript:void(0)" onclick="localStorage.setItem('currentContractId', '${inv.id}'); window.location.href='contract.html';" style="font-weight: 600; color: #3b82f6; text-decoration: none;">ดูสัญญาฉบับเต็ม</a>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
            `;
            invoiceListContainer.insertAdjacentHTML('beforeend', invoiceHtml);
        });
    }

    function updateStats() {
        let count = allInvoices.length;
        let pendingPayAmt = 0;
        let pendingReceiveAmt = 0;
        let paidPayAmt = 0;
        let paidReceiveAmt = 0;

        allInvoices.forEach(inv => {
            const qty = parseFloat(inv.quantity) || 0;
            const price = parseFloat(inv.price) || 0;
            const subtotal = qty * price;
            const fee = subtotal * 0.01; 
            const vat = (subtotal + fee) * 0.07; 
            const grandTotal = subtotal + fee + vat;

            const isBuyer = (inv.order_type || '').toLowerCase() === 'buy';

            if (inv.status === 'completed') {
                if (isBuyer) paidPayAmt += grandTotal;
                else paidReceiveAmt += grandTotal;
            } else {
                if (isBuyer) pendingPayAmt += grandTotal;
                else pendingReceiveAmt += grandTotal;
            }
        });

        if (statCount) statCount.innerText = count.toLocaleString();
        
        // Update DOM dynamically to show all 4 stats
        const statsContainer = document.querySelector('.order-stats');
        if (statsContainer) {
            statsContainer.style.display = 'grid';
            statsContainer.style.gridTemplateColumns = '1fr 1fr';
            statsContainer.style.gap = '10px';
            statsContainer.style.marginBottom = '20px';
            
            statsContainer.innerHTML = `
                <div class="order-stat-box" style="border: 1px solid #fecaca; background: #fef2f2; padding: 15px; border-radius: 8px; text-align: center;">
                    <div class="value" style="color: #ef4444; font-size: 1.25rem; font-weight: 700;">฿${pendingPayAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="label" style="color: #991b1b; font-size: 0.75rem; margin-top: 4px; font-weight: 600;">ยอดค้างชำระ (ต้องจ่าย)</div>
                </div>
                <div class="order-stat-box" style="border: 1px solid #fde68a; background: #fffbeb; padding: 15px; border-radius: 8px; text-align: center;">
                    <div class="value" style="color: #d97706; font-size: 1.25rem; font-weight: 700;">฿${pendingReceiveAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="label" style="color: #b45309; font-size: 0.75rem; margin-top: 4px; font-weight: 600;">ยอดรอรับ (จะได้เงิน)</div>
                </div>
                <div class="order-stat-box" style="border: 1px solid #bfdbfe; background: #eff6ff; padding: 15px; border-radius: 8px; text-align: center;">
                    <div class="value" style="color: #3b82f6; font-size: 1.25rem; font-weight: 700;">฿${paidPayAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="label" style="color: #1e40af; font-size: 0.75rem; margin-top: 4px; font-weight: 600;">จ่ายแล้ว</div>
                </div>
                <div class="order-stat-box" style="border: 1px solid #a7f3d0; background: #ecfdf5; padding: 15px; border-radius: 8px; text-align: center;">
                    <div class="value" style="color: #10b981; font-size: 1.25rem; font-weight: 700;">฿${paidReceiveAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                    <div class="label" style="color: #065f46; font-size: 0.75rem; margin-top: 4px; font-weight: 600;">รับเงินแล้ว</div>
                </div>
            `;
        }
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', renderInvoices);
    }

    // ฟังก์ชันชำระเงินจำลอง
    window.payInvoice = async function(id) {
        if (!confirm('ยืนยันการทำรายการชำระเงินจำลอง?')) return;
        
        try {
            // 1. ลองอัปเดตในฐานข้อมูลของเรา
            await window.supabaseClient
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', id);
                
            // 2. ซิงค์สถานะให้ออเดอร์ของคู่สัญญาเป็น completed ด้วย
            const inv = allInvoices.find(o => o.id == id);
            if (inv && inv.matched_with_name && inv.matched_with_name.includes('|')) {
                const partnerId = inv.matched_with_name.split('|')[1];
                await window.supabaseClient
                    .from('orders')
                    .update({ status: 'completed' })
                    .eq('id', partnerId);
            }

            // 3. อัปเดต UI ทันที (เพื่อให้เห็นผลใน Prototype)
            alert('ชำระเงินสำเร็จ! สัญญาซื้อขายสมบูรณ์ (อัปเดตสถานะให้ทั้งสองฝ่ายแล้ว)');
            
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
