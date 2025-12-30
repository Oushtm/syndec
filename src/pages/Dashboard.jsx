import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building2,
  Download,
  Calendar
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useApartments } from '../hooks/useApartments';
import { usePayments } from '../hooks/usePayments';
import { useExpenses } from '../hooks/useExpenses';
import { useFinancialSummary } from '../hooks/useFinancialSummary';
import { exportFinancialReport } from '../utils/pdfExport';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const currentYear = settings?.financial_year || new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const { data: apartments } = useApartments();
  const { data: payments } = usePayments(selectedYear);
  const { data: expenses } = useExpenses(selectedYear);
  const { data: summary, isLoading: summaryLoading } = useFinancialSummary(selectedYear);

  const handleExportReport = () => {
    if (summary && apartments && payments && expenses) {
      exportFinancialReport(selectedYear, summary, apartments, payments, expenses);
    }
  };

  if (settingsLoading || summaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: t('dashboard.totalIncome'),
      value: `${summary?.totalPayments.toFixed(2) || '0.00'} DH`,
      icon: DollarSign,
      gradient: 'from-emerald-400 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      name: t('dashboard.totalExpenses'),
      value: `${summary?.totalExpenses.toFixed(2) || '0.00'} DH`,
      icon: TrendingDown,
      gradient: 'from-rose-400 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
    },
    {
      name: t('dashboard.netBalance'),
      value: `${summary?.balance.toFixed(2) || '0.00'} DH`,
      icon: TrendingUp,
      gradient: summary?.balance >= 0 ? 'from-blue-400 to-indigo-600' : 'from-orange-400 to-red-600',
      bgGradient: summary?.balance >= 0 ? 'from-blue-50 to-indigo-50' : 'from-orange-50 to-red-50',
    },
    {
      name: t('dashboard.totalApartments'),
      value: apartments?.length || 0,
      icon: Building2,
      gradient: 'from-purple-400 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-2">{t('dashboard.title')}</h1>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            {t('dashboard.subtitle')}
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
            onClick={handleExportReport}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t('common.export')} {t('dashboard.title')}</span>
            <span className="sm:hidden">{t('common.export')}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className={`card bg-gradient-to-br ${stat.bgGradient} border-0 animate-fadeIn`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide truncate">
                  {stat.name}
                </p>
                <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent break-words`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transform rotate-3 hover:rotate-6 transition-transform flex-shrink-0 ml-3`}>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Alert */}
      {summary && (
        <div
          className={`rounded-lg p-4 ${
            summary.status === 'surplus'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {summary.status === 'surplus' ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className="ml-3">
              <h3
                className={`text-sm font-medium ${
                  summary.status === 'surplus' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {summary.status === 'surplus' ? t('dashboard.surplus') : t('dashboard.deficit')}
              </h3>
              <div
                className={`mt-2 text-sm ${
                  summary.status === 'surplus' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                <p>
                  {summary.status === 'surplus'
                    ? t('dashboard.surplusMessage', { amount: summary.balance.toFixed(2), year: selectedYear })
                    : t('dashboard.deficitMessage', { amount: Math.abs(summary.balance).toFixed(2), year: selectedYear })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Breakdown Chart */}
      <div className="card bg-gradient-to-br from-white to-gray-50">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          <span className="text-base sm:text-xl">{t('dashboard.monthlyOverview')}</span>
        </h2>
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-3 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.month')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.income')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.expenses')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.balance')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary?.monthlyData.map((month) => (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {MONTHS[month.month - 1]}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                    {month.income.toFixed(2)} DH
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-red-600">
                    {month.expenses.toFixed(2)} DH
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm text-right font-bold ${
                      month.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}
                  >
                    {month.balance.toFixed(2)} DH
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">{t('dashboard.total')}</td>
                <td className="px-4 py-3 text-sm font-bold text-right text-green-600">
                  {summary?.totalPayments.toFixed(2)} DH
                </td>
                <td className="px-4 py-3 text-sm font-bold text-right text-red-600">
                  {summary?.totalExpenses.toFixed(2)} DH
                </td>
                <td
                  className={`px-4 py-3 text-sm font-bold text-right ${
                    summary?.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`}
                >
                  {summary?.balance.toFixed(2)} DH
                </td>
              </tr>
            </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      {expenses && expenses.length > 0 && (
        <div className="card bg-gradient-to-br from-white to-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
            Recent Expenses
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenses.date')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenses.category')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenses.description')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('expenses.amount')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.slice(0, 5).map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {expense.expense_categories?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                      {parseFloat(expense.amount).toFixed(2)} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

