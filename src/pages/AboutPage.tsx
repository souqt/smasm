import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import { ContentBlock } from "@/data/types";
import aboutHeroImg from "@/assets/about-hero.jpg";
import aboutStoryImg from "@/assets/about-story.jpg";
import aboutEgyptImg from "@/assets/about-egypt.jpg";
import aboutTeamImg from "@/assets/about-team-photo.jpg";

// Professional About Us blocks
const defaultAboutBlocks: ContentBlock[] = [
  {
    id: 'about-hero',
    type: 'hero-image',
    order: 1,
    title: 'About Us',
    subtitle: 'Who We Are',
    description: 'We are a European-Egyptian tech enablement company helping businesses build reliable offshore development teams through clear processes, strong operational support, and a transparent partnership model.',
    buttonText: 'Talk to Us',
    buttonLink: '/contact',
    image: aboutHeroImg,
    backgroundColor: 'dark'
  },
  {
    id: 'about-whoweare',
    type: 'icon-grid',
    order: 2,
    title: 'What Defines Us',
    subtitle: 'Our founding team brings together deep experience across multiple domains',
    columns: 4,
    items: [
      { id: 'def1', icon: 'Code2', title: 'Software Engineering', description: 'Deep technical expertise in modern architectures, cloud, and scalable solutions.' },
      { id: 'def2', icon: 'BarChart3', title: 'Business Consulting', description: 'Strategic advisory to align technology investments with business outcomes.' },
      { id: 'def3', icon: 'Users', title: 'People Operations', description: 'Building and retaining high-performing engineering teams across borders.' },
      { id: 'def4', icon: 'Rocket', title: 'Delivery Management', description: 'Ensuring projects are delivered on time, on budget, and at quality.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'about-story',
    type: 'image-text',
    order: 3,
    title: 'Our Story',
    subtitle: 'How It Started',
    description: '<p>Oversea Solutions was created to solve a common challenge faced by European companies: finding strong developers locally is slow, expensive, and highly competitive.</p><p>At the same time, Egypt has become a powerhouse of engineering talent — but many companies struggle with legal, operational, or cultural barriers when hiring offshore.</p><p>We built a model that removes those barriers through:</p><ul><li>Clear, structured engagement processes</li><li>Reliable operations and support</li><li>Dutch legal presence for trust and compliance</li><li>Transparent communication</li><li>A long-term partnership mindset</li></ul><p><em>Our vision is simple: Offshoring should feel as straightforward and dependable as local hiring — just more flexible.</em></p>',
    image: aboutStoryImg,
    backgroundColor: 'muted'
  },
  {
    id: 'about-timeline',
    type: 'timeline',
    order: 4,
    title: 'Our Journey',
    subtitle: 'The path that led us to bridge Europe and Egypt',
    items: [
      { id: 'tl1', title: 'Problem in Europe', description: 'European companies face rising costs and talent scarcity in local markets, making it difficult to scale engineering teams quickly and effectively.', icon: 'Search', date: 'Step 1' },
      { id: 'tl2', title: "Rise of Egypt's Talent", description: "Egypt emerges as a powerhouse of engineering talent with 240,000+ STEM graduates annually and global R&D centers from Microsoft, Vodafone, and Valeo.", icon: 'Globe', date: 'Step 2' },
      { id: 'tl3', title: 'Cross-border Barriers', description: 'Companies struggle with legal, operational, and cultural barriers when hiring offshore talent from Egypt, limiting the potential of this partnership.', icon: 'Shield', date: 'Step 3' },
      { id: 'tl4', title: "Oversea Solutions' Model", description: 'We built a transparent model with Dutch legal presence that removes all barriers, offering trust, speed, quality, and reliability.', icon: 'Layers', date: 'Step 4' },
      { id: 'tl5', title: 'The Vision Realized', description: 'Offshoring now feels as straightforward and dependable as local hiring — just more flexible and cost-effective.', icon: 'Target', date: 'Step 5' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'about-whyegypt',
    type: 'text-image',
    order: 5,
    title: 'Why Egypt & Europe Work Together',
    subtitle: 'A Powerful Combination',
    description: '<p>Our model is built on the strengths of both regions: the stability and trust of the Netherlands, paired with the depth and capability of the engineering ecosystem in Egypt.</p><p>Egypt has become a preferred destination for global tech due to:</p><ul><li>Massive talent pool (240,000+ STEM graduates annually)</li><li>Global R&D centers (Microsoft, Vodafone, Valeo, etc.)</li><li>Excellent English & strong communication</li><li>Minimal Europe time zone difference</li><li>Proven cost to quality advantage</li></ul><p>With operations in Egypt + Dutch legal presence, we offer <strong>trust, speed, quality, and reliability</strong>.</p>',
    image: aboutEgyptImg,
    backgroundColor: 'default'
  },
  {
    id: 'about-stats',
    type: 'stats-bar',
    order: 6,
    title: 'Egypt by the Numbers',
    items: [
      { id: 'as1', value: '240K+', label: 'STEM Graduates Annually', icon: 'GraduationCap' },
      { id: 'as2', value: '10+', label: 'Global R&D Hubs', icon: 'Building2' },
      { id: 'as3', value: '1-2h', label: 'Time Zone Difference', icon: 'Clock' },
      { id: 'as4', value: '50%+', label: 'Cost Advantage', icon: 'Euro' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'about-team-intro',
    type: 'image-text',
    order: 7,
    title: 'Our Team',
    subtitle: 'Meet the Founders',
    description: '<p>We are a team of four founders with complementary strengths, creating a predictable, high-performing environment for both clients and developers.</p><p>Our combined expertise spans across business strategy, technology leadership, operations management, and people operations — giving us the full perspective needed to build successful offshore partnerships.</p>',
    image: aboutTeamImg,
    backgroundColor: 'muted'
  },
  {
    id: 'about-team',
    type: 'team-grid',
    order: 8,
    title: 'Leadership Team',
    subtitle: 'Four founders, one mission — connecting great companies with great talent',
    columns: 4,
    items: [
      { id: 'tm1', name: 'Founder', role: 'Business Strategy & Advisory', bio: 'Deep expertise in business consulting, strategic growth, and client relationships.', image: '' },
      { id: 'tm2', name: 'Founder', role: 'Technology Leadership & Architecture', bio: 'Leading technical vision, architecture decisions, and engineering excellence.', image: '' },
      { id: 'tm3', name: 'Founder', role: 'Operations & Delivery Management', bio: 'Ensuring smooth operations, on-time delivery, and process optimization.', image: '' },
      { id: 'tm4', name: 'Founder', role: 'People Operations & HR', bio: 'Building, retaining, and developing top-tier engineering teams.', image: '' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'about-approach',
    type: 'cards-grid',
    order: 9,
    title: 'Our Approach',
    subtitle: 'We believe in partnership, not traditional outsourcing',
    columns: 3,
    items: [
      { id: 'ap1', icon: 'Target', title: 'Clear Expectations', description: 'We set clear expectations from day one with structured goals and transparent milestones.' },
      { id: 'ap2', icon: 'RefreshCw', title: 'Structured Onboarding', description: 'Our onboarding process integrates developers seamlessly into your workflow and culture.' },
      { id: 'ap3', icon: 'MessageSquare', title: 'Transparent Communication', description: 'Regular updates, open channels, and honest feedback at every stage of engagement.' },
      { id: 'ap4', icon: 'Settings', title: 'Strong Operations', description: 'A robust operational backbone ensures consistency, reliability, and scalability.' },
      { id: 'ap5', icon: 'Handshake', title: 'Long-term Retention', description: 'We invest in team stability and developer satisfaction for lasting partnerships.' },
      { id: 'ap6', icon: 'Globe', title: 'Europe-Egypt Balance', description: 'Dutch legal presence combined with Egyptian engineering excellence for the best of both.' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'about-whywork',
    type: 'features-list',
    order: 10,
    title: 'Why European Companies Work With Us',
    subtitle: 'Six reasons our clients choose Oversea Solutions',
    items: [
      { id: 'ww1', icon: 'Landmark', title: 'Dutch Legal Presence', description: 'Full compliance and trust through our Netherlands-based legal entity and contracts.' },
      { id: 'ww2', icon: 'Award', title: 'Top Technical Talent', description: 'Access to rigorously vetted, senior-level developers with proven track records.' },
      { id: 'ww3', icon: 'Search', title: 'Transparent Processes', description: 'Complete visibility into hiring, onboarding, and ongoing team management.' },
      { id: 'ww4', icon: 'Handshake', title: 'Cultural Compatibility', description: 'Egyptian developers are known for strong work ethic and excellent communication with European teams.' },
      { id: 'ww5', icon: 'Gem', title: 'Communication & Stability', description: 'Reliable, consistent communication with dedicated account management and support.' },
      { id: 'ww6', icon: 'TrendingUp', title: 'Cost-Effective Scalability', description: 'Scale your team up or down flexibly while maintaining quality and reducing overhead costs.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'about-commitment',
    type: 'checklist',
    order: 11,
    title: 'Our Commitment',
    subtitle: 'What we deliver to every client and every developer',
    columns: 2,
    items: [
      { id: 'cm1', icon: 'CheckCircle2', title: 'High-quality engineering talent', description: 'Rigorously vetted, experienced developers who exceed expectations.' },
      { id: 'cm2', icon: 'CheckCircle2', title: 'Smooth collaboration', description: 'Seamless integration into your existing workflows and tools.' },
      { id: 'cm3', icon: 'CheckCircle2', title: 'Stable developer environment', description: 'We invest in developer well-being for long-term team stability.' },
      { id: 'cm4', icon: 'CheckCircle2', title: 'Predictable delivery', description: 'Reliable timelines and consistent output quality.' },
      { id: 'cm5', icon: 'CheckCircle2', title: 'Transparent operations', description: 'Full visibility into processes, performance, and progress.' },
      { id: 'cm6', icon: 'CheckCircle2', title: 'Long-term partnership', description: 'We build relationships, not just teams — growing together with our clients.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'about-cta',
    type: 'cta-banner',
    order: 12,
    title: 'Work With Us',
    description: "Whether you're scaling your team or exploring offshore options, we guide you toward the best-fit model. Let's start a conversation.",
    buttonText: 'Talk to Us',
    buttonLink: '/contact',
    secondaryButtonText: 'View Our Services',
    secondaryButtonLink: '/services',
    backgroundColor: 'dark'
  }
];

const AboutPage = () => {
  const { getPageBlocks } = useData();
  const blocks = getPageBlocks('about');

  // Use saved blocks or defaults
  const displayBlocks = blocks.length > 0 ? blocks : defaultAboutBlocks;

  return (
    <div className="min-h-screen">
      <Navbar />
      <BlockRenderer blocks={displayBlocks} />
      <Footer />
    </div>
  );
};

export default AboutPage;
