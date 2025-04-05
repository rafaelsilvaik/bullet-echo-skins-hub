
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      heroes: {
        Row: {
          id: number
          name: string
          description: string
          created_at: string
          image_url: string | null
        }
        Insert: {
          id?: number
          name: string
          description: string
          created_at?: string
          image_url?: string | null
        }
        Update: {
          id?: number
          name?: string
          description?: string
          created_at?: string
          image_url?: string | null
        }
        Relationships: []
      }
      skins: {
        Row: {
          id: number
          hero_id: number
          name: string
          rarity: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: number
          hero_id: number
          name: string
          rarity: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          hero_id?: number
          name?: string
          rarity?: string
          image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skins_hero_id_fkey"
            columns: ["hero_id"]
            referencedRelation: "heroes"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          username: string
          syndicate: string | null
          trophies: number
          about: string | null
          created_at: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          username: string
          syndicate?: string | null
          trophies?: number
          about?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          username?: string
          syndicate?: string | null
          trophies?: number
          about?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_skins: {
        Row: {
          id: number
          user_id: string
          skin_id: number
          acquired_at: string
        }
        Insert: {
          id?: number
          user_id: string
          skin_id: number
          acquired_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          skin_id?: number
          acquired_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skins_skin_id_fkey"
            columns: ["skin_id"]
            referencedRelation: "skins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skins_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
