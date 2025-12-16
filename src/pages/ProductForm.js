// src/pages/ProductForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supplierService from '../services/supplierService';
import Modal from '../components/Modal';
import { categoryAttributes, colorFamilies } from '../data/attributes';
import './ProductForm.css';

const initialProductState = {
    title: '', description: '', price: '', discounted_price: '',
    quantity: '', status: 'In Stock', category_id: '', main_category_id: '',
    attributes: {}, variants: [], image_urls: [], video_url: '',
    shipping_details: 'Standard', package_information: '', season: 'No Season',
    custom_season: '', pkg_length: '', pkg_width: '', pkg_height: '',
    pkg_unit: 'cm', pkg_weight: '', pkg_weight_unit: 'g'
};

const safeParseJSON = (jsonString, defaultValue) => {
    if (typeof jsonString === 'object' && jsonString !== null) return jsonString;
    if (typeof jsonString !== 'string') return defaultValue;
    try {
        const parsed = JSON.parse(jsonString);
        return parsed === null ? defaultValue : parsed;
    } catch (e) {
        console.error("Failed to parse JSON string:", jsonString);
        return defaultValue;
    }
};

const AttributeField = ({ attr, value, onChange }) => {
    const [isCustom, setIsCustom] = useState(false);
    useEffect(() => {
        if (attr.type === 'enum' && value) {
            const options = (attr.options || '').split(',').map(o => o.trim());
            if (!options.includes(value) && value !== '') setIsCustom(true);
            else setIsCustom(false);
        }
    }, [attr.type, attr.options, value]);
    const handleEnumChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'Custom') { setIsCustom(true); onChange(''); } 
        else { setIsCustom(false); onChange(selectedValue); }
    };
    switch (attr.type.toLowerCase()) {
        case 'enum':
            const options = (attr.options || '').split(',').map(o => o.trim());
            return (<><select value={isCustom ? 'Custom' : value || ''} onChange={handleEnumChange}><option value="">Select...</option>{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}<option value="Custom">Custom...</option></select>{isCustom && <input type="text" className="custom-attr-input" placeholder="Enter custom value" value={value} onChange={(e) => onChange(e.target.value)} />}</>);
        default:
            return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={attr.options}/>;
    }
};

