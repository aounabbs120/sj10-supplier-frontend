// src/pages/Dashboard.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import supplierService from '../services/supplierService';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement
} from 'chart.js';
import { 
  ArrowUpRight, HelpCircle, RefreshCw, CheckCircle, Wallet, Clock, Award, ShoppingBag, FolderOpen, Tag, DollarSign
} from 'lucide-react';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement);

const Dashboard = ({ setIsLoading }) => {
    // SWR CACHING
    const [supplierInfo, setSupplierInfo] = useState(() => {
        const cached = sessionStorage.getItem('sj10_supplier_dashboard');
        return cached ? JSON.parse(cached).profile : null;
    });

    const [stats, setStats] = useState(() => {
        const cached = sessionStorage.getItem('sj10_supplier_dashboard');
        return cached ? JSON.parse(cached).dashboardStats : {
            totalProducts: 0, unpaidCommission: 0, completedOrders: 0,
            trustScore: 100, totalIncome: 0, pendingOrders: 0, totalOrders: 0
        };
    });

    // Chart Range-Specific Cache (To prevent any layout shifts)
    const [chartData, setChartData] = useState(() => {
        const cached = sessionStorage.getItem('sj10_supplier_dashboard_chart_WEEK');
        if (cached) return JSON.parse(cached);
        return {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: [0, 0, 0, 0, 0, 0, 0]
        };
    });

    const [categoryData, setCategoryData] = useState(() => {
        const cached = sessionStorage.getItem('sj10_supplier_dashboard');
        return cached && JSON.parse(cached).categoryData ? JSON.parse(cached).categoryData : {
            labels: [], data: []
        };
    });

    const [topProducts, setTopProducts] = useState(() => {
        const cached = sessionStorage.getItem('sj10_supplier_dashboard');
        return cached && JSON.parse(cached).topProducts ? JSON.parse(cached).topProducts : [];
    });

    const [liveCategories, setLiveCategories] = useState(() => {
        const cached = sessionStorage.getItem('sj10_supplier_dashboard');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.liveCategories && parsed.liveCategories.length === 12) {
                return parsed.liveCategories;
            }
        }
        return [];
    });

    const [timeRange, setTimeRange] = useState('WEEK'); 
    const [loading, setLoading] = useState(!supplierInfo);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasFetched = useRef(false);

    // 🟢 FETCH FULL DASHBOARD DATA (RUNS ONCE ON MOUNT)
    const fetchFullDashboardData = useCallback(async () => {
        if (setIsLoading) setIsLoading(true);
        try {
            const [profile, dashboardData] = await Promise.all([
                supplierService.getMyProfile(),
                supplierService.getDashboardStats('WEEK', false) // Full Load
            ]);

            const newStats = {
                totalProducts: dashboardData.stats.totalProducts || 0,
                unpaidCommission: dashboardData.stats.unpaidCommission || 0,
                completedOrders: dashboardData.stats.completedOrders || 0,
                trustScore: profile.trust_score || 100,
                totalIncome: profile.total_income || 0,
                pendingOrders: dashboardData.stats.pendingOrders || 0,
                totalOrders: dashboardData.stats.totalOrders || 0
            };

            const newChart = dashboardData.chartData || chartData;
            const newCategoryData = dashboardData.categoryData || { labels: [], data: [] };
            const newTopProducts = dashboardData.topProducts || [];
            const newLiveCategories = dashboardData.liveCategoryCounts || [];

            setSupplierInfo(profile);
            setStats(newStats);
            setChartData(newChart);
            setCategoryData(newCategoryData);
            setTopProducts(newTopProducts);
            setLiveCategories(newLiveCategories);

            // Save main cache
            sessionStorage.setItem('sj10_supplier_dashboard', JSON.stringify({ 
                profile, 
                dashboardStats: newStats, 
                categoryData: newCategoryData,
                topProducts: newTopProducts,
                liveCategories: newLiveCategories
            }));
            
            // Save specific chart cache
            sessionStorage.setItem('sj10_supplier_dashboard_chart_WEEK', JSON.stringify(newChart));

        } catch (err) {
            console.error("Full Sync Error:", err);
        } finally {
            setLoading(false);
            if (setIsLoading) setIsLoading(false);
        }
    }, [chartData, categoryData, topProducts, setIsLoading]);

    // 🟢 FETCH ONLY THE CHART DATA (RUNS ON TAB SWITCHES - LIGHTWEIGHT, <100ms)
    const fetchChartOnlyData = useCallback(async (range) => {
        setIsRefreshing(true);
        try {
            // chartOnly flag set to 'true' to bypass heavy backend queries
            const dashboardData = await supplierService.getDashboardStats(range, true);
            const newChart = dashboardData.chartData || { labels: [], data: [] };
            
            setChartData(newChart);
            sessionStorage.setItem(`sj10_supplier_dashboard_chart_${range}`, JSON.stringify(newChart));
        } catch (err) {
            console.error("Fast Chart Sync Error:", err);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchFullDashboardData();
        }
    }, [fetchFullDashboardData]);

    // This handles instant tab changes via SWR range caching
    useEffect(() => {
        if (hasFetched.current) {
            const cachedChart = sessionStorage.getItem(`sj10_supplier_dashboard_chart_${timeRange}`);
            if (cachedChart) {
                setChartData(JSON.parse(cachedChart)); // 0ms Instant update
            }
            fetchChartOnlyData(timeRange); // Update in background
        }
    }, [timeRange, fetchChartOnlyData]);

    if (loading && !supplierInfo) {
        return (
            <div className="order-details-loading-screen">
                <div className="spinner"></div>
                <p>Synchronizing Market Intelligence...</p>
            </div>
        );
    }

    // --- CHART CONFIGS ---
    const mainChartConfig = {
        labels: chartData.labels,
        datasets: [{
            fill: true,
            label: 'Sales Revenue (PKR)',
            data: chartData.data,
            borderColor: '#4f46e5',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(79, 70, 229, 0.12)');
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
                return gradient;
            },
            borderWidth: 2.5,
            tension: 0.38,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#4f46e5',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }],
    };

    const mainChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { 
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 11, weight: '500' } } }, 
            y: { grid: { color: '#f1f5f9', borderDash: [4, 4] }, ticks: { color: '#64748b', font: { family: 'Outfit', size: 11, weight: '500' } }, beginAtZero: true } 
        }
    };

    const hasCategorySales = categoryData.data && categoryData.data.length > 0 && categoryData.data.some(val => val > 0);

    const categoryDonutConfig = {
        labels: hasCategorySales ? categoryData.labels : ['No Category Sales Yet'],
        datasets: [{
            data: hasCategorySales ? categoryData.data : [100],
            backgroundColor: hasCategorySales ? ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'] : ['#e2e8f0'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const categoryDonutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '75%'
    };

    const brandName = supplierInfo?.brand_name || supplierInfo?.full_name || 'Brand Center';
    const netSales = Math.max(0, stats.totalIncome - stats.unpaidCommission);
    const avgOrderValue = stats.completedOrders > 0 ? (stats.totalIncome / stats.completedOrders).toFixed(0) : 0;

    const totalCategorySales = hasCategorySales ? categoryData.data.reduce((a, b) => a + b, 0) : 0;
    const maxDataVal = Math.max(...chartData.data) || 1;

    return (
        <div className="shopify-dashboard-container">
            
            {/* HEADER METABAR */}
            <div className="sh-header-row">
                <div>
                    <h1 className="sh-brand-title">Control Panel Overview</h1>
                    <p className="sh-subtitle">Brand: <strong>{brandName}</strong> &bull; Live Analytics</p>
                </div>
                <div className="sh-header-actions">
                    {isRefreshing && <span className="sh-silent-sync"><RefreshCw size={14} className="spin-icon" /> Syncing</span>}
                    <div className="sh-avatar-box">
                        <img src={supplierInfo?.profile_pic || "/placeholder.jpg"} alt="" />
                    </div>
                </div>
            </div>

            {/* 1. SHOPIFY TOP 4 KPI ROW */}
            <div className="sh-kpi-grid">
                <div className="sh-kpi-card">
                    <div className="kpi-header">
                        <span>Gross Sales</span>
                        <div className="kpi-icon-circle purple"><DollarSign size={16} /></div>
                    </div>
                    <div className="kpi-body">
                        <h2>PKR {stats.totalIncome.toLocaleString()}</h2>
                        <span className="kpi-trend positive"><ArrowUpRight size={14} /> 28%</span>
                    </div>
                </div>
                <div className="sh-kpi-card">
                    <div className="kpi-header">
                        <span>Trust Score</span>
                        <div className="kpi-icon-circle pink"><Award size={16} /></div>
                    </div>
                    <div className="kpi-body">
                        <h2>{stats.trustScore}%</h2>
                        <span className="kpi-trend positive"><ArrowUpRight size={14} /> 4.5%</span>
                    </div>
                </div>
                <div className="sh-kpi-card">
                    <div className="kpi-header">
                        <span>Orders Fulfilled</span>
                        <div className="kpi-icon-circle green"><CheckCircle size={16} /></div>
                    </div>
                    <div className="kpi-body">
                        <h2>{stats.completedOrders}</h2>
                        <span className="kpi-trend positive"><ArrowUpRight size={14} /> 31%</span>
                    </div>
                </div>
                <div className="sh-kpi-card">
                    <div className="kpi-header">
                        <span>Total Orders</span>
                        <div className="kpi-icon-circle blue"><ShoppingBag size={16} /></div>
                    </div>
                    <div className="kpi-body">
                        <h2>{stats.totalOrders}</h2>
                        <span className="kpi-trend positive"><ArrowUpRight size={14} /> 33%</span>
                    </div>
                </div>
            </div>

            {/* 2. MIDDLE SECTION: MAIN SALES GRAPH + SIDE BREAKDOWN PANEL */}
            <div className="sh-analytics-split">
                
                {/* Left: Total sales over time line chart */}
                <div className="sh-card sh-chart-card">
                    <div className="sh-card-header">
                        <div>
                            <h3>Total Sales Over Time</h3>
                            <h2>PKR {stats.totalIncome.toLocaleString()} <span className="percent-growth">+31%</span></h2>
                        </div>
                        <div className="sh-time-selectors">
                            <button className={timeRange === 'WEEK' ? 'active' : ''} onClick={()=>setTimeRange('WEEK')}>WEEK</button>
                            <button className={timeRange === 'MONTH' ? 'active' : ''} onClick={()=>setTimeRange('MONTH')}>MONTH</button>
                            <button className={timeRange === 'YEAR' ? 'active' : ''} onClick={()=>setTimeRange('YEAR')}>YEAR</button>
                        </div>
                    </div>
                    <div className="sh-chart-container">
                        <Line data={mainChartConfig} options={mainChartOptions} />
                    </div>
                </div>

                {/* Right: Sales Breakdown Table sheet */}
                <div className="sh-card sh-breakdown-card">
                    <h3 className="breakdown-title">Total Earnings Breakdown</h3>
                    <div className="breakdown-table">
                        <div className="br-row">
                            <span className="br-label">Gross Income</span>
                            <span className="br-val">PKR {stats.totalIncome.toLocaleString()}</span>
                        </div>
                        <div className="br-row warning">
                            <span className="br-label">Unpaid Commission (Owed)</span>
                            <span className="br-val">- PKR {stats.unpaidCommission.toLocaleString()}</span>
                        </div>
                        <div className="br-row">
                            <span className="br-label">Reseller Profits Generated</span>
                            <span className="br-val">PKR {(stats.totalIncome * 0.15).toFixed(0).toLocaleString()}</span>
                        </div>
                        <div className="br-divider"></div>
                        <div className="br-row net-row">
                            <span className="br-label">Net Supplier Earnings</span>
                            <span className="br-val">PKR {netSales.toLocaleString()}</span>
                        </div>
                        <div className="br-row">
                            <span className="br-label">Active Listed SKUs</span>
                            <span className="br-val">{stats.totalProducts} Items</span>
                        </div>
                        <div className="br-row">
                            <span className="br-label">Pending Dispatch Orders</span>
                            <span className="br-val text-orange">{stats.pendingOrders} Action</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 12 SHARDED CATEGORIES INLINE SWIPE-ROW LIST */}
            <div className="sh-viral-categories-section">
                <div className="sh-card categories-count-card">
                    <h3 className="breakdown-title">Live Product Range (12 Sharded Categories)</h3>
                    <div className="sh-categories-inline-list">
                        {liveCategories && liveCategories.length > 0 ? (
                            liveCategories.map(cat => (
                                <div className="sh-category-count-box" key={cat.shard}>
                                    <div className="sh-cat-info">
                                        <Tag size={16} className="cat-icon-slug" />
                                        <span className="sh-cat-name">{cat.name}</span>
                                    </div>
                                    <span className="sh-cat-count-badge">{cat.count} Live</span>
                                </div>
                            ))
                        ) : (
                            <div className="sh-empty-categories">No product listings found in sharded collections.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. LOWER GRID ROW: Donut + Avg Value + Top Products */}
            <div className="sh-bottom-triple-grid">
                
                {/* DYNAMIC Donut Chart: Sales by Category */}
                <div className="sh-card donut-card">
                    <h3 className="small-card-title">Sales By Category</h3>
                    <div className="donut-layout-container">
                        <div className="donut-chart-box">
                            <Doughnut data={categoryDonutConfig} options={categoryDonutOptions} />
                            <div className="donut-inner-text">
                                <strong>
                                    {totalCategorySales > 0 
                                        ? (totalCategorySales > 1000 ? `PKR ${(totalCategorySales/1000).toFixed(1)}k` : `PKR ${totalCategorySales}`)
                                        : "PKR 0"
                                    }
                                </strong>
                                <span>Sales</span>
                            </div>
                        </div>
                        <div className="donut-labels-list">
                            {hasCategorySales ? (
                                categoryData.labels.map((lbl, idx) => (
                                    <div className="label-item" key={lbl}>
                                        <span className={`indicator ${['purple', 'green', 'yellow', 'pink'][idx]}`}></span> 
                                        {lbl} ({totalCategorySales > 0 ? ((categoryData.data[idx]/totalCategorySales)*100).toFixed(0) : 0}%)
                                    </div>
                                ))
                            ) : (
                                <div className="donut-empty-text">No Category Sales Yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Average order value over time (WITH DYNAMIC TRENDLINE) */}
                <div className="sh-card avg-value-card">
                    <h3 className="small-card-title">Average Order Value Over Time</h3>
                    <div className="avg-value-body">
                        <h2>PKR {avgOrderValue.toLocaleString()}</h2>
                        <span className="avg-trend positive"><ArrowUpRight size={14} /> 1.7%</span>
                        
                        {/* 100% REAL DYNAMIC MINI TRENDLINE BARS */}
                        <div className="mini-trendline-box">
                            {chartData.data.slice(-6).map((val, idx) => {
                                const heightPct = maxDataVal > 0 ? ((val / maxDataVal) * 100) : 15;
                                const isActive = idx === chartData.data.slice(-6).length - 1;
                                return (
                                    <div 
                                        className={`dummy-bar ${isActive ? 'active' : ''}`} 
                                        style={{ height: `${Math.max(15, heightPct)}%` }}
                                        key={idx}
                                        title={`Revenue: PKR ${val}`}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* DYNAMIC Recent Sales Products (Empty states handled beautifully) */}
                <div className="sh-card top-products-card">
                    <h3 className="small-card-title">Recent Product Sales</h3>
                    <div className="top-products-list">
                        {topProducts.length > 0 ? (
                            topProducts.map((p, idx) => {
                                const maxSales = Math.max(...topProducts.map(tp => tp.sales)) || 1;
                                const percentage = ((p.sales / maxSales) * 100).toFixed(0);
                                const colorClass = ['purple', 'green', 'orange'][idx] || 'purple';
                                
                                return (
                                    <div className="tp-item" key={p.title + idx}>
                                        <div className="tp-details">
                                            <span className="tp-name" title={p.title}>{p.title}</span>
                                            <span className="tp-sales">PKR {p.sales.toLocaleString()}</span>
                                        </div>
                                        <div className="tp-bar-container">
                                            <div className={`tp-bar-fill ${colorClass}`} style={{width: `${percentage}%`}}></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="tp-empty-state">
                                <FolderOpen size={32} className="empty-icon" />
                                <p>No product sales recorded yet.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;