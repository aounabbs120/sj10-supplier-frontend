// src/pages/ProductForm.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import supplierService from '../services/supplierService';
import Modal from '../components/Modal';
import { categoryAttributes, colorFamilies } from '../data/attributes';
import './ProductForm.css';

// --- ICONS ---
const CameraIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>);
const VideoIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>);
const TrashIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const YoutubeIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>);
const BoldIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>);
const ItalicIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>);
const ListIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>);

// --- CONSTANTS ---
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const initialProductState = {
    title: '', description: '', price: '', discounted_price: '',
    quantity: '', status: 'In Stock', category_id: '', main_category_id: '',
    attributes: {}, variants: [], image_urls: [], video_url: '',
    shipping_details: 'Standard', package_information: '', season: 'No Season',
    custom_season: '', pkg_length: '', pkg_width: '', pkg_height: '',
    pkg_unit: 'cm', pkg_weight: '', pkg_weight_unit: 'g'
};

const safeParseJSON = (jsonString, defaultValue) => {
    try { const parsed = JSON.parse(jsonString); return parsed === null ? defaultValue : parsed; } catch (e) { return defaultValue; }
};

// --- HELPER COMPONENTS ---

const AttributeField = ({ attr, value, onChange }) => {
    const [isCustom, setIsCustom] = useState(false);
    useEffect(() => {
        if (attr.type === 'enum' && value) {
            const options = (attr.options || '').split(',').map(o => o.trim());
            if (!options.includes(value) && value !== '') setIsCustom(true); else setIsCustom(false);
        }
    }, [attr.type, attr.options, value]);
    const handleEnumChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'Custom') { setIsCustom(true); onChange(''); } else { setIsCustom(false); onChange(selectedValue); }
    };
    switch (attr.type.toLowerCase()) {
        case 'enum':
            const options = (attr.options || '').split(',').map(o => o.trim());
            return (<><select value={isCustom ? 'Custom' : value || ''} onChange={handleEnumChange}><option value="">Select...</option>{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}<option value="Custom">Custom...</option></select>{isCustom && <input type="text" className="custom-attr-input" placeholder="Enter custom value" value={value} onChange={(e) => onChange(e.target.value)} />}</>);
        default: return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={attr.options}/>;
    }
};

const AttributesModal = ({ isOpen, onClose, onSave, subCategoryId, existingAttributes, attributeData }) => {
    const [attributes, setAttributes] = useState({});
    const [customAttributes, setCustomAttributes] = useState([]);
    useEffect(() => {
        if (isOpen) {
            const predefined = {}; const custom = [];
            const attributesForCategory = subCategoryId && attributeData ? (attributeData[String(subCategoryId)] || []) : [];
            const predefinedKeys = attributesForCategory.map(attr => attr.name);
            for (const key in existingAttributes) { if (predefinedKeys.includes(key)) { predefined[key] = existingAttributes[key]; } else { custom.push({ key, value: existingAttributes[key] }); } }
            setAttributes(predefined); setCustomAttributes(custom);
        }
    }, [isOpen, existingAttributes, subCategoryId, attributeData]);
    const handleSave = () => {
        const finalAttributes = { ...attributes };
        customAttributes.forEach(attr => { if (attr.key && attr.value) { finalAttributes[attr.key] = attr.value; } });
        onSave(finalAttributes); onClose();
    };
    const handleAttrChange = (name, value) => setAttributes(prev => ({...prev, [name]: value}));
    const addCustomAttribute = () => setCustomAttributes(prev => [...prev, { key: '', value: '' }]);
    const updateCustomAttribute = (index, field, value) => { const newCustom = [...customAttributes]; newCustom[index][field] = value; setCustomAttributes(newCustom); };
    const removeCustomAttribute = (index) => setCustomAttributes(prev => prev.filter((_, i) => i !== index));
    const attributesForCategory = subCategoryId && attributeData ? (attributeData[String(subCategoryId)] || []) : [];
    return (<Modal isOpen={isOpen} onClose={onClose} title="Manage Attributes"><div className="attributes-form">{attributesForCategory.length > 0 ? (attributesForCategory.map(attr => (<div key={attr.name} className="form-group"><label>{attr.name}</label><AttributeField attr={attr} value={attributes[attr.name]} onChange={(value) => handleAttrChange(attr.name, value)} /></div>))) : <p>No predefined attributes. Add custom ones below.</p>}</div><div className="custom-attributes-section"><h4>Custom Attributes</h4>{customAttributes.map((attr, index) => (<div key={index} className="custom-attribute-pair"><input type="text" placeholder="Attribute Name" value={attr.key} onChange={(e) => updateCustomAttribute(index, 'key', e.target.value)} /><input type="text" placeholder="Value" value={attr.value} onChange={(e) => updateCustomAttribute(index, 'value', e.target.value)} /><button type="button" className="btn-delete-small" onClick={() => removeCustomAttribute(index)}>×</button></div>))}<button type="button" className="btn-secondary" onClick={addCustomAttribute}>+ Add Custom Attribute</button></div><div className="modal-actions"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button type="button" className="btn-primary" onClick={handleSave}>Save Attributes</button></div></Modal>);
};

