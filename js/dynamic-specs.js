document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('productSelect');
    const dynamicSpecsContainer = document.getElementById('dynamicSpecsContainer');
    const dynamicFieldsGrid = document.getElementById('dynamicFieldsGrid');

    if (!productSelect || !dynamicSpecsContainer || !dynamicFieldsGrid) return;

    // Define specific fields for each group/product
    const specDefinitions = {
        // กลุ่มอัดเม็ด / อัดแท่ง / อัดก้อน
        pellets: [
            { id: 'spec_diameter', label: 'ขนาดเส้นผ่านศูนย์กลาง (มม.)', type: 'number', placeholder: 'เช่น 6 หรือ 8' },
            { id: 'spec_moisture', label: 'ความชื้นสูงสุด (%)', type: 'number', placeholder: 'เช่น 10' },
            { id: 'spec_ash', label: 'ปริมาณเถ้าสูงสุด (%)', type: 'number', placeholder: 'เช่น 1.5' },
            { id: 'spec_calorific', label: 'ค่าความร้อนสุทธิ (kcal/kg)', type: 'number', placeholder: 'เช่น 4000' }
        ],
        // กลุ่มวัสดุดิบ / สับ / ชิ้น (ทั่วไป)
        raw_chips: [
            { id: 'spec_size', label: 'ขนาดชิ้นไม้ / Screen Size', type: 'text', placeholder: 'เช่น G30, <40mm' },
            { id: 'spec_moisture', label: 'ความชื้น (%)', type: 'number', placeholder: 'เช่น 35' },
            { id: 'spec_impurities', label: 'สิ่งเจือปน (%)', type: 'number', placeholder: 'เช่น 2' }
        ],
        // ไม้ท่อน
        logs: [
            { id: 'spec_log_diameter', label: 'เส้นผ่านศูนย์กลางท่อน (นิ้ว/ซม.)', type: 'text', placeholder: 'เช่น 2-5 นิ้ว' },
            { id: 'spec_log_length', label: 'ความยาวท่อน (เมตร)', type: 'number', placeholder: 'เช่น 1' },
            { id: 'spec_moisture', label: 'ความชื้น (%)', type: 'number', placeholder: 'เช่น 45' }
        ],
        // กะลาปาล์ม
        pks: [
            { id: 'spec_calorific', label: 'ค่าความร้อน (kcal/kg)', type: 'number', placeholder: 'เช่น 4000' },
            { id: 'spec_moisture', label: 'ความชื้นรวม (%)', type: 'number', placeholder: 'เช่น 15' },
            { id: 'spec_fiber', label: 'เส้นใย/สิ่งเจือปน (%)', type: 'number', placeholder: 'เช่น 3' }
        ],
        // ถ่านและถ่านชีวภาพ
        biochar: [
            { id: 'spec_fixed_carbon', label: 'คาร์บอนคงตัว (%)', type: 'number', placeholder: 'เช่น 75' },
            { id: 'spec_volatile_matter', label: 'สารระเหย (%)', type: 'number', placeholder: 'เช่น 15' },
            { id: 'spec_ash', label: 'ปริมาณเถ้า (%)', type: 'number', placeholder: 'เช่น 5' },
            { id: 'spec_calorific', label: 'ค่าความร้อน (kcal/kg)', type: 'number', placeholder: 'เช่น 6500' }
        ],
        // ของเหลว/ก๊าซ
        liquid_gas: [
            { id: 'spec_purity', label: 'ความบริสุทธิ์ (%)', type: 'number', placeholder: 'เช่น 99.5' },
            { id: 'spec_density', label: 'ความหนาแน่น (kg/L หรือ kg/m³)', type: 'text', placeholder: 'เช่น 0.88' },
            { id: 'spec_flash_point', label: 'จุดวาบไฟ / Methane Content', type: 'text', placeholder: 'ระบุข้อมูลจำเพาะ' }
        ]
    };

    // Map each product to a specific definition group
    const productMap = {
        'ชานอ้อยอัดก้อน': 'pellets',
        'ชานอ้อยอัดเม็ด': 'pellets',
        'ถ่านไม้อัดแท่ง': 'pellets',
        'ไผ่อัดเม็ด': 'pellets',
        'เปลือกไม้อัดเม็ด': 'pellets',
        'แกลบอัดแท่ง': 'pellets',
        'แกลบอัดเม็ด': 'pellets',

        'ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)': 'logs',

        'ชานอ้อย': 'raw_chips',
        'ไผ่': 'raw_chips',
        'ไผ่สับ': 'raw_chips',
        'เปลือกไม้': 'raw_chips',
        'แกลบ': 'raw_chips',
        'ขี้เลื่อยไม้ยางพารา': 'raw_chips',
        'ปีกไม้ยางพารา': 'raw_chips',

        'กะลาปาล์ม': 'pks',

        'ถ่านไผ่': 'biochar',
        'ถ่านไบโอชาร์': 'biochar',
        'ถ่านหินชีวภาพ (ทำจากวัสดุไม่ใช่ไม้)': 'biochar',
        'ถ่านหินชีวภาพ (ทำจากไม้)': 'biochar',

        'ไบโอ CNG': 'liquid_gas',
        'ไบโอดีเซล': 'liquid_gas',
        'ไบโอเอทานอล': 'liquid_gas',
        'ไบโอ LNG': 'liquid_gas'
    };

    productSelect.addEventListener('change', (e) => {
        const selectedProduct = e.target.value;
        const groupKey = productMap[selectedProduct];

        if (!groupKey) {
            dynamicSpecsContainer.style.display = 'none';
            dynamicFieldsGrid.innerHTML = '';
            return;
        }

        const fieldsToRender = specDefinitions[groupKey];
        dynamicFieldsGrid.innerHTML = ''; // Clear old

        fieldsToRender.forEach(field => {
            const html = `
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.9rem; color: #334155;">${field.label}</label>
                    <input type="${field.type}" class="dynamic-spec-input" data-key="${field.label}" placeholder="${field.placeholder}" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
                </div>
            `;
            dynamicFieldsGrid.insertAdjacentHTML('beforeend', html);
        });

        dynamicSpecsContainer.style.display = 'block';
    });

    // We also need a way for create-order.js to get this data
    window.getDynamicSpecs = function() {
        if (dynamicSpecsContainer.style.display === 'none') return null;
        
        const inputs = document.querySelectorAll('.dynamic-spec-input');
        let specsObj = {};
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                specsObj[input.getAttribute('data-key')] = input.value.trim();
            }
        });
        return specsObj;
    };
});
