import { NextResponse } from "next/server";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type AlumniData = {
  id?: string;
  name: string;
  strand: string;
  collegeCourse: string;
  currentOccupation: string;
  credentialsInField?: string;
  email?: string;
  emailVerified?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
};

export async function GET(request: Request) {
  try {
    console.log('🔍 Alumni API: Starting request...');
    
    const { searchParams } = new URL(request.url);
    const strand = searchParams.get("strand") ?? undefined;
    const searchQuery = searchParams.get("q")?.toLowerCase() ?? "";

    console.log('🔍 Alumni API: Query params -', { strand, searchQuery });

    // Create Firestore query
    const alumniRef = collection(db, 'alumni');
    let firestoreQuery;

    // Start with a simple query that might not require an index
    try {
      // Try with strand filter first (might not need index)
      if (strand) {
        firestoreQuery = query(
          alumniRef, 
          where('strand', '==', strand),
          where('status', '==', 'approved')
        );
        console.log('🔍 Alumni API: Using strand filter + approved status');
      } else {
        // Try with just approved status filter
        firestoreQuery = query(
          alumniRef, 
          where('status', '==', 'approved')
        );
        console.log('🔍 Alumni API: Using approved status filter only');
      }

      console.log('🔍 Alumni API: Executing Firestore query...');
      const querySnapshot = await getDocs(firestoreQuery);
      console.log(`🔍 Alumni API: Query returned ${querySnapshot.size} documents`);
      
      let alumni: AlumniData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`🔍 Alumni API: Processing document ${doc.id}:`, data);
        alumni.push({
          id: doc.id,
          name: data.name,
          strand: data.strand,
          collegeCourse: data.collegeCourse,
          currentOccupation: data.currentOccupation,
          credentialsInField: data.credentialsInField || '',
          email: data.email || '',
          status: data.status || 'approved',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });

      console.log(`✅ Alumni API: Processed ${alumni.length} records`);

      // Sort by creation date (newest first)
      alumni.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        // Check if both are Timestamp objects (have seconds property)
        if ('seconds' in a.createdAt && 'seconds' in b.createdAt) {
          return (b.createdAt as Timestamp).seconds - (a.createdAt as Timestamp).seconds;
        }
        return 0;
      });

      console.log(`✅ Alumni API: Found ${alumni.length} records`);

      // Apply search filter on the client side for more flexible searching
      if (searchQuery) {
        alumni = alumni.filter((alum) => {
          const searchableText = `${alum.name} ${alum.strand} ${alum.collegeCourse} ${alum.currentOccupation} ${alum.credentialsInField}`.toLowerCase();
          return searchableText.includes(searchQuery);
        });
        console.log(`✅ Alumni API: After search filter: ${alumni.length} records`);
      }

      return NextResponse.json(alumni);
    } catch (firestoreError: any) {
      // If we get an index error, try a fallback approach
      if (firestoreError.code === 'failed-precondition' || firestoreError.message?.includes('index')) {
        console.warn('⚠️ Alumni API: Firestore index required. Attempting fallback...');
        
        try {
          // Fallback: Get all documents and filter on client side
          const allDocsSnapshot = await getDocs(alumniRef);
          let alumni: AlumniData[] = [];
          
          allDocsSnapshot.forEach((doc) => {
            const data = doc.data();
            // Only include approved alumni
            if (data.status === 'approved') {
              alumni.push({
                id: doc.id,
                name: data.name,
                strand: data.strand,
                collegeCourse: data.collegeCourse,
                currentOccupation: data.currentOccupation,
                credentialsInField: data.credentialsInField || '',
                email: data.email || '',
                status: data.status || 'approved',
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              });
            }
          });

          // Filter by strand if needed
          if (strand) {
            alumni = alumni.filter(a => a.strand === strand);
          }

          // Sort by creation date
          alumni.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            if ('seconds' in a.createdAt && 'seconds' in b.createdAt) {
              return (b.createdAt as Timestamp).seconds - (a.createdAt as Timestamp).seconds;
            }
            return 0;
          });

          // Apply search filter
          if (searchQuery) {
            alumni = alumni.filter((alum) => {
              const searchableText = `${alum.name} ${alum.strand} ${alum.collegeCourse} ${alum.currentOccupation} ${alum.credentialsInField}`.toLowerCase();
              return searchableText.includes(searchQuery);
            });
          }

          console.log(`✅ Alumni API (Fallback): Found ${alumni.length} records`);
          return NextResponse.json(alumni);
        } catch (fallbackError) {
          console.error('❌ Fallback query also failed:', fallbackError);
          throw fallbackError;
        }
      }
      
      throw firestoreError;
    }
  } catch (error: any) {
    console.error("❌ Alumni API Error:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 3),
    });
    
    return NextResponse.json(
      { 
        error: "Failed to read alumni data", 
        details: error.message,
        code: error.code,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, strand, collegeCourse, currentOccupation, credentialsInField } = body;

    // Validate required fields
    if (!name || !strand || !collegeCourse || !currentOccupation) {
      return NextResponse.json(
        { error: "Name, strand, college course, and current occupation are required" },
        { status: 400 }
      );
    }

    // Check if alumni already exists (by name and strand)
    const alumniRef = collection(db, 'alumni');
    const existingQuery = query(
      alumniRef, 
      where('name', '==', name),
      where('strand', '==', strand)
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: "An alumni with this name and strand already exists" },
        { status: 409 }
      );
    }

    // Create new alumni document (initially pending approval)
    const newAlumni: Omit<AlumniData, 'id'> = {
      name,
      strand,
      collegeCourse,
      currentOccupation,
      credentialsInField: credentialsInField || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add to Firestore
    const docRef = await addDoc(alumniRef, newAlumni);

    const responseData: AlumniData = {
      id: docRef.id,
      ...newAlumni,
    };

    return NextResponse.json(
      { 
        message: "Alumni registration submitted successfully! Your registration is pending approval by the school registrar.", 
        alumni: responseData,
        status: 'pending'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering alumni:", error);
    return NextResponse.json(
      { error: "Failed to register alumni. Please try again." },
      { status: 500 }
    );
  }
}

