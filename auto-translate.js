const fs = require('fs');
const https = require('https');

const products = [
    "ตลาดท้องถิ่น", "(ในประเทศ)", "ขาย", "ซื้อ", "ยังไม่มีข้อมูลสินค้าในขณะนี้",
    "ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)", "ชานอ้อย", "ชานอ้อยอัดก้อน", "ชานอ้อยอัดเม็ด", "ไผ่",
    "ถ่านไผ่", "ถ่านไผ่อัดแท่ง", "ไผ่สับ", "ไผ่อัดเม็ด", "เปลือกไม้", "ถ่านไบโอชาร์", "ไบโอ CNG",
    "กะลามะพร้าว", "ทางมะพร้าว", "กากกาแฟ", "กากกาแฟอัดเม็ด", "เศษวัสดุก่อสร้าง", "ความเย็น",
    "ข้าวโพด", "ซังข้าวโพด", "ซังข้าวโพดสับ", "ซังข้าวโพดอัดเม็ด", "ใบข้าวโพด", "ฟางข้าวโพด",
    "ถ่านหินชีวภาพ (ทำจากวัสดุไม่ใช่ไม้)", "ถ่านหินชีวภาพ (ทำจากไม้)", "ถ่านไบโอโค้ก", "ไบโอดีเซล",
    "ไบโอเอทานอล", "ไบโอแก๊ส", "ไบโอ LNG", "ไบโอมีเทน", "น้ำมันยางดำ", "กากเบียร์", "บิวทานอล",
    "หัวมันสำปะหลัง", "ใบมันสำปะหลัง", "เหง้ามัน", "ต้นมันสำปะหลังสับ", "ต้นมันสำปะหลังอัดเม็ด",
    "ต้นมันสำปะหลัง", "เอทานอลจากเซลลูโลส", "ถ่าน", "ถ่านอัดเม็ด", "สาหร่ายคลอเรลล่า", "แป้งมันสำปะหลังหยาบ",
    "เปลือกมะพร้าว", "เปลือกมะพร้าวสับ", "เปลือกมะพร้าวอัดเม็ด", "ถ่านกะลามะพร้าว", "ถ่านกะลามะพร้าวอัดแท่ง",
    "ต้นนุ่น", "เศษไม้ก่อสร้าง", "กากการกลั่น", "แหน", "สาหร่ายดูนาลิเอลล่า", "ไม้ท่อน (ยูคาลิปตัส)", "ตอไม้ยูคาลิปตัส", "ไม้ฟืน", "เศษอาหาร", "เมล็ดผลไม้", "กากผลไม้", "ต้นอ้อยยักษ์",
    "ข้าวฟ่าง", "ต้นข้าวฟ่างอัดเม็ด", "สาหร่ายสไปรูลินา", "ไอน้ำ", "อ้อย", "ใบอ้อยมัด", "ใบอ้อยอัดก้อน", "ใบอ้อยอัดเม็ด", "หญ้าสวิตช์กราส", "มันเส้น", "เศษตัดแต่งส่วนไม้ตาย", "เศษตัดขยายระยะ", "เศษตัดแต่งต้นไม้", "สาหร่ายผักกาดทะเล", "น้ำมันพืชใช้แล้ว",
    "เค้กอุตสาหกรรมน้ำมันพืช", "สาหร่ายแดง (โรโดไฟตา)", "หญ้าริบบิ้น", "ก๊าซธรรมชาติหมุนเวียน", "แกลบ", "ฟางข้าว", "ฟางข้าวอัดเม็ด", "ไม้ท่อน (ยางพารา)", "ตอไม้ยางพารา", "สาหร่ายซาร์กัสซัม", "ขี้เลื่อย", "สาหร่ายทะเล", "กากตะกอนน้ำเสีย", "ขี้กบ", "กากโรงฆ่าสัตว์",
    "หญ้าเนเปียร์อัดเม็ด", "เปลือกถั่ว", "ไม้พาเลทรองสินค้า", "ทะลายปาล์ม", "กะลาปาล์ม", "ทางปาล์ม", "ตอปาล์ม", "ต้นปาล์ม", "กระดาษและกระดาษแข็ง", "กากตะกอนเยื่อกระดาษ", "ใบสับปะรด", "ไม้ท่อน (สน)", "ไม้โป๊ปลาร์", "วัสดุรองคอสัตว์ปีก", "ไฟฟ้า",
    "สาหร่ายกราซิลลาเรีย", "กรีนไฮโดรเจน", "ความร้อน", "กัญชง", "น้ำมัน HVO", "แป้งมันฝรั่งเกรดอุตสาหกรรม", "สบู่ดำ", "สาหร่ายเคลป์", "ปอ", "ปออัดเม็ด", "ไม้ท่อน (กระถินยักษ์)", "ปลายไม้ (เศษวัสดุทำไม้)", "ปุ๋ยมูลสัตว์", "หญ้ามิสแคนทัส", "หญ้าเนเปียร์",
    "กากน้ำมันพืช", "ผักตบชวา", "ฟางข้าวฟ่าง", "ต้นข้าวสาลีอัดเม็ด", "ต้นหลิว", "ไม้อัดก้อน", "ถ่านไม้", "ถ่านไม้อัดแท่ง", "ไม้สับ (เชื้อเพลิง)", "ไม้สับ (เยื่อและกระดาษ)", "ผงไม้บด", "ไม้ท่อน (ระบุชนิดไม้ที่หมายเหตุ)", "ไม้ป่น", "ไม้อัดเม็ด", "ปีกไม้", "ของเสียสวน"
];

