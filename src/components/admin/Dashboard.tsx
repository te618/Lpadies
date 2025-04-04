import React from 'react';
import { FC } from 'react';
import Sidebar from '../shared/Sidebar';

const AdminDashboard: FC = () => {
  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Total Guests" value="125" />
          <DashboardCard title="Occupied Rooms" value="45" />
          <DashboardCard title="Available Rooms" value="15" />
          <DashboardCard title="Pending Requests" value="8" />
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  value: string;
}

const DashboardCard: FC<CardProps> = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AdminDashboard; 