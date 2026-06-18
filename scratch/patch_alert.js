const fs = require('fs');
const filePath = 'C:/project-programmer/Biomassx/js/order_new.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Login alerts
content = content.replace(
    "alert('กรุณาล็อกอินก่อนทำการบันทึกข้อมูล');",
    "Swal.fire({ icon: 'warning', title: 'กรุณาล็อกอิน', text: 'กรุณาล็อกอินก่อนทำการบันทึกข้อมูล' });"
);

content = content.replace(
    "alert('เซสชั่นหมดอายุ กรุณาล็อกอินใหม่');\n                window.location.href = 'login.html';",
    "Swal.fire({ icon: 'warning', title: 'เซสชั่นหมดอายุ', text: 'กรุณาล็อกอินใหม่' }).then(() => { window.location.href = 'login.html'; });"
);

// 2. Validation alerts
content = content.replace(
    "alert(\"กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ประเภทคำสั่ง, สินค้า, ปริมาณ, ราคา)\");",
    "Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ประเภทคำสั่ง, สินค้า, ปริมาณ, ราคา)' });"
);

content = content.replace(
    "alert(\"กรุณาระบุปริมาณและราคาให้ถูกต้อง (ต้องมากกว่า 0)\");",
    "Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ถูกต้อง', text: 'กรุณาระบุปริมาณและราคาให้ถูกต้อง (ต้องมากกว่า 0)' });"
);

// 3. Success Match / Pending alerts
content = content.replace(
    "alert(` จับคู่สำเร็จทันที! (Immediate Match)\\nระบบพบคำสั่งที่ตรงกันในตลาด สถานะของคุณคือ \"Matched\"\\n\\n รหัสสัญญาของคุณคือ: ${contractRef}`);",
    "Swal.fire({ icon: 'success', title: 'จับคู่สำเร็จทันที!', html: `ระบบพบคำสั่งที่ตรงกันในตลาด สถานะของคุณคือ \"Matched\"<br><br><b>รหัสสัญญา:</b> ${contractRef}` });"
);

content = content.replace(
    "alert(' บันทึกคำสั่งซื้อขายสำเร็จ!\\nคำสั่งของคุณอยู่ในสถานะ \"Pending\" เพื่อรอการจับคู่');",
    "Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: 'คำสั่งของคุณอยู่ในสถานะ \"Pending\" เพื่อรอการจับคู่' });"
);

// 4. Error alert
content = content.replace(
    "alert('เกิดข้อผิดพลาดจากระบบหลังบ้าน (Database Error):\\n' + (err.message || 'Unknown Error') + '\\n\\nข้อมูลยังไม่ถูกบันทึก');",
    "Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: (err.message || 'Unknown Error') + '\\n\\nข้อมูลยังไม่ถูกบันทึก' });"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Replaced alerts with Swal in order_new.js");
