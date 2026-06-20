// API Configuration - MySQL Backend
// On shared hosting keep this empty. On GitHub Pages set VITE_API_BASE_URL
// to the hosting domain, for example: https://api.your-domain.com
const API_ROOT = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE = `${API_ROOT}/api/index.php`;
const UPLOAD_BASE = `${API_ROOT}/api/upload.php`;
const MEMBER_AUTH_STORAGE_KEY = 'telgawy_member_auth';

// Simple hash function for passwords (for authentication)
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hashed_' + Math.abs(hash).toString(36);
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// API Helper functions - Always use real API
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.warn('API returned non-JSON response, falling back to initial data');
    throw new Error('API returned non-JSON response');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API request failed' }));
    throw new Error(error.error || 'API request failed');
  }
  
  return response.json();
}

async function fetchMemberAPI<T>(endpoint: string, token?: string, options?: RequestInit): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
}

export function getStoredMemberAuth(): { token: string; member: any } | null {
  const stored = localStorage.getItem(MEMBER_AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return parsed?.token ? parsed : null;
  } catch {
    localStorage.removeItem(MEMBER_AUTH_STORAGE_KEY);
    return null;
  }
}

export function storeMemberAuth(auth: { token: string; member: any }) {
  localStorage.setItem(MEMBER_AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearMemberAuth() {
  localStorage.removeItem(MEMBER_AUTH_STORAGE_KEY);
}

// File Upload - Always use real API
export async function uploadFile(
  file: File,
  category: string = 'images',
  metadata: Record<string, string> = {}
): Promise<{
  success: boolean;
  url: string;
  filename: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  const uploadParams = new URLSearchParams();
  uploadParams.set('category', category);

  Object.entries(metadata).forEach(([key, value]) => {
    const cleanValue = String(value || '').trim();
    if (cleanValue) {
      formData.append(key, cleanValue);
      uploadParams.set(key, cleanValue);
    }
  });

  // Send CV naming values in both camelCase and snake_case so PHP receives them reliably.
  if (category === 'cvs') {
    const applicantName = (metadata.applicantName || metadata.applicant_name || metadata.fullName || '').trim();
    const jobTitle = (metadata.jobTitle || metadata.job_title || metadata.position || '').trim();

    if (applicantName) {
      formData.set('applicantName', applicantName);
      formData.set('applicant_name', applicantName);
      formData.set('fullName', applicantName);
      uploadParams.set('applicantName', applicantName);
      uploadParams.set('applicant_name', applicantName);
      uploadParams.set('fullName', applicantName);
    }

    if (jobTitle) {
      formData.set('jobTitle', jobTitle);
      formData.set('job_title', jobTitle);
      formData.set('position', jobTitle);
      uploadParams.set('jobTitle', jobTitle);
      uploadParams.set('job_title', jobTitle);
      uploadParams.set('position', jobTitle);
    }
  }

  const uploadUrl = `${UPLOAD_BASE}?${uploadParams.toString()}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Upload failed');
  }
  
  return response.json();
}

// API Functions
export const api = {
  // Get all data
  getAllData: () => fetchAPI<any>('?action=all'),
  
  // Settings
  getSettings: () => fetchAPI<any>('?action=settings'),
  updateSettings: (settings: any) => 
    fetchAPI<any>('?action=settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),
  
  // Slides
  getSlides: () => fetchAPI<any[]>('?action=slides'),
  addSlide: (slide: any) => 
    fetchAPI<any>('?action=slide', {
      method: 'POST',
      body: JSON.stringify(slide)
    }),
  updateSlide: (id: string, slide: any) => 
    fetchAPI<any>(`?action=slide&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(slide)
    }),
  deleteSlide: (id: string) => 
    fetchAPI<any>(`?action=slide&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Brands
  getBrands: () => fetchAPI<any[]>('?action=brands'),
  addBrand: (brand: any) => 
    fetchAPI<any>('?action=brand', {
      method: 'POST',
      body: JSON.stringify(brand)
    }),
  updateBrand: (id: string, brand: any) => 
    fetchAPI<any>(`?action=brand&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(brand)
    }),
  deleteBrand: (id: string) => 
    fetchAPI<any>(`?action=brand&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Services
  getServices: () => fetchAPI<any[]>('?action=services'),
  addService: (service: any) => 
    fetchAPI<any>('?action=service', {
      method: 'POST',
      body: JSON.stringify(service)
    }),
  updateService: (id: string, service: any) => 
    fetchAPI<any>(`?action=service&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(service)
    }),
  deleteService: (id: string) => 
    fetchAPI<any>(`?action=service&id=${id}`, {
      method: 'DELETE'
    }),

  // Product Categories
  getProductCategories: () => fetchAPI<any[]>('?action=productCategories'),
  addProductCategory: (category: any) =>
    fetchAPI<any>('?action=productCategory', {
      method: 'POST',
      body: JSON.stringify(category)
    }),
  updateProductCategory: (id: string, category: any) =>
    fetchAPI<any>(`?action=productCategory&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    }),
  deleteProductCategory: (id: string) =>
    fetchAPI<any>(`?action=productCategory&id=${id}`, {
      method: 'DELETE'
    }),

  // Store Products
  getProducts: () => fetchAPI<any[]>('?action=products'),
  getProduct: (slugOrId: string) => fetchAPI<any>(`?action=product&id=${encodeURIComponent(slugOrId)}`),
  addProduct: (product: any) =>
    fetchAPI<any>('?action=product', {
      method: 'POST',
      body: JSON.stringify(product)
    }),
  updateProduct: (id: string, product: any) =>
    fetchAPI<any>(`?action=product&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    }),
  deleteProduct: (id: string) =>
    fetchAPI<any>(`?action=product&id=${id}`, {
      method: 'DELETE'
    }),

  // Reviews, portfolio, directory
  getReviews: () => fetchAPI<any[]>('?action=reviews'),
  addReview: (review: any) => fetchAPI<any>('?action=review', { method: 'POST', body: JSON.stringify(review) }),
  updateReview: (id: string, review: any) => fetchAPI<any>(`?action=review&id=${id}`, { method: 'PUT', body: JSON.stringify(review) }),
  deleteReview: (id: string) => fetchAPI<any>(`?action=review&id=${id}`, { method: 'DELETE' }),

  getPortfolioProjects: () => fetchAPI<any[]>('?action=portfolioProjects'),
  addPortfolioProject: (project: any) => fetchAPI<any>('?action=portfolioProject', { method: 'POST', body: JSON.stringify(project) }),
  updatePortfolioProject: (id: string, project: any) => fetchAPI<any>(`?action=portfolioProject&id=${id}`, { method: 'PUT', body: JSON.stringify(project) }),
  deletePortfolioProject: (id: string) => fetchAPI<any>(`?action=portfolioProject&id=${id}`, { method: 'DELETE' }),

  getDirectorySites: () => fetchAPI<any[]>('?action=directorySites'),
  addDirectorySite: (site: any) => fetchAPI<any>('?action=directorySite', { method: 'POST', body: JSON.stringify(site) }),
  updateDirectorySite: (id: string, site: any) => fetchAPI<any>(`?action=directorySite&id=${id}`, { method: 'PUT', body: JSON.stringify(site) }),
  deleteDirectorySite: (id: string) => fetchAPI<any>(`?action=directorySite&id=${id}`, { method: 'DELETE' }),

  // Coupons and payment methods
  getCoupons: () => fetchAPI<any[]>('?action=coupons'),
  addCoupon: (coupon: any) => fetchAPI<any>('?action=coupon', { method: 'POST', body: JSON.stringify(coupon) }),
  updateCoupon: (id: string, coupon: any) => fetchAPI<any>(`?action=coupon&id=${id}`, { method: 'PUT', body: JSON.stringify(coupon) }),
  deleteCoupon: (id: string) => fetchAPI<any>(`?action=coupon&id=${id}`, { method: 'DELETE' }),

  getPaymentMethods: () => fetchAPI<any[]>('?action=paymentMethods'),
  addPaymentMethod: (method: any) => fetchAPI<any>('?action=paymentMethod', { method: 'POST', body: JSON.stringify(method) }),
  updatePaymentMethod: (id: string, method: any) => fetchAPI<any>(`?action=paymentMethod&id=${id}`, { method: 'PUT', body: JSON.stringify(method) }),
  deletePaymentMethod: (id: string) => fetchAPI<any>(`?action=paymentMethod&id=${id}`, { method: 'DELETE' }),

  // Chatbot knowledge
  getChatbotAnswers: () => fetchAPI<any[]>('?action=chatbotAnswers'),
  addChatbotAnswer: (answer: any) => fetchAPI<any>('?action=chatbotAnswer', { method: 'POST', body: JSON.stringify(answer) }),
  updateChatbotAnswer: (id: string, answer: any) => fetchAPI<any>(`?action=chatbotAnswer&id=${id}`, { method: 'PUT', body: JSON.stringify(answer) }),
  deleteChatbotAnswer: (id: string) => fetchAPI<any>(`?action=chatbotAnswer&id=${id}`, { method: 'DELETE' }),
  chat: (message: string) => fetchAPI<any>('?action=chat', { method: 'POST', body: JSON.stringify({ message }) }),
  
  // Jobs
  getJobs: () => fetchAPI<any[]>('?action=jobs'),
  getJob: (id: string) => fetchAPI<any>(`?action=job&id=${id}`),
  addJob: (job: any) => 
    fetchAPI<any>('?action=job', {
      method: 'POST',
      body: JSON.stringify(job)
    }),
  updateJob: (id: string, job: any) => 
    fetchAPI<any>(`?action=job&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(job)
    }),
  deleteJob: (id: string) => 
    fetchAPI<any>(`?action=job&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Applications
  getApplications: () => fetchAPI<any[]>('?action=applications'),
  addApplication: (app: any) => 
    fetchAPI<any>('?action=application', {
      method: 'POST',
      body: JSON.stringify(app)
    }),
  updateApplication: (id: string, app: any) => 
    fetchAPI<any>(`?action=application&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(app)
    }),
  deleteApplication: (id: string) => 
    fetchAPI<any>(`?action=application&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Blogs
  getBlogs: () => fetchAPI<any[]>('?action=blogs'),
  getBlog: (slug: string) => fetchAPI<any>(`?action=blog&id=${slug}`),
  addBlog: (blog: any) => 
    fetchAPI<any>('?action=blog', {
      method: 'POST',
      body: JSON.stringify(blog)
    }),
  updateBlog: (id: string, blog: any) => 
    fetchAPI<any>(`?action=blog&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(blog)
    }),
  deleteBlog: (id: string) => 
    fetchAPI<any>(`?action=blog&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Contact
  getContact: () => fetchAPI<any>('?action=contact'),
  updateContact: (contact: any) => 
    fetchAPI<any>('?action=contact', {
      method: 'PUT',
      body: JSON.stringify(contact)
    }),
  
  // Technologies
  getTechnologies: () => fetchAPI<any[]>('?action=technologies'),
  addTechnology: (tech: any) => 
    fetchAPI<any>('?action=technology', {
      method: 'POST',
      body: JSON.stringify(tech)
    }),
  updateTechnology: (id: string, tech: any) => 
    fetchAPI<any>(`?action=technology&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(tech)
    }),
  deleteTechnology: (id: string) => 
    fetchAPI<any>(`?action=technology&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Stats
  getStats: () => fetchAPI<any[]>('?action=stats'),
  addStat: (stat: any) =>
    fetchAPI<any>('?action=stat', {
      method: 'POST',
      body: JSON.stringify(stat)
    }),
  updateStat: (id: string, stat: any) =>
    fetchAPI<any>(`?action=stat&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(stat)
    }),
  deleteStat: (id: string) =>
    fetchAPI<any>(`?action=stat&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Benefits
  getBenefits: () => fetchAPI<any[]>('?action=benefits'),
  addBenefit: (benefit: any) => 
    fetchAPI<any>('?action=benefit', {
      method: 'POST',
      body: JSON.stringify(benefit)
    }),
  updateBenefit: (id: string, benefit: any) => 
    fetchAPI<any>(`?action=benefit&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(benefit)
    }),
  deleteBenefit: (id: string) => 
    fetchAPI<any>(`?action=benefit&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Expertise Sections
  getExpertiseSections: () => fetchAPI<any[]>('?action=expertiseSections'),
  addExpertiseSection: (section: any) => 
    fetchAPI<any>('?action=expertiseSection', {
      method: 'POST',
      body: JSON.stringify(section)
    }),
  updateExpertiseSection: (id: string, section: any) => 
    fetchAPI<any>(`?action=expertiseSection&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(section)
    }),
  deleteExpertiseSection: (id: string) => 
    fetchAPI<any>(`?action=expertiseSection&id=${id}`, {
      method: 'DELETE'
    }),
  
  // NavLinks
  getNavLinks: () => fetchAPI<any[]>('?action=navLinks'),
  addNavLink: (link: any) =>
    fetchAPI<any>('?action=navLink', {
      method: 'POST',
      body: JSON.stringify(link)
    }),
  updateNavLink: (id: string, link: any) =>
    fetchAPI<any>(`?action=navLink&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(link)
    }),
  deleteNavLink: (id: string) =>
    fetchAPI<any>(`?action=navLink&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Pages
  getPages: () => fetchAPI<any[]>('?action=pages'),
  getPage: (slug: string) => fetchAPI<any>(`?action=page&id=${slug}`),
  addPage: (page: any) => 
    fetchAPI<any>('?action=page', {
      method: 'POST',
      body: JSON.stringify(page)
    }),
  updatePage: (id: string, page: any) => 
    fetchAPI<any>(`?action=page&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(page)
    }),
  deletePage: (id: string) => 
    fetchAPI<any>(`?action=page&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Admins
  getAdmins: () => fetchAPI<any[]>('?action=admins'),
  addAdmin: (admin: any) => 
    fetchAPI<any>('?action=admin', {
      method: 'POST',
      body: JSON.stringify(admin)
    }),
  updateAdmin: (id: string, admin: any) => 
    fetchAPI<any>(`?action=admin&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(admin)
    }),
  deleteAdmin: (id: string) => 
    fetchAPI<any>(`?action=admin&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Auth
  login: (username: string, password: string) =>
    fetchAPI<any>('?action=login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  // Member Auth
  memberRegister: (member: any) =>
    fetchAPI<any>('?action=memberRegister', {
      method: 'POST',
      body: JSON.stringify(member)
    }),
  memberLogin: (email: string, password: string) =>
    fetchAPI<any>('?action=memberLogin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getMemberProfile: (token: string) => fetchMemberAPI<any>('?action=memberProfile', token),
  updateMemberProfile: (token: string, member: any) =>
    fetchMemberAPI<any>('?action=memberProfile', token, {
      method: 'PUT',
      body: JSON.stringify(member)
    }),

  // Orders and downloads
  applyCoupon: (code: string, productIds: string[]) =>
    fetchAPI<any>('?action=applyCoupon', {
      method: 'POST',
      body: JSON.stringify({ code, productIds })
    }),
  createOrder: (token: string, order: any) =>
    fetchMemberAPI<any>('?action=order', token, {
      method: 'POST',
      body: JSON.stringify(order)
    }),
  getMyOrders: (token: string) => fetchMemberAPI<any[]>('?action=myOrders', token),
  getMyDownloads: (token: string) => fetchMemberAPI<any[]>('?action=myDownloads', token),
  getDownloadUrl: (productId: string, token: string) =>
    `${API_BASE}?action=download&id=${encodeURIComponent(productId)}&token=${encodeURIComponent(token)}`,
  getOrders: () => fetchAPI<any[]>('?action=orders'),
  updateOrder: (id: string, order: any) =>
    fetchAPI<any>(`?action=order&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(order)
    }),

  // Support Tickets
  createTicket: (ticket: any, token?: string) =>
    fetchMemberAPI<any>('?action=ticket', token, {
      method: 'POST',
      body: JSON.stringify(ticket)
    }),
  getMyTickets: (token: string) => fetchMemberAPI<any[]>('?action=myTickets', token),
  getTicketReplies: (ticketId: string, token?: string) => fetchMemberAPI<any[]>(`?action=ticketReplies&id=${ticketId}`, token),
  addTicketReply: (ticketId: string, reply: any, token?: string) =>
    fetchMemberAPI<any>(`?action=ticketReply&id=${ticketId}`, token, {
      method: 'POST',
      body: JSON.stringify(reply)
    }),
  getTickets: () => fetchAPI<any[]>('?action=tickets'),
  updateTicket: (id: string, ticket: any) =>
    fetchAPI<any>(`?action=ticket&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticket)
    }),
  
  // Contact Messages
  getMessages: () => fetchAPI<any[]>('?action=messages'),
  getMessage: (id: string) => fetchAPI<any>(`?action=message&id=${id}`),
  addMessage: (message: any) => 
    fetchAPI<any>('?action=message', {
      method: 'POST',
      body: JSON.stringify(message)
    }),
  updateMessage: (id: string, message: any) => 
    fetchAPI<any>(`?action=message&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(message)
    }),
  deleteMessage: (id: string) => 
    fetchAPI<any>(`?action=message&id=${id}`, {
      method: 'DELETE'
    }),
  
  // Page Blocks
  getPageBlocks: (pageKey: string) => fetchAPI<any>(`?action=pageBlocks&id=${pageKey}`),
  getAllPageBlocks: () => fetchAPI<any>('?action=pageBlocks'),
  savePageBlocks: (pageKey: string, blocks: any[]) =>
    fetchAPI<any>('?action=pageBlocks', {
      method: 'POST',
      body: JSON.stringify({ pageKey, blocks })
    }),
  
  // Upload
  uploadFile
};

export default api;
