# Firebase Migration Setup

This project has been updated to use Firebase Firestore instead of CSV files for data storage. Follow these steps to set up Firebase and migrate your existing data.

## Prerequisites

- A Google account
- Node.js installed
- Existing CSV data in the `data/alumni.csv` file

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "scihi-alumni-tracking")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode"
4. Select a location for your database (choose one close to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In the Firebase console, click the gear icon (⚙️) and select "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (`</>``) to add a web app
4. Give your app a nickname (e.g., "Alumni Tracking Web")
5. Click "Register app"
6. Copy the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAm0MdHaVr6cVA147cwMQiCL7wvpB1c1Ho",
  authDomain: "scihi-alumni-tracking.firebaseapp.com",
  projectId: "scihi-alumni-tracking",
  storageBucket: "scihi-alumni-tracking.firebasestorage.app",
  messagingSenderId: "776095020338",
  appId: "1:776095020338:web:77e44b70e46d77203e932b",
};
```

## Step 4: Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

## Step 5: Install Dependencies

Make sure Firebase is installed:

```bash
npm install firebase
```

## Step 6: Migrate Existing CSV Data (Optional)

If you have existing alumni data in CSV format, you can migrate it to Firestore:

1. Update the Firebase config in `scripts/migrate-csv-to-firebase.ts` with your actual config
2. Run the migration script:
   ```bash
   npx ts-node scripts/migrate-csv-to-firebase.ts
   ```

**Note:** This migration script is for one-time use. Make sure to backup your CSV data first.

## Step 7: Set up Firestore Security Rules (Production)

For production, update your Firestore security rules to be more restrictive:

1. Go to Firestore Database in Firebase console
2. Click on "Rules" tab
3. Replace the rules with something more secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to alumni collection for authenticated users
    match /alumni/{document} {
      allow read: if true; // Adjust based on your authentication needs
      allow write: if true; // Adjust based on your authentication needs
    }
  }
}
```

## Step 8: Test the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Visit the application and test:
   - Alumni Registration page (`/alumni-registration`)
   - Alumni listing pages (`/trace/abm` and `/trace/stem`)
   - Search functionality

## Data Structure

The new Firebase structure uses the following fields:

```typescript
type AlumniData = {
  id?: string;
  name: string;
  strand: string;
  collegeCourse: string;
  currentOccupation: string;
  credentialsInField?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
```

## Troubleshooting

### Common Issues:

1. **"Firebase app not initialized" error**: Make sure your environment variables are correct and the `.env.local` file is in the root directory.

2. **"Permission denied" error**: Check your Firestore security rules and make sure they allow the operations your app is trying to perform.

3. **"Network error"**: Verify your Firebase project ID and that Firestore is enabled.

4. **Migration script fails**: Ensure the CSV file exists at `data/alumni.csv` and has the correct format.

### Firestore Collection Structure:

```
alumni (collection)
├── document1 (auto-generated ID)
│   ├── name: "John Doe"
│   ├── strand: "STEM"
│   ├── collegeCourse: "Computer Science"
│   ├── currentOccupation: "Software Developer"
│   ├── credentialsInField: "AWS Certified"
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
└── document2 (auto-generated ID)
    └── ... (similar structure)
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Next.js with Firebase](https://firebase.google.com/docs/web/setup)
