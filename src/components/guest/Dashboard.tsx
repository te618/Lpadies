import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import Sidebar from '../shared/Sidebar';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface Profile {
  id: string;
  name: string;
  email: string;
  national_id: string;
  role: 'admin' | 'guest';
}

const GuestDashboard: FC = () => {
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
        <h1 className="text-2xl font-bold mb-6">Welcome Back, {profile?.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard 
            title="Room Status" 
            status="Checked In" 
            details="Room 301 - Deluxe Suite"
          />
          <StatusCard 
            title="Next Payment" 
            status="Due in 5 days" 
            details="$150.00"
          />
          <StatusCard 
            title="Maintenance Requests" 
            status="1 Active Request" 
            details="AC Maintenance - In Progress"
          />
        </div>

        {/* Profile Summary Card */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
          {profile && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <div className="mt-1">{profile.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">National ID</label>
                  <div className="mt-1">{profile.national_id}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatusCardProps {
  title: string;
  status: string;
  details: string;
}

const StatusCard: FC<StatusCardProps> = ({ title, status, details }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-xl font-semibold mt-2">{status}</p>
      <p className="text-gray-600 mt-1">{details}</p>
    </div>
  );
};

export default GuestDashboard; 