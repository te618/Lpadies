import React from 'react';
import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';
import { 
  FaUser, 
  FaBed, 
  FaBookmark, 
  FaMoneyBillWave, 
  FaTools,
  FaUsers,
  FaHotel,
  FaChartBar,
  FaSignOutAlt
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface SidebarProps {
  role: 'admin' | 'guest';
}

interface MenuItem {
  icon: IconType;
  label: string;
  path: string;
}

const guestMenuItems: MenuItem[] = [
  { icon: FaUser, label: 'My Profile', path: '/guest/profile' },
  { icon: FaBed, label: 'My Room', path: '/guest/room' },
  { icon: FaBookmark, label: 'Book Room', path: '/guest/book' },
  { icon: FaMoneyBillWave, label: 'Payments', path: '/guest/payments' },
  { icon: FaTools, label: 'Maintenance Requests', path: '/guest/maintenance' },
];

const adminMenuItems: MenuItem[] = [
  { icon: FaChartBar, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FaUsers, label: 'Guests', path: '/admin/guests' },
  { icon: FaHotel, label: 'Rooms', path: '/admin/rooms' },
  { icon: FaBookmark, label: 'Bookings', path: '/admin/bookings' },
  { icon: FaTools, label: 'Maintenance', path: '/admin/maintenance' },
];

const Sidebar: FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = role === 'admin' ? adminMenuItems : guestMenuItems;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="h-screen w-64 bg-secondary text-white fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">
          {role === 'admin' ? 'Hotel Manager' : 'Guest Portal'}
        </h2>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out Button - Fixed at bottom */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors hover:bg-gray-700 text-left"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 