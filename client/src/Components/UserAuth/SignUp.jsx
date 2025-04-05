import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import { Link } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth, googleProvider } from '../Firebase/firebase';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Includes country code from PhoneInput
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [error, setError] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const navigate = useNavigate();

  // Initialize reCAPTCHA in invisible mode for phone verification
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
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

  // Send OTP using the full phone number from PhoneInput
  const sendOTP = async () => {
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }
    setError('');
    try {
      // react-phone-input-2 returns phone number without the '+' sign.
      const fullPhoneNumber = `+${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      console.log('OTP sent to:', fullPhoneNumber);
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      setError(error.message);
    }
  };

  // Verify the OTP entered by the user
  const verifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setError('');
    try {
      const result = await window.confirmationResult.confirm(otp);
      console.log('Phone number verified:', result.user);
      setPhoneVerified(true);
      setError('');
    } catch (error) {
      console.error('OTP verification error:', error.message);
      setError('OTP verification failed: ' + error.message);
    }
  };

  // Reset verification when phone number changes
  const handlePhoneChange = (value) => {
    setPhone(value);
    if (phoneVerified) {
      setPhoneVerified(false);
      setOtpSent(false);
      setOtp('');
    }
  };

  // Email/Password Sign Up handler (only if phone is verified)
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      // Register user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send user details to MongoDB
      await fetch('http://localhost:8880/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jeevab',
          email: user.email,
          phone: phone,
        }),
      });

      console.log('User registered & stored in MongoDB:', user.email);
      navigate('/');
    } catch (error) {
      console.error('SignUp Error:', error.message);
    }
  };

  // Google Sign Up handler: sign in with Google, then show phone verification modal
  const handleGoogleSignUp = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google User:', result.user);
      // After successful Google sign-up, open the phone verification modal
      setShowPhoneModal(true);
    } catch (error) {
      console.error('Google Sign-Up Error:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Create Account</h1>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form className='auth-form' onSubmit={handleEmailSignUp}>
          <input
            className='auth-input'
            type='email'
            placeholder='Email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Inline phone input using react-phone-input-2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <PhoneInput
              country={'us'}
              value={phone}
              onChange={handlePhoneChange}
              inputStyle={{
                flex: 1,
                borderColor: phoneVerified ? 'green' : undefined,
                paddingRight: phoneVerified ? '2.5rem' : undefined,
              }}
              containerStyle={{ flex: 1 }}
              inputProps={{
                name: 'phone',
                required: true,
                autoFocus: false,
              }}
            />
            {phoneVerified && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  color: 'green',
                  fontSize: '1.5rem',
                }}
              >
                ✓
              </span>
            )}
          </div>

          {/* For email sign-up, show inline OTP controls if not in google flow */}
          {!showPhoneModal && !phoneVerified && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              {!otpSent && (
                <span
                  onClick={sendOTP}
                  style={{
                    color: 'blue',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginRight: '1rem',
                  }}
                >
                  Send OTP
                </span>
              )}
              {otpSent && (
                <>
                  <input
                    className='auth-input'
                    type='text'
                    placeholder='OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ width: '80px', marginRight: '0.5rem' }}
                  />
                  <span
                    onClick={verifyOTP}
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Verify
                  </span>
                </>
              )}
            </div>
          )}

          <input
            className='auth-input'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className='auth-input'
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className='auth-button' type='submit'>
            Sign Up
          </button>
        </form>

        <div className='auth-divider'>or continue with</div>

        <button className='auth-google-button' onClick={handleGoogleSignUp}>
          <img
            src='https://www.svgrepo.com/show/355037/google.svg'
            alt='Google'
            style={{ width: '20px', height: '20px' }}
          />
          Sign Up with Google
        </button>

        {/* The reCAPTCHA container */}
        <div id='recaptcha-container'></div>

        <div className='auth-footer'>
          <p>
            Already Have a Account{' '}
            <Link to='/' className='text-blue-600'>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Phone Verification Modal for Google Sign-Up flow */}
      {showPhoneModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ textAlign: 'center' }}>Verify Your Phone</h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={handlePhoneChange}
                inputStyle={{
                  flex: 1,
                  borderColor: phoneVerified ? 'green' : undefined,
                  paddingRight: phoneVerified ? '2.5rem' : undefined,
                }}
                containerStyle={{ flex: 1 }}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: false,
                }}
              />
              {phoneVerified && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    color: 'green',
                    fontSize: '1.5rem',
                  }}
                >
                  ✓
                </span>
              )}
            </div>
            {!phoneVerified && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                {!otpSent && (
                  <span
                    onClick={sendOTP}
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginRight: '1rem',
                    }}
                  >
                    Send OTP
                  </span>
                )}
                {otpSent && (
                  <>
                    <input
                      className='auth-input'
                      type='text'
                      placeholder='OTP'
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ width: '80px', marginRight: '0.5rem' }}
                    />
                    <span
                      onClick={verifyOTP}
                      style={{
                        color: 'blue',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Verify
                    </span>
                  </>
                )}
              </div>
            )}
            {phoneVerified && (
              <p style={{ color: 'green', textAlign: 'center' }}>
                Phone number verified!
              </p>
            )}
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setShowPhoneModal(false)}
                style={{ padding: '0.5rem 1rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