const langs = ['ja', 'ko', 'vi', 'pt', 'es', 'id', 'de', 'hi', 'fr', 'ru'];

function translateText(text, targetLang) {
    return new Promise((resolve) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=th&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ word: text, translation: parsed[0][0][0] });
                } catch (e) {
                    resolve({ word: text, translation: text }); // fallback
                }
            });
        }).on('error', () => resolve({ word: text, translation: text }));
    });
}

// Helper to process in batches to prevent overwhelming the API
async function processBatch(words, targetLang, batchSize = 10) {
    const results = {};
    for (let i = 0; i < words.length; i += batchSize) {
        const batch = words.slice(i, i + batchSize);
        const promises = batch.map(word => translateText(word, targetLang));
        const batchResults = await Promise.all(promises);
        for (const res of batchResults) {
            results[res.word] = res.translation;
        }
        process.stdout.write('.');
    }
    return results;
}

async function main() {
    console.log("Starting FAST Auto-Translation Script...");
    const filePath = 'C:/project-programmer/Biomassx/js/translations.js';
    
    for (const lang of langs) {
        let fileContent = fs.readFileSync(filePath, 'utf8');
        let jsonStr = fileContent.replace('const translations = ', '').replace(/;\s*window\.translations\s*=\s*translations;\s*$/, '').trim();
        if(jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
        
        let dict;
        try {
            dict = eval('(' + jsonStr + ')');
        } catch (e) {
            console.error("Failed to parse translations.js", e);
            return;
        }

        if (!dict[lang]) dict[lang] = {};
        
        // Find missing words
        const missingWords = products.filter(word => !dict[lang][word]);
        
        if (missingWords.length > 0) {
            console.log(`\nProcessing language: ${lang} (${missingWords.length} words remaining)`);
            const results = await processBatch(missingWords, lang, 10);
            
            // Merge
            for (const word in results) {
                dict[lang][word] = results[word];
            }
            
            // Save immediately after each language
            const newContent = `const translations = ${JSON.stringify(dict, null, 4)};\n\nwindow.translations = translations;`;
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`\nSaved ${lang} to translations.js`);
        } else {
            console.log(`\nLanguage ${lang} already complete.`);
        }
    }

    console.log(`\nAll languages fully translated!`);
}

main();
