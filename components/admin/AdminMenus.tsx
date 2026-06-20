import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Menu, Plus, Edit, Trash2, GripVertical, Save,
  Link as LinkIcon, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { NavLink } from "@/data/types";

// Sortable Link Item Component
interface SortableLinkItemProps {
  link: NavLink;
  depth?: number;
  onEdit: (link: NavLink) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

const SortableLinkItem = ({ link, depth = 0, onEdit, onDelete, onAddChild }: SortableLinkItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`
          relative group p-4 rounded-xl border border-border/50 bg-card/50
          ${depth > 0 ? 'ml-8 mt-2' : 'mt-3'}
          hover:border-primary/30 transition-all
          ${isDragging ? 'shadow-lg ring-2 ring-primary/30' : ''}
        `}
      >
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          >
            <GripVertical size={18} />
          </div>
          
          {/* Link Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{link.name}</span>
              {!link.isActive && (
                <Badge variant="secondary" className="text-xs">Inactive</Badge>
              )}
              {link.children && link.children.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {link.children.length} sub-link{link.children.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <LinkIcon size={12} />
              <span className="truncate">{link.href}</span>
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAddChild(link.id)}
              title="Add sub-link"
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(link)}
            >
              <Edit size={16} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Link</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{link.name}"? All sub-links will also be deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(link.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>
      
      {/* Children - Nested Sortable */}
      {link.children && link.children.length > 0 && (
        <div className="mt-2">
          {link.children.map(child => (
            <SortableLinkItem
              key={child.id}
              link={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AdminMenus = () => {
  const { data, updateNavLinks } = useData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    href: "",
    isActive: true
  });

  const navLinks = data.navLinks || [];

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetForm = () => {
    setFormData({
      name: "",
      href: "",
      isActive: true
    });
    setEditingLink(null);
    setParentId(null);
  };

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let updatedLinks = [...navLinks];
      
      if (editingLink) {
        updatedLinks = updateLinkInTree(updatedLinks, editingLink.id, formData);
        await updateNavLinks(updatedLinks);
        toast({ title: "Link updated successfully" });
      } else {
        const newLink: NavLink = {
          id: generateId(),
          ...formData,
          children: []
        };
        
        if (parentId) {
          updatedLinks = addChildLink(updatedLinks, parentId, newLink);
        } else {
          updatedLinks.push(newLink);
        }
        await updateNavLinks(updatedLinks);
        toast({ title: "Link added successfully" });
      }
      
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save link:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save link",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateLinkInTree = (links: NavLink[], id: string, data: Partial<NavLink>): NavLink[] => {
    return links.map(link => {
      if (link.id === id) {
        return { ...link, ...data };
      }
      if (link.children) {
        return { ...link, children: updateLinkInTree(link.children, id, data) };
      }
      return link;
    });
  };

  const addChildLink = (links: NavLink[], parentId: string, newLink: NavLink): NavLink[] => {
    return links.map(link => {
      if (link.id === parentId) {
        return { ...link, children: [...(link.children || []), newLink] };
      }
      if (link.children) {
        return { ...link, children: addChildLink(link.children, parentId, newLink) };
      }
      return link;
    });
  };

  const deleteLinkFromTree = (links: NavLink[], id: string): NavLink[] => {
    return links
      .filter(link => link.id !== id)
      .map(link => ({
        ...link,
        children: link.children ? deleteLinkFromTree(link.children, id) : []
      }));
  };

  const handleEdit = (link: NavLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      href: link.href,
      isActive: link.isActive
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    try {
      const updatedLinks = deleteLinkFromTree(navLinks, id);
      await updateNavLinks(updatedLinks);
      toast({ title: "Link deleted successfully" });
    } catch (error) {
      toast({ 
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddChild = (parentId: string) => {
    setParentId(parentId);
    setIsOpen(true);
  };

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = navLinks.findIndex(link => link.id === active.id);
      const newIndex = navLinks.findIndex(link => link.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newLinks = arrayMove(navLinks, oldIndex, newIndex);
        setIsSaving(true);
        try {
          await updateNavLinks(newLinks);
          toast({ title: "Menu reordered successfully" });
        } catch (error) {
          toast({ 
            title: "Error", 
            description: "Failed to reorder",
            variant: "destructive" 
          });
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Menus</h1>
          <p className="text-muted-foreground mt-1">Manage website navigation menus</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={isSaving}>
              <Plus size={18} />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Menu size={20} />
                {editingLink ? "Edit Link" : parentId ? "Add Sub-Link" : "Add New Link"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label>Link Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Home"
                  required
                  disabled={isSaving}
                />
              </div>
              
              {/* Href */}
              <div className="space-y-2">
                <Label>URL *</Label>
                <Input
                  value={formData.href}
                  onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                  placeholder="/page-slug أو https://..."
                  required
                  disabled={isSaving}
                />
              </div>
              
              {/* Active */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <Label>Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.isActive ? "Link is active and visible" : "Link is hidden"}
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  disabled={isSaving}
                />
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1 gap-2" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {editingLink ? "Update" : "Add"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsOpen(false); resetForm(); }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saving Indicator */}
      {isSaving && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Loader2 size={16} className="animate-spin" />
          Saving...
        </div>
      )}

      {/* Links List with DnD */}
      {navLinks.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl">
          <Menu className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No links in the menu</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={navLinks.map(link => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              <AnimatePresence>
                {navLinks.map(link => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddChild={handleAddChild}
                  />
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Tips */}
      <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
        <h3 className="font-medium text-foreground mb-2">💡 Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Drag links to reorder them</li>
          <li>• You can add sub-links by clicking the + button next to any link</li>
          <li>• Inactive links won't be visible to visitors</li>
          <li>• You can use external links (https://) or internal links (/page)</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminMenus;
