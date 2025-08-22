const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const port = 3000;

const users = [];

const events = [{
    id: 1,
    name: "Event 1",
    description: "Description 1",
    date: "2025-01-01",
    time: "10:00",
    participants: [],
},
{
    id: 2,
    name: "Event 2",
    description: "Description 2",
    date: "2025-01-02",
    time: "11:00",
    participants: [],

}];

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the virtual event management API by saiharish"
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
}
function checkRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: 'Access denied. You are not authorized to access this resource.' });
        }
        next();
    }
}
app.post('/users/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password and role are required.' });
    }
    if (role !== 'organizer' && role !== 'participant') {
        return res.status(400).json({ error: 'Invalid role. only organizer and participant are allowed.' });
    }
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: "Email already exists." });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ name, email, password: hashedPassword, role });
        res.status(200).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user.' });
    }
});

app.post('/users/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ error: "user not found" });
    }
    try {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ email: user.email, role: user.role }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in user.' });
    }

});

app.post('/events', authenticateToken, checkRole('organizer'), async (req, res) => {
    const { name, description, date, time } = req.body;
    const event = {
        id: events.length + 1,
        name,
        description,
        date,
        time,
        participants: [],
    };
    events.push(event);
    res.status(201).json(event);
});

app.get('/events', authenticateToken, (req, res) => {
    res.json(events);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
