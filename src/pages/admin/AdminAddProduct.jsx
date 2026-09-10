import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  ArrowLeft, Save, Image as ImageIcon, FileText, List,
  Tag, DollarSign, X, CheckCircle2, Package, Loader2, Info
} from 'lucide-react';
import { uploadImage } from '../../utils/cloudinaryService';
import { useApp } from '../../context/AppContext';

function FieldGroup({ label, icon, accent = 'var(--primary)', children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent }}>
        {icon} {label}
      </label>
      {children}
      {hint && <p style={{ margin: 0, fontSize: '11px', color: 'var(--gray-2)' }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)',
  borderRadius: 'var(--radius-sm)', padding: '11px 16px', fontSize: '14px',
  fontWeight: 500, color: 'var(--white)', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
};

const CATEGORIES = [
  'Dressed Chicken',
  'Live Chicken',
  'Frozen Chicken',
  'Farm Produce',
  'Combo Packs'
];

export default function AdminAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const isEditing = !!id;
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    name: '', category: '', overview: '', description: '', features: [],
    price: '', originalPrice: '', stock: 0, unlimited_stock: false, is_hidden: false
  });
  
  const [featureInput, setFeatureInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch existing product data if editing
  useEffect(() => {
    if (!isEditing) return;
    const fetchProduct = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            ...data,
            price: String(data.price || ''),
            originalPrice: String(data.originalPrice || ''),
            stock: String(data.stock || 0),
            features: data.features || []
          });
          if (data.images && data.images.length > 0) {
            setImagePreviews(data.images);
          } else if (data.image || data.imgUrl || data.img) {
            setImagePreviews([data.image || data.imgUrl || data.img]);
          }
        } else {
          setError('Product not found.');
        }
      } catch (e) {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEditing]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const processFiles = files => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const clearImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddFeature = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const f = featureInput.trim();
      if (f && !(formData.features || []).includes(f)) {
        setFormData(p => ({ ...p, features: [...(p.features || []), f] }));
      }
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feat) => {
    setFormData(p => ({ ...p, features: (p.features || []).filter(f => f !== feat) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.category || !formData.price) {
      setError('Name, Category, and Price are required fields.');
      window.scrollTo(0, 0);
      return;
    }
    if (imagePreviews.length === 0) {
      setError('Please add at least one product image.');
      window.scrollTo(0, 0);
      return;
    }

    setSaving(true);
    try {
      // 1. Upload new images if any
      const finalImageUrls = [...imagePreviews];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file) {
          const url = await uploadImage(file);
          const previewIndex = imagePreviews.length - imageFiles.length + i;
          finalImageUrls[previewIndex] = url;
        }
      }

      const productPayload = {
        name: formData.name,
        category: formData.category,
        overview: formData.overview,
        description: formData.description,
        features: formData.features,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: formData.unlimited_stock ? 999999 : Number(formData.stock),
        unlimited_stock: formData.unlimited_stock,
        is_hidden: formData.is_hidden,
        images: finalImageUrls,
        image: finalImageUrls[0],
        updatedAt: new Date().toISOString(),
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };

      if (isEditing) {
        await updateDoc(doc(db, 'products', id), productPayload);
        showToast('Product updated successfully!');
      } else {
        productPayload.createdAt = new Date().toISOString();
        const docRef = doc(collection(db, 'products'));
        await setDoc(docRef, productPayload);
        showToast('New product added successfully!');
      }

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while saving the product.');
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><Loader2 className="spinner" size={40} color="var(--primary)" /></div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin/products" style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', color: 'var(--white)', width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, margin: 0 }}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'var(--black)', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? <Loader2 className="spinner" size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(255,61,0,0.1)', border: '1px solid var(--danger)', color: '#ff8066', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '24px' }}>
        
        {/* Basic Info */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="var(--primary)" /> Product Details
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <FieldGroup label="Product Name" icon={<Tag size={14} />}>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Dressed Broiler Chicken (Whole)" style={inputStyle} />
            </FieldGroup>
            
            <FieldGroup label="Category" icon={<List size={14} />}>
              <select name="category" value={formData.category} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="">Select Category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldGroup>
          </div>
        </div>

        {/* Content */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--primary)" /> Content & Description
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <FieldGroup label="Short Overview" hint="A brief sentence shown on the product card.">
              <input name="overview" value={formData.overview} onChange={handleChange} placeholder="e.g. Farm-fresh, healthy broiler, processed same-day." style={inputStyle} />
            </FieldGroup>
            
            <FieldGroup label="Long Description" hint="Detailed information shown on the product page.">
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the product in detail..." style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
            </FieldGroup>

            <FieldGroup label="Key Features (Bullet Points)" hint="Type a feature and press Enter to add.">
              <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={handleAddFeature} placeholder="e.g. Hormone-free, Farm raised" style={inputStyle} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {(formData.features || []).map(f => (
                  <span key={f} style={{ background: 'rgba(46,125,50,0.1)', border: '1px solid var(--primary)', color: 'var(--primary-light)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {f}
                    <button onClick={() => handleRemoveFeature(f)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={14} /></button>
                  </span>
                ))}
              </div>
            </FieldGroup>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="var(--primary)" /> Pricing & Stock
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <FieldGroup label="Selling Price (₦)">
              <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0" style={inputStyle} />
            </FieldGroup>
            <FieldGroup label="Original Price (₦)" hint="Leave empty if no discount.">
              <input name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} placeholder="0" style={inputStyle} />
            </FieldGroup>
          </div>
          
          <div style={{ borderTop: '1px dashed var(--dark-border)', margin: '20px 0' }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <FieldGroup label="Stock Quantity">
                <input name="stock" type="number" value={formData.stock} onChange={handleChange} disabled={formData.unlimited_stock} style={{ ...inputStyle, opacity: formData.unlimited_stock ? 0.5 : 1 }} />
              </FieldGroup>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '20px', flex: 1 }}>
              <input type="checkbox" name="unlimited_stock" checked={formData.unlimited_stock} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)' }}>Unlimited Stock</span>
            </label>
          </div>
        </div>

        {/* Visibility */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} color="var(--primary)" /> Visibility
          </h2>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" name="is_hidden" checked={formData.is_hidden} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--danger)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)' }}>Hide Product (Make Invisible to Customers)</span>
          </label>
        </div>

        {/* Images */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} color="var(--primary)" /> Product Images
          </h2>
          
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--dark-border)'}`,
              background: dragOver ? 'rgba(46,125,50,0.05)' : 'var(--dark)',
              borderRadius: 'var(--radius-md)', padding: '40px 20px',
              textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
              marginBottom: '20px'
            }}
          >
            <ImageIcon size={32} color={dragOver ? 'var(--primary)' : 'var(--gray-2)'} style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)', marginBottom: '4px' }}>Drop images here or click to browse</div>
            <div style={{ fontSize: '12px', color: 'var(--gray-2)' }}>Upload PNG, JPG, WEBP (Max 5MB each)</div>
            <input type="file" ref={fileInputRef} onChange={e => processFiles(e.target.files)} multiple accept="image/*" style={{ display: 'none' }} />
          </div>

          {imagePreviews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px' }}>
              {imagePreviews.map((src, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--dark-border)' }}>
                  <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={(e) => { e.stopPropagation(); clearImage(i); }} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                  {i === 0 && (
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'var(--primary)', color: '#000', fontSize: '10px', fontWeight: 800, textAlign: 'center', padding: '4px 0', textTransform: 'uppercase' }}>
                      Main Image
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
