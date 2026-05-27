document.addEventListener('DOMContentLoaded', async () => {
    
    // --- Initialize Charts Contexts ---
    const ctxTrend = document.getElementById('priceTrendChart').getContext('2d');
    const ctxShare = document.getElementById('marketShareChart').getContext('2d');
    
    // --- Default Empty Charts ---
    let trendChart = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['ยังไม่มีข้อมูล'],
            datasets: [
                {
                    label: 'ราคากลาง (THB)',
                    data: [0],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    let shareChart = new Chart(ctxShare, {
        type: 'doughnut',
        data: {
            labels: ['ยังไม่มีข้อมูล'],
            datasets: [{
                data: [1],
                backgroundColor: ['#e2e8f0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { tooltip: { enabled: false } }
        }
    });

    // --- Fetch Real Data from Supabase ---
    async function fetchAnalyticsData() {
        if (!window.supabaseClient) {
            console.error("Supabase client not initialized.");
            return;
        }

        try {
            const { data: orders, error } = await window.supabaseClient
                .from('orders')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (orders && orders.length > 0) {
                calculateKPIs(orders);
                updateCharts(orders);
            }
        } catch (err) {
            console.error("Error fetching analytics data:", err);
        }
    }

    // --- Calculate KPIs ---
    function calculateKPIs(orders) {
        let totalVolume = 0;
        let totalValue = 0;
        
        // เก็บข้อมูลปริมาณและราคาของแต่ละสินค้า
        let productStats = {};
        
        orders.forEach(o => {
            const qty = parseFloat(o.quantity) || 0;
            const price = parseFloat(o.price) || 0;
            const product = o.product || 'ไม่ระบุ';
            
            totalVolume += qty;
            totalValue += (qty * price);
            
            if (!productStats[product]) {
                productStats[product] = { totalQty: 0, prices: [] };
            }
            productStats[product].totalQty += qty;
            if (price > 0) {
                productStats[product].prices.push(price);
            }
        });

        // คำนวณราคาเฉลี่ยตลาดรวม (Volume Weighted Average Price)
        let overallAvgPrice = 0;
        if (totalVolume > 0) {
            overallAvgPrice = totalValue / totalVolume;
        }

        // ประเมินลดคาร์บอน (อิงจาก 1 MT = ลดคาร์บอนได้ 1.5 Ton CO2eq ให้ตรงกับหน้าแดชบอร์ด)
        let carbonSaved = totalVolume * 1.5;

        // อัปเดต HTML
        document.getElementById('kpiTotalVolume').innerText = totalVolume.toLocaleString();
        document.getElementById('kpiTotalValue').innerText = totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
        document.getElementById('kpiCarbon').innerText = carbonSaved.toLocaleString(undefined, { maximumFractionDigits: 0 });
        
        if (overallAvgPrice > 0) {
            const titleEl = document.getElementById('kpiAvgPriceTitle');
            if(titleEl) titleEl.innerText = `ราคาเฉลี่ยตลาดรวม (THB/MT)`;
            document.getElementById('kpiAvgPrice').innerText = overallAvgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 });
            document.getElementById('kpiAvgPriceTrend').innerHTML = '<span style="color: #10b981;">ดัชนีราคารวมทุกประเภทสินค้า</span>';
        }

        document.getElementById('kpiCarbon').innerText = carbonSaved.toLocaleString(undefined, { maximumFractionDigits: 0 });
        
        // อัปเดตข้อความข้างล่างให้เป็นสีเขียว
        document.getElementById('kpiTotalVolumeTrend').innerHTML = '<span style="color: #10b981;">ดึงข้อมูลล่าสุดสำเร็จ</span>';
        document.getElementById('kpiTotalValueTrend').innerHTML = '<span style="color: #10b981;">ดึงข้อมูลล่าสุดสำเร็จ</span>';
        document.getElementById('kpiCarbonTrend').innerHTML = '<span style="color: #10b981;">ดึงข้อมูลล่าสุดสำเร็จ</span>';
    }

    // --- Update Charts ---
    function updateCharts(orders) {
        // 1. จัดเตรียมข้อมูลสำหรับ Doughnut Chart (สัดส่วนชนิดสินค้า)
        const productCounts = {};
        orders.forEach(o => {
            const pName = o.product || 'ไม่ระบุ';
            productCounts[pName] = (productCounts[pName] || 0) + (parseFloat(o.quantity) || 0);
        });

        const shareLabels = Object.keys(productCounts);
        const shareData = Object.values(productCounts);
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];

        shareChart.data.labels = shareLabels;
        shareChart.data.datasets[0].data = shareData;
        shareChart.data.datasets[0].backgroundColor = colors.slice(0, shareLabels.length);
        shareChart.options.plugins.tooltip.enabled = true;
        shareChart.update();

        // 2. จัดเตรียมข้อมูลสำหรับ Line Chart (ราคาตามเวลา)
        // จำลองแกน X ให้เป็นวันที่ของออร์เดอร์
        const timeLabels = [];
        const priceData = [];
        
        orders.forEach(o => {
            const date = new Date(o.created_at).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
            timeLabels.push(date);
            priceData.push(parseFloat(o.price) || 0);
        });

        trendChart.data.labels = timeLabels;
        trendChart.data.datasets[0].label = 'ราคาที่มีการซื้อขาย (THB)';
        trendChart.data.datasets[0].data = priceData;
        trendChart.update();
    }

    // เรียกฟังก์ชันดึงข้อมูลเมื่อโหลดหน้าเว็บเสร็จ
    fetchAnalyticsData();

});
