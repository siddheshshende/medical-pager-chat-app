/* we used ternary method/operator. alternate method is by Using Functions for Conditional Rendering (renderFormFields) is beneficial for separating logic
 and keeping the return statement clean, especially when the form structure becomes more complex. */

import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import chatimg2 from '../assets/chatimg2.png';
import HospitalIcon from '../assets/hospital.png'
import ReactGA from 'react-ga4';

const cookies = new Cookies(); 

const initialState = {
    fullName: '',
    username: '',
    phoneNumber: '',
    avatar: '',
    password: '',
    confirmPassword: ''
}

const Auth = () => {
    const [isSignup, setIsSignup] = useState(true); //to show r we on signin or signup form.
    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

   
const handleSubmit = async (e) => {
    e.preventDefault();

           //now taking data out of the form and making url request using axios. And then extracts important pieces of data from the server's response.
           const { fullName, username, password, avatarURL, phoneNumber } = form;
           const URL = "https://medical-pager-chat-app.onrender.com/auth";


            const startTime = Date.now(); //for GA Added timing measurement for the authentication process.
    try {
  
    
        const { data: { token, userId, hashedPassword} } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, 
            fullName, 
            phoneNumber, 
            avatarURL, 
            password
        }
    );

        cookies.set('token', token);
        cookies.set('fullName', fullName);
        cookies.set('username', username);
        cookies.set('userId', userId);

        if (isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }
        const endTime = Date.now();
        ReactGA.event({ //Added event tracking for successful sign-up/sign-in.
            category: 'User',
            action: isSignup ? 'Sign Up' : 'Sign In',
            label: 'Success'
        });

        ReactGA.timing({ // How long the authentication process takes
            category: 'Authentication',
            variable: isSignup ? 'Sign Up Time' : 'Sign In Time',
            value: endTime - startTime
        });

 //then after setting cookies we will reload our browser.
        window.location.reload();
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            alert(error.response.data.message || 'An error occurred during login.');
        } else {
            console.error('Error:', error.message);
            alert('An error occurred. Please try again.');
        }
    }
};

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);// changing the state depending on previous state.

        ReactGA.event({
            category: 'User',
            action: 'Switch Auth Mode',
            label: isSignup ? 'To Sign In' : 'To Sign Up'
        });
    };

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields'>
            <div className='logo-auth'>
                    <img src={HospitalIcon } alt="Hospital" width="30" style={{ marginRight: '10px' }} />
                    <p>Medical Pager</p>
                </div>

                <div className='auth__form-container_fields-content'>
                    <p>{isSignup ? 'Sign up' : 'Sign in'}</p>

                    <form onSubmit={handleSubmit}>
                        {isSignup && (                   //shorthand for ternary method.when you have 2 things to show .but ,you only want to show one thing based on condition 
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='fullName'>Full Name</label>
                                <input
                                    type='text'
                                    name='fullName'
                                    placeholder='Enter Full Name'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='username'>Username</label>
                            <input
                                type='text'
                                name='username'
                                placeholder='Enter Username'
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='phoneNumber'>Phone Number</label>
                                <input
                                    type='tel'
                                    name='phoneNumber'
                                    placeholder='Enter Phone Number'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='avatarURL'>Avatar URL</label>
                                <input
                                    type='text'
                                    name='avatarURL'
                                    placeholder='Enter Avatar URL'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className='auth__form-container_fields-content_input'>
                            <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                name='password'
                                placeholder='Enter Password'
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='confirmPassword'>Confirm Password</label>
                                <input
                                    type='password'
                                    name='confirmPassword'
                                    placeholder='Enter Password again'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className='auth__form-container_fields-content_button'>
                            <button>
                                {isSignup ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>

                    </form>
                    <div className='auth__form-container_fields-account'>
                        <p>
                            {isSignup
                                ? "Already have an account?"
                                : "Don't have an account?"}
                            <span onClick={switchMode}>
                                {isSignup ? ' Sign in' : ' Sign up'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className='auth__form-container_image'>
                <img src={chatimg2} alt='sign in pic' />
            </div>
        </div>
    )
}

export default Auth;
