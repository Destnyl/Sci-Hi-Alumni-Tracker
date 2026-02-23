import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

async function updateExistingAlumniStatus() {
  try {
    console.log('🔍 Checking existing alumni records for status field...');
    
    const alumniRef = collection(db, 'alumni');
    const allAlumniSnapshot = await getDocs(alumniRef);
    
    let needsUpdate = 0;
    let alreadyHasStatus = 0;
    
    // Check each record
    for (const docSnapshot of allAlumniSnapshot.docs) {
      const data = docSnapshot.data();
      
      if (!data.status) {
        needsUpdate++;
      } else {
        alreadyHasStatus++;
      }
    }
    
    console.log(`📊 Status Summary:`);
    console.log(`   - Records with status: ${alreadyHasStatus}`);
    console.log(`   - Records needing update: ${needsUpdate}`);
    
    if (needsUpdate === 0) {
      console.log('✅ All alumni records already have status field!');
      return;
    }
    
    console.log('\n🔄 Updating alumni records without status...');
    
    let updated = 0;
    let errors = 0;
    
    // Update records that don't have status
    for (const docSnapshot of allAlumniSnapshot.docs) {
      const data = docSnapshot.data();
      
      if (!data.status) {
        try {
          await updateDoc(doc(db, 'alumni', docSnapshot.id), {
            status: 'approved', // Existing records are automatically approved
            reviewedAt: serverTimestamp(),
            reviewedBy: 'System Migration',
            updatedAt: serverTimestamp()
          });
          
          updated++;
          console.log(`✅ Updated: ${data.name} (${data.strand})`);
        } catch (error) {
          console.error(`❌ Failed to update ${data.name}:`, error);
          errors++;
        }
      }
    }
    
    console.log('\n📈 Update Summary:');
    console.log(`   ✅ Successfully updated: ${updated} records`);
    console.log(`   ❌ Errors: ${errors} records`);
    
    if (errors === 0) {
      console.log('\n🎉 All existing alumni records now have approved status!');
      console.log('💡 New registrations will require approval through the registrar dashboard.');
    }
    
  } catch (error) {
    console.error('❌ Error updating alumni status:', error);
  }
}

// Run the update
updateExistingAlumniStatus();