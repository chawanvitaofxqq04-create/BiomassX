import json
import re

json_path = r"C:\Users\chawa\.gemini\antigravity\brain\6e4d547c-6c18-4832-b6cf-48d3df55382c\.system_generated\steps\7562\content.md"

with open(json_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JSON from content.md (line 9 onwards)
json_str = content.split('---\n\n')[1]

products = json.loads(json_str)

all_products_arr = []
product_data_dict = {}

for p in products:
    name = p.get('th_name')
    if not name:
        continue
    
    all_products_arr.append(name)
    
    cats = [c.get('category_th_name') for c in p.get('categories', []) if c.get('category_th_name')]
    mkts = [m.get('market_th_name') for m in p.get('markets', []) if m.get('market_th_name')]
    
    product_data_dict[name] = {
        'cats': cats,
        'mkts': mkts,
        'tags': cats + mkts, # keep tags for compatibility
        'image': '',
        'desc': p.get('en_overview') or '',
        'specs': []
    }

# Now generate the JS content
js_content = """// ข้อมูลสินค้าที่แสดง
const allProducts = """ + json.dumps(all_products_arr, ensure_ascii=False) + """;

// ข้อมูลจำเพาะของแต่ละสินค้า (Mockup Data)
const productData = """ + json.dumps(product_data_dict, ensure_ascii=False, indent=4) + """;

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterSelects = document.querySelectorAll('.filter-select');
    const resultsCount = document.getElementById('resultsCount');

    // Modal Elements
    const modal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDesc');
    const modalSpecs = document.getElementById('modalSpecs');

    if (!productsGrid) return; // ออกจากฟังก์ชันถ้าไม่ได้อยู่หน้า products

    // ฟังก์ชันสร้าง Card
    const renderProducts = (products) => {
        productsGrid.innerHTML = '';
        
        resultsCount.innerText = `${products.length} สินค้าที่พบ`;

        if (products.length === 0) {
            productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">ไม่พบสินค้าที่ค้นหา</div>';
            return;
        }

        products.forEach(productName => {
            const data = productData[productName] || { tags: [], cats: [], mkts: [], desc: '', specs: [] };
            
            const card = document.createElement('div');
            card.className = 'product-card';
            
            let tagsHtml = '';
            if (data.cats && data.cats.length > 0) {
                tagsHtml += data.cats.map(c => `<span class="product-category">${c}</span>`).join('');
            }
            if (data.mkts && data.mkts.length > 0) {
                tagsHtml += data.mkts.map(m => `<span class="product-market-tag">${m}</span>`).join('');
            }

            card.innerHTML = `
                <h3>${productName}</h3>
                <div class="product-category-tags" style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                    ${tagsHtml}
                </div>
            `;

            // เปิด Modal
            card.addEventListener('click', () => {
                modalTitle.innerText = productName;
                
                modalTags.innerHTML = '';
                if(data.tags) {
                    data.tags.forEach(tag => {
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
                        row.innerHTML = `<span class="spec-label">${spec.label}</span><span class="spec-value">${spec.value}</span>`;
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
        const searchTerm = searchInput.value.toLowerCase();
        const filters = Array.from(filterSelects).map(select => select.value);

        const filtered = allProducts.filter(product => {
            const data = productData[product];
            const matchesSearch = product.toLowerCase().includes(searchTerm);
            
            // ตรวจสอบว่าตรงกับ filter อย่างน้อย 1 เงื่อนไข (ถ้ามีการเลือก filter)
            const hasActiveFilter = filters.some(f => f !== 'all');
            let matchesFilter = !hasActiveFilter;

            if (hasActiveFilter && data) {
                 matchesFilter = filters.some(filterValue => {
                     if (filterValue === 'all') return false;
                     return data.tags.includes(filterValue);
                 });
            }

            return matchesSearch && matchesFilter;
        });

        renderProducts(filtered);
    };

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    filterSelects.forEach(select => {
        select.addEventListener('change', filterProducts);
    });

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
"""

with open(r"C:\project-programmer\Biomassx\js\products.js", 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Successfully updated js/products.js")
