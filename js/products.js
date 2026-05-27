document.addEventListener('DOMContentLoaded', () => {
    
    // ข้อมูลจำลองของสินค้าแต่ละชนิด (อ้างอิงจากรูปภาพและข้อกำหนด)
    const productData = {
        "ไม้อัดเม็ด": {
            tags: ["เชื้อเพลิงชีวภาพ", "เชื้อเพลิงชีวภาพแข็ง"],
            image: "img/products/wood_pellets.png",
            desc: "เม็ดไม้อัดเป็นเชื้อเพลิงชีวมวลหมุนเวียนที่ทำจากขี้เลื่อยและเศษไม้อัด มีพลังงานสูงและการปล่อยมลพิษต่ำ เหมาะสำหรับการผลิตความร้อนและไฟฟ้าอย่างยั่งยืน",
            specs: [
                { label: "Qualities:", value: "ENplus-A1, ENplus-A2, ENplus-B, ISO 17225-2-I1, ISO 17225-2-I2, ISO 17225-2-I3, JAS (Japan)-A1, JAS (Japan)-A2, JAS (Japan)-B, NiFos (Korea)-I1, NiFos (Korea)-I2, NiFos (Korea)-I3, PFI-Premium, PFI-Standard, PFI-Utility, TIS 2772-4.1-1, TIS 2772-4.1-2" },
                { label: "Forms:", value: "Pellets (6-8mm diameter), Pellets (8-10mm diameter), Industrial grade pellets" },
                { label: "Sources:", value: "Sustainably sourced wood waste from sawmills and furniture manufacturing. FSC certified sources available." },
                { label: "Applications:", value: "Industrial boilers, Power generation, District heating, Commercial heating, Residential heating" },
                { label: "Carbon reduction factor:", value: "0.93x" }
            ]
        },
        "ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)": {
            tags: ["วัตถุดิบชีวภาพ", "ไม้เนื้อแข็ง"],
            image: "img/products/wood_logs.png",
            desc: "ไม้ท่อนจากป่าปลูกเศรษฐกิจโตเร็ว เหมาะสำหรับการนำไปสับเป็น Wood Chips หรือใช้เป็นเชื้อเพลิงในโรงไฟฟ้าชีวมวลขนาดใหญ่",
            specs: [
                { label: "Qualities:", value: "Fresh cut, Moisture content 30-45%" },
                { label: "Forms:", value: "Logs (Length 1-2m, Diameter 5-15cm)" },
                { label: "Sources:", value: "Sustainably managed plantations in Thailand" },
                { label: "Applications:", value: "Wood chips production, Biomass power plants" }
            ]
        },
        "ชานอ้อย": {
            tags: ["วัตถุดิบชีวภาพ", "ผลพลอยได้ทางการเกษตร"],
            image: "img/products/bagasse.png",
            desc: "ชานอ้อย (Bagasse) เป็นผลพลอยได้จากอุตสาหกรรมน้ำตาลทราย มีเส้นใยสูง ติดไฟง่าย นิยมนำมาใช้เป็นเชื้อเพลิงในโรงงานน้ำตาล หรืออัดก้อนเพื่อลดพื้นที่จัดเก็บ",
            specs: [
                { label: "Qualities:", value: "Moisture content ~50% (fresh), <20% (dried)" },
                { label: "Forms:", value: "Loose fibrous residue" },
                { label: "Sources:", value: "Sugar mills and agricultural processing" },
                { label: "Applications:", value: "Sugar mill boilers, Pulp and paper, Compressed fuel base" }
            ]
        },
        "ไผ่": {
            tags: ["วัตถุดิบชีวภาพ", "พืชโตเร็ว"],
            image: "img/products/bamboo.png",
            desc: "ไผ่เป็นพืชที่เจริญเติบโตเร็วที่สุดในโลก ให้ปริมาณชีวมวลสูงต่อไร่ สามารถนำไปเผาตรง หรือแปรรูปเป็นถ่านไผ่คุณภาพสูงได้",
            specs: [
                { label: "Qualities:", value: "High density, High calorific value when dried" },
                { label: "Forms:", value: "Whole poles, Split bamboo" },
                { label: "Sources:", value: "Bamboo plantations, Wild harvested" },
                { label: "Applications:", value: "Charcoal production, Direct combustion, Construction" }
            ]
        },
        "ถ่านหินชีวภาพ (ทำจากไม้)": {
            tags: ["เชื้อเพลิงชีวภาพ", "พลังงานสะอาดทดแทน"],
            image: "img/products/biocoal.png",
            desc: "ถ่านหินชีวภาพ หรือ Biocoal ผลิตด้วยกระบวนการ Torrefaction ทำให้มีคุณสมบัติคล้ายถ่านหิน ฟอสซิล แต่เป็นมิตรต่อสิ่งแวดล้อม ไร้ควันและกลิ่น",
            specs: [
                { label: "Qualities:", value: "High Energy Density (20-24 GJ/t), Water-resistant" },
                { label: "Forms:", value: "Torrefied pellets, Briquettes" },
                { label: "Sources:", value: "Various wood wastes and residues" },
                { label: "Applications:", value: "Direct co-firing with coal in power plants, Steel industry" },
                { label: "Carbon reduction factor:", value: "0.95x" }
            ]
        },
        "ถ่านไม้อัดแท่ง": {
            tags: ["เชื้อเพลิงชีวภาพ", "ถ่านไร้ควัน"],
            image: "https://images.unsplash.com/photo-1579724627096-7888b1cc1148?q=80&w=600&auto=format&fit=crop", // Charcoal image
            desc: "ถ่านไม้อัดแท่ง (Briquette Charcoal) ผลิตจากการนำขี้เลื่อยหรือเศษไม้มาอัดแท่งด้วยความดันสูงแล้วนำไปเผาเป็นถ่าน ให้ความร้อนสูงสม่ำเสมอและไร้ควัน",
            specs: [
                { label: "ค่าความร้อน:", value: "6,500 - 7,000 kcal/kg" },
                { label: "ปริมาณเถ้า (Ash):", value: "< 3%" },
                { label: "ความชื้น (Moisture):", value: "< 5%" },
                { label: "การใช้งาน:", value: "ร้านอาหารปิ้งย่าง, อุตสาหกรรมที่ต้องการความร้อนคงที่" }
            ]
        },
        "กะลาปาล์ม": {
            tags: ["เชื้อเพลิงชีวภาพ", "ให้ความร้อนสูง"],
            image: "https://images.unsplash.com/photo-1611270274293-85cb3b08e7ff?q=80&w=600&auto=format&fit=crop", // Nuts/shells image
            desc: "กะลาปาล์ม (Palm Kernel Shell - PKS) เป็นเชื้อเพลิงชีวมวลที่ได้รับความนิยมสูงในโรงไฟฟ้า เนื่องจากมีค่าความร้อนสูงและความชื้นต่ำ",
            specs: [
                { label: "ค่าความร้อน:", value: "3,800 - 4,200 kcal/kg" },
                { label: "สิ่งเจือปน (Impurities):", value: "< 3%" },
                { label: "ความชื้น (Moisture):", value: "10 - 20%" },
                { label: "การใช้งาน:", value: "โรงไฟฟ้าชีวมวล, หม้อไอน้ำอุตสาหกรรม" }
            ]
        },
        "แกลบ": {
            tags: ["เชื้อเพลิงชีวภาพ", "วัสดุเหลือใช้ทางการเกษตร"],
            image: "https://images.unsplash.com/photo-1588611171887-8df156ce523c?q=80&w=600&auto=format&fit=crop",
            desc: "แกลบ (Rice Husk) เป็นผลพลอยได้จากการสีข้าว มีราคาถูก หาได้ง่าย นิยมใช้เป็นเชื้อเพลิงในโรงสีและโรงไฟฟ้า",
            specs: [
                { label: "ค่าความร้อน:", value: "3,000 - 3,500 kcal/kg" },
                { label: "ปริมาณเถ้า (Ash):", value: "15 - 20%" },
                { label: "ความชื้น (Moisture):", value: "< 10%" },
                { label: "การใช้งาน:", value: "โรงสีข้าว, โรงไฟฟ้าชีวมวล" }
            ]
        },
        "ไบโอดีเซล": {
            tags: ["เชื้อเพลิงชีวภาพ", "เชื้อเพลิงเหลว"],
            image: "https://images.unsplash.com/photo-1605663737083-d9f799de8789?q=80&w=600&auto=format&fit=crop",
            desc: "ไบโอดีเซล (Biodiesel) เป็นเชื้อเพลิงเหลวที่ผลิตจากน้ำมันพืชหรือไขมันสัตว์ สามารถใช้ทดแทนน้ำมันดีเซลฟอสซิลได้",
            specs: [
                { label: "ความบริสุทธิ์:", value: "> 99%" },
                { label: "จุดวาบไฟ (Flash Point):", value: "> 120 °C" },
                { label: "แหล่งผลิต:", value: "น้ำมันปาล์ม, น้ำมันพืชใช้แล้ว" },
                { label: "การใช้งาน:", value: "รถยนต์ดีเซล, เครื่องจักรกลการเกษตร" }
            ]
        },
        "ไบโอ LNG": {
            tags: ["เชื้อเพลิงชีวภาพ", "ก๊าซชีวภาพเหลว"],
            image: "https://images.unsplash.com/photo-1621644788174-82bd07ea762a?q=80&w=600&auto=format&fit=crop",
            desc: "ไบโอ LNG เป็นก๊าซชีวภาพที่ผ่านกระบวนการทำความเย็นจนกลายเป็นของเหลวที่อุณหภูมิ -162°C ทำให้สะดวกต่อการขนส่งและกักเก็บ",
            specs: [
                { label: "อุณหภูมิเก็บรักษา:", value: "-162 °C" },
                { label: "การใช้งาน:", value: "อุตสาหกรรมขนาดใหญ่, เรือเดินสมุทร" }
            ]
        },
        "ไบโอ CNG": {
            tags: ["เชื้อเพลิงชีวภาพ", "ก๊าซชีวภาพอัด"],
            image: "https://images.unsplash.com/photo-1621644788174-82bd07ea762a?q=80&w=600&auto=format&fit=crop",
            desc: "ไบโอ CNG เป็นก๊าซชีวภาพที่ผ่านการทำความสะอาดและอัดความดันสูง สามารถใช้ทดแทนก๊าซ NGV ในยานยนต์ได้",
            specs: [
                { label: "ปริมาณมีเทน:", value: "> 95%" },
                { label: "การใช้งาน:", value: "ยานยนต์ขนส่ง, เครื่องจักรหนัก" }
            ]
        },
        "ปีกไม้ยางพารา": {
            tags: ["เชื้อเพลิงชีวภาพ", "เศษไม้แปรรูป"],
            image: "https://images.unsplash.com/photo-1596547609652-9cb5b4d73eb4?q=80&w=600&auto=format&fit=crop",
            desc: "ปีกไม้ยางพาราคือส่วนเปลือกและเนื้อไม้ด้านนอกสุดที่เหลือจากการเลื่อยแปรรูปไม้ยางพารา นิยมใช้เป็นเชื้อเพลิงชีวมวล",
            specs: [
                { label: "ความชื้น:", value: "30 - 45%" },
                { label: "การใช้งาน:", value: "โรงไฟฟ้าชีวมวล, อุตสาหกรรมแปรรูปไม้" }
            ]
        },
        "ขี้เลื่อยไม้ยางพารา": {
            tags: ["เชื้อเพลิงชีวภาพ", "เศษไม้"],
            image: "https://images.unsplash.com/photo-1616008696884-6ce50ceb9623?q=80&w=600&auto=format&fit=crop",
            desc: "ขี้เลื่อยที่ได้จากกระบวนการแปรรูปและขัดไม้ยางพารา เหมาะสำหรับใช้เผาตรงในเตาหรือนำไปอัดเม็ด",
            specs: [
                { label: "ขนาด:", value: "< 5 mm" },
                { label: "ความชื้น:", value: "15 - 25%" }
            ]
        },
        "ถ่านไบโอชาร์": {
            tags: ["เชื้อเพลิงชีวภาพ", "ปรับปรุงดิน"],
            image: "https://images.unsplash.com/photo-1579724627096-7888b1cc1148?q=80&w=600&auto=format&fit=crop",
            desc: "ถ่านไบโอชาร์ (Biochar) ผลิตจากการเผาชีวมวลแบบไร้ออกซิเจน มีรูพรุนสูง นิยมใช้ปรับปรุงคุณภาพดินและกักเก็บคาร์บอน",
            specs: [
                { label: "ความพรุน:", value: "สูงมาก" },
                { label: "คุณสมบัติพิเศษ:", value: "กักเก็บความชื้นและแร่ธาตุในดินได้ดีเยี่ยม" }
            ]
        },
        "ถ่านไผ่": {
            tags: ["เชื้อเพลิงชีวภาพ", "ถ่านไร้ควัน"],
            image: "https://images.unsplash.com/photo-1579724627096-7888b1cc1148?q=80&w=600&auto=format&fit=crop",
            desc: "ถ่านไผ่เผาด้วยความร้อนสูงกว่า 1000°C ไร้ควัน ไร้กลิ่น และช่วยดูดซับสารพิษ",
            specs: [
                { label: "ค่าความร้อน:", value: "> 7,000 kcal/kg" },
                { label: "คุณสมบัติพิเศษ:", value: "ปล่อยรังสีอินฟราเรดไกล" }
            ]
        },
        "ถ่านหินชีวภาพ (ทำจากวัสดุไม่ใช่ไม้)": {
            tags: ["เชื้อเพลิงชีวภาพ", "Biocoal"],
            image: "img/products/biocoal.png",
            desc: "ถ่านหินชีวภาพที่ผลิตจากวัสดุเหลือใช้ทางการเกษตร เช่น ฟางข้าว ใบอ้อย นำมาอัดและคั่วด้วยความร้อน (Torrefaction)",
            specs: [
                { label: "ค่าความร้อน:", value: "5,000 - 5,500 kcal/kg" },
                { label: "ลักษณะ:", value: "ทนน้ำได้ดีเหมือนถ่านหิน" }
            ]
        },
        "ไบโอเอทานอล": {
            tags: ["เชื้อเพลิงชีวภาพ", "เชื้อเพลิงเหลว"],
            image: "https://images.unsplash.com/photo-1605663737083-d9f799de8789?q=80&w=600&auto=format&fit=crop",
            desc: "แอลกอฮอล์บริสุทธิ์ที่ผลิตจากพืชผลทางการเกษตร (เช่น อ้อย, มันสำปะหลัง) ใช้สำหรับผสมในน้ำมันเบนซิน",
            specs: [
                { label: "ความบริสุทธิ์:", value: "99.5%" },
                { label: "การใช้งาน:", value: "ผสมในน้ำมันเบนซินเป็นแก๊สโซฮอล์" }
            ]
        },
        "เปลือกไม้": {
            tags: ["เชื้อเพลิงชีวภาพ", "ผลพลอยได้"],
            image: "https://images.unsplash.com/photo-1473445740059-0091bbff1ee1?q=80&w=600&auto=format&fit=crop",
            desc: "เปลือกไม้จากโรงงานแปรรูปหรือโรงสับไม้ นิยมนำมาใช้เป็นเชื้อเพลิงโดยตรงหรือผสมกับเชื้อเพลิงอื่น",
            specs: [
                { label: "ค่าความร้อน:", value: "2,500 - 3,000 kcal/kg" },
                { label: "ความชื้น:", value: "30 - 50%" }
            ]
        },
        // ค่า Default สำหรับสินค้าที่ยังไม่มีข้อมูลเฉพาะ
        "default": {
            tags: ["เชื้อเพลิงชีวภาพ", "มาตรฐาน BiomassX"],
            image: "https://images.unsplash.com/photo-1542274368-443d694d79aa?q=80&w=600&auto=format&fit=crop",
            desc: "ผลิตภัณฑ์ชีวมวลคุณภาพสูง ผ่านกระบวนการแปรรูปเพื่อเพิ่มค่าความร้อนและลดความชื้น เหมาะสำหรับการผลิตความร้อนและไฟฟ้าอย่างยั่งยืนทดแทนการใช้เชื้อเพลิงฟอสซิล",
            specs: [
                { label: "Qualities:", value: "Standard ISO Solid Biofuels" },
                { label: "Forms:", value: "Processed Biomass / Raw Biomass" },
                { label: "Sources:", value: "Sustainable agricultural and forestry residues" },
                { label: "Applications:", value: "Industrial heating, Power generation" }
            ]
        }
    };

    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');

    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDesc');
    const modalSpecs = document.getElementById('modalSpecs');

    // รายการสินค้าทั้งหมดที่จะแสดงในการ์ด
    const allProducts = [
        "ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)", "ชานอ้อย", "ชานอ้อยอัดก้อน",
        "ชานอ้อยอัดเม็ด", "ไผ่", "ถ่านไผ่", "ถ่านไม้อัดแท่ง", "ไผ่สับ",
        "ไผ่อัดเม็ด", "เปลือกไม้", "ไบโอ CNG", "ไบโอดีเซล", "ไบโอเอทานอล",
        "ไบโอ LNG", "ถ่านไบโอชาร์", "ถ่านหินชีวภาพ (ทำจากวัสดุไม่ใช่ไม้)",
        "ถ่านหินชีวภาพ (ทำจากไม้)", "เปลือกไม้อัดเม็ด", "แกลบ",
        "แกลบอัดแท่ง", "แกลบอัดเม็ด", "กะลาปาล์ม", "ขี้เลื่อยไม้ยางพารา",
        "ปีกไม้ยางพารา"
    ];

    // ฟังก์ชันสร้างการ์ด (แยกออกมารับพารามิเตอร์เพื่อรองรับการกรอง)
    const renderProducts = (productsToRender) => {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา</div>';
            return;
        }

        productsToRender.forEach(productName => {
            // จับคู่ข้อมูล
            let dataKey = "default";
            if (productData[productName]) {
                dataKey = productName;
            } else if (productName.includes('ถ่านไม้อัดแท่ง')) {
                dataKey = "ถ่านไม้อัดแท่ง";
            } else if (productName.includes('อัดเม็ด')) {
                dataKey = "ไม้อัดเม็ด";
            } else if (productName.includes('แกลบ')) {
                dataKey = "แกลบ";
            } else if (productName.includes('ท่อน')) {
                dataKey = "ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)";
            } else if (productName.includes('ชานอ้อย')) {
                dataKey = "ชานอ้อย";
            } else if (productName.includes('ไผ่')) {
                dataKey = "ไผ่";
            } else if (productName.includes('ถ่านหินชีวภาพ')) {
                dataKey = "ถ่านหินชีวภาพ (ทำจากไม้)";
            }
            
            const data = productData[dataKey];
            
            // เช็ค Badge
            const isFuel = data.tags.includes("เชื้อเพลิงชีวภาพ") || productName.includes("เชื้อเพลิง") || productName.includes("ถ่าน") || productName.includes("อัด") || productName.includes("ไบโอ") || productName.includes("แก๊ส") || productName.includes("น้ำมัน");
            const badgeClass = isFuel ? 'badge-fuel' : 'badge-raw';
            const badgeText = isFuel ? 'เชื้อเพลิงชีวภาพ' : 'วัตถุดิบชีวภาพ';

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${productName}</h3>
                <span class="${badgeClass}">${badgeText}</span>
            `;

            // เปิด Modal
            card.addEventListener('click', () => {
                modalTitle.innerText = productName;
                
                modalTags.innerHTML = '';
                data.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'modal-tag';
                    span.innerText = tag;
                    modalTags.appendChild(span);
                });

                if (data.image) {
                    modalImage.src = data.image;
                    modalImage.style.display = 'block';
                } else {
                    modalImage.style.display = 'none';
                }

                modalDesc.innerText = data.desc;

                modalSpecs.innerHTML = '';
                data.specs.forEach(spec => {
                    const row = document.createElement('div');
                    row.className = 'spec-row';
                    row.innerHTML = `<span class="spec-label">${spec.label}</span><span class="spec-value">${spec.value}</span>`;
                    modalSpecs.appendChild(row);
                });

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            productsGrid.appendChild(card);
        });
    };

    // แสดงทั้งหมดในตอนเริ่มต้น
    renderProducts(allProducts);

    // ระบบกรองข้อมูล (Filter System)
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const subCategoryFilter = document.getElementById('subCategoryFilter');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    const applyFilters = () => {
        const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const catVal = categoryFilter ? categoryFilter.value : '';
        const subCatVal = subCategoryFilter ? subCategoryFilter.value : '';

        const filtered = allProducts.filter(productName => {
            // 1. Text Search
            if (searchText && !productName.toLowerCase().includes(searchText)) {
                return false;
            }

            // Data matching for tags
            let dataKey = "default";
            if (productData[productName]) dataKey = productName;
            const data = productData[dataKey];
            const isFuel = data.tags.includes("เชื้อเพลิงชีวภาพ") || productName.includes("เชื้อเพลิง");
            const badgeText = isFuel ? 'เชื้อเพลิงชีวภาพ' : 'วัตถุดิบชีวภาพ';

            // 2. Category Filter
            if (catVal && badgeText !== catVal) {
                return false;
            }

            // 3. Sub-Category Filter
            if (subCatVal) {
                if (subCatVal === 'อัดเม็ด' && !productName.includes('อัดเม็ด')) return false;
                if (subCatVal === 'อัดแท่ง' && !productName.includes('อัดแท่ง') && !productName.includes('อัดก้อน')) return false;
                if (subCatVal === 'ถ่าน' && !productName.includes('ถ่าน')) return false;
                if (subCatVal === 'เหลว' && !productName.includes('ไบโอ') && !productName.includes('ดีเซล') && !productName.includes('เอทานอล') && !productName.includes('LNG') && !productName.includes('CNG')) return false;
            }

            return true;
        });

        renderProducts(filtered);
    };

    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    if (applyFilterBtn) applyFilterBtn.addEventListener('click', applyFilters);
    
    // Allow enter key and auto-search
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyFilters();
        });
        searchInput.addEventListener('input', applyFilters); // Auto-filter on type
    }
    
    // Auto-filter on select change
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (subCategoryFilter) subCategoryFilter.addEventListener('change', applyFilters);

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (subCategoryFilter) subCategoryFilter.value = '';
            renderProducts(allProducts);
        });
    }


    // ปิด Modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    modalClose.addEventListener('click', closeModal);

    // ปิดเมื่อคลิกพื้นที่ด้านนอก Modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
