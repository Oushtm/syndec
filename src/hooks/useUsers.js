import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password, fullName, role, permissions }) => {
      // Get current user for created_by
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // Try to call serverless function if available
      // Otherwise, create profile and prompt admin to create auth user
      try {
        // Try calling edge function (if deployed)
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            password,
            fullName,
            role,
            permissions,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.log('Edge function not available, using manual method');
      }

      // Fallback: Sign up user (they'll need to confirm email)
      // This creates both auth user and we can then create profile
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        // If user already exists, try to create profile with existing user
        if (authError.message.includes('already registered')) {
          // Get user by email
          // Note: This is a workaround - in production use admin API
          throw new Error('User already exists. Please use Supabase Dashboard to manage users or set up serverless function.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Create user profile
      const { data, error } = await supabase
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
          created_by: currentUser?.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      // Delete user profile
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Note: Auth user deletion requires admin API
      // For now, admin should delete auth user manually from Supabase Dashboard
      // Or use serverless function with admin API
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

