import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Briefcase, Clock, Euro, ArrowLeft, Upload, 
  CheckCircle, AlertCircle, FileText, User, Mail, Phone, Linkedin, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/api";

const JobApplication = () => {
  const { jobSlug } = useParams();
  const navigate = useNavigate();
  const { data, addApplication, getPageBlocks } = useData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const job = data.jobs.find(j => j.slug === jobSlug || j.id === jobSlug);
  const pageBlocks = getPageBlocks(`job-application-${job?.id}`);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    coverLetter: ''
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!job) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/careers">View All Jobs</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload a file smaller than 10MB", variant: "destructive" });
        return;
      }
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Please upload a PDF or Word document", variant: "destructive" });
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      toast({ title: "CV Required", description: "Please upload your CV/Resume", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      setUploadProgress(20);
      const applicantNameForCv = formData.fullName.trim();
      const jobTitleForCv = String(job.title || '').trim();
      const uploadResult = await uploadFile(cvFile, 'cvs', {
        applicantName: applicantNameForCv,
        applicant_name: applicantNameForCv,
        fullName: applicantNameForCv,
        jobTitle: jobTitleForCv,
        job_title: jobTitleForCv,
        position: jobTitleForCv
      });
      setUploadProgress(60);
      if (!uploadResult.success) throw new Error('Failed to upload CV');
      await addApplication({
        jobId: job.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cvUrl: uploadResult.url,
        coverLetter: formData.coverLetter,
        linkedIn: formData.linkedIn,
        portfolio: formData.portfolio
      });
      setUploadProgress(100);
      setIsSubmitted(true);
      toast({ title: "Application Submitted!", description: "We'll review your application and get back to you soon." });
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast({ title: "Submission Failed", description: error.message || "Failed to submit application. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <section className="pt-32 pb-20 bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Thank you for applying for the <span className="text-primary font-semibold">{job.title}</span> position. 
                We've received your application and will review it carefully. 
                Our team will get back to you within 5-7 business days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild><Link to="/careers">View More Jobs</Link></Button>
                <Button variant="outline" asChild><Link to="/">Back to Home</Link></Button>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/careers" 
              className="inline-flex items-center gap-2 text-secondary-foreground/70 hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Careers
            </Link>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
              Apply for <span className="text-gradient">{job.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-secondary-foreground/70">
              <span className="flex items-center gap-2"><Briefcase size={18} className="text-primary" />{job.department}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-primary" />{job.location}</span>
              <span className="flex items-center gap-2"><Clock size={18} className="text-primary" />{job.type}</span>
              {job.salary && <span className="flex items-center gap-2"><Euro size={18} className="text-primary" />{job.salary}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CMS Blocks Section (About This Role - editable from admin) */}
      {pageBlocks.length > 0 && (
        <div className="-mb-8">
          <BlockRenderer blocks={pageBlocks} />
        </div>
      )}

      {/* Job Details Section - Only render if any details exist */}
      {(job.description || (job.requirements && job.requirements.length > 0) || (job.responsibilities && job.responsibilities.length > 0)) && (
        <section className="py-8 bg-muted/30">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Job Description */}
              {job.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card rounded-2xl border border-border/50 p-6 shadow-card"
                >
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    Job Description
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{job.description}</p>
                </motion.div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card rounded-2xl border border-border/50 p-6 shadow-card"
                >
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-primary" />
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card rounded-2xl border border-border/50 p-6 shadow-card"
                >
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Application Form - Full Width */}
      <section className="py-10 bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 lg:p-10 shadow-card">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
                Your Application
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User size={16} className="text-primary" /> Full Name *
                    </Label>
                    <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Ammar Gabr" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail size={16} className="text-primary" /> Email Address *
                    </Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="ammar@example.com" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone size={16} className="text-primary" /> Phone Number *
                    </Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+20 101 2345678" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn" className="flex items-center gap-2">
                      <Linkedin size={16} className="text-primary" /> LinkedIn Profile
                    </Label>
                    <Input id="linkedIn" value={formData.linkedIn} onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="flex items-center gap-2">
                    <Globe size={16} className="text-primary" /> Portfolio / Website
                  </Label>
                  <Input id="portfolio" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} placeholder="https://yourportfolio.com" />
                </div>

                {/* CV Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" /> Resume / CV *
                  </Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      cvFile ? 'border-green-500 bg-green-500/10' : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <CheckCircle className="text-green-500" size={24} />
                        <span className="text-foreground font-medium">{cvFile.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setCvFile(null); }} className="text-muted-foreground hover:text-destructive">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-1">Click to upload your resume</p>
                        <p className="text-muted-foreground text-sm">PDF, DOC, or DOCX (max 10MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea id="coverLetter" value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} placeholder="Tell us why you're interested in this position and what makes you a great fit..." rows={6} />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-muted-foreground">
                    By submitting this application, you agree to our privacy policy and consent to 
                    the processing of your personal data for recruitment purposes.
                  </p>
                </div>

                {isSubmitting && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !cvFile}>
                  {isSubmitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JobApplication;
