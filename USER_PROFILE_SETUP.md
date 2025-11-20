# User Profile Dashboard Setup Guide

## Overview

A new user profile dashboard has been created for PALM workers, featuring:
- **Compliance Health Score** - Track your rights protection level
- **Document Review Timeline** - Visual timeline of document reviews
- **Payslip Analysis Progress** - Track payslip review completion
- **Compliance Issues Table** - View and manage compliance issues
- **Real-time Statistics** - Documents reviewed, compliance checks, and notes

## Features

### 1. Personalized Dashboard
- Displays user-specific compliance data
- Shows greeting with worker's name (e.g., "Talofa John!")
- Profile information from worker database

### 2. Statistics Cards
- **Documents Reviewed**: Total documents processed with monthly comparison
- **Compliance Checks**: Number of compliance checks performed
- **Notes Received**: Communication and notification count

### 3. Compliance Health Score
- Visual circular progress indicator
- Percentage-based protection level
- Monthly improvement tracking
- Based on analyzed documents

### 4. Document Review Timeline
- Weekly bar chart visualization
- Color-coded document status (pending, compliant, other)
- Interactive timeline with daily breakdowns

### 5. Payslip Review Progress
- Circular progress indicator
- Total payslips vs analyzed count
- Percentage completion tracking

### 6. Compliance Check Reports
- Searchable issues table
- Status indicators (Action Required, Under Review, Resolved, Pending, Critical)
- Severity levels (Critical, High, Medium, Low)
- Amount tracking for financial issues
- Date detection timestamps
- View details action buttons

## Access

### Navigation Buttons Added to:

1. **Globe Workers Page** (`/globe-workers`)
   - "My Dashboard" button (emerald green) - Opens user profile
   - "Worker Profile" button (blue) - Opens detailed worker profile

2. **Flat Map Page** (`/flat-map`)
   - "My Dashboard" button (emerald green) - Opens user profile
   - "Worker Profile" button (blue) - Opens detailed worker profile

### Direct Access
- URL: `http://localhost:3000/profile`
- Requires user to be logged in (phone number in localStorage)

## Authentication

The profile page is user-specific and requires:
- WhatsApp user phone number stored in localStorage as `whatsapp_user_phone`
- If not authenticated, displays "Access Denied" message with return button

## API Endpoints

### Created API Routes:

1. **`/api/profile/stats`**
   - Method: GET
   - Query param: `phone` (user's phone number)
   - Returns: Dashboard statistics (documents, compliance checks, scores)

2. **`/api/profile/issues`**
   - Method: GET
   - Query param: `phone` (user's phone number)
   - Returns: Array of compliance issues

3. **`/api/profile/activity`**
   - Method: GET
   - Query param: `phone` (user's phone number)
   - Returns: Weekly document activity data

## Testing

### 1. Set Up Test User

Open browser console and run:
```javascript
localStorage.setItem('whatsapp_user_phone', '+61412345678')
```

### 2. Navigate to Profile

Click "My Dashboard" button from:
- Globe Workers page
- Flat Map page

Or directly visit: `http://localhost:3000/profile`

### 3. Test Features

- ✅ View personalized greeting
- ✅ Check statistics cards
- ✅ Review compliance score
- ✅ Explore document timeline
- ✅ Check payslip progress
- ✅ Filter compliance issues
- ✅ Test navigation buttons

## Styling

The profile page matches the design aesthetic:
- Dark theme (`#0a0e1a` background, `#0f1424` cards)
- Purple/Emerald accent colors
- Consistent with globe dashboard styling
- Responsive grid layouts
- Smooth transitions and hover effects

## Future Enhancements

### Planned Features:
1. **Real Supabase Integration**
   - Connect to actual worker data
   - Pull real compliance issues from database
   - Track actual document reviews

2. **Interactive Charts**
   - Click to view daily details
   - Filter by date range
   - Export data functionality

3. **Issue Management**
   - File new issues
   - Update issue status
   - Attach supporting documents
   - Communication thread per issue

4. **Notifications System**
   - Real-time alerts for new issues
   - Compliance deadline reminders
   - Document review notifications

5. **Mobile Optimization**
   - Responsive design improvements
   - Touch-friendly interactions
   - Progressive Web App (PWA) features

## File Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── profile/
│   │   │   └── page.tsx          # Main profile page
│   │   ├── api/
│   │   │   └── profile/
│   │   │       ├── stats/
│   │   │       │   └── route.ts  # Statistics API
│   │   │       ├── issues/
│   │   │       │   └── route.ts  # Issues API
│   │   │       └── activity/
│   │   │           └── route.ts  # Activity API
│   │   ├── globe-workers/
│   │   │   └── page.tsx          # Updated with nav button
│   │   └── flat-map/
│   │       └── page.tsx          # Updated with nav button
```

## Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage has `whatsapp_user_phone` set
3. Ensure API routes are accessible
4. Check network tab for API responses

## Notes

- Current API endpoints return mock data
- Production deployment requires Supabase configuration
- User authentication via localStorage (temporary solution)
- All data is privacy-focused and user-specific

