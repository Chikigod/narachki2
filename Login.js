import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { loginUser } from './actions'; 
import './login.css'; // Import the CSS file

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    useEffect(() => {
        // Add the login-page class to the body element
        document.body.classList.add('login-page');
        
        // Remove the class when the component unmounts
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending a POST request to the KipreLogin API for authentication
            const response = await fetch('https://localhost:7118/api/KipreLogin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // Check if the login is successful
            if (response.ok) {
                // Assuming the API returns an access token, dispatch it to Redux
                dispatch(loginUser({ email, token: data.accessToken }));
                navigate('/home'); // Redirect to home page after successful login
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
