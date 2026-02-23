import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

  console.log('🧪 Email Test - Configuration Check:');
  console.log('   API Key exists:', !!BREVO_API_KEY ? '✓' : '✗');
  console.log('   Sender email:', BREVO_SENDER_EMAIL);

  if (!BREVO_API_KEY) {
    return NextResponse.json(
      { error: 'BREVO_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    // Test basic connection with Brevo
    const testResponse = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': BREVO_API_KEY,
      },
    });

    const accountData = await testResponse.json();
    
    if (!testResponse.ok) {
      console.error('❌ Brevo API Error:', accountData);
      return NextResponse.json(
        {
          error: 'Failed to authenticate with Brevo API',
          details: accountData,
          status: testResponse.status,
        },
        { status: 500 }
      );
    }

    console.log('✅ Brevo API connection successful');
    console.log('   Account email:', accountData.email);
    console.log('   Account name:', accountData.companyName);

    return NextResponse.json({
      success: true,
      message: 'Brevo API is working',
      account: {
        email: accountData.email,
        companyName: accountData.companyName,
      },
    });
  } catch (error: any) {
    console.error('❌ Error testing Brevo:', error.message);
    return NextResponse.json(
      {
        error: 'Failed to test Brevo API',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
