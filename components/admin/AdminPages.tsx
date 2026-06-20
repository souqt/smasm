import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText, Plus, Edit, Trash2, Eye, EyeOff, Search,
  Calendar, Globe, Save, X, ExternalLink, LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "./ImageUploader";
import { DynamicPage } from "@/data/types";

const AdminPages = () => {
  const { data, addPage, updatePage, deletePage } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
    isPublished: true,
    isRootLevel: false
  });

  const pages = data.pages || [];
  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      featuredImage: "",
      isPublished: true,
      isRootLevel: false
    });
    setEditingPage(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPage ? prev.slug : generateSlug(title)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPage) {
      updatePage(editingPage.id, formData);
      toast({ title: "Page updated successfully" });
    } else {
      addPage(formData);
      toast({ title: "Page added successfully" });
    }
    
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (page: DynamicPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      featuredImage: page.featuredImage || "",
      isPublished: page.isPublished,
      isRootLevel: page.isRootLevel || false
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deletePage(id);
    toast({ title: "Page deleted successfully" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Pages</h1>
          <p className="text-muted-foreground mt-1">Manage dynamic website pages</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText size={20} />
                {editingPage ? "Edit Page" : "Add New Page"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Featured Image */}
              <div>
                <Label>Page Image</Label>
                <div className="mt-2">
                  <ImageUploader
                    value={formData.featuredImage}
                    onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                    category="pages"
                    placeholder="Upload page image"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter page title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>URL Slug *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/</span>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="page-slug"
                      className="pl-6"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="Page title for search engines"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Publish Status</Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Root-Level URL</Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch
                      checked={formData.isRootLevel}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRootLevel: checked }))}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.isRootLevel ? `URL: /${formData.slug}` : `URL: /page/${formData.slug}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Page description for search engines"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Page Content (HTML - used as fallback if no blocks)</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter page content (HTML supported)"
                  rows={6}
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1 gap-2">
                  <Save size={18} />
                  {editingPage ? "Update" : "Add"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pages List */}
      {filteredPages.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No pages yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredPages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {page.featuredImage && (
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-muted shrink-0">
                      <img src={page.featuredImage} alt={page.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{page.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Globe size={14} />
                          <span>/{page.slug}</span>
                        </p>
                      </div>
                      
                      <Badge variant={page.isPublished ? "default" : "secondary"} className="shrink-0">
                        {page.isPublished ? (
                          <><Eye size={12} className="mr-1" /> Published</>
                        ) : (
                          <><EyeOff size={12} className="mr-1" /> Draft</>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(page.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(page)}
                        className="gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/pages/${page.slug}/blocks`)}
                        className="gap-1 text-primary"
                      >
                        <LayoutGrid size={14} />
                        Manage Blocks
                      </Button>
                      
                      {page.isPublished && (
                        <Button variant="ghost" size="sm" asChild className="gap-1">
                          <a href={page.isRootLevel ? `/${page.slug}` : `/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} />
                            Preview
                          </a>
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Page</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{page.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(page.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminPages;
