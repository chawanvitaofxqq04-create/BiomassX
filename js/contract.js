document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let orderId = urlParams.get('id');

    // ถ้า URL ไม่มี ID ให้ลองดึงจาก localStorage (วิธีนี้แก้ปัญหาชัวร์ 100%)
    if (!orderId) {
        orderId = localStorage.getItem('currentContractId');
    }

    // ถ้ายังไม่มีอีก (เช่น กดมาจากหน้า invoice จริงๆ) ให้แสดง Mockup
    if (!orderId) {
        alert(" ระบบตรวจพบว่าคุณกำลังเปิดหน้า PDF โดยไม่มีข้อมูลรหัสสัญญา\n\nสาเหตุที่เป็นไปได้:\n1. คุณกดปุ่มผิดหน้า (ต้องกดจากหน้า คำสั่งซื้อขาย แท็บ 3)\n2. คุณเปิดหน้านี้ตรงๆ จาก URL\n\nระบบจะแสดงข้อมูล 'ตัวอย่าง' (Mockup) แทนครับ");
        return; // ออกจากสคริปต์
    }

    if (!window.supabaseClient) {
        alert(" ระบบเชื่อมต่อฐานข้อมูล Supabase ไม่ทำงานในหน้านี้ (อาจถูกบล็อกโดยเบราว์เซอร์)");
        return;
    }

    try {
        // 1. Get Current User Session
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        // 2. Fetch Order Data
        const { data: order, error: orderError } = await window.supabaseClient
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError) throw orderError;
        if (!order) throw new Error("Order not found");

        const metadata = session.user.user_metadata || {};
        // ดึงชื่อ-นามสกุลจริงจากระบบ
        let currentUserName = "ไม่ระบุชื่อ";
        if (metadata.firstname && metadata.lastname) {
            currentUserName = metadata.firstname + " " + metadata.lastname;
        } else if (metadata.firstname) {
            currentUserName = metadata.firstname;
        }
        const currentUserAddress = metadata.address || 'ที่อยู่ตามระบบทะเบียน';
        const currentUserTaxId = metadata.taxId ? `เลขประจำตัวผู้เสียภาษี: ${metadata.taxId}` : '';

        // 4. Determine Buyer and Seller
        let buyerName = '';
        let sellerName = '';
        let buyerAddress = 'ที่อยู่ตามระบบทะเบียน';
        let sellerAddress = 'ที่อยู่ตามระบบทะเบียน';

        // ค้นหาชื่อจริงของผู้สร้างออเดอร์ (Creator) จากฐานข้อมูล
        let creatorName = currentUserName;
        let creatorAddress = currentUserAddress + ' ' + currentUserTaxId;
        
        if (order.user_id !== session.user.id) {
            try {
                let { data: creatorProfile } = await window.supabaseClient.from('users').select('firstname, lastname').eq('id', order.user_id).single();
                if (!creatorProfile) {
                    const { data: p } = await window.supabaseClient.from('profiles').select('firstname, lastname').eq('id', order.user_id).single();
                    creatorProfile = p;
                }
                if (creatorProfile) {
                    creatorName = creatorProfile.firstname + ' ' + (creatorProfile.lastname || '');
                    creatorAddress = 'ที่อยู่ตามระบบทะเบียน';
                }
            } catch(e) { console.log(e); }
        }

        let dbPartnerName = order.matched_with_name || '';
        let partnerOrderId = null;
        if (dbPartnerName.includes('|')) {
            const parts = dbPartnerName.split('|');
            dbPartnerName = parts[0];
            partnerOrderId = parts[1];
        } else if (dbPartnerName.startsWith('CREATOR:')) {
            dbPartnerName = ''; // ถ้าออเดอร์ยัง Pending จะมีแท็กนี้ซ่อนอยู่ ไม่ใช่ชื่อคู่สัญญา
        }

        // นำชื่อจริงของคู่สัญญาจากฐานข้อมูลมาใช้ (ลบระบบสุ่มชื่อจำลองออก)
        if (!dbPartnerName) {
            dbPartnerName = 'ไม่ระบุชื่อคู่สัญญา';
        }

        if ((order.order_type || '').toLowerCase() === 'buy') {
            buyerName = creatorName;
            buyerAddress = creatorAddress;
            sellerName = dbPartnerName;
        } else {
            sellerName = creatorName;
            sellerAddress = creatorAddress;
            buyerName = dbPartnerName;
        }

        // 5. Update HTML Elements
        let refId = order.id.toString().substring(0,8).toUpperCase();
        if (partnerOrderId) {
            // เรียง ID ของเราและคู่สัญญาตามตัวอักษร เพื่อให้ได้ Contract Ref อันเดียวกันเป๊ะทั้ง 2 ฝั่ง!
            const ids = [order.id, partnerOrderId].sort();
            refId = "MATCH-" + ids[0].toString().substring(0,6).toUpperCase();
        }
        document.getElementById('contract-ref').innerText = refId;
        
        const dateObj = new Date(order.created_at);
        const thaiDate = dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('contract-date').innerText = thaiDate;

        document.getElementById('contract-seller-name').innerText = sellerName;
        document.getElementById('contract-seller-address').innerText = sellerAddress;
        
        document.getElementById('contract-buyer-name').innerText = buyerName;
        document.getElementById('contract-buyer-address').innerText = buyerAddress;

        document.getElementById('contract-product').innerText = order.product_name || order.product || 'ไม่ระบุสินค้า';
        document.getElementById('contract-quantity').innerText = `${parseFloat(order.quantity).toLocaleString()} ${order.unit || 'MT'}`;
        
        const price = parseFloat(order.price) || 0;
        const qty = parseFloat(order.quantity) || 0;
        const total = price * qty;
        
        document.getElementById('contract-price').innerText = price.toLocaleString();
        document.getElementById('contract-total-value').innerText = total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

        if(order.packing) document.getElementById('contract-packing').innerText = order.packing;
        
        let deliveryStr = order.marketplace || 'FOB';
        if (order.province) deliveryStr += ` ${order.province}`;
        document.getElementById('contract-delivery').innerText = deliveryStr;
        
        if(order.payment_term) document.getElementById('contract-payment').innerText = order.payment_term;

        // แก้ไขลายเซ็นด้านล่าง (Signature Boxes)
        const signatureBoxes = document.querySelectorAll('.signature-box div:nth-child(3)');
        if (signatureBoxes.length >= 2) {
            signatureBoxes[0].innerText = `( ${sellerName} )`;
            signatureBoxes[1].innerText = `( ${buyerName} )`;
        }
        
        const timestampBoxes = document.querySelectorAll('.signature-box div:nth-child(5)');
        if (timestampBoxes.length >= 2) {
            const timeStr = dateObj.toLocaleString('en-US', { hour12: false });
            timestampBoxes[0].innerText = `Timestamp: ${timeStr}`;
            timestampBoxes[1].innerText = `Timestamp: ${timeStr}`;
        }

    } catch (error) {
        console.error("Error loading contract:", error);
        alert(" ขออภัย ไม่พบข้อมูลสัญญาในระบบ หรือถูกลบไปแล้ว\nระบบจะนำคุณกลับไปหน้าหลัก");
        window.location.href = 'index.html';
    }
});
