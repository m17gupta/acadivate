import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Acadivate Nominations" <${process.env.SMTP_FROM}>`,
      to: "info@acadivate.com, vj@codifiedweb.com, user@email.com",
      subject: `New Award Nomination: ${data.orgName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1e293b; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Award Nomination</h1>
          </div>
          <div style="padding: 20px;">
            <p>A new award nomination form has been submitted with the following details:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 40%;">Organization Name</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.orgName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Promoter Name</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.promoter}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Mobile</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.mobile}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Ownership</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.ownership}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Location</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${data.city}, ${data.state}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Total Paid</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #059669;">₹${data.totalAmount}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <h3 style="color: #1e293b;">Selected Awards:</h3>
              <ul style="padding-left: 20px;">
                ${[...data.academicAwards, ...data.startupAwards, ...data.riseAwards, ...data.entrepreneurAwards].map(award => `<li>${award}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div style="background-color: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
            This is an automated message from Acadivate Nomination Portal.
          </div>
        </div>
      `,
    };

    // Also send a confirmation to the user
    const userMailOptions = {
      from: `"Acadivate" <${process.env.SMTP_FROM}>`,
      to: data.email,
      subject: `Nomination Received: ${data.orgName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Your Nomination!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${data.promoter},</p>
            <p>We have received your award nomination for <strong>${data.orgName}</strong>. Our team will review your application and get back to you shortly.</p>
            
            <p><strong>Summary:</strong></p>
            <ul>
              <li>Total Amount Paid: ₹${data.totalAmount}</li>
              <li>Status: Pending Review</li>
            </ul>

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
