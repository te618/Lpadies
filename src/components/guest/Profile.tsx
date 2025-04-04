import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Sidebar from '../shared/Sidebar';
import { toast } from 'react-hot-toast';

interface Profile {
  id: string;
  name: string;
  email: string;
  national_id: string;
  role: 'admin' | 'guest';
  created_at: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(profile);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="guest" />
        <div className="ml-64 p-8 w-full">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role="guest" />
      <div className="ml-64 p-8 w-full">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">My Profile</h1>
          
          {profile && (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <div className="mt-1 text-lg">{profile.name}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <div className="mt-1 text-lg">{profile.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">National ID</label>
                  <div className="mt-1 text-lg">{profile.national_id}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Role</label>
                  <div className="mt-1 text-lg capitalize">{profile.role}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Member Since</label>
                  <div className="mt-1 text-lg">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 