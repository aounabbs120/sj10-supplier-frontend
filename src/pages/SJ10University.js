// src/pages/SJ10University.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SJ10University.css';

//======================================================================
//   ✅  ADD OR REMOVE YOUR YOUTUBE LINKS IN THIS LIST  ✅
//======================================================================
const youtubeLinks = [
    'https://www.youtube.com/watch?v=c-I5S_zTwf8', // React
    'https://www.youtube.com/watch?v=W6NZfCO5eZE', // JavaScript
    'https://www.youtube.com/watch?v=k32voqQhODc', // CSS Flexbox
    'https://www.youtube.com/watch?v=8dWL3wF_OMw', // Node.js
    'https://www.youtube.com/watch?v=G3e-cpL7ofc', // Git and GitHub
    'https://www.youtube.com/watch?v=SqcY0GlETPk', // Docker
    'https://www.youtube.com/watch?v=HGTJBPNC-Gw', // Figma
];
//======================================================================

const SJ10University = () => {
    const navigate = useNavigate();
    const [allVideos, setAllVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all video details on initial load
    useEffect(() => {
        const fetchAllVideos = async () => {
            const videoDetailsPromises = youtubeLinks.map(link =>
                fetch(`https://noembed.com/embed?url=${link}`).then(res => res.json())
            );
            const videos = await Promise.all(videoDetailsPromises);
            setAllVideos(videos.filter(v => v.title)); // Filter out any errors
            setFilteredVideos(videos.filter(v => v.title));
            setIsLoading(false);
        };
        fetchAllVideos();
    }, []);

    // --- WORKING SEARCH FUNCTION ---
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const searchResults = allVideos.filter(video =>
            video.title.toLowerCase().includes(query)
        );
        setFilteredVideos(searchResults);
    };

    const getYouTubeIdFromUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname === 'youtu.be' ? urlObj.pathname.slice(1) : urlObj.searchParams.get('v');
        } catch (e) { return null; }
    };

    const handleVideoClick = (videoUrl) => {
        const videoId = getYouTubeIdFromUrl(videoUrl);
        if (videoId) navigate(`/sj10-university/${videoId}`);
    };

    return (
        <div className="sj10-academy-page">
            <header className="academy-header">
                <span className="back-arrow" onClick={() => navigate(-1)}>←</span>
                <div className="academy-brand">
                    <img src="/sj10-logo.png" alt="SJ10 Logo" className="brand-logo" />
                    <span>SJ10</span>
                </div>
                <span className="hamburger-menu">☰</span>
            </header>

            <div className="academy-main-content">
                <h1 className="main-title">SJ10 Academy</h1>
                <p className="subtitle">Baycho Asani Se</p>

                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search videos"
                        className="search-input"
                        onChange={handleSearch}
                    />
                </div>

                <div className="filter-pills">
                    <button className="pill active">All</button>
                    <button className="pill">Basics</button>
                    <button className="pill">Intermediate</button>
                    <button className="pill">Advanced</button>
                </div>

                <div className="video-list-container">
                    {isLoading ? (
                        <p>Loading videos...</p>
                    ) : (
                        filteredVideos.map((video, index) => (
                            <div className="video-list-item" key={index} onClick={() => handleVideoClick(video.url)}>
                                <div className="video-list-thumbnail">
                                    <img src={video.thumbnail_url} alt={video.title} />
                                    {/* Duration can't be fetched with this simple API, so we omit it for now */}
                                </div>
                                <p className="video-list-title">{video.title}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SJ10University;