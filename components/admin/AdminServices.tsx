import { useState } from "react";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUploader from "./ImageUploader";

const AdminServices = () => {
  const { data, addService, updateService, deleteService } = useData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    icon: 'Code2', title: '', description: '', features: [''], color: 'from-blue-500 to-cyan-500', image: ''
  });

  const icons = ['Code2', 'Smartphone', 'BrainCircuit', 'Users2', 'Cloud', 'ShieldCheck', 'Database', 'Globe', 'Zap', 'Palette'];
  const colors = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple' },
    { value: 'from-orange-500 to-red-500', label: 'Orange' },
    { value: 'from-green-500 to-emerald-500', label: 'Green' },
    { value: 'from-sky-500 to-blue-500', label: 'Sky' },
    { value: 'from-rose-500 to-orange-500', label: 'Rose' },
    { value: 'from-indigo-500 to-purple-500', label: 'Indigo' },
    { value: 'from-teal-500 to-green-500', label: 'Teal' },
  ];

  const handleSubmit = () => {
    if (!formData.title) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }
    const serviceData = { ...formData, features: formData.features.filter(f => f.trim()) };
    if (editingService) {
      updateService(editingService.id, serviceData);
      toast({ title: "Service updated successfully" });
    } else {
      addService(serviceData);
      toast({ title: "Service added successfully" });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ icon: 'Code2', title: '', description: '', features: [''], color: 'from-blue-500 to-cyan-500', image: '' });
    setEditingService(null);
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({ 
      ...service, 
      features: service.features?.length ? service.features : [''],
      image: service.image || ''
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground">Manage service offerings</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={18} /> Add Service</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Service Image */}
              <div className="space-y-2">
                <Label>Service Image (optional)</Label>
                <ImageUploader
                  value={formData.image}
                  onChange={(url) => setFormData({...formData, image: url})}
                  category="services"
                  placeholder="Upload service image"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select 
                    className="w-full p-2 rounded-md border border-border bg-background text-sm" 
                    value={formData.icon} 
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  >
                    {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <select 
                    className="w-full p-2 rounded-md border border-border bg-background text-sm" 
                    value={formData.color} 
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  >
                    {colors.map(color => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter service title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter service description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea 
                  value={formData.features.join('\n')} 
                  onChange={(e) => setFormData({...formData, features: e.target.value.split('\n')})} 
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingService ? 'Update' : 'Add'} Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {data.services.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
          <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No services added yet</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Add First Service
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.services.map((service) => (
            <div key={service.id} className="bg-card rounded-xl border border-border p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shrink-0`}>
                <span className="text-xl font-bold">{service.icon.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{service.description}</p>
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 self-end md:self-center">
                <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                  <Edit size={16} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deleteService(service.id)}>
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

export default AdminServices;
