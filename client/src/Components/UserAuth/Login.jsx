import React, { useState, useEffect } from 'react';

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth, googleProvider } from '../Firebase/firebase'; // Import from your Firebase config file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneAuth, setPhoneAuth] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'normal', // Change from 'invisible' to 'normal'
          callback: (response) => {
            console.log('reCAPTCHA verified:', response);
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired. Resetting...');
          },
        }
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  }, []);

  // 🔹 Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google User:', result.user);
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
    }
  };

  // 🔹 Email/Password Login
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('Logged in user:', userCredential.user);
    } catch (error) {
      console.error('Login Error:', error.message);
    }
  };

  // 🔹 Send OTP after verifying reCAPTCHA
  const sendOTP = async () => {
    try {
      const phoneNumber = `+${phone}`; // Ensure correct phone format
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmation;
      setPhoneAuth(true);
      console.log('OTP Sent!');
    } catch (error) {
      console.error('Error Sending OTP:', error.message);
    }
  };

  // 🔹 Verify OTP
  const verifyOTP = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      console.log('User Verified:', result.user);
    } catch (error) {
      console.error('OTP Verification Error:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {/* Google Login */}
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>

      {/* Email Login */}
      <form onSubmit={handleEmailSignIn}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Login</button>
      </form>

      <div>
        <h2>Phone Login</h2>
        <input
          type='text'
          placeholder='Enter Phone Number (with country code)'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={sendOTP}>Send OTP</button>

        {phoneAuth && (
          <>
            <input
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOTP}>Verify OTP</button>
          </>
        )}

        {/* 🔹 Ensure reCAPTCHA is inside the DOM */}
        <div id='recaptcha-container'></div>
      </div>
    </div>
  );
};

export default Login;
