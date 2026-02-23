import { NextRequest, NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

export async function POST(request: NextRequest) {
  console.log('📧 Send Student Request Email - Starting...');
  
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY not configured');
    return NextResponse.json(
      { error: 'Email service not configured - missing API key' },
      { status: 500 }
    );
  }

  if (!BREVO_SENDER_EMAIL) {
    console.error('❌ BREVO_SENDER_EMAIL not configured');
    return NextResponse.json(
      { error: 'Email service not configured - missing sender email' },
      { status: 500 }
    );
  }

  try {
    const {
      alumniEmail,
      alumniName,
      studentName,
      studentEmail,
      researchTitle,
      consultationNeeds,
    } = await request.json();

    // Log received data for debugging
    console.log('📧 Send Email - Received data:', {
      alumniEmail: alumniEmail ? '✓' : '✗',
      alumniName: alumniName ? '✓' : '✗',
      studentName: studentName ? '✓' : '✗',
      studentEmail: studentEmail ? '✓' : '✗',
      researchTitle: researchTitle ? '✓' : '✗',
      consultationNeeds: consultationNeeds ? '✓' : '✗',
    });

    // Validate required fields
    const missingFields = [];
    if (!alumniEmail) missingFields.push('alumniEmail');
    if (!alumniName) missingFields.push('alumniName');
    if (!studentName) missingFields.push('studentName');
    if (!studentEmail) missingFields.push('studentEmail');
    if (!researchTitle) missingFields.push('researchTitle');
    if (!consultationNeeds) missingFields.push('consultationNeeds');

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields: missingFields 
        },
        { status: 400 }
      );
    }

    // Create professional HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #B23B3B; padding-bottom: 20px;">
          <h1 style="color: #B23B3B; margin: 0; font-size: 24px;">Alumni Research Consultation Request</h1>
          <p style="color: #666; margin: 10px 0 0 0;">A student would like your expertise</p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #FF7F27;">
          <h2 style="color: #B23B3B; margin-top: 0;">Hello ${alumniName},</h2>
          <p style="color: #333; line-height: 1.6; margin: 15px 0;">
            We have a student who believes your expertise would be valuable for their research project and would like to request your consultation.
          </p>
        </div>

        <div style="background-color: #FDF4DD; padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 2px solid #FF7F27;">
          <h3 style="color: #B23B3B; margin-top: 0;">Research Project Details</h3>
          
          <div style="margin-bottom: 15px;">
            <p style="color: #A03E2D; font-weight: bold; margin: 0 0 5px 0;">Research Title</p>
            <p style="color: #333; margin: 0; font-size: 15px;">${researchTitle}</p>
          </div>

          <div style="margin-bottom: 15px;">
            <p style="color: #A03E2D; font-weight: bold; margin: 0 0 5px 0;">How Your Expertise is Needed</p>
            <p style="color: #333; margin: 0; font-size: 15px; white-space: pre-wrap;">${consultationNeeds}</p>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
            <p style="color: #A03E2D; font-weight: bold; margin: 0 0 5px 0;">Student Contact Information</p>
            <p style="color: #333; margin: 5px 0; font-size: 14px;">
              <strong>Name:</strong> ${studentName}
            </p>
            <p style="color: #333; margin: 5px 0; font-size: 14px;">
              <strong>Email:</strong> <a href="mailto:${studentEmail}" style="color: #B23B3B; text-decoration: none;">${studentEmail}</a>
            </p>
          </div>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #A03E2D;">
          <h3 style="color: #B23B3B; margin-top: 0;">Next Steps</h3>
          <p style="color: #333; line-height: 1.6;">
            If you're interested in supporting this student's research, please reach out directly to them using the email address above. If you have any questions or concerns, feel free to contact your school registrar.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
          <p style="margin: 5px 0;">This is an automated message from the Alumni Tracking System</p>
          <p style="margin: 5px 0;">© 2024 School Registrar. All rights reserved.</p>
        </div>
      </div>
    `;

    const textContent = `
Alumni Research Consultation Request

Hello ${alumniName},

We have a student who believes your expertise would be valuable for their research project and would like to request your consultation.

Research Project Details:
- Title: ${researchTitle}
- How Your Expertise is Needed: ${consultationNeeds}
- Student Name: ${studentName}
- Student Email: ${studentEmail}

If you're interested in supporting this student's research, please reach out directly to them. If you have any questions, contact your school registrar.

Thank you,
Alumni Tracking System
    `;

    // Send email via Brevo API
    const senderEmail = BREVO_SENDER_EMAIL;
    console.log('📧 Sending email via Brevo API...');
    console.log('   From:', senderEmail);
    console.log('   To:', alumniEmail);
    console.log('   Subject:', `Research Consultation Request from ${studentName}: ${researchTitle}`);
    
    const emailPayload = {
      sender: {
        email: senderEmail,
        name: 'School Registrar - Alumni Tracking System',
      },
      to: [
        {
          email: alumniEmail,
          name: alumniName,
        },
      ],
      replyTo: {
        email: studentEmail,
        name: studentName,
      },
      subject: `Research Consultation Request from ${studentName}: ${researchTitle}`,
      htmlContent,
      textContent,
    };

    console.log('📧 Email payload prepared, making API call...');

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const responseText = await emailResponse.text();
    console.log(`📧 Brevo API Response Status: ${emailResponse.status}`);
    console.log(`📧 Brevo API Response Body: ${responseText}`);

    if (!emailResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { raw: responseText };
      }
      
      console.error('❌ Brevo API Error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        error: errorData,
      });

      return NextResponse.json(
        { 
          error: 'Failed to send email to alumni',
          brevoStatus: emailResponse.status,
          details: errorData,
        },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully to:', alumniEmail);
    return NextResponse.json({
      message: 'Email sent to alumni successfully',
      success: true,
    });
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message);
    console.error('   Stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
