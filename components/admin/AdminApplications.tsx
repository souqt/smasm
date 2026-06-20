import { Users, Trash2, Download, Mail, Phone, Briefcase, Calendar, Linkedin, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";

const AdminApplications = () => {
  const { data, updateApplicationStatus, deleteApplication } = useData();
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: any) => {
    updateApplicationStatus(id, status);
    toast({ title: "Status updated successfully" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'reviewing': return 'bg-blue-500/10 text-blue-600';
      case 'interviewed': return 'bg-purple-500/10 text-purple-600';
      case 'accepted': return 'bg-green-500/10 text-green-600';
      case 'rejected': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground">Manage job applications</p>
      </div>

      {data.applications.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No applications received yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.applications.map((app) => {
            const job = data.jobs.find(j => j.id === app.jobId);
            return (
              <div key={app.id} className="bg-card rounded-xl border border-border p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-semibold text-lg">
                        {app.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{app.fullName}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {app.email}
                        </span>
                        {app.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {app.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase size={14} />
                          {job?.title || 'Unknown Position'}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar size={14} />
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        {app.linkedIn && (
                          <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <Linkedin size={14} />
                            LinkedIn
                          </a>
                        )}
                        {app.portfolio && (
                          <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <Globe size={14} />
                            Portfolio
                          </a>
                        )}
                      </div>
                      {app.coverLetter && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <p className="flex items-center gap-1 text-sm font-medium text-foreground mb-1">
                            <FileText size={14} className="text-primary" />
                            Cover Letter
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{app.coverLetter}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Select value={app.status} onValueChange={(value) => handleStatusChange(app.id, value)}>
                      <SelectTrigger className={`w-36 ${getStatusColor(app.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="interviewed">Interviewed</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex gap-2">
                      {app.cvUrl && (
                        <Button variant="outline" size="icon" asChild title="Download CV">
                          <a href={app.cvUrl} target="_blank" rel="noopener noreferrer">
                            <Download size={16} />
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => deleteApplication(app.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
