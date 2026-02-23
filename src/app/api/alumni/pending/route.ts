import { NextResponse } from "next/server";
import { 
  collection, 
  getDocs, 
  doc,
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET - Fetch all pending alumni registrations
export async function GET() {
  try {
    console.log('🔍 Pending Alumni API: Fetching pending registrations...');
    
    const alumniRef = collection(db, 'alumni');
    // Remove orderBy to avoid index requirement - we'll sort on client side
    const pendingQuery = query(
      alumniRef, 
      where('status', '==', 'pending')
    );

    const querySnapshot = await getDocs(pendingQuery);
    
    let pendingAlumni: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      pendingAlumni.push({
        id: doc.id,
        ...data
      });
    });

    // Sort on client side by creation date (newest first)
    pendingAlumni.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    });

    console.log(`✅ Pending Alumni API: Found ${pendingAlumni.length} pending registrations`);
    return NextResponse.json(pendingAlumni);

  } catch (error: any) {
    console.error("❌ Pending Alumni API Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch pending registrations", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Approve or reject a pending registration
export async function POST(request: Request) {
  try {
    const { alumniId, action, reviewedBy } = await request.json();
    
    if (!alumniId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid request. Alumni ID and valid action (approve/reject) required." },
        { status: 400 }
      );
    }

    const alumniDocRef = doc(db, 'alumni', alumniId);
    
    if (action === 'approve') {
      // Update status to approved
      await updateDoc(alumniDocRef, {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        reviewedBy: reviewedBy || 'School Registrar',
        updatedAt: serverTimestamp()
      });

      return NextResponse.json({
        message: "Alumni registration approved successfully!",
        action: 'approved'
      });
    } else {
      // Delete the rejected registration (or you could keep with 'rejected' status)
      await deleteDoc(alumniDocRef);
      
      return NextResponse.json({
        message: "Alumni registration rejected and removed.",
        action: 'rejected'
      });
    }

  } catch (error: any) {
    console.error("❌ Alumni Approval/Rejection Error:", error);
    return NextResponse.json(
      { error: "Failed to process registration", details: error.message },
      { status: 500 }
    );
  }
}