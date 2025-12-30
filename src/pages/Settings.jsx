import { useState, useEffect } from 'react';
import { Save, DollarSign, Calendar, Building2 } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  
  const [formData, setFormData] = useState({
    monthly_fee: '',
    financial_year: '',
    apartment_count: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        monthly_fee: settings.monthly_fee || '',
        financial_year: settings.financial_year || new Date().getFullYear(),
        apartment_count: settings.apartment_count || 31,
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        monthly_fee: parseFloat(formData.monthly_fee),
        financial_year: parseInt(formData.financial_year),
        apartment_count: parseInt(formData.apartment_count),
      });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const yearlyFeePerApartment = parseFloat(formData.monthly_fee || 0) * 12;
  const totalYearlyIncome = yearlyFeePerApartment * parseInt(formData.apartment_count || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-2">Settings</h1>
        <p className="text-xs sm:text-sm font-medium text-gray-600">
          Configure your syndic management system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              General Configuration
            </h2>

            <div className="space-y-6">
              {/* Monthly Fee */}
              <div>
                <label className="label flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Monthly Subscription Fee
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.monthly_fee}
                  onChange={(e) =>
                    setFormData({ ...formData, monthly_fee: e.target.value })
                  }
                  className="input-field"
                  placeholder="0.00"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The monthly fee charged to each apartment
                </p>
              </div>

              {/* Financial Year */}
              <div>
                <label className="label flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Financial Year
                </label>
                <select
                  required
                  value={formData.financial_year}
                  onChange={(e) =>
                    setFormData({ ...formData, financial_year: e.target.value })
                  }
                  className="input-field"
                >
                  {[...Array(10)].map((_, i) => {
                    const year = new Date().getFullYear() - 3 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  The current financial year for tracking
                </p>
              </div>

              {/* Apartment Count */}
              <div>
                <label className="label flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  Total Apartment Count
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.apartment_count}
                  onChange={(e) =>
                    setFormData({ ...formData, apartment_count: e.target.value })
                  }
                  className="input-field"
                  placeholder="31"
                />
                <p className="mt-1 text-sm text-gray-500">
                  The total number of apartments in the building
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updateSettings.isPending}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Calculations Summary */}
        <div className="space-y-4">
          <div className="card bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
            <h3 className="text-base font-bold text-blue-900 mb-4 uppercase tracking-wide">
              Financial Calculations
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-blue-700">Monthly Fee</p>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {parseFloat(formData.monthly_fee || 0).toFixed(2)} DH
                </p>
              </div>
              <div className="border-t border-blue-200 pt-3">
                <p className="text-xs text-blue-700 font-semibold">Yearly Fee per Apartment</p>
                <p className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {yearlyFeePerApartment.toFixed(2)} DH
                </p>
              </div>
              <div className="border-t border-blue-200 pt-3">
                <p className="text-xs text-blue-700 font-semibold">Total Yearly Income</p>
                <p className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  {totalYearlyIncome.toFixed(2)} DH
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ({formData.apartment_count} apartments)
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
            <h3 className="text-base font-bold text-green-900 mb-3 uppercase tracking-wide">
              System Information
            </h3>
            <div className="space-y-2 text-sm text-green-700">
              <p>• Database: Supabase (PostgreSQL)</p>
              <p>• Frontend: React + Vite</p>
              <p>• Styling: Tailwind CSS</p>
              <p>• Version: 1.0.0</p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg">
            <h3 className="text-base font-bold text-yellow-900 mb-3 uppercase tracking-wide">
              Important Notes
            </h3>
            <ul className="space-y-1 text-xs text-yellow-700">
              <li>• Changing the monthly fee will affect future calculations</li>
              <li>• Existing payment records will not be automatically updated</li>
              <li>• Financial year changes will affect dashboard views</li>
              <li>• Apartment count is for reference only</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Database Setup Instructions */}
      <div className="card bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 shadow-lg">
        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          Database Setup Instructions
        </h2>
        <div className="prose prose-sm text-purple-800">
          <ol className="space-y-2">
            <li>Create a new project on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Supabase</a></li>
            <li>Copy your project URL and anon key</li>
            <li>Create a <code className="bg-purple-100 px-1 py-0.5 rounded">.env.local</code> file in the project root</li>
            <li>Add your credentials:
              <pre className="bg-purple-100 p-2 rounded mt-1 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key`}
              </pre>
            </li>
            <li>Run the SQL schema from <code className="bg-purple-100 px-1 py-0.5 rounded">supabase-schema.sql</code> in your Supabase SQL Editor</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

