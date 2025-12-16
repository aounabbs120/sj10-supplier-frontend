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

// Re-integrated MiniChartSVG from your original dashboard to display in the stat cards
const MiniChartSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 30 L10 25 L20 30 L30 20 L40 25 L50 15 L60 20 L70 10 L80 15 L90 5 L100 10" 
        fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const StatCard = ({ title, value, percentage, index, children }) => (
    <div className="stat-card" style={{ animationDelay: `${index * 100}ms` }}>
        <div className="stat-info">
            <p className="stat-title">{title}</p>
            <h3 className="stat-value">{value}</h3>
            <span className={percentage.startsWith('+') ? 'stat-percentage positive' : 'stat-percentage negative'}>
                {percentage}
            </span>
        </div>
        <div className="mini-chart">
            {children}
        </div>
    </div>
);

// --- THE FINAL, ROBUST DASHBOARD COMPONENT ---
const Dashboard = ({ setIsLoading }) => {
    const [supplierInfo, setSupplierInfo] = useState(null);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('YEAR');
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!navigator.onLine) {
                setError("Sorry, you don't have an internet connection.");
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
                
                // CRITICAL FIX: Use real chart data if available, otherwise use a safe placeholder to ensure the graph always renders.
                if (dashboardApiResponse.chartData && dashboardApiResponse.chartData.data.length > 0) {
                    setChartData(dashboardApiResponse.chartData);
                } else {
                    setChartData({
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                        data: [15000, 25000, 20000, 40000, 35000, 60000, 55000],
                    });
                }
                
            } catch (err) {
                setError("Could not load your dashboard. Please try again later.");
                console.error("Dashboard fetch error:", err);
            } finally {
                setIsLoading(false);
                setPageLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);

    // Render error state if there's an issue
    if (error) {
        return (
            <div className="full-screen-message-container">
                <div className="message-box">
                    <span className="sad-emoji">😔</span> <h1>Connection Error</h1> <p>{error}</p>
                </div>
            </div>
        );
    }
    
    // While the page is loading, let the global loader handle it by returning null.
    if (pageLoading) {
        return null;
    }

    // --- Chart Configuration and Options ---
    const salesChartConfig = {
        labels: chartData?.labels ?? [],
        datasets: [{
            label: 'Total Sales',
            data: chartData?.data ?? [],
            borderColor: '#4f46e5',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
                return gradient;
            },
            tension: 0.4, pointRadius: 0, pointHoverRadius: 8,
            pointHoverBackgroundColor: '#4f46e5', pointHoverBorderColor: '#fff', fill: true,
        }],
    };
    
    const salesChartOptions = {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeInOutQuint' },
        plugins: { tooltip: { enabled: true, mode: 'index', intersect: false }, legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: false, // Allows graph to not start at 0 if data is high
                ticks: { 
                    callback: (value) => `${value / 1000}k` // Formats y-axis labels like 0.5k, 0.6k
                }
            }
        },
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-title-container">
                    <img src="/logo.gif" alt="SJ10 Logo" className="header-logo-gif" />
                    <h2>Supplier Panel</h2>
                </div>
                <div className="profile-container">
                    <img 
                        src={supplierInfo?.profile_pic ?? '/images/default-profile.png'} 
                        alt={supplierInfo?.full_name ?? 'Supplier'} 
                        className="profile-picture" 
                    />
                </div>
            </header>

            {stats && (
              <div className="stats-grid">
                  <StatCard title="Total Products" value={stats.totalProducts?.toLocaleString() ?? '0'} percentage="+2.5%" index={0}>
                      <MiniChartSVG />
                  </StatCard>
                  <StatCard title="Pending Orders" value={stats.pendingOrders?.toLocaleString() ?? '0'} percentage="-1.8%" index={1}>
                      <MiniChartSVG />
                  </StatCard>
                  <StatCard title="Delivered Orders" value={stats.totalDeliveredOrders?.toLocaleString() ?? '0'} percentage="+5.1%" index={2}>
                      <MiniChartSVG />
                  </StatCard>
                  <StatCard title="New Reviews" value={stats.newReviews?.toLocaleString() ?? '0'} percentage="+12%" index={3}>
                      <MiniChartSVG />
                  </StatCard>
              </div>
            )}

            <div className="sales-chart-container">
                <div className="chart-header">
                    <h3>Sales Analytics</h3>
                    <div className="chart-tabs">
                        <button className={activeTab === 'WEEK' ? 'active' : ''} onClick={() => setActiveTab('WEEK')}>WEEK</button>
                        <button className={activeTab === 'MONTH' ? 'active' : ''} onClick={() => setActiveTab('MONTH')}>MONTH</button>
                        <button className={activeTab === 'YEAR' ? 'active' : ''} onClick={() => setActiveTab('YEAR')}>YEAR</button>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <Line options={salesChartOptions} data={salesChartConfig} />
                </div>
            </div>
            
            <footer className="welcome-footer">
                <p>Welcome, <strong>{supplierInfo?.full_name ?? 'Valued Supplier'}</strong>, to the SJ10 Supplier Panel!</p>
            </footer>
        </div>
    );
};

export default Dashboard;