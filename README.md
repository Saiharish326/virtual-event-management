# Virtual Event Management API with Email Notifications

A comprehensive REST API for managing virtual events with integrated email notification system, built with Node.js, Express, and Nodemailer.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication system
  - Role-based access control (organizer/participant)
  - Secure password hashing with bcrypt
  - Token expiration management

- **Event Management**
  - Create, view, and manage virtual events
  - Event registration system
  - Participant tracking
  - Event details (name, description, date, time)

- **Email Notification System**
  - Welcome emails for new user registrations
  - Event registration confirmations
  - New event announcements to all participants
  - Custom notification system for organizers
  - Professional HTML email templates
  - Gmail SMTP integration

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Authentication**: JWT, bcrypt
- **Email Service**: Nodemailer
- **Environment Management**: dotenv
- **Development**: nodemon

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gmail account with 2FA enabled
- Gmail App Password

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd virtual-event-management

# Install dependencies
npm install
```

### 2. Environment Configuration

#### Step 1: Create Environment File
```bash
# Copy the example environment file
cp env.example .env
```

#### Step 2: Configure Gmail Credentials
Edit `.env` file with your Gmail credentials:
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=3000

# JWT Secret (for production, use a strong secret)
JWT_SECRET=your-secret-key
```

#### Step 3: Generate Gmail App Password
1. Enable 2-factor authentication on your Google account
2. Go to [Google Account Settings](https://myaccount.google.com/security)
3. Navigate to Security → App Passwords
4. Generate an app password for "Mail"
5. Use this password in the `EMAIL_PASS` field

### 3. Run the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on port 3000 with email notifications enabled.

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### User Registration
```http
POST /users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "participant"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Welcome email sent!"
}
```

#### User Login
```http
POST /users/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Event Endpoints

#### Create New Event (Organizer Only)
```http
POST /create-events
Authorization: Bearer <organizer-token>
Content-Type: application/json

{
  "name": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-03-15",
  "time": "09:00"
}
```

**Response:**
```json
{
  "message": "Event created successfully. Notifications sent to all participants!",
  "event": {
    "id": 3,
    "name": "Tech Conference 2025",
    "description": "Annual technology conference",
    "date": "2025-03-15",
    "time": "09:00",
    "participants": []
  }
}
```

#### List All Events
```http
GET /events
Authorization: Bearer <user-token>
```

#### Register for Event
```http
POST /register-for-event
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "eventId": 1
}
```

**Response:**
```json
{
  "message": "Registered for event successfully. Confirmation email sent!"
}
```

### Notification Endpoints

#### Send Custom Notification (Organizer Only)
```http
POST /send-notification
Authorization: Bearer <organizer-token>
Content-Type: application/json

{
  "subject": "Important Update",
  "message": "Event schedule has been updated. Please check your dashboard.",
  "recipientEmails": ["user1@example.com", "user2@example.com"]
}
```

**Note:** If `recipientEmails` is not provided, notification will be sent to all participants.

#### Check Email Service Status (Organizer Only)
```http
GET /email-status
Authorization: Bearer <organizer-token>
```

## 📧 Email Notification System

### 1. Welcome Email
- **Trigger**: User registration
- **Content**: Platform introduction, available features, next steps
- **Recipient**: Newly registered user

### 2. Event Registration Confirmation
- **Trigger**: User registers for an event
- **Content**: Event details, confirmation message, reminder notice
- **Recipient**: Event registrant

### 3. New Event Announcement
- **Trigger**: Organizer creates a new event
- **Content**: Event details, registration prompt
- **Recipient**: All participants

### 4. Custom Notifications
- **Trigger**: Manual notification by organizer
- **Content**: Custom subject and message
- **Recipient**: Specified users or all participants

## 🧪 Testing the API

### Using cURL

#### 1. Test User Registration
```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "participant"
  }'
```

#### 2. Test User Login
```bash
curl -X POST http://localhost:3000/users/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. Test Event Creation (with token)
```bash
curl -X POST http://localhost:3000/create-events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Event",
    "description": "Test Description",
    "date": "2025-01-15",
    "time": "14:00"
  }'
```

### Using Postman

1. Import the endpoints into Postman
2. Set the base URL: `http://localhost:3000`
3. Use the token from login response in Authorization header
4. Test each endpoint with appropriate data

## 🔧 Configuration Options

### Email Service Configuration

#### Gmail (Default)
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

#### Custom SMTP Server
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.yourdomain.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `EMAIL_USER` | Gmail email address | - | Yes |
| `EMAIL_PASS` | Gmail app password | - | Yes |
| `PORT` | Server port | 3000 | No |
| `JWT_SECRET` | JWT signing secret | 'secret' | No |

## 🚨 Troubleshooting

### Common Email Issues

#### 1. Authentication Failed
**Error**: `Invalid credentials`
**Solution**: 
- Verify your Gmail app password
- Ensure 2FA is enabled
- Check if account is locked

#### 2. Connection Timeout
**Error**: `Connection timeout`
**Solution**:
- Check internet connection
- Verify Gmail SMTP settings
- Try different port (587 or 465)

#### 3. Quota Exceeded
**Error**: `Quota exceeded`
**Solution**:
- Gmail has daily sending limits
- Wait for quota reset or upgrade account
- Consider using dedicated email service

### Debugging Steps

1. **Check Email Status Endpoint**
   ```bash
   GET /email-status
   ```

2. **Verify Environment Variables**
   ```bash
   echo $EMAIL_USER
   echo $EMAIL_PASS
   ```

3. **Check Server Logs**
   - Look for email-related console messages
   - Verify transporter verification

4. **Test SMTP Connection**
   ```javascript
   // Add this to your code for testing
   transporter.verify((error, success) => {
       if (error) {
           console.log('SMTP Error:', error);
       } else {
           console.log('SMTP Server is ready');
       }
   });
   ```

## 🔒 Security Considerations

### Production Security
- Use strong JWT secrets
- Implement rate limiting
- Add request validation
- Use HTTPS
- Monitor API usage

### Email Security
- Never expose credentials in code
- Use environment variables
- Implement email rate limiting
- Monitor for abuse

## 🚀 Production Deployment

### Recommended Email Services
- **SendGrid**: High deliverability, good for production
- **AWS SES**: Cost-effective, scalable
- **Mailgun**: Developer-friendly, good API
- **Postmark**: Transactional email specialist

### Environment Setup
```bash
# Production environment
NODE_ENV=production
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-password
JWT_SECRET=your-super-secure-secret
PORT=3000
```

### Performance Optimization
- Implement email queuing
- Add retry logic for failed emails
- Use email templates
- Monitor delivery rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.


---

**Happy Coding! 🎉**

For more information, check the inline code comments in `app.js` or create an issue for questions.
