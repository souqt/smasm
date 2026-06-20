import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, GripVertical, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const AdminContactFaqs = () => {
  const { getPageBlocks, savePageBlocks, refreshData } = useData();
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const blocks = getPageBlocks('contact-faqs');
    if (blocks.length > 0 && blocks[0].items) {
      const items = blocks[0].items as any[];
      setFaqs(items.map(item => ({
        id: item.id || generateId(),
        question: item.question || item.title || '',
        answer: item.answer || item.description || '',
      })));
    }
  }, [getPageBlocks]);

  const handleAdd = () => {
    setFaqs(prev => [...prev, { id: generateId(), question: '', answer: '' }]);
    setHasChanges(true);
  };

  const handleUpdate = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
    if (validFaqs.length === 0 && faqs.length > 0) {
      toast({ title: "Please fill in all FAQ fields", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      await savePageBlocks('contact-faqs', [{
        id: 'contact-faqs-block',
        type: 'accordion-faq',
        order: 1,
        title: 'Common Questions',
        items: validFaqs.map(f => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
        })),
      }]);
      await refreshData();
      setHasChanges(false);
      toast({ title: "FAQs saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save FAQs", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Contact Page FAQs</h1>
          <p className="text-muted-foreground">Manage the Common Questions section on the Contact page</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !hasChanges} className="gap-2">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card rounded-xl border border-border p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical size={18} className="text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} className="text-primary" />
                    <span className="font-medium text-foreground">FAQ #{index + 1}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 size={18} />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Input
                    value={faq.question}
                    onChange={(e) => handleUpdate(faq.id, 'question', e.target.value)}
                    placeholder="Enter the question..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Answer</Label>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => handleUpdate(faq.id, 'answer', e.target.value)}
                    placeholder="Enter the answer..."
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {faqs.length === 0 && (
          <div className="text-center p-12 bg-muted/30 rounded-2xl border border-dashed border-border">
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No FAQs Yet</h3>
            <p className="text-muted-foreground mb-4">Add frequently asked questions for the Contact page</p>
          </div>
        )}

        <Button variant="outline" onClick={handleAdd} className="gap-2 w-full">
          <Plus size={18} /> Add FAQ
        </Button>
      </div>
    </div>
  );
};

export default AdminContactFaqs;
