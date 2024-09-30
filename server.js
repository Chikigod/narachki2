const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const users = [];

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    if (users.find(user => user.email === email)) {
        return res.status(400).send({ message: 'User already exists' });
    }
    users.push({ email, password });
    
    console.log('Current users:', users);

    res.send({ message: 'User registered successfully!' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).send({ message: 'Invalid credentials' });
    }
    const accessToken = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });
    res.send({ accessToken });
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
