export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      email_campaigns: {
        Row: {
          created_at: string
          html: string
          id: string
          name: string
          preheader: string | null
          prompt: string | null
          recipient_count: number | null
          recipient_filter: string
          sent_at: string | null
          sent_by: string | null
          status: string
          subject: string
          text_fallback: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          html: string
          id?: string
          name: string
          preheader?: string | null
          prompt?: string | null
          recipient_count?: number | null
          recipient_filter?: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject: string
          text_fallback?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          html?: string
          id?: string
          name?: string
          preheader?: string | null
          prompt?: string | null
          recipient_count?: number | null
          recipient_filter?: string
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject?: string
          text_fallback?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_sends: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string
          recipient_name: string
          registration_id: string | null
          resend_message_id: string | null
          send_type: string
          sent_by: string | null
          status: string
          template_key: string
          template_version: number
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          recipient_name: string
          registration_id?: string | null
          resend_message_id?: string | null
          send_type: string
          sent_by?: string | null
          status: string
          template_key: string
          template_version: number
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string
          registration_id?: string | null
          resend_message_id?: string | null
          send_type?: string
          sent_by?: string | null
          status?: string
          template_key?: string
          template_version?: number
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          html: string
          is_published: boolean
          preheader: string | null
          subject: string
          template_key: string
          text_fallback: string | null
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          html: string
          is_published?: boolean
          preheader?: string | null
          subject: string
          template_key: string
          text_fallback?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          html?: string
          is_published?: boolean
          preheader?: string | null
          subject?: string
          template_key?: string
          text_fallback?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attendee_type: string
          checked_in_at: string | null
          checked_in_by: string | null
          confirmation_email_id: string | null
          confirmation_email_sent_at: string | null
          created_at: string
          email: string
          event_version: string
          first_name: string
          id: string
          last_name: string
          organization: string | null
          phone: string | null
          practice: string | null
          registration_status: string
          role: string | null
        }
        Insert: {
          attendee_type: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          confirmation_email_id?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string
          email: string
          event_version?: string
          first_name: string
          id?: string
          last_name: string
          organization?: string | null
          phone?: string | null
          practice?: string | null
          registration_status?: string
          role?: string | null
        }
        Update: {
          attendee_type?: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          confirmation_email_id?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string
          email?: string
          event_version?: string
          first_name?: string
          id?: string
          last_name?: string
          organization?: string | null
          phone?: string | null
          practice?: string | null
          registration_status?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
