// ข้อมูลสินค้าที่แสดง (142 รายการ ตามลำดับใหม่)
const allProducts = [
  "สบู่ดำ",
  "สาหร่ายเคลป์",
  "ปอ",
  "ปออัดเม็ด",
  "ใบกระถินสับ",
  "ใบกระถินป่น",
  "ใบกระถินอัดเม็ด",
  "ไม้ท่อน (กระถินยักษ์)",
  "ปลายไม้ (เศษวัสดุทำไม้)",
  "ปุ๋ยมูลสัตว์",
  "หญ้ามิสแคนทัส",
  "หญ้าเนเปียร์",
  "หน้าเนเปียร์อัดเม็ด",
  "เปลือกถั่ว",
  "ไม้พาเลทรองสินค้า",
  "ทะลายปาล์ม",
  "กะลาปาล์ม",
  "ทางปาล์ม",
  "ต้นนุ่น",
  "เศษไม้ก่อสร้าง",
  "กากการกลั่น",
  "แหน",
  "สาหร่ายดูนาลิเอลล่า",
  "ไม้ท่อน (ยูคาลิปตัส)",
  "ตอไม้ยูคาลิปตัส",
  "ไม้ฟืน",
  "เศษอาหาร",
  "เมล็ดผลไม้",
  "กากผลไม้",
  "ต้นอ้อยยักษ์",
  "สาหร่ายกราซิลาเรีย",
  "กรีนไฮโดรเจน",
  "ความร้อน",
  "กัญชง",
  "น้ำมัน HVO",
  "แป้งมันฝรั่งเกรดอุตสาหกรรม",
  "แป้งมันสำปะหลังหยาบ",
  "เปลือกมะพร้าว",
  "เปลือกมะพร้าวสับ",
  "เปลือกมะพร้าวอัดเม็ด",
  "ถ่านกะลามะพร้าว",
  "ถ่านกะลามะพร้าวอัดแท่ง",
  "กะลามะพร้าว",
  "ทางมะพร้าว",
  "กากกาแฟ",
  "กากกาแฟอัดเม็ด",
  "เศษวัสดุก่อสร้าง",
  "ความเย็น",
  "ข้าวโพด",
  "ซังข้าวโพด",
  "ซังข้าวโพดสับ",
  "ซังข้าวโพดอัดเม็ด",
  "ใบข้าวโพด",
  "ฟางข้าวโพด",
  "ไบโอดีเซล",
  "ไบโอเอทานอล",
  "ไบโอแก๊ส",
  "ไบโอ LNG",
  "ไบโอมีเทน",
  "น้ำมันยางดำ",
  "กากเบียร์",
  "บิวทานอล",
  "หัวมันสำปะหลัง",
  "ใบมันสำปะหลัง",
  "เหง้ามัน",
  "ต้นมันสำปะหลังสับ",
  "ต้นมันสำปะหลังอัดเม็ด",
  "ต้นมันสำปะหลัง",
  "เอทานอลจากเซลลูโลส",
  "ถ่าน",
  "ถ่านอัดเม็ด",
  "สาหร่ายคลอเรลล่า",
  "ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)",
  "ชานอ้อย",
  "ชานอ้อยอัดก้อน",
  "ชานอ้อยอัดเม็ด",
  "ไผ่",
  "ถ่านไผ่",
  "ถ่านไผ่อัดแท่ง",
  "ไผ่สับ",
  "ไผ่อัดเม็ด",
  "เปลือกไม้",
  "ถ่านไบโอชาร์",
  "ไบโอ CNG",
  "ถ่านหินชีวภาพ (ทำจากวัสดุไม่ใช่ไม้)",
  "ถ่านหินชีวภาพ (ทำจากไม้)",
  "ถ่านไบโอโค้ก",
  "ตอปาล์ม",
  "ต้นปาล์ม",
  "กระดาษและกระดาษแข็ง",
  "กากตะกอนเยื่อกระดาษ",
  "ใบสับปะรด",
  "ไม้ท่อน (สน)",
  "ไม้โป๊ปลาร์",
  "วัสดุรองคอสัตว์ปีก",
  "ไฟฟ้า",
  "เค้กอุตสาหกรรมน้ำมันพืช",
  "สาหร่ายแดง (โรโดไฟตา)",
  "หญ้าริบบิ้น",
  "ก๊าซธรรมชาติหมุนเวียน",
  "แกลบ",
  "ฟางข้าว",
  "ฟางข้าวอัดเม็ด",
  "ไม้ท่อน (ยางพารา)",
  "ตอไม้ยางพารา",
  "ไม้ป่น",
  "ไม้อัดเม็ด",
  "ปีกไม้",
  "ของเสียสวน",
  "มันเส้น",
  "เศษตัดแต่งส่วนไม้ตาย",
  "เศษตัดขยายระยะ",
  "เศษตัดแต่งต้นไม้",
  "สาหร่ายผักกาดทะเล",
  "น้ำมันพืชใช้แล้ว",
  "กากน้ำมันพืช",
  "ผักตบชวา",
  "ฟางข้าวฟ่าง",
  "ต้นข้าวสาลีอัดเม็ด",
  "ต้นหลิว",
  "ไม้อัดก้อน",
  "ถ่านไม้",
  "ถ่านไม้อัดแท่ง",
  "ไม้สับ (เชื้อเพลิง)",
  "ไม้สับ (เยื่อและกระดาษ)",
  "ผงไม้บด",
  "ไม้ท่อน (ระบุชนิดไม้ที่หมายเหตุ)",
  "สาหร่ายซาร์กาสซัม",
  "ขี้เลื่อย",
  "สาหร่ายทะเล",
  "กากตะกอนน้ำเสีย",
  "ขี้กบ",
  "กากโรงฆ่าสัตว์",
  "ข้าวฟ่าง",
  "ต้นข้าวฟ่างอัดเม็ด",
  "สาหร่ายสไปรูลินา",
  "ไอน้ำ",
  "อ้อย",
  "ใบอ้อยมัด",
  "ใบอ้อยอัดก้อน",
  "ใบอ้อยอัดเม็ด",
  "หญ้าสวิตช์กราซ"
];

