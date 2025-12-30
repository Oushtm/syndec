import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useFinancialSummary = (year) => {
  return useQuery({
    queryKey: ['financial-summary', year],
    queryFn: async () => {
      // Get total payments collected
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('year', year)
        .eq('status', 'paid');
      
      if (paymentsError) throw paymentsError;
      
      const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      
      // Get total expenses
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate);
      
      if (expensesError) throw expensesError;
      
      const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      
      // Calculate balance
      const balance = totalPayments - totalExpenses;
      
      // Get monthly breakdown
      const monthlyData = [];
      for (let month = 1; month <= 12; month++) {
        const { data: monthPayments } = await supabase
          .from('payments')
          .select('amount')
          .eq('year', year)
          .eq('month', month)
          .eq('status', 'paid');
        
        const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
        const monthEnd = month === 12 
          ? `${year}-12-31` 
          : `${year}-${String(month + 1).padStart(2, '0')}-01`;
        
        const { data: monthExpenses } = await supabase
          .from('expenses')
          .select('amount')
          .gte('expense_date', monthStart)
          .lt('expense_date', monthEnd);
        
        const monthIncome = monthPayments?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0;
        const monthExpense = monthExpenses?.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) || 0;
        
        monthlyData.push({
          month,
          income: monthIncome,
          expenses: monthExpense,
          balance: monthIncome - monthExpense,
        });
      }
      
      return {
        totalPayments,
        totalExpenses,
        balance,
        status: balance >= 0 ? 'surplus' : 'deficit',
        monthlyData,
      };
    },
    enabled: !!year,
  });
};

