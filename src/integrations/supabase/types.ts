export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      absence_reasons: {
        Row: {
          id: number
          reason: string | null
        }
        Insert: {
          id?: number
          reason?: string | null
        }
        Update: {
          id?: number
          reason?: string | null
        }
        Relationships: []
      }
      classroom_configs: {
        Row: {
          attendance_days: number
          classroom_id: string | null
          created_at: string | null
          id: string
          program_type: string | null
          session_type: string
        }
        Insert: {
          attendance_days?: number
          classroom_id?: string | null
          created_at?: string | null
          id?: string
          program_type?: string | null
          session_type?: string
        }
        Update: {
          attendance_days?: number
          classroom_id?: string | null
          created_at?: string | null
          id?: string
          program_type?: string | null
          session_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_configs_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_members: {
        Row: {
          classroom_id: string
          id: string
          joined_at: string | null
          student_id: string
        }
        Insert: {
          classroom_id: string
          id?: string
          joined_at?: string | null
          student_id: string
        }
        Update: {
          classroom_id?: string
          id?: string
          joined_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_members_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_members_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          class_code: string
          created_at: string | null
          id: string
          institution_id: string | null
          name: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          class_code: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          name: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          class_code?: string
          created_at?: string | null
          id?: string
          institution_id?: string | null
          name?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classrooms_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      mistake_counts: {
        Row: {
          id: string
          log_id: string
          marked_mistakes: number
          mistakes: number
          portion: Database["public"]["Enums"]["mistake_portion"]
          stucks: number
        }
        Insert: {
          id?: string
          log_id: string
          marked_mistakes?: number
          mistakes?: number
          portion: Database["public"]["Enums"]["mistake_portion"]
          stucks?: number
        }
        Update: {
          id?: string
          log_id?: string
          marked_mistakes?: number
          mistakes?: number
          portion?: Database["public"]["Enums"]["mistake_portion"]
          stucks?: number
        }
        Relationships: [
          {
            foreignKeyName: "mistake_counts_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "recitation_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          classroom_config_id: string | null
          created_at: string | null
          enrollment_date: string | null
          id: string
          institution_id: string | null
          name: string
          parent_email: string | null
          profile_image: string | null
          role: Database["public"]["Enums"]["user_role"]
          student_identifier: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          classroom_config_id?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          id: string
          institution_id?: string | null
          name: string
          parent_email?: string | null
          profile_image?: string | null
          role: Database["public"]["Enums"]["user_role"]
          student_identifier?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          classroom_config_id?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          institution_id?: string | null
          name?: string
          parent_email?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          student_identifier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_classroom_config_id_fkey"
            columns: ["classroom_config_id"]
            isOneToOne: false
            referencedRelation: "classroom_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      recitation_logs: {
        Row: {
          absence_reason: string | null
          attendance_status: string | null
          ayah_end: number | null
          ayah_start: number | null
          created_at: string | null
          date: string
          id: string
          juz_number: number | null
          notes: string | null
          pages_count: number | null
          recitation_type: Database["public"]["Enums"]["recitation_type"]
          surah_name: string | null
          tester_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          absence_reason?: string | null
          attendance_status?: string | null
          ayah_end?: number | null
          ayah_start?: number | null
          created_at?: string | null
          date?: string
          id?: string
          juz_number?: number | null
          notes?: string | null
          pages_count?: number | null
          recitation_type: Database["public"]["Enums"]["recitation_type"]
          surah_name?: string | null
          tester_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          absence_reason?: string | null
          attendance_status?: string | null
          ayah_end?: number | null
          ayah_start?: number | null
          created_at?: string | null
          date?: string
          id?: string
          juz_number?: number | null
          notes?: string | null
          pages_count?: number | null
          recitation_type?: Database["public"]["Enums"]["recitation_type"]
          surah_name?: string | null
          tester_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recitation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      mistake_portion: "Full" | "Half" | "Quarter"
      recitation_type: "Sabaq" | "Last 3 Sabaqs" | "Sabaq Dhor" | "Dhor"
      user_role: "student" | "teacher" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mistake_portion: ["Full", "Half", "Quarter"],
      recitation_type: ["Sabaq", "Last 3 Sabaqs", "Sabaq Dhor", "Dhor"],
      user_role: ["student", "teacher", "super_admin"],
    },
  },
} as const
