import { SiteData } from './types';

// Empty initial data - all data comes from MySQL database
export const initialData: SiteData = {
  settings: {
    logo: '',
    siteName: 'تلجاوي',
    tagline: 'استضافة، منتجات رقمية، وبرمجة ويب باحتراف',
    description: 'منصة عربية لبيع المنتجات الرقمية، خدمات الاستضافة، وتنفيذ حلول الويب مع دعم فني وتذاكر وملفات تحميل آمنة.',
    whatsappNumber: '201000000000',
    instapayHandle: 'telgawy@instapay',
    vodafoneCashNumber: '01000000000',
    bankAccountDetails: 'اسم الحساب: Telgawy - البنك: CIB - رقم الحساب: 000000000000',
    paypalEmail: 'payments@telgawy.com',
    aiChatWebhookUrl: ''
  },
  navLinks: [
    { id: 'nav-home', name: 'الرئيسية', href: '/', isActive: true },
    { id: 'nav-products', name: 'المنتجات', href: '/store', isActive: true },
    { id: 'nav-hosting', name: 'الاستضافة', href: '/store?type=hosting', isActive: true },
    { id: 'nav-portfolio', name: 'أعمالنا', href: '/portfolio', isActive: true },
    { id: 'nav-support', name: 'الدعم الفني', href: '/support', isActive: true },
    { id: 'nav-directory', name: 'دليل المواقع', href: '/directory', isActive: true },
  ],
  slides: [],
  brands: [],
  services: [],
  productCategories: [
    { id: 'cat-hosting', name: 'استضافة مواقع', slug: 'hosting', description: 'خطط استضافة آمنة وسريعة', icon: 'Server', isActive: true, sortOrder: 1 },
    { id: 'cat-products', name: 'منتجات رقمية', slug: 'digital-products', description: 'قوالب وإضافات وملفات جاهزة', icon: 'Package', isActive: true, sortOrder: 2 },
    { id: 'cat-web', name: 'برمجة ويب', slug: 'web-development', description: 'مواقع ومتاجر ولوحات تحكم مخصصة', icon: 'Code2', isActive: true, sortOrder: 3 }
  ],
  products: [
    {
      id: 'prd-hosting-starter',
      categoryId: 'cat-hosting',
      title: 'استضافة Starter NVMe',
      slug: 'starter-nvme-hosting',
      shortDescription: 'استضافة سريعة مع SSL ونسخ احتياطي ودعم فني.',
      description: 'خطة مناسبة للمواقع الشخصية والمتاجر الصغيرة مع حماية أساسية ولوحة تحكم كاملة.',
      image: '',
      gallery: [],
      price: 1499,
      currency: 'EGP',
      type: 'hosting',
      badge: 'الأكثر طلباً',
      features: ['NVMe SSD', 'SSL مجاني', 'نسخ احتياطي يومي', 'دعم فني'],
      demoUrl: '',
      deliveryTime: '24 ساعة',
      downloadFile: '',
      isFeatured: true,
      isActive: true,
      salesCount: 42,
      rating: 4.9,
      sortOrder: 1
    },
    {
      id: 'prd-store-template',
      categoryId: 'cat-products',
      title: 'قالب متجر React احترافي',
      slug: 'professional-react-store-template',
      shortDescription: 'قالب متجر سريع مع صفحات منتجات وسلة وواجهة عربية.',
      description: 'قالب قابل للتعديل مناسب لبيع المنتجات الرقمية والخدمات، مع تصميم حديث وتجربة مستخدم عربية.',
      image: '',
      gallery: [],
      price: 899,
      salePrice: 699,
      currency: 'EGP',
      type: 'digital',
      badge: 'تحميل فوري بعد الدفع',
      features: ['React + Vite', 'RTL جاهز', 'صفحات متجر', 'ملفات منظمة'],
      demoUrl: '',
      deliveryTime: 'فوري بعد اعتماد الدفع',
      downloadFile: '',
      isFeatured: true,
      isActive: true,
      salesCount: 28,
      rating: 4.8,
      sortOrder: 2
    },
    {
      id: 'prd-custom-website',
      categoryId: 'cat-web',
      title: 'تنفيذ موقع شركة مخصص',
      slug: 'custom-company-website',
      shortDescription: 'تصميم وبرمجة موقع تعريفي سريع قابل للإدارة.',
      description: 'ننفذ موقعاً كاملاً به لوحة تحكم، صفحات خدمات، تواصل، وتحسينات أساسية لمحركات البحث.',
      image: '',
      gallery: [],
      price: 6500,
      currency: 'EGP',
      type: 'service',
      badge: 'مشروع مخصص',
      features: ['تصميم UI', 'برمجة Frontend', 'ربط API', 'تدريب على الإدارة'],
      demoUrl: '',
      deliveryTime: '7-14 يوم',
      downloadFile: '',
      isFeatured: true,
      isActive: true,
      salesCount: 16,
      rating: 5,
      sortOrder: 3
    }
  ],
  reviews: [
    { id: 'rev-1', productId: 'prd-store-template', customerName: 'أحمد سامي', customerTitle: 'مالك متجر رقمي', rating: 5, comment: 'التصميم منظم والدعم رد بسرعة، وتم تسليم الملفات بعد اعتماد الدفع بدون مشاكل.', isFeatured: true, isApproved: true, createdAt: new Date().toISOString() },
    { id: 'rev-2', productId: 'prd-hosting-starter', customerName: 'منى خالد', customerTitle: 'موقع خدمات', rating: 5, comment: 'نقلوا موقعي على الاستضافة الجديدة وفرق السرعة كان واضح من أول يوم.', isFeatured: true, isApproved: true, createdAt: new Date().toISOString() }
  ],
  portfolioProjects: [
    { id: 'work-1', title: 'متجر منتجات رقمية', slug: 'digital-products-store', category: 'متاجر', description: 'متجر عربي لبيع الملفات الرقمية مع حسابات أعضاء وتحميل بعد الشراء.', image: '', projectUrl: '', relatedProductId: 'prd-store-template', isFeatured: true, sortOrder: 1 },
    { id: 'work-2', title: 'موقع شركة استضافة', slug: 'hosting-company-website', category: 'استضافة', description: 'واجهة تسعير وخطط استضافة وتذاكر دعم ولوحة تحكم.', image: '', projectUrl: '', relatedProductId: 'prd-hosting-starter', isFeatured: true, sortOrder: 2 }
  ],
  directorySites: [
    { id: 'dir-1', title: 'بوابة خدمات تقنية', slug: 'tech-services-portal', category: 'خدمات', description: 'دليل لموقع خدمات تقنية تم تنفيذه وتسليمه.', url: 'https://example.com', image: '', isActive: true, sortOrder: 1 }
  ],
  coupons: [
    { id: 'cpn-welcome', code: 'TELGAWY10', type: 'percent', value: 10, minSubtotal: 500, maxUses: 200, usedCount: 0, startsAt: '', endsAt: '', isActive: true }
  ],
  paymentMethods: [
    { id: 'pay-instapay', key: 'instapay', name: 'InstaPay', instructions: 'حوّل على InstaPay ثم اكتب رقم العملية وارفع صورة التحويل.', accountLabel: 'telgawy@instapay', isActive: true, sortOrder: 1 },
    { id: 'pay-vodafone', key: 'vodafone_cash', name: 'Vodafone Cash', instructions: 'حوّل على رقم فودافون كاش ثم ارفع إثبات الدفع.', accountLabel: '01000000000', isActive: true, sortOrder: 2 },
    { id: 'pay-bank', key: 'bank_transfer', name: 'تحويل بنكي', instructions: 'حوّل إلى الحساب البنكي الموضح ثم أرسل صورة التحويل.', accountLabel: 'Telgawy - CIB - 000000000000', isActive: true, sortOrder: 3 },
    { id: 'pay-paypal', key: 'paypal', name: 'PayPal', instructions: 'ادفع عبر PayPal ثم أرسل Transaction ID.', accountLabel: 'payments@telgawy.com', isActive: true, sortOrder: 4 }
  ],
  chatbotAnswers: [
    { id: 'bot-1', question: 'طرق الدفع', keywords: ['دفع', 'انستا', 'فودافون', 'باي بال', 'تحويل'], answers: ['تقدر تدفع عبر InstaPay أو Vodafone Cash أو تحويل بنكي أو PayPal، وبعد اعتماد الدفع تظهر ملفات التحميل في حسابك.', 'طرق الدفع المتاحة حالياً: انستا باي، فودافون كاش، تحويل بنكي، وباي بال.'], isActive: true, sortOrder: 1 },
    { id: 'bot-2', question: 'تحميل الملفات', keywords: ['تحميل', 'ملف', 'شراء', 'download'], answers: ['الملفات الرقمية تظهر داخل مركز التحميل بعد اعتماد الطلب كمدفوع فقط.', 'لا يمكن تحميل أي ملف إلا من حساب العضو الذي اشترى المنتج وتم اعتماد دفعه.'], isActive: true, sortOrder: 2 }
  ],
  technologies: [],
  stats: [],
  expertiseSections: [],
  benefits: [],
  jobs: [],
  applications: [],
  blogs: [],
  contact: {
    address: '',
    phone: '',
    email: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      instagram: ''
    }
  },
  pages: [],
  admins: [],
  pageBlocks: {}
};
