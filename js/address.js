document.addEventListener('DOMContentLoaded', () => {
    let provincesData = {};
    let isDataLoaded = false;

    function bindThaiAddressLogic() {
        const provinceSelect = document.querySelector('.province-select');
        const smallSelects = document.querySelectorAll('.small-select');
        
        if (!provinceSelect || smallSelects.length < 2) return;
        
        const amphoeSelect = smallSelects[0];
        const tambonSelect = smallSelects[1];

        // ตั้งค่าเริ่มต้น
        provinceSelect.innerHTML = '<option value="">Select Province</option>';
        amphoeSelect.innerHTML = '<option value="">เลือก</option>';
        tambonSelect.innerHTML = '<option value="">เลือก</option>';

        if (!isDataLoaded) {
            provinceSelect.innerHTML = '<option value="">กำลังโหลดข้อมูล...</option>';
            provinceSelect.disabled = true;
            amphoeSelect.disabled = true;
            tambonSelect.disabled = true;

            // ดึงข้อมูล JSON จังหวัด อำเภอ ตำบล
            fetch('https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json')
                .then(response => response.json())
                .then(data => {
                    // จัดกลุ่มข้อมูล
                    data.forEach(item => {
                        const prov = item.province;
                        const amph = item.amphoe;
                        const dist = item.district;
                        
                        if (!provincesData[prov]) {
                            provincesData[prov] = {};
                        }
                        if (!provincesData[prov][amph]) {
                            provincesData[prov][amph] = [];
                        }
                        if (!provincesData[prov][amph].includes(dist)) {
                            provincesData[prov][amph].push(dist);
                        }
                    });

                    isDataLoaded = true;
                    populateProvinces(provinceSelect);
                })
                .catch(err => {
                    console.error("Failed to load Thai address data", err);
                    provinceSelect.outerHTML = '<input type="text" class="province-select" placeholder="พิมพ์ชื่อจังหวัด (ระบบมีปัญหาดึงข้อมูลอัตโนมัติ)" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1;">';
                    if (amphoeSelect) amphoeSelect.outerHTML = '<input type="text" class="small-select" placeholder="เขต/อำเภอ" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1;">';
                    if (tambonSelect) tambonSelect.outerHTML = '<input type="text" class="small-select" placeholder="แขวง/ตำบล" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1;">';
                });
        } else {
            populateProvinces(provinceSelect);
        }

        function populateProvinces(selectElement) {
            selectElement.innerHTML = '<option value="">Select Province</option>';
            const sortedProvinces = Object.keys(provincesData).sort();
            sortedProvinces.forEach(prov => {
                const option = document.createElement('option');
                option.value = prov;
                option.textContent = prov;
                selectElement.appendChild(option);
            });
            selectElement.disabled = false;
        }

        // เมื่อเลือกจังหวัด
        provinceSelect.addEventListener('change', (e) => {
            const prov = e.target.value;
            amphoeSelect.innerHTML = '<option value="">เลือก</option>';
            tambonSelect.innerHTML = '<option value="">เลือก</option>';
            tambonSelect.disabled = true;
            
            if (prov && provincesData[prov]) {
                const sortedAmphoes = Object.keys(provincesData[prov]).sort();
                sortedAmphoes.forEach(amph => {
                    const option = document.createElement('option');
                    option.value = amph;
                    option.textContent = amph;
                    amphoeSelect.appendChild(option);
                });
                amphoeSelect.disabled = false;
            } else {
                amphoeSelect.disabled = true;
            }
        });

        // เมื่อเลือกอำเภอ
        amphoeSelect.addEventListener('change', (e) => {
            const prov = provinceSelect.value;
            const amph = e.target.value;
            tambonSelect.innerHTML = '<option value="">เลือก</option>';
            
            if (prov && amph && provincesData[prov] && provincesData[prov][amph]) {
                const sortedTambons = provincesData[prov][amph].sort();
                sortedTambons.forEach(tambon => {
                    const option = document.createElement('option');
                    option.value = tambon;
                    option.textContent = tambon;
                    tambonSelect.appendChild(option);
                });
                tambonSelect.disabled = false;
            } else {
                tambonSelect.disabled = true;
            }
        });
    }

    // Initialize the first time
    bindThaiAddressLogic();

    // Dynamic input changing based on country selection
    const countrySelect = document.querySelector('.country-select');
    if (countrySelect) {
        countrySelect.addEventListener('change', (e) => {
            const country = e.target.value;
            const currentProv = document.querySelector('.province-select');
            const smallSelects = document.querySelectorAll('.small-select');
            const currentAmph = smallSelects[0];
            const currentTamb = smallSelects[1];
            
            if (!currentProv || !currentAmph || !currentTamb) return;

            const provGroup = currentProv.closest('.form-group');
            const amphGroup = currentAmph.closest('.form-group');
            const tambGroup = currentTamb.closest('.form-group');
            
            if (!provGroup || !amphGroup || !tambGroup) return;

            const provLabel = provGroup.querySelector('label');
            const amphLabel = amphGroup.querySelector('label');
            const tambLabel = tambGroup.querySelector('label');

            if (country === 'Thailand' || country === 'ไทย') {
                provLabel.innerText = 'จังหวัด';
                amphLabel.innerText = 'อำเภอ';
                tambLabel.innerText = 'ตำบล';

                // Restore to selects if they were inputs
                if (currentProv.tagName !== 'SELECT') {
                    currentProv.outerHTML = '<select class="province-select" id="provinceSelect" style="width: 100%; min-width: 0; box-sizing: border-box;"></select>';
                    currentAmph.outerHTML = '<select class="small-select" style="width: 100%; min-width: 0; box-sizing: border-box;"></select>';
                    currentTamb.outerHTML = '<select class="small-select" style="width: 100%; min-width: 0; box-sizing: border-box;"></select>';
                    
                    // Re-bind Thai logic!
                    bindThaiAddressLogic();
                } else {
                    // Reset Thai values
                    currentProv.value = '';
                    currentAmph.innerHTML = '<option value="">เลือก</option>';
                    currentAmph.disabled = true;
                    currentTamb.innerHTML = '<option value="">เลือก</option>';
                    currentTamb.disabled = true;
                }
            } else {
                provLabel.innerText = 'รัฐ/แคว้น/เมือง (State/Province)';
                amphLabel.innerText = 'เมือง/เขต (City/Town)';
                tambLabel.innerText = 'รหัสไปรษณีย์ (Zip/Postal Code)';

                // Change to text inputs
                if (currentProv.tagName === 'SELECT') {
                    currentProv.outerHTML = '<input type="text" class="province-select" placeholder="City / State" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1; box-sizing: border-box;">';
                    currentAmph.outerHTML = '<input type="text" class="small-select" placeholder="District / Town" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1; box-sizing: border-box;">';
                    currentTamb.outerHTML = '<input type="text" class="small-select" placeholder="Zip Code" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e1; box-sizing: border-box;">';
                } else {
                    // Reset input values
                    currentProv.value = '';
                    currentAmph.value = '';
                    currentTamb.value = '';
                }
            }
        });
    }
});
