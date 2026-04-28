import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();


    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Often needed for Hostinger/Shared hosting
      }
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP Verification Failed:', verifyError);
      throw verifyError;
    }

    const isContactForm = data.formType === 'Contact Enquiry';
    const isStatusUpdate = data.type === 'status_update';

    if (isStatusUpdate) {
      const statusMailOptions = {
        from: `"Acadivate" <${process.env.SMTP_FROM}>`,
        to: data.email,
        subject: `Nomination Status Update: ${data.orgName}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #0f172a; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Status Update</h1>
              <p style="margin-top: 8px; opacity: 0.8; font-size: 14px;">Acadivate Award Nomination Portal</p>
            </div>
            <div style="padding: 30px; background-color: white;">
              <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>${data.promoter}</strong>,</p>
              <p style="font-size: 15px; color: #475569; margin-bottom: 24px;">
                We are writing to inform you that the status of your nomination for <strong>${data.orgName}</strong> has been updated.
              </p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0;">
                <span style="display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">New Nomination Status</span>
                <span style="display: inline-block; font-size: 24px; font-weight: 800; color: #1e293b; text-transform: capitalize; padding: 4px 16px; border-radius: 8px; background-color: #f1f5f9;">
                  ${data.status}
                </span>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                If you have any questions, please feel free to reach out to our support team.
              </p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
                <p style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0;">Best Regards,</p>
                <p style="font-size: 14px; color: #64748b; margin: 4px 0 0 0;">Team Acadivate</p>
              </div>
            </div>
            <div style="background-color: #f8fafc; color: #94a3b8; padding: 20px; text-align: center; font-size: 11px; border-top: 1px solid #f1f5f9;">
              This is an automated notification. Please do not reply directly to this email.
            </div>
          </div>
        `
      };
      await transporter.sendMail(statusMailOptions);
      return NextResponse.json({ success: true });
    }
    
    const mailOptions = {
      from: `"Acadivate Portal" <${process.env.SMTP_FROM}>`,
      to: "info@acadivate.com, vj@codifiedweb.com, user@email.com",
      subject: `${isContactForm ? 'New Contact Enquiry' : 'New Award Nomination'}: ${data.orgName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1e293b; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${isContactForm ? 'Contact Enquiry' : 'Award Nomination'}</h1>
          </div>
          <div style="padding: 20px;">
            <p>A new ${isContactForm ? 'enquiry' : 'nomination'} has been submitted:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 40%;">${isContactForm ? 'Institution' : 'Organization'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.orgName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Name</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.promoter}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Mobile</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.mobile || 'N/A'}</td>
              </tr>
              ${!isContactForm ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Location</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.city}, ${data.state}, ${data.country || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Total Paid</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #059669;">₹${data.totalAmount}</td>
              </tr>
              ` : ''}
            </table>

            <div style="margin-top: 20px;">
              <h3 style="color: #1e293b;">${isContactForm ? 'Message / Enquiry Type' : 'Selected Awards'}:</h3>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                ${isContactForm ? `
                  <strong>Type:</strong> ${data.academicAwards[0]}<br><br>
                  <strong>Message:</strong><br>${data.message}
                ` : `
                  <ul style="padding-left: 20px; margin: 0;">
                    ${[...data.academicAwards, ...data.startupAwards, ...data.riseAwards, ...data.entrepreneurAwards].map(award => `<li>${award}</li>`).join('')}
                  </ul>
                `}
              </div>
            </div>
          </div>
          <div style="background-color: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
            This is an automated message from Acadivate Portal.
          </div>
        </div>
      `,
    };

    // Also send a confirmation to the user
    const userMailOptions = {
      from: `"Acadivate" <${process.env.SMTP_FROM}>`,
      to: data.email,
      subject: `${isContactForm ? 'Enquiry Received' : 'Nomination Received'}: ${data.orgName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thank You!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${data.promoter},</p>
            <p>We have received your ${isContactForm ? 'enquiry' : 'award nomination'} for <strong>${data.orgName}</strong>. Our team will review your ${isContactForm ? 'message' : 'application'} and get back to you shortly.</p>
            
            ${!isContactForm ? `
            <p><strong>Summary:</strong></p>
            <ul>
              <li>Total Amount Paid: ₹${data.totalAmount}</li>
              <li>Status: Pending Review</li>
            </ul>
            ` : ''}

            <p>Best Regards,<br>Team Acadivate</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
