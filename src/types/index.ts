// /types/index.ts - TypeScript interfaces for رباط — منصة المناسبات العربية

// ============================================
// ENUM TYPES
// ============================================

export enum UserRole {
  Organizer = 'organizer',
  Vendor = 'vendor',
  Admin = 'admin',
}

export enum EventType {
  Wedding = 'wedding',
  HomeParty = 'home_party',
  Occasion = 'occasion',
  Birthday = 'birthday',
}

export enum VendorServiceType {
  Hall = 'hall',
  Photographer = 'photographer',
  Catering = 'catering',
  Decoration = 'decoration',
  Entertainment = 'entertainment',
  Other = 'other',
}

export enum SubscriptionPlan {
  Basic = 'basic',
  Professional = 'professional',
  Premium = 'premium',
}

export enum OrganizerServiceType {
  AiPlanner = 'ai_planner',
  VendorDirectory = 'vendor_directory',
  PdfExport = 'pdf_export',
}

export enum InquiryStatus {
  Pending = 'pending',
  Read = 'read',
  Replied = 'replied',
}

export enum TaskCreatedBy {
  Ai = 'ai',
  User = 'user',
}

// ============================================
// GENERIC TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// DATABASE TABLE INTERFACES
// ============================================

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface EventOrganizerProfile {
  id: string;
  user_id: string;
  event_date: string | null;
  event_type: EventType;
  city: string | null;
  total_budget: number | null;
  guest_count: number | null;
  partner_name: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  service_type: VendorServiceType;
  city: string | null;
  description: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
  is_approved: boolean;
  subscription_plan: SubscriptionPlan;
  subscription_ends_at: string | null;
  created_at: string;
}

export interface VendorPhoto {
  id: string;
  vendor_id: string;
  url: string;
  alt_text: string | null;
  is_cover: boolean;
  display_order: number;
  created_at: string;
}

export interface OrganizerPurchase {
  id: string;
  organizer_id: string;
  service_type: OrganizerServiceType;
  amount_paid: number;
  payment_reference: string | null;
  purchased_at: string;
  expires_at: string | null;
}

export interface VendorSubscription {
  id: string;
  vendor_id: string;
  plan: SubscriptionPlan;
  amount_paid: number;
  payment_reference: string | null;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
}

export interface AiConversation {
  id: string;
  organizer_id: string;
  messages: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  category: string | null;
  created_by: TaskCreatedBy;
  created_at: string;
}

export interface BudgetItem {
  id: string;
  organizer_id: string;
  category: string;
  estimated_amount: number | null;
  actual_amount: number | null;
  vendor_id: string | null;
  note: string | null;
  created_at: string;
}

export interface VendorInquiry {
  id: string;
  organizer_id: string;
  vendor_id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export interface Review {
  id: string;
  organizer_id: string;
  vendor_id: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
}

// ============================================
// COMPOSITE TYPES
// ============================================

export interface UserProfile {
  user: User;
  organizerProfile?: EventOrganizerProfile;
  vendorProfile?: VendorProfile;
}

export interface VendorWithPhotos {
  vendor: VendorProfile;
  photos: VendorPhoto[];
  coverPhoto?: VendorPhoto;
}

export interface OrganizerDashboardData {
  profile: EventOrganizerProfile;
  tasks: Task[];
  budgetItems: BudgetItem[];
  conversations: AiConversation[];
  purchases: OrganizerPurchase[];
}

export interface VendorDashboardData {
  profile: VendorProfile;
  photos: VendorPhoto[];
  subscriptions: VendorSubscription[];
  inquiries: VendorInquiry[];
  reviews: Review[];
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  eventType?: EventType;
}

export interface OrganizerProfileForm {
  eventDate: string;
  eventType: EventType;
  city: string;
  totalBudget: number;
  guestCount: number;
  partnerName: string;
}

export interface VendorProfileForm {
  businessName: string;
  serviceType: VendorServiceType;
  city: string;
  description: string;
  priceRangeMin: number;
  priceRangeMax: number;
}

export interface TaskForm {
  title: string;
  description?: string;
  dueDate?: string;
  category?: string;
}

export interface BudgetItemForm {
  category: string;
  estimatedAmount?: number;
  actualAmount?: number;
  vendorId?: string;
  note?: string;
}

export interface VendorInquiryForm {
  vendorId: string;
  message: string;
}

export interface ReviewForm {
  vendorId: string;
  rating: number;
  comment?: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  eventType?: EventType;
}

export interface PaymentRequest {
  amount: number;
  serviceType: OrganizerServiceType | SubscriptionPlan;
  returnUrl: string;
  callbackUrl: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: string;
  url?: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  messages: OpenAIMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface OpenAIResponse {
  id: string;
  choices: {
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
