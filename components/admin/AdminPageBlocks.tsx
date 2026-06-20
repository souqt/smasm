import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import BlockEditor from "./BlockEditor";
import { ContentBlock, ContentBlockType } from "@/data/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminPageBlocksProps {
  pageKey: string;
  pageTitle: string;
  pageDescription: string;
  defaultBlocks?: ContentBlock[];
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const AdminPageBlocks = ({ pageKey, pageTitle, pageDescription, defaultBlocks }: AdminPageBlocksProps) => {
  const { getPageBlocks, savePageBlocks, refreshData } = useData();
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const saved = getPageBlocks(pageKey);
    setBlocks(saved);
  }, [pageKey, getPageBlocks]);

  const handleBlocksChange = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePageBlocks(pageKey, blocks);
      await refreshData();
      setHasChanges(false);
      toast({ title: "Saved Successfully", description: "Page changes have been saved." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save changes.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInitialize = async () => {
    if (!defaultBlocks) return;
    const initializedBlocks = defaultBlocks.map((block, index) => ({
      ...block,
      id: generateId(),
      order: index + 1
    }));
    setBlocks(initializedBlocks);
    setHasChanges(true);
    toast({ title: "Initialized", description: "Default blocks created. Press Save to confirm changes." });
  };

  const handleReset = () => {
    setBlocks([]);
    setHasChanges(true);
    setShowResetConfirm(false);
    toast({ title: "Reset Complete", description: "All blocks deleted. Press Save to confirm." });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1">{pageDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          {blocks.length === 0 && defaultBlocks && defaultBlocks.length > 0 && (
            <Button variant="outline" onClick={handleInitialize} className="gap-2">
              <Sparkles size={16} />
              Initialize Default Content
            </Button>
          )}
          {blocks.length > 0 && (
            <Button variant="outline" onClick={() => setShowResetConfirm(true)} className="gap-2 text-destructive">
              <RotateCcw size={16} />
              Reset
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
            className="gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Info when empty */}
      {blocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-12 bg-muted/30 rounded-2xl border border-dashed border-border"
        >
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Blocks Yet</h3>
          <p className="text-muted-foreground mb-4">
            {defaultBlocks && defaultBlocks.length > 0
              ? 'Click "Initialize Default Content" to create blocks, or add new blocks manually using the editor below.'
              : 'Add new blocks using the editor below to build your page.'}
          </p>
        </motion.div>
      )}

      {/* Block Editor */}
      <BlockEditor blocks={blocks} onChange={handleBlocksChange} />

      {/* Reset Confirmation */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to reset?</AlertDialogTitle>
            <AlertDialogDescription>
              All blocks will be deleted from this page. The page will revert to the default content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPageBlocks;
