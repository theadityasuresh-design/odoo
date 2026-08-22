import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../api/users';
import { Card } from '../../components/ui/Card';
import { ProfileForm } from '../../components/forms/ProfileForm';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data, isLoading } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMe
  });

  const handleSubmit = (formData: any) => {
    console.log('Update profile', formData);
    // integrate with update user API later
  };

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      
      <Card>
        <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
            {data.profile?.profile_picture_url ? (
              <img src={data.profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                {data.profile?.full_name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{data.profile?.full_name || 'No Name'}</h2>
            <p className="text-gray-500">{data.profile?.job_title} - {data.profile?.department}</p>
            <p className="text-sm text-gray-500 mt-2">Employee ID: {data.employee_id}</p>
            <p className="text-sm text-gray-500">Email: {data.email}</p>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Details</h3>
        <ProfileForm 
          initialData={data.profile || {}} 
          isAdmin={isAdmin} 
          onSubmit={handleSubmit} 
        />
      </Card>
    </div>
  );
}
