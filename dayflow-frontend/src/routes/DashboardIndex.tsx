import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function DashboardIndex() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin-dashboard', { replace: true });
    } else {
      navigate('/employee-dashboard', { replace: true });
    }
  }, [user, navigate]);

  return null;
}
