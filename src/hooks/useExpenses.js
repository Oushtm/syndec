import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useExpenseCategories = () => {
  return useQuery({
    queryKey: ['expense-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useExpenses = (year) => {
  return useQuery({
    queryKey: ['expenses', year],
    queryFn: async () => {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*, expense_categories(name)')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .order('expense_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!year,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select('*, expense_categories(name)')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const year = new Date(data.expense_date).getFullYear();
      queryClient.invalidateQueries({ queryKey: ['expenses', year] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select('*, expense_categories(name)')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const year = new Date(data.expense_date).getFullYear();
      queryClient.invalidateQueries({ queryKey: ['expenses', year] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, year }) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { year };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', data.year] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
    },
  });
};

