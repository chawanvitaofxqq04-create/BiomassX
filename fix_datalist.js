const fs = require('fs');
const filePath = 'C:\\project-programmer\\Biomassx\\order.html';
let html = fs.readFileSync(filePath, 'utf8');
html = html.replace(/<datalist id="productOptions">[\s\S]*?<\/datalist>/, '<datalist id="productOptions"></datalist>');
fs.writeFileSync(filePath, html);
