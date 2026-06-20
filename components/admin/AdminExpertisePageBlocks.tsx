import AdminPageBlocks from "./AdminPageBlocks";
import { ContentBlock } from "@/data/types";

// Default blocks matching the current ExpertisePage structure
const defaultExpertiseBlocks: ContentBlock[] = [
  {
    id: 'temp-hero',
    type: 'hero-image',
    order: 1,
    title: 'Platform Expertise',
    subtitle: 'Our Expertise',
    description: 'Our team masters the latest technologies and frameworks to deliver cutting-edge solutions. We stay ahead of trends to ensure your project leverages the most effective tools available.',
    buttonText: 'Start Your Project',
    buttonLink: '/contact',
    backgroundColor: 'dark'
  },
  {
    id: 'temp-stats',
    type: 'stats-bar',
    order: 2,
    title: '',
    items: [
      { id: 's1', value: '200+', label: 'Projects Delivered' },
      { id: 's2', value: '50+', label: 'Happy Clients' },
      { id: 's3', value: '99%', label: 'Client Satisfaction' },
      { id: 's4', value: '24/7', label: 'Support' },
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'temp-whychoose',
    type: 'image-text',
    order: 3,
    title: 'What Sets Us Apart',
    subtitle: 'Why Choose Us',
    description: 'We combine technical excellence with deep industry knowledge to deliver solutions that drive real business value.',
    buttonText: 'Learn More',
    buttonLink: '/contact',
    backgroundColor: 'default'
  },
  {
    id: 'temp-features',
    type: 'features-list',
    order: 4,
    title: 'Our Strengths',
    items: [
      { id: 'f1', icon: '🎯', title: 'Results-Driven Approach', description: 'We focus on delivering measurable outcomes that align with your business goals.' },
      { id: 'f2', icon: '👥', title: 'Expert Team', description: 'Our developers are in the top 3% of global talent, rigorously vetted for excellence.' },
      { id: 'f3', icon: '✨', title: 'Innovation First', description: 'We leverage cutting-edge technologies to build future-proof solutions.' },
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'temp-cta',
    type: 'cta-banner',
    order: 5,
    title: 'Ready to Build Something Amazing?',
    description: 'Let\'s discuss how we can help you leverage our expertise to achieve your goals.',
    buttonText: 'Start Your Project',
    buttonLink: '/contact',
    secondaryButtonText: 'View Our Services',
    secondaryButtonLink: '/services',
    backgroundColor: 'default'
  }
];

const AdminExpertisePageBlocks = () => {
  return (
    <AdminPageBlocks
      pageKey="expertise"
      pageTitle="Expertise Page"
      pageDescription="Manage the Expertise page content using the block system"
      defaultBlocks={defaultExpertiseBlocks}
    />
  );
};

export default AdminExpertisePageBlocks;
