const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Helper function to handle Supabase errors
 */
const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  return {
    message: error.message || 'Database operation failed',
    details: error.details || '',
    hint: error.hint || '',
    code: error.code || ''
  };
};

module.exports = {
  supabase,
  handleSupabaseError
};
