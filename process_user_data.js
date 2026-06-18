const fs = require('fs');

const user_data = fs.readFileSync('C:\\project-programmer\\Biomassx\\user_data.txt', 'utf8');
const lines = user_data.trim().split('\n');

const all_products_arr = [];
const product_data_dict = {};

lines.forEach(line => {
    // Note: line might have carriage return
    const parts = line.trim().split('\t');
    if (parts.length < 9) return;
    
    // Columns:
    // 0: ลำดับ
    // 1: ชื่อสินค้า
    // 2: หมวดหมู่สินค้า
    // 3: ตลาด
    // 4: Quality (Mock)
    // 5: Forms (Mock)
    // 6: Sources (Mock)
    // 7: Applications (Mock)
    // 8: Carbon Factor
    
    const index = parts[0];
    const name = parts[1].trim();
    const categoriesStr = parts[2];
    const marketsStr = parts[3];
    const quality = parts[4];
    const forms = parts[5];
    const sources = parts[6];
    const applications = parts[7];
    const carbonFactor = parts[8];
    
    // Process categories and markets
    // Splitting by comma, handling potential empty ones
    let cats = categoriesStr !== '-' ? categoriesStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    let mkts = marketsStr !== '-' ? marketsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    // In original data some markets were separated by comma or 'ฯ' e.g. "พลังงานชีวภาพ, วัสดุฯ"
    // I will just use exactly what is provided.
    
    all_products_arr.push(name);
    
    const specs = [
        { label: "Quality", value: quality },
        { label: "Forms", value: forms },
        { label: "Sources", value: sources },
        { label: "Applications", value: applications },
        { label: "Carbon Factor", value: carbonFactor }
    ];
    
    product_data_dict[name] = {
        cats: cats,
        mkts: mkts,
        tags: [...cats, ...mkts],
        image: '', // Make sure image is empty as requested
        desc: '',  // Empty for now since no desc provided
        specs: specs
    };
});

const js_content = `// ข้อมูลสินค้าที่แสดง (142 รายการ ตามลำดับใหม่)
const allProducts = ${JSON.stringify(all_products_arr, null, 2)};

// ข้อมูลจำเพาะของแต่ละสินค้า
const productData = ${JSON.stringify(product_data_dict, null, 2)};

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const subCategoryFilter = document.getElementById('subCategoryFilter');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const productCount = document.getElementById('productCount');

    // Modal Elements
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDesc');
    const modalSpecs = document.getElementById('modalSpecs');

    if (!productsGrid) return;

    // ฟังก์ชันสร้าง Card
    const renderProducts = (products) => {
        productsGrid.innerHTML = '';
        
        if (productCount) {
            productCount.innerText = products.length;
        }

        if (products.length === 0) {
            productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">ไม่พบสินค้าที่ค้นหา</div>';
            return;
        }

        products.forEach(productName => {
            const data = productData[productName] || { tags: [], cats: [], mkts: [], desc: '', specs: [] };
            
            const card = document.createElement('div');
            card.className = 'product-card';
            
            let tagsHtml = '';
            
            const uniqueCats = [...new Set(data.cats)];
            const uniqueMkts = [...new Set(data.mkts)];
            
            if (uniqueCats && uniqueCats.length > 0) {
                tagsHtml += uniqueCats.map(c => \`<span class="product-category">\${c}</span>\`).join('');
            }
            if (uniqueMkts && uniqueMkts.length > 0) {
                tagsHtml += uniqueMkts.map(m => \`<span class="product-market-tag">\${m}</span>\`).join('');
            }

            card.innerHTML = \`
                <h3>\${productName}</h3>
                <div class="product-category-tags" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                    \${tagsHtml}
                </div>
            \`;

            // เปิด Modal
            card.addEventListener('click', () => {
                modalTitle.innerText = productName;
                
                modalTags.innerHTML = '';
                if(data.tags) {
                    const uniqueTags = [...new Set(data.tags)];
                    uniqueTags.forEach(tag => {
                        const span = document.createElement('span');
                        span.className = 'modal-tag';
                        span.innerText = tag;
                        modalTags.appendChild(span);
                    });
                }

                if (data.image) {
                    modalImage.src = data.image;
                    modalImage.style.display = 'block';
                } else {
                    modalImage.style.display = 'none';
                }

                modalDesc.innerText = data.desc || '';

                modalSpecs.innerHTML = '';
                if(data.specs && data.specs.length > 0) {
                    data.specs.forEach(spec => {
                        const row = document.createElement('div');
                        row.className = 'spec-row';
                        row.innerHTML = \`<span class="spec-label">\${spec.label}:</span> <span class="spec-value">\${spec.value}</span>\`;
                        modalSpecs.appendChild(row);
                    });
                }

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            productsGrid.appendChild(card);
        });
    };

    renderProducts(allProducts);

    // Filter System
    const filterProducts = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const catFilter = categoryFilter ? categoryFilter.value : '';
        const subCatFilter = subCategoryFilter ? subCategoryFilter.value : '';

        const filtered = allProducts.filter(product => {
            const data = productData[product] || { tags: [] };
            const matchesSearch = product.toLowerCase().includes(searchTerm);
            
            let matchesCat = true;
            if (catFilter) {
                matchesCat = data.tags.includes(catFilter);
            }
            
            let matchesSubCat = true;
            if (subCatFilter) {
                if (subCatFilter === 'อัดเม็ด') matchesSubCat = product.includes('อัดเม็ด');
                if (subCatFilter === 'อัดแท่ง') matchesSubCat = product.includes('อัดแท่ง') || product.includes('อัดก้อน');
                if (subCatFilter === 'ถ่าน') matchesSubCat = product.includes('ถ่าน');
                if (subCatFilter === 'เหลว') matchesSubCat = product.includes('ไบโอ') || product.includes('น้ำมัน') || product.includes('เอทานอล') || product.includes('แก๊ส');
            }

            return matchesSearch && matchesCat && matchesSubCat;
        });

        renderProducts(filtered);
    };

    if (applyFilterBtn) applyFilterBtn.addEventListener('click', filterProducts);
    if (searchBtn) searchBtn.addEventListener('click', filterProducts);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') filterProducts();
        });
    }

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (subCategoryFilter) subCategoryFilter.value = '';
            filterProducts();
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
`;

fs.writeFileSync('C:\\project-programmer\\Biomassx\\js\\products.js', js_content, 'utf8');
console.log("Successfully processed user_data.txt and updated js/products.js");