const AttributesModal = ({ isOpen, onClose, onSave, subCategoryId, existingAttributes, attributeData }) => {
    const [attributes, setAttributes] = useState({});
    const [customAttributes, setCustomAttributes] = useState([]);
    useEffect(() => {
        if (isOpen) {
            const predefined = {};
            const custom = [];
            const attributesForCategory = subCategoryId && attributeData ? (attributeData[String(subCategoryId)] || []) : [];
            const predefinedKeys = attributesForCategory.map(attr => attr.name);
            for (const key in existingAttributes) {
                if (predefinedKeys.includes(key)) { predefined[key] = existingAttributes[key]; } 
                else { custom.push({ key, value: existingAttributes[key] }); }
            }
            setAttributes(predefined);
            setCustomAttributes(custom);
        }
    }, [isOpen, existingAttributes, subCategoryId, attributeData]);
    const handleSave = () => {
        const finalAttributes = { ...attributes };
        customAttributes.forEach(attr => { if (attr.key && attr.value) { finalAttributes[attr.key] = attr.value; } });
        onSave(finalAttributes);
        onClose();
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

const ProductForm = ({ setIsLoading }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(productId);

    const [product, setProduct] = useState(initialProductState);
    const [categories, setCategories] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newVideo, setNewVideo] = useState(null);
    const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
    const [isVariantsModalOpen, setIsVariantsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Manages initial page load
    const [isSaving, setIsSaving] = useState(false); // Manages the saving process
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedCategories = await supplierService.getCategories();
            setCategories(fetchedCategories);
            if (isEditMode) {
                const productToEdit = await supplierService.getProductById(productId);
                if (productToEdit) {
                    const parentCategory = fetchedCategories.find(c => c.id == productToEdit.category_id)?.parent_id || '';
                    setProduct({ ...initialProductState, ...productToEdit, main_category_id: parentCategory,
                        attributes: safeParseJSON(productToEdit.attributes, {}),
                        variants: safeParseJSON(productToEdit.variants, []),
                        image_urls: safeParseJSON(productToEdit.image_urls, []),
                    });
                } else { setError('Product not found.'); }
            }
        } catch (err) { setError('Failed to load necessary data.'); } 
        finally { 
            setLoading(false);
        }
    }, [isEditMode, productId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
        if (name === "main_category_id") setProduct(prev => ({ ...prev, category_id: '', attributes: {} }));
    };

    useEffect(() => {
        if (product.quantity !== '' && Number(product.quantity) <= 0) { setProduct(prev => ({ ...prev, status: 'Out of Stock' })); } 
        else if (product.quantity !== '' && Number(product.quantity) > 0) { setProduct(prev => ({ ...prev, status: 'In Stock' })); }
    }, [product.quantity]);
    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if ((product.image_urls.length + newImages.length + files.length) > 8) { alert('Maximum 8 images.'); return; }
        setNewImages(prev => [...prev, ...files]);
    };
    const removeNewImage = (index) => setNewImages(prev => prev.filter((_, i) => i !== index));
    const removeExistingImage = (url) => setProduct(prev => ({ ...prev, image_urls: prev.image_urls.filter(imgUrl => imgUrl !== url) }));
    
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 60 * 1024 * 1024) { alert('Video file size cannot exceed 60MB.'); return; }
        setNewVideo(file);
        setProduct(prev => ({ ...prev, video_url: '' }));
    };
    const removeVideo = () => { setNewVideo(null); setProduct(prev => ({ ...prev, video_url: '' })); };
    
    const handleSaveAttributes = (newAttributes) => setProduct(prev => ({ ...prev, attributes: newAttributes }));
    const handleSaveVariants = (newVariants) => setProduct(prev => ({ ...prev, variants: newVariants }));
    
    // --- THIS IS THE UPGRADED, HIGH-PERFORMANCE SUBMIT FUNCTION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation checks
        if (!product.title || product.title.length < 3) return setError('Title must be at least 3 characters.');
        if (!product.price || product.price <= 0) return setError('Base Price is required.');
        if (product.quantity === '' || product.quantity < 0) return setError('Quantity is required.');
        if (!product.category_id) return setError('A Sub-Category must be selected.');
        if (Object.keys(product.attributes).length < 2) return setError('At least 2 attributes are required.');
        
        setIsSaving(true); // Use a separate state for the saving process
        setIsLoading(true); // Also trigger the global loader
        setError('');

        try {
            // Step 1: File Uploads
            let uploadedImageUrls = [];
            let uploadedVideoUrl = product.video_url;
            const filesToUpload = [...newImages, ...(newVideo ? [newVideo] : [])];
            if (filesToUpload.length > 0) {
                const formData = new FormData();
                filesToUpload.forEach(file => formData.append('images', file));
                const res = await supplierService.uploadFiles(formData);
                if (newImages.length > 0) uploadedImageUrls = newVideo ? res.urls.slice(0, -1) : res.urls;
                if (newVideo) uploadedVideoUrl = res.urls[res.urls.length - 1];
            }
            const finalImageUrls = [...product.image_urls, ...uploadedImageUrls];
            const pkgInfo = `${product.pkg_length||'L'}x${product.pkg_width||'W'}x${product.pkg_height||'H'} ${product.pkg_unit}, ${product.pkg_weight||'W'}${product.pkg_weight_unit}`;
            
            const mainProductPayload = {
                title: product.title, description: product.description,
                price: parseFloat(product.price),
                discounted_price: product.discounted_price ? parseFloat(product.discounted_price) : null,
                quantity: parseInt(product.quantity, 10),
                status: product.status,
                category_id: product.category_id, 
                attributes: product.attributes,
                image_urls: finalImageUrls,
                video_url: uploadedVideoUrl || null,
                shipping_details: product.shipping_details, package_information: pkgInfo,
                season: product.season === 'Custom' ? product.custom_season : product.season,
            };

            if (isEditMode) {
                await supplierService.updateProduct(productId, mainProductPayload);
                // Note: We are not handling batch variant updates in edit mode for this fix.
            } else {
                // a) Create the main product
                const newProduct = await supplierService.createProduct(mainProductPayload);
                
                // b) If variants exist, send them all in ONE single API call
                if (product.variants && product.variants.length > 0) {
                    const variantsPayload = product.variants.map(variant => ({
                        custom_color: variant.color,
                        custom_size: variant.size,
                        price: parseFloat(variant.price),
                        stock: parseInt(variant.stock, 10),
                    }));
                    await supplierService.addVariantsInBatch(newProduct.id, variantsPayload);
                }
            }
            
            // Navigate instantly after completion
            navigate('/products');

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while saving the product.');
            console.error(err);
        } finally { 
            setIsSaving(false);
            setIsLoading(false); // Hide global loader
        }
    };
    
    const parentCategories = categories.filter(c => !c.parent_id);
    const subCategories = product.main_category_id ? categories.filter(c => c.parent_id == product.main_category_id) : [];

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="product-form-container">
            <AttributesModal isOpen={isAttributesModalOpen} onClose={() => setIsAttributesModalOpen(false)} onSave={handleSaveAttributes} subCategoryId={product.category_id} existingAttributes={product.attributes} attributeData={categoryAttributes} />
            <VariantsModal isOpen={isVariantsModalOpen} onClose={() => setIsVariantsModalOpen(false)} onSave={handleSaveVariants} existingVariants={product.variants} colorData={colorFamilies} />
            <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-card"><h3>Basic Information</h3><div className="form-group full-width"><label>Product Title <span className="required-star">*</span></label><input type="text" name="title" value={product.title} onChange={handleChange} placeholder="e.g., Men Cotton Casual Shirt" required /></div><div className="form-group full-width"><label>Product Description</label><textarea name="description" rows="5" value={product.description} onChange={handleChange} placeholder="Full product explanation..."></textarea></div></div>
                <div className="form-card"><h3>Pricing & Inventory</h3><div className="form-grid"><div className="form-group"><label>Base Price (PKR) <span className="required-star">*</span></label><input type="number" name="price" value={product.price} onChange={handleChange} placeholder="e.g., 2499" required /></div><div className="form-group"><label>Discounted Price</label><input type="number" name="discounted_price" value={product.discounted_price} onChange={handleChange} placeholder="e.g., 1999" /></div><div className="form-group"><label>Total Quantity / Stock <span className="required-star">*</span></label><input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="e.g., 50" required /></div><div className="form-group"><label>Status</label><select name="status" value={product.status} onChange={handleChange}><option>In Stock</option><option>Out of Stock</option></select></div></div></div>
                <div className="form-card"><h3>Category & Specifications</h3><div className="form-grid"><div className="form-group"><label>Main Category <span className="required-star">*</span></label><select name="main_category_id" value={product.main_category_id || ''} onChange={handleChange} required><option value="">Select...</option>{parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div></div>{subCategories.length > 0 && (<div className="form-group full-width" style={{marginTop: '20px'}}><label>Sub-Category <span className="required-star">*</span></label><div className="radio-grid">{subCategories.map(cat => (<label key={cat.id} className={`radio-label ${product.category_id == cat.id ? 'selected' : ''}`}><input type="radio" name="category_id" value={cat.id} checked={product.category_id == cat.id} onChange={handleChange} />{cat.name}</label>))}</div></div>)}<div className="form-grid" style={{marginTop: '20px'}}><div className="form-group"><label>Product Attributes <span className="required-star">*</span></label><p className="form-hint">At least 2 required.</p><button type="button" className="btn-secondary" onClick={() => setIsAttributesModalOpen(true)} disabled={!product.category_id}>{Object.keys(product.attributes).length > 0 ? `${Object.keys(product.attributes).length} Attributes Added` : 'Add Attributes'}</button></div><div className="form-group"><label>Product Variants</label><p className="form-hint">For different colors/sizes.</p><button type="button" className="btn-secondary" onClick={() => setIsVariantsModalOpen(true)}>{product.variants.length > 0 ? `${product.variants.length} Variants Added` : 'Manage Variants'}</button></div></div></div>
                <div className="form-card"><h3>Shipping, Season & Media</h3><div className="form-grid"><div className="form-group"><label>Shipping Type</label><select name="shipping_details" value={product.shipping_details} onChange={handleChange}><option>Standard</option><option>Express</option><option>Overnight</option></select></div><div className="form-group"><label>Season</label><select name="season" value={product.season} onChange={handleChange}><option>No Season</option><option>All Seasons</option><option>Summer</option><option>Winter</option><option>Spring</option><option>Autumn</option><option>Custom</option></select></div>{product.season === 'Custom' && <div className="form-group full-width"><label>Custom Season Name</label><input type="text" name="custom_season" value={product.custom_season} onChange={handleChange} /></div>}</div><div className="form-grid" style={{marginTop: '20px'}}><div className="form-group"><label>Package Dimensions</label><div className="input-group"><input type="number" name="pkg_length" placeholder="L" value={product.pkg_length} onChange={handleChange} /><input type="number" name="pkg_width" placeholder="W" value={product.pkg_width} onChange={handleChange} /><input type="number" name="pkg_height" placeholder="H" value={product.pkg_height} onChange={handleChange} /><select name="pkg_unit" value={product.pkg_unit} onChange={handleChange}><option>cm</option><option>in</option></select></div></div><div className="form-group"><label>Package Weight</label><div className="input-group"><input type="number" name="pkg_weight" placeholder="Weight" value={product.pkg_weight} onChange={handleChange} /><select name="pkg_weight_unit" value={product.pkg_weight_unit} onChange={handleChange}><option>g</option><option>kg</option></select></div></div></div></div>
                <div className="form-card"><h3>Media Uploads</h3><div className="form-group full-width"><label>Product Images (Max 8)</label><div className="image-upload-area"><div className="image-previews">{(product.image_urls || []).map((url, i) => (<div key={url+i} className="preview-image-container"><img src={url} alt="Existing" className="preview-image" /><button type="button" className="delete-preview-btn" onClick={() => removeExistingImage(url)}>×</button></div>))}{newImages.map((file, index) => (<div key={index} className="preview-image-container"><img src={URL.createObjectURL(file)} alt="New" className="preview-image" /><button type="button" className="delete-preview-btn" onClick={() => removeNewImage(index)}>×</button></div>))}</div><label htmlFor="image-upload" className="upload-btn-label"><input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} /><span>+ Add Images</span></label></div></div><div className="form-group full-width"><label>Product Video (Max 60MB)</label>{product.video_url || newVideo ? (<div className="video-preview-container"><video src={newVideo ? URL.createObjectURL(newVideo) : product.video_url} controls /><button type="button" className="delete-preview-btn" onClick={removeVideo}>×</button></div>) : (<label htmlFor="video-upload" className="upload-btn-label"><span>+ Add Video</span></label>)}<input id="video-upload" type="file" accept="video/mp4,video/mov" onChange={handleVideoChange} style={{display: 'none'}} /></div></div>
                <div className="form-actions"><button type="button" className="btn-secondary" onClick={() => navigate('/products')}>Cancel</button><button type="submit" className="btn-primary" disabled={isSaving}>{isSaving ? <div className="spinner-small"></div> : (isEditMode ? 'Update Product' : 'Save Product')}</button></div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default ProductForm;