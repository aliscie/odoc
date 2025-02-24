import React, { useEffect } from 'react';

const GoogleSignInButton = () => {
  useEffect(() => {
    // Load Google platform script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLogin = (response) => {
    // This will decode the JWT token to get user info
    const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('User email:', userInfo.email);
  };

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id={import.meta.env.VITE_GMAIL_AUTH_CLIENT_ID}
        data-callback={handleGoogleLogin}
        data-auto_prompt="false"
      />

      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="confirm your gmail"
        data-shape="rectangular"
        data-logo_alignment="left"
        data-width="300"
        style={{ margin: '0 auto' }}
      />
    </div>
  );
};

export default GoogleSignInButton;
