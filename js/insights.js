document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) return;

    let allOrders = []; // เก็บข้อมูลต้นฉบับทั้งหมด

    // เลือก Elements ของตัวกรอง
    const typeRadios = document.querySelectorAll('input[name="order_type"]');
    const productSelect = document.querySelectorAll('.select-full')[0];
    const locationSelect = document.getElementById('locationFilter'); // เป็น Input แล้ว
    const termSelect = document.querySelectorAll('.select-full')[2] || document.querySelectorAll('.select-full')[1]; // เผื่อ index เลื่อน
    const clearBtn = document.querySelector('.filters-header a');
    const sortSelect = document.getElementById('sortSelect');

    // 77 จังหวัด
    const provinces = [
        "กระบี่", "กรุงเทพมหานคร", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร",
        "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ",
        "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
        "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์",
        "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี",
        "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา",
        "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์",
        "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร",
        "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง",
        "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
        "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี",
        "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย",
        "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์",
        "อุทัยธานี", "อุบลราชธานี"
    ];

    // เติม Datalist
    const provincesList = document.getElementById('provincesList');
    if (provincesList) {
        provinces.forEach(p => {
            const option = document.createElement('option');
            option.value = p;
            provincesList.appendChild(option);
        });
    }

    async function loadOrders() {
        if (!window.supabaseClient) {
            console.error("Supabase client not found.");
            return;
        }

        try {
            const { data: orders, error } = await window.supabaseClient
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (orders && orders.length > 0) {
                allOrders = orders;
                populateFilterDropdowns(orders);
                renderTable(orders);
            } else {
                tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 20px;">ยังไม่มีข้อมูลคำสั่งซื้อในระบบ</td></tr>';
            }
        } catch (err) {
            console.error("Failed to load orders for insights:", err);
        }
    }

    // สร้างตัวเลือกใน Dropdown อัตโนมัติจากข้อมูลที่มี
    function populateFilterDropdowns(orders) {
        // ดึงค่าที่ไม่ซ้ำกัน
        const products = [...new Set(orders.map(o => o.product).filter(Boolean))];
        const locations = [...new Set(orders.map(o => o.province).filter(Boolean))];
        const terms = [...new Set(orders.map(o => o.marketplace).filter(Boolean))];

        // สินค้า
        productSelect.innerHTML = '<option value="all">สินค้าทั้งหมด</option>';
        products.forEach(p => productSelect.innerHTML += `<option value="${p}">${p}</option>`);

        // สถานที่ (จังหวัด) - ไม่ต้องเติม option เข้าไปใน input
        // locationSelect เป็น input + datalist แล้ว (เติมจากอาเรย์คงที่)

        // เงื่อนไขการส่งมอบ (ตลาด/รูปแบบ)
        if (termSelect) {
            termSelect.innerHTML = '<option value="all">เงื่อนไขทั้งหมด</option>';
            terms.forEach(t => termSelect.innerHTML += `<option value="${t}">${t}</option>`);
        }
    }

    // วาดตารางตามข้อมูลที่รับมา
    function renderTable(dataToRender) {
        tableBody.innerHTML = '';
        
        if (dataToRender.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 30px; color: #64748b;">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการกรอง</td></tr>';
            return;
        }

        dataToRender.forEach(order => {
            const tr = document.createElement('tr');
            
            const dateObj = new Date(order.created_at);
            const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
            
            const typeColor = order.order_type === 'Buy' ? 'var(--primary-green)' : '#ef4444';
            const typeLabel = order.order_type === 'Buy' ? 'ซื้อ' : 'ขาย';
            const productName = window.sanitizeHTML(order.product_name || order.product || '-');
            const marketplace = window.sanitizeHTML(order.marketplace || '-');
            const province = window.sanitizeHTML(order.province || '-');
            const paymentTerm = window.sanitizeHTML(order.payment_term || '-');
            const unit = window.sanitizeHTML(order.unit || 'MT');

            const isBuy = order.order_type === 'Buy';
            const badgeBg = isBuy ? '#ecfdf5' : '#fef2f2';
            const badgeColor = isBuy ? '#10b981' : '#ef4444';
            const badgeBorder = isBuy ? '#d1fae5' : '#fee2e2';

            // โลจิกต้นทาง-ปลายทาง:
            let originText = order.origin_port || '-';
            let destinationText = order.destination_port || '-';
            
            // ถ้าเป็นตลาดในประเทศและไม่ได้ระบุ port ไว้ ให้ใช้โลจิกเดิม (ดึงจากจังหวัด)
            if (originText === '-' && destinationText === '-') {
                if (province !== '-') {
                    if (isBuy) {
                        destinationText = province;
                    } else {
                        originText = province;
                    }
                }
            }

            tr.innerHTML = `
                <td>
                    <span style="background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">
                        ${typeLabel}
                    </span>
                </td>
                <td><div style="font-weight: 700; color: #0f172a;">${productName}</div></td>
                <td><div style="font-weight: 600; color: #475569;">${(order.quantity || 0).toLocaleString()} <span style="font-size: 0.8rem; color: #94a3b8;">${unit}</span></div></td>
                <td style="color: #475569; font-weight: 500;">${marketplace}</td>
                <td style="color: #475569; font-weight: 500;">${originText}</td>
                <td style="color: #475569; font-weight: 500;">${destinationText}</td>
                <td style="color: #475569; font-weight: 500;">${paymentTerm}</td>
                <td style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">${formattedDate}</td>
                <td><button class="btn-view" onclick="window.openOrderModal('${order.id}')">👁️ View</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // ฟังก์ชันกรองข้อมูล
    function applyFilters() {
        let filtered = allOrders;

        // 0. กรองจากช่องค้นหา (Search)
        const searchInputEl = document.getElementById('searchInput');
        const searchVal = searchInputEl ? searchInputEl.value.trim().toLowerCase() : '';
        if (searchVal) {
            filtered = filtered.filter(o => {
                return (o.product_name && o.product_name.toLowerCase().includes(searchVal)) ||
                       (o.product && o.product.toLowerCase().includes(searchVal)) ||
                       (o.province && o.province.toLowerCase().includes(searchVal)) ||
                       (o.marketplace && o.marketplace.toLowerCase().includes(searchVal));
            });
        }

        // 1. กรองประเภทคำสั่ง (ซื้อ/ขาย) แบบกันเหนียว (ไม่พึ่งพา HTML value ป้องกัน Cache)
        let selectedType = 'all';
        if (typeRadios[1] && typeRadios[1].checked) selectedType = 'Buy';
        else if (typeRadios[2] && typeRadios[2].checked) selectedType = 'Sell';
        
        if (selectedType !== 'all') {
            filtered = filtered.filter(o => o.order_type === selectedType);
        }

        // 2. กรองสินค้า
        const prodVal = productSelect ? productSelect.value : 'all';
        if (prodVal && prodVal !== 'all' && prodVal !== 'on') {
            filtered = filtered.filter(o => (o.product_name || o.product) === prodVal);
        }

        // 3. กรองสถานที่ (จาก Text Input)
        const locVal = locationSelect ? locationSelect.value.trim() : '';
        if (locVal && locVal !== 'all' && locVal !== '') {
            filtered = filtered.filter(o => o.province && o.province.includes(locVal));
        }

        // 4. กรองเงื่อนไข
        const termVal = termSelect ? termSelect.value : 'all';
        if (termVal && termVal !== 'all' && termVal !== 'on') {
            filtered = filtered.filter(o => o.marketplace === termVal);
        }

        // 5. เรียงลำดับ (Sorting)
        const sortVal = sortSelect ? sortSelect.value : 'newest';
        if (sortVal === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortVal === 'oldest') {
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (sortVal === 'price_desc') {
            filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        } else if (sortVal === 'price_asc') {
            filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        }

        renderTable(filtered);
    }

    // ผูก Event ให้ตัวกรองทั้งหมด
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyFilters();
        });
    }
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);

    if (typeRadios) typeRadios.forEach(radio => radio.addEventListener('change', applyFilters));
    if (productSelect) productSelect.addEventListener('change', applyFilters);
    if (locationSelect) locationSelect.addEventListener('input', applyFilters);
    if (termSelect) termSelect.addEventListener('change', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    // ปุ่มล้างทั้งหมด
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) searchInput.value = '';
            if (typeRadios && typeRadios[0]) typeRadios[0].checked = true;
            if (productSelect) productSelect.value = 'all';
            if (locationSelect) locationSelect.value = '';
            if (termSelect) termSelect.value = 'all';
            if (sortSelect) sortSelect.value = 'newest';
            applyFilters();
        });
    }

    // Modal Logic
    const orderModal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.modal-close-btn');

    // Close Modal Events
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            orderModal.classList.remove('active');
            setTimeout(() => orderModal.style.display = 'none', 300);
        });
    }
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) {
                orderModal.classList.remove('active');
                setTimeout(() => orderModal.style.display = 'none', 300);
            }
        });
    }

    // Global function for opening modal so we don't rely on event delegation
    window.openOrderModal = function(orderId) {
        const orderModal = document.getElementById('orderModal');
        console.log("Button clicked for Order ID:", orderId);
        
        if (!allOrders) {
            alert('ยังโหลดข้อมูลไม่เสร็จ กรุณารอสักครู่');
            return;
        }
        
        const order = allOrders.find(o => String(o.id) === String(orderId));
        
        if (!order) {
            alert('ไม่พบข้อมูลคำสั่งซื้อรหัส: ' + orderId);
            return;
        }

        try {
            // Populate Modal Data
            document.getElementById('modalProductName').innerText = order.product_name || order.product || '-';
            
            const isBuy = order.order_type === 'Buy';
            const typeEl = document.getElementById('modalOrderType');
            typeEl.innerText = isBuy ? 'BUY ORDER' : 'SELL ORDER';
            typeEl.style.backgroundColor = isBuy ? '#ecfdf5' : '#fef2f2';
            typeEl.style.color = isBuy ? '#10b981' : '#ef4444';
            typeEl.style.border = `1px solid ${isBuy ? '#d1fae5' : '#fee2e2'}`;

            document.getElementById('modalQuantity').innerText = `${(order.quantity || 0).toLocaleString()} ${order.unit || 'MT'}`;
            document.getElementById('modalQuality').innerText = order.quality || 'Standardised';
            document.getElementById('modalPacking').innerText = order.packing || 'Standard';
            document.getElementById('modalContract').innerText = order.contract_type || 'SPOT';

            document.getElementById('modalDelivery').innerText = order.payment_term || '-'; 
            const foreignCountries = ['Indonesia', 'South Korea', 'Japan', 'Vietnam', 'Portugal', 'Brazil', 'Spain', 'Germany', 'India', 'France', 'Russia', 'China', 'United States', 'United Kingdom'];
            let displayCountry = 'Thailand';
            let displayProvince = order.province || '-';
            
            if (order.province && order.province !== '-') {
                const matchedCountry = foreignCountries.find(c => order.province.includes(c));
                if (matchedCountry) {
                    displayCountry = matchedCountry;
                    displayProvince = order.province === matchedCountry ? '-' : order.province.replace(', ' + matchedCountry, '').replace(matchedCountry, '').trim();
                    if (!displayProvince) displayProvince = '-';
                }
            } else if (order.marketplace === 'Global Market' && order.region) {
                displayCountry = order.region;
                displayProvince = order.port || order.destination_port || order.origin_port || '-';
            }

            document.getElementById('modalCountry').innerText = displayCountry;
            document.getElementById('modalProvince').innerText = displayProvince;
            document.getElementById('modalDistrict').innerText = order.amphoe || '-';
            document.getElementById('modalSubdistrict').innerText = order.tambon || '-';

            // Fake timeline dates based on created_at
            let created = new Date(order.created_at);
            if (isNaN(created.getTime())) created = new Date(); // fallback if invalid date
            const firstDelivery = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
            const lastDelivery = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            
            document.getElementById('modalFirstDate').innerText = firstDelivery.toLocaleDateString('en-US', options);
            document.getElementById('modalLastDate').innerText = lastDelivery.toLocaleDateString('en-US', options);
            document.getElementById('modalPayment').innerText = 'COD / Bank Transfer';
            // Update Price
            const priceEl = document.getElementById('modalPrice');
            if (priceEl) {
                const priceValue = order.price ? Number(order.price).toLocaleString() : '-';
                priceEl.innerText = priceValue !== '-' ? `฿${priceValue} / ${order.unit || 'MT'}` : 'เสนอราคา (Bidding)';
            }

            // Show Modal
            if (orderModal) {
                orderModal.style.display = 'flex';
                // Trigger reflow for CSS transition
                void orderModal.offsetWidth;
                orderModal.classList.add('active');
            } else {
                alert('ข้อผิดพลาด: ไม่พบองค์ประกอบ Modal ในหน้าเว็บ');
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการแสดงข้อมูล: " + err.message);
            console.error("Modal Error:", err);
        }
    };

    loadOrders();
});
