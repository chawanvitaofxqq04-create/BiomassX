document.addEventListener('DOMContentLoaded', async () => {
    
    // --- ApexCharts Configurations ---
    const commonOptions = {
        fontFamily: 'Inter, Prompt, sans-serif',
        toolbar: { show: false }
    };

    // 1. Trend Chart (Line)
    const trendOptions = {
        ...commonOptions,
        series: [],
        chart: {
            type: 'area',
            height: 380,
            toolbar: { show: true }
        },
        colors: ['#10b981', '#ef4444'], // Buy (Green), Sell (Red)
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false,
                format: 'dd MMM yyyy' // FIXING THE RAW DATE BUG
            }
        },
        yaxis: {
            labels: {
                formatter: (val) => { return '฿' + val.toLocaleString() }
            }
        },
        tooltip: {
            x: { format: 'dd MMM yyyy' }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        }
    };
    let trendChart = new ApexCharts(document.querySelector("#trendChart"), trendOptions);
    trendChart.render();

    // 2. Volume Chart (Bar)
    const volumeOptions = {
        ...commonOptions,
        series: [],
        chart: { type: 'bar', height: 350 },
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '55%',
                dataLabels: { position: 'top' } // top, center, bottom
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toLocaleString() + " MT";
            },
            offsetY: -20,
            style: { fontSize: '12px', colors: ["#304758"] }
        },
        xaxis: {
            categories: [],
            labels: { style: { fontFamily: 'Prompt, sans-serif' } }
        },
        yaxis: {
            title: { text: 'Volume (MT)' }
        },
        colors: ['#10b981']
    };
    let volumeChart = new ApexCharts(document.querySelector("#volumeChart"), volumeOptions);
    volumeChart.render();

    // 3. Market Share Charts (Pie/Donut)
    const pieCommon = {
        ...commonOptions,
        chart: { type: 'donut', height: 320 },
        dataLabels: { enabled: true },
        plotOptions: {
            pie: { donut: { size: '65%' } }
        },
        legend: { position: 'bottom', fontFamily: 'Prompt, sans-serif' }
    };

    let shareProductChart = new ApexCharts(document.querySelector("#shareProductChart"), {
        ...pieCommon, series: [], labels: [], colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316']
    });
    shareProductChart.render();

    let shareCountryChart = new ApexCharts(document.querySelector("#shareCountryChart"), {
        ...pieCommon, series: [], labels: [], colors: ['#3b82f6', '#0ea5e9', '#0284c7', '#0369a1']
    });
    shareCountryChart.render();

    let shareDeliveryChart = new ApexCharts(document.querySelector("#shareDeliveryChart"), {
        ...pieCommon, series: [], labels: [], colors: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d']
    });
    shareDeliveryChart.render();

    // --- Fetch Real Data from Supabase ---
    async function fetchAnalyticsData(days = 30) {
        if (!window.supabaseClient) {
            console.error("Supabase client not initialized.");
            return;
        }

        try {
            let query = window.supabaseClient
                .from('orders')
                .select('*')
                .order('created_at', { ascending: true });

            if (days !== 'all') {
                const date = new Date();
                date.setDate(date.getDate() - parseInt(days));
                query = query.gte('created_at', date.toISOString());
            }

            const { data: orders, error } = await query;

            if (error) throw error;

            // Update title
            const trendTitle = document.getElementById('trend-title');
            if (trendTitle) {
                if (days === 'all') {
                    trendTitle.innerText = `แนวโน้มราคา - ทั้งหมด`;
                } else if (days == 365) {
                    trendTitle.innerText = `แนวโน้มราคา - 1 ปีที่ผ่านมา`;
                } else {
                    trendTitle.innerText = `แนวโน้มราคา - ${days} วันที่ผ่านมา`;
                }
            }

            if (orders) {
                processAndRenderData(orders);
            }
        } catch (err) {
            console.error("Error fetching analytics data:", err);
        }
    }

    // --- Process Data & Update UI ---
    function processAndRenderData(orders) {
        // 1. Process KPIs & Volume
        let totalVolume = 0;
        let totalTx = orders.length;
        let productVolumeMap = {};
        
        // 2. Process Prices
        let buyPrices = [];
        let sellPrices = [];
        let totalBuy = 0, countBuy = 0;
        let totalSell = 0, countSell = 0;

        // 3. Process Share
        let countryMap = {};
        let deliveryMap = {};

        orders.forEach(o => {
            const qty = parseFloat(o.quantity) || 0;
            const price = parseFloat(o.price) || 0;
            const product = o.product_name || o.product || 'ไม่ระบุ';
            const type = (o.order_type || '').toLowerCase();
            const dateStr = new Date(o.created_at).getTime();
            let country = 'ไทย';
            if (o.marketplace && (o.marketplace === 'Global Market' || o.marketplace.includes('ตลาดโลก'))) {
                country = o.region && o.region !== '-' ? o.region : 'International';
            }
            const delivery = o.payment_term || 'ไม่ระบุ';

            // Volume
            totalVolume += qty;
            productVolumeMap[product] = (productVolumeMap[product] || 0) + qty;

            // Share
            countryMap[country] = (countryMap[country] || 0) + 1;
            deliveryMap[delivery] = (deliveryMap[delivery] || 0) + 1;

            // Trend
            if (type === 'buy' || type === 'เสนอซื้อ') {
                if (price > 0) {
                    buyPrices.push([dateStr, price]);
                    totalBuy += price;
                    countBuy++;
                }
            } else if (type === 'sell' || type === 'เสนอขาย') {
                if (price > 0) {
                    sellPrices.push([dateStr, price]);
                    totalSell += price;
                    countSell++;
                }
            }
        });

        // Calculate Averages
        const avgBuy = countBuy > 0 ? (totalBuy / countBuy) : 0;
        const avgSell = countSell > 0 ? (totalSell / countSell) : 0;
        const diff = avgSell - avgBuy;
        const diffPercent = avgBuy > 0 ? ((diff / avgBuy) * 100).toFixed(1) : 0;

        // Update Trend KPIs
        document.getElementById('kpiAvgBuy').innerHTML = `฿${avgBuy.toLocaleString(undefined, {maximumFractionDigits:2})} <span class="kpi-box-trend trend-up">+2.3%</span>`; // Mock percentage trend
        document.getElementById('kpiAvgSell').innerHTML = `฿${avgSell.toLocaleString(undefined, {maximumFractionDigits:2})} <span class="kpi-box-trend trend-up">+1.8%</span>`;
        document.getElementById('kpiDiff').innerHTML = `฿${diff.toLocaleString(undefined, {maximumFractionDigits:2})} <span class="kpi-box-trend trend-down">${diffPercent}%</span>`;

        // Sort Product Volume for Bar Chart
        const sortedProducts = Object.entries(productVolumeMap).sort((a, b) => b[1] - a[1]);
        const topProduct = sortedProducts.length > 0 ? sortedProducts[0][0] : '-';

        // Update Volume KPIs
        document.getElementById('kpiTotalVol').innerText = `${totalVolume.toLocaleString()} MT`;
        document.getElementById('kpiTopProduct').innerText = topProduct;
        document.getElementById('kpiTotalTx').innerText = totalTx.toLocaleString();

        // Update Trend Chart
        trendChart.updateSeries([
            { name: 'Buy Price', data: buyPrices },
            { name: 'Sell Price', data: sellPrices }
        ]);

        // Update Volume Chart
        volumeChart.updateSeries([{
            name: 'Volume',
            data: sortedProducts.map(p => p[1])
        }]);
        volumeChart.updateOptions({
            xaxis: { categories: sortedProducts.map(p => p[0]) }
        });

        // Update Share Pie Charts
        shareProductChart.updateSeries(sortedProducts.map(p => p[1]));
        shareProductChart.updateOptions({ labels: sortedProducts.map(p => p[0]) });

        const countryEntries = Object.entries(countryMap);
        shareCountryChart.updateSeries(countryEntries.map(c => c[1]));
        shareCountryChart.updateOptions({ labels: countryEntries.map(c => c[0]) });

        const deliveryEntries = Object.entries(deliveryMap);
        shareDeliveryChart.updateSeries(deliveryEntries.map(d => d[1]));
        shareDeliveryChart.updateOptions({ labels: deliveryEntries.map(d => d[0]) });

    }

    // --- UI Interactions ---
    const filterButtons = document.querySelectorAll('.filter-buttons .filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to the clicked button
            this.classList.add('active');
        });
    });

    const applyBtn = document.getElementById('apply-filter-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const activeBtn = document.querySelector('.filter-buttons .filter-btn.active');
            const days = activeBtn ? activeBtn.getAttribute('data-days') : 30;
            fetchAnalyticsData(days);
        });
    }

    const clearBtn = document.getElementById('clear-filter-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            const defaultBtn = document.querySelector('.filter-buttons .filter-btn[data-days="30"]');
            if (defaultBtn) defaultBtn.classList.add('active');
            
            // Also reset selects if you want, not doing it yet
            fetchAnalyticsData(30);
        });
    }

    // Initialize
    const initialActive = document.querySelector('.filter-buttons .filter-btn.active');
    const initialDays = initialActive ? initialActive.getAttribute('data-days') : 30;
    fetchAnalyticsData(initialDays);

});
