import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, updateDoc, doc, getDoc, where } from 'firebase/firestore';

// POST - Student sends request for alumni consultation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      alumniId,
      alumniEmail,
      studentName,
      studentEmail,
      studentContact,
      researchTitle,
      researchDescription,
      consultationNeeds,
    } = body;

    // Validate required fields
    if (!alumniId || !studentName || !studentEmail || !researchTitle || !consultationNeeds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if student already has an active request (prevents spamming)
    try {
      const studentRequestsRef = collection(db, 'studentConsultationRequests');
      const existingRequestQuery = query(
        studentRequestsRef,
        where('studentEmail', '==', studentEmail),
        where('status', 'in', ['pending', 'approved'])
      );
      const existingRequestsSnapshot = await getDocs(existingRequestQuery);
      
      if (!existingRequestsSnapshot.empty) {
        return NextResponse.json(
          { 
            error: 'You already have an active consultation request pending. Please wait for a response before submitting another request.',
            code: 'ACTIVE_REQUEST_EXISTS'
          },
          { status: 409 }
        );
      }
    } catch (error) {
      console.error('Error checking for duplicate requests:', error);
      // Continue anyway - don't block the request if check fails
    }

    // Fetch alumni name from the alumni collection
    let alumniName = '';
    try {
      const alumniDocRef = doc(db, 'alumni', alumniId);
      const alumniDocSnap = await getDoc(alumniDocRef);
      if (alumniDocSnap.exists()) {
        alumniName = alumniDocSnap.data().name || '';
      }
    } catch (error) {
      console.error('Error fetching alumni name:', error);
    }

    // Add student request to Firestore
    const docRef = await addDoc(collection(db, 'studentConsultationRequests'), {
      alumniId,
      alumniName,
      alumniEmail,
      studentName,
      studentEmail,
      studentContact: studentContact || '',
      researchTitle,
      researchDescription: researchDescription || '',
      consultationNeeds,
      status: 'pending',
      createdAt: Timestamp.now(),
      sentToAlumni: false,
    });

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: `Request sent! The registrar will review your request and contact ${alumniEmail} to arrange the consultation.`,
    });

  } catch (error: any) {
    console.error('Error creating student request:', error);
    return NextResponse.json(
      { error: 'Failed to send request', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all student consultation requests (for registrar dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const studentRequestsRef = collection(db, 'studentConsultationRequests');
    
    try {
      let q;
      if (status) {
        q = query(studentRequestsRef, orderBy('createdAt', 'desc'));
      } else {
        q = query(studentRequestsRef, orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as any))
        .filter((req) => !status || req.status === status);

      return NextResponse.json(requests);
    } catch (firestoreError: any) {
      if (firestoreError.code === 'not-found' || firestoreError.message?.includes('does not exist')) {
        return NextResponse.json([]);
      }
      throw firestoreError;
    }

  } catch (error: any) {
    console.error('Error fetching student requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests', details: error.message },
      { status: 500 }
    );
  }
}
// PUT - Update student request status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Missing requestId or status' },
        { status: 400 }
      );
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const documentRef = doc(db, 'studentConsultationRequests', requestId);
    const updatedData: any = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (status === 'approved') {
      updatedData.sentToAlumni = true;
    }

    await updateDoc(documentRef, updatedData);

    return NextResponse.json({
      success: true,
      message: `Request ${status} successfully`,
    });

  } catch (error: any) {
    console.error('Error updating student request:', error);
    return NextResponse.json(
      { error: 'Failed to update request', details: error.message },
      { status: 500 }
    );
  }
}