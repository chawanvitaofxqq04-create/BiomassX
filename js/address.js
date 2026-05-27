document.addEventListener('DOMContentLoaded', () => {
    const provinceSelect = document.querySelector('.province-select');
    const smallSelects = document.querySelectorAll('.small-select');
    
    if (!provinceSelect || smallSelects.length < 2) return;
    
    const amphoeSelect = smallSelects[0];
    const tambonSelect = smallSelects[1];

    let provincesData = {};

    // ตั้งค่าเริ่มต้น
    provinceSelect.innerHTML = '<option value="">กำลังโหลดข้อมูล...</option>';
    provinceSelect.disabled = true;
    amphoeSelect.innerHTML = '<option value="">เลือก</option>';
    amphoeSelect.disabled = true;
    tambonSelect.innerHTML = '<option value="">เลือก</option>';
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

            // ใส่ข้อมูลลงใน dropdown จังหวัด
            provinceSelect.innerHTML = '<option value="">Select Province</option>';
            const sortedProvinces = Object.keys(provincesData).sort();
            sortedProvinces.forEach(prov => {
                const option = document.createElement('option');
                option.value = prov;
                option.textContent = prov;
                provinceSelect.appendChild(option);
            });
            
            provinceSelect.disabled = false;
        })
        .catch(err => {
            console.error("Failed to load Thai address data", err);
            provinceSelect.innerHTML = '<option value="">โหลดข้อมูลล้มเหลว</option>';
        });

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
});
