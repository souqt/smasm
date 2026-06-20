import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUploader from "./ImageUploader";

const AdminBlogs = () => {
  const { data, addBlog, updateBlog, deleteBlog } = useData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', image: '', author: '', category: '', tags: [''], publishedAt: '', isPublished: true
  });

  const handleSubmit = () => {
    const blogData = { ...formData, tags: formData.tags.filter(t => t.trim()) };
    if (editingBlog) {
      updateBlog(editingBlog.id, blogData);
      toast({ title: "Blog updated successfully" });
    } else {
      addBlog(blogData);
      toast({ title: "Blog added successfully" });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', image: '', author: '', category: '', tags: [''], publishedAt: new Date().toISOString().split('T')[0], isPublished: true });
    setEditingBlog(null);
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setFormData({ ...blog, tags: blog.tags?.length ? blog.tags : [''] });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground">Manage blog content</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus size={18} /> Add Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Post' : 'Add New Post'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUploader
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                  category="blogs"
                  placeholder="Upload blog image"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Content (HTML)</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={6} />
              </div>
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Input type="date" value={formData.publishedAt} onChange={(e) => setFormData({...formData, publishedAt: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={formData.tags.join(', ')} onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isPublished} onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})} />
                <Label>Published</Label>
              </div>
              <Button onClick={handleSubmit} className="w-full">{editingBlog ? 'Update' : 'Add'} Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {data.blogs.map((blog) => (
          <div key={blog.id} className="bg-card rounded-xl border border-border p-6 flex items-center gap-6">
            <img src={blog.image} alt="" className="w-24 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{blog.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs ${blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {blog.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{blog.author} • {blog.category}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(blog)}><Edit size={16} /></Button>
              <Button variant="outline" size="icon" onClick={() => deleteBlog(blog.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
