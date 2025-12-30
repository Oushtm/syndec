import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Building2, 
  CreditCard, 
  Receipt, 
  Settings, 
  Menu, 
  X,
  Users,
  LogOut
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { user, userProfile, signOut, isAdmin, canManageUsers } = useAuth();
  
  const navigation = [
    { name: t('common.dashboard'), href: '/', icon: Home },
    { name: t('common.apartments'), href: '/apartments', icon: Building2 },
    { name: t('common.payments'), href: '/payments', icon: CreditCard },
    { name: t('common.expenses'), href: '/expenses', icon: Receipt },
    { name: t('common.settings'), href: '/settings', icon: Settings },
  ];

  // Add Users menu if admin or can manage users
  if (isAdmin || canManageUsers) {
    navigation.push({ name: t('common.users'), href: '/users', icon: Users });
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-[9999] lg:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-72 sm:w-80 flex-col bg-gradient-to-b from-white via-purple-50 to-indigo-50 shadow-2xl transform transition-transform duration-300">
          <div className="flex items-center justify-between h-20 px-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />
              <span className="hidden sm:inline">{t('common.appName')}</span>
              <span className="sm:hidden">{t('common.appName').split(' ')[0]}</span>
            </h1>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-4 text-base font-semibold rounded-xl transition-all min-h-[52px] ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 active:bg-gradient-to-r active:from-purple-50 active:to-indigo-50'
                  }`}
                >
                  <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          {user && (
            <div className="p-4 border-t-2 border-purple-200 bg-white/50">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">{userProfile?.full_name || user.email}</p>
                <p className="text-xs text-gray-500">{userProfile?.role || 'user'}</p>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.logout')}
              </button>
            </div>
          )}
          <div className="p-4 border-t-2 border-purple-200 bg-white/50">
            <p className="text-xs text-gray-600 text-center font-semibold">
              © 2025 {t('common.appName')}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-b from-white via-purple-50 to-indigo-50 border-r-2 border-purple-200 shadow-2xl">
          <div className="flex items-center h-20 px-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600">
            <Building2 className="h-10 w-10 text-white mr-3" />
            <h1 className="text-2xl font-extrabold text-white">Syndic Manager</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl transform scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:shadow-md hover:transform hover:scale-102'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          {user && (
            <div className="p-4 border-t-2 border-purple-200 bg-white/50">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-1">{userProfile?.full_name || user.email}</p>
                <p className="text-xs text-gray-500">{userProfile?.role || 'user'}</p>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('auth.logout')}
              </button>
            </div>
          )}
          <div className="p-4 border-t-2 border-purple-200 bg-white/50">
            <p className="text-xs text-gray-600 text-center font-semibold">
              © 2025 {t('common.appName')}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 sm:h-20 flex-shrink-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-xl lg:hidden">
          <button
            type="button"
            className="px-4 sm:px-5 text-white active:bg-white/20 rounded-lg transition-colors min-w-[56px] min-h-[64px] sm:min-h-[80px] flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
          <div className="flex items-center flex-1 px-4 sm:px-6">
            <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="hidden sm:inline">{t('common.appName')}</span>
              <span className="sm:hidden">{t('common.appName').split(' ')[0]}</span>
            </h1>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

