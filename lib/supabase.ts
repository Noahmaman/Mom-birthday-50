import { createClient, SupabaseClient } from '@supabase/supabase-js'

/*
 * Supabase Schema — run these in the Supabase SQL Editor
 *
 * -- Table: rsvps
 * create table rsvps (
 *   id uuid default gen_random_uuid() primary key,
 *   name text not null,
 *   guests_count integer default 1,
 *   attending text check (attending in ('yes', 'no', 'maybe')) not null,
 *   allergies text,
 *   comment text,
 *   created_at timestamp with time zone default now()
 * );
 *
 * -- Table: messages
 * create table messages (
 *   id uuid default gen_random_uuid() primary key,
 *   author_name text not null,
 *   content text not null,
 *   created_at timestamp with time zone default now()
 * );
 *
 * -- Table: videos
 * create table videos (
 *   id uuid default gen_random_uuid() primary key,
 *   author_name text not null,
 *   url text not null,
 *   created_at timestamp with time zone default now()
 * );
 *
 * -- Table: playlist
 * create table playlist (
 *   id uuid default gen_random_uuid() primary key,
 *   url text not null,
 *   title text,
 *   artist text,
 *   artwork_url text,
 *   platform text,
 *   added_by text,
 *   created_at timestamp with time zone default now()
 * );
 *
 * -- Storage bucket for videos (run in Supabase dashboard):
 * -- Create a public bucket named "videos"
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use a placeholder URL during build time when env vars are not set
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-key'

export const supabase: SupabaseClient = createClient(url, key)

export type Rsvp = {
  id: string
  name: string
  guests_count: number
  attending: 'yes' | 'no' | 'maybe'
  allergies?: string
  comment?: string
  created_at: string
}

export type Message = {
  id: string
  author_name: string
  content: string
  created_at: string
}

export type Video = {
  id: string
  author_name: string
  url: string
  created_at: string
}

export type PlaylistItem = {
  id: string
  url: string
  title?: string
  artist?: string
  artwork_url?: string
  platform?: string
  added_by?: string
  created_at: string
}
