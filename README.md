# USR Builders Website

A professional construction company website with SMTP email functionality for contact form submissions.

## Features

- ✅ Responsive design for all devices
- ✅ Contact form with SMTP email integration
- ✅ Hero slider with multiple images
- ✅ Project portfolio with filtering
- ✅ Client testimonials carousel
- ✅ Service showcase
- ✅ Smooth scrolling and animations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `nodemailer` - For sending emails via SMTP
- `dotenv` - For environment variable management

### 2. Configure SMTP Email Settings

#### Copy the example environment file:

```bash
copy .env.example .env
```

#### Edit the `.env` file with your SMTP credentials:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password-here
MAIL_FROM=your-email@gmail.com
MAIL_TO=recipient@gmail.com
```

### 3. Gmail SMTP Setup (Recommended)

If you're using Gmail, follow these steps:

#### Option 1: Using App Password (Recommended)

1. **Enable 2-Step Verification:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "USR Builders Website"
   - Copy the 16-character password (remove spaces)
   - Use this as `MAIL_PASSWORD` in your `.env` file

3. **Update .env file:**
   ```env
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASSWORD=abcd-efgh-ijkl-mnop
   MAIL_FROM=your-email@gmail.com
   MAIL_TO=recipient@gmail.com
   ```

#### Option 2: Less Secure Apps (Not Recommended)

⚠️ **Not recommended for security reasons**

1. Go to [Less Secure App Access](https://myaccount.google.com/lesssecureapps)
2. Turn ON "Allow less secure apps"
3. Use your regular Gmail password

### 4. Alternative SMTP Providers

#### Outlook/Hotmail:
```env
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USER=your-email@outlook.com
MAIL_PASSWORD=your-password
```

#### Yahoo Mail:
```env
MAIL_HOST=smtp.mail.yahoo.com
MAIL_PORT=587
MAIL_USER=your-email@yahoo.com
MAIL_PASSWORD=your-app-password
```

#### SendGrid (Free Tier Available):
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_FROM=verified-sender@yourdomain.com
```

#### Mailgun:
```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USER=postmaster@your-domain.mailgun.org
MAIL_PASSWORD=your-mailgun-password
```

### 5. Run the Server

#### Development:
```bash
npm start
```

The server will start at `http://localhost:3001`

#### Production:
Set the `PORT` environment variable in your hosting platform.

### 6. Test the Contact Form

1. Open the website in your browser
2. Navigate to the Contact section
3. Fill in the contact form
4. Submit the form
5. Check the recipient email inbox

## Deployment

### Netlify/Vercel Deployment

1. **Add Environment Variables:**
   - Go to your Netlify/Vercel dashboard
   - Navigate to Site Settings > Environment Variables
   - Add all the `MAIL_*` variables from your `.env` file

2. **Configure Build Settings:**
   - Build command: (leave empty)
   - Publish directory: `/`

3. **Serverless Function Setup:**
   - For Netlify: The server will run as a serverless function
   - For Vercel: Uses `vercel.json` configuration

### Traditional Hosting (VPS/Shared Hosting)

1. Upload all files to your server
2. Create `.env` file with your SMTP settings
3. Run `npm install`
4. Start the server: `npm start`
5. Use a process manager like PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "usr-builders"
   pm2 save
   ```

## File Structure

```
usr-builders-website/
├── index.html          # Main HTML file
├── style.css           # Styles
├── script.js           # Frontend JavaScript
├── server.js           # Node.js server with SMTP
├── package.json        # Dependencies
├── .env                # Environment variables (create from .env.example)
├── .env.example        # Example environment file
├── netlify.toml        # Netlify configuration
├── vercel.json         # Vercel configuration
└── images/             # Project images
```

## API Endpoints

### POST /api/send-email

Sends an email via SMTP.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "email": "john@example.com",
  "service": "residential",
  "budget": "50l-1cr",
  "message": "I need a 3BHK villa construction"
}
```

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

**Error Response:**
```json
{
  "message": "Error description"
}
```

## Troubleshooting

### Email not sending?

1. **Check SMTP credentials:**
   - Verify email and password are correct
   - Ensure App Password is used (for Gmail)

2. **Check firewall/port:**
   - Port 587 must be open
   - Try port 465 with `secure: true` option

3. **Check server logs:**
   - Look for error messages in terminal
   - Check `console.error` output

4. **Gmail specific issues:**
   - Enable 2-Step Verification
   - Generate new App Password
   - Check "Less secure app access" is OFF (use App Passwords instead)

5. **Test SMTP connection:**
   Add this test code to `server.js`:
   ```javascript
   transporter.verify(function(error, success) {
     if (error) {
       console.log('SMTP Error:', error);
     } else {
       console.log('SMTP Server is ready');
     }
   });
   ```

### Form not submitting?

1. Check browser console for JavaScript errors
2. Verify the server is running
3. Check network tab for API call status
4. Ensure all required fields are filled

## Security Notes

- ⚠️ Never commit `.env` file to version control
- ✅ Use environment variables for sensitive data
- ✅ Use App Passwords instead of regular passwords
- ✅ Keep dependencies updated: `npm update`

## Support

For issues or questions:
- Email: ram84718@gmail.com
- Phone: +91 99760 67769

## License

© 2026 USR Builders. All Rights Reserved.
