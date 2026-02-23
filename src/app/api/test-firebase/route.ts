import { NextResponse } from "next/server";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔧 Testing Firebase in Next.js environment...');
    
    // Check environment variables
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };
    
    console.log('Environment check:', {
      apiKey: config.apiKey ? '✅ Found' : '❌ Missing',
      projectId: config.projectId ? '✅ Found' : '❌ Missing',
    });
    
    if (!config.apiKey || !config.projectId) {
      return NextResponse.json({
        error: 'Firebase configuration missing',
        config: {
          apiKey: config.apiKey ? 'Found' : 'Missing',
          projectId: config.projectId ? 'Found' : 'Missing',
        }
      }, { status: 500 });
    }
    
    // Test Firestore connection
    console.log('🔍 Testing Firestore query...');
    const alumniRef = collection(db, 'test-connection');
    await getDocs(alumniRef);
    
    console.log('✅ Firebase connection successful in Next.js!');
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      projectId: config.projectId,
    });
    
  } catch (error: any) {
    console.error('❌ Firebase connection error:', error);
    
    return NextResponse.json({
      error: 'Firebase connection failed',
      message: error.message,
      code: error.code,
    }, { status: 500 });
  }
}