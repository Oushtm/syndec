import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Shield, User, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../hooks/useUsers';

export default function Users() {
  const { t } = useTranslation();
  const { isAdmin, canManageUsers } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
    is_active: true,
    can_view: true,
    can_edit: false,
    can_delete: false,
    can_manage_users: false,
  });

  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Check if user can manage users
  if (!isAdmin && !canManageUsers) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{t('users.noPermission')}</p>
      </div>
    );
  }

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        full_name: user.full_name,
        password: '',
        confirmPassword: '',
        role: user.role,
        is_active: user.is_active,
        can_view: user.can_view,
        can_edit: user.can_edit,
        can_delete: user.can_delete,
        can_manage_users: user.can_manage_users,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        full_name: '',
        password: '',
        confirmPassword: '',
        role: 'viewer',
        is_active: true,
        can_view: true,
        can_edit: false,
        can_delete: false,
        can_manage_users: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingUser && formData.password !== formData.confirmPassword) {
      alert(t('users.passwordMismatch'));
      return;
    }

    if (!editingUser && formData.password.length < 6) {
      alert(t('users.passwordTooShort'));
      return;
    }

    try {
      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser.id,
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active,
          can_view: formData.can_view,
          can_edit: formData.can_edit,
          can_delete: formData.can_delete,
          can_manage_users: formData.can_manage_users,
        });
      } else {
        await createUser.mutateAsync({
          email: formData.email,
          password: formData.password,
          fullName: formData.full_name,
          role: formData.role,
          permissions: {
            canView: formData.can_view,
            canEdit: formData.can_edit,
            canDelete: formData.can_delete,
            canManageUsers: formData.can_manage_users,
          },
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.message || t('users.saveError'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('users.confirmDelete'))) {
      try {
        await deleteUser.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.message || t('users.deleteError'));
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'manager':
        return <User className="h-5 w-5" />;
      default:
        return <Eye className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-red-500 to-pink-600';
      case 'manager':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-gray-500 to-gray-600';
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-2">
            {t('users.title')}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            {t('users.subtitle')}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span>{t('users.addUser')}</span>
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {users?.map((user) => (
          <div
            key={user.id}
            className="card bg-gradient-to-br from-white via-blue-50 to-purple-50 border-0"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getRoleColor(user.role)} text-white`}>
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{user.full_name}</h3>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.is_active ? t('users.active') : t('users.inactive')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRoleColor(user.role)} text-white`}>
                    {t(`users.${user.role}`)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="p-2.5 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-xl active:shadow-lg transform active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t('common.edit')}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2.5 bg-gradient-to-br from-red-400 to-rose-600 text-white rounded-xl active:shadow-lg transform active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t('common.delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="text-xs font-semibold text-gray-600 mb-2">{t('users.permissions')}:</div>
              <div className="grid grid-cols-2 gap-2">
                {user.can_view && (
                  <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {t('users.canView')}
                  </div>
                )}
                {user.can_edit && (
                  <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    {t('users.canEdit')}
                  </div>
                )}
                {user.can_delete && (
                  <div className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                    {t('users.canDelete')}
                  </div>
                )}
                {user.can_manage_users && (
                  <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    {t('users.canManageUsers')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {users?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('users.noUsers')}</p>
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
            zIndex: 9999,
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
                zIndex: 9998,
              }}
            />

            <div
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full mx-4 my-4 sm:my-8 sm:align-middle sm:max-w-lg sm:w-auto border-2 border-purple-200 max-h-[90vh] overflow-y-auto"
              style={{
                zIndex: 9999,
                position: 'relative',
                backgroundColor: 'white',
                display: 'inline-block',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-br from-white to-purple-50 px-4 sm:px-6 pt-5 pb-4 sm:pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {editingUser ? t('users.editUser') : t('users.addUser')}
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
                      <label className="label">{t('users.email')}</label>
                      <input
                        type="email"
                        required
                        disabled={!!editingUser}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input-field"
                        placeholder={t('users.email')}
                      />
                    </div>

                    <div>
                      <label className="label">{t('users.name')}</label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        className="input-field"
                        placeholder={t('users.name')}
                      />
                    </div>

                    {!editingUser && (
                      <>
                        <div>
                          <label className="label">{t('users.password')}</label>
                          <input
                            type="password"
                            required={!editingUser}
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({ ...formData, password: e.target.value })
                            }
                            className="input-field"
                            placeholder={t('users.password')}
                          />
                        </div>

                        <div>
                          <label className="label">{t('users.confirmPassword')}</label>
                          <input
                            type="password"
                            required={!editingUser}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            className="input-field"
                            placeholder={t('users.confirmPassword')}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="label">{t('users.role')}</label>
                      <select
                        required
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="input-field"
                      >
                        <option value="viewer">{t('users.viewer')}</option>
                        <option value="manager">{t('users.manager')}</option>
                        <option value="admin">{t('users.admin')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">{t('users.status')}</label>
                      <select
                        value={formData.is_active}
                        onChange={(e) =>
                          setFormData({ ...formData, is_active: e.target.value === 'true' })
                        }
                        className="input-field"
                      >
                        <option value="true">{t('users.active')}</option>
                        <option value="false">{t('users.inactive')}</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <label className="label mb-3">{t('users.permissions')}</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.can_view}
                            onChange={(e) =>
                              setFormData({ ...formData, can_view: e.target.checked })
                            }
                            className="rounded"
                          />
                          <span className="text-sm">{t('users.canView')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.can_edit}
                            onChange={(e) =>
                              setFormData({ ...formData, can_edit: e.target.checked })
                            }
                            className="rounded"
                          />
                          <span className="text-sm">{t('users.canEdit')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.can_delete}
                            onChange={(e) =>
                              setFormData({ ...formData, can_delete: e.target.checked })
                            }
                            className="rounded"
                          />
                          <span className="text-sm">{t('users.canDelete')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.can_manage_users}
                            onChange={(e) =>
                              setFormData({ ...formData, can_manage_users: e.target.checked })
                            }
                            className="rounded"
                          />
                          <span className="text-sm">{t('users.canManageUsers')}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-4 py-4 sm:px-6 flex flex-col-reverse sm:flex-row sm:flex-row-reverse gap-3 border-t border-purple-100 sticky bottom-0">
                  <button
                    type="submit"
                    disabled={createUser.isPending || updateUser.isPending}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createUser.isPending || updateUser.isPending
                      ? t('common.saving')
                      : editingUser
                      ? t('common.update')
                      : t('common.create')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    {t('common.cancel')}
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

