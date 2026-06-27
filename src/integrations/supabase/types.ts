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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      anc_visits: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          notes: string | null
          pregnancy_id: string
          user_id: string
          visit_date: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          pregnancy_id: string
          user_id: string
          visit_date: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          pregnancy_id?: string
          user_id?: string
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "anc_visits_pregnancy_id_fkey"
            columns: ["pregnancy_id"]
            isOneToOne: false
            referencedRelation: "pregnancies"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string
          doctor_id: string | null
          hospital_id: string | null
          id: string
          notes: string | null
          reason: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_id?: string | null
          hospital_id?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          date_of_birth: string
          full_name: string
          gender: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          full_name: string
          gender?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          full_name?: string
          gender?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          full_name: string
          hospital_id: string | null
          id: string
          rating: number | null
          specialty: string
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          full_name: string
          hospital_id?: string | null
          id?: string
          rating?: number | null
          specialty: string
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          full_name?: string
          hospital_id?: string | null
          id?: string
          rating?: number | null
          specialty?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          created_at: string
          has_emergency: boolean | null
          id: string
          image_url: string | null
          lat: number | null
          lga: string | null
          lng: number | null
          name: string
          phone: string | null
          rating: number | null
          type: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          has_emergency?: boolean | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lga?: string | null
          lng?: number | null
          name: string
          phone?: string | null
          rating?: number | null
          type?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          has_emergency?: boolean | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lga?: string | null
          lng?: number | null
          name?: string
          phone?: string | null
          rating?: number | null
          type?: string | null
        }
        Relationships: []
      }
      immunizations: {
        Row: {
          child_id: string
          created_at: string
          given_date: string | null
          id: string
          notes: string | null
          scheduled_date: string
          status: Database["public"]["Enums"]["immunization_status"]
          user_id: string
          vaccine_name: string
        }
        Insert: {
          child_id: string
          created_at?: string
          given_date?: string | null
          id?: string
          notes?: string | null
          scheduled_date: string
          status?: Database["public"]["Enums"]["immunization_status"]
          user_id: string
          vaccine_name: string
        }
        Update: {
          child_id?: string
          created_at?: string
          given_date?: string | null
          id?: string
          notes?: string | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["immunization_status"]
          user_id?: string
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "immunizations_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          provider: string | null
          record_date: string
          record_type: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          provider?: string | null
          record_date?: string
          record_type: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          provider?: string | null
          record_date?: string
          record_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      pregnancies: {
        Row: {
          active: boolean | null
          created_at: string
          due_date: string
          id: string
          last_period_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          due_date: string
          id?: string
          last_period_date: string
          notes?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          due_date?: string
          id?: string
          last_period_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          gender: string | null
          genotype: string | null
          id: string
          language: string | null
          phone: string | null
          state_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          genotype?: string | null
          id: string
          language?: string | null
          phone?: string | null
          state_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          genotype?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          state_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sos_incidents: {
        Row: {
          address: string | null
          assigned_to: string | null
          category: Database["public"]["Enums"]["sos_category"]
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          notes: string | null
          status: Database["public"]["Enums"]["sos_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["sos_category"]
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["sos_category"]
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "admin" | "doctor" | "dispatcher"
      appointment_status: "scheduled" | "completed" | "cancelled" | "no_show"
      immunization_status: "upcoming" | "due" | "given" | "missed"
      sos_category:
        | "medical"
        | "maternal"
        | "fire"
        | "accident"
        | "security"
        | "other"
      sos_status: "pending" | "dispatched" | "resolved" | "cancelled"
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
    Enums: {
      app_role: ["patient", "admin", "doctor", "dispatcher"],
      appointment_status: ["scheduled", "completed", "cancelled", "no_show"],
      immunization_status: ["upcoming", "due", "given", "missed"],
      sos_category: [
        "medical",
        "maternal",
        "fire",
        "accident",
        "security",
        "other",
      ],
      sos_status: ["pending", "dispatched", "resolved", "cancelled"],
    },
  },
} as const
