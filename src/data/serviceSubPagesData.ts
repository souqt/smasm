import { ContentBlock } from "@/data/types";
import dedicatedHeroImg from "@/assets/service-dedicated-dev-hero.jpg";
import dedicatedIntegrationImg from "@/assets/service-dedicated-dev-integration.jpg";
import teamAugHeroImg from "@/assets/service-team-aug-hero.jpg";
import teamAugScalingImg from "@/assets/service-team-aug-scaling.jpg";
import projectHeroImg from "@/assets/service-project-hero.jpg";
import projectDeliveryImg from "@/assets/service-project-delivery.jpg";
import managedHeroImg from "@/assets/service-managed-hero.jpg";
import managedOwnershipImg from "@/assets/service-managed-ownership.jpg";
import infraHeroImg from "@/assets/service-infra-hero.jpg";
import infraSecurityImg from "@/assets/service-infra-security.jpg";

// ========== DEDICATED DEVELOPERS ==========
export const dedicatedDevelopersBlocks: ContentBlock[] = [
  {
    id: 'dd-hero', type: 'hero-image', order: 1,
    title: 'Dedicated Developers',
    subtitle: 'Long-Term Integration',
    description: 'Build a dedicated development team that works as a true extension of your in-house team — without the cost, delays, and complexity of local hiring.',
    buttonText: 'Talk to Us', buttonLink: '/contact',
    image: dedicatedHeroImg, backgroundColor: 'dark'
  },
  {
    id: 'dd-intro', type: 'rich-text', order: 2,
    title: 'Your Extended Engineering Team',
    content: '<p>Our Dedicated Developers model is designed for companies that need long-term development capacity, continuity, and full control over how work gets done. We provide talented engineers who become a seamless part of your organization.</p>',
    backgroundColor: 'default'
  },
  {
    id: 'dd-what', type: 'text-image', order: 3,
    title: 'What Dedicated Developers Means',
    subtitle: 'Full Integration',
    description: '<p>With this model, developers work exclusively on your product and integrate fully into your existing team structure.</p><p>They:</p><ul><li>Follow your processes and priorities</li><li>Use your tools and workflows</li><li>Collaborate directly with your engineers, product managers, and stakeholders</li></ul><p>You manage the work. We handle everything around the people.</p>',
    image: dedicatedIntegrationImg,
    backgroundColor: 'default'
  },
  {
    id: 'dd-stats', type: 'stats-bar', order: 4,
    title: 'Our Track Record',
    items: [
      { id: 'ds1', value: '200+', label: 'Dedicated Developers Deployed' },
      { id: 'ds2', value: '95%', label: 'Client Retention Rate' },
      { id: 'ds3', value: '48hrs', label: 'Average Onboarding Time' },
      { id: 'ds4', value: '30+', label: 'Countries Served' }
    ],
    backgroundColor: 'primary'
  },
  {
    id: 'dd-fit', type: 'icon-grid', order: 5,
    title: 'When This Model Is a Good Fit',
    subtitle: 'Dedicated Developers is a strong fit when:',
    columns: 4,
    items: [
      { id: 'df1', icon: 'Target', title: 'Ongoing Product Roadmap', description: 'You have continuous development needs aligned with your vision.' },
      { id: 'df2', icon: 'Clock', title: 'Long-Term Capacity', description: 'You need consistent, sustained delivery over months or years.' },
      { id: 'df3', icon: 'Users', title: 'Team Integration', description: 'You want developers to feel like part of your internal team.' },
      { id: 'df4', icon: 'MessageSquare', title: 'Full Technical Control', description: 'You prefer direct communication and leadership over development.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'dd-how', type: 'timeline', order: 6,
    title: 'How It Works',
    subtitle: 'Our process is designed to be simple, transparent, and collaborative',
    items: [
      { id: 'dh1', title: 'Understanding Your Needs', description: 'We align on technical requirements, team setup, and expectations.', icon: 'Search', date: 'Step 1' },
      { id: 'dh2', title: 'Developer Selection', description: 'We identify and propose developers that match your required skills and experience.', icon: 'Users', date: 'Step 2' },
      { id: 'dh3', title: 'Interview & Approval', description: 'You interview the developers and make the final selection.', icon: 'CheckCircle2', date: 'Step 3' },
      { id: 'dh4', title: 'Onboarding & Integration', description: 'Developers are onboarded into your tools, processes, and team routines.', icon: 'Rocket', date: 'Step 4' },
      { id: 'dh5', title: 'Ongoing Support', description: 'We support performance, retention, and continuity while you focus on delivery.', icon: 'Heart', date: 'Step 5' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'dd-process', type: 'numbered-steps', order: 7,
    title: 'Our Process',
    subtitle: 'We follow a proven methodology to deliver exceptional results',
    items: [
      { id: 'dp1', icon: 'Search', title: 'Discovery', description: 'We understand your business goals, challenges, and requirements through in-depth consultation.' },
      { id: 'dp2', icon: 'Layers', title: 'Planning', description: 'Our team creates a detailed roadmap with timelines, milestones, and deliverables.' },
      { id: 'dp3', icon: 'Code2', title: 'Development', description: 'We build your solution using agile methodologies with regular updates and feedback loops.' },
      { id: 'dp4', icon: 'Rocket', title: 'Delivery', description: 'We deploy, test, and ensure your solution performs flawlessly in production.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'dd-get', type: 'features-list', order: 8,
    title: 'What You Get',
    subtitle: 'With Dedicated Developers, you receive:',
    items: [
      { id: 'dg1', icon: 'Users', title: 'Developers fully dedicated to your product', description: 'Exclusive focus on your roadmap and goals.' },
      { id: 'dg2', icon: 'Shield', title: 'Long-term continuity and knowledge retention', description: 'Team stability that preserves institutional knowledge.' },
      { id: 'dg3', icon: 'MessageSquare', title: 'Direct communication and collaboration', description: 'Open channels with your team, no middlemen.' },
      { id: 'dg4', icon: 'RefreshCw', title: 'Flexible scaling as your needs evolve', description: 'Scale up or down without long-term commitments.' },
      { id: 'dg5', icon: 'Settings', title: 'Recruitment, HR, and operations handled by us', description: 'Focus on building — we handle the rest.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'dd-flex', type: 'image-text', order: 9,
    title: 'Engagement & Flexibility',
    subtitle: 'Adaptable Partnerships',
    description: '<p>Dedicated Developer engagements are designed to adapt as your business grows.</p><p>You can:</p><ul><li>Scale the team up or down</li><li>Adjust roles and skill sets</li><li>Transition into other engagement models as your needs change</li></ul><p>This flexibility ensures long-term alignment as your business evolves.</p>',
    image: dedicatedIntegrationImg,
    backgroundColor: 'default'
  },
  {
    id: 'dd-diff', type: 'cards-grid', order: 10,
    title: 'How This Differs From Other Models',
    subtitle: 'Choose the right engagement model for your needs',
    columns: 3,
    items: [
      { id: 'dc1', icon: 'Users2', title: 'vs Team Augmentation', description: 'Dedicated Developers focus on long-term continuity rather than short-term capacity. This clarity ensures transparency.' },
      { id: 'dc2', icon: 'Briefcase', title: 'vs Project-Based Development', description: 'You retain full control over priorities, timelines, and delivery — we provide the team, not the management.' },
      { id: 'dc3', icon: 'Settings', title: 'vs Managed Services', description: 'You manage the work directly; we do not take ownership of delivery outcomes. You lead, we support.' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'dd-cta', type: 'cta-banner', order: 11,
    title: "Let's Build Your Dedicated Team",
    description: "If you're looking for a reliable, long-term way to scale your development capacity, Dedicated Developers may be the right fit.",
    buttonText: 'Talk to Us', buttonLink: '/contact',
    secondaryButtonText: 'View All Services', secondaryButtonLink: '/services',
    backgroundColor: 'dark'
  }
];

// ========== TEAM AUGMENTATION ==========
export const teamAugmentationBlocks: ContentBlock[] = [
  {
    id: 'ta-hero', type: 'hero-image', order: 1,
    title: 'Team Augmentation',
    subtitle: 'Scale Quickly',
    description: 'Team Augmentation allows you to extend your existing development team with skilled engineers — without the delays, risks, and long-term commitments of local hiring.',
    buttonText: 'Talk to Us', buttonLink: '/contact',
    image: teamAugHeroImg, backgroundColor: 'dark'
  },
  {
    id: 'ta-what', type: 'image-text', order: 2,
    title: 'What Team Augmentation Means',
    subtitle: 'Flexible Scaling',
    description: '<p>With Team Augmentation, engineers join your existing team to support your current roadmap and priorities.</p><p>They:</p><ul><li>Work under your technical leadership</li><li>Follow your processes and workflows</li><li>Collaborate directly with your internal team</li></ul><p>You stay in control of planning and delivery. We ensure you get the right people, quickly and reliably.</p>',
    image: teamAugScalingImg,
    backgroundColor: 'default'
  },
  {
    id: 'ta-stats', type: 'stats-bar', order: 3,
    title: 'Speed & Impact',
    items: [
      { id: 'ts1', value: '72hrs', label: 'Average Time to Match' },
      { id: 'ts2', value: '150+', label: 'Engineers Available' },
      { id: 'ts3', value: '40+', label: 'Technologies Covered' },
      { id: 'ts4', value: '98%', label: 'Client Satisfaction' }
    ],
    backgroundColor: 'primary'
  },
  {
    id: 'ta-fit', type: 'checklist', order: 4,
    title: 'When This Model Is a Good Fit',
    subtitle: 'Team Augmentation works best when:',
    columns: 2,
    items: [
      { id: 'tf1', icon: 'Zap', title: 'You need to scale your team quickly', description: 'Fast access to skilled engineers without lengthy hiring.' },
      { id: 'tf2', icon: 'Clock', title: 'Short- to mid-term capacity needs', description: 'Flexible duration engagements that adapt to your timeline.' },
      { id: 'tf3', icon: 'Code2', title: 'You need specific technical skills', description: 'Targeted expertise for your specific tech stack.' },
      { id: 'tf4', icon: 'RefreshCw', title: 'Flexibility without long-term commitments', description: 'No permanent hiring overhead or obligations.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'ta-how', type: 'timeline', order: 5,
    title: 'How It Works',
    subtitle: 'Our Team Augmentation process is designed to be fast and lightweight',
    items: [
      { id: 'th1', title: 'Define Your Requirements', description: 'We align on skills, experience level, and expected duration.', icon: 'FileCheck', date: 'Step 1' },
      { id: 'th2', title: 'Candidate Selection', description: 'We propose engineers that match your needs.', icon: 'Search', date: 'Step 2' },
      { id: 'th3', title: 'Interview & Approval', description: 'You interview candidates and make the final decision.', icon: 'CheckCircle2', date: 'Step 3' },
      { id: 'th4', title: 'Onboarding & Start', description: 'Engineers join your team and start contributing quickly.', icon: 'Rocket', date: 'Step 4' },
      { id: 'th5', title: 'Ongoing Support', description: 'We handle HR, performance follow-up, and continuity.', icon: 'Heart', date: 'Step 5' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'ta-process', type: 'numbered-steps', order: 6,
    title: 'Our Process',
    subtitle: 'We follow a proven methodology to deliver exceptional results',
    items: [
      { id: 'tp1', icon: 'Search', title: 'Discovery', description: 'We understand your business goals, challenges, and requirements through in-depth consultation.' },
      { id: 'tp2', icon: 'Layers', title: 'Planning', description: 'Our team creates a detailed roadmap with timelines, milestones, and deliverables.' },
      { id: 'tp3', icon: 'Code2', title: 'Development', description: 'We build your solution using agile methodologies with regular updates and feedback loops.' },
      { id: 'tp4', icon: 'Rocket', title: 'Delivery', description: 'We deploy, test, and ensure your solution performs flawlessly in production.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'ta-get', type: 'features-list', order: 7,
    title: 'What You Get',
    subtitle: 'With Team Augmentation, you receive:',
    items: [
      { id: 'tg1', icon: 'Zap', title: 'Fast access to skilled engineers', description: 'Quick ramp-up without lengthy hiring cycles.' },
      { id: 'tg2', icon: 'RefreshCw', title: 'Flexible scaling up or down', description: 'Adapt team size to your current needs.' },
      { id: 'tg3', icon: 'MessageSquare', title: 'Direct communication with your team', description: 'Seamless collaboration with no barriers.' },
      { id: 'tg4', icon: 'Lightbulb', title: 'Minimal onboarding overhead', description: 'Engineers integrate quickly into your workflow.' },
      { id: 'tg5', icon: 'Settings', title: 'Recruitment, HR, and operational support', description: 'We handle the administrative complexity.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'ta-engage', type: 'text-image', order: 8,
    title: 'Engagement & Flexibility',
    subtitle: 'Adaptable by Design',
    description: '<p>Team Augmentation engagements are designed to be adaptable. You can:</p><ul><li>Adjust team size as priorities change</li><li>Extend or shorten engagements</li><li>Transition into other models, such as Dedicated Developers or Project-Based Development</li></ul><p>This flexibility allows you to respond quickly to changing business needs.</p>',
    image: teamAugScalingImg,
    backgroundColor: 'default'
  },
  {
    id: 'ta-diff', type: 'cards-grid', order: 9,
    title: 'How This Differs From Other Models',
    subtitle: 'Understanding the right fit for your situation',
    columns: 3,
    items: [
      { id: 'tdc1', icon: 'Users', title: 'vs Dedicated Developers', description: 'Team Augmentation is typically shorter-term and focused on capacity rather than long-term continuity.' },
      { id: 'tdc2', icon: 'Briefcase', title: 'vs Project-Based Development', description: 'You retain full ownership of scope, priorities, and delivery.' },
      { id: 'tdc3', icon: 'Settings', title: 'vs Managed Services', description: 'Delivery ownership remains fully with your team.' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'ta-cta', type: 'cta-banner', order: 10,
    title: "Let's Strengthen Your Team",
    description: "If you need to scale your development team quickly and flexibly, Team Augmentation may be the right approach.",
    buttonText: 'Talk to Us', buttonLink: '/contact',
    secondaryButtonText: 'View All Services', secondaryButtonLink: '/services',
    backgroundColor: 'dark'
  }
];

// ========== PROJECT-BASED DEVELOPMENT ==========
export const projectBasedBlocks: ContentBlock[] = [
  {
    id: 'pb-hero', type: 'hero-image', order: 1,
    title: 'Project-Based Development',
    subtitle: 'End-to-End Delivery',
    description: 'Our Project-Based Development model is designed for companies that need a complete, end-to-end delivery of a defined scope or initiative. We take responsibility for execution, provide the right team, and deliver according to agreed milestones and timelines.',
    buttonText: 'Talk to Us', buttonLink: '/contact',
    image: projectHeroImg, backgroundColor: 'dark'
  },
  {
    id: 'pb-intro', type: 'rich-text', order: 2,
    title: 'Structured Delivery, Predictable Results',
    content: '<p>This model is ideal for building new features, MVPs, platforms, or standalone projects that require structured delivery. You provide the business goals and requirements — we handle execution from start to finish.</p>',
    backgroundColor: 'default'
  },
  {
    id: 'pb-what', type: 'image-text', order: 3,
    title: 'What Project-Based Development Means',
    subtitle: 'Complete Delivery',
    description: '<p>With this model, we deliver an entire project from planning to release.</p><p>We take care of:</p><ul><li>Planning & scoping</li><li>Technical execution</li><li>Milestones and timelines</li><li>Delivery and handover</li></ul><p>You stay focused on the product vision while we manage the development cycle.</p>',
    image: projectDeliveryImg,
    backgroundColor: 'default'
  },
  {
    id: 'pb-stats', type: 'stats-bar', order: 4,
    title: 'Delivery Excellence',
    items: [
      { id: 'ps1', value: '100+', label: 'Projects Delivered' },
      { id: 'ps2', value: '97%', label: 'On-Time Delivery' },
      { id: 'ps3', value: '50+', label: 'Happy Clients' },
      { id: 'ps4', value: '15+', label: 'Industries Served' }
    ],
    backgroundColor: 'primary'
  },
  {
    id: 'pb-fit', type: 'icon-grid', order: 5,
    title: 'When This Model Is a Good Fit',
    subtitle: 'Project-Based Development is a strong fit when:',
    columns: 3,
    items: [
      { id: 'pf1', icon: 'Target', title: 'Clearly Defined Scope', description: 'You have well-defined requirements and clear outcomes.' },
      { id: 'pf2', icon: 'Calendar', title: 'Predictable Timelines', description: 'You need structured delivery with clear milestones.' },
      { id: 'pf3', icon: 'Users2', title: 'No Internal Capacity', description: "You don't have the team to manage end-to-end engineering." },
      { id: 'pf4', icon: 'Rocket', title: 'MVP Delivery', description: 'You need an MVP or new feature delivered efficiently.' },
      { id: 'pf5', icon: 'Handshake', title: 'Execution Partner', description: 'You want a trusted partner to handle engineering execution.' },
      { id: 'pf6', icon: 'Lightbulb', title: 'New Product Initiative', description: 'You have a new idea that needs professional engineering.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'pb-how', type: 'timeline', order: 6,
    title: 'How It Works',
    subtitle: 'Our project approach is structured and transparent',
    items: [
      { id: 'ph1', title: 'Initial Discovery', description: 'We discuss your requirements, goals, constraints, and timelines.', icon: 'Search', date: 'Step 1' },
      { id: 'ph2', title: 'Scope Definition', description: 'We define deliverables, milestones, and responsibilities.', icon: 'FileCheck', date: 'Step 2' },
      { id: 'ph3', title: 'Team Allocation', description: 'We assemble the right developers and technical leads for your project.', icon: 'Users', date: 'Step 3' },
      { id: 'ph4', title: 'Execution & Milestone Delivery', description: 'We deliver according to the agreed plan, with regular communication and progress updates.', icon: 'Code2', date: 'Step 4' },
      { id: 'ph5', title: 'Review & Handover', description: 'Upon completion, we hand over code, documentation, and deployment instructions.', icon: 'CheckCircle2', date: 'Step 5' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'pb-process', type: 'numbered-steps', order: 7,
    title: 'Our Process',
    subtitle: 'We follow a proven methodology to deliver exceptional results',
    items: [
      { id: 'pp1', icon: 'Search', title: 'Discovery', description: 'We understand your business goals, challenges, and requirements through in-depth consultation.' },
      { id: 'pp2', icon: 'Layers', title: 'Planning', description: 'Our team creates a detailed roadmap with timelines, milestones, and deliverables.' },
      { id: 'pp3', icon: 'Code2', title: 'Development', description: 'We build your solution using agile methodologies with regular updates and feedback loops.' },
      { id: 'pp4', icon: 'Rocket', title: 'Delivery', description: 'We deploy, test, and ensure your solution performs flawlessly in production.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'pb-get', type: 'features-list', order: 8,
    title: 'What You Get',
    subtitle: 'Project-Based Development provides:',
    items: [
      { id: 'pg1', icon: 'Users', title: 'A complete, end-to-end delivery team', description: 'Experienced engineers, leads, and support roles.' },
      { id: 'pg2', icon: 'Target', title: 'Defined scope, clear milestones', description: 'Predictable timelines and structured delivery.' },
      { id: 'pg3', icon: 'MessageSquare', title: 'Structured communication and updates', description: 'Regular progress reports and open feedback.' },
      { id: 'pg4', icon: 'Briefcase', title: 'Delivery-focused engineering leadership', description: 'Technical leads who own execution quality.' },
      { id: 'pg5', icon: 'FileCheck', title: 'Full documentation, testing, and handover', description: 'Production-ready output with complete documentation.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'pb-engage', type: 'text-image', order: 9,
    title: 'Engagement & Flexibility',
    subtitle: 'Evolving with Your Needs',
    description: '<p>Projects are delivered under a clear agreement outlining scope, timelines, roles, and communication frequency.</p><p>If your needs evolve, we can:</p><ul><li>Adjust scope collaboratively</li><li>Extend the team for faster delivery</li><li>Transition into ongoing development or Managed Services</li></ul><p>We adapt to the level of support your project requires.</p>',
    image: projectDeliveryImg,
    backgroundColor: 'default'
  },
  {
    id: 'pb-diff', type: 'cards-grid', order: 10,
    title: 'How This Differs From Other Models',
    subtitle: 'This ensures you choose the model that fits your goals',
    columns: 3,
    items: [
      { id: 'pdc1', icon: 'Users2', title: 'vs Team Augmentation', description: 'Project-Based gives you full delivery ownership from our side, not extra hands for your team.' },
      { id: 'pdc2', icon: 'Users', title: 'vs Dedicated Developers', description: 'This model is based on defined outcomes, not long-term integration.' },
      { id: 'pdc3', icon: 'Settings', title: 'vs Managed Services', description: 'Projects are fixed-scope and time-bound, whereas Managed Services supports ongoing work.' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'pb-cta', type: 'cta-banner', order: 11,
    title: "Let's Build Your Next Project",
    description: "If you have a defined scope or a new product initiative, our Project-Based Development model enables fast, structured, and predictable delivery.",
    buttonText: 'Talk to Us', buttonLink: '/contact',
    secondaryButtonText: 'View All Services', secondaryButtonLink: '/services',
    backgroundColor: 'dark'
  }
];

// ========== MANAGED SERVICES ==========
export const managedServicesBlocks: ContentBlock[] = [
  {
    id: 'ms-hero', type: 'hero-image', order: 1,
    title: 'Managed Services',
    subtitle: 'Ongoing Delivery',
    description: 'Our Managed Services model is designed for companies that want predictable, ongoing development without the overhead of managing day-to-day engineering tasks internally.',
    buttonText: 'Talk to Us', buttonLink: '/contact',
    image: managedHeroImg, backgroundColor: 'dark'
  },
  {
    id: 'ms-what', type: 'text-image', order: 2,
    title: 'What Managed Services Means',
    subtitle: 'Outcome-Driven',
    description: '<p>Managed Services is an outcome-driven engagement model where we handle end-to-end engineering delivery.</p><p>We take responsibility for:</p><ul><li>Planning and task allocation</li><li>Development and execution</li><li>Delivery quality</li><li>Reporting and visibility</li><li>Continuity and stability</li></ul><p>You define priorities and business objectives. We ensure delivery happens consistently and predictably.</p>',
    image: managedOwnershipImg,
    backgroundColor: 'default'
  },
  {
    id: 'ms-stats', type: 'stats-bar', order: 3,
    title: 'Managed Excellence',
    items: [
      { id: 'mst1', value: '99.5%', label: 'SLA Compliance' },
      { id: 'mst2', value: '60+', label: 'Active Managed Engagements' },
      { id: 'mst3', value: '24/7', label: 'Support Coverage' },
      { id: 'mst4', value: '35%', label: 'Average Cost Savings' }
    ],
    backgroundColor: 'primary'
  },
  {
    id: 'ms-fit', type: 'icon-grid', order: 4,
    title: 'When This Model Is a Good Fit',
    subtitle: 'Managed Services is ideal when:',
    columns: 3,
    items: [
      { id: 'mf1', icon: 'Settings', title: 'Reduce Management Burden', description: 'You want to focus on strategy, not managing individual engineers.' },
      { id: 'mf2', icon: 'BarChart3', title: 'Predictable Output', description: 'You need consistent, structured delivery cycles with clear metrics.' },
      { id: 'mf3', icon: 'Handshake', title: 'Execution Partner', description: 'You prefer a partner to handle the full delivery process.' },
      { id: 'mf4', icon: 'Target', title: 'Clear Roadmap', description: 'Your roadmap is clear, but you lack internal delivery capacity.' },
      { id: 'mf5', icon: 'FileCheck', title: 'Structured Reporting', description: 'You want transparent metrics, accountability, and performance tracking.' },
      { id: 'mf6', icon: 'Shield', title: 'Long-Term Stability', description: 'You need continuity and reliability for ongoing development.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'ms-how', type: 'timeline', order: 5,
    title: 'How It Works',
    subtitle: 'Our approach provides clarity, structure, and accountability',
    items: [
      { id: 'mh1', title: 'Define Goals & Priorities', description: 'We align on business needs, scope expectations, and performance criteria.', icon: 'Target', date: 'Step 1' },
      { id: 'mh2', title: 'Assemble the Delivery Team', description: 'We form the right combination of engineers, leads, and supporting roles.', icon: 'Users', date: 'Step 2' },
      { id: 'mh3', title: 'Set Processes & Communication', description: 'We establish reporting cycles, communication flow, and delivery checkpoints.', icon: 'MessageSquare', date: 'Step 3' },
      { id: 'mh4', title: 'Execution & Iteration', description: 'We deliver continuously based on your priorities, with structured updates and quality control.', icon: 'Code2', date: 'Step 4' },
      { id: 'mh5', title: 'Review & Optimization', description: 'We evaluate performance, adjust capacity, and evolve the setup as your needs change.', icon: 'RefreshCw', date: 'Step 5' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'ms-process', type: 'numbered-steps', order: 6,
    title: 'Our Process',
    subtitle: 'We follow a proven methodology to deliver exceptional results',
    items: [
      { id: 'mp1', icon: 'Search', title: 'Discovery', description: 'We understand your business goals, challenges, and requirements through in-depth consultation.' },
      { id: 'mp2', icon: 'Layers', title: 'Planning', description: 'Our team creates a detailed roadmap with timelines, milestones, and deliverables.' },
      { id: 'mp3', icon: 'Code2', title: 'Development', description: 'We build your solution using agile methodologies with regular updates and feedback loops.' },
      { id: 'mp4', icon: 'Rocket', title: 'Delivery', description: 'We deploy, test, and ensure your solution performs flawlessly in production.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'ms-get', type: 'features-list', order: 7,
    title: 'What You Get',
    subtitle: 'With Managed Services, you receive:',
    items: [
      { id: 'mg1', icon: 'Briefcase', title: 'A dedicated delivery function', description: 'Full engineering team with delivery ownership.' },
      { id: 'mg2', icon: 'BarChart3', title: 'Predictable output and structured reporting', description: 'Clear metrics and regular progress updates.' },
      { id: 'mg3', icon: 'Shield', title: 'Clear ownership of engineering execution', description: 'We own delivery quality and timelines.' },
      { id: 'mg4', icon: 'Heart', title: 'Stability and continuity', description: 'Long-term team consistency for sustained development.' },
      { id: 'mg5', icon: 'Lightbulb', title: 'Reduced management overhead', description: 'Focus on strategy while we handle execution.' },
      { id: 'mg6', icon: 'Settings', title: 'Recruitment, HR, and operations managed', description: 'Complete operational support handled by us.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'ms-engage', type: 'image-text', order: 8,
    title: 'Engagement & Flexibility',
    subtitle: 'Built for Growth',
    description: '<p>Managed Services engagements include clearly defined responsibilities, communication structures, and performance expectations.</p><p>As your product evolves, we can:</p><ul><li>Scale the team</li><li>Adjust skill sets</li><li>Add new capabilities</li><li>Transition into hybrid models</li></ul><p>This ensures long-term alignment as your business grows.</p>',
    image: managedOwnershipImg,
    backgroundColor: 'default'
  },
  {
    id: 'ms-diff', type: 'cards-grid', order: 9,
    title: 'How This Differs From Other Models',
    subtitle: 'Built for continuous, predictable, long-term development',
    columns: 3,
    items: [
      { id: 'mdc1', icon: 'Users', title: 'vs Dedicated Developers', description: 'We own delivery; you do not manage individual developers.' },
      { id: 'mdc2', icon: 'Users2', title: 'vs Team Augmentation', description: 'This is an outcome-based model, not extra hands supporting your team.' },
      { id: 'mdc3', icon: 'Briefcase', title: 'vs Project-Based Development', description: 'Managed Services supports ongoing, evolving work — not one defined project.' }
    ],
    backgroundColor: 'dark'
  },
  {
    id: 'ms-cta', type: 'cta-banner', order: 10,
    title: "Let's Take Ownership of Your Delivery",
    description: "If you're looking for predictable development and a partner who takes responsibility for delivery, Managed Services may be the right fit.",
    buttonText: 'Talk to Us', buttonLink: '/contact',
    secondaryButtonText: 'View All Services', secondaryButtonLink: '/services',
    backgroundColor: 'dark'
  }
];

// ========== IT INFRASTRUCTURE SETUP ==========
export const itInfrastructureBlocks: ContentBlock[] = [
  {
    id: 'it-hero', type: 'hero-image', order: 1,
    title: 'IT Infrastructure Setup',
    subtitle: 'Secure Foundations',
    description: 'We set up the essential IT and cloud infrastructure your team needs to work securely and efficiently. From identity and access management to device governance and security baselines, we ensure your environment is ready for growth.',
    buttonText: 'Talk to Us', buttonLink: '/contact',
    image: infraHeroImg, backgroundColor: 'dark'
  },
  {
    id: 'it-intro', type: 'rich-text', order: 2,
    title: 'Secure, Scalable IT Foundations',
    content: '<p>Whether you\'re a startup building your first IT environment or an established company formalizing your infrastructure, we help you build a secure, scalable foundation that supports your team and products from day one.</p>',
    backgroundColor: 'default'
  },
  {
    id: 'it-suited', type: 'cards-grid', order: 3,
    title: 'Best Suited For',
    subtitle: 'This service is designed for organizations at key growth stages',
    columns: 3,
    items: [
      { id: 'is1', icon: 'Rocket', title: 'Early-Stage Companies', description: 'New teams that need to get their IT foundation right from day one with best practices.' },
      { id: 'is2', icon: 'Shield', title: 'Secure Onboarding', description: 'Teams needing to establish secure processes for new hires and device management.' },
      { id: 'is3', icon: 'TrendingUp', title: 'Scaling Businesses', description: 'Organizations formalizing or scaling their IT infrastructure for growth.' }
    ],
    backgroundColor: 'muted'
  },
  {
    id: 'it-includes', type: 'icon-grid', order: 4,
    title: 'What This Can Include',
    subtitle: 'Comprehensive IT setup tailored to your specific needs',
    columns: 3,
    items: [
      { id: 'ii1', icon: 'Lock', title: 'Single Sign-On (SSO)', description: 'Centralized authentication for all your applications and services.' },
      { id: 'ii2', icon: 'MonitorSmartphone', title: 'Microsoft Intune / Company Portal', description: 'Device management and application deployment across your organization.' },
      { id: 'ii3', icon: 'ShieldCheck', title: 'Security & Compliance Baseline', description: 'Industry-standard security configurations and compliance frameworks.' },
      { id: 'ii4', icon: 'Smartphone', title: 'Device & Access Management', description: 'Control who accesses what, from which devices, and enforce security policies.' },
      { id: 'ii5', icon: 'Cloud', title: 'Email, Cloud & Collaboration', description: 'Set up Microsoft 365, Google Workspace, or other collaboration platforms.' },
      { id: 'ii6', icon: 'Database', title: 'Infrastructure Architecture', description: 'Design and implement scalable cloud infrastructure for your applications.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'it-security', type: 'text-image', order: 5,
    title: 'Security-First Approach',
    subtitle: 'Built to Protect',
    description: '<p>Every infrastructure setup we deliver follows a security-first methodology. We ensure:</p><ul><li>Zero-trust architecture principles</li><li>Role-based access controls (RBAC)</li><li>Data encryption at rest and in transit</li><li>Compliance with industry standards (SOC 2, GDPR, ISO 27001)</li></ul><p>Your infrastructure is built to protect your data, your team, and your customers.</p>',
    image: infraSecurityImg,
    backgroundColor: 'dark'
  },
  {
    id: 'it-process', type: 'numbered-steps', order: 6,
    title: 'Our Process',
    subtitle: 'We follow a proven methodology to deliver exceptional results',
    items: [
      { id: 'ip1', icon: 'Search', title: 'Discovery', description: 'We understand your business goals, challenges, and requirements through in-depth consultation.' },
      { id: 'ip2', icon: 'Layers', title: 'Planning', description: 'Our team creates a detailed roadmap with timelines, milestones, and deliverables.' },
      { id: 'ip3', icon: 'Settings', title: 'Implementation', description: 'We configure and deploy your infrastructure with best practices and security standards.' },
      { id: 'ip4', icon: 'ShieldCheck', title: 'Validation', description: 'We test, verify, and ensure everything works securely and reliably.' }
    ],
    backgroundColor: 'default'
  },
  {
    id: 'it-stats', type: 'stats-bar', order: 7,
    title: 'Infrastructure Impact',
    items: [
      { id: 'ist1', value: '500+', label: 'Devices Managed' },
      { id: 'ist2', value: '99.9%', label: 'Uptime Guarantee' },
      { id: 'ist3', value: '100%', label: 'Compliance Rate' },
      { id: 'ist4', value: '2x', label: 'Faster Onboarding' }
    ],
    backgroundColor: 'primary'
  },
  {
    id: 'it-cta', type: 'cta-banner', order: 8,
    title: 'Secure Your IT Foundation',
    description: "Whether you're starting fresh or scaling your infrastructure, we help you build a secure, scalable IT environment that supports your growth.",
    buttonText: 'Talk to Us', buttonLink: '/contact',
    secondaryButtonText: 'View All Services', secondaryButtonLink: '/services',
    backgroundColor: 'dark'
  }
];
