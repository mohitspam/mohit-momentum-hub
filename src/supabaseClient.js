// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hgdduvgamvkrelfipuxr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZGR1dmdhbXZrcmVsZmlwdXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjcxNjYsImV4cCI6MjA2NTQwMzE2Nn0.iBke_jrrm2nU3MjRz1s1oj7y6XwpbZDWDrbGHv8Q0xc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
