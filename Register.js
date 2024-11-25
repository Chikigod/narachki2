import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './register.css'; // Import the Register CSS

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            // Sending POST request to the API for user registration
            const response = await fetch('https://localhost:7118/api/KipreLogin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.text(); // Get the response text (message or error)
            
            // Check if registration is successful
            if (response.ok) {
                console.log('Registration successful:', data);
                navigate('/login'); // Redirect to the login page
            } else {
                console.error('Registration failed:', data);
                alert(data); // Display the error message
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
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
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;
