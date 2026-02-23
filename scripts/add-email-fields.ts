import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addEmailFieldsToAlumni() {
  console.log('📧 Adding email fields to existing alumni records...');

  try {
    // Get all alumni
    const alumniRef = collection(db, 'alumni');
    const querySnapshot = await getDocs(alumniRef);
    
    console.log(`Found ${querySnapshot.docs.length} alumni records to update.`);

    let updateCount = 0;
    
    for (const docSnap of querySnapshot.docs) {
      const alumniData = docSnap.data();
      
      // Check if email field already exists
      if (!alumniData.email) {
        // Generate a placeholder email based on name
        const name = alumniData.name || 'alumni';
        const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const placeholderEmail = `${sanitizedName}@placeholder.edu`;
        
        await updateDoc(doc(db, 'alumni', docSnap.id), {
          email: placeholderEmail,
          emailVerified: false,
          needsEmailUpdate: true,
        });
        
        updateCount++;
        console.log(`✅ Updated ${alumniData.name} with placeholder email: ${placeholderEmail}`);
      } else {
        console.log(`⏭️  ${alumniData.name} already has email: ${alumniData.email}`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updateCount} alumni records with email fields.`);
    console.log('\n📝 Next Steps:');
    console.log('1. Contact each alumni to get their real email addresses');
    console.log('2. Update their records in the registrar dashboard');
    console.log('3. Set emailVerified: true when real email is confirmed');
    console.log('4. Remove needsEmailUpdate flag when email is verified');
    
  } catch (error) {
    console.error('❌ Error updating alumni records:', error);
  }
}

// Run the migration
addEmailFieldsToAlumni();