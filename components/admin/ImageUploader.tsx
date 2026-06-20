import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/api";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  category?: string;
  accept?: string;
  maxSize?: number; // in MB
  placeholder?: string;
  className?: string;
}

const ImageUploader = ({
  value,
  onChange,
  category = "images",
  accept = "image/*",
  maxSize = 10,
  placeholder = "Click or drag to upload",
  className = ""
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxSize}MB`);
      return;
    }
    
    // Validate file type
    const validTypes = accept.split(',').map(t => t.trim());
    const isValidType = validTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      if (type === '.pdf') return file.type === 'application/pdf';
      if (type === '.doc,.docx') return file.type.includes('document');
      return file.type === type || file.name.endsWith(type);
    });
    
    if (!isValidType) {
      setError('Invalid file type');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);
    
    try {
      const result = await uploadFile(file, category);
      setUploadProgress(100);
      onChange(result.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group rounded-xl overflow-hidden border-2 border-border bg-muted/30"
          >
            <div className="aspect-video relative">
              {accept.includes('image') ? (
                <img 
                  src={value} 
                  alt="Uploaded" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">File uploaded</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {value.split('/').pop()}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload size={16} />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="gap-2"
                >
                  <X size={16} />
                  Remove
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              relative border-2 border-dashed rounded-xl transition-all cursor-pointer
              ${isDragging 
                ? 'border-primary bg-primary/10 scale-[1.02]' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
              ${error ? 'border-destructive' : ''}
            `}
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="aspect-video flex flex-col items-center justify-center p-6">
              {isUploading ? (
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-primary transition-all duration-300"
                        strokeDasharray={`${uploadProgress * 1.76} 176`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className={`
                    w-16 h-16 rounded-full mb-4 flex items-center justify-center transition-colors
                    ${isDragging ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                  `}>
                    <Image size={32} />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{placeholder}</p>
                  <p className="text-xs text-muted-foreground">
                    Maximum size: {maxSize}MB
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 mt-2 text-destructive text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
