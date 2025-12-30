# User Management Setup Guide

## Important: Supabase Admin API

The user creation feature requires Supabase Admin API which must be called from a serverless function for security.

## Option 1: Serverless Function (Recommended)

Create a Supabase Edge Function to handle user creation:

1. Create `supabase/functions/create-user/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email, password, fullName, role, permissions } = await req.json()
  
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (authError) throw authError

  // Create user profile
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .insert([{
      id: authData.user.id,
      email,
      full_name: fullName,
      role: role || 'viewer',
      is_active: true,
      can_view: permissions?.canView ?? true,
      can_edit: permissions?.canEdit ?? false,
      can_delete: permissions?.canDelete ?? false,
      can_manage_users: permissions?.canManageUsers ?? false,
    }])
    .select()
    .single()

  if (error) throw error

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

2. Deploy the function
3. Update `useCreateUser` hook to call this function

## Option 2: Manual Setup (Current)

For now, users can be created manually:
1. Create user in Supabase Auth Dashboard
2. User profile will be created automatically via trigger (if set up)
3. Or create profile manually in database

## Option 3: Use Supabase Dashboard

1. Go to Supabase Dashboard → Authentication → Users
2. Create new user
3. Then create profile in user_profiles table with matching ID

