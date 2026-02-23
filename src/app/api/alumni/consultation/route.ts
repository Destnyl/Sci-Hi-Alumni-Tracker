import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, addDoc, Timestamp, query, where, orderBy, getDocs } from 'firebase/firestore';

// POST - Send consultation request email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      alumniId,
      studentName,
      studentEmail,
      studentContact,
      researchTitle,
      researchDescription,
      consultationNeeds,
      expectedDuration,
      senderName,
    } = body;

    // Validate required fields
    if (!alumniId || !studentName || !studentEmail || !researchTitle || !consultationNeeds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Brevo API key is configured
    if (!process.env.BREVO_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured. Please set BREVO_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Get alumni details from Firestore
    const alumniRef = doc(db, 'alumni', alumniId);
    const alumniSnap = await getDoc(alumniRef);

    if (!alumniSnap.exists()) {
      return NextResponse.json(
        { error: 'Alumni not found' },
        { status: 404 }
      );
    }

    const alumniData = alumniSnap.data();
    
    // Check if alumni has email
    if (!alumniData.email || alumniData.email.trim() === '') {
      return NextResponse.json(
        { error: 'Alumni email not found. Please update alumni record with an email address.' },
        { status: 400 }
      );
    }

    // Create email HTML content
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <header style="background: linear-gradient(135deg, #B23B3B, #8B2E2E); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Research Consultation Request</h1>
          <p style="margin: 10px 0 0; font-size: 14px;">Alumni Expert Consultation Program</p>
        </header>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Dear <strong>${alumniData.name}</strong>,
          </p>
          
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            We hope this message finds you well. We are reaching out to invite you to serve as a consultant for one of our students' research projects. Your expertise in <strong>${alumniData.collegeCourse}</strong> and experience as a <strong>${alumniData.currentOccupation}</strong> makes you an ideal candidate to guide and mentor our student researcher.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #B23B3B;">
            <h3 style="color: #B23B3B; margin-top: 0;">Research Project Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Research Title:</td>
                <td style="padding: 8px 0; color: #333;">${researchTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Student Researcher:</td>
                <td style="padding: 8px 0; color: #333;">${studentName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Duration:</td>
                <td style="padding: 8px 0; color: #333;">${expectedDuration || 'To be discussed'}</td>
              </tr>
            </table>
          </div>
          
          ${researchDescription ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #B23B3B; margin-top: 0;">Research Description</h4>
            <p style="color: #555; line-height: 1.6; margin: 0;">${researchDescription}</p>
          </div>
          ` : ''}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #B23B3B; margin-top: 0;">What We Need From You</h4>
            <p style="color: #555; line-height: 1.6; margin: 0;">${consultationNeeds}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF7F27;">
            <h4 style="color: #FF7F27; margin-top: 0;">Student Contact Information</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${studentName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
                <td style="padding: 8px 0; color: #333;"><a href="mailto:${studentEmail}" style="color: #B23B3B;">${studentEmail}</a></td>
              </tr>
              ${studentContact ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Contact:</td>
                <td style="padding: 8px 0; color: #333;">${studentContact}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #555; margin-bottom: 20px;">
              If you are interested in participating in this research consultation, please contact the student directly using the information provided above.
            </p>
            <div style="background: #e8f5e8; border: 1px solid #4CAF50; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                📧 Simply reply to this email or reach out directly to ${studentName} at ${studentEmail}
              </p>
            </div>
          </div>
          
          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Your participation would be invaluable in helping our student conduct meaningful research and develop their academic and professional skills. We appreciate your continued connection to our institution and your willingness to support the next generation of researchers.
          </p>
          
          <p style="font-size: 14px; color: #555; margin-top: 30px;">
            Best regards,<br>
            <strong>${senderName || 'School Registrar'}</strong><br>
            <em>Alumni Relations & Research Coordination</em>
          </p>
        </div>
        
        <footer style="background: #333; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">This email was sent as part of our Alumni Expert Consultation Program</p>
          <p style="margin: 5px 0 0;">© 2026 Alumni Tracking System</p>
        </footer>
      </div>
    `;

    // Send email using Brevo API
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [{ email: alumniData.email }],
          sender: { name: 'Alumni Research', email: 'noreply@alumni.scihi.com' },
          subject: `Research Consultation Request - ${researchTitle}`,
          htmlContent: emailHTML,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error sending email via Brevo:', error);
        return NextResponse.json(
          { error: 'Failed to send consultation request email', details: error.message || 'Unknown error' },
          { status: 500 }
        );
      }
    } catch (emailError: any) {
      console.error('Error sending email via Brevo:', emailError);
      return NextResponse.json(
        { error: 'Failed to send consultation request email', details: emailError.message || 'Unknown error' },
        { status: 500 }
      );
    }

    // Log the consultation request in Firestore
    await addDoc(collection(db, 'consultationRequests'), {
      alumniId,
      alumniName: alumniData.name,
      alumniEmail: alumniData.email,
      studentName,
      studentEmail,
      studentContact: studentContact || '',
      researchTitle,
      researchDescription: researchDescription || '',
      consultationNeeds,
      expectedDuration: expectedDuration || '',
      senderName: senderName || 'School Registrar',
      sentAt: Timestamp.now(),
      status: 'sent',
    });

    return NextResponse.json({
      success: true,
      message: `Consultation request sent successfully to ${alumniData.name} at ${alumniData.email}`,
    });

  } catch (error: any) {
    console.error('Error sending consultation request:', error);
    
    let errorMessage = 'Failed to send consultation request';
    
    if (error.message?.includes('configuration missing')) {
      errorMessage = 'Email service not configured. Please contact administrator.';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch consultation request history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alumniId = searchParams.get('alumniId');

    const consultationRequestsRef = collection(db, 'consultationRequests');
    
    try {
      let querySnapshot;

      if (alumniId) {
        // Get requests for specific alumni
        const q = query(
          consultationRequestsRef,
          where('alumniId', '==', alumniId),
          orderBy('sentAt', 'desc')
        );
        querySnapshot = await getDocs(q);
      } else {
        // Get all consultation requests
        const q = query(consultationRequestsRef, orderBy('sentAt', 'desc'));
        querySnapshot = await getDocs(q);
      }

      const consultationRequests = querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json(consultationRequests);
    } catch (firestoreError: any) {
      // If collection doesn't exist, return empty array
      if (firestoreError.code === 'not-found' || firestoreError.message?.includes('does not exist')) {
        console.log('Consultation requests collection not found, returning empty array');
        return NextResponse.json([]);
      }
      throw firestoreError;
    }

  } catch (error: any) {
    console.error('Error fetching consultation requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultation requests', details: error.message },
      { status: 500 }
    );
  }
}