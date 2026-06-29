import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function createSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    throw new Error(`Missing Supabase environment variable(s): ${missing.join(', ')}`);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function registerUser({
  email,
  password,
  full_name,
  phone,
}: {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const useAdmin = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (useAdmin) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: full_name || null,
        phone: phone || null,
      },
      email_confirm: true,
    } as any);

    if (error) {
      console.error('[registerUser] admin.createUser error:', error);
      const message = error?.message || String(error);
      throw new Error(message);
    }

    const createdUser = (data as any)?.user ?? data;
    const userId = createdUser?.id;

    if (!userId) {
      throw new Error('Created user has no ID');
    }

    const now = new Date().toISOString();
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: userId,
          full_name: full_name || null,
          phone: phone || null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (profileError) {
      console.error('[registerUser] profiles.insert error:', profileError);
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId as string);
        console.info('[registerUser] rolled back user', userId);
      } catch (deleteError) {
        console.error('[registerUser] rollback deleteUser failed:', deleteError);
      }
      throw new Error(profileError.message || String(profileError));
    }

    return { user: createdUser, profile: profileData };
  }

  const client = createSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name || null,
        phone: phone || null,
      },
    },
  });

  if (error) {
    console.error('[registerUser] signUp error:', error);
    throw new Error(error.message || String(error));
  }

  const createdUser = data.user;
  if (!createdUser) {
    throw new Error('Registration failed');
  }

  let profileData = null;

  try {
    const now = new Date().toISOString();
    const profileResult = await client
      .from('profiles')
      .insert([
        {
          id: createdUser.id,
          full_name: full_name || null,
          phone: phone || null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (!profileResult.error) {
      profileData = profileResult.data;
    }
  } catch (insertError) {
    console.warn('[registerUser] profile insert skipped:', insertError);
  }

  return { user: createdUser, profile: profileData };
}
