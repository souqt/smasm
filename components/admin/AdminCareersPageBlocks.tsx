import AdminPageBlocks from "./AdminPageBlocks";
import { ContentBlock } from "@/data/types";

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

const AdminCareersPageBlocks = () => {
  return (
    <AdminPageBlocks
      pageKey="careers"
      pageTitle="Careers Page"
      pageDescription="Manage the Careers page content blocks (Hero, Why Work With Us, Hiring Process, Life at Oversea, etc.). Blocks with order 1-3 appear before the Open Positions section, and blocks with order 4+ appear after it."
      defaultBlocks={defaultCareersBlocks}
    />
  );
};

export default AdminCareersPageBlocks;
