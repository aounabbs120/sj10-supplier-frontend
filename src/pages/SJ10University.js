// src/pages/SJ10University.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './SJ10University.css';

// --- Data Source: Add your video links and a category here ---
const youtubeLinks = [
    { url: 'https://www.youtube.com/watch?v=c-I5S_zTwf8', category: 'Basics' },
    { url: 'https://www.youtube.com/watch?v=W6NZfCO5eZE', category: 'Basics' },
    { url: 'https://www.youtube.com/watch?v=k32voqQhODc', category: 'Intermediate' },
    { url: 'https://www.youtube.com/watch?v=8dWL3wF_OMw', category: 'Advanced' },
    { url: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', category: 'Intermediate' },
    { url: 'https://www.youtube.com/watch?v=SqcY0GlETPk', category: 'Advanced' },
    { url: 'https://www.youtube.com/watch?v=HGTJBPNC-Gw', category: 'Basics' },
    { url: 'https://www.youtube.com/watch?v=Q7AOvWpIYV4', category: 'Intermediate' }, // Example: Marketing
];

const filters = ['All', 'Basics', 'Intermediate', 'Advanced'];

// --- Reusable, Animated Video Card with Shimmer Loading ---
const VideoCard = ({ video, onClick, style }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    
    return (
        <div className="video-card" onClick={onClick} style={style}>
            <div className="thumbnail-wrapper">
                {/* Shimmer effect is active until image loads */}
                {!isImageLoaded && <div className="shimmer-overlay"></div>}
                <img 
                    src={video.thumbnail_url} 
                    alt={video.title} 
                    className={`thumbnail-image ${isImageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setIsImageLoaded(true)}
                />
                <div className="play-icon">▶</div>
            </div>
            <div className="video-details">
                <p className="video-category">{video.category}</p>
                <h3 className="video-title">{video.title}</h3>
                <p className="video-author">{video.author_name}</p>
            </div>
        </div>
    );
};

// --- Skeleton Card for Initial Load ---
const SkeletonCard = () => (
    <div className="video-card skeleton">
        <div className="thumbnail-wrapper">
            <div className="shimmer-overlay" style={{ animation: 'none' }}></div>
        </div>
        <div className="video-details">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line long"></div>
        </div>
    </div>
);


const SJ10University = ({ setIsLoading }) => {
    const navigate = useNavigate();
    const [allVideos, setAllVideos] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        setIsLoading(true); // Show global SJLoader

        const fetchAllVideos = async () => {
            try {
                const videoPromises = youtubeLinks.map(link =>
                    fetch(`https://noembed.com/embed?url=${link.url}`)
                        .then(res => res.json())
                        .then(data => ({ ...data, category: link.category })) // Add category to data
                );
                
                const videos = await Promise.all(videoPromises);
                const validVideos = videos.filter(v => v.title); // Filter out any API errors
                setAllVideos(validVideos);
            } catch (error) {
                console.error("Failed to fetch video data:", error);
            } finally {
                // Ensure a smooth transition from the global loader
                setTimeout(() => {
                    setIsLoading(false);
                    setPageLoading(false);
                }, 500);
            }
        };

        fetchAllVideos();
    }, [setIsLoading]);

    const filteredVideos = useMemo(() => {
        return allVideos
            .filter(video => activeFilter === 'All' || video.category === activeFilter)
            .filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allVideos, activeFilter, searchTerm]);
    
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

    if (pageLoading) {
        // While the main loader is visible, we can show skeletons in the background for a better transition
        return (
            <div className="university-container">
                <div className="video-grid">
                    {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="university-container">
            {/* --- Hero Section --- */}
            <header className="university-header fade-in-down">
                <div className="header-icon">🎓</div>
                <h1>SJ10 Academy</h1>
                <p className="subtitle">Your Gateway to E-commerce Excellence. Master the tools and strategies to grow your business on our platform.</p>
            </header>

            {/* --- Controls Section --- */}
            <div className="controls-container fade-in-down" style={{ animationDelay: '0.2s' }}>
                <div className="search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search for a topic..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-pills">
                    {filters.map(filter => (
                        <button 
                            key={filter}
                            className={`pill ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Video Grid --- */}
            <div className="video-grid">
                {filteredVideos.length > 0 ? (
                    filteredVideos.map((video, index) => (
                        <VideoCard
                            key={video.url}
                            video={video}
                            onClick={() => handleVideoClick(video.url)}
                            style={{ animationDelay: `${index * 100}ms` }}
                        />
                    ))
                ) : (
                    <div className="no-results-message">
                        <h3>No Videos Found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SJ10University;