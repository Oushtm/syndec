import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar } from 'lucide-react';
import {
  useExpenses,
  useExpenseCategories,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
} from '../hooks/useExpenses';
import { useSettings } from '../hooks/useSettings';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Expenses() {
  const { data: settings } = useSettings();
  const currentYear = settings?.financial_year || new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
  });

  const { data: expenses, isLoading } = useExpenses(selectedYear);
  const { data: categories } = useExpenseCategories();
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const handleOpenModal = (expense = null) => {
    console.log('handleOpenModal called', expense);
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        category_id: expense.category_id || '',
        description: expense.description,
        amount: expense.amount,
        expense_date: expense.expense_date,
      });
    } else {
      setEditingExpense(null);
      setFormData({
        category_id: '',
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
    console.log('Modal should be open now');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await updateExpense.mutateAsync({
          id: editingExpense.id,
          ...formData,
          amount: parseFloat(formData.amount),
        });
      } else {
        await createExpense.mutateAsync({
          ...formData,
          amount: parseFloat(formData.amount),
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense.mutateAsync({ id, year: selectedYear });
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
      }
    }
  };

  // Calculate totals
  const totalExpenses = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;
  
  const monthlyTotals = MONTHS.map((_, index) => {
    const month = index + 1;
    const monthExpenses = expenses?.filter((exp) => {
      const expDate = new Date(exp.expense_date);
      return expDate.getMonth() + 1 === month;
    });
    return monthExpenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;
  });

  const categoryTotals = categories?.map((cat) => {
    const catExpenses = expenses?.filter((exp) => exp.category_id === cat.id);
    const total = catExpenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;
    return { name: cat.name, total };
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-2">Expenses</h1>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            Track and manage building expenses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input-field py-2 flex-1 sm:flex-initial"
            >
              {[...Array(5)].map((_, i) => {
                const year = currentYear - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log('Add Expense clicked');
              handleOpenModal();
            }}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
            type="button"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
          <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">Total Expenses</h3>
          <p className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
            {totalExpenses.toFixed(2)} DH
          </p>
          <p className="mt-1 text-sm text-red-700">{expenses?.length || 0} transactions</p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Average per Month</h3>
          <p className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            {(totalExpenses / 12).toFixed(2)} DH
          </p>
          <p className="mt-1 text-sm text-blue-700">Across 12 months</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
          <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">Highest Month</h3>
          <p className="mt-2 text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
            {Math.max(...monthlyTotals).toFixed(2)} DH
          </p>
          <p className="mt-1 text-sm text-purple-700">
            {MONTHS[monthlyTotals.indexOf(Math.max(...monthlyTotals))]}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <div className="card bg-gradient-to-br from-white to-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            Expenses by Category
          </h2>
          <div className="space-y-3">
            {categoryTotals.map((cat) => {
              const percentage = (cat.total / totalExpenses) * 100;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {cat.total.toFixed(2)} DH ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="card bg-gradient-to-br from-white to-gray-50">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
          <span className="text-base sm:text-xl">All Expenses</span>
        </h2>
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-3 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses?.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md">
                      {expense.expense_categories?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                    {parseFloat(expense.amount).toFixed(2)} DH
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(expense)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg active:bg-blue-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        aria-label="Edit expense"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg active:bg-red-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>

        {expenses?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No expenses found for {selectedYear}.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto" 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" 
              onClick={handleCloseModal}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998
              }}
            />

            <div 
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full mx-4 my-4 sm:my-8 sm:align-middle sm:max-w-lg sm:w-auto border-2 border-purple-200 max-h-[90vh] overflow-y-auto"
              style={{ 
                zIndex: 9999,
                position: 'relative',
                backgroundColor: 'white',
                display: 'inline-block'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-br from-white to-purple-50 px-4 sm:px-6 pt-5 pb-4 sm:pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Category</label>
                      <select
                        required
                        value={formData.category_id}
                        onChange={(e) =>
                          setFormData({ ...formData, category_id: e.target.value })
                        }
                        className="input-field"
                      >
                        <option value="">Select a category</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Description</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="input-field"
                        rows="3"
                        placeholder="Enter expense description"
                      />
                    </div>

                    <div>
                      <label className="label">Amount (DH)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="label">Date</label>
                      <input
                        type="date"
                        required
                        value={formData.expense_date}
                        onChange={(e) =>
                          setFormData({ ...formData, expense_date: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-4 py-4 sm:px-6 flex flex-col-reverse sm:flex-row sm:flex-row-reverse gap-3 border-t border-purple-100 sticky bottom-0">
                  <button
                    type="submit"
                    disabled={createExpense.isPending || updateExpense.isPending}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createExpense.isPending || updateExpense.isPending
                      ? 'Saving...'
                      : editingExpense
                      ? 'Update'
                      : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

