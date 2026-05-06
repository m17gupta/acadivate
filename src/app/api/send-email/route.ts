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

    } catch (verifyError) {

      throw verifyError;
    }

    const isContactForm = data.formType === 'Contact Enquiry';
    const isStatusUpdate = data.type === 'status_update';

    const isRegistration = data.type === 'registration';

    if (isRegistration) {
      const regMailOptions = {
        from: `"Acadivate" <${process.env.SMTP_FROM}>`,
        to: data.email,
        cc: [
          "mail2deepakrai@gmail.com",
          "info@acadivate.com",
          "dev.manish.gupta17@gmail.com"
        ],
        subject: data.alreadyExists ? `Login Credentials: Acadivate Portal` : `Registration Successful: Acadivate Portal`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #2563eb; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800;">${data.alreadyExists ? 'Welcome Back!' : 'Registration Successful!'}</h1>
              <p style="margin-top: 8px; opacity: 0.9; font-size: 14px;">Acadivate Award Nomination Portal</p>
            </div>
            <div style="padding: 30px; background-color: white;">
              <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>${data.fullName}</strong>,</p>
              <p style="font-size: 15px; color: #475569; margin-bottom: 24px;">
                ${data.alreadyExists
            ? 'It looks like you are already registered with us. Here are your login credentials to access your nominations.'
            : 'Your account has been created successfully. You can now log in to the Acadivate portal using the credentials below to view and manage your nominations.'}
              </p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 30px 0;">
                <div style="margin-bottom: 15px;">
                  <span style="display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Email Address</span>
                  <span style="font-size: 16px; font-weight: 600; color: #1e293b;">${data.email}</span>
                </div>
                <div>
                  <span style="display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Password</span>
                  <span style="font-size: 16px; font-weight: 600; color: #1e293b;">${data.password}</span>
                </div>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                <a href="https://acadivate.com/login" style="background-color: #2563eb; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">Login to Portal</a>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                If you have any questions, please feel free to reach out to our support team at info@acadivate.com.
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
      await transporter.sendMail(regMailOptions);
      return NextResponse.json({ success: true });
    }

    if (isStatusUpdate) {
      const statusMailOptions = {
        from: `"Acadivate" <${process.env.SMTP_FROM}>`,
       cc: [
          "mail2deepakrai@gmail.com",
          "info@acadivate.com",
          "dev.manish.gupta17@gmail.com"
        ],
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
      subject: `${isContactForm ? "New Contact Enquiry" : "New Award Nomination"}: ${data.orgName}`,
      attachments: data.pdfAttachment ? [
        {
          filename: data.pdfFileName || "Nomination_Form.pdf",
          content: data.pdfAttachment,
          encoding: "base64",
        }
      ] : [],
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 700px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">${isContactForm ? "Contact Enquiry" : "Award Nomination"}</h1>
            <p style="margin-top: 8px; opacity: 0.8; font-size: 14px;">Submission received on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          
          <div style="padding: 40px; background-color: white;">
            <p style="font-size: 16px; color: #475569; margin-bottom: 30px;">A new ${isContactForm ? "enquiry" : "nomination"} has been submitted with the following details:</p>
            
            <h3 style="color: #0f172a; border-left: 4px solid #2563eb; padding-left: 12px; margin-bottom: 20px; font-size: 18px;">Candidate Information</h3>
            <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 40px; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden;">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; width: 35%; font-size: 13px; text-transform: uppercase;">Organization</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600;">${data.orgName}</td>
              </tr>
              <tr>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase;">Promoter</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.promoter}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase;">Ownership</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.ownership || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase;">Email</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #2563eb; font-weight: 500;">${data.email}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase;">Mobile</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.mobile || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase;">Website</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #2563eb;">${data.website ? `<a href="${data.website}" style="color: #2563eb; text-decoration: none;">${data.website}</a>` : "N/A"}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase;">GSTIN</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.gstin || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #64748b; font-size: 13px; text-transform: uppercase;">Address</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${data.address}<br>${data.city}, ${data.state}, ${data.country || "India"}</td>
              </tr>
              <tr style="background-color: #f0fdf4;">
                <td style="padding: 14px 20px; font-weight: 600; color: #166534; font-size: 13px; text-transform: uppercase;">Payment Details</td>
                <td style="padding: 14px 20px; color: #166534; font-weight: 700; font-size: 18px;">₹${data.totalAmount} <span style="font-size: 12px; font-weight: normal; color: #15803d; margin-left: 8px;">(${data.paymentMode || "Online"})</span></td>
              </tr>
            </table>

            ${!isContactForm ? `
            <h3 style="color: #0f172a; border-left: 4px solid #10b981; padding-left: 12px; margin-bottom: 20px; font-size: 18px;">Selected Categories</h3>
            <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 40px;">
              <ul style="padding-left: 20px; margin: 0; color: #334155;">
                ${[...(data.academicAwards || []), ...(data.startupAwards || []), ...(data.riseAwards || []), ...(data.entrepreneurAwards || [])]
                  .map(award => `<li style="margin-bottom: 8px; font-weight: 500;">${award}</li>`).join("")}
              </ul>
            </div>

            <h3 style="color: #0f172a; border-left: 4px solid #f59e0b; padding-left: 12px; margin-bottom: 20px; font-size: 18px;">Submitted Documents</h3>
            <div style="background: #fffbeb; padding: 25px; border-radius: 12px; border: 1px solid #fef3c7; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                ${[
                  { label: "Research Publications", files: data.researchPublication },
                  { label: "Book Publications", files: data.bookPublication },
                  { label: "Research Projects", files: data.researchProject },
                  { label: "Patent/Policy Documents", files: data.patentPolicyDocument }
                ].map(section => section.files && section.files.length > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #92400e; width: 40%; vertical-align: top;">${section.label}:</td>
                    <td style="padding: 8px 0;">
                      ${section.files.map((file: string, idx: number) => `
                        <a href="${file}" style="display: inline-block; background: #fbbf24; color: #92400e; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: bold; margin-bottom: 4px; margin-right: 4px;">View Doc ${idx + 1}</a>
                      `).join("")}
                    </td>
                  </tr>
                ` : "").join("")}
                ${(!data.researchPublication?.length && !data.bookPublication?.length && !data.researchProject?.length && !data.patentPolicyDocument?.length) ? "<tr><td colspan='2' style='color: #d97706; font-style: italic;'>No documents uploaded.</td></tr>" : ""}
              </table>
            </div>
            ` : ""}
          </div>
          
          <div style="background-color: #f8fafc; color: #64748b; padding: 25px; text-align: center; font-size: 12px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0;">This is an automated message from the <strong>Acadivate Award Portal</strong>.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Acadivate. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Also send a confirmation to the user
    const userMailOptions = {
      from: `"Acadivate" <${process.env.SMTP_FROM}>`,
      to: data.email,
      subject: `${isContactForm ? "Enquiry Received" : "Nomination Received"}: ${data.orgName}`,
      attachments: data.pdfAttachment ? [
        {
          filename: data.pdfFileName || "Nomination_Form.pdf",
          content: data.pdfAttachment,
          encoding: "base64",
        }
      ] : [],
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #2563eb; color: white; padding: 40px 20px; text-align: center;">
            <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="font-size: 30px;">✓</span>
            </div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Thank You!</h1>
            <p style="margin-top: 8px; opacity: 0.9;">Your ${isContactForm ? "enquiry" : "nomination"} has been received.</p>
          </div>
          <div style="padding: 40px; background-color: white;">
            <p style="font-size: 16px; color: #1e293b;">Dear <strong>${data.promoter}</strong>,</p>
            <p style="color: #475569;">We have successfully received your ${isContactForm ? "enquiry" : "award nomination"} for <strong>${data.orgName}</strong>. Our panel will review your submission carefully.</p>
            
            ${!isContactForm ? `
            <div style="margin: 30px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px;">
              <h4 style="margin: 0 0 15px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Submission Summary</h4>
              <p style="margin: 5px 0; color: #475569;"><strong>Amount Paid:</strong> ₹${data.totalAmount}</p>
              <p style="margin: 5px 0; color: #475569;"><strong>Status:</strong> Pending Review</p>
              <p style="margin: 5px 0; color: #475569;"><strong>Categories:</strong> ${(data.academicAwards?.length || 0) + (data.startupAwards?.length || 0) + (data.riseAwards?.length || 0) + (data.entrepreneurAwards?.length || 0)} Selected</p>
            </div>
            <p style="color: #475569; font-size: 14px;">We have attached a copy of your nominal form for your records.</p>
            ` : ""}

            <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #f1f5f9;">
              <p style="font-size: 15px; font-weight: 700; color: #1e293b; margin: 0;">Best Regards,</p>
              <p style="font-size: 15px; color: #64748b; margin: 4px 0 0 0;">Team Acadivate</p>
            </div>
          </div>
          <div style="background-color: #f8fafc; color: #94a3b8; padding: 20px; text-align: center; font-size: 11px;">
            This is an automated notification. Please do not reply directly to this email.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Email Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
