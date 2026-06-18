const fs = require('fs');

const json_path = 'C:\\Users\\chawa\\.gemini\\antigravity\\brain\\6e4d547c-6c18-4832-b6cf-48d3df55382c\\.system_generated\\steps\\7562\\content.md';
const content = fs.readFileSync(json_path, 'utf8');

const parts = content.split('---\n\n');
if (parts.length < 2) {
    console.error("Could not find JSON in content.md");
    process.exit(1);
}

const json_str = parts[1];
const products = JSON.parse(json_str);

const all_products_arr = [];
const product_data_dict = {};

products.forEach(p => {
    const name = p.th_name || p.en_name;
    if (!name) return;
    
    all_products_arr.push(name);
    
    const cats = p.categories ? p.categories.map(c => c.category_th_name || c.category_en_name).filter(Boolean) : [];
    const mkts = p.markets ? p.markets.map(m => m.market_th_name || m.market_en_name).filter(Boolean) : [];
    
    product_data_dict[name] = {
        cats: cats,
        mkts: mkts,
        tags: [...cats, ...mkts],
        image: '',
        desc: p.en_overview || '',
        specs: []
    };
});

const js_content = `// ข้อมูลสินค้าที่แสดง
const allProducts = ${JSON.stringify(all_products_arr, null, 2)};

// ข้อมูลจำเพาะของแต่ละสินค้า (Mockup Data)
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

    if (!productsGrid) return; // ออกจากฟังก์ชันถ้าไม่ได้อยู่หน้า products

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
            
            // ใช้ Set เพื่อกรองค่าที่ซ้ำกัน
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

                modalDesc.innerText = data.desc;

                modalSpecs.innerHTML = '';
                if(data.specs) {
                    data.specs.forEach(spec => {
                        const row = document.createElement('div');
                        row.className = 'spec-row';
                        row.innerHTML = \`<span class="spec-label">\${spec.label}</span><span class="spec-value">\${spec.value}</span>\`;
                        modalSpecs.appendChild(row);
                    });
                }

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            productsGrid.appendChild(card);
        });
    };

    // แสดงทั้งหมดในตอนเริ่มต้น
    renderProducts(allProducts);

    // ระบบกรองข้อมูล (Filter System)
    const filterProducts = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const catFilter = categoryFilter ? categoryFilter.value : '';
        const subCatFilter = subCategoryFilter ? subCategoryFilter.value : '';

        const filtered = allProducts.filter(product => {
            const data = productData[product] || { tags: [] };
            const matchesSearch = product.toLowerCase().includes(searchTerm);
            
            // Check category filter
            let matchesCat = true;
            if (catFilter) {
                // If they pick "วัตถุดิบชีวภาพ" or "เชื้อเพลิงชีวภาพ", we check if tags include it
                matchesCat = data.tags.includes(catFilter);
            }
            
            // Check subcategory filter (simple text match for now)
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

    // Event Listeners
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', filterProducts);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', filterProducts);
    }
    
    // Also filter on Enter key in search input
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

    // ปิด Modal เมื่อคลิกพื้นที่ว่าง
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
console.log("Successfully updated js/products.js with all 142 items.");
