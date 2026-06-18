const crypto = require('crypto');
function uuidv4() { return crypto.randomUUID(); }

const users = [
    { id: '06f14ae3-b717-4814-8d05-de3a79866a07', name: 'สมศรี' },
    { id: 'be3e315c-aaf8-4757-bd33-95b17fe87a2a', name: 'ปนัดดา' },
    { id: 'cf9b1908-cb42-4364-b557-4eab58a0719a', name: 'ชวัลวิชญ์' },
    { id: 'de2e2199-8bd2-40e5-ac17-b8e9dff770e8', name: 'สมชาย' }
];

const products = [
    { id: 'Woodchip', name: 'ไม้สับ' },
    { id: 'Sawdust', name: 'ขี้เลื่อย' },
    { id: 'Rice Husk Ash', name: 'ขี้เถ้าแกลบ' },
    { id: 'Palm Kernel Shell', name: 'กะลาปาล์ม' },
    { id: 'Wood Log', name: 'ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)' }
];

const provinces = ['เชียงใหม่', 'ชลบุรี', 'ขอนแก่น', 'สงขลา', 'กรุงเทพมหานคร', 'นครราชสีมา', 'สุราษฎร์ธานี'];

function randItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randPrice() {
    return (Math.floor(Math.random() * 20) + 10) * 100; // 1000 - 3000
}

function randQty() {
    return (Math.floor(Math.random() * 50) + 10) * 10; // 100 - 600
}

let sql = `INSERT INTO public.orders (id, user_id, order_type, product, product_name, quantity, unit, price, currency, marketplace, quality, contract_type, payment_term, packing, province, amphoe, tambon, status, matched_with_name, created_at) VALUES\n`;

const orders = [];

// Generate 16 Pending orders
for(let i=0; i<16; i++) {
    const user = randItem(users);
    const prod = randItem(products);
    const prov = randItem(provinces);
    const type = Math.random() > 0.5 ? 'Buy' : 'Sell';
    const price = randPrice();
    const qty = randQty();
    const id = uuidv4();
    
    orders.push({
        id,
        user_id: user.id,
        order_type: type,
        product: prod.id,
        product_name: prod.name,
        quantity: qty,
        unit: 'MT',
        price: price,
        currency: 'THB',
        marketplace: 'Exchange Board',
        quality: 'Standardised',
        contract_type: 'Spot',
        payment_term: 'Standard',
        packing: 'Standard',
        province: prov,
        amphoe: '',
        tambon: '',
        status: 'Pending',
        matched_with_name: `CREATOR:${user.name}`,
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    });
}

// Generate 7 pairs of Matched orders (14 total)
for(let i=0; i<7; i++) {
    const u1 = randItem(users);
    let u2 = randItem(users);
    while(u1.id === u2.id) u2 = randItem(users);
    
    const prod = randItem(products);
    const prov = randItem(provinces);
    const price = randPrice();
    const qty = randQty();
    
    const id1 = uuidv4();
    const id2 = uuidv4();
    
    // Order 1 (Buy)
    orders.push({
        id: id1,
        user_id: u1.id,
        order_type: 'Buy',
        product: prod.id,
        product_name: prod.name,
        quantity: qty,
        unit: 'MT',
        price: price,
        currency: 'THB',
        marketplace: 'Exchange Board',
        quality: 'Standardised',
        contract_type: 'Spot',
        payment_term: 'Standard',
        packing: 'Standard',
        province: prov,
        amphoe: '',
        tambon: '',
        status: 'Matched',
        matched_with_name: `${u2.name}|${id2}`,
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    });
    
    // Order 2 (Sell)
    orders.push({
        id: id2,
        user_id: u2.id,
        order_type: 'Sell',
        product: prod.id,
        product_name: prod.name,
        quantity: qty,
        unit: 'MT',
        price: price,
        currency: 'THB',
        marketplace: 'Exchange Board',
        quality: 'Standardised',
        contract_type: 'Spot',
        payment_term: 'Standard',
        packing: 'Standard',
        province: prov,
        amphoe: '',
        tambon: '',
        status: 'Matched',
        matched_with_name: `${u1.name}|${id1}`,
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    });
}

const values = orders.map(o => `('${o.id}', '${o.user_id}', '${o.order_type}', '${o.product}', '${o.product_name}', ${o.quantity}, '${o.unit}', ${o.price}, '${o.currency}', '${o.marketplace}', '${o.quality}', '${o.contract_type}', '${o.payment_term}', '${o.packing}', '${o.province}', '${o.amphoe}', '${o.tambon}', '${o.status}', '${o.matched_with_name}', '${o.created_at}')`);

sql += values.join(',\n') + ';';

const fs = require('fs');
fs.writeFileSync('C:\\Users\\chawa\\.gemini\\antigravity\\brain\\6e4d547c-6c18-4832-b6cf-48d3df55382c\\mock_orders.sql', sql);
console.log('Done');
