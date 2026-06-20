import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Briefcase, MapPin, Clock, Euro, Layers, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const AdminJobs = () => {
  const { data, addJob, updateJob, deleteJob } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', department: '', location: '', type: '', salary: '', description: '',
    requirements: [''], responsibilities: [''], isActive: true
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.slug) {
      toast({ title: "Please enter a job title and slug", variant: "destructive" });
      return;
    }
    // Check slug uniqueness
    const slugExists = data.jobs.some(j => j.slug === formData.slug && j.id !== editingJob?.id);
    if (slugExists) {
      toast({ title: "This URL slug is already in use", variant: "destructive" });
      return;
    }
    const jobData = {
      ...formData,
      requirements: formData.requirements.filter(r => r.trim()),
      responsibilities: formData.responsibilities.filter(r => r.trim())
    };
    if (editingJob) {
      updateJob(editingJob.id, jobData);
      toast({ title: "Job updated successfully" });
    } else {
      addJob(jobData);
      toast({ title: "Job added successfully" });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
      title: '', slug: '', department: '', location: '', type: '', salary: '', description: '', 
      requirements: [''], responsibilities: [''], isActive: true 
    });
    setEditingJob(null);
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({ 
      ...job, 
      requirements: job.requirements?.length ? job.requirements : [''], 
      responsibilities: job.responsibilities?.length ? job.responsibilities : [''] 
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground">Manage job listings</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={18} /> Add Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => {
                      const title = e.target.value;
                      const updates: any = { title };
                      if (!editingJob) updates.slug = generateSlug(title);
                      setFormData({...formData, ...updates});
                    }}
                    placeholder="e.g., Senior React Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})}
                    placeholder="e.g., senior-react-developer"
                  />
                  <p className="text-xs text-muted-foreground">URL: /apply/{formData.slug || '...'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., Remote"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Input 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})} 
                    placeholder="e.g., Full-time"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Input 
                    value={formData.salary} 
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="e.g., $80k - $120k"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter job description..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Requirements (one per line)</Label>
                <Textarea 
                  value={formData.requirements.join('\n')} 
                  onChange={(e) => setFormData({...formData, requirements: e.target.value.split('\n')})} 
                  rows={4}
                  placeholder="5+ years of experience&#10;React expertise&#10;TypeScript knowledge"
                />
              </div>
              <div className="space-y-2">
                <Label>Responsibilities (one per line)</Label>
                <Textarea 
                  value={formData.responsibilities.join('\n')} 
                  onChange={(e) => setFormData({...formData, responsibilities: e.target.value.split('\n')})} 
                  rows={4}
                  placeholder="Lead development projects&#10;Code reviews&#10;Mentoring junior developers"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-base">Active Status</Label>
                  <p className="text-sm text-muted-foreground">Job will be visible on the careers page</p>
                </div>
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})} 
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingJob ? 'Update' : 'Add'} Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {data.jobs.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No jobs added yet</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16} className="mr-2" />
            Add First Job
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.jobs.map((job) => (
            <div key={job.id} className="bg-card rounded-xl border border-border p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{job.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.isActive 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-gray-500/10 text-gray-600'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {job.department && (
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} />
                        {job.department}
                      </span>
                    )}
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </span>
                    )}
                    {job.type && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {job.type}
                      </span>
                    )}
                    {job.salary && (
                      <span className="flex items-center gap-1">
                        <Euro size={14} />
                        {job.salary}
                      </span>
                    )}
                  </div>
                  {job.description && (
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{job.description}</p>
                  )}
                </div>
                <div className="flex gap-2 self-end md:self-start">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate(`/admin/jobs/${job.id}/blocks`)}>
                    <Layers size={14} />
                    Blocks
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(job)}>
                    <Edit size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Job</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{job.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { deleteJob(job.id); toast({ title: "Job deleted successfully" }); }}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
