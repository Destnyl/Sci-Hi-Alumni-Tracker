# Alumni Tracking Website - Setup & Configuration Guide

## ✅ Completed Features

- **Alumni Registration**: Self-service registration form for alumni
- **Registrar Dashboard**: Complete admin panel with 4 tabs:
  - **Pending Approvals**: Review and approve new alumni registrations
  - **Manage Alumni**: Full CRUD operations (create, read, update, delete)
  - **Add Alumni**: Direct alumni entry by registrar
  - **Research Consultation**: Send consultation requests to alumni via email
- **Firebase Integration**: All data stored in Firestore
- **Email Service**: Automated consultation request emails via Resend

---

## 🚀 Quick Start

### 1. **Environment Setup**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

The `.env.local` file should contain:

```
# Firebase (already configured)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAm0MdHaVr6cVA147cwMQiCL7wvpB1c1Ho
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=scihi-alumni-tracking.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=scihi-alumni-tracking
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=scihi-alumni-tracking.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=776095020338
NEXT_PUBLIC_FIREBASE_APP_ID=1:776095020338:web:77e44b70e46d77203e932b

# Email Service - GET YOUR API KEY FROM RESEND
RESEND_API_KEY=re_your_api_key_here
```

### 2. **Get Resend API Key**

1. Go to **https://resend.com**
2. Sign up for a free account (100 emails/day free tier)
3. Navigate to your dashboard
4. Create an API key
5. Add it to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx_your_key_here
   ```

### 3. **Install Dependencies**

```bash
npm install
```

The following packages are already configured:

- `resend` - Email delivery service (ES modules compatible)
- `firebase` - Database and authentication
- `zustand` - State management
- `tailwind` - Styling

### 4. **Start Development Server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📧 Email Features

### Research Consultation Workflow

**Path**: Registrar Dashboard → Research Consultation Tab

1. **Select Alumni**
   - Only alumni with verified email addresses are shown
   - Email field is required

2. **Enter Student Details**
   - Student Name, Email, Contact
   - Research Title, Description
   - Consultation Needs, Expected Duration

3. **Send Request**
   - Professional HTML email is automatically generated
   - Email includes:
     - Student contact information
     - Research project details
     - What you're asking from the alumni
     - Styled template with school branding

### Email Delivery Details

- **From**: Alumni Research <onboarding@resend.dev> (free tier)
- **Status**: Checked in "Consultation History" sidebar
- **Logging**: All requests stored in Firestore `consultationRequests` collection
- **Error Handling**: Clear error messages if email fails

---

## 🔐 Authentication

The registrar dashboard is protected by:

- Email/password authentication via Firebase
- Only authenticated registrars can access admin functions
- Session persists using Zustand store

**Default credentials** (set up in Firebase Console):

- Configure your registrar account in Firebase Authentication

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/alumni/
│   │   ├── route.ts              # Alumni CRUD endpoints
│   │   └── consultation/route.ts # Consultation & email endpoints
│   ├── registrar/page.tsx        # Admin dashboard (4 tabs)
│   ├── login/page.tsx            # Authentication page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Public home page
├── components/
│   ├── HeaderBar.tsx             # Navigation header
│   ├── FooterNav.tsx             # Footer
│   ├── NavButton.tsx             # Custom buttons
│   └── BrandBox.tsx              # Branding component
└── store/
    └── useAppStore.ts            # Zustand auth state
```

---

## 🛠️ Key API Endpoints

### Alumni Management

- `GET /api/alumni` - Get all alumni
- `POST /api/alumni` - Create new alumni
- `PUT /api/alumni/[id]` - Update alumni
- `DELETE /api/alumni/[id]` - Delete alumni

### Consultation Requests

- `POST /api/alumni/consultation` - Send consultation email request
- `GET /api/alumni/consultation?alumniId=[id]` - Get consultation history

---

## ⚠️ Troubleshooting

### Email Not Sending?

1. Check `RESEND_API_KEY` is set in `.env.local`
2. Verify alumni record has a valid email address
3. Check browser console for error messages
4. Check server logs for Resend API errors

### Alumni Not Showing in Consultation Form?

- Alumni must have a verified email address
- Confirm email field is populated in the alumni record
- Check Firestore `alumni` collection for email field

### Firestore Connection Issues?

- Verify Firebase credentials in `.env.local`
- Ensure Firestore Database is enabled in Firebase Console
- Check Firebase project permissions

---

## 🚀 Deployment

### To Firebase Hosting

1. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   firebase deploy
   ```

**Note**: Ensure all environment variables are configured in Firebase Project Settings

---

## 📝 Notes

- Email template customization can be done in `src/app/api/alumni/consultation/route.ts`
- All emails are logged in Firestore for audit purposes
- Alumni can be imported from CSV or added manually
- The consultation history is sortable and filterable

---

## 📞 Support

For issues or questions:

1. Check the error messages displayed in the UI
2. Review browser console for client-side errors
3. Check terminal logs for server-side errors
4. Verify all environment variables are correctly set
