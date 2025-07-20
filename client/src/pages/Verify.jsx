import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying your account...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('No verification token found.');
      setError(true);
      return;
    }

    const doVerification = async () => {
      try {
        await verifyEmail(token);
        setStatus('Your email has been successfully verified!');
        setError(false);
      } catch (err) {
        setStatus(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
        setError(true);
      }
    };

    doVerification();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="text-center">
        <h2 className={`text-2xl font-bold mb-4 ${error ? 'text-red-600' : 'text-green-600'}`}>
          {error ? 'Verification Failed' : 'Verification Successful'}
        </h2>
        <p className="text-gray-700 mb-6">{status}</p>
        {!error && (
          <Link to="/login">
            <Button>Proceed to Login</Button>
          </Link>
        )}
      </Card>
    </div>
  );
};

export default Verify;
