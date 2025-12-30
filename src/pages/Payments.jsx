import { useState, useEffect } from 'react';
import { Check, X, Download, Calendar, Search } from 'lucide-react';
import { useApartments } from '../hooks/useApartments';
import { usePayments, useUpdatePayment, useInitializePayments } from '../hooks/usePayments';
import { useSettings } from '../hooks/useSettings';
import { exportPaymentSheet } from '../utils/pdfExport';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function Payments() {
  const { data: settings } = useSettings();
  const currentYear = settings?.financial_year || new Date().getFullYear();
  const monthlyFee = settings?.monthly_fee || 0;
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: apartments } = useApartments();
  const { data: payments } = usePayments(selectedYear);
  const updatePayment = useUpdatePayment();
  const initializePayments = useInitializePayments();

  // Filter apartments based on search
  const filteredApartments = apartments?.filter((apt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      apt.apartment_number.toLowerCase().includes(query) ||
      apt.owner_name.toLowerCase().includes(query) ||
      (apt.phone_number && apt.phone_number.includes(query))
    );
  });

  // Initialize payments for all apartments when year changes
  useEffect(() => {
    if (apartments && apartments.length > 0 && monthlyFee > 0) {
      apartments.forEach((apartment) => {
        initializePayments.mutate({
          apartmentId: apartment.id,
          year: selectedYear,
          monthlyFee,
        });
      });
    }
  }, [selectedYear, apartments, monthlyFee]);

  const handleTogglePayment = async (apartmentId, month, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'not_paid' : 'paid';
    const paymentDate = newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null;

    // Use monthlyFee, or get the amount from existing payment, or use 0 as fallback
    const paymentAmount = monthlyFee || 0;
    
    if (newStatus === 'paid' && paymentAmount === 0) {
      alert('Please set the monthly fee in Settings before marking payments as paid.');
      return;
    }

    try {
      await updatePayment.mutateAsync({
        apartmentId,
        year: selectedYear,
        month,
        status: newStatus,
        amount: paymentAmount,
        paymentDate,
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Error updating payment. Please try again.');
    }
  };

  const getPaymentStatus = (apartmentId, month) => {
    const payment = payments?.find(
      (p) => p.apartment_id === apartmentId && p.month === month
    );
    return payment?.status || 'not_paid';
  };

  const calculateApartmentTotal = (apartmentId) => {
    const apartmentPayments = payments?.filter(
      (p) => p.apartment_id === apartmentId && p.status === 'paid'
    );
    return apartmentPayments?.length || 0;
  };

  const calculateApartmentTotalAmount = (apartmentId) => {
    const apartmentPayments = payments?.filter(
      (p) => p.apartment_id === apartmentId && p.status === 'paid'
    );
    if (!apartmentPayments || apartmentPayments.length === 0) {
      return 0;
    }
    const total = apartmentPayments.reduce((sum, p) => {
      // Use the stored amount, or fallback to monthlyFee, or 0
      const amount = parseFloat(p.amount) || monthlyFee || 0;
      return sum + amount;
    }, 0);
    return total;
  };

  const handleExport = () => {
    if (apartments && payments) {
      exportPaymentSheet(selectedYear, apartments, payments, monthlyFee);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-2">Payment Tracking</h1>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            Track monthly payments for all apartments
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
            onClick={handleExport}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats - Mobile */}
      <div className="block sm:hidden">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-4">
            <div className="text-xs font-semibold text-green-700 mb-1">Total Paid</div>
            <div className="text-2xl font-extrabold text-green-700">
              {apartments?.reduce((sum, apt) => sum + calculateApartmentTotal(apt.id), 0) || 0}
            </div>
            <div className="text-xs text-green-600 mt-1">payments</div>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-4">
            <div className="text-xs font-semibold text-blue-700 mb-1">Total Collected</div>
            <div className="text-2xl font-extrabold text-blue-700">
              {apartments?.reduce((sum, apt) => sum + calculateApartmentTotalAmount(apt.id), 0).toFixed(0) || 0}
            </div>
            <div className="text-xs text-blue-600 mt-1">DH</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card bg-gradient-to-br from-white to-gray-50 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search apartment number, owner name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 text-xs text-gray-600">
            Found {filteredApartments?.length || 0} apartment(s)
          </div>
        )}
      </div>

      {/* Info Card - Mobile Optimized */}
      <div className="card bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
        <h3 className="text-sm sm:text-base font-bold text-blue-900 mb-3">Payment Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/60 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xs text-blue-600 font-semibold mb-1">Monthly Fee</div>
            <div className="text-lg sm:text-xl font-extrabold text-blue-900">{monthlyFee.toFixed(2)} DH</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xs text-blue-600 font-semibold mb-1">Yearly Fee</div>
            <div className="text-lg sm:text-xl font-extrabold text-blue-900">{(monthlyFee * 12).toFixed(2)} DH</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xs text-blue-600 font-semibold mb-1">Total Income</div>
            <div className="text-lg sm:text-xl font-extrabold text-blue-900">{(monthlyFee * 12 * (apartments?.length || 0)).toFixed(2)} DH</div>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {filteredApartments?.length === 0 && searchQuery && (
          <div className="card text-center py-8">
            <p className="text-gray-500">No apartments found matching "{searchQuery}"</p>
          </div>
        )}
        {filteredApartments?.map((apartment) => {
          const paidCount = calculateApartmentTotal(apartment.id);
          const totalAmount = calculateApartmentTotalAmount(apartment.id);
          const progress = (paidCount / 12) * 100;

          return (
            <div
              key={apartment.id}
              className="card bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-purple-200 shadow-lg"
            >
              {/* Apartment Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-200">
                <div className="flex-1">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Apartment {apartment.apartment_number}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">{apartment.owner_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-blue-600">{paidCount}/12</div>
                  <div className="text-xs font-semibold text-gray-600">{totalAmount.toFixed(2)} DH</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-600">Payment Progress</span>
                  <span className="text-xs font-bold text-purple-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-600 h-3 rounded-full transition-all duration-500 shadow-md"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                {[...Array(12)].map((_, index) => {
                  const month = index + 1;
                  const status = getPaymentStatus(apartment.id, month);
                  const isPaid = status === 'paid';

                  return (
                    <button
                      key={month}
                      onClick={() => handleTogglePayment(apartment.id, month, status)}
                      className={`relative p-3.5 rounded-xl transition-all transform active:scale-90 min-h-[64px] ${
                        isPaid
                          ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg active:shadow-xl'
                          : 'bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-lg active:shadow-xl'
                      }`}
                      aria-label={`${MONTHS[month - 1]} - ${isPaid ? 'Paid' : 'Not Paid'}`}
                    >
                      <div className="text-[10px] font-bold mb-1.5 opacity-95 uppercase tracking-wide">{MONTHS[month - 1]}</div>
                      <div className="flex items-center justify-center">
                        {isPaid ? (
                          <Check className="h-6 w-6" />
                        ) : (
                          <X className="h-6 w-6" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-purple-200 flex items-center justify-between text-xs">
                <div className="text-center flex-1">
                  <div className="font-bold text-gray-900">{paidCount}</div>
                  <div className="text-gray-600">Paid</div>
                </div>
                <div className="w-px h-8 bg-purple-200"></div>
                <div className="text-center flex-1">
                  <div className="font-bold text-gray-900">{12 - paidCount}</div>
                  <div className="text-gray-600">Pending</div>
                </div>
                <div className="w-px h-8 bg-purple-200"></div>
                <div className="text-center flex-1">
                  <div className="font-bold text-blue-600">{totalAmount.toFixed(0)}</div>
                  <div className="text-gray-600">DH Total</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block card overflow-x-auto bg-gradient-to-br from-white to-gray-50">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Apt
                </th>
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Owner
                </th>
                {MONTHS.map((month) => (
                  <th
                    key={month}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px]"
                  >
                    {month}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 bg-gray-50 sticky right-0 z-10">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApartments?.map((apartment) => (
                <tr key={apartment.id} className="hover:bg-gray-50">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {apartment.apartment_number}
                  </td>
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    {apartment.owner_name}
                  </td>
                  {[...Array(12)].map((_, index) => {
                    const month = index + 1;
                    const status = getPaymentStatus(apartment.id, month);
                    const isPaid = status === 'paid';

                    return (
                      <td key={month} className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleTogglePayment(apartment.id, month, status)}
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all transform hover:scale-110 ${
                            isPaid
                              ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                              : 'bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-lg hover:shadow-xl'
                          }`}
                          title={isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                          aria-label={`${MONTHS[month - 1]} - ${isPaid ? 'Paid' : 'Not Paid'}`}
                        >
                          {isPaid ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 border-l border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 sticky right-0 z-10">
                    <span className="text-base block">{calculateApartmentTotal(apartment.id)}/12</span>
                    <div className="text-xs font-semibold text-blue-600 mt-1">
                      {calculateApartmentTotalAmount(apartment.id).toFixed(2)} DH
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {apartments?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No apartments found. Please add apartments first.</p>
        </div>
      )}

      {/* Legend - Hidden on mobile, shown on desktop */}
      <div className="hidden sm:block card bg-gradient-to-br from-white to-gray-50">
        <h3 className="text-base font-bold text-gray-900 mb-4">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Check className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Paid</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <X className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Not Paid</span>
          </div>
        </div>
      </div>
    </div>
  );
}

