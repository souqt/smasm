import { useState } from "react";
import { Plus, Edit, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUploader from "./ImageUploader";

const AdminSlider = () => {
  const { data, addSlide, updateSlide, deleteSlide } = useData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', highlight: '', subtitle: '', cta: '', ctaLink: '', badge: '', image: ''
  });

  const handleSubmit = () => {
    if (!formData.title) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }
    if (editingSlide) {
      updateSlide(editingSlide.id, formData);
      toast({ title: "Slide updated successfully" });
    } else {
      addSlide(formData);
      toast({ title: "Slide added successfully" });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', highlight: '', subtitle: '', cta: '', ctaLink: '', badge: '', image: '' });
    setEditingSlide(null);
  };

  const handleEdit = (slide: any) => {
    setEditingSlide(slide);
    setFormData(slide);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteSlide(id);
    toast({ title: "Slide deleted" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Slider</h1>
          <p className="text-muted-foreground">Manage hero slider content</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={18} /> Add Slide</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Slide Image</Label>
                <ImageUploader
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                  category="slider"
                  placeholder="Upload slide background image"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter slide title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Highlight (colored text)</Label>
                  <Input 
                    value={formData.highlight} 
                    onChange={(e) => setFormData({...formData, highlight: e.target.value})}
                    placeholder="Highlighted word"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea 
                  value={formData.subtitle} 
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder="Enter slide description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input 
                    value={formData.cta} 
                    onChange={(e) => setFormData({...formData, cta: e.target.value})}
                    placeholder="e.g., Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input 
                    value={formData.ctaLink} 
                    onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                    placeholder="e.g., /contact"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input 
                  value={formData.badge} 
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  placeholder="e.g., New Service"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingSlide ? 'Update' : 'Add'} Slide
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {data.slides.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No slides added yet</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Add First Slide
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.slides.map((slide) => (
            <div key={slide.id} className="bg-card rounded-xl border border-border p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {slide.image ? (
                <img src={slide.image} alt="" className="w-full md:w-32 h-24 object-cover rounded-lg" />
              ) : (
                <div className="w-full md:w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">
                  {slide.title} {slide.highlight && <span className="text-primary">{slide.highlight}</span>}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{slide.subtitle}</p>
                {slide.badge && (
                  <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {slide.badge}
                  </span>
                )}
              </div>
              <div className="flex gap-2 self-end md:self-center">
                <Button variant="outline" size="icon" onClick={() => handleEdit(slide)}>
                  <Edit size={16} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(slide.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSlider;
