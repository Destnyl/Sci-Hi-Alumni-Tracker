import { NextResponse } from "next/server";
import { 
  collection, 
  getDocs, 
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET - Fetch all approved alumni for management
export async function GET() {
  try {
    console.log('🔍 Alumni Management API: Fetching all approved alumni...');
    
    const alumniRef = collection(db, 'alumni');
    const approvedQuery = query(
      alumniRef, 
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(approvedQuery);
    
    let approvedAlumni: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only include approved alumni
      if (data.status === 'approved') {
        approvedAlumni.push({
          id: doc.id,
          ...data
        });
      }
    });

    console.log(`✅ Alumni Management API: Found ${approvedAlumni.length} approved alumni`);
    return NextResponse.json(approvedAlumni);

  } catch (error: any) {
    console.error("❌ Alumni Management API Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch alumni", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Add new alumni directly (bypass registration)
export async function POST(request: Request) {
  try {
    const { name, strand, collegeCourse, currentOccupation, credentialsInField, email } = await request.json();
    
    if (!name || !strand || !collegeCourse || !currentOccupation) {
      return NextResponse.json(
        { error: "Name, strand, college course, and current occupation are required" },
        { status: 400 }
      );
    }

    const alumniRef = collection(db, 'alumni');
    
    const newAlumni = {
      name,
      strand,
      collegeCourse,
      currentOccupation,
      credentialsInField: credentialsInField || '',
      email: email || '',
      emailVerified: !!email,
      needsEmailUpdate: !email,
      status: 'approved', // Directly added by registrar
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      reviewedAt: serverTimestamp(),
      reviewedBy: 'School Registrar (Direct Add)'
    };

    const docRef = await addDoc(alumniRef, newAlumni);

    return NextResponse.json(
      { 
        message: "Alumni added successfully!", 
        alumni: { id: docRef.id, ...newAlumni }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ Add Alumni Error:", error);
    return NextResponse.json(
      { error: "Failed to add alumni", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update alumni information
export async function PUT(request: Request) {
  try {
    const { alumniId, name, strand, collegeCourse, currentOccupation, credentialsInField, email } = await request.json();
    
    if (!alumniId || !name || !strand || !collegeCourse || !currentOccupation) {
      return NextResponse.json(
        { error: "Alumni ID and all required fields must be provided" },
        { status: 400 }
      );
    }

    const alumniDocRef = doc(db, 'alumni', alumniId);
    
    const updateData: any = {
      name,
      strand,
      collegeCourse,
      currentOccupation,
      credentialsInField: credentialsInField || '',
      updatedAt: serverTimestamp()
    };

    // Handle email updates
    if (email !== undefined) {
      updateData.email = email;
      updateData.emailVerified = !!email;
      updateData.needsEmailUpdate = !email;
    }
    
    await updateDoc(alumniDocRef, updateData);

    return NextResponse.json({
      message: "Alumni information updated successfully!"
    });

  } catch (error: any) {
    console.error("❌ Update Alumni Error:", error);
    return NextResponse.json(
      { error: "Failed to update alumni", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove alumni from the system
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const alumniId = searchParams.get('alumniId');
    
    if (!alumniId) {
      return NextResponse.json(
        { error: "Alumni ID is required" },
        { status: 400 }
      );
    }

    const alumniDocRef = doc(db, 'alumni', alumniId);
    await deleteDoc(alumniDocRef);

    return NextResponse.json({
      message: "Alumni removed successfully!"
    });

  } catch (error: any) {
    console.error("❌ Delete Alumni Error:", error);
    return NextResponse.json(
      { error: "Failed to delete alumni", details: error.message },
      { status: 500 }
    );
  }
}