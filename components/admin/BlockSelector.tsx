import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Video, Grid3X3, Layers, Type, LayoutGrid,
  Quote, MessageSquare, Columns, Play, FileText, BarChart3,
  Plus, X, ChevronDown, ChevronUp, Euro, Users, Clock, Building, ListOrdered
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContentBlockType } from "@/data/types";

interface BlockTypeOption {
  type: ContentBlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'hero' | 'content' | 'media' | 'interactive' | 'advanced';
}

const blockTypes: BlockTypeOption[] = [
  // Hero blocks
  { type: 'hero-image', label: 'Hero with Image', description: 'Full-width hero section with title, description, CTA and image', icon: <Image size={24} />, category: 'hero' },
  { type: 'hero-video', label: 'Hero with Video', description: 'Full-width hero section with video background', icon: <Video size={24} />, category: 'hero' },
  // Content blocks
  { type: 'icon-grid', label: 'Icon Grid', description: 'Grid of icons with titles and descriptions (like services)', icon: <Grid3X3 size={24} />, category: 'content' },
  { type: 'features-list', label: 'Features List', description: 'List of features with icons', icon: <Layers size={24} />, category: 'content' },
  { type: 'image-text', label: 'Image + Text', description: 'Image on left, text content on right', icon: <LayoutGrid size={24} />, category: 'content' },
  { type: 'text-image', label: 'Text + Image', description: 'Text content on left, image on right', icon: <LayoutGrid size={24} className="scale-x-[-1]" />, category: 'content' },
  { type: 'cards-grid', label: 'Cards Grid', description: 'Grid of cards with images, titles and descriptions', icon: <LayoutGrid size={24} />, category: 'content' },
  { type: 'two-columns', label: 'Two Columns', description: 'Two column text layout', icon: <Columns size={24} />, category: 'content' },
  { type: 'rich-text', label: 'Rich Text', description: 'Free-form rich text content block', icon: <FileText size={24} />, category: 'content' },
  { type: 'html-block', label: 'HTML Block', description: 'Raw HTML code block for custom content', icon: <Type size={24} />, category: 'content' },
  // Media blocks
  { type: 'gallery', label: 'Image Gallery', description: 'Grid gallery of images', icon: <Image size={24} />, category: 'media' },
  { type: 'video-embed', label: 'Video Embed', description: 'YouTube or Vimeo video embed', icon: <Play size={24} />, category: 'media' },
  { type: 'logo-cloud', label: 'Logo Cloud', description: 'Display partner/client logos in a cloud', icon: <Building size={24} />, category: 'media' },
  // Interactive blocks
  { type: 'stats-bar', label: 'Statistics Bar', description: 'Display key statistics/numbers', icon: <BarChart3 size={24} />, category: 'interactive' },
  { type: 'testimonial', label: 'Testimonial', description: 'Customer quote/testimonial', icon: <Quote size={24} />, category: 'interactive' },
  { type: 'cta-banner', label: 'CTA Banner', description: 'Call to action banner with buttons', icon: <MessageSquare size={24} />, category: 'interactive' },
  { type: 'accordion-faq', label: 'FAQ Accordion', description: 'Expandable FAQ section', icon: <ChevronDown size={24} />, category: 'interactive' },
  // Advanced blocks
  { type: 'pricing-table', label: 'Pricing Table', description: 'Professional pricing cards with features comparison', icon: <Euro size={24} />, category: 'advanced' },
  { type: 'team-grid', label: 'Team Members', description: 'Display team members with photos and roles', icon: <Users size={24} />, category: 'advanced' },
  { type: 'timeline', label: 'Timeline', description: 'Vertical timeline for process steps or history', icon: <Clock size={24} />, category: 'advanced' },
  { type: 'numbered-steps', label: 'Numbered Steps', description: 'Step-by-step process with numbered cards', icon: <ListOrdered size={24} />, category: 'advanced' },
  { type: 'checklist', label: 'Checklist Grid', description: 'Items with check icons in a multi-column grid layout', icon: <ChevronDown size={24} />, category: 'content' },
];

const categoryLabels = {
  hero: 'Hero Sections',
  content: 'Content Blocks',
  media: 'Media Blocks',
  interactive: 'Interactive Blocks',
  advanced: 'Advanced Blocks'
};

interface BlockSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: ContentBlockType) => void;
}

const BlockSelector = ({ open, onClose, onSelect }: BlockSelectorProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('hero');
  const categories = ['hero', 'content', 'media', 'interactive', 'advanced'] as const;

  const handleSelect = (type: ContentBlockType) => {
    onSelect(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Plus size={20} />Add Content Block</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {categories.map(category => (
            <div key={category} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="font-medium text-foreground">{categoryLabels[category]}</span>
                {expandedCategory === category ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
              </button>
              <AnimatePresence>
                {expandedCategory === category && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 p-4">
                      {blockTypes.filter(block => block.category === category).map(block => (
                        <motion.button
                          key={block.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect(block.type)}
                          className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">{block.icon}</div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-foreground text-sm">{block.label}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{block.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockSelector;
