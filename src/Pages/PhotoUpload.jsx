import { useState } from 'react';

const PhotoUpload = ({ photoUrl, setPhotoUrl, defaultUrl = "https://cdn.pfps.gg/pfps/2903-default-blue.png" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
  const [urlInput, setUrlInput] = useState(photoUrl && photoUrl !== defaultUrl ? photoUrl : '');

  const compressImage = (file, maxWidth = 320, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        // Compress image if larger than maxWidth
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please select an image smaller than 2MB');
        return;
      }
      
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        
        // Compress and convert to base64
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoUrl(reader.result);
          setUrlInput('');
        };
        reader.readAsDataURL(compressedFile);
      } else {
        alert('Please select a valid image file');
      }
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlInput(url);
    setPhotoUrl(url);
    setSelectedFile(null);
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setUrlInput('');
    setPhotoUrl(defaultUrl);
  };

  const switchMode = (mode) => {
    setUploadMode(mode);
    if (mode === 'url') {
      setSelectedFile(null);
    } else {
      setUrlInput('');
    }
  };

  return (
    <div className="w-full max-w-xs">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-white/60">Profile Photo</span>
        </label>

        {/* Mode Switcher */}
        <div className="tabs tabs-boxed mb-3">
          <button 
            className={`tab ${uploadMode === 'url' ? 'tab-active' : ''}`}
            onClick={() => switchMode('url')}
          >
            URL
          </button>
          <button 
            className={`tab ${uploadMode === 'file' ? 'tab-active' : ''}`}
            onClick={() => switchMode('file')}
          >
            Upload
          </button>
        </div>

        {/* URL Input Mode */}
        {uploadMode === 'url' && (
          <div className="space-y-3">
            <input
              type="url"
              value={urlInput}
              onChange={handleUrlChange}
              placeholder="Enter image URL"
              className="input input-bordered w-full focus:input-primary transition-all duration-300"
            />
            
            {photoUrl && (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    alert('Invalid image URL');
                  }}
                />
                {photoUrl !== defaultUrl && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 btn btn-circle btn-sm btn-error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {photoUrl !== defaultUrl && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    setPhotoUrl(defaultUrl);
                    setSelectedFile(null);
                  }}
                  className="btn btn-ghost btn-sm bg-red-400 text-white hover:bg-red-500"
                >
                  Reset to Default
                </button>
              </div>
            )}
          </div>
        )}

        {/* File Upload Mode */}
        {uploadMode === 'file' && (
          <>
            {!photoUrl || photoUrl === defaultUrl ? (
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input file-input-bordered file-input-primary w-full"
                />
                {photoUrl === defaultUrl && (
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={defaultUrl}
                      alt="Default Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-300 opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        Default
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 btn btn-circle btn-sm btn-error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-center">
                  <label className="btn btn-outline btn-sm">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-white/60">
                  Selected: {selectedFile.name}
                </p>
                <p className="text-xs text-white/40">
                  Original: {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
          </>
        )}

        {/* Help Text */}
        <div className="mt-2">
          <p className="text-xs text-white/40">
            {uploadMode === 'url' 
              ? 'Enter a valid image URL (https://...)'
              : 'Upload image files (max 2MB, will be automatically compressed)'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;