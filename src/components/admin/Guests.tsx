import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import Sidebar from '../shared/Sidebar';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { FaTrash, FaUserPlus } from 'react-icons/fa';

interface Guest {
  id: string;
  name: string;
  email: string;
  national_id: string;
  role: 'guest';
  created_at: string;
}

interface AddGuestFormData {
  name: string;
  email: string;
  national_id: string;
  password: string;
}

const Guests: FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AddGuestFormData>({
    name: '',
    email: '',
    national_id: '',
    password: ''
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles where role is 'guest'
      const { data: guestProfiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          national_id,
          role,
          created_at
        `)
        .eq('role', 'guest')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Fetched guest profiles:', guestProfiles); // For debugging
      setGuests(guestProfiles || []);
    } catch (error: any) {
      console.error('Error fetching guests:', error); // For debugging
      toast.error('Failed to fetch guests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        // First delete the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);

        if (profileError) throw profileError;

        // Then delete the auth user
        const { error: authError } = await supabase.auth.admin.deleteUser(id);
        if (authError) throw authError;
        
        toast.success('Guest deleted successfully');
        fetchGuests(); // Refresh the list
      } catch (error: any) {
        console.error('Error deleting guest:', error); // For debugging
        toast.error('Failed to delete guest: ' + error.message);
      }
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create user using admin API
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true, // Automatically confirm the email
        user_metadata: {
          name: formData.name,
          national_id: formData.national_id,
          role: 'guest'
        }
      });

      if (authError) throw authError;

      // Ensure we have the user data
      if (!authData.user) throw new Error('No user data returned');

      // Create the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            national_id: formData.national_id,
            role: 'guest'
          }
        ]);

      if (profileError) throw profileError;

      toast.success('Guest added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', national_id: '', password: '' });
      fetchGuests(); // Refresh the list
    } catch (error: any) {
      console.error('Error adding guest:', error);
      toast.error('Failed to add guest: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <div className="ml-64 p-8 w-full">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Guest Management</h1>
          <div className="text-sm text-gray-600">
            Total Guests: {guests.length}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            <FaUserPlus />
            <span>Add Guest</span>
          </button>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">National ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {guest.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.national_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(guest.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(guest.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show message if no guests */}
        {guests.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No guests found
          </div>
        )}

        {/* Add Guest Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add New Guest</h2>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">National ID</label>
                  <input
                    type="text"
                    value={formData.national_id}
                    onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    {loading ? 'Adding...' : 'Add Guest'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests; 