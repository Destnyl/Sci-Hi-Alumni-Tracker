import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirebaseConnection() {
  console.log('🔍 Testing Firebase connection...\n');
  
  // Check if config is loaded
  console.log('Environment variables:');
  console.log(`- API Key: ${firebaseConfig.apiKey ? '✅ Found' : '❌ Missing'}`);
  console.log(`- Auth Domain: ${firebaseConfig.authDomain ? '✅ Found' : '❌ Missing'}`);
  console.log(`- Project ID: ${firebaseConfig.projectId ? '✅ Found' : '❌ Missing'}`);
  console.log(`- Storage Bucket: ${firebaseConfig.storageBucket ? '✅ Found' : '❌ Missing'}`);
  console.log(`- Messaging Sender ID: ${firebaseConfig.messagingSenderId ? '✅ Found' : '❌ Missing'}`);
  console.log(`- App ID: ${firebaseConfig.appId ? '✅ Found' : '❌ Missing'}`);
  
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    console.error('\n❌ Firebase configuration is incomplete!');
    console.error('Please copy .env.example to .env.local and fill in your Firebase values.');
    return;
  }
  
  try {
    // Initialize Firebase
    console.log(`\n🔧 Initializing Firebase app with project: ${firebaseConfig.projectId}`);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Test Firestore connection
    console.log('🔍 Testing Firestore connection...');
    const testRef = collection(db, 'alumni');
    await getDocs(testRef);
    
    console.log('✅ Firebase connection successful!');
    console.log('✅ Firestore database is accessible!');
    console.log('\n🎉 You can now run the migration: npm run migrate-csv');
    
  } catch (error: any) {
    console.error('\n❌ Firebase connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('\n💡 Possible solutions:');
      console.error('1. Make sure Firestore Database is enabled in Firebase Console');
      console.error('2. Check Firestore Security Rules (they might be too restrictive)');
      console.error('3. Go to: https://console.firebase.google.com/project/' + firebaseConfig.projectId + '/firestore');
    }
    
    if (error.code === 'not-found' || error.message.includes('NOT_FOUND')) {
      console.error('\n💡 Possible solutions:');
      console.error('1. Verify your Firebase project ID is correct');
      console.error('2. Make sure Firestore Database is created in Firebase Console');
      console.error('3. Go to: https://console.firebase.google.com/project/' + firebaseConfig.projectId + '/firestore');
      console.error('4. Click "Create database" if you see that option');
    }
    
    if (error.message.includes('API key not valid')) {
      console.error('\n💡 Possible solutions:');
      console.error('1. Check if your API key is correct');
      console.error('2. Make sure the API key is not restricted to specific domains');
      console.error('3. Go to: https://console.firebase.google.com/project/' + firebaseConfig.projectId + '/settings/general');
    }
  }
}

// Run the test
testFirebaseConnection();