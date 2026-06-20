// Data Types for the entire application

export interface Slide {
  id: string;
  image: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  badge: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  image?: string;
}

export interface Technology {
  id: string;
  name: string;
  icon: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

// Content Block Types for flexible page building
export type ContentBlockType = 
  | 'hero-image'       // Hero section with title, description, image/video, and CTA
  | 'hero-video'       // Hero section with video background
  | 'icon-grid'        // Grid of icons with titles and descriptions
  | 'features-list'    // Features with icons in a list format
  | 'image-text'       // Image on one side, text on other
  | 'text-image'       // Text on one side, image on other
  | 'gallery'          // Image gallery grid
  | 'stats-bar'        // Statistics bar
  | 'testimonial'      // Testimonial/quote block
  | 'cta-banner'       // Call to action banner
  | 'accordion-faq'    // FAQ accordion
  | 'cards-grid'       // Cards in a grid
  | 'two-columns'      // Two column text
  | 'video-embed'      // YouTube/Vimeo embed
  | 'rich-text'        // Rich text content block
  | 'html-block'       // Raw HTML content block
  | 'pricing-table'    // Pricing cards
  | 'team-grid'        // Team members grid
  | 'timeline'         // Timeline/process steps
  | 'logo-cloud'       // Partner/client logos
  | 'numbered-steps'   // Step-by-step process
  | 'checklist';       // Checklist with check icons in grid

export interface IconGridItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon?: string;
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  linkText?: string;
  linkUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PricingItem {
  id: string;
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  buttonText?: string;
  buttonLink?: string;
  isPopular?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  socialLinks?: { platform: string; url: string }[];
}

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  date?: string;
}

export interface LogoItem {
  id: string;
  name: string;
  image: string;
  url?: string;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  order: number;
  // Common fields
  title?: string;
  subtitle?: string;
  description?: string;
  // Media
  image?: string;
  video?: string;
  videoType?: 'upload' | 'youtube' | 'vimeo';
  // CTA
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  // Layout options
  layout?: 'left' | 'right' | 'center';
  columns?: 2 | 3 | 4;
  backgroundColor?: 'default' | 'muted' | 'dark' | 'primary';
  // Block-specific data
  items?: IconGridItem[] | GalleryItem[] | StatItem[] | CardItem[] | FaqItem[] | PricingItem[] | TeamMember[] | TimelineItem[] | LogoItem[];
  content?: string; // For rich-text block
}

export interface ExpertiseSection {
  id: string;
  title: string;
  slug: string;
  tabName: string; // Short name for tab button on homepage
  description: string;
  content: string; // Legacy rich HTML content
  contentBlocks: ContentBlock[]; // New block-based content
  image: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  isActive: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  coverLetter: string;
  linkedIn?: string;
  portfolio?: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'accepted' | 'rejected';
  appliedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  isPublished: boolean;
}

export interface ContactInfo {
  address: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  secondaryEmail?: string;
  notificationEmail?: string;
  workingHours?: string;
  workingHoursWeekend?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface SiteSettings {
  logo: string;
  headerLogo?: string;
  footerLogo?: string;
  loadingLogo?: string;
  headerLogoSize?: number;
  headerLogoOffsetX?: number;
  headerLogoHoverEffect?: boolean;
  siteName: string;
  tagline: string;
  description: string;
  favicon?: string;
  whatsappNumber?: string;
  instapayHandle?: string;
  vodafoneCashNumber?: string;
  bankAccountDetails?: string;
  paypalEmail?: string;
  aiChatWebhookUrl?: string;
}

export interface NavLink {
  id: string;
  name: string;
  href: string;
  isActive: boolean;
  children?: NavLink[];
}

// Dynamic Pages
export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string;
  isPublished: boolean;
  isRootLevel?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Admin Users
export interface AdminUser {
  id: string;
  username: string;
  password: string; // Hashed in production
  displayName: string;
  email: string;
  avatar?: string;
  role: 'super_admin' | 'admin' | 'editor';
  permissions: AdminPermission[];
  isMainAdmin: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type AdminPermission = 
  | 'dashboard'
  | 'home'
  | 'slider'
  | 'services'
  | 'jobs'
  | 'applications'
  | 'store'
  | 'orders'
  | 'support'
  | 'coupons'
  | 'directory'
  | 'chatbot'
  | 'blogs'
  | 'brands'
  | 'media'
  | 'pages'
  | 'menus'
  | 'settings'
  | 'admins';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  categoryId?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  price: number;
  salePrice?: number;
  currency: string;
  type: 'digital' | 'service' | 'hosting' | 'package';
  badge?: string;
  features: string[];
  demoUrl?: string;
  deliveryTime?: string;
  downloadFile?: string;
  isFeatured: boolean;
  isActive: boolean;
  salesCount: number;
  rating: number;
  sortOrder: number;
}

export interface StoreReview {
  id: string;
  productId?: string;
  customerName: string;
  customerTitle?: string;
  rating: number;
  comment: string;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  projectUrl?: string;
  relatedProductId?: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface DirectorySite {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  url: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal?: number;
  maxUses?: number;
  usedCount: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  key: 'instapay' | 'vodafone_cash' | 'bank_transfer' | 'paypal' | string;
  name: string;
  instructions: string;
  accountLabel?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  city?: string;
  address?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: 'pending' | 'paid' | 'rejected' | 'cancelled';
  paymentMethod: string;
  paymentReference?: string;
  paymentProof?: string;
  couponCode?: string;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  items: OrderItem[];
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  memberId?: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  department: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'answered' | 'pending' | 'closed';
  message: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  senderType: 'member' | 'admin';
  senderName: string;
  message: string;
  attachment?: string;
  createdAt: string;
}

export interface ChatbotAnswer {
  id: string;
  question: string;
  keywords: string[];
  answers: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface PageBlocks {
  [pageKey: string]: ContentBlock[];
}

export interface SiteData {
  settings: SiteSettings;
  navLinks: NavLink[];
  slides: Slide[];
  brands: Brand[];
  services: Service[];
  productCategories: ProductCategory[];
  products: Product[];
  reviews: StoreReview[];
  portfolioProjects: PortfolioProject[];
  directorySites: DirectorySite[];
  coupons: Coupon[];
  paymentMethods: PaymentMethod[];
  chatbotAnswers: ChatbotAnswer[];
  technologies: Technology[];
  stats: Stat[];
  expertiseSections: ExpertiseSection[];
  benefits: Benefit[];
  jobs: Job[];
  applications: JobApplication[];
  blogs: BlogPost[];
  contact: ContactInfo;
  pages: DynamicPage[];
  admins: AdminUser[];
  pageBlocks: PageBlocks;
}
