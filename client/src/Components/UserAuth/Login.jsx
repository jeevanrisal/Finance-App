import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../Firebase/firebase';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Email/Password Login
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

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google User:', result.user);
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Login</h1>

        {/* Email Login Form */}
        <form className='auth-form' onSubmit={handleEmailSignIn}>
          <input
            className='auth-input'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className='auth-input'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className='auth-button' type='submit'>
            Login
          </button>
        </form>

        <div className='auth-divider'>or sign in with</div>

        {/* Google Sign-In Button */}
        <button className='auth-google-button' onClick={handleGoogleSignIn}>
          <img
            src='https://www.svgrepo.com/show/355037/google.svg'
            alt='Google'
            style={{ width: '20px', height: '20px' }}
          />
          Sign in with Google
        </button>

        <div id='recaptcha-container'></div>

        <div className='auth-footer'>
          <span>Don't have an account?</span>
          <a href='/signup'>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
