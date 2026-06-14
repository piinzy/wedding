// /types/database.types.ts - Supabase Database types generated from schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          full_name: string;
          role: 'bride' | 'vendor' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          full_name: string;
          role?: 'bride' | 'vendor' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          full_name?: string;
          role?: 'bride' | 'vendor' | 'admin';
          created_at?: string;
        };
      };
      bride_profiles: {
        Row: {
          id: string;
          user_id: string;
          wedding_date: string | null;
          city: string | null;
          total_budget: number | null;
          guest_count: number | null;
          partner_name: string | null;
          onboarding_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          wedding_date?: string | null;
          city?: string | null;
          total_budget?: number | null;
          guest_count?: number | null;
          partner_name?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wedding_date?: string | null;
          city?: string | null;
          total_budget?: number | null;
          guest_count?: number | null;
          partner_name?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
        };
      };
      vendor_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          service_type: 'hall' | 'photographer' | 'catering' | 'decoration' | 'entertainment' | 'other';
          city: string | null;
          description: string | null;
          price_range_min: number | null;
          price_range_max: number | null;
          is_approved: boolean;
          subscription_plan: 'basic' | 'professional' | 'premium';
          subscription_ends_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          service_type: 'hall' | 'photographer' | 'catering' | 'decoration' | 'entertainment' | 'other';
          city?: string | null;
          description?: string | null;
          price_range_min?: number | null;
          price_range_max?: number | null;
          is_approved?: boolean;
          subscription_plan?: 'basic' | 'professional' | 'premium';
          subscription_ends_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          service_type?: 'hall' | 'photographer' | 'catering' | 'decoration' | 'entertainment' | 'other';
          city?: string | null;
          description?: string | null;
          price_range_min?: number | null;
          price_range_max?: number | null;
          is_approved?: boolean;
          subscription_plan?: 'basic' | 'professional' | 'premium';
          subscription_ends_at?: string | null;
          created_at?: string;
        };
      };
      vendor_photos: {
        Row: {
          id: string;
          vendor_id: string;
          url: string;
          alt_text: string | null;
          is_cover: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          url: string;
          alt_text?: string | null;
          is_cover?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          url?: string;
          alt_text?: string | null;
          is_cover?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      bride_purchases: {
        Row: {
          id: string;
          bride_id: string;
          service_type: 'ai_planner' | 'vendor_directory' | 'pdf_export';
          amount_paid: number;
          payment_reference: string | null;
          purchased_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          bride_id: string;
          service_type: 'ai_planner' | 'vendor_directory' | 'pdf_export';
          amount_paid: number;
          payment_reference?: string | null;
          purchased_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          bride_id?: string;
          service_type?: 'ai_planner' | 'vendor_directory' | 'pdf_export';
          amount_paid?: number;
          payment_reference?: string | null;
          purchased_at?: string;
          expires_at?: string | null;
        };
      };
      vendor_subscriptions: {
        Row: {
          id: string;
          vendor_id: string;
          plan: 'basic' | 'professional' | 'premium';
          amount_paid: number;
          payment_reference: string | null;
          starts_at: string;
          ends_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          plan: 'basic' | 'professional' | 'premium';
          amount_paid: number;
          payment_reference?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          plan?: 'basic' | 'professional' | 'premium';
          amount_paid?: number;
          payment_reference?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          is_active?: boolean;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          bride_id: string;
          messages: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bride_id: string;
          messages?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bride_id?: string;
          messages?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          bride_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          is_completed: boolean;
          category: string | null;
          created_by: 'ai' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          bride_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          category?: string | null;
          created_by?: 'ai' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          bride_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          category?: string | null;
          created_by?: 'ai' | 'user';
          created_at?: string;
        };
      };
      budget_items: {
        Row: {
          id: string;
          bride_id: string;
          category: string;
          estimated_amount: number | null;
          actual_amount: number | null;
          vendor_id: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bride_id: string;
          category: string;
          estimated_amount?: number | null;
          actual_amount?: number | null;
          vendor_id?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          bride_id?: string;
          category?: string;
          estimated_amount?: number | null;
          actual_amount?: number | null;
          vendor_id?: string | null;
          note?: string | null;
          created_at?: string;
        };
      };
      vendor_inquiries: {
        Row: {
          id: string;
          bride_id: string;
          vendor_id: string;
          message: string;
          status: 'pending' | 'read' | 'replied';
          created_at: string;
        };
        Insert: {
          id?: string;
          bride_id: string;
          vendor_id: string;
          message: string;
          status?: 'pending' | 'read' | 'replied';
          created_at?: string;
        };
        Update: {
          id?: string;
          bride_id?: string;
          vendor_id?: string;
          message?: string;
          status?: 'pending' | 'read' | 'replied';
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          bride_id: string;
          vendor_id: string;
          rating: number;
          comment: string | null;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          bride_id: string;
          vendor_id: string;
          rating: number;
          comment?: string | null;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          bride_id?: string;
          vendor_id?: string;
          rating?: number;
          comment?: string | null;
          is_verified?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'bride' | 'vendor' | 'admin';
      vendor_service_type: 'hall' | 'photographer' | 'catering' | 'decoration' | 'entertainment' | 'other';
      subscription_plan: 'basic' | 'professional' | 'premium';
      bride_service_type: 'ai_planner' | 'vendor_directory' | 'pdf_export';
      inquiry_status: 'pending' | 'read' | 'replied';
      task_created_by: 'ai' | 'user';
    };
  };
}
