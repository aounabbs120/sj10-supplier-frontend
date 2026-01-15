// src/pages/Dashboard.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import supplierService from '../services/supplierService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler,
} from 'chart.js';
import { Package, AlertTriangle, CheckCircle, Activity, Wallet, Clock, ShieldCheck } from 'lucide-react';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

// --- 1. INTELLIGENT STOCK GRAPH ---
const StockGraph = ({ rawValue, color, id }) => {
    const num = parseFloat(String(rawValue).replace(/[^0-9.]/g, '')) || 0;

    const getGraphConfig = (n) => {
        if (n === 0) {
            return {
                path: "M0,28 L20,28 L40,28 L60,28 L80,28 L100,28",
                endY: 28,
                fillPath: "M0,28 L100,28 L100,50 L0,50 Z",
                type: 'flat'
            };
        } else if (n < 50) {
            return {
                path: "M0,28 Q30,25 50,20 T100,10", 
                endY: 10,
                fillPath: "M0,28 Q30,25 50,20 T100,10 L100,50 L0,50 Z",
                type: 'moderate'
            };
        } else {
            return {
                path: "M0,28 C30,28 30,15 50,15 S70,5 100,2", 
                endY: 2,
                fillPath: "M0,28 C30,28 30,15 50,15 S70,5 100,2 L100,50 L0,50 Z",
                type: 'high'
            };
        }
    };

    const config = getGraphConfig(num);

    return (
        <div className="stock-graph-wrapper">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id={`stroke-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="50%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <path d={config.fillPath} fill={`url(#grad-${id})`} className="graph-fill-anim" />
                <path d={config.path} fill="none" stroke={`url(#stroke-${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="living-line" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
                <circle cx="100" cy={config.endY} r="2.5" fill="#fff" stroke={color} strokeWidth="1.5" className="pulse-dot" />
            </svg>
        </div>
    );
};

// --- 2. GLASS STAT CARD ---
const GlassStatCard = ({ title, value, badgeText, badgeColor, icon, themeColor, index }) => (
    <div className="glass-card" style={{ borderTop: `3px solid ${themeColor}` }}>
        <div className="card-header">
            <div className="icon-box" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>{icon}</div>
            {badgeText && <span className="card-badge" style={{ color: badgeColor, border: `1px solid ${badgeColor}30`, backgroundColor: `${badgeColor}10` }}>{badgeText}</span>}
        </div>
        <div className="card-body">
            <h2 className="card-value">{value}</h2>
            <p className="card-title shimmer-text">{title}</p>
        </div>
        <StockGraph rawValue={value} color={themeColor} id={index} />
    </div>
);

const Dashboard = ({ setIsLoading }) => {
    const [supplierInfo, setSupplierInfo] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0, unpaidCommission: 0, completedOrders: 0,
        trustScore: 0, totalIncome: 0, pendingOrders: 0
    });
    const [chartData, setChartData] = useState({
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [0, 0, 0, 0, 0, 0, 0]
    });
    const [timeRange, setTimeRange] = useState('YEAR'); 
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    // --- OPTIMIZED DATA FETCHING ---
    const fetchData = useCallback(async () => {
        // 1. INSTANT LOAD FROM CACHE
        const cachedData = sessionStorage.getItem('sj10_supplier_dashboard');
        
        if (cachedData) {
            const { profile, dashboardStats, chart } = JSON.parse(cachedData);
            setSupplierInfo(profile);
            setStats(dashboardStats);
            setChartData(chart);
            setLoading(false);
        }

        try {
            // 2. SILENT BACKGROUND FETCH
            const [profile, dashboardData] = await Promise.all([
                supplierService.getMyProfile(),
                supplierService.getDashboardStats()
            ]);

            const newStats = {
                totalProducts: dashboardData.stats.totalProducts || 0,
                unpaidCommission: dashboardData.stats.unpaidCommission || 0,
                completedOrders: dashboardData.stats.completedOrders || 0,
                trustScore: profile.trust_score || 0,
                totalIncome: profile.total_income || 0,
                pendingOrders: dashboardData.stats.pendingOrders || 0
            };

            const newChart = dashboardData.chartData || chartData;

            // 3. COMPARE & UPDATE (Only if data changed)
            // Simple stringify check is enough for dashboard data
            const newDataString = JSON.stringify({ profile, dashboardStats: newStats, chart: newChart });
            
            if (newDataString !== cachedData) {
                console.log("⚡ Dashboard Updated");
                setSupplierInfo(profile);
                setStats(newStats);
                setChartData(newChart);
                sessionStorage.setItem('sj10_supplier_dashboard', newDataString);
            }

        } catch (err) {
            console.error("Dashboard Sync Error:", err);
        } finally {
            setLoading(false);
            if(setIsLoading) setIsLoading(false);
        }
    }, [chartData, setIsLoading]);

    useEffect(() => { 
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchData(); 
        }
    }, [fetchData]);

    if (loading) return <div className="loading-screen">Synchronizing Market Data...</div>;

    // --- CHART CONFIG ---
    const chartConfig = {
        labels: chartData.labels,
        datasets: [{
            fill: true,
            label: 'Income (PKR)',
            data: chartData.data,
            borderColor: '#6366f1',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 350);
                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
                gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
                return gradient;
            },
            borderWidth: 2, tension: 0.3, pointBackgroundColor: '#fff',
            pointBorderColor: '#6366f1', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
        }],
    };

    const chartOptions = {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } }, y: { grid: { color: '#f1f5f9', borderDash: [5, 5] }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, beginAtZero: true } }
    };

    const firstName = supplierInfo?.full_name?.split(' ')[0] || 'Supplier';
    const profileImage = supplierInfo?.profile_pic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    return (
        <div className="dashboard-container">
            <div className="dashboard-header fade-in">
                <div className="header-text">
                    <h1>Hello, {firstName}! <span className="wave-emoji">👋</span></h1>
                    <p>Market Overview &bull; <span className="live-indicator">● LIVE</span></p>
                </div>
                <div className="header-profile"><img src={profileImage} alt="Profile" className="profile-img"/></div>
            </div>

            <div className="stats-grid stagger-anim">
                <GlassStatCard index={1} title="TOTAL INCOME" value={`PKR ${stats.totalIncome.toLocaleString()}`} badgeText="LIFETIME" badgeColor="#2563eb" themeColor="#2563eb" icon={<Wallet size={20} />} />
                <GlassStatCard index={2} title="PENDING ORDERS" value={stats.pendingOrders} badgeText={stats.pendingOrders > 0 ? "ACTION REQ" : "IDLE"} badgeColor="#f97316" themeColor="#f97316" icon={<Clock size={20} />} />
                <GlassStatCard index={3} title="COMPLETED ORDERS" value={stats.completedOrders} badgeText="+5.1% MOM" badgeColor="#16a34a" themeColor="#16a34a" icon={<CheckCircle size={20} />} />
                <GlassStatCard index={4} title="TOTAL PRODUCTS" value={stats.totalProducts} badgeText="ACTIVE SKU" badgeColor="#8b5cf6" themeColor="#8b5cf6" icon={<Package size={20} />} />
                <GlassStatCard index={5} title="COMMISSION DUE" value={`PKR ${stats.unpaidCommission.toLocaleString()}`} badgeText={stats.unpaidCommission > 0 ? "PAY NOW" : "CLEAR"} badgeColor={stats.unpaidCommission > 0 ? "#dc2626" : "#16a34a"} themeColor="#dc2626" icon={<AlertTriangle size={20} />} />
                <GlassStatCard index={6} title="TRUST SCORE" value={`${stats.trustScore}/100`} badgeText="RATING" badgeColor="#db2777" themeColor="#db2777" icon={<ShieldCheck size={20} />} />
            </div>

            <div className="chart-section fade-in-up">
                <div className="chart-header">
                    <div><h3>REVENUE ANALYTICS</h3><p>Financial Performance</p></div>
                    <div className="time-tabs">
                        <button className={timeRange === 'WEEK' ? 'active' : ''} onClick={()=>setTimeRange('WEEK')}>WEEK</button>
                        <button className={timeRange === 'MONTH' ? 'active' : ''} onClick={()=>setTimeRange('MONTH')}>MONTH</button>
                        <button className={timeRange === 'YEAR' ? 'active' : ''} onClick={()=>setTimeRange('YEAR')}>YEAR</button>
                    </div>
                </div>
                <div className="chart-wrapper"><Line data={chartConfig} options={chartOptions} /></div>
            </div>
        </div>
    );
};

export default Dashboard;