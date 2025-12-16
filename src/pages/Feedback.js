// src/pages/Feedback.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaticPage.css'; // Reuse styles
import './Feedback.css'; // Add specific styles

const Feedback = ({ setIsLoading }) => {
    const [feedbackText, setFeedbackText] = useState('');
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [setIsLoading]);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            // Just store the file names for display
            setFiles([...files, ...Array.from(e.target.files).map(f => f.name)]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedbackText) {
            alert("Please enter your feedback before submitting.");
            return;
        }
        setIsSubmitting(true);
        // Simulate a network request
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="static-page-container">
                <div className="feedback-success">
                    <div className="success-icon">✓</div>
                    <h2>Thank You!</h2>
                    <p>Your feedback has been submitted successfully.</p>
                    <button onClick={() => {
                        setIsSubmitted(false);
                        setFeedbackText('');
                        setFiles([]);
                    }} className="btn-primary">Submit Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="static-page-container">
            <div className="static-page-header">
                <h1>Submit Feedback</h1>
                <Link to="/account" className="back-link">Back to Account</Link>
            </div>
            <div className="static-content">
                <p>We value your opinion. Please let us know how we can improve the SJ10 Supplier Panel.</p>
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Write your feedback here..."
                        rows="8"
                        required
                    ></textarea>

                    <div className="file-attachment-section">
                        <label htmlFor="file-upload" className="file-upload-btn">
                            📎 Attach Files (Image/Video)
                        </label>
                        <input id="file-upload" type="file" multiple onChange={handleFileChange} />
                        <div className="file-list">
                            {files.map((fileName, index) => (
                                <span key={index} className="file-tag">{fileName}</span>
                            ))}
                        </div>
                    </div>
                    
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;