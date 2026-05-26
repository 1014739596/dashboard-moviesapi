import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://edcvbllcymzuxqjdbvmn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkY3ZibGxjeW16dXhxamRidm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NTU2NjYsImV4cCI6MjA5NTMzMTY2Nn0.KD9Hov4Ay7mSS5Fvtcv2SlCGx5OUkBgWAqn0N-VD2c0";

export const supabase = createClient( supabaseUrl, supabaseKey);