const VariantsModal = ({ isOpen, onClose, onSave, existingVariants, colorData }) => {
    const [variants, setVariants] = useState([]);
    const [currentVariant, setCurrentVariant] = useState({ color: '', size: 'S', price: '', stock: '' });
    const [sizeType, setSizeType] = useState('stitched');
    const [colorSearch, setColorSearch] = useState('');
    useEffect(() => { if (isOpen) setVariants(existingVariants || []); }, [isOpen, existingVariants]);
    const handleAddVariant = () => {
        if (!currentVariant.color || !currentVariant.size || !currentVariant.price || !currentVariant.stock) { alert('Color, Size, Price, and Stock are required.'); return; }
        setVariants(prev => [...prev, currentVariant]);
        setCurrentVariant({ color: '', size: 'S', price: currentVariant.price, stock: currentVariant.stock, sku: '' });
        setColorSearch('');
    };
    const removeVariant = (index) => setVariants(prev => prev.filter((_, i) => i !== index));
    const handleSave = () => { onSave(variants); onClose(); };
    const filteredColors = (colorData || []).filter(c => c.name.toLowerCase().includes(colorSearch.toLowerCase()));
    const renderSizeInput = () => {
        const props = { value: currentVariant.size, onChange: e => setCurrentVariant(p => ({...p, size: e.target.value})) };
        switch(sizeType) {
            case 'stitched': return <select {...props}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option></select>;
            case 'number': return <input type="text" placeholder="e.g., 38, 40" {...props} />;
            case 'dims': return <input type="text" placeholder="e.g., 10x12 inches" {...props} />;
            default: return <input type="text" placeholder="Custom Size" {...props} />;
        }
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title="Manage Variants" size="xlarge"><div className="variant-layout"><div className="variant-inputs"><h4>Add New Variant</h4><div className="form-group"><label>Color</label><input type="text" placeholder="Search colors..." value={colorSearch} onChange={e => setColorSearch(e.target.value)} /><div className="color-grid">{filteredColors.map(c => (<div key={c.name} className={`color-item ${currentVariant.color === c.name ? 'selected' : ''}`} onClick={() => setCurrentVariant(p => ({...p, color: c.name}))}><div className="color-circle" style={{ background: c.hex }}></div><span>{c.name}</span></div>))}</div></div><div className="form-group"><label>Size Type</label><select value={sizeType} onChange={e => setSizeType(e.target.value)}><option value="stitched">Stitched</option><option value="number">Number</option><option value="dims">Dimensions</option><option value="custom">Custom</option></select></div><div className="form-group"><label>Size</label>{renderSizeInput()}</div><div className="form-grid"><div className="form-group"><label>Price *</label><input type="number" value={currentVariant.price} onChange={e => setCurrentVariant(p => ({...p, price: e.target.value}))} /></div><div className="form-group"><label>Stock *</label><input type="number" value={currentVariant.stock} onChange={e => setCurrentVariant(p => ({...p, stock: e.target.value}))} /></div></div><button type="button" className="btn-primary" onClick={handleAddVariant} style={{width: '100%', marginTop: '10px'}}>+ Add to List</button></div><div className="variant-list"><h4>Current Variants ({variants.length})</h4><div className="table-wrapper">{variants.length > 0 ? (<table><thead><tr><th>Color</th><th>Size</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead><tbody>{variants.map((v, i) => (<tr key={i}><td>{v.color}</td><td>{v.size}</td><td>{v.price}</td><td>{v.stock}</td><td><button type="button" className="btn-delete-small" onClick={() => removeVariant(i)}>×</button></td></tr>))}</tbody></table>) : <p>No variants have been added yet.</p>}</div></div></div><div className="modal-actions"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button type="button" className="btn-primary" onClick={handleSave}>Done</button></div></Modal>);
};

