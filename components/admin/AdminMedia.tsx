import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Trash2, Search, Grid, List, Image, FileText, 
  Film, Music, Download, Eye, Copy, Check, FolderOpen,
  Filter, SortAsc, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/api";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: string;
}

const categories = [
  { id: 'all', name: 'All Files', icon: FolderOpen },
  { id: 'images', name: 'Images', icon: Image },
  { id: 'slides', name: 'Slides', icon: Image },
  { id: 'blogs', name: 'Blog Images', icon: FileText },
  { id: 'brands', name: 'Brand Logos', icon: Image },
  { id: 'cvs', name: 'CVs/Documents', icon: FileText },
];

const AdminMedia = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    const saved = localStorage.getItem('uploaded_files');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  const saveFiles = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
    localStorage.setItem('uploaded_files', JSON.stringify(newFiles));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string = 'images') => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = uploadedFiles.length;
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < totalFiles; i++) {
      const file = uploadedFiles[i];
      try {
        const result = await uploadFile(file, category);
        
        newFiles.push({
          id: Date.now().toString() + i,
          name: file.name,
          url: result.url,
          size: file.size,
          type: file.type,
          category: category,
          uploadedAt: new Date().toISOString()
        });
        
        setUploadProgress(((i + 1) / totalFiles) * 100);
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }

    saveFiles([...newFiles, ...files]);
    setIsUploading(false);
    e.target.value = '';
    
    toast({
      title: "Upload Complete",
      description: `${newFiles.length} file(s) uploaded successfully`
    });
  };

  const handleDelete = (id: string) => {
    const newFiles = files.filter(f => f.id !== id);
    saveFiles(newFiles);
    toast({ title: "File deleted" });
  };

  const handleBulkDelete = () => {
    const newFiles = files.filter(f => !selectedFiles.includes(f.id));
    saveFiles(newFiles);
    setSelectedFiles([]);
    toast({ title: `${selectedFiles.length} files deleted` });
  };

  const handleCopyUrl = (file: UploadedFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "URL copied to clipboard" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">Manage all your uploaded files</p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e, selectedCategory === 'all' ? 'images' : selectedCategory)}
          />
          <label htmlFor="file-upload">
            <Button asChild className="gap-2 cursor-pointer">
              <span>
                <Upload size={18} />
                Upload Files
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary/10 rounded-xl p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-2"
            >
              <cat.icon size={16} />
              <span className="hidden sm:inline">{cat.name}</span>
            </Button>
          ))}
        </div>

        <div className="flex gap-2 lg:ml-auto">
          {/* Search */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid size={18} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-primary/10 rounded-xl p-4"
          >
            <span className="text-sm font-medium">{selectedFiles.length} file(s) selected</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedFiles([])}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
                <Trash2 size={16} />
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files Grid/List */}
      {filteredFiles.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No files found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {files.length === 0 
              ? "Start by uploading your first file" 
              : "Try adjusting your search or filters"}
          </p>
          <label htmlFor="file-upload">
            <Button asChild className="gap-2 cursor-pointer">
              <span>
                <Upload size={18} />
                Upload Files
              </span>
            </Button>
          </label>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            const isSelected = selectedFiles.includes(file.id);
            const isImage = file.type.startsWith('image/');
            
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`
                  group relative bg-card rounded-xl border overflow-hidden cursor-pointer transition-all
                  ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}
                `}
                onClick={() => {
                  if (selectedFiles.length > 0) {
                    setSelectedFiles(prev => 
                      prev.includes(file.id) 
                        ? prev.filter(id => id !== file.id)
                        : [...prev, file.id]
                    );
                  } else {
                    setPreviewFile(file);
                  }
                }}
              >
                {/* Checkbox */}
                <div 
                  className={`
                    absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center
                    transition-all cursor-pointer
                    ${isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-white/50 bg-black/30 opacity-0 group-hover:opacity-100'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFiles(prev => 
                      prev.includes(file.id) 
                        ? prev.filter(id => id !== file.id)
                        : [...prev, file.id]
                    );
                  }}
                >
                  {isSelected && <Check size={12} className="text-primary-foreground" />}
                </div>

                {/* Thumbnail */}
                <div className="aspect-square bg-muted relative">
                  {isImage ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(file);
                      }}
                    >
                      {copiedId === file.id ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground w-8">
                  <input 
                    type="checkbox" 
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(filteredFiles.map(f => f.id));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">File</th>
                <th className="text-left p-4 font-medium text-foreground hidden sm:table-cell">Size</th>
                <th className="text-left p-4 font-medium text-foreground hidden md:table-cell">Type</th>
                <th className="text-left p-4 font-medium text-foreground hidden lg:table-cell">Date</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const isImage = file.type.startsWith('image/');
                
                return (
                  <tr key={file.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedFiles.includes(file.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(prev => [...prev, file.id]);
                          } else {
                            setSelectedFiles(prev => prev.filter(id => id !== file.id));
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                          {isImage ? (
                            <img src={file.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileIcon size={20} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-foreground truncate max-w-[200px]">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">{formatFileSize(file.size)}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{file.category}</td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPreviewFile(file)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyUrl(file)}
                        >
                          {copiedId === file.id ? <Check size={16} /> : <Copy size={16} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-medium text-foreground truncate">{previewFile.name}</h3>
                <Button variant="ghost" size="icon" onClick={() => setPreviewFile(null)}>
                  <X size={20} />
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto p-4 bg-muted/30">
                {previewFile.type.startsWith('image/') ? (
                  <img 
                    src={previewFile.url} 
                    alt={previewFile.name}
                    className="max-w-full max-h-[60vh] mx-auto object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Preview not available</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-border bg-muted/50">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-2 font-medium">{formatFileSize(previewFile.size)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">{previewFile.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium">{previewFile.category}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => handleCopyUrl(previewFile)} className="gap-2">
                    <Copy size={16} />
                    Copy URL
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={previewFile.url} download={previewFile.name} className="gap-2">
                      <Download size={16} />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMedia;
