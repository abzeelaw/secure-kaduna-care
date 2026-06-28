import { supabaseAdmin } from '@/integrations/supabase/client.server';

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
    .insert([{ id: userId, full_name: full_name || null, phone: phone || null, created_at: now, updated_at: now }])
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
