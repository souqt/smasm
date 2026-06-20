import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, Euro, ArrowRight, Search, Check, FileSearch, Code2, Users, Rocket, Heart, Eye, Shield, Award, MessageSquare, GraduationCap, Lightbulb, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import { ContentBlock } from "@/data/types";
import teamImage from "@/assets/team.jpg";

// Default blocks for CMS-controlled sections
const defaultCareersBlocks: ContentBlock[] = [
  {
    id: 'careers-hero',
    type: 'hero-image',
    order: 1,
    title: 'Build Your Career With Us',
    subtitle: "We're Hiring",
    description: 'Join a supportive engineering community and work with leading European companies in long-term, stable roles.',
    buttonText: 'Apply Now',
    buttonLink: '#open-positions',
    secondaryButtonText: 'Join Talent Pool',
    secondaryButtonLink: '/contact',
    backgroundColor: 'dark'
  },
  {
    id: 'careers-why-work',
    type: 'checklist',
    order: 2,
    title: 'Why Work With Us',
    subtitle: 'We are not a traditional outsourcing company. We invest in our people, support them continuously, and help them grow in stable, long-term roles.',
    columns: 2,
    items: [
      { id: 'ww1', icon: 'Briefcase', title: 'Long-term positions with European companies', description: 'Stable roles with leading companies across Europe.' },
      { id: 'ww2', icon: 'CheckCircle2', title: 'Structured onboarding and clear expectations', description: 'Clear processes from day one.' },
      { id: 'ww3', icon: 'Heart', title: 'Supportive environment with regular check-ins', description: 'We care about your well-being.' },
      { id: 'ww4', icon: 'GraduationCap', title: 'Professional development based on your career goals', description: 'Grow your skills continuously.' },
      { id: 'ww5', icon: 'MessageSquare', title: 'Transparent communication — no surprise changes', description: 'Honest and open at all times.' },
      { id: 'ww6', icon: 'Euro', title: 'Competitive packages aligned with experience & market', description: 'Fair compensation packages.' },
      { id: 'ww7', icon: 'Shield', title: 'Stable, predictable work with real impact', description: 'Work that matters.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'careers-believe',
    type: 'cta-banner',
    order: 3,
    title: 'We Believe Great Teams Grow',
    description: 'When developers feel supported, valued, and respected — they build amazing things.',
    buttonText: 'See Open Positions',
    buttonLink: '#open-positions',
    backgroundColor: 'primary'
  },
  {
    id: 'careers-hiring-process',
    type: 'timeline',
    order: 5,
    title: 'Our Hiring Process',
    subtitle: 'We follow a transparent and respectful hiring process designed to help you succeed.',
    items: [
      { id: 'hp1', title: 'Application Review', description: 'We review your CV and match your profile with open roles.', icon: 'FileSearch', date: 'Step 1' },
      { id: 'hp2', title: 'Technical Evaluation', description: 'Coding test or technical interview depending on the role.', icon: 'Code2', date: 'Step 2' },
      { id: 'hp3', title: 'Client Interview', description: 'Meet the European company you may work with.', icon: 'Users', date: 'Step 3' },
      { id: 'hp4', title: 'Offer & Onboarding', description: 'Receive your offer, sign your contract, and start structured onboarding with our operations team.', icon: 'Rocket', date: 'Step 4' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'careers-screening',
    type: 'numbered-steps',
    order: 6,
    title: 'Talent Selection',
    subtitle: 'Candidate Screening Process',
    items: [
      { id: 'sc1', title: 'Online Screening Interview', description: 'Initial online screening to understand your background and goals.' },
      { id: 'sc2', title: 'First Job Interview Online', description: 'First job interview online to assess technical skills and cultural fit.' },
      { id: 'sc3', title: 'Predictive Index Assessment', description: 'Predictive Index test and/or Predictive Index Cognitive Assessment.' },
      { id: 'sc4', title: 'Face-to-Face Interview', description: 'Second job interview — face to face for final evaluation.' },
      { id: 'sc5', title: 'Job Offer', description: 'Receive your official job offer and begin onboarding.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'careers-life',
    type: 'text-image',
    order: 7,
    title: 'Life at Oversea Solutions',
    subtitle: 'More Than Just Work',
    description: '<p>We work with great companies — but we also work great together.</p><p>Expect a supportive environment where people help each other, share knowledge, and grow both technically and professionally.</p><h4>We value:</h4><ul><li>Respect</li><li>Transparency</li><li>Ownership</li><li>Continuous learning</li><li>Long-term thinking</li></ul><p><strong>You\'re not just joining a project. You\'re joining a team.</strong></p>',
    backgroundColor: 'default'
  },
  {
    id: 'careers-talent-pool',
    type: 'cta-banner',
    order: 8,
    title: 'Talent Pool — Apply Anytime',
    description: "Didn't find a suitable role? You can still join our talent pipeline. We actively match skilled engineers to new opportunities with our European partners. Submit your CV, and we will contact you when a role that fits your skills becomes available.",
    buttonText: 'Join Talent Pool',
    buttonLink: '/contact',
    backgroundColor: 'dark'
  }
];

const Careers = () => {
  const { data, getPageBlocks } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Get CMS blocks or use defaults
  const blocks = getPageBlocks('careers');
  const displayBlocks = blocks.length > 0 ? blocks : defaultCareersBlocks;

  // Split blocks: before jobs (order <= 3) and after jobs (order > 3)
  const blocksBeforeJobs = displayBlocks.filter(b => b.order <= 3).sort((a, b) => a.order - b.order);
  const blocksAfterJobs = displayBlocks.filter(b => b.order > 3).sort((a, b) => a.order - b.order);

  // Use jobs from database (only active ones)
  const jobs = data.jobs.filter(job => job.isActive);
  const departments = ["All", ...new Set(jobs.map((job) => job.department))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "All" || job.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  // Reset page when filters change
  const handleSearch = (value: string) => { setSearchTerm(value); setCurrentPage(1); };
  const handleDepartment = (dept: string) => { setSelectedDepartment(dept); setCurrentPage(1); };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* CMS Blocks - Before Jobs */}
      <BlockRenderer blocks={blocksBeforeJobs} />

      {/* Dynamic Job Listings Section */}
      <section id="open-positions" className="section-padding bg-muted/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Current Openings
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Open <span className="text-gradient">Positions</span>
            </h2>
            <p className="text-muted-foreground">
              Find your next opportunity and grow with us.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-4 mb-10"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => handleDepartment(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDepartment === dept
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border/50 text-foreground hover:border-primary/50"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Job Cards */}
          <div className="space-y-4">
            {paginatedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {job.department}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 lg:mb-0">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} className="text-primary" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} className="text-primary" />
                        {job.type}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <Euro size={16} className="text-primary" />
                          {job.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="default" className="shrink-0" asChild>
                    <Link to={`/apply/${job.slug || job.id}`}>Apply Now <ArrowRight size={16} /></Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft size={16} /> Back
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          )}

          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {jobs.length === 0 ? "No open positions at the moment" : "No positions found matching your criteria."}
              </p>
              {jobs.length > 0 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("All");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* CMS Blocks - After Jobs */}
      <BlockRenderer blocks={blocksAfterJobs} />

      <Footer />
    </div>
  );
};

export default Careers;
