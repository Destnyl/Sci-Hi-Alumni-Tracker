import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, connectFirestoreEmulator, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
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

// Validate configuration
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.error('❌ Firebase configuration is missing!');
  console.error('Please make sure you have copied .env.example to .env.local and filled in your Firebase values.');
  process.exit(1);
}

console.log(`🔧 Using Firebase project: ${firebaseConfig.projectId}`);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type CSVAlumni = {
  Name?: string;
  Strand?: string;
  SHSSection?: string;
  CollegeCourse?: string;
  CredentialsInField?: string;
};

async function migrateCsvToFirebase() {
  try {
    console.log('🚀 Starting CSV to Firebase migration...');
    
    // Test Firestore connection first
    console.log('🔍 Testing Firestore connection...');
    const testRef = collection(db, 'alumni');
    
    try {
      await getDocs(testRef);
      console.log('✅ Firestore connection successful!');
    } catch (error: any) {
      if (error.code === 'not-found' || error.message.includes('NOT_FOUND')) {
        console.error('❌ Firestore database not found!');
        console.error('💡 Please create Firestore database in Firebase Console:');
        console.error(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
        console.error('   Click "Create database" and choose "Start in test mode"');
        return;
      }
      throw error;
    }

    // Clear existing CSV migrated records
    console.log('🧹 Clearing previous CSV migrated data...');
    try {
      const alumniRef = collection(db, 'alumni');
      const csvMigratedQuery = query(alumniRef, where('reviewedBy', '==', 'CSV Migration'));
      const existingDocs = await getDocs(csvMigratedQuery);
      let deletedCount = 0;
      for (const doc of existingDocs.docs) {
        await deleteDoc(doc.ref);
        deletedCount++;
      }
      if (deletedCount > 0) {
        console.log(`✓ Deleted ${deletedCount} previous CSV migrated records`);
      }
    } catch (error) {
      console.warn('⚠️  Could not clear previous records (may be first run):', error);
    }
    
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'data', 'alumni.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found at:', csvPath);
      console.log('💡 Make sure you have a CSV file with alumni data at data/alumni.csv');
      return;
    }

    const fileBuffer = fs.readFileSync(csvPath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const csvData = XLSX.utils.sheet_to_json<CSVAlumni>(sheet);

    console.log(`📄 Found ${csvData.length} alumni records in CSV`);

    // Create a reference to the alumni collection
    const alumniRef = collection(db, 'alumni');

    let successCount = 0;
    let errorCount = 0;

    // Add each alumni record to Firestore
    for (const alumni of csvData) {
      try {
        if (!alumni.Name || !alumni.Strand) {
          console.warn('Skipping invalid record:', alumni);
          errorCount++;
          continue;
        }

        const firestoreAlumni = {
          name: alumni.Name,
          strand: alumni.Strand || '',
          shsSection: alumni.SHSSection || '',
          collegeCourse: alumni.CollegeCourse || '',
          currentOccupation: alumni.CredentialsInField || '',
          credentialsInField: alumni.CredentialsInField || '',
          status: 'approved', // Existing CSV data is auto-approved
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          reviewedAt: serverTimestamp(),
          reviewedBy: 'CSV Migration',
        };

        await addDoc(alumniRef, firestoreAlumni);
        successCount++;
        console.log(`✓ Added: ${alumni.Name} (${alumni.Strand})`);
      } catch (error) {
        console.error(`✗ Error adding ${alumni.Name}:`, error);
        errorCount++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Successfully migrated: ${successCount} records`);
    console.log(`Errors: ${errorCount} records`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateCsvToFirebase();