import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setSidebarOpen } from '../store/slices/uiSlice';
import { Home, MapPin, Bell, BarChart3, Bus, Route, FileText, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const isAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');

  const userMenuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/route-planner', icon: MapPin, label: 'Route Planner' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const adminMenuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/buses', icon: Bus, label: 'Bus Management' },
    { path: '/admin/routes', icon: Route, label: 'Route Management' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
  ];

  const menuItems = isAdminRoute ? adminMenuItems : userMenuItems;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 md:relative md:top-0 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => dispatch(setSidebarOpen(false))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => dispatch(setSidebarOpen(false))}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              {isAdminRoute ? 'Admin Panel' : 'User Dashboard'}
            </div>
            {isAdmin && (
              <Link
                to={isAdminRoute ? '/' : '/admin'}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
                onClick={() => dispatch(setSidebarOpen(false))}
              >
                Switch to {isAdminRoute ? 'User View' : 'Admin Panel'}
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;