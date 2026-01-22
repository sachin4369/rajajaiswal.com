import { NextRequest, NextResponse } from 'next/server';
import { ContactFormData } from '@/types';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, mobile, productName, message } = body;

    // Validate required fields
    if (!name || !email || !mobile || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get Gmail credentials from environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'sachinchohi@gmail.com';

    // Check if email credentials are configured
    if (!gmailUser || !gmailAppPassword) {
      console.error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
      // In development, just log the data
      console.log('Contact Form Submission (not sent - missing credentials):', {
        to: recipientEmail,
        subject: `Contact Form Submission from ${name}${productName ? ` - Product: ${productName}` : ''}`,
        name,
        email,
        mobile,
        productName: productName || 'N/A',
        message,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Your message has been received! (Email sending not configured)',
        },
        { status: 200 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword, // Use App Password, not regular password
      },
    });

    // Email subject
    const subject = `Contact Form Submission from ${name}${productName ? ` - Product: ${productName}` : ''}`;

    // Email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #14b8a6; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #14b8a6; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #14b8a6; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Mobile Number:</div>
                <div class="value">${mobile}</div>
              </div>
              ${productName ? `
              <div class="field">
                <div class="label">Product Name:</div>
                <div class="value">${productName}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the contact form on your website.</p>
              <p>You can reply directly to this email to contact: ${email}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Mobile Number: ${mobile}
${productName ? `Product Name: ${productName}\n` : ''}
Message:
${message}

---
This email was sent from the contact form on your website.
You can reply directly to this email to contact: ${email}
    `;

    // Send email
    const mailOptions = {
      from: `"${name}" <${gmailUser}>`,
      to: recipientEmail,
      replyTo: email, // Allow replying directly to the sender
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    console.log('Contact form email sent successfully to:', recipientEmail);

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Provide more specific error message
    let errorMessage = 'Failed to send message. Please try again later.';
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      // Don't expose internal error details to client
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



