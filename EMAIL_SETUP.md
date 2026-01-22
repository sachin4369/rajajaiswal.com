# Email Setup Guide for Contact Form

This guide explains how to configure Gmail to send emails from your contact form.

## Prerequisites

1. A Gmail account
2. 2-Step Verification enabled on your Google Account

## Step-by-Step Setup

### 1. Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the prompts to enable it

### 2. Generate an App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter "Next.js Contact Form" as the name
5. Click **Generate**
6. Copy the 16-character password (you'll see it only once)

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Your Gmail address (the one sending emails)
GMAIL_USER=your-email@gmail.com

# Gmail App Password (the 16-character password from step 2)
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Recipient email (where contact form submissions will be sent)
RECIPIENT_EMAIL=sachinchohi@gmail.com
```

**Important Notes:**
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Remove spaces from the App Password if you copy it with spaces
- The App Password is different from your regular Gmail password

### 4. Restart Your Development Server

After creating `.env.local`, restart your Next.js development server:

```bash
npm run dev
```

## Testing

1. Fill out the contact form on your website
2. Submit the form
3. Check the recipient email inbox for the submission
4. Check the server console for any errors

## Troubleshooting

### "Invalid login" error
- Make sure you're using the App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check that there are no extra spaces in the App Password

### "Less secure app access" error
- This shouldn't happen with App Passwords
- Make sure you're using an App Password, not your regular password

### Emails not sending
- Check the server console for error messages
- Verify all environment variables are set correctly
- Make sure `.env.local` is in the root directory
- Restart the development server after changing environment variables

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables in your hosting platform's dashboard
2. Go to your project settings → Environment Variables
3. Add:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `RECIPIENT_EMAIL` (optional, defaults to sachinchohi@gmail.com)

## Alternative: Using Other Email Services

If you prefer not to use Gmail, you can modify `app/api/contact/route.ts` to use:
- **Resend**: Modern email API (recommended for production)
- **SendGrid**: Enterprise email service
- **Mailgun**: Transactional email service
- **AWS SES**: Amazon's email service

