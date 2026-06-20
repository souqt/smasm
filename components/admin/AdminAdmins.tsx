import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Edit, Trash2, Shield, ShieldCheck, ShieldAlert,
  Mail, Clock, Eye, EyeOff, Save, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "./ImageUploader";
import { AdminUser, AdminPermission } from "@/data/types";

const allPermissions: { key: AdminPermission; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <Shield size={16} /> },
  { key: 'home', label: 'Home Builder', icon: <Shield size={16} /> },
  { key: 'slider', label: 'Slider', icon: <Shield size={16} /> },
  { key: 'services', label: 'Services', icon: <Shield size={16} /> },
  { key: 'store', label: 'Store', icon: <Shield size={16} /> },
  { key: 'orders', label: 'Orders', icon: <Shield size={16} /> },
  { key: 'support', label: 'Support', icon: <Shield size={16} /> },
  { key: 'coupons', label: 'Coupons', icon: <Shield size={16} /> },
  { key: 'directory', label: 'Directory', icon: <Shield size={16} /> },
  { key: 'chatbot', label: 'Chatbot', icon: <Shield size={16} /> },
  { key: 'jobs', label: 'Jobs', icon: <Shield size={16} /> },
  { key: 'applications', label: 'Applications', icon: <Shield size={16} /> },
  { key: 'blogs', label: 'Blogs', icon: <Shield size={16} /> },
  { key: 'brands', label: 'Brands', icon: <Shield size={16} /> },
  { key: 'media', label: 'Media', icon: <Shield size={16} /> },
  { key: 'pages', label: 'Pages', icon: <Shield size={16} /> },
  { key: 'menus', label: 'Menus', icon: <Shield size={16} /> },
  { key: 'settings', label: 'Settings', icon: <Shield size={16} /> },
  { key: 'admins', label: 'Admins', icon: <Shield size={16} /> },
];

const AdminAdmins = () => {
  const { getAllAdmins, addAdmin, updateAdmin, deleteAdmin, currentAdmin } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
    email: "",
    avatar: "",
    role: "editor" as AdminUser['role'],
    permissions: [] as AdminPermission[]
  });

  const admins = getAllAdmins();

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      displayName: "",
      email: "",
      avatar: "",
      role: "editor",
      permissions: []
    });
    setEditingAdmin(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdmin) {
      const dataToUpdate: Partial<AdminUser> = {
        displayName: formData.displayName,
        email: formData.email,
        avatar: formData.avatar,
        role: formData.role,
        permissions: formData.role === 'super_admin' ? allPermissions.map(p => p.key) : formData.permissions
      };
      
      if (formData.password) {
        dataToUpdate.password = formData.password;
      }
      
      const success = await updateAdmin(editingAdmin.id, dataToUpdate);
      if (success) {
        toast({ title: "Admin updated successfully" });
        setIsOpen(false);
        resetForm();
      } else {
        toast({ title: "Error updating admin", variant: "destructive" });
      }
    } else {
      if (!formData.password) {
        toast({ title: "Password is required", variant: "destructive" });
        return;
      }
      
      const success = await addAdmin({
        ...formData,
        isMainAdmin: false,
        permissions: formData.role === 'super_admin' ? allPermissions.map(p => p.key) : formData.permissions
      });
      
      if (success) {
        toast({ title: "Admin added successfully" });
        setIsOpen(false);
        resetForm();
      } else {
        toast({ title: "Username already exists", variant: "destructive" });
      }
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      password: "",
      displayName: admin.displayName,
      email: admin.email,
      avatar: admin.avatar || "",
      role: admin.role,
      permissions: admin.permissions
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAdmin(id);
    if (success) {
      toast({ title: "Admin deleted successfully" });
    } else {
      toast({ title: "Cannot delete main admin", variant: "destructive" });
    }
  };

  const togglePermission = (permission: AdminPermission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getRoleIcon = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleLabel = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      default: return 'Editor';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Admin Management</h1>
          <p className="text-muted-foreground mt-1">Manage admin accounts and permissions</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={18} />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users size={20} />
                {editingAdmin ? "Edit Admin" : "Add New Admin"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Avatar */}
              <div>
                <Label>Profile Picture</Label>
                <div className="mt-2">
                  <ImageUploader
                    value={formData.avatar}
                    onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))}
                    category="avatars"
                    placeholder="Upload admin picture"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label>Username *</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="username"
                    required
                    disabled={!!editingAdmin}
                  />
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <Label>{editingAdmin ? "New Password (optional)" : "Password *"}</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required={!editingAdmin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                {/* Display Name */}
                <div className="space-y-2">
                  <Label>Display Name *</Label>
                  <Input
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Full Name"
                    required
                  />
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              
              {/* Role */}
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: AdminUser['role']) => setFormData(prev => ({ ...prev, role: value }))}
                  disabled={editingAdmin?.isMainAdmin}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin (All permissions)</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Permissions */}
              {formData.role !== 'super_admin' && (
                <div className="space-y-3">
                  <Label>Custom Permissions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-muted/50 rounded-xl">
                    {allPermissions.map((perm) => (
                      <label
                        key={perm.key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors"
                      >
                        <Checkbox
                          checked={formData.permissions.includes(perm.key)}
                          onCheckedChange={() => togglePermission(perm.key)}
                        />
                        <span className="text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1 gap-2">
                  <Save size={18} />
                  {editingAdmin ? "Update" : "Add"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsOpen(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admins Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {admins.map((admin, index) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm
                ${admin.id === currentAdmin?.id ? 'ring-2 ring-primary/50' : ''}
                ${admin.isMainAdmin ? 'border-amber-500/50' : 'border-border/50'}
              `}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {admin.avatar ? (
                    <img
                      src={admin.avatar}
                      alt={admin.displayName}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {admin.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {admin.isMainAdmin && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{admin.displayName}</h3>
                    {admin.id === currentAdmin?.id && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                    {admin.isMainAdmin && (
                      <Badge className="bg-amber-500 text-white text-xs">Main</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Mail size={14} />
                    {admin.email || admin.username}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      {getRoleIcon(admin.role)}
                      {getRoleLabel(admin.role)}
                    </Badge>
                    {admin.lastLogin && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(admin)}
                    className="rounded-xl hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit size={18} />
                  </Button>
                  
                  {!admin.isMainAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Admin</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete admin "{admin.displayName}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(admin.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminAdmins;
