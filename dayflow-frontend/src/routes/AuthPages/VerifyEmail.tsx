import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Simulated API call
    if (token) {
      setTimeout(() => setStatus('success'), 1000);
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {status === 'loading' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <div>
            <p className="text-green-600 mb-4">Email verified successfully!</p>
            <Link to="/login"><Button>Go to Login</Button></Link>
          </div>
        )}
        {status === 'error' && (
          <p className="text-red-600">Invalid or missing token. Verification failed.</p>
        )}
      </div>
    </div>
  );
}
