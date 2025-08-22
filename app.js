require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const port = 3000;

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Set EMAIL_USER environment variable
        pass: process.env.EMAIL_PASS || 'your-app-password'     // Set EMAIL_PASS environment variable
    }
});

// Email notification functions
async function sendEmail(to, subject, htmlContent) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com', // Use environment variable
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

async function sendRegistrationConfirmation(email, name) {
    const subject = 'Welcome to Virtual Event Management!';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome ${name}!</h2>
            <p>Thank you for registering with our Virtual Event Management platform.</p>
            <p>You can now:</p>
            <ul>
                <li>Browse available events</li>
                <li>Register for events</li>
                <li>Manage your profile</li>
            </ul>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>Virtual Event Management Team</p>
        </div>
    `;

    return await sendEmail(email, subject, htmlContent);
}

async function sendEventRegistrationConfirmation(email, eventName, eventDate, eventTime) {
    const subject = 'Event Registration Confirmed!';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Registration Confirmed!</h2>
            <p>You have successfully registered for:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">${eventName}</h3>
                <p><strong>Date:</strong> ${eventDate}</p>
                <p><strong>Time:</strong> ${eventTime}</p>
            </div>
            <p>We'll send you a reminder before the event starts.</p>
            <p>Best regards,<br>Virtual Event Management Team</p>
        </div>
    `;

    return await sendEmail(email, subject, htmlContent);
}

async function sendEventCreationNotification(eventName, eventDate, eventTime) {
    const subject = 'New Event Created!';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">New Event Available!</h2>
            <p>A new event has been created and is now available for registration:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">${eventName}</h3>
                <p><strong>Date:</strong> ${eventDate}</p>
                <p><strong>Time:</strong> ${eventTime}</p>
            </div>
            <p>Log in to your account to register for this exciting event!</p>
            <p>Best regards,<br>Virtual Event Management Team</p>
        </div>
    `;

    // Send to all participants (you can modify this logic as needed)
    for (const user of users) {
        if (user.role === 'participant') {
            await sendEmail(user.email, subject, htmlContent);
        }
    }
}

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

        // Send welcome email
        await sendRegistrationConfirmation(email, name);

        res.status(200).json({ message: 'User registered successfully. Welcome email sent!' });
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
app.post('/register-for-event', authenticateToken, async (req, res) => {
    const { eventId } = req.body;
    const event = events.find(event => event.id === eventId);
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    event.participants.push(req.user.email);

    // Send event registration confirmation email
    await sendEventRegistrationConfirmation(req.user.email, event.name, event.date, event.time);

    res.status(200).json({ message: 'Registered for event successfully. Confirmation email sent!' });
});


app.post('/create-events', authenticateToken, checkRole('organizer'), async (req, res) => {
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

    // Send notification to all participants about new event
    await sendEventCreationNotification(name, date, time);

    res.status(201).json({
        message: 'Event created successfully. Notifications sent to all participants!',
        event: event
    });
});

app.get('/events', authenticateToken, (req, res) => {
    res.json(events);
});

// New endpoint for sending custom notifications (organizer only)
app.post('/send-notification', authenticateToken, checkRole('organizer'), async (req, res) => {
    const { subject, message, recipientEmails } = req.body;

    if (!subject || !message) {
        return res.status(400).json({ error: 'Subject and message are required.' });
    }

    try {
        let emailsToNotify = recipientEmails;

        // If no specific recipients, send to all participants
        if (!emailsToNotify || emailsToNotify.length === 0) {
            emailsToNotify = users
                .filter(user => user.role === 'participant')
                .map(user => user.email);
        }

        let successCount = 0;
        let failureCount = 0;

        for (const email of emailsToNotify) {
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">${subject}</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <p>Best regards,<br>Virtual Event Management Team</p>
                </div>
            `;

            const success = await sendEmail(email, subject, htmlContent);
            if (success) {
                successCount++;
            } else {
                failureCount++;
            }
        }

        res.json({
            message: `Notifications sent successfully to ${successCount} recipients. ${failureCount} failed.`,
            successCount,
            failureCount
        });

    } catch (error) {
        res.status(500).json({ error: 'Error sending notifications.' });
    }
});

// Endpoint to get email status for debugging
app.get('/email-status', authenticateToken, checkRole('organizer'), async (req, res) => {
    try {
        // Test email configuration
        await transporter.verify();
        res.json({
            status: 'Email service is configured correctly',
            emailUser: process.env.EMAIL_USER || 'Not set (using default)'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Email service configuration error',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Email notifications are enabled');
});
