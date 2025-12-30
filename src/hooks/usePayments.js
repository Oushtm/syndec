import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const usePayments = (year) => {
  return useQuery({
    queryKey: ['payments', year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, apartments(*)')
        .eq('year', year)
        .order('apartment_id');
      
      if (error) throw error;
      return data;
    },
    enabled: !!year,
  });
};

export const usePaymentsByApartment = (apartmentId, year) => {
  return useQuery({
    queryKey: ['payments', apartmentId, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('apartment_id', apartmentId)
        .eq('year', year)
        .order('month');
      
      if (error) throw error;
      return data;
    },
    enabled: !!apartmentId && !!year,
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ apartmentId, year, month, status, amount, paymentDate }) => {
      // Check if payment record exists
      const { data: existing } = await supabase
        .from('payments')
        .select('id')
        .eq('apartment_id', apartmentId)
        .eq('year', year)
        .eq('month', month)
        .single();
      
      if (existing) {
        // Update existing payment
        const { data, error } = await supabase
          .from('payments')
          .update({
            status,
            amount,
            payment_date: paymentDate,
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new payment record
        const { data, error } = await supabase
          .from('payments')
          .insert([{
            apartment_id: apartmentId,
            year,
            month,
            status,
            amount,
            payment_date: paymentDate,
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments', variables.year] });
      queryClient.invalidateQueries({ queryKey: ['payments', variables.apartmentId, variables.year] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
    },
  });
};

export const useInitializePayments = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ apartmentId, year, monthlyFee }) => {
      const payments = [];
      for (let month = 1; month <= 12; month++) {
        payments.push({
          apartment_id: apartmentId,
          year,
          month,
          amount: monthlyFee,
          status: 'not_paid',
        });
      }
      
      const { data, error } = await supabase
        .from('payments')
        .upsert(payments, { 
          onConflict: 'apartment_id,year,month',
          ignoreDuplicates: true 
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments', variables.year] });
    },
  });
};

