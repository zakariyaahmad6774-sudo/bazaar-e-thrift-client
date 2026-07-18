import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImages } from './api';

export default function ImageDropzone({ images, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const urls = await uploadImages(files);
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err.message || 'Upload failed — try again.');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url) {
    onChange(images.filter((u) => u !== url));
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl p-6 text-center cursor-pointer"
        style={{
          border: `1.5px dashed ${dragging ? 'var(--rose)' : 'rgba(46,42,38,0.25)'}`,
          background: dragging ? 'rgba(193,104,90,0.06)' : 'transparent',
          transition: 'all .2s ease',
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        {uploading ? (
          <p className="font-body text-sm flex items-center justify-center gap-2 opacity-70">
            <Loader2 size={16} className="animate-spin" /> Uploading…
          </p>
        ) : (
          <>
            <Upload size={20} className="mx-auto mb-2 opacity-50" />
            <p className="font-body text-sm opacity-70">Drag photos here, or click to browse</p>
            <p className="font-mono text-xs opacity-40 mt-1">First photo becomes the main image</p>
          </>
        )}
      </div>

      {error && <p className="font-mono text-xs mt-2" style={{ color: 'var(--red)' }}>{error}</p>}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {images.map((url) => (
            <div key={url} className="relative rounded-lg overflow-hidden" style={{ width: '64px', height: '64px' }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(url); }}
                className="absolute top-0.5 right-0.5 rounded-full p-0.5"
                style={{ background: 'rgba(0,0,0,0.6)' }}
                aria-label="Remove image"
              >
                <X size={12} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
