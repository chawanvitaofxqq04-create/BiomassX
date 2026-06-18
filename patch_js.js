const fs = require('fs');
const filepath = 'C:\\project-programmer\\Biomassx\\js\\order_new.js';
let content = fs.readFileSync(filepath, 'utf8');

const target = /created_at: new Date\(\)\.toISOString\(\)\s*};\s*\/\/ ตรวจสอบข้อมูลเบื้องต้น/;

const replacement = `created_at: new Date().toISOString()
            };

            // จัดการข้อมูลสำหรับ Global Market
            const marketplace = document.getElementById('marketplace') ? document.getElementById('marketplace').value : 'Local Market';
            if (marketplace === 'Global Market') {
                const globalPort = document.getElementById('globalPort') ? document.getElementById('globalPort').value : '';
                const globalIncoterms = document.getElementById('globalIncoterms') ? document.getElementById('globalIncoterms').value : '';
                const globalPeriod = document.getElementById('globalPeriod') ? document.getElementById('globalPeriod').value : '';
                const globalRegion = document.getElementById('globalRegion') ? document.getElementById('globalRegion').value : '';

                if (orderData.order_type === 'BUY') {
                    orderData.destination_port = globalPort;
                    orderData.origin_port = '-'; // ยังไม่ระบุต้นทาง (เป็นฝั่งซื้อรับของ)
                } else {
                    orderData.origin_port = globalPort;
                    orderData.destination_port = '-'; // ยังไม่ระบุปลายทาง (เป็นฝั่งขายส่งของ)
                }
                
                orderData.delivery_terms = globalIncoterms;
                orderData.delivery_period = globalPeriod;
                orderData.region = globalRegion;
                
                // สำหรับตลาดโลก จะไม่ได้ใช้ที่อยู่ตำบล/อำเภอ/จังหวัดในประเทศ
                orderData.province = '-';
                orderData.amphoe = '-';
                orderData.tambon = '-';
            } else {
                orderData.delivery_terms = document.getElementById('contractType') ? document.getElementById('contractType').value : 'EXW'; // ตลาดในประเทศ
                orderData.origin_port = '-';
                orderData.destination_port = '-';
            }

            // ตรวจสอบข้อมูลเบื้องต้น`;

content = content.replace(target, replacement);
fs.writeFileSync(filepath, content);
