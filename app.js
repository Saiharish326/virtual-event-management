const express= require('express');
const app= express();
app.use(express.json());
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');
const port = 3000;

const users = [];

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the news aggregator API by saiharish"
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
}    

app.post('/users/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password and role are required.' });
    }
    if (users.find(user=>user.email===email)){
        return res.status(400).json({error:"Email already exists."});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ name, email, password: hashedPassword, role });
        res.status(200).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user.' });
    }
});

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;   
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user= users.find(user=>user.email===email);
    if(!user){
        return res.status(400).json({error:"user not found"});
    }
    try{
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({error:"Invalid email or password"});
        }
        const token=jwt.sign({email:user.email, role:user.role},'secret',{expiresIn: '1h'});
        res.json({ token });
    }catch(err) {
        res.status(500).json({ error: 'Error logging in user.' });
    }
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
