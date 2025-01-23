import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ioxvnoufbpphhtyqpmyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveHZub3VmYnBwaGh0eXFwbXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNTc4NDcsImV4cCI6MjA0MTczMzg0N30.p6hIjsmxQ1YK-n5pv6xh2XroHUUQ_gEctFebXVDTfVg";

// const supabaseUrl = 'https://xaztlrduenbmmefyihqr.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhenRscmR1ZW5ibW1lZnlpaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4Mzc3NDIsImV4cCI6MjA0MjQxMzc0Mn0.d0JwOZOGDLp8buCUKjC1c9haZJKR_LnXo8oC2KclfjQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
        

