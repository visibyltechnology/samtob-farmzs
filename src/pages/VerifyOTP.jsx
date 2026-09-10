// VerifyOTP.jsx is no longer needed — Firebase sends its own email verification.
// This file is kept as a redirect to avoid 404s on any lingering links.
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyOTP() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/login?verify=1', { replace: true }); }, [navigate]);
  return null;
}
