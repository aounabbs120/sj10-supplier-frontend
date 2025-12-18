// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import supplierService from '../services/supplierService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

// --- 1. Helper Component: Animated Counter ---
const CountUp = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * (end - 0) + 0));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
};

// --- 2. Helper Component: SVG Mini Chart ---
const MiniChartSVG = ({ color = "#4ade80" }) => (
    <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
        </defs>
        <path d="M0 35 L10 30 L20 32 L30 20 L40 25 L50 15 L60 18 L70 8 L80 12 L90 2 L100 8 V40 H0 Z" 
              fill={`url(#grad-${color})`} stroke="none" />
        <path d="M0 35 L10 30 L20 32 L30 20 L40 25 L50 15 L60 18 L70 8 L80 12 L90 2 L100 8" 
              fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const StatCard = ({ title, value, percentage, index, icon, color }) => (
    <div className="stat-card" style={{ animationDelay: `${index * 150}ms` }}>
        <div className="stat-header">
            <div className={`stat-icon-wrapper ${color}`}>
                {icon}
            </div>
            {percentage && (
                <span className={`stat-percentage ${percentage.startsWith('+') ? 'positive' : 'negative'}`}>
                    {percentage}
                </span>
            )}
        </div>
        <div className="stat-content">
            <h3 className="stat-value">
                {/* Use raw number for counting if possible, else string */}
                {typeof value === 'number' ? <CountUp end={value} /> : value}
            </h3>
            <p className="stat-title">{title}</p>
        </div>
        <div className="stat-chart-bg">
            <MiniChartSVG color={percentage.startsWith('+') ? '#10b981' : '#f43f5e'} />
        </div>
    </div>
);

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = ({ setIsLoading }) => {
    const [supplierInfo, setSupplierInfo] = useState(null);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('YEAR');
    const [pageLoading, setPageLoading] = useState(true);
    
    // State to handle profile image fallback
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!navigator.onLine) {
                setError("No internet connection.");
                setIsLoading(false); 
                setPageLoading(false);
                return;
            }
            
            setIsLoading(true);

            try {
                const [profile, dashboardApiResponse] = await Promise.all([
                    supplierService.getMyProfile(),
                    supplierService.getDashboardStats()
                ]);

                setSupplierInfo(profile);
                
                const statsData = dashboardApiResponse.stats || dashboardApiResponse;
                setStats(statsData);
                
                // Use real data or fallback data for visual consistency
                if (dashboardApiResponse.chartData && dashboardApiResponse.chartData.data.length > 0) {
                    setChartData(dashboardApiResponse.chartData);
                } else {
                    setChartData({
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                        data: [15000, 25000, 20000, 40000, 35000, 60000, 55000],
                    });
                }
                
            } catch (err) {
                setError("Could not load dashboard data.");
                console.error("Dashboard fetch error:", err);
            } finally {
                setIsLoading(false);
                setPageLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);

    if (error) {
        return (
            <div className="full-screen-message-container">
                <div className="message-box">
                    <span className="sad-emoji">⚠️</span> 
                    <h1>Oops!</h1> 
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    if (pageLoading) return null;

    // Chart Options
    const salesChartConfig = {
        labels: chartData?.labels ?? [],
        datasets: [{
            label: 'Sales (PKR)',
            data: chartData?.data ?? [],
            borderColor: '#6366f1',
            borderWidth: 3,
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
                gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
                return gradient;
            },
            tension: 0.4, 
            pointRadius: 4, 
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            fill: true,
        }],
    };
    
    const salesChartOptions = {
        responsive: true, 
        maintainAspectRatio: false,
        animation: { duration: 2000, easing: 'easeOutQuart' },
        plugins: { 
            legend: { display: false },
            tooltip: { 
                backgroundColor: '#1f2937', 
                titleColor: '#fff', 
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
            } 
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
            y: {
                grid: { borderDash: [5, 5], color: '#e5e7eb' },
                ticks: { color: '#9ca3af', callback: (val) => `${val / 1000}k` }
            }
        },
    };

    // Fallback Image Logic
    const profileImageSrc = !imgError && supplierInfo?.profile_pic 
        ? supplierInfo.profile_pic 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(supplierInfo?.full_name || 'User')}&background=6366f1&color=fff&size=128`;

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <header className="dashboard-header fade-in-down">
                <div className="header-text">
                    <h1>Hello, {supplierInfo?.full_name?.split(' ')[0] || 'Supplier'}! 👋</h1>
                    <p>Here's what's happening with your store today.</p>
                </div>
                <div className="header-actions">
                    <div className="profile-container">
                        <img 
                            src={profileImageSrc} 
                            alt="Profile" 
                            className="profile-picture" 
                            onError={() => setImgError(true)}
                        />
                        <div className="status-indicator"></div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            {stats && (
              <div className="stats-grid">
                  <StatCard 
                    title="Total Products" 
                    value={stats.totalProducts ?? 0} 
                    percentage="+2.5%" 
                    index={0} 
                    icon="📦"
                    color="blue"
                  />
                  <StatCard 
                    title="Pending Orders" 
                    value={stats.pendingOrders ?? 0} 
                    percentage="-1.8%" 
                    index={1} 
                    icon="⏳"
                    color="orange"
                  />
                  <StatCard 
                    title="Delivered" 
                    value={stats.totalDeliveredOrders ?? 0} 
                    percentage="+5.1%" 
                    index={2} 
                    icon="✅"
                    color="green"
                  />
                  <StatCard 
                    title="New Reviews" 
                    value={stats.newReviews ?? 0} 
                    percentage="+12%" 
                    index={3} 
                    icon="⭐"
                    color="purple"
                  />
              </div>
            )}

            {/* Chart Section */}
            <div className="sales-chart-container fade-in-up">
                <div className="chart-header">
                    <div className="chart-title">
                        <h3>Sales Analytics</h3>
                        <p>Revenue over time</p>
                    </div>
                    <div className="chart-tabs">
                        {['WEEK', 'MONTH', 'YEAR'].map((tab) => (
                            <button 
                                key={tab}
                                className={activeTab === tab ? 'active' : ''} 
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="chart-wrapper">
                    <Line options={salesChartOptions} data={salesChartConfig} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;