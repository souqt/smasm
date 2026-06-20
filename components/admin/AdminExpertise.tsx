import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Cpu, BarChart3, Layers, Eye, EyeOff, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Technology, Stat, ExpertiseSection, ContentBlock } from "@/data/types";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";
import BlockEditor from "./BlockEditor";

// Helper to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Controlled Stat Edit Card Component
const StatEditCard = ({ 
  stat, 
  onUpdate, 
  onDelete 
}: { 
  stat: Stat; 
  onUpdate: (id: string, field: 'value' | 'label', value: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [value, setValue] = useState(stat.value);
  const [label, setLabel] = useState(stat.label);

  // Sync with props when stat changes from server
  useEffect(() => {
    setValue(stat.value);
    setLabel(stat.label);
  }, [stat.value, stat.label]);

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="space-y-3">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => onUpdate(stat.id, 'value', e.target.value)}
          placeholder="Value (e.g., 100+)"
          className="text-2xl font-bold text-center"
        />
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={(e) => onUpdate(stat.id, 'label', e.target.value)}
          placeholder="Label"
          className="text-center"
        />
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-destructive hover:text-destructive"
          onClick={() => onDelete(stat.id)}
        >
          <Trash2 size={14} className="mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
};

const AdminExpertise = () => {
  const { data, addTechnology, updateTechnology, deleteTechnology, addStat, updateStat, deleteStat, addExpertiseSection, updateExpertiseSection, deleteExpertiseSection, refreshData } = useData();
  const { toast } = useToast();
  
  // Technology state
  const [techDialogOpen, setTechDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [techFormData, setTechFormData] = useState({ name: '', icon: '' });
  
  // Stats state removed - now using direct API calls

  // Expertise Sections state
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ExpertiseSection | null>(null);
  const [sectionFormData, setSectionFormData] = useState({
    title: '',
    slug: '',
    tabName: '',
    description: '',
    content: '',
    contentBlocks: [] as any[],
    image: '',
    buttonText: 'Learn more',
    buttonLink: '',
    order: 1,
    isActive: true,
    metaTitle: '',
    metaDescription: ''
  });

  // Stats are now fetched directly from data.stats

  // Auto-generate slug when title changes
  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title);
    setSectionFormData(prev => ({
      ...prev,
      title,
      slug,
    }));
  };

  // Technology handlers
  const handleTechSubmit = () => {
    if (!techFormData.name) {
      toast({ title: "Please enter technology name", variant: "destructive" });
      return;
    }
    
    if (editingTech) {
      updateTechnology(editingTech.id, techFormData);
      toast({ title: "Technology updated successfully" });
    } else {
      addTechnology(techFormData);
      toast({ title: "Technology added successfully" });
    }
    setTechDialogOpen(false);
    resetTechForm();
  };

  const resetTechForm = () => {
    setTechFormData({ name: '', icon: '' });
    setEditingTech(null);
  };

  const handleEditTech = (tech: Technology) => {
    setEditingTech(tech);
    setTechFormData({ name: tech.name, icon: tech.icon });
    setTechDialogOpen(true);
  };

  const handleDeleteTech = (id: string) => {
    deleteTechnology(id);
    toast({ title: "Technology deleted" });
  };

  // Stats handlers - now using individual API calls
  const handleStatChange = async (id: string, field: 'value' | 'label', value: string) => {
    await updateStat(id, { [field]: value });
  };

  const handleAddStat = async () => {
    await addStat({
      value: '0',
      label: 'New Stat'
    });
    toast({ title: "Statistic added successfully" });
  };

  const handleDeleteStat = async (id: string) => {
    await deleteStat(id);
    toast({ title: "Statistic deleted" });
  };

  // Expertise Section handlers
  const handleSectionSubmit = async () => {
    if (!sectionFormData.title || !sectionFormData.description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    
    try {
      const sectionData = {
        ...sectionFormData,
      };

      if (editingSection) {
        await updateExpertiseSection(editingSection.id, sectionData);
        toast({ title: "Section updated successfully" });
      } else {
        await addExpertiseSection(sectionData);
        toast({ title: "Section added successfully" });
      }
      setSectionDialogOpen(false);
      resetSectionForm();
    } catch (error) {
      toast({ title: "Failed to save section", variant: "destructive" });
    }
  };

  const resetSectionForm = () => {
    setSectionFormData({
      title: '',
      slug: '',
      tabName: '',
      description: '',
      content: '',
      contentBlocks: [],
      image: '',
      buttonText: 'Learn more',
      buttonLink: '',
      order: (data.expertiseSections?.length || 0) + 1,
      isActive: true,
      metaTitle: '',
      metaDescription: ''
    });
    setEditingSection(null);
  };

  const handleEditSection = (section: ExpertiseSection) => {
    setEditingSection(section);
    setSectionFormData({
      title: section.title,
      slug: section.slug || generateSlug(section.title),
      tabName: section.tabName || '',
      description: section.description,
      content: section.content || '',
      contentBlocks: section.contentBlocks || [],
      image: section.image,
      buttonText: section.buttonText,
      buttonLink: section.buttonLink,
      order: section.order,
      isActive: section.isActive,
      metaTitle: section.metaTitle || '',
      metaDescription: section.metaDescription || ''
    });
    setSectionDialogOpen(true);
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteSection = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteSection = () => {
    if (deleteConfirmId) {
      deleteExpertiseSection(deleteConfirmId);
      toast({ title: "Section deleted" });
      setDeleteConfirmId(null);
    }
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    const sections = [...(data.expertiseSections || [])].sort((a, b) => a.order - b.order);
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const newOrder = sections[index - 1].order;
      updateExpertiseSection(id, { order: newOrder });
      updateExpertiseSection(sections[index - 1].id, { order: sections[index].order });
    } else if (direction === 'down' && index < sections.length - 1) {
      const newOrder = sections[index + 1].order;
      updateExpertiseSection(id, { order: newOrder });
      updateExpertiseSection(sections[index + 1].id, { order: sections[index].order });
    }
  };

  const emojiOptions = ['⚛️', '🟢', '🐍', '📘', '☁️', '🐳', '⎈', '🧠', '🦋', '🍎', '🔵', '🐘', '⚡', '🔥', '💎', '🚀', '🎯', '💻', '🔧', '📱'];

  const sortedSections = [...(data.expertiseSections || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary" />
            Platform Expertise
          </h1>
          <p className="text-muted-foreground mt-1">Manage expertise sections, technologies and statistics</p>
        </div>
      </div>

      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="sections" className="gap-2">
            <Layers size={16} />
            Sections
          </TabsTrigger>
          <TabsTrigger value="technologies" className="gap-2">
            <Cpu size={16} />
            Technologies
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 size={16} />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Expertise Sections Tab */}
        <TabsContent value="sections" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {sortedSections.length} sections configured
            </p>
            <Dialog open={sectionDialogOpen} onOpenChange={(open) => { setSectionDialogOpen(open); if (!open) resetSectionForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={18} />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
                    <TabsTrigger value="content">Rich Text</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input 
                        value={sectionFormData.title} 
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g., Value-driven transformation partner"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Button Link</Label>
                      <Input 
                        value={sectionFormData.buttonLink} 
                        onChange={(e) => setSectionFormData({...sectionFormData, buttonLink: e.target.value})}
                        placeholder="e.g., /contact, /services, https://example.com"
                      />
                      <p className="text-xs text-muted-foreground">The URL the button will navigate to. Use relative paths (e.g., /contact) or full URLs (e.g., https://example.com)</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Tab Name (for homepage button)</Label>
                      <Input 
                        value={sectionFormData.tabName} 
                        onChange={(e) => setSectionFormData({...sectionFormData, tabName: e.target.value})}
                        placeholder="e.g., Who, Why, Trust, How"
                      />
                      <p className="text-xs text-muted-foreground">Short name displayed as a tab button on the homepage. If empty, the first word of the title will be used.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Short Description * (for homepage)</Label>
                      <p className="text-xs text-muted-foreground">You can format text with bullet points, numbered lists, bold, etc.</p>
                      <RichTextEditor 
                        content={sectionFormData.description} 
                        onChange={(val) => setSectionFormData({...sectionFormData, description: val})}
                        placeholder="Brief description shown on the homepage..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <ImageUploader
                        value={sectionFormData.image}
                        onChange={(url) => setSectionFormData({...sectionFormData, image: url})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input 
                          value={sectionFormData.buttonText} 
                          onChange={(e) => setSectionFormData({...sectionFormData, buttonText: e.target.value})}
                          placeholder="Learn more"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input 
                          type="number"
                          value={sectionFormData.order} 
                          onChange={(e) => setSectionFormData({...sectionFormData, order: parseInt(e.target.value) || 1})}
                          min={1}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label>Active</Label>
                        <p className="text-sm text-muted-foreground">Show this section on the website</p>
                      </div>
                      <Switch 
                        checked={sectionFormData.isActive}
                        onCheckedChange={(checked) => setSectionFormData({...sectionFormData, isActive: checked})}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="blocks" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Content Blocks</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Build your page using pre-designed content blocks. Add hero sections, icon grids, galleries, and more.
                      </p>
                      <BlockEditor
                        blocks={sectionFormData.contentBlocks as ContentBlock[]}
                        onChange={(blocks) => setSectionFormData({...sectionFormData, contentBlocks: blocks})}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Rich Text Content (Legacy)</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Use this for simple text content. For more complex layouts, use Content Blocks instead.
                      </p>
                      <RichTextEditor
                        content={sectionFormData.content}
                        onChange={(content) => setSectionFormData({...sectionFormData, content})}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Meta Title</Label>
                      <Input 
                        value={sectionFormData.metaTitle} 
                        onChange={(e) => setSectionFormData({...sectionFormData, metaTitle: e.target.value})}
                        placeholder="SEO title (defaults to section title)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Meta Description</Label>
                      <Textarea 
                        value={sectionFormData.metaDescription} 
                        onChange={(e) => setSectionFormData({...sectionFormData, metaDescription: e.target.value})}
                        placeholder="SEO description (defaults to short description)"
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button onClick={handleSectionSubmit} className="w-full mt-4">
                  {editingSection ? 'Update' : 'Add'} Section
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {sortedSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image Preview */}
                    <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                      {section.image ? (
                        <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Layers size={24} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">{section.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{section.description}</p>
                          <p className="text-xs text-primary mt-1">/expertise/{section.slug}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a href={`/expertise/${section.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={16} />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveSection(section.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveSection(section.id, 'down')}
                            disabled={index === sortedSections.length - 1}
                          >
                            <ArrowDown size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditSection(section)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          section.isActive ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                        }`}>
                          {section.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                          {section.isActive ? 'Active' : 'Hidden'}
                        </span>
                        <span className="text-xs text-muted-foreground">Order: {section.order}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {sortedSections.length === 0 && (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
              <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No sections added yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSectionDialogOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                Add First Section
              </Button>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this section and all its content.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteSection} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Technologies Tab */}
        <TabsContent value="technologies" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {data.technologies.length} technologies configured
            </p>
            <Dialog open={techDialogOpen} onOpenChange={(open) => { setTechDialogOpen(open); if (!open) resetTechForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={18} />
                  Add Technology
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingTech ? 'Edit Technology' : 'Add New Technology'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Technology Name</Label>
                    <Input 
                      value={techFormData.name} 
                      onChange={(e) => setTechFormData({...techFormData, name: e.target.value})}
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Icon (Emoji or URL)</Label>
                    <Input 
                      value={techFormData.icon} 
                      onChange={(e) => setTechFormData({...techFormData, icon: e.target.value})}
                      placeholder="e.g., ⚛️ or image URL"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {emojiOptions.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setTechFormData({...techFormData, icon: emoji})}
                          className={`w-10 h-10 rounded-lg border text-lg hover:bg-muted transition-colors ${
                            techFormData.icon === emoji ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={handleTechSubmit} className="w-full">
                    {editingTech ? 'Update' : 'Add'} Technology
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.technologies.map((tech) => (
              <motion.div
                key={tech.id}
                layout
                className="group relative bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <p className="text-sm font-medium text-foreground truncate">{tech.name}</p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => handleEditTech(tech)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive"
                    onClick={() => handleDeleteTech(tech.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {data.stats.length} statistics configured
            </p>
            <Button variant="outline" onClick={handleAddStat} className="gap-2">
              <Plus size={18} />
              Add Stat
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.stats.map((stat) => (
              <StatEditCard 
                key={stat.id} 
                stat={stat} 
                onUpdate={handleStatChange} 
                onDelete={handleDeleteStat} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminExpertise;
