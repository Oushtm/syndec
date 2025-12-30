import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import {
  useApartments,
  useCreateApartment,
  useUpdateApartment,
  useDeleteApartment,
} from '../hooks/useApartments';

export default function Apartments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [formData, setFormData] = useState({
    apartment_number: '',
    floor: '',
    owner_name: '',
    phone_number: '',
  });

  const { data: apartments, isLoading } = useApartments();
  const createApartment = useCreateApartment();
  const updateApartment = useUpdateApartment();
  const deleteApartment = useDeleteApartment();

  const handleOpenModal = (apartment = null) => {
    console.log('handleOpenModal called', apartment);
    if (apartment) {
      setEditingApartment(apartment);
      setFormData({
        apartment_number: apartment.apartment_number,
        floor: apartment.floor,
        owner_name: apartment.owner_name,
        phone_number: apartment.phone_number || '',
      });
    } else {
      setEditingApartment(null);
      setFormData({
        apartment_number: '',
        floor: '',
        owner_name: '',
        phone_number: '',
      });
    }
    setIsModalOpen(true);
    console.log('Modal should be open now');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApartment(null);
    setFormData({
      apartment_number: '',
      floor: '',
      owner_name: '',
      phone_number: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApartment) {
        await updateApartment.mutateAsync({
          id: editingApartment.id,
          ...formData,
          floor: parseInt(formData.floor),
        });
      } else {
        await createApartment.mutateAsync({
          ...formData,
          floor: parseInt(formData.floor),
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving apartment:', error);
      alert('Error saving apartment. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this apartment? This will also delete all associated payment records.')) {
      try {
        await deleteApartment.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting apartment:', error);
        alert('Error deleting apartment. Please try again.');
      }
    }
  };

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-2">Apartments</h1>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            Manage apartment units and owner information
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log('Add Apartment clicked');
            handleOpenModal();
          }}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span>Add Apartment</span>
        </button>
      </div>

      {/* Apartments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {apartments?.map((apartment, index) => (
          <div 
            key={apartment.id} 
            className="card bg-gradient-to-br from-white via-blue-50 to-purple-50 border-0 animate-fadeIn transform hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Apartment {apartment.apartment_number}
                  </h3>
                </div>
                <p className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                  <span className="text-purple-500">Floor</span> {apartment.floor}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(apartment)}
                  className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-xl active:shadow-lg transform active:scale-95 sm:hover:scale-110 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Edit apartment"
                >
                  <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => handleDelete(apartment.id)}
                  className="p-2.5 sm:p-3 bg-gradient-to-br from-red-400 to-rose-600 text-white rounded-xl active:shadow-lg transform active:scale-95 sm:hover:scale-110 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Delete apartment"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Owner</p>
                <p className="text-sm font-bold text-gray-900">{apartment.owner_name}</p>
              </div>
              {apartment.phone_number && (
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-sm font-bold text-gray-900">{apartment.phone_number}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {apartments?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No apartments found. Add your first apartment to get started.</p>
        </div>
      )}

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
                      {editingApartment ? 'Edit Apartment' : 'Add New Apartment'}
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
                      <label className="label">Apartment Number</label>
                      <input
                        type="text"
                        required
                        value={formData.apartment_number}
                        onChange={(e) =>
                          setFormData({ ...formData, apartment_number: e.target.value })
                        }
                        className="input-field"
                        placeholder="e.g., 101"
                      />
                    </div>

                    <div>
                      <label className="label">Floor</label>
                      <input
                        type="number"
                        required
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        className="input-field"
                        placeholder="e.g., 1"
                      />
                    </div>

                    <div>
                      <label className="label">Owner Name</label>
                      <input
                        type="text"
                        required
                        value={formData.owner_name}
                        onChange={(e) =>
                          setFormData({ ...formData, owner_name: e.target.value })
                        }
                        className="input-field"
                        placeholder="Enter owner name"
                      />
                    </div>

                    <div>
                      <label className="label">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({ ...formData, phone_number: e.target.value })
                        }
                        className="input-field"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-4 py-4 sm:px-6 flex flex-col-reverse sm:flex-row sm:flex-row-reverse gap-3 border-t border-purple-100 sticky bottom-0">
                  <button
                    type="submit"
                    disabled={createApartment.isPending || updateApartment.isPending}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createApartment.isPending || updateApartment.isPending
                      ? 'Saving...'
                      : editingApartment
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

