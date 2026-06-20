import AdminPageBlocks from "./AdminPageBlocks";
import { ContentBlock } from "@/data/types";

// Default blocks matching the current ServicesPage structure
const defaultServicesBlocks: ContentBlock[] = [
  {
    id: 'temp-hero',
    type: 'hero-image',
    order: 1,
    title: 'Our Services',
    subtitle: 'What We Offer',
    description: 'End-to-end solutions for your digital transformation journey. From concept to deployment, we\'ve got you covered with cutting-edge technologies and expert talent.',
    buttonText: 'Get Started',
    buttonLink: '/contact',
    backgroundColor: 'dark'
  },
  {
    id: 'temp-cards',
    type: 'cards-grid',
    order: 2,
    title: 'What We Do',
    subtitle: 'Comprehensive solutions tailored to your business needs',
    columns: 3,
    items: [
      { id: 'c1', title: 'Custom Development', description: 'Full-stack web and mobile application development using cutting-edge technologies.', icon: 'Code2' },
      { id: 'c2', title: 'Mobile Apps', description: 'Native and cross-platform mobile applications for iOS and Android.', icon: 'Smartphone' },
      { id: 'c3', title: 'AI Solutions', description: 'Intelligent automation and machine learning solutions for your business.', icon: 'BrainCircuit' },
      { id: 'c4', title: 'Team Augmentation', description: 'Skilled developers to extend your team and accelerate delivery.', icon: 'Users' },
      { id: 'c5', title: 'Cloud Services', description: 'Cloud architecture, migration, and managed services.', icon: 'Cloud' },
      { id: 'c6', title: 'Cybersecurity', description: 'Comprehensive security solutions to protect your digital assets.', icon: 'ShieldCheck' },
    ],
    backgroundColor: 'default'
  },
  {
    id: 'temp-process',
    type: 'icon-grid',
    order: 3,
    title: 'Our Process',
    subtitle: 'We follow a proven methodology to deliver exceptional results for every project.',
    columns: 4,
    items: [
      { id: 'p1', icon: '01', title: 'Discovery', description: 'We understand your business goals, challenges, and requirements through in-depth consultation.' },
      { id: 'p2', icon: '02', title: 'Planning', description: 'Our team creates a detailed roadmap with timelines, milestones, and deliverables.' },
      { id: 'p3', icon: '03', title: 'Development', description: 'We build your solution using agile methodologies with regular updates and feedback loops.' },
      { id: 'p4', icon: '04', title: 'Delivery', description: 'We deploy, test, and ensure your solution performs flawlessly in production.' },
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'temp-cta',
    type: 'cta-banner',
    order: 4,
    title: 'Ready to Transform Your Business?',
    description: 'Let\'s discuss your project and find the perfect solution for your needs. Our team is ready to help you achieve your goals.',
    buttonText: 'Start Your Project',
    buttonLink: '/contact',
    secondaryButtonText: 'Join Our Team',
    secondaryButtonLink: '/careers',
    backgroundColor: 'dark'
  }
];

const AdminServicesPageBlocks = () => {
  return (
    <AdminPageBlocks
      pageKey="services"
      pageTitle="Services Page"
      pageDescription="Manage the Services page content using the block system"
      defaultBlocks={defaultServicesBlocks}
    />
  );
};

export default AdminServicesPageBlocks;
