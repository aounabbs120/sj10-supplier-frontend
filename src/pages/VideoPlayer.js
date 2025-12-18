// src/pages/VideoPlayer.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VideoPlayer.css';

// --- Place the hardcoded list OUTSIDE the component ---
// This ensures it is a constant and doesn't trigger re-renders.
const allVideoLinks = [
    'https://www.youtube.com/watch?v=c-I5S_zTwf8',
    'https://www.youtube.com/watch?v=W6NZfCO5eZE',
    'https://www.youtube.com/watch?v=k32voqQhODc',
    'https://www.youtube.com/watch?v=8dWL3wF_OMw',
];

// Helper function to extract ID from URL (can also be outside)
const getYouTubeIdFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname === 'youtu.be' ? urlObj.pathname.slice(1) : urlObj.searchParams.get('v');
    } catch (e) { return null; }
};


const VideoPlayer = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [videoData, setVideoData] = useState(null);
    const [relatedVideos, setRelatedVideos] = useState([]);

    useEffect(() => {
        if (!videoId) return;
        
        const fetchDetails = async () => {
            const mainVideoPromise = fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`).then(res => res.json());
            
            // --- THIS LOGIC WAS CAUSING THE WARNING ---
            const relatedLinks = allVideoLinks.filter(link => !link.includes(videoId)).slice(0, 3);
            const relatedVideosPromises = relatedLinks.map(link =>
                fetch(`https://noembed.com/embed?url=${link}`).then(res => res.json())
            );

            const [mainVideo, ...related] = await Promise.all([mainVideoPromise, ...relatedVideosPromises]);

            if (mainVideo.title) setVideoData(mainVideo);
            setRelatedVideos(related.filter(v => v.title));
        };

        fetchDetails();
        // --- THIS IS THE FIX ---
        // We add 'videoId' because the effect re-runs when the videoId changes.
        // 'allVideoLinks' is now a constant outside the component, so it doesn't need to be a dependency.
    }, [videoId]);

    if (!videoData) return <div className="player-loading">Loading...</div>;

    return (
        <div className="video-player-page">
            <header className="player-header">
                <span className="back-arrow" onClick={() => navigate(-1)}>←</span>
                <h1 className="header-title">SJ10 Academy</h1>
                <div className="header-icons">
                    <span className="icon">🔍</span>
                    <span className="icon">⋮</span>
                </div>
            </header>

            <div className="player-container">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={videoData.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="video-info-container">
                <h2 className="player-video-title">{videoData.title}</h2>
                <p className="video-stats">{/* Stats not available */}</p>
                
                <div className="channel-bar">
                    <div className="channel-identity">
                        <img src="/sj10-logo.png" alt="SJ10" className="channel-avatar" />
                        <span className="channel-name">{videoData.author_name}</span>
                    </div>
                    <button className="subscribe-button">Subscribe</button>
                </div>

                <div className="action-buttons">
                    <button>👍</button>
                    <button>👎</button>
                    <button>Share</button>
                    <button>Save</button>
                    <button>Report</button>
                </div>

                <div className="comments-placeholder">
                    <p>Comments are turned off for this video.</p>
                </div>
            </div>

            <div className="related-videos-container">
                {relatedVideos.map((relatedVideo, index) => (
                    <div className="related-video-item" key={index} onClick={() => navigate(`/sj10-university/${getYouTubeIdFromUrl(relatedVideo.url)}`)}>
                        <div className="related-thumbnail">
                            <img src={relatedVideo.thumbnail_url} alt={relatedVideo.title} />
                        </div>
                        <div className="related-info">
                            <p className="related-title">{relatedVideo.title}</p>
                            <p className="related-channel">{relatedVideo.author_name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPlayer;