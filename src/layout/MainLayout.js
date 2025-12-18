// src/layout/MainLayout.js

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import TopHeader from '../components/TopHeader'; // Import the new header
import './Layout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            {/* 1. Add the Global Header */}
            <TopHeader />

            {/* 2. The Content Area */}
            <main className="content-area">
                <Outlet />
            </main>

            {/* 3. The Bottom Navigation (unchanged) */}
            <nav className="bottom-nav">
                <NavLink to="/dashboard" className="nav-link">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                </NavLink>
                <NavLink to="/tools" className="nav-link">
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-text">Tools</span>
                </NavLink>
                <NavLink to="/sj10-university" className="nav-link">
                    <span className="nav-icon">🎓</span>
                    <span className="nav-text">University</span>
                </NavLink>
                <NavLink to="/account" className="nav-link">
                    <span className="nav-icon">👤</span>
                    <span className="nav-text">Account</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default MainLayout;