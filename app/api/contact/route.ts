import { NextRequest, NextResponse } from 'next/server';
import { ContactFormData } from '@/types';

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

    // In a production environment, you would send the email here
    // For example, using Resend, SendGrid, or Nodemailer
    // 
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@yourdomain.com',
    //   to: 'sachinchohi@gmail.com',
    //   subject: `Contact Form Submission from ${name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Mobile:</strong> ${mobile}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `,
    // });

    // For now, we'll log the data and return success
    // In production, replace this with actual email sending
    console.log('Contact Form Submission:', {
      to: 'sachinchohi@gmail.com',
      subject: `Contact Form Submission from ${name}${productName ? ` - Product: ${productName}` : ''}`,
      name,
      email,
      mobile,
      productName: productName || 'N/A',
      message,
    });

    // Simulate email sending (remove in production)
    // You should implement actual email sending here
    // The email should be sent to: sachinchohi@gmail.com
    // Subject: Contact Form Submission from [Name]

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}



