# Virtual Event Management API with Email Notifications

A comprehensive API for managing virtual events with integrated email notification system.

## Features

- User authentication (signup/signin) with JWT
- Role-based access control (organizer/participant)
- Event management (create, view, register)
- **Email notifications for:**
  - User registration confirmation
  - Event registration confirmation
  - New event announcements
  - Custom notifications

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Email Configuration

#### Option A: Using Environment Variables (Recommended)

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your Gmail credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Important:** For Gmail, you need to use an "App Password":
   - Enable 2-factor authentication on your Google account
   - Go to Google Account Settings → Security → App Passwords
   - Generate an app password for "Mail"
   - Use this password in the `EMAIL_PASS` field

#### Option B: Direct Configuration

Edit `app.js` and replace the email configuration:
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
    }
});
```

### 3. Run the Server

```bash
npm run dev
```

The server will start on port 3000 with email notifications enabled.

## API Endpoints

### Authentication
- `POST /users/signup` - User registration (sends welcome email)
- `POST /users/signin` - User login

### Events
- `POST /create-events` - Create new event (organizer only, sends notifications)
- `GET /events` - List all events
- `POST /register-for-event` - Register for event (sends confirmation email)

### Notifications
- `POST /send-notification` - Send custom notifications (organizer only)
- `GET /email-status` - Check email service status (organizer only)

## Email Notification Types

### 1. Welcome Email
- Sent when users register
- Includes platform information and next steps

### 2. Event Registration Confirmation
- Sent when users register for events
- Includes event details and confirmation

### 3. New Event Announcements
- Sent to all participants when new events are created
- Includes event details and registration prompt

### 4. Custom Notifications
- Organizers can send custom messages to participants
- Supports HTML formatting and multiple recipients

## Testing Email Notifications

1. **Test Registration:**
   ```bash
   POST /users/signup
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "role": "participant"
   }
   ```

2. **Test Event Creation:**
   ```bash
   POST /create-events
   Authorization: Bearer <organizer-token>
   {
     "name": "Test Event",
     "description": "Test Description",
     "date": "2025-01-15",
     "time": "14:00"
   }
   ```

3. **Test Custom Notifications:**
   ```bash
   POST /send-notification
   Authorization: Bearer <organizer-token>
   {
     "subject": "Important Update",
     "message": "This is a test notification",
     "recipientEmails": ["user1@example.com", "user2@example.com"]
   }
   ```

## Troubleshooting

### Email Not Sending
1. Check your Gmail credentials in `.env`
2. Ensure 2FA is enabled and app password is generated
3. Check the `/email-status` endpoint for configuration errors
4. Verify your Gmail account allows "less secure app access" (if not using app passwords)

### Common Issues
- **"Invalid credentials"**: Check your app password
- **"Authentication failed"**: Ensure 2FA is enabled
- **"Quota exceeded"**: Gmail has daily sending limits

## Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Consider using environment-specific configurations
- Implement rate limiting for email endpoints in production

## Production Considerations

- Use a dedicated email service (SendGrid, AWS SES, etc.)
- Implement email queuing for high-volume scenarios
- Add email templates and localization
- Monitor email delivery rates and bounces
- Implement retry logic for failed emails
