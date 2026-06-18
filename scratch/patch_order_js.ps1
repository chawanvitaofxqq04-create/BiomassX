$content = [System.IO.File]::ReadAllText("C:\project-programmer\Biomassx\js\order_new.js")

$target = @"
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
                    <span class="suggestion-th">`${match.th}`</span>
                    <span class="suggestion-en">`${match.en}`</span>
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
                        <span class="suggestion-th">`${match.th}`</span>
                        <span class="suggestion-en">`${match.en}`</span>
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
"@

$replacement = @"
    const input = document.getElementById('productInput');
    const suggestionsContainer = document.getElementById('productSuggestions');
    const hiddenSelect = document.getElementById('productSelect');

    if (input && suggestionsContainer) {
        
        // ใช้ productData จาก products.js ถ้ามี
        let productsList = biomassProducts;
        if (typeof productData !== 'undefined') {
            productsList = Object.keys(productData).map(k => ({ th: k, en: productData[k].tags.join(', ') || 'Biomass' }));
        }

        // ฟังก์ชันแสดงรายการที่ค้นหาเจอ
        const showSuggestions = (query) => {
            suggestionsContainer.innerHTML = ''; // ล้างของเก่า
            
            if (!query) {
                suggestionsContainer.classList.remove('active');
                return;
            }

            const lowerQuery = query.toLowerCase();
            // ค้นหาทั้งภาษาไทยและอังกฤษ
            const matches = productsList.filter(p => 
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
                    <span class="suggestion-th">`${match.th}`</span>
                    <span class="suggestion-en" style="font-size:0.8rem; color:#94a3b8;">`${match.en}`</span>
                `;
                
                // เมื่อคลิกที่รายการ
                div.addEventListener('click', () => {
                    input.value = match.th; // ใส่ค่าภาษาไทยลงในช่อง
                    if(hiddenSelect) hiddenSelect.value = match.th; // ใส่ hidden input
                    suggestionsContainer.classList.remove('active');
                });
                
                suggestionsContainer.appendChild(div);
            });

            suggestionsContainer.classList.add('active');
        };

        // ดักจับการพิมพ์
        input.addEventListener('input', (e) => {
            if(hiddenSelect) hiddenSelect.value = e.target.value.trim(); // อัพเดทค่าที่พิมพ์เองด้วย
            showSuggestions(e.target.value.trim());
        });
        
        // โชว์รายการทั้งหมดเมื่อคลิกที่ช่องว่างๆ (เผื่อผู้ใช้อยากดูว่ามีอะไรบ้าง)
        input.addEventListener('focus', (e) => {
            if (!e.target.value.trim()) {
                suggestionsContainer.innerHTML = '';
                productsList.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'autocomplete-suggestion-item';
                    div.innerHTML = `
                        <span class="suggestion-th">`${match.th}`</span>
                        <span class="suggestion-en" style="font-size:0.8rem; color:#94a3b8;">`${match.en}`</span>
                    `;
                    div.addEventListener('click', () => {
                        input.value = match.th;
                        if(hiddenSelect) hiddenSelect.value = match.th;
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
"@

$content = $content.Replace($target, $replacement)

[System.IO.File]::WriteAllText("C:\project-programmer\Biomassx\js\order_new.js", $content, [System.Text.Encoding]::UTF8)
Write-Host "Patched order_new.js"