// --- MAIN COMPONENT ---

const ProductForm = ({ setIsLoading }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(productId);
    const textAreaRef = useRef(null);

    const [product, setProduct] = useState(initialProductState);
    const [categories, setCategories] = useState([]);
    
    // --- Media Logic ---
    const [activeImages, setActiveImages] = useState([]); 
    
    // Video States
    const [videoType, setVideoType] = useState('upload'); // 'upload' | 'youtube'
    const [videoFile, setVideoFile] = useState(null); 
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0); 
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState(''); 
    const [youtubeUrl, setYoutubeUrl] = useState('');

    const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
    const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
    
    // --- HERE IS THE FIX: DEFINING STATE PROPERLY ---
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedCategories = await supplierService.getCategories();
            setCategories(fetchedCategories);
            if (isEditMode) {
                const productToEdit = await supplierService.getProductById(productId);
                if (productToEdit) {
                    const parentCategory = fetchedCategories.find(c => String(c.id) === String(productToEdit.category_id))?.parent_id || '';
                    
                    setProduct({ ...initialProductState, ...productToEdit, main_category_id: parentCategory,
                        attributes: safeParseJSON(productToEdit.attributes, {}),
                        variants: safeParseJSON(productToEdit.variants, []),
                    });

                    const existingImgs = safeParseJSON(productToEdit.image_urls, []);
                    setActiveImages(existingImgs.map(url => ({ url, isUploading: false, progress: 100, id: url })));

                    if (productToEdit.video_url) {
                        if (productToEdit.video_url.includes('youtube.com') || productToEdit.video_url.includes('youtu.be')) {
                            setVideoType('youtube');
                            setYoutubeUrl(productToEdit.video_url);
                        } else {
                            setVideoType('upload');
                            setUploadedVideoUrl(productToEdit.video_url);
                        }
                    }
                }
            }
        } catch (err) { setError('Failed to load data.'); } 
        finally { setLoading(false); }
    }, [isEditMode, productId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
        if (name === "main_category_id") setProduct(prev => ({ ...prev, category_id: '', attributes: {} }));
    };

    // --- Rich Text Logic ---
    const insertTag = (tag) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = product.description;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);
        
        let newText = '';
        if (tag === 'list') {
            newText = before + `\n• ${selection}` + after;
        } else {
            newText = before + `<${tag}>${selection}</${tag}>` + after;
        }
        
        setProduct(prev => ({ ...prev, description: newText }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
        }, 0);
    };

    // --- Upload Helper ---
    const uploadWithProgress = async (file, onProgress) => {
        const formData = new FormData();
        formData.append('images', file);
        const token = localStorage.getItem('supplierToken');
        
        const response = await axios.post(`${API_BASE_URL}/api/supplier/products/upload`, formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        });
        return response.data;
    };

    // --- Background Image Upload ---
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if ((activeImages.length + files.length) > 8) {
            alert('Maximum 8 images total.');
            return;
        }

        const tempFiles = files.map(file => ({
            id: Math.random().toString(36),
            url: URL.createObjectURL(file),
            isUploading: true,
            progress: 0,
            file: file 
        }));

        setActiveImages(prev => [...prev, ...tempFiles]);

        const options = { maxSizeMB: 0.2, maxWidthOrHeight: 1024, useWebWorker: true, fileType: 'image/webp' };

        for (let i = 0; i < tempFiles.length; i++) {
            const tempItem = tempFiles[i];
            try {
                const compressedFile = await imageCompression(tempItem.file, options);
                const res = await uploadWithProgress(compressedFile, (percent) => {
                    setActiveImages(prev => prev.map(img => 
                        img.id === tempItem.id ? { ...img, progress: percent } : img
                    ));
                });
                setActiveImages(prev => prev.map(img => 
                    img.id === tempItem.id ? { ...img, url: res.urls[0], isUploading: false, progress: 100 } : img
                ));
            } catch (err) {
                console.error("Image upload failed", err);
                setActiveImages(prev => prev.filter(img => img.id !== tempItem.id));
            }
        }
    };

    const removeImage = (id) => setActiveImages(prev => prev.filter(img => img.id !== id));

    // --- Background Video Upload ---
    const handleVideoFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 80 * 1024 * 1024) { alert('Video max 80MB.'); return; }

        setVideoFile(file);
        setIsVideoUploading(true);
        setVideoProgress(0);
        setError('');

        try {
            const res = await uploadWithProgress(file, (percent) => {
                setVideoProgress(percent);
            });
            if (res.urls && res.urls.length > 0) {
                setUploadedVideoUrl(res.urls[0]);
            }
        } catch (err) {
            setError("Failed to upload video.");
            setVideoFile(null);
        } finally {
            setIsVideoUploading(false);
        }
    };

    const removeVideo = () => { 
        setVideoFile(null); setUploadedVideoUrl(''); setYoutubeUrl(''); setVideoProgress(0);
    };

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    // --- Modal Handlers ---
    const handleSaveAttributes = (newAttributes) => setProduct(prev => ({ ...prev, attributes: newAttributes }));
    const handleSaveVariants = (newVariants) => setProduct(prev => ({ ...prev, variants: newVariants }));

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!product.title) return setError('Title required.');
        if (!product.price) return setError('Price required.');
        if (!product.category_id) return setError('Sub-Category required.');
        if (Object.keys(product.attributes).length < 2) return setError('Attributes required.');

        const pendingImages = activeImages.some(img => img.isUploading);
        if (pendingImages || isVideoUploading) {
            alert("Media is still uploading in background. Please wait...");
            return;
        }

        // --- GLOBAL LOADER TRIGGER ---
        setIsLoading(true); 
        setIsSaving(true);
        
        try {
            const finalImageUrls = activeImages.map(img => img.url);
            const finalVideoUrl = videoType === 'youtube' ? youtubeUrl : uploadedVideoUrl;
            const pkgInfo = `${product.pkg_length||'L'}x${product.pkg_width||'W'}x${product.pkg_height||'H'} ${product.pkg_unit}, ${product.pkg_weight||'W'}${product.pkg_weight_unit}`;

            const payload = {
                ...product,
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity, 10),
                image_urls: finalImageUrls,
                video_url: finalVideoUrl || null,
                package_information: pkgInfo,
                variants: product.variants.map(v => ({
                    ...v, price: parseFloat(v.price), stock: parseInt(v.stock, 10)
                }))
            };

            if (isEditMode) {
                await supplierService.updateProduct(productId, payload);
            } else {
                await supplierService.createProduct(payload);
            }
            navigate('/products');
        } catch (err) {
            setError('Error saving product.');
            setIsLoading(false); // Stop global loader on error
            setIsSaving(false);
        } 
    };

    const parentCategories = categories.filter(c => !c.parent_id);
    const subCategories = product.main_category_id ? categories.filter(c => String(c.parent_id) === String(product.main_category_id)) : [];

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="product-form-container">
            <AttributesModal isOpen={isAttributesModalOpen} onClose={() => setIsAttributesModalOpen(false)} onSave={handleSaveAttributes} subCategoryId={product.category_id} existingAttributes={product.attributes} attributeData={categoryAttributes} />
            <VariantsModal isOpen={isVariantsModalOpen} onClose={() => setIsVariantsModalOpen(false)} onSave={handleSaveVariants} existingVariants={product.variants} colorData={colorFamilies} />
            
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-card">
                    <h3>Basic Details & Media</h3>
                    
                    <div className="form-group full-width" style={{marginBottom: '25px'}}>
                        <label>Product Title <span className="required-star">*</span></label>
                        <input type="text" name="title" value={product.title} onChange={handleChange} placeholder="e.g., Men Cotton Casual Shirt" required />
                    </div>

                    {/* --- MEDIA SECTION --- */}
                    <div className="media-section">
                        <label className="section-label">Media Gallery</label>
                        
                        {/* Toggle */}
                        <div className="video-toggle-container">
                            <div className="segmented-control">
                                <button type="button" className={videoType === 'upload' ? 'active' : ''} onClick={() => setVideoType('upload')}>
                                    <VideoIcon /> Upload File
                                </button>
                                <button type="button" className={videoType === 'youtube' ? 'active' : ''} onClick={() => setVideoType('youtube')}>
                                    <YoutubeIcon /> YouTube
                                </button>
                            </div>
                        </div>

                        <div className="media-upload-row">
                            {/* Image Upload Button */}
                            <div className="upload-tile">
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} id="img-up" />
                                <label htmlFor="img-up">
                                    <CameraIcon />
                                    <span>Add Photos</span>
                                </label>
                            </div>

                            {/* Video Upload Button (Conditional) */}
                            {videoType === 'upload' && (
                                <div className="upload-tile video-tile">
                                    <input type="file" accept="video/*" onChange={handleVideoFileChange} id="vid-up" />
                                    <label htmlFor="vid-up">
                                        <div className="icon-badge"><VideoIcon /></div>
                                        <span>Add Video</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* YouTube Input */}
                        {videoType === 'youtube' && (
                            <div className="youtube-input-container">
                                <input type="text" placeholder="Paste YouTube Link here..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                            </div>
                        )}

                        {/* PREVIEWS GRID */}
                        <div className="previews-grid">
                            {activeImages.map((img) => (
                                <div key={img.id} className="preview-card">
                                    <img src={img.url} alt="preview" />
                                    {img.isUploading && (
                                        <div className="upload-overlay">
                                            <div className="progress-track"><div className="progress-bar" style={{width: `${img.progress}%`}}></div></div>
                                        </div>
                                    )}
                                    <button type="button" className="delete-btn" onClick={() => removeImage(img.id)}><TrashIcon /></button>
                                </div>
                            ))}

                            {/* Video Preview */}
                            {(uploadedVideoUrl || videoFile || (videoType === 'youtube' && getYoutubeEmbedUrl(youtubeUrl))) && (
                                <div className="preview-card video-card">
                                    {videoType === 'upload' ? (
                                        <video src={videoFile ? URL.createObjectURL(videoFile) : uploadedVideoUrl} controls />
                                    ) : (
                                        <iframe src={getYoutubeEmbedUrl(youtubeUrl)} title="YouTube" frameBorder="0"></iframe>
                                    )}
                                    
                                    {isVideoUploading && (
                                        <div className="upload-overlay">
                                            <div className="progress-track"><div className="progress-bar" style={{width: `${videoProgress}%`}}></div></div>
                                            <span>{videoProgress}%</span>
                                        </div>
                                    )}
                                    <button type="button" className="delete-btn" onClick={removeVideo}><TrashIcon /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RICH TEXT DESCRIPTION --- */}
                    <div className="form-group full-width" style={{marginTop: '25px'}}>
                        <label>Product Description</label>
                        <div className="rich-text-wrapper">
                            <div className="rich-toolbar">
                                <button type="button" onClick={() => insertTag('b')} title="Bold"><BoldIcon /></button>
                                <button type="button" onClick={() => insertTag('i')} title="Italic"><ItalicIcon /></button>
                                <button type="button" onClick={() => insertTag('list')} title="List"><ListIcon /></button>
                            </div>
                            <textarea 
                                ref={textAreaRef}
                                name="description" 
                                rows="5" 
                                value={product.description} 
                                onChange={handleChange} 
                                placeholder="Write a detailed description..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Rest of Form */}
                <div className="form-card"><h3>Pricing & Inventory</h3><div className="form-grid"><div className="form-group"><label>Base Price <span className="required-star">*</span></label><input type="number" name="price" value={product.price} onChange={handleChange} required /></div><div className="form-group"><label>Discounted Price</label><input type="number" name="discounted_price" value={product.discounted_price} onChange={handleChange} /></div><div className="form-group"><label>Stock <span className="required-star">*</span></label><input type="number" name="quantity" value={product.quantity} onChange={handleChange} required /></div><div className="form-group"><label>Status</label><select name="status" value={product.status} onChange={handleChange}><option>In Stock</option><option>Out of Stock</option></select></div></div></div>
                <div className="form-card"><h3>Category & Specifications</h3><div className="form-grid"><div className="form-group"><label>Main Category</label><select name="main_category_id" value={product.main_category_id || ''} onChange={handleChange} required><option value="">Select...</option>{parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div></div>{subCategories.length > 0 && (<div className="form-group full-width" style={{marginTop: '20px'}}><label>Sub-Category</label><div className="radio-grid">{subCategories.map(cat => (<label key={cat.id} className={`radio-label ${String(product.category_id) === String(cat.id) ? 'selected' : ''}`}><input type="radio" name="category_id" value={cat.id} checked={String(product.category_id) === String(cat.id)} onChange={handleChange} />{cat.name}</label>))}</div></div>)}<div className="form-grid" style={{marginTop: '20px'}}><div className="form-group"><button type="button" className="btn-secondary" onClick={() => setIsAttributesModalOpen(true)} disabled={!product.category_id}>{Object.keys(product.attributes).length > 0 ? `${Object.keys(product.attributes).length} Attributes` : 'Add Attributes'}</button></div><div className="form-group"><button type="button" className="btn-secondary" onClick={() => setIsVariantsModalOpen(true)}>{product.variants.length > 0 ? `${product.variants.length} Variants` : 'Add Variants'}</button></div></div></div>
                <div className="form-card"><h3>Shipping</h3><div className="form-grid"><div className="form-group"><label>Type</label><select name="shipping_details" value={product.shipping_details} onChange={handleChange}><option>Standard</option><option>Express</option></select></div><div className="form-group"><label>Season</label><select name="season" value={product.season} onChange={handleChange}><option>No Season</option><option>All Seasons</option><option>Summer</option><option>Winter</option></select></div></div><div className="form-grid" style={{marginTop: '20px'}}><div className="form-group"><label>Dimensions (LxWxH)</label><div className="input-group"><input type="number" name="pkg_length" placeholder="L" value={product.pkg_length} onChange={handleChange} /><input type="number" name="pkg_width" placeholder="W" value={product.pkg_width} onChange={handleChange} /><input type="number" name="pkg_height" placeholder="H" value={product.pkg_height} onChange={handleChange} /><select name="pkg_unit" value={product.pkg_unit} onChange={handleChange}><option>cm</option><option>in</option></select></div></div><div className="form-group"><label>Weight</label><div className="input-group"><input type="number" name="pkg_weight" placeholder="Weight" value={product.pkg_weight} onChange={handleChange} /><select name="pkg_weight_unit" value={product.pkg_weight_unit} onChange={handleChange}><option>g</option><option>kg</option></select></div></div></div></div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
                    {/* BUTTON NOW USES CLEAN TEXT AND DISABLES IF SAVING/UPLOADING */}
                    <button type="submit" className="btn-primary" disabled={isSaving || isVideoUploading}>
                        {isEditMode ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default ProductForm;