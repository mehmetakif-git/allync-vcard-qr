import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Palette, Sparkles, Check, X, Plus, Link as LinkIcon } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import ShinyText from './ShinyText';
import { supabase } from '../lib/supabase';

export default function QRGenerator() {
  const [qrCode, setQrCode] = useState(null);
  const [dotsColor, setDotsColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#2b2c2c');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('rounded');
  const [selectedSize, setSelectedSize] = useState(512); // 512px ile başlatıldı!
  const [errorLevel, setErrorLevel] = useState('H');
  const [isDragging, setIsDragging] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  
  // New states for QR management
  const [qrCodes, setQrCodes] = useState([]);
  const [selectedQRId, setSelectedQRId] = useState(null);
  const [newSlug, setNewSlug] = useState('');
  const [newRedirectUrl, setNewRedirectUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentQRUrl, setCurrentQRUrl] = useState('https://qr.allyncai.com/allyn');

  const qrRef = useRef(null);
  const fileInputRef = useRef(null);

  const styles = [
    { id: 'square', name: 'Square', desc: 'Classic' },
    { id: 'rounded', name: 'Rounded', desc: 'Modern' },
    { id: 'classy-rounded', name: 'Classy', desc: 'Futuristic' },
    { id: 'dots', name: 'Dots', desc: 'Minimal' }
  ];

  const sizes = [512, 1000, 2000, 4000];
  const errorLevels = [
    { value: 'L', label: 'L (7%)' },
    { value: 'M', label: 'M (15%)' },
    { value: 'Q', label: 'Q (25%)' },
    { value: 'H', label: 'H (30%)' }
  ];

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  // Load QR codes from Supabase
  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      setQrCodes(data);
      setSelectedQRId(data[0].id);
      setCurrentQRUrl(`https://qr.allyncai.com/${data[0].slug}`);
    }
  };

  const createNewQR = async () => {
    if (!newSlug || !newRedirectUrl) {
      alert('Please fill slug and redirect URL');
      return;
    }

    const { data, error } = await supabase
      .from('qr_codes')
      .insert([{
        slug: newSlug,
        redirect_url: newRedirectUrl,
        title: newTitle || newSlug
      }])
      .select()
      .single();

    if (error) {
      alert('Error creating QR code: ' + error.message);
      return;
    }

    setQrCodes([data, ...qrCodes]);
    setSelectedQRId(data.id);
    setCurrentQRUrl(`https://qr.allyncai.com/${data.slug}`);
    setShowCreateForm(false);
    setNewSlug('');
    setNewRedirectUrl('');
    setNewTitle('');
  };

  const selectQR = (qr) => {
    setSelectedQRId(qr.id);
    setCurrentQRUrl(`https://qr.allyncai.com/${qr.slug}`);
  };

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: selectedSize,
      height: selectedSize,
      data: currentQRUrl,
      image: logo,
      dotsOptions: {
        type: selectedStyle,
        color: dotsColor,
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: dotsColor },
            { offset: 1, color: dotsColor === '#ffffff' ? '#e0e0e0' : dotsColor }
          ]
        }
      },
      cornersSquareOptions: {
        type: selectedStyle === 'dots' ? 'dot' : selectedStyle,
        color: dotsColor
      },
      cornersDotOptions: {
        type: 'dot',
        color: dotsColor
      },
      backgroundOptions: {
        color: backgroundColor
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
        imageSize: 0.4,
        hideBackgroundDots: true
      },
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: errorLevel
      }
    });

    setQrCode(qr);
  }, []);

  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  const updateQR = () => {
    if (qrCode) {
      qrCode.update({
        width: selectedSize,
        height: selectedSize,
        data: currentQRUrl,
        image: logo,
        dotsOptions: {
          type: selectedStyle,
          color: dotsColor,
          gradient: {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: dotsColor },
              { offset: 1, color: dotsColor === '#ffffff' ? '#e0e0e0' : dotsColor }
            ]
          }
        },
        cornersSquareOptions: {
          type: selectedStyle === 'dots' ? 'dot' : selectedStyle,
          color: dotsColor
        },
        cornersDotOptions: {
          type: 'dot',
          color: dotsColor
        },
        backgroundOptions: {
          color: backgroundColor
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 8,
          imageSize: 0.4,
          hideBackgroundDots: true
        },
        qrOptions: {
          errorCorrectionLevel: errorLevel
        }
      });
    }
  };

  useEffect(() => {
    updateQR();
  }, [dotsColor, backgroundColor, logo, selectedStyle, selectedSize, errorLevel, currentQRUrl]);

  const handleLogoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result);
        setLogoPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoUpload(file);
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadQR = (extension) => {
    if (qrCode) {
      const selectedQR = qrCodes.find(q => q.id === selectedQRId);
      qrCode.download({
        extension,
        name: selectedQR ? `${selectedQR.slug}-qr` : 'qr-code'
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen py-16 px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
          #2b2c2c
        `
      }}
    >
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={32} className="text-white/60" />
            <ShinyText text="QR Code Generator" className="text-5xl font-bold" speed={4} />
            <Sparkles size={32} className="text-white/60" />
          </div>
          <p className="text-white/60 text-lg">Create and customize QR codes</p>
        </div>

        {/* QR Code Selection */}
        <motion.div
          className="mb-8 rounded-3xl p-6"
          style={cardStyle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <LinkIcon size={20} />
              Select QR Code
            </h3>
            <motion.button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 rounded-xl font-semibold text-sm text-white flex items-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
              New QR
            </motion.button>
          </div>

          {showCreateForm && (
            <motion.div
              className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <input
                type="text"
                placeholder="Slug (e.g., john-doe)"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full bg-white/5 text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/30"
              />
              <input
                type="url"
                placeholder="Redirect URL (e.g., https://example.com/profile)"
                value={newRedirectUrl}
                onChange={(e) => setNewRedirectUrl(e.target.value)}
                className="w-full bg-white/5 text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/30"
              />
              <input
                type="text"
                placeholder="Title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white/5 text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/30"
              />
              <button
                onClick={createNewQR}
                className="w-full py-2 rounded-lg font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20"
              >
                Create QR Code
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {qrCodes.map((qr) => (
              <motion.button
                key={qr.id}
                onClick={() => selectQR(qr)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedQRId === qr.id
                    ? 'border-white/20 bg-white/15'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{qr.title || qr.slug}</span>
                  {selectedQRId === qr.id && <Check size={16} className="text-white" />}
                </div>
                <p className="text-white/50 text-xs">/{qr.slug}</p>
                <p className="text-white/40 text-xs truncate">{qr.redirect_url}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            className="rounded-3xl p-8 order-2 lg:order-1"
            style={cardStyle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Palette className="text-white" size={20} />
                  Customization
                </h3>
              </div>

              <div>
                <label className="block text-white/80 mb-3 font-medium text-sm">Logo Upload</label>
                <div
                  className={`relative rounded-xl border-2 border-dashed transition-all ${
                    isDragging ? 'border-white/40 bg-white/10' : 'border-white/20 hover:border-white/40'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  {logoPreview ? (
                    <div className="p-4 flex items-center gap-4">
                      <img src={logoPreview} alt="Logo" className="w-16 h-16 object-contain rounded-lg bg-white/10" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">Logo uploaded</p>
                        <p className="text-white/50 text-xs">Ready to generate QR</p>
                      </div>
                      <button
                        onClick={removeLogo}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                      <Upload size={32} />
                      <p className="text-sm font-medium">Drop logo here or click to upload</p>
                      <p className="text-xs text-white/40">PNG, JPG up to 5MB</p>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-3 font-medium text-sm">QR Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`relative p-4 rounded-xl border transition-all ${
                        selectedStyle === style.id
                          ? 'border-white/20 bg-white/15'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                      style={selectedStyle === style.id ? { boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' } : {}}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold text-sm">{style.name}</span>
                        {selectedStyle === style.id && <Check size={16} className="text-white" />}
                      </div>
                      <span className="text-white/50 text-xs">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-3 font-medium text-sm">Dots Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={dotsColor}
                      onChange={(e) => setDotsColor(e.target.value)}
                      className="w-16 h-12 rounded-xl cursor-pointer border-2 border-white/20"
                    />
                    <input
                      type="text"
                      value={dotsColor}
                      onChange={(e) => setDotsColor(e.target.value)}
                      className="flex-1 bg-white/5 text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-3 font-medium text-sm">Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-12 rounded-xl cursor-pointer border-2 border-white/20"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 bg-white/5 text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-3 font-medium text-sm">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-lg border font-semibold text-sm transition-all ${
                        selectedSize === size
                          ? 'border-white/20 bg-white/15 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                      style={selectedSize === size ? { boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' } : {}}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-3 font-medium text-sm">Error Correction</label>
                <div className="grid grid-cols-4 gap-2">
                  {errorLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setErrorLevel(level.value)}
                      className={`py-2 px-3 rounded-lg border font-semibold text-xs transition-all ${
                        errorLevel === level.value
                          ? 'border-white/20 bg-white/15 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                      style={errorLevel === level.value ? { boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' } : {}}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <motion.button
                  onClick={() => downloadQR('png')}
                  className="py-4 px-6 rounded-xl font-bold text-white overflow-hidden"
                  style={{
                    background: downloadSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: downloadSuccess ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                  whileHover={{ y: -2, boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {downloadSuccess ? <Check size={20} /> : <Download size={20} />}
                    {downloadSuccess ? 'Downloaded!' : 'PNG'}
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => downloadQR('svg')}
                  className="py-4 px-6 rounded-xl font-bold text-white overflow-hidden"
                  style={{
                    background: downloadSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: downloadSuccess ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                  whileHover={{ y: -2, boxShadow: '0 0 30px rgba(255, 255, 255, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {downloadSuccess ? <Check size={20} /> : <Download size={20} />}
                    {downloadSuccess ? 'Downloaded!' : 'SVG'}
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl p-8 order-1 lg:order-2"
            style={cardStyle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Live Preview</h3>
            <div 
              className="relative bg-[#2b2c2c] rounded-2xl p-8 flex items-center justify-center border border-white/10"
              style={{ minHeight: '400px' }}
            >
              <div 
                ref={qrRef} 
                className="flex items-center justify-center relative z-10"
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
            <p className="text-white/50 text-center mt-4 text-sm">
              Scans redirect to: <span className="text-white font-semibold break-all">{currentQRUrl}</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}