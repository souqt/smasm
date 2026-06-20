import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical, Edit, Trash2, Copy, ChevronUp, ChevronDown,
  Image, Video, Grid3X3, Layers, Type, LayoutGrid,
  Quote, MessageSquare, Columns, Play, FileText, BarChart3,
  Plus, X, Save, Loader2, Euro, Users, Clock, Building, ListOrdered
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ContentBlock, ContentBlockType, IconGridItem, CardItem, FaqItem, StatItem, GalleryItem, PricingItem, TeamMember, TimelineItem, LogoItem } from "@/data/types";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";
import BlockSelector from "./BlockSelector";

// Block type icons
const blockIcons: Record<ContentBlockType, React.ReactNode> = {
  'hero-image': <Image size={18} />,
  'hero-video': <Video size={18} />,
  'icon-grid': <Grid3X3 size={18} />,
  'features-list': <Layers size={18} />,
  'image-text': <LayoutGrid size={18} />,
  'text-image': <LayoutGrid size={18} className="scale-x-[-1]" />,
  'cards-grid': <LayoutGrid size={18} />,
  'two-columns': <Columns size={18} />,
  'rich-text': <FileText size={18} />,
  'html-block': <Type size={18} />,
  'gallery': <Image size={18} />,
  'video-embed': <Play size={18} />,
  'stats-bar': <BarChart3 size={18} />,
  'testimonial': <Quote size={18} />,
  'cta-banner': <MessageSquare size={18} />,
  'accordion-faq': <Layers size={18} />,
  'pricing-table': <Euro size={18} />,
  'team-grid': <Users size={18} />,
  'timeline': <Clock size={18} />,
  'logo-cloud': <Building size={18} />,
  'numbered-steps': <ListOrdered size={18} />,
  'checklist': <Layers size={18} />
};

const blockLabels: Record<ContentBlockType, string> = {
  'hero-image': 'Hero with Image',
  'hero-video': 'Hero with Video',
  'icon-grid': 'Icon Grid',
  'features-list': 'Features List',
  'image-text': 'Image + Text',
  'text-image': 'Text + Image',
  'cards-grid': 'Cards Grid',
  'two-columns': 'Two Columns',
  'rich-text': 'Rich Text',
  'html-block': 'HTML Block',
  'gallery': 'Image Gallery',
  'video-embed': 'Video Embed',
  'stats-bar': 'Statistics Bar',
  'testimonial': 'Testimonial',
  'cta-banner': 'CTA Banner',
  'accordion-faq': 'FAQ Accordion',
  'pricing-table': 'Pricing Table',
  'team-grid': 'Team Members',
  'timeline': 'Timeline',
  'logo-cloud': 'Logo Cloud',
  'numbered-steps': 'Numbered Steps',
  'checklist': 'Checklist Grid'
};

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const BlockEditor = ({ blocks, onChange }: BlockEditorProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Create default block based on type
  const createDefaultBlock = (type: ContentBlockType): ContentBlock => {
    const baseBlock: ContentBlock = {
      id: generateId(),
      type,
      order: blocks.length + 1,
      backgroundColor: 'default'
    };

    switch (type) {
      case 'hero-image':
      case 'hero-video':
        return {
          ...baseBlock,
          title: 'Hero Title',
          subtitle: 'Subtitle text here',
          description: 'Add your description here...',
          buttonText: 'Get Started',
          buttonLink: '/contact'
        };
      case 'icon-grid':
        return {
          ...baseBlock,
          title: 'Our Services',
          columns: 3,
          items: [
            { id: generateId(), icon: '⚡', title: 'Service 1', description: 'Description here' },
            { id: generateId(), icon: '🎯', title: 'Service 2', description: 'Description here' },
            { id: generateId(), icon: '💡', title: 'Service 3', description: 'Description here' }
          ] as IconGridItem[]
        };
      case 'features-list':
        return {
          ...baseBlock,
          title: 'Key Features',
          items: [
            { id: generateId(), icon: '✓', title: 'Feature 1', description: 'Description here' },
            { id: generateId(), icon: '✓', title: 'Feature 2', description: 'Description here' }
          ] as IconGridItem[]
        };
      case 'image-text':
      case 'text-image':
        return {
          ...baseBlock,
          title: 'Section Title',
          description: 'Add your content here...',
          buttonText: 'Learn More',
          buttonLink: '#'
        };
      case 'cards-grid':
        return {
          ...baseBlock,
          title: 'Our Solutions',
          columns: 3,
          items: [
            { id: generateId(), title: 'Card 1', description: 'Description', icon: '🚀' },
            { id: generateId(), title: 'Card 2', description: 'Description', icon: '💎' },
            { id: generateId(), title: 'Card 3', description: 'Description', icon: '⭐' }
          ] as CardItem[]
        };
      case 'stats-bar':
        return {
          ...baseBlock,
          items: [
            { id: generateId(), value: '100+', label: 'Projects' },
            { id: generateId(), value: '50+', label: 'Clients' },
            { id: generateId(), value: '99%', label: 'Satisfaction' }
          ] as StatItem[]
        };
      case 'testimonial':
        return {
          ...baseBlock,
          description: '"This is an amazing testimonial quote."',
          title: 'John Doe',
          subtitle: 'CEO, Company Name'
        };
      case 'cta-banner':
        return {
          ...baseBlock,
          title: 'Ready to Get Started?',
          description: 'Contact us today to discuss your project.',
          buttonText: 'Contact Us',
          buttonLink: '/contact',
          secondaryButtonText: 'Learn More',
          secondaryButtonLink: '/about',
          backgroundColor: 'dark'
        };
      case 'accordion-faq':
        return {
          ...baseBlock,
          title: 'Frequently Asked Questions',
          items: [
            { id: generateId(), question: 'Question 1?', answer: 'Answer 1 here...' },
            { id: generateId(), question: 'Question 2?', answer: 'Answer 2 here...' }
          ] as FaqItem[]
        };
      case 'gallery':
        return {
          ...baseBlock,
          title: 'Gallery',
          columns: 3,
          items: [] as GalleryItem[]
        };
      case 'video-embed':
        return {
          ...baseBlock,
          title: 'Watch Our Video',
          videoType: 'youtube'
        };
      case 'rich-text':
        return {
          ...baseBlock,
          content: '<p>Add your content here...</p>'
        };
      case 'html-block':
        return {
          ...baseBlock,
          title: '',
          content: '<div>\n  <!-- Your custom HTML here -->\n</div>'
        };
      case 'two-columns':
        return {
          ...baseBlock,
          title: 'Two Column Section',
          content: '<p>Left column content...</p>',
          description: 'Right column content...'
        };
      case 'pricing-table':
        return {
          ...baseBlock,
          title: 'Our Pricing Plans',
          items: [
            { id: generateId(), title: 'Basic', price: '$29', period: 'month', description: 'For individuals', features: ['Feature 1', 'Feature 2', 'Feature 3'], buttonText: 'Get Started', buttonLink: '/contact', isPopular: false },
            { id: generateId(), title: 'Professional', price: '$79', period: 'month', description: 'For teams', features: ['Everything in Basic', 'Feature 4', 'Feature 5', 'Priority support'], buttonText: 'Get Started', buttonLink: '/contact', isPopular: true },
            { id: generateId(), title: 'Enterprise', price: '$199', period: 'month', description: 'For organizations', features: ['Everything in Pro', 'Feature 6', 'Dedicated support', 'Custom integrations'], buttonText: 'Contact Us', buttonLink: '/contact', isPopular: false }
          ] as PricingItem[]
        };
      case 'team-grid':
        return {
          ...baseBlock,
          title: 'Meet Our Team',
          columns: 3,
          items: [
            { id: generateId(), name: 'Team Member', role: 'CEO & Founder', bio: 'Brief bio here...', image: '' },
            { id: generateId(), name: 'Team Member', role: 'CTO', bio: 'Brief bio here...', image: '' },
            { id: generateId(), name: 'Team Member', role: 'Lead Designer', bio: 'Brief bio here...', image: '' }
          ] as TeamMember[]
        };
      case 'timeline':
        return {
          ...baseBlock,
          title: 'Our Process',
          items: [
            { id: generateId(), title: 'Step 1', description: 'Description of the first step', icon: '🎯', date: '' },
            { id: generateId(), title: 'Step 2', description: 'Description of the second step', icon: '⚡', date: '' },
            { id: generateId(), title: 'Step 3', description: 'Description of the third step', icon: '🚀', date: '' }
          ] as TimelineItem[]
        };
      case 'logo-cloud':
        return {
          ...baseBlock,
          title: 'Trusted By',
          items: [] as LogoItem[]
        };
      case 'numbered-steps':
        return {
          ...baseBlock,
          title: 'How It Works',
          items: [
            { id: generateId(), icon: '🔍', title: 'Discovery', description: 'We analyze your needs' },
            { id: generateId(), icon: '✏️', title: 'Design', description: 'We create the solution' },
            { id: generateId(), icon: '🚀', title: 'Launch', description: 'We deliver results' }
          ] as IconGridItem[]
        };
      case 'checklist':
        return {
          ...baseBlock,
          title: 'Our Checklist',
          columns: 2,
          items: [
            { id: generateId(), icon: '✓', title: 'Item 1', description: '' },
            { id: generateId(), icon: '✓', title: 'Item 2', description: '' },
            { id: generateId(), icon: '✓', title: 'Item 3', description: '' },
            { id: generateId(), icon: '✓', title: 'Item 4', description: '' }
          ] as IconGridItem[]
        };
      default:
        return baseBlock;
    }
  };

  const handleAddBlock = (type: ContentBlockType) => {
    const newBlock = createDefaultBlock(type);
    onChange([...blocks, newBlock]);
    setEditingBlock(newBlock);
    setEditDialogOpen(true);
  };

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock({ ...block });
    setEditDialogOpen(true);
  };

  const handleSaveBlock = () => {
    if (!editingBlock) return;
    const updatedBlocks = blocks.map(b => b.id === editingBlock.id ? editingBlock : b);
    onChange(updatedBlocks);
    setEditDialogOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const handleDuplicateBlock = (block: ContentBlock) => {
    const newBlock = {
      ...block,
      id: generateId(),
      order: blocks.length + 1
    };
    onChange([...blocks, newBlock]);
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    
    // Update order property
    newBlocks.forEach((block, i) => {
      block.order = i + 1;
    });
    
    onChange(newBlocks);
  };

  // Render block editor fields based on type
  const renderBlockFields = () => {
    if (!editingBlock) return null;

    const updateField = (field: string, value: any) => {
      setEditingBlock({ ...editingBlock, [field]: value });
    };

    const commonFields = (
      <>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={editingBlock.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Block title"
          />
        </div>

        {editingBlock.type !== 'stats-bar' && (
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={editingBlock.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="Optional subtitle"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Background</Label>
          <Select
            value={editingBlock.backgroundColor || 'default'}
            onValueChange={(value) => updateField('backgroundColor', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default (White)</SelectItem>
              <SelectItem value="muted">Muted (Gray)</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="primary">Primary Color</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    );

    switch (editingBlock.type) {
      case 'hero-image':
      case 'image-text':
      case 'text-image':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editingBlock.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUploader
                value={editingBlock.image || ''}
                onChange={(url) => updateField('image', url)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={editingBlock.buttonText || ''}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={editingBlock.buttonLink || ''}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'hero-video':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editingBlock.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Video (Upload)</Label>
              <ImageUploader
                value={editingBlock.video || ''}
                onChange={(url) => updateField('video', url)}
                accept="video/*"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={editingBlock.buttonText || ''}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input
                  value={editingBlock.buttonLink || ''}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'icon-grid':
      case 'features-list':
      case 'checklist':
        return (
          <>
            {commonFields}
            {(editingBlock.type === 'icon-grid' || editingBlock.type === 'checklist') && (
              <div className="space-y-2">
                <Label>Columns</Label>
                <Select
                  value={String(editingBlock.columns || 3)}
                  onValueChange={(value) => updateField('columns', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const items = (editingBlock.items || []) as IconGridItem[];
                    updateField('items', [
                      ...items,
                      { id: generateId(), icon: '⭐', title: 'New Item', description: 'Description' }
                    ]);
                  }}
                >
                  <Plus size={14} className="mr-1" /> Add Item
                </Button>
              </div>
              {((editingBlock.items || []) as IconGridItem[]).map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        const items = (editingBlock.items as IconGridItem[]).filter(i => i.id !== item.id);
                        updateField('items', items);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Icon</Label>
                      <Input
                        value={item.icon}
                        onChange={(e) => {
                          const items = [...(editingBlock.items as IconGridItem[])];
                          items[index] = { ...item, icon: e.target.value };
                          updateField('items', items);
                        }}
                        className="text-center text-lg"
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const items = [...(editingBlock.items as IconGridItem[])];
                          items[index] = { ...item, title: e.target.value };
                          updateField('items', items);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const items = [...(editingBlock.items as IconGridItem[])];
                        items[index] = { ...item, description: e.target.value };
                        updateField('items', items);
                      }}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Link Text (optional)</Label>
                      <Input
                        value={item.linkText || ''}
                        onChange={(e) => {
                          const items = [...(editingBlock.items as IconGridItem[])];
                          items[index] = { ...item, linkText: e.target.value };
                          updateField('items', items);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Link URL</Label>
                      <Input
                        value={item.linkUrl || ''}
                        onChange={(e) => {
                          const items = [...(editingBlock.items as IconGridItem[])];
                          items[index] = { ...item, linkUrl: e.target.value };
                          updateField('items', items);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'stats-bar':
        return (
          <>
            {commonFields}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Statistics</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const items = (editingBlock.items || []) as StatItem[];
                    updateField('items', [
                      ...items,
                      { id: generateId(), value: '0', label: 'New Stat' }
                    ]);
                  }}
                >
                  <Plus size={14} className="mr-1" /> Add Stat
                </Button>
              </div>
              {((editingBlock.items || []) as StatItem[]).map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Input
                    value={item.value}
                    onChange={(e) => {
                      const items = [...(editingBlock.items as StatItem[])];
                      items[index] = { ...item, value: e.target.value };
                      updateField('items', items);
                    }}
                    placeholder="Value"
                    className="w-24 text-center font-bold"
                  />
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const items = [...(editingBlock.items as StatItem[])];
                      items[index] = { ...item, label: e.target.value };
                      updateField('items', items);
                    }}
                    placeholder="Label"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive shrink-0"
                    onClick={() => {
                      const items = (editingBlock.items as StatItem[]).filter(i => i.id !== item.id);
                      updateField('items', items);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </>
        );

      case 'testimonial':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Quote</Label>
              <Textarea
                value={editingBlock.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                placeholder="Customer testimonial quote..."
              />
            </div>
            <div className="space-y-2">
              <Label>Author Image</Label>
              <ImageUploader
                value={editingBlock.image || ''}
                onChange={(url) => updateField('image', url)}
              />
            </div>
          </>
        );

      case 'cta-banner':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editingBlock.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Button Text</Label>
                <Input
                  value={editingBlock.buttonText || ''}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Button Link</Label>
                <Input
                  value={editingBlock.buttonLink || ''}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Secondary Button Text</Label>
                <Input
                  value={editingBlock.secondaryButtonText || ''}
                  onChange={(e) => updateField('secondaryButtonText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Button Link</Label>
                <Input
                  value={editingBlock.secondaryButtonLink || ''}
                  onChange={(e) => updateField('secondaryButtonLink', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'accordion-faq':
        return (
          <>
            {commonFields}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>FAQ Items</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const items = (editingBlock.items || []) as FaqItem[];
                    updateField('items', [
                      ...items,
                      { id: generateId(), question: 'New Question?', answer: 'Answer here...' }
                    ]);
                  }}
                >
                  <Plus size={14} className="mr-1" /> Add FAQ
                </Button>
              </div>
              {((editingBlock.items || []) as FaqItem[]).map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">FAQ {index + 1}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        const items = (editingBlock.items as FaqItem[]).filter(i => i.id !== item.id);
                        updateField('items', items);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Question</Label>
                    <Input
                      value={item.question}
                      onChange={(e) => {
                        const items = [...(editingBlock.items as FaqItem[])];
                        items[index] = { ...item, question: e.target.value };
                        updateField('items', items);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Answer</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => {
                        const items = [...(editingBlock.items as FaqItem[])];
                        items[index] = { ...item, answer: e.target.value };
                        updateField('items', items);
                      }}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'gallery':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select
                value={String(editingBlock.columns || 3)}
                onValueChange={(value) => updateField('columns', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Images</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const items = (editingBlock.items || []) as GalleryItem[];
                    updateField('items', [
                      ...items,
                      { id: generateId(), image: '', caption: '' }
                    ]);
                  }}
                >
                  <Plus size={14} className="mr-1" /> Add Image
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {((editingBlock.items || []) as GalleryItem[]).map((item, index) => (
                  <div key={item.id} className="relative border border-border rounded-lg p-3 space-y-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute top-1 right-1 h-6 w-6 text-destructive"
                      onClick={() => {
                        const items = (editingBlock.items as GalleryItem[]).filter(i => i.id !== item.id);
                        updateField('items', items);
                      }}
                    >
                      <X size={12} />
                    </Button>
                    <ImageUploader
                      value={item.image}
                      onChange={(url) => {
                        const items = [...(editingBlock.items as GalleryItem[])];
                        items[index] = { ...item, image: url };
                        updateField('items', items);
                      }}
                    />
                    <Input
                      value={item.caption || ''}
                      onChange={(e) => {
                        const items = [...(editingBlock.items as GalleryItem[])];
                        items[index] = { ...item, caption: e.target.value };
                        updateField('items', items);
                      }}
                      placeholder="Caption (optional)"
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'video-embed':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Video Type</Label>
              <Select
                value={editingBlock.videoType || 'youtube'}
                onValueChange={(value) => updateField('videoType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">Upload Video</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editingBlock.videoType === 'upload' ? (
              <div className="space-y-2">
                <Label>Upload Video</Label>
                <ImageUploader
                  value={editingBlock.video || ''}
                  onChange={(url) => updateField('video', url)}
                  accept="video/*"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  value={editingBlock.video || ''}
                  onChange={(e) => updateField('video', e.target.value)}
                  placeholder={editingBlock.videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://vimeo.com/...'}
                />
              </div>
            )}
          </>
        );

      case 'rich-text':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                content={editingBlock.content || ''}
                onChange={(content) => updateField('content', content)}
              />
            </div>
          </>
        );

      case 'html-block':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>HTML Code</Label>
              <Textarea
                value={editingBlock.content || ''}
                onChange={(e) => updateField('content', e.target.value)}
                rows={12}
                placeholder="<div>Your custom HTML here...</div>"
                className="font-mono text-sm"
                dir="ltr"
              />
            </div>
          </>
        );

      case 'cards-grid':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select
                value={String(editingBlock.columns || 3)}
                onValueChange={(value) => updateField('columns', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Cards</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const items = (editingBlock.items || []) as CardItem[];
                    updateField('items', [
                      ...items,
                      { id: generateId(), title: 'New Card', description: 'Description', icon: '⭐' }
                    ]);
                  }}
                >
                  <Plus size={14} className="mr-1" /> Add Card
                </Button>
              </div>
              {((editingBlock.items || []) as CardItem[]).map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Card {index + 1}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        const items = (editingBlock.items as CardItem[]).filter(i => i.id !== item.id);
                        updateField('items', items);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Icon</Label>
                      <Input
                        value={item.icon || ''}
                        onChange={(e) => {
                          const items = [...(editingBlock.items as CardItem[])];
                          items[index] = { ...item, icon: e.target.value };
                          updateField('items', items);
                        }}
                        className="text-center text-lg"
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={item.title}
                        onChange={(e) => {
                          const items = [...(editingBlock.items as CardItem[])];
                          items[index] = { ...item, title: e.target.value };
                          updateField('items', items);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const items = [...(editingBlock.items as CardItem[])];
                        items[index] = { ...item, description: e.target.value };
                        updateField('items', items);
                      }}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Card Image (optional)</Label>
                    <ImageUploader
                      value={item.image || ''}
                      onChange={(url) => {
                        const items = [...(editingBlock.items as CardItem[])];
                        items[index] = { ...item, image: url };
                        updateField('items', items);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'two-columns':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Left Column Content</Label>
              <RichTextEditor
                content={editingBlock.content || ''}
                onChange={(content) => updateField('content', content)}
              />
            </div>
            <div className="space-y-2">
              <Label>Right Column Content</Label>
              <Textarea
                value={editingBlock.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={6}
              />
            </div>
          </>
        );

      case 'pricing-table':
        return (
          <>
            {commonFields}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pricing Plans</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  const items = (editingBlock.items || []) as PricingItem[];
                  updateField('items', [...items, { id: generateId(), title: 'New Plan', price: '$0', period: 'month', description: '', features: ['Feature 1'], buttonText: 'Get Started', buttonLink: '/contact', isPopular: false }]);
                }}>
                  <Plus size={14} className="mr-1" /> Add Plan
                </Button>
              </div>
              {((editingBlock.items || []) as PricingItem[]).map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={item.isPopular || false} onChange={(e) => {
                          const items = [...(editingBlock.items as PricingItem[])];
                          items[index] = { ...item, isPopular: e.target.checked };
                          updateField('items', items);
                        }} />
                        Popular
                      </label>
                      <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => {
                        updateField('items', (editingBlock.items as PricingItem[]).filter(i => i.id !== item.id));
                      }}><Trash2 size={14} /></Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={(e) => { const items = [...(editingBlock.items as PricingItem[])]; items[index] = { ...item, title: e.target.value }; updateField('items', items); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">Price</Label><Input value={item.price} onChange={(e) => { const items = [...(editingBlock.items as PricingItem[])]; items[index] = { ...item, price: e.target.value }; updateField('items', items); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">Period</Label><Input value={item.period || ''} onChange={(e) => { const items = [...(editingBlock.items as PricingItem[])]; items[index] = { ...item, period: e.target.value }; updateField('items', items); }} placeholder="month" /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={item.description || ''} onChange={(e) => { const items = [...(editingBlock.items as PricingItem[])]; items[index] = { ...item, description: e.target.value }; updateField('items', items); }} /></div>
                  <div className="space-y-1">
                    <Label className="text-xs">Features (one per line)</Label>
                    <Textarea value={(item.features || []).join('\n')} onChange={(e) => { const items = [...(editingBlock.items as PricingItem[])]; items[index] = { ...item, features: e.target.value.split('\n') }; updateField('items', items); }} rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Button Text</Label><Input value={item.buttonText || ''} onChange={(e) => { const items = [...(editingBlock.items as PricingItem[])]; items[index] = { ...item, buttonText: e.target.value }; updateField('items', items); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">Button Link</Label><Input value={item.buttonLink || ''} onChange={(e) => { const items = [...(editingBlock.items as PricingItem[])]; items[index] = { ...item, buttonLink: e.target.value }; updateField('items', items); }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'team-grid':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select value={String(editingBlock.columns || 3)} onValueChange={(value) => updateField('columns', parseInt(value))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Team Members</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  const items = (editingBlock.items || []) as TeamMember[];
                  updateField('items', [...items, { id: generateId(), name: 'New Member', role: 'Role', bio: '', image: '' }]);
                }}>
                  <Plus size={14} className="mr-1" /> Add Member
                </Button>
              </div>
              {((editingBlock.items || []) as TeamMember[]).map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Member {index + 1}</span>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => {
                      updateField('items', (editingBlock.items as TeamMember[]).filter(i => i.id !== item.id));
                    }}><Trash2 size={14} /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={item.name} onChange={(e) => { const items = [...(editingBlock.items as TeamMember[])]; items[index] = { ...item, name: e.target.value }; updateField('items', items); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">Role</Label><Input value={item.role} onChange={(e) => { const items = [...(editingBlock.items as TeamMember[])]; items[index] = { ...item, role: e.target.value }; updateField('items', items); }} /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">Bio</Label><Textarea value={item.bio || ''} onChange={(e) => { const items = [...(editingBlock.items as TeamMember[])]; items[index] = { ...item, bio: e.target.value }; updateField('items', items); }} rows={2} /></div>
                  <div className="space-y-1">
                    <Label className="text-xs">Photo</Label>
                    <ImageUploader value={item.image || ''} onChange={(url) => { const items = [...(editingBlock.items as TeamMember[])]; items[index] = { ...item, image: url }; updateField('items', items); }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'timeline':
        return (
          <>
            {commonFields}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Timeline Items</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  const items = (editingBlock.items || []) as TimelineItem[];
                  updateField('items', [...items, { id: generateId(), title: 'New Step', description: 'Description here...', icon: '📌', date: '' }]);
                }}>
                  <Plus size={14} className="mr-1" /> Add Step
                </Button>
              </div>
              {((editingBlock.items || []) as TimelineItem[]).map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Step {index + 1}</span>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => {
                      updateField('items', (editingBlock.items as TimelineItem[]).filter(i => i.id !== item.id));
                    }}><Trash2 size={14} /></Button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Icon</Label><Input value={item.icon || ''} onChange={(e) => { const items = [...(editingBlock.items as TimelineItem[])]; items[index] = { ...item, icon: e.target.value }; updateField('items', items); }} className="text-center text-lg" /></div>
                    <div className="col-span-2 space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={(e) => { const items = [...(editingBlock.items as TimelineItem[])]; items[index] = { ...item, title: e.target.value }; updateField('items', items); }} /></div>
                    <div className="space-y-1"><Label className="text-xs">Date</Label><Input value={item.date || ''} onChange={(e) => { const items = [...(editingBlock.items as TimelineItem[])]; items[index] = { ...item, date: e.target.value }; updateField('items', items); }} placeholder="Optional" /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">Description (supports HTML)</Label><Textarea value={item.description} onChange={(e) => { const items = [...(editingBlock.items as TimelineItem[])]; items[index] = { ...item, description: e.target.value }; updateField('items', items); }} rows={3} /></div>
                </div>
              ))}
            </div>
          </>
        );

      case 'logo-cloud':
        return (
          <>
            {commonFields}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Logos</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  const items = (editingBlock.items || []) as LogoItem[];
                  updateField('items', [...items, { id: generateId(), name: 'Brand', image: '', url: '' }]);
                }}>
                  <Plus size={14} className="mr-1" /> Add Logo
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {((editingBlock.items || []) as LogoItem[]).map((item, index) => (
                  <div key={item.id} className="relative border border-border rounded-lg p-3 space-y-2">
                    <Button type="button" size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 text-destructive" onClick={() => {
                      updateField('items', (editingBlock.items as LogoItem[]).filter(i => i.id !== item.id));
                    }}><X size={12} /></Button>
                    <ImageUploader value={item.image} onChange={(url) => { const items = [...(editingBlock.items as LogoItem[])]; items[index] = { ...item, image: url }; updateField('items', items); }} />
                    <Input value={item.name} onChange={(e) => { const items = [...(editingBlock.items as LogoItem[])]; items[index] = { ...item, name: e.target.value }; updateField('items', items); }} placeholder="Brand name" className="text-sm" />
                    <Input value={item.url || ''} onChange={(e) => { const items = [...(editingBlock.items as LogoItem[])]; items[index] = { ...item, url: e.target.value }; updateField('items', items); }} placeholder="Website URL (optional)" className="text-sm" />
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'numbered-steps':
        return (
          <>
            {commonFields}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Steps</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  const items = (editingBlock.items || []) as IconGridItem[];
                  updateField('items', [...items, { id: generateId(), icon: '⭐', title: 'New Step', description: 'Description' }]);
                }}>
                  <Plus size={14} className="mr-1" /> Add Step
                </Button>
              </div>
              {((editingBlock.items || []) as IconGridItem[]).map((item, index) => (
                <div key={item.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Step {index + 1}</span>
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => {
                      updateField('items', (editingBlock.items as IconGridItem[]).filter(i => i.id !== item.id));
                    }}><Trash2 size={14} /></Button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Icon</Label><Input value={item.icon} onChange={(e) => { const items = [...(editingBlock.items as IconGridItem[])]; items[index] = { ...item, icon: e.target.value }; updateField('items', items); }} className="text-center text-lg" /></div>
                    <div className="col-span-3 space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={(e) => { const items = [...(editingBlock.items as IconGridItem[])]; items[index] = { ...item, title: e.target.value }; updateField('items', items); }} /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">Description (supports HTML)</Label><Textarea value={item.description} onChange={(e) => { const items = [...(editingBlock.items as IconGridItem[])]; items[index] = { ...item, description: e.target.value }; updateField('items', items); }} rows={2} /></div>
                </div>
              ))}
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  return (
    <div className="space-y-4">
      {/* Block List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {blocks.sort((a, b) => a.order - b.order).map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg group"
            >
              <div className="cursor-grab text-muted-foreground">
                <GripVertical size={16} />
              </div>
              
              <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                {blockIcons[block.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {block.title || blockLabels[block.type]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {blockLabels[block.type]}
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleMoveBlock(block.id, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp size={14} />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleMoveBlock(block.id, 'down')}
                  disabled={index === blocks.length - 1}
                >
                  <ChevronDown size={14} />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleDuplicateBlock(block)}
                >
                  <Copy size={14} />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleEditBlock(block)}
                >
                  <Edit size={14} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Block</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this block? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteBlock(block.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Block Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-dashed"
        onClick={() => setSelectorOpen(true)}
      >
        <Plus size={18} />
        Add Content Block
      </Button>

      {/* Block Selector Dialog */}
      <BlockSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleAddBlock}
      />

      {/* Block Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => { if (!open) setEditDialogOpen(false); }}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingBlock && blockIcons[editingBlock.type]}
              Edit {editingBlock && blockLabels[editingBlock.type]}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {renderBlockFields()}
          </div>

          <div className="flex gap-3 pt-4 border-t mt-4">
            <Button onClick={handleSaveBlock} className="flex-1 gap-2">
              <Save size={18} />
              Save Block
            </Button>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlockEditor;