// ข้อมูลจำเพาะของแต่ละสินค้า
const productData = {
  "สบู่ดำ": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14214-Standard"
      },
      {
        "label": "Forms",
        "value": "Seeds, Oil"
      },
      {
        "label": "Sources",
        "value": "Jatropha plantations"
      },
      {
        "label": "Applications",
        "value": "Biodiesel"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "สาหร่ายเคลป์": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade / ISO 17225"
      },
      {
        "label": "Forms",
        "value": "Raw, Dried"
      },
      {
        "label": "Sources",
        "value": "Marine cultivation"
      },
      {
        "label": "Applications",
        "value": "Biogas, Animal feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "ปอ": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Bales, Fiber"
      },
      {
        "label": "Sources",
        "value": "Crop residue"
      },
      {
        "label": "Applications",
        "value": "Paper pulp, Boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ปออัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processed fibers"
      },
      {
        "label": "Applications",
        "value": "Industrial heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ใบกระถินสับ": {
    "cats": [
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชอาหารสัตว์",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "standards": "TAS 8805",
    "grades": ["Premium", "เกรด 1", "เกรด 2"],
    "specs": [
      {
        "label": "Quality",
        "value": "TAS 8805"
      },
      {
        "label": "Forms",
        "value": "Chopped"
      },
      {
        "label": "Sources",
        "value": "Leucaena plantations"
      },
      {
        "label": "Applications",
        "value": "Ruminant feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ใบกระถินป่น": {
    "cats": [
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชอาหารสัตว์",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "standards": "TAS 8805",
    "grades": ["Premium", "เกรด 1", "เกรด 2"],
    "specs": [
      {
        "label": "Quality",
        "value": "TAS 8805"
      },
      {
        "label": "Forms",
        "value": "Powder"
      },
      {
        "label": "Sources",
        "value": "Dried leaves"
      },
      {
        "label": "Applications",
        "value": "Feed additive"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ใบกระถินอัดเม็ด": {
    "cats": [
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชอาหารสัตว์",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "standards": "TAS 8805",
    "grades": ["Premium", "เกรด 1", "เกรด 2"],
    "specs": [
      {
        "label": "Quality",
        "value": "TAS 8805"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Compressed powder"
      },
      {
        "label": "Applications",
        "value": "Livestock feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไม้ท่อน (กระถินยักษ์)": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Logs, Billets"
      },
      {
        "label": "Sources",
        "value": "Energy crop farming"
      },
      {
        "label": "Applications",
        "value": "Energy generation"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ปลายไม้ (เศษวัสดุทำไม้)": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Chips, Scrap"
      },
      {
        "label": "Sources",
        "value": "Sawmills"
      },
      {
        "label": "Applications",
        "value": "Biomass power"
      },
      {
        "label": "Carbon Factor",
        "value": "0.012x"
      }
    ]
  },
  "ปุ๋ยมูลสัตว์": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Organic Standard"
      },
      {
        "label": "Forms",
        "value": "Solid, Composted"
      },
      {
        "label": "Sources",
        "value": "Livestock farms"
      },
      {
        "label": "Applications",
        "value": "Biogas, Fertilizer"
      },
      {
        "label": "Carbon Factor",
        "value": "0.04x"
      }
    ]
  },
  "หญ้ามิสแคนทัส": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Baled, Chopped"
      },
      {
        "label": "Sources",
        "value": "Dedicated plantations"
      },
      {
        "label": "Applications",
        "value": "Combustion, Bedding"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "หญ้าเนเปียร์": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Biogas Feedstock"
      },
      {
        "label": "Forms",
        "value": "Fresh, Silage"
      },
      {
        "label": "Sources",
        "value": "Napier plantations"
      },
      {
        "label": "Applications",
        "value": "Biogas, Cattle feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "หน้าเนเปียร์อัดเม็ด": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Compressed grass"
      },
      {
        "label": "Applications",
        "value": "Biomass boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "เปลือกถั่ว": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Loose, Briquettes"
      },
      {
        "label": "Sources",
        "value": "Nut processing"
      },
      {
        "label": "Applications",
        "value": "Direct combustion"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ไม้พาเลทรองสินค้า": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Recycled Wood Standard"
      },
      {
        "label": "Forms",
        "value": "Shredded, Chips"
      },
      {
        "label": "Sources",
        "value": "Warehousing waste"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ทะลายปาล์ม": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Shredded"
      },
      {
        "label": "Sources",
        "value": "Palm oil mills"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.018x"
      }
    ]
  },
  "กะลาปาล์ม": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Crushed shells"
      },
      {
        "label": "Sources",
        "value": "Palm oil mills"
      },
      {
        "label": "Applications",
        "value": "Co-firing"
      },
      {
        "label": "Carbon Factor",
        "value": "0.025x"
      }
    ]
  },
  "ทางปาล์ม": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Chopped"
      },
      {
        "label": "Sources",
        "value": "Palm plantations"
      },
      {
        "label": "Applications",
        "value": "Combustion"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ต้นนุ่น": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Raw, Baled"
      },
      {
        "label": "Sources",
        "value": "Crop residue"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "เศษไม้ก่อสร้าง": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Recycled Wood Standard"
      },
      {
        "label": "Forms",
        "value": "Chips, Scrap"
      },
      {
        "label": "Sources",
        "value": "Construction sites"
      },
      {
        "label": "Applications",
        "value": "Biomass boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.012x"
      }
    ]
  },
  "กากการกลั่น": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Waste Management Std"
      },
      {
        "label": "Forms",
        "value": "Sludge"
      },
      {
        "label": "Sources",
        "value": "Distilleries"
      },
      {
        "label": "Applications",
        "value": "Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.03x"
      }
    ]
  },
  "แหน": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Fresh, Dried"
      },
      {
        "label": "Sources",
        "value": "Waterways"
      },
      {
        "label": "Applications",
        "value": "Feed, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.04x"
      }
    ]
  },
  "สาหร่ายดูนาลิเอลล่า": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาฯ",
      "วัสดุฯ"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาฯ",
      "วัสดุฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio Grade"
      },
      {
        "label": "Forms",
        "value": "Extract, Powder"
      },
      {
        "label": "Sources",
        "value": "Aquaculture"
      },
      {
        "label": "Applications",
        "value": "Biochemicals"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "ไม้ท่อน (ยูคาลิปตัส)": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14961-1"
      },
      {
        "label": "Forms",
        "value": "Logs"
      },
      {
        "label": "Sources",
        "value": "Eucalyptus farms"
      },
      {
        "label": "Applications",
        "value": "Power generation"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ตอไม้ยูคาลิปตัส": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Shredded roots"
      },
      {
        "label": "Sources",
        "value": "Plantations"
      },
      {
        "label": "Applications",
        "value": "Industrial heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.012x"
      }
    ]
  },
  "ไม้ฟืน": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-5-Standard"
      },
      {
        "label": "Forms",
        "value": "Split logs"
      },
      {
        "label": "Sources",
        "value": "Forestry"
      },
      {
        "label": "Applications",
        "value": "Domestic/Ind heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "เศษอาหาร": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Organic Waste Std"
      },
      {
        "label": "Forms",
        "value": "Mixed wet"
      },
      {
        "label": "Sources",
        "value": "Municipal"
      },
      {
        "label": "Applications",
        "value": "Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.04x"
      }
    ]
  },
  "เมล็ดผลไม้": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Pits, Seeds"
      },
      {
        "label": "Sources",
        "value": "Food processing"
      },
      {
        "label": "Applications",
        "value": "Combustion"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "กากผลไม้": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Organic Residue Std"
      },
      {
        "label": "Forms",
        "value": "Sludge, Dried"
      },
      {
        "label": "Sources",
        "value": "Juice factories"
      },
      {
        "label": "Applications",
        "value": "Biogas, Compost"
      },
      {
        "label": "Carbon Factor",
        "value": "0.025x"
      }
    ]
  },
  "ต้นอ้อยยักษ์": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Baled, Chopped"
      },
      {
        "label": "Sources",
        "value": "Energy farms"
      },
      {
        "label": "Applications",
        "value": "Power generation"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "สาหร่ายกราซิลาเรีย": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Dried"
      },
      {
        "label": "Sources",
        "value": "Marine farms"
      },
      {
        "label": "Applications",
        "value": "Feed additive"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "กรีนไฮโดรเจน": {
    "cats": [],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 14687"
      },
      {
        "label": "Forms",
        "value": "Gas"
      },
      {
        "label": "Sources",
        "value": "Electrolysis plants"
      },
      {
        "label": "Applications",
        "value": "Fuel cells"
      },
      {
        "label": "Carbon Factor",
        "value": "0.00x"
      }
    ]
  },
  "ความร้อน": {
    "cats": [],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Thermal Energy Std"
      },
      {
        "label": "Forms",
        "value": "Thermal"
      },
      {
        "label": "Sources",
        "value": "Biomass plants"
      },
      {
        "label": "Applications",
        "value": "Industrial use"
      },
      {
        "label": "Carbon Factor",
        "value": "0.00x"
      }
    ]
  },
  "กัญชง": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Fiber Grade"
      },
      {
        "label": "Forms",
        "value": "Hurd, Fiber"
      },
      {
        "label": "Sources",
        "value": "Hemp farms"
      },
      {
        "label": "Applications",
        "value": "Textiles, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "น้ำมัน HVO": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 15940"
      },
      {
        "label": "Forms",
        "value": "Liquid fuel"
      },
      {
        "label": "Sources",
        "value": "Bio-refineries"
      },
      {
        "label": "Applications",
        "value": "Transportation"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "แป้งมันฝรั่งเกรดอุตสาหกรรม": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Industrial Starch Std"
      },
      {
        "label": "Forms",
        "value": "Powder"
      },
      {
        "label": "Sources",
        "value": "Food waste"
      },
      {
        "label": "Applications",
        "value": "Bioethanol"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "แป้งมันสำปะหลังหยาบ": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Industrial Grade"
      },
      {
        "label": "Forms",
        "value": "Powder"
      },
      {
        "label": "Sources",
        "value": "Cassava mills"
      },
      {
        "label": "Applications",
        "value": "Ethanol production"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "เปลือกมะพร้าว": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Whole, Husk"
      },
      {
        "label": "Sources",
        "value": "Coconut farms"
      },
      {
        "label": "Applications",
        "value": "Direct heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "เปลือกมะพร้าวสับ": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Chopped"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "เปลือกมะพร้าวอัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ถ่านกะลามะพร้าว": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Charcoal Standard"
      },
      {
        "label": "Forms",
        "value": "Crushed"
      },
      {
        "label": "Sources",
        "value": "Kilns"
      },
      {
        "label": "Applications",
        "value": "Cooking, Ind heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านกะลามะพร้าวอัดแท่ง": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Charcoal Briquette Std"
      },
      {
        "label": "Forms",
        "value": "Briquettes"
      },
      {
        "label": "Sources",
        "value": "Processing plants"
      },
      {
        "label": "Applications",
        "value": "BBQ, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "กะลามะพร้าว": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Halves, Crushed"
      },
      {
        "label": "Sources",
        "value": "Coconut farms"
      },
      {
        "label": "Applications",
        "value": "Co-firing"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ทางมะพร้าว": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Shredded"
      },
      {
        "label": "Sources",
        "value": "Plantations"
      },
      {
        "label": "Applications",
        "value": "Combustion"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "กากกาแฟ": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Organic Waste Std"
      },
      {
        "label": "Forms",
        "value": "Wet grounds"
      },
      {
        "label": "Sources",
        "value": "Cafes, Factories"
      },
      {
        "label": "Applications",
        "value": "Biogas, Compost"
      },
      {
        "label": "Carbon Factor",
        "value": "0.03x"
      }
    ]
  },
  "กากกาแฟอัดเม็ด": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Pellet stoves"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "เศษวัสดุก่อสร้าง": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Recycled Wood Std"
      },
      {
        "label": "Forms",
        "value": "Mixed scrap"
      },
      {
        "label": "Sources",
        "value": "Demolition"
      },
      {
        "label": "Applications",
        "value": "Boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ความเย็น": {
    "cats": [],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Cooling Energy Std"
      },
      {
        "label": "Forms",
        "value": "Thermal"
      },
      {
        "label": "Sources",
        "value": "Tri-generation"
      },
      {
        "label": "Applications",
        "value": "HVAC"
      },
      {
        "label": "Carbon Factor",
        "value": "0.00x"
      }
    ]
  },
  "ข้าวโพด": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed/Energy Grade"
      },
      {
        "label": "Forms",
        "value": "Whole grain"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Ethanol, Feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ซังข้าวโพด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Whole cob"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Direct heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ซังข้าวโพดสับ": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Chopped"
      },
      {
        "label": "Sources",
        "value": "Mills"
      },
      {
        "label": "Applications",
        "value": "Boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ซังข้าวโพดอัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ใบข้าวโพด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Baled"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Combustion"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ฟางข้าวโพด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Baled"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Heating, Bedding"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ไบโอดีเซล": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14214"
      },
      {
        "label": "Forms",
        "value": "Liquid"
      },
      {
        "label": "Sources",
        "value": "Refineries"
      },
      {
        "label": "Applications",
        "value": "Vehicles"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไบโอเอทานอล": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 15376"
      },
      {
        "label": "Forms",
        "value": "Liquid"
      },
      {
        "label": "Sources",
        "value": "Distilleries"
      },
      {
        "label": "Applications",
        "value": "Fuel blending"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไบโอแก๊ส": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Biogas Standard"
      },
      {
        "label": "Forms",
        "value": "Gas"
      },
      {
        "label": "Sources",
        "value": "Digesters"
      },
      {
        "label": "Applications",
        "value": "Power gen, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.005x"
      }
    ]
  },
  "ไบโอ LNG": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio-LNG Standard"
      },
      {
        "label": "Forms",
        "value": "Liquefied Gas"
      },
      {
        "label": "Sources",
        "value": "Upgrading plants"
      },
      {
        "label": "Applications",
        "value": "Transport"
      },
      {
        "label": "Carbon Factor",
        "value": "0.005x"
      }
    ]
  },
  "ไบโอมีเทน": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio-methane Std"
      },
      {
        "label": "Forms",
        "value": "Gas"
      },
      {
        "label": "Sources",
        "value": "Upgrading plants"
      },
      {
        "label": "Applications",
        "value": "Grid injection"
      },
      {
        "label": "Carbon Factor",
        "value": "0.005x"
      }
    ]
  },
  "น้ำมันยางดำ": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Pyrolysis Oil Std"
      },
      {
        "label": "Forms",
        "value": "Viscous liquid"
      },
      {
        "label": "Sources",
        "value": "Pyrolysis plants"
      },
      {
        "label": "Applications",
        "value": "Industrial heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "กากเบียร์": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Wet Spends Std"
      },
      {
        "label": "Forms",
        "value": "Wet solid"
      },
      {
        "label": "Sources",
        "value": "Breweries"
      },
      {
        "label": "Applications",
        "value": "Animal feed, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.03x"
      }
    ]
  },
  "บิวทานอล": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio-butanol Std"
      },
      {
        "label": "Forms",
        "value": "Liquid"
      },
      {
        "label": "Sources",
        "value": "Bio-refineries"
      },
      {
        "label": "Applications",
        "value": "Solvent, Fuel"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "หัวมันสำปะหลัง": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed/Energy Grade"
      },
      {
        "label": "Forms",
        "value": "Fresh roots"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Ethanol, Feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ใบมันสำปะหลัง": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Organic Std"
      },
      {
        "label": "Forms",
        "value": "Dried, Chopped"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Feed, Composting"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "เหง้ามัน": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Chunks"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Biomass boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ต้นมันสำปะหลังสับ": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Chopped"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ต้นมันสำปะหลังอัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ต้นมันสำปะหลัง": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Whole stems"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Combustion"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "เอทานอลจากเซลลูโลส": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Advanced Biofuel Std"
      },
      {
        "label": "Forms",
        "value": "Liquid"
      },
      {
        "label": "Sources",
        "value": "Advanced refineries"
      },
      {
        "label": "Applications",
        "value": "Transport fuel"
      },
      {
        "label": "Carbon Factor",
        "value": "0.005x"
      }
    ]
  },
  "ถ่าน": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "General Charcoal Std"
      },
      {
        "label": "Forms",
        "value": "Lumps"
      },
      {
        "label": "Sources",
        "value": "Kilns"
      },
      {
        "label": "Applications",
        "value": "Cooking, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านอัดเม็ด": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Charcoal Pellet Std"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "สาหร่ายคลอเรลล่า": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาฯ",
      "วัสดุฯ"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาฯ",
      "วัสดุฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio Grade"
      },
      {
        "label": "Forms",
        "value": "Powder"
      },
      {
        "label": "Sources",
        "value": "Aquaculture"
      },
      {
        "label": "Applications",
        "value": "Supplements, Fuel"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "ไม้ท่อน (กระถินเทพา/ณรงค์/ลูกผสม)": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Logs"
      },
      {
        "label": "Sources",
        "value": "Acacia plantations"
      },
      {
        "label": "Applications",
        "value": "Power generation"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ชานอ้อย": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Fibrous residue"
      },
      {
        "label": "Sources",
        "value": "Sugar mills"
      },
      {
        "label": "Applications",
        "value": "Mill power, Paper"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ชานอ้อยอัดก้อน": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Bales"
      },
      {
        "label": "Sources",
        "value": "Sugar mills"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ชานอ้อยอัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ไผ่": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Poles"
      },
      {
        "label": "Sources",
        "value": "Bamboo farms"
      },
      {
        "label": "Applications",
        "value": "Construction, Paper"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านไผ่": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Charcoal Standard"
      },
      {
        "label": "Forms",
        "value": "Lumps"
      },
      {
        "label": "Sources",
        "value": "Bamboo kilns"
      },
      {
        "label": "Applications",
        "value": "Filtration, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านไผ่อัดแท่ง": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Briquette Standard"
      },
      {
        "label": "Forms",
        "value": "Briquettes"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "BBQ"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไผ่สับ": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Chips"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไผ่อัดเม็ด": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Pellet stoves"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "เปลือกไม้": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Shredded"
      },
      {
        "label": "Sources",
        "value": "Sawmills"
      },
      {
        "label": "Applications",
        "value": "Landscaping, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ถ่านไบโอชาร์": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Biochar Standard"
      },
      {
        "label": "Forms",
        "value": "Granules"
      },
      {
        "label": "Sources",
        "value": "Pyrolysis plants"
      },
      {
        "label": "Applications",
        "value": "Soil amendment"
      },
      {
        "label": "Carbon Factor",
        "value": "0.005x"
      }
    ]
  },
  "ไบโอ CNG": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio-CNG Standard"
      },
      {
        "label": "Forms",
        "value": "Compressed gas"
      },
      {
        "label": "Sources",
        "value": "Upgrading plants"
      },
      {
        "label": "Applications",
        "value": "Vehicles"
      },
      {
        "label": "Carbon Factor",
        "value": "0.005x"
      }
    ]
  },
  "ถ่านหินชีวภาพ (ทำจากวัสดุไม่ใช่ไม้)": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Biocoal Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets, Briquettes"
      },
      {
        "label": "Sources",
        "value": "Torrefaction plants"
      },
      {
        "label": "Applications",
        "value": "Coal replacement"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านหินชีวภาพ (ทำจากไม้)": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Biocoal Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets, Briquettes"
      },
      {
        "label": "Sources",
        "value": "Torrefaction plants"
      },
      {
        "label": "Applications",
        "value": "Coal replacement"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านไบโอโค้ก": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Biocoke Standard"
      },
      {
        "label": "Forms",
        "value": "Lumps"
      },
      {
        "label": "Sources",
        "value": "Advanced kilns"
      },
      {
        "label": "Applications",
        "value": "Metallurgy"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ตอปาล์ม": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Shredded"
      },
      {
        "label": "Sources",
        "value": "Plantations"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.018x"
      }
    ]
  },
  "ต้นปาล์ม": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Trunks"
      },
      {
        "label": "Sources",
        "value": "Plantations"
      },
      {
        "label": "Applications",
        "value": "Plywood, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.018x"
      }
    ]
  },
  "กระดาษและกระดาษแข็ง": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ",
      "เยื่อและกระดาษ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Recycling Standard"
      },
      {
        "label": "Forms",
        "value": "Baled"
      },
      {
        "label": "Sources",
        "value": "Waste management"
      },
      {
        "label": "Applications",
        "value": "Recycling, Pellets"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "กากตะกอนเยื่อกระดาษ": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Paper Sludge Std"
      },
      {
        "label": "Forms",
        "value": "Sludge"
      },
      {
        "label": "Sources",
        "value": "Paper mills"
      },
      {
        "label": "Applications",
        "value": "Biogas, Incineration"
      },
      {
        "label": "Carbon Factor",
        "value": "0.03x"
      }
    ]
  },
  "ใบสับปะรด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Fiber Grade"
      },
      {
        "label": "Forms",
        "value": "Fresh, Dried"
      },
      {
        "label": "Sources",
        "value": "Plantations"
      },
      {
        "label": "Applications",
        "value": "Textiles, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ไม้ท่อน (สน)": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14961-1"
      },
      {
        "label": "Forms",
        "value": "Logs"
      },
      {
        "label": "Sources",
        "value": "Pine forests"
      },
      {
        "label": "Applications",
        "value": "Lumber, Power gen"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไม้โป๊ปลาร์": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14961-1"
      },
      {
        "label": "Forms",
        "value": "Logs"
      },
      {
        "label": "Sources",
        "value": "Poplar plantations"
      },
      {
        "label": "Applications",
        "value": "Power gen"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "วัสดุรองคอสัตว์ปีก": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Litter Standard"
      },
      {
        "label": "Forms",
        "value": "Mixed waste"
      },
      {
        "label": "Sources",
        "value": "Poultry farms"
      },
      {
        "label": "Applications",
        "value": "Biogas, Fertilizer"
      },
      {
        "label": "Carbon Factor",
        "value": "0.04x"
      }
    ]
  },
  "ไฟฟ้า": {
    "cats": [],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Grid Standard"
      },
      {
        "label": "Forms",
        "value": "Energy"
      },
      {
        "label": "Sources",
        "value": "Biomass plants"
      },
      {
        "label": "Applications",
        "value": "Power grid"
      },
      {
        "label": "Carbon Factor",
        "value": "0.00x"
      }
    ]
  },
  "เค้กอุตสาหกรรมน้ำมันพืช": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ",
      "วัสดุฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Press Cake Std"
      },
      {
        "label": "Forms",
        "value": "Solid cake"
      },
      {
        "label": "Sources",
        "value": "Oil refineries"
      },
      {
        "label": "Applications",
        "value": "Feed, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "สาหร่ายแดง (โรโดไฟตา)": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio/Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Dried"
      },
      {
        "label": "Sources",
        "value": "Marine farms"
      },
      {
        "label": "Applications",
        "value": "Agar, Feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "หญ้าริบบิ้น": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Fresh, Baled"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Forage, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ก๊าซธรรมชาติหมุนเวียน": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "RNG Standard"
      },
      {
        "label": "Forms",
        "value": "Gas"
      },
      {
        "label": "Sources",
        "value": "Biogas upgrading"
      },
      {
        "label": "Applications",
        "value": "Grid injection"
      },
      {
        "label": "Carbon Factor",
        "value": "0.005x"
      }
    ]
  },
  "แกลบ": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Loose Husk"
      },
      {
        "label": "Sources",
        "value": "Rice mills"
      },
      {
        "label": "Applications",
        "value": "Biomass boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ฟางข้าว": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "เยื่อฯ",
      "โภชนาฯ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ",
      "เยื่อฯ",
      "โภชนาฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Baled"
      },
      {
        "label": "Sources",
        "value": "Rice farms"
      },
      {
        "label": "Applications",
        "value": "Feed, Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ฟางข้าวอัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ไม้ท่อน (ยางพารา)": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14961-1"
      },
      {
        "label": "Forms",
        "value": "Logs"
      },
      {
        "label": "Sources",
        "value": "Rubber plantations"
      },
      {
        "label": "Applications",
        "value": "Furniture, Power"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ตอไม้ยางพารา": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Shredded roots"
      },
      {
        "label": "Sources",
        "value": "Plantations"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.012x"
      }
    ]
  },
  "ไม้ป่น": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Sawdust"
      },
      {
        "label": "Sources",
        "value": "Sawmills"
      },
      {
        "label": "Applications",
        "value": "Pellets, Briquettes"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไม้อัดเม็ด": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ENplus A1/A2"
      },
      {
        "label": "Forms",
        "value": "Pellets (6mm-8mm)"
      },
      {
        "label": "Sources",
        "value": "Pellet plants"
      },
      {
        "label": "Applications",
        "value": "Domestic heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ปีกไม้": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Slabs"
      },
      {
        "label": "Sources",
        "value": "Sawmills"
      },
      {
        "label": "Applications",
        "value": "Chipping, Boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ของเสียสวน": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Green Waste Std"
      },
      {
        "label": "Forms",
        "value": "Mixed green"
      },
      {
        "label": "Sources",
        "value": "Municipalities"
      },
      {
        "label": "Applications",
        "value": "Composting, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.03x"
      }
    ]
  },
  "มันเส้น": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Energy Grade"
      },
      {
        "label": "Forms",
        "value": "Chips"
      },
      {
        "label": "Sources",
        "value": "Cassava farms"
      },
      {
        "label": "Applications",
        "value": "Ethanol"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "เศษตัดแต่งส่วนไม้ตาย": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Branches"
      },
      {
        "label": "Sources",
        "value": "Forestry"
      },
      {
        "label": "Applications",
        "value": "Chipping"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "เศษตัดขยายระยะ": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Thinning wood"
      },
      {
        "label": "Sources",
        "value": "Plantations"
      },
      {
        "label": "Applications",
        "value": "Boilers"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "เศษตัดแต่งต้นไม้": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Green Waste Std"
      },
      {
        "label": "Forms",
        "value": "Branches, Leaves"
      },
      {
        "label": "Sources",
        "value": "Urban forestry"
      },
      {
        "label": "Applications",
        "value": "Mulch, Biomass"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "สาหร่ายผักกาดทะเล": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Fresh, Dried"
      },
      {
        "label": "Sources",
        "value": "Aquaculture"
      },
      {
        "label": "Applications",
        "value": "Feed, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "น้ำมันพืชใช้แล้ว": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "UCO Standard"
      },
      {
        "label": "Forms",
        "value": "Liquid"
      },
      {
        "label": "Sources",
        "value": "Restaurants"
      },
      {
        "label": "Applications",
        "value": "Biodiesel"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "กากน้ำมันพืช": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Waste Oil Std"
      },
      {
        "label": "Forms",
        "value": "Sludge"
      },
      {
        "label": "Sources",
        "value": "Refineries"
      },
      {
        "label": "Applications",
        "value": "Biodiesel, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ผักตบชวา": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio Grade"
      },
      {
        "label": "Forms",
        "value": "Fresh, Dried"
      },
      {
        "label": "Sources",
        "value": "Waterways"
      },
      {
        "label": "Applications",
        "value": "Biogas, Handicrafts"
      },
      {
        "label": "Carbon Factor",
        "value": "0.04x"
      }
    ]
  },
  "ฟางข้าวฟ่าง": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Baled"
      },
      {
        "label": "Sources",
        "value": "Sorghum farms"
      },
      {
        "label": "Applications",
        "value": "Feed, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ต้นข้าวสาลีอัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ต้นหลิว": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14961-1"
      },
      {
        "label": "Forms",
        "value": "Logs, Chips"
      },
      {
        "label": "Sources",
        "value": "Willow farms"
      },
      {
        "label": "Applications",
        "value": "Power generation"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไม้อัดก้อน": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Briquette Standard"
      },
      {
        "label": "Forms",
        "value": "Briquettes"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านไม้": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Charcoal Standard"
      },
      {
        "label": "Forms",
        "value": "Lumps"
      },
      {
        "label": "Sources",
        "value": "Kilns"
      },
      {
        "label": "Applications",
        "value": "BBQ, Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ถ่านไม้อัดแท่ง": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Briquette Standard"
      },
      {
        "label": "Forms",
        "value": "Extruded logs"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "BBQ"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไม้สับ (เชื้อเพลิง)": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-4-Standard"
      },
      {
        "label": "Forms",
        "value": "Wood chips"
      },
      {
        "label": "Sources",
        "value": "Sawmills"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไม้สับ (เยื่อและกระดาษ)": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "เยื่อและกระดาษ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "เยื่อและกระดาษ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Pulp Grade Chips"
      },
      {
        "label": "Forms",
        "value": "Clean chips"
      },
      {
        "label": "Sources",
        "value": "Forestry"
      },
      {
        "label": "Applications",
        "value": "Paper pulp"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ผงไม้บด": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Powder"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Pellets, WPC"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "ไม้ท่อน (ระบุชนิดไม้ที่หมายเหตุ)": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "EN 14961-1"
      },
      {
        "label": "Forms",
        "value": "Logs"
      },
      {
        "label": "Sources",
        "value": "Mixed forestry"
      },
      {
        "label": "Applications",
        "value": "Heating, Timber"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "สาหร่ายซาร์กาสซัม": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Bio Grade"
      },
      {
        "label": "Forms",
        "value": "Dried"
      },
      {
        "label": "Sources",
        "value": "Coastal areas"
      },
      {
        "label": "Applications",
        "value": "Fertilizer, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "ขี้เลื่อย": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Sawdust"
      },
      {
        "label": "Sources",
        "value": "Furniture plants"
      },
      {
        "label": "Applications",
        "value": "Pellets, Briquettes"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "สาหร่ายทะเล": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Dried"
      },
      {
        "label": "Sources",
        "value": "Marine farms"
      },
      {
        "label": "Applications",
        "value": "Feed, Extracts"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "กากตะกอนน้ำเสีย": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Sewage Sludge Std"
      },
      {
        "label": "Forms",
        "value": "Dried sludge"
      },
      {
        "label": "Sources",
        "value": "Treatment plants"
      },
      {
        "label": "Applications",
        "value": "Incineration, Biogas"
      },
      {
        "label": "Carbon Factor",
        "value": "0.04x"
      }
    ]
  },
  "ขี้กบ": {
    "cats": [
      "ไม้ชีวมวล"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ไม้ชีวมวล",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Shavings"
      },
      {
        "label": "Sources",
        "value": "Carpentry"
      },
      {
        "label": "Applications",
        "value": "Animal bedding, Pellets"
      },
      {
        "label": "Carbon Factor",
        "value": "0.01x"
      }
    ]
  },
  "กากโรงฆ่าสัตว์": {
    "cats": [
      "ขยะอินทรีย์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "ขยะอินทรีย์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ABPR Standard"
      },
      {
        "label": "Forms",
        "value": "Meat/Bone meal"
      },
      {
        "label": "Sources",
        "value": "Abattoirs"
      },
      {
        "label": "Applications",
        "value": "Biogas, Pet food"
      },
      {
        "label": "Carbon Factor",
        "value": "0.03x"
      }
    ]
  },
  "ข้าวฟ่าง": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Grain"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Ethanol, Feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ต้นข้าวฟ่างอัดเม็ด": {
    "cats": [
      "พืชพลังงานบนดิน"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "สาหร่ายสไปรูลินา": {
    "cats": [
      "พืชพลังงานในน้ำ"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "วัสดุฯ",
      "โภชนาฯ"
    ],
    "tags": [
      "พืชพลังงานในน้ำ",
      "พลังงานชีวภาพ",
      "วัสดุฯ",
      "โภชนาฯ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Food/Feed Grade"
      },
      {
        "label": "Forms",
        "value": "Powder"
      },
      {
        "label": "Sources",
        "value": "Aquaculture"
      },
      {
        "label": "Applications",
        "value": "Nutrition, Pigments"
      },
      {
        "label": "Carbon Factor",
        "value": "0.05x"
      }
    ]
  },
  "ไอน้ำ": {
    "cats": [],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Thermal Std"
      },
      {
        "label": "Forms",
        "value": "Steam"
      },
      {
        "label": "Sources",
        "value": "Biomass boilers"
      },
      {
        "label": "Applications",
        "value": "Industrial processing"
      },
      {
        "label": "Carbon Factor",
        "value": "0.00x"
      }
    ]
  },
  "อ้อย": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Energy Grade"
      },
      {
        "label": "Forms",
        "value": "Canes"
      },
      {
        "label": "Sources",
        "value": "Sugarcane farms"
      },
      {
        "label": "Applications",
        "value": "Ethanol, Sugar"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  },
  "ใบอ้อยมัด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ",
      "โภชนาการสัตว์"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Bales"
      },
      {
        "label": "Sources",
        "value": "Farms"
      },
      {
        "label": "Applications",
        "value": "Power plants, Feed"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ใบอ้อยอัดก้อน": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-1-Standard"
      },
      {
        "label": "Forms",
        "value": "Bales"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Power plants"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "ใบอ้อยอัดเม็ด": {
    "cats": [
      "เศษวัสดุทางการเกษตร"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "เศษวัสดุทางการเกษตร",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "ISO 17225-6-Standard"
      },
      {
        "label": "Forms",
        "value": "Pellets"
      },
      {
        "label": "Sources",
        "value": "Processors"
      },
      {
        "label": "Applications",
        "value": "Heating"
      },
      {
        "label": "Carbon Factor",
        "value": "0.015x"
      }
    ]
  },
  "หญ้าสวิตช์กราซ": {
    "cats": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์"
    ],
    "mkts": [
      "พลังงานชีวภาพ"
    ],
    "tags": [
      "พืชพลังงานบนดิน",
      "พืชอาหารสัตว์",
      "พลังงานชีวภาพ"
    ],
    "image": "",
    "desc": "",
    "specs": [
      {
        "label": "Quality",
        "value": "Energy Crop Std"
      },
      {
        "label": "Forms",
        "value": "Baled, Chopped"
      },
      {
        "label": "Sources",
        "value": "Dedicated farms"
      },
      {
        "label": "Applications",
        "value": "Combustion, Ethanol"
      },
      {
        "label": "Carbon Factor",
        "value": "0.02x"
      }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const subCategoryFilter = document.getElementById('subCategoryFilter');
    const marketFilter = document.getElementById('marketFilter');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const productCount = document.getElementById('productCount');

    // Modal Elements
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDesc');
    const modalSpecs = document.getElementById('modalSpecs');

    if (!productsGrid) return;

    // ฟังก์ชันสร้าง Card
    const renderProducts = (products) => {
        productsGrid.innerHTML = '';
        
        if (productCount) {
            productCount.innerText = products.length;
        }

        if (products.length === 0) {
            productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">ไม่พบสินค้าที่ค้นหา</div>';
            return;
        }

        products.forEach(productName => {
            const data = productData[productName] || { tags: [], cats: [], mkts: [], desc: '', specs: [] };
            
            const card = document.createElement('div');
            card.className = 'product-card';
            
            let tagsHtml = '';
            
            const uniqueCats = [...new Set(data.cats)];
            const uniqueMkts = [...new Set(data.mkts)];
            
            if (uniqueCats && uniqueCats.length > 0) {
                tagsHtml += uniqueCats.map(c => `<span class="product-category">${c}</span>`).join('');
            }
            if (uniqueMkts && uniqueMkts.length > 0) {
                tagsHtml += uniqueMkts.map(m => `<span class="product-market-tag">${m}</span>`).join('');
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
                    const uniqueTags = [...new Set(data.tags)];
                    uniqueTags.forEach(tag => {
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

                modalDesc.innerText = data.desc || '';

                modalSpecs.innerHTML = '';
                
                if (data.standards) {
                    const row = document.createElement('div');
                    row.className = 'spec-row';
                    row.innerHTML = `<span class="spec-label">มาตรฐาน (Standard):</span> <span class="spec-value" style="color: #16a34a; font-weight: 600;">${data.standards}</span>`;
                    modalSpecs.appendChild(row);
                }
                
                if (data.grades && data.grades.length > 0) {
                    const row = document.createElement('div');
                    row.className = 'spec-row';
                    const gradesHtml = data.grades.map(g => `<span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; margin-right: 4px; font-size: 0.85rem;">${g}</span>`).join('');
                    row.innerHTML = `<span class="spec-label">เกรดที่มีจำหน่าย:</span> <span class="spec-value">${gradesHtml}</span>`;
                    modalSpecs.appendChild(row);
                }

                if(data.specs && data.specs.length > 0) {
                    data.specs.forEach(spec => {
                        const row = document.createElement('div');
                        row.className = 'spec-row';
                        row.innerHTML = `<span class="spec-label">${spec.label}:</span> <span class="spec-value">${spec.value}</span>`;
                        modalSpecs.appendChild(row);
                    });
                }

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            productsGrid.appendChild(card);
        });
    };

    renderProducts(allProducts);

    // Filter System
    const filterProducts = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const catFilter = categoryFilter ? categoryFilter.value : '';
        const subCatFilter = subCategoryFilter ? subCategoryFilter.value : '';
        const mktFilter = marketFilter ? marketFilter.value : '';

        const filtered = allProducts.filter(product => {
            const data = productData[product] || { tags: [] };
            const matchesSearch = product.toLowerCase().includes(searchTerm);
            
            let matchesCat = true;
            if (catFilter) {
                matchesCat = data.tags.includes(catFilter);
            }
            
            let matchesMkt = true;
            if (mktFilter) {
                matchesMkt = data.mkts && data.mkts.includes(mktFilter);
            }
            
            let matchesSubCat = true;
            if (subCatFilter) {
                if (subCatFilter === 'อัดเม็ด') matchesSubCat = product.includes('อัดเม็ด');
                if (subCatFilter === 'อัดแท่ง') matchesSubCat = product.includes('อัดแท่ง') || product.includes('อัดก้อน');
                if (subCatFilter === 'ถ่าน') matchesSubCat = product.includes('ถ่าน');
                if (subCatFilter === 'เหลว') matchesSubCat = product.includes('ไบโอ') || product.includes('น้ำมัน') || product.includes('เอทานอล') || product.includes('แก๊ส');
            }

            return matchesSearch && matchesCat && matchesSubCat && matchesMkt;
        });

        renderProducts(filtered);
    };

    if (applyFilterBtn) applyFilterBtn.addEventListener('click', filterProducts);
    if (searchBtn) searchBtn.addEventListener('click', filterProducts);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') filterProducts();
        });
    }

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (subCategoryFilter) subCategoryFilter.value = '';
            if (marketFilter) marketFilter.value = '';
            filterProducts();
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
