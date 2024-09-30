import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in local storage
                localStorage.setItem('user', JSON.stringify({ token: data.accessToken }));
                console.log('Login successful:', data.accessToken);
                navigate('/home');
            } else {
                console.error('Login failed:', data.message);
                setError(data.message); 
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred. Please try again.'); 
        }
    };

    return (
        <div>
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
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
