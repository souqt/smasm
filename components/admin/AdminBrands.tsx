import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUploader from "./ImageUploader";

const AdminBrands = () => {
  const { data, addBrand, updateBrand, deleteBrand } = useData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', logo: '' });

  const handleSubmit = () => {
    if (editingBrand) {
      updateBrand(editingBrand.id, formData);
      toast({ title: "Brand updated" });
    } else {
      addBrand(formData);
      toast({ title: "Brand added" });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', logo: '' });
    setEditingBrand(null);
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setFormData(brand);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground">Manage trusted brands</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus size={18} /> Add Brand</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <ImageUploader
                  value={formData.logo}
                  onChange={(url) => setFormData({...formData, logo: url})}
                  category="brands"
                  placeholder="Upload brand logo"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">{editingBrand ? 'Update' : 'Add'} Brand</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.brands.map((brand) => (
          <div key={brand.id} className="bg-card rounded-xl border border-border p-6 text-center group relative">
            <img src={brand.logo} alt={brand.name} className="h-10 mx-auto object-contain mb-3" />
            <p className="text-sm text-muted-foreground">{brand.name}</p>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(brand)}><Edit size={14} /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => deleteBrand(brand.id)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBrands;
