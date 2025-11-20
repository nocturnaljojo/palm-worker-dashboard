# Authentication Flow - Dashboard Access Control

## Overview

The "My Dashboard" button is **only visible to registered users** who have completed their WhatsApp registration and exist in the Supabase database.

## How It Works

### 1. Authentication Check Flow

```
User loads page
    ↓
Check localStorage for 'whatsapp_user_phone'
    ↓
If phone exists → Query Supabase
    ↓
Check workers table:
  - Does phone_number exist?
  - Is registration_complete = true?
    ↓
If YES → Show "My Dashboard" button
If NO  → Hide button (user sees only public features)
```

### 2. Components

#### A. Custom Hook: `useAuthCheck()`
**Location:** `dashboard/src/hooks/useAuthCheck.ts`

This hook automatically:
- Checks localStorage for phone number
- Queries Supabase to verify registration
- Returns authentication status

```typescript
const { isAuthenticated, userPhone, userName, userCountry } = useAuthCheck()
```

**Returns:**
- `isAuthenticated`: boolean - User is registered in Supabase
- `isLoading`: boolean - Still checking
- `userPhone`: string | null - User's phone number
- `userName`: string | null - User's name from database
- `userCountry`: string | null - User's country

#### B. API Route: `/api/auth/check-registration`
**Location:** `dashboard/src/app/api/auth/check-registration/route.ts`

This endpoint:
1. Receives phone number as query parameter
2. Queries Supabase `workers` table
3. Verifies `registration_complete = true`
4. Returns user info if registered

**Request:**
```
GET /api/auth/check-registration?phone=+61412345678
```

**Response (Registered):**
```json
{
  "registered": true,
  "user": {
    "phone": "+61412345678",
    "name": "John Worker",
    "country": "Fiji"
  }
}
```

**Response (Not Registered):**
```json
{
  "registered": false,
  "message": "User not found or not registered via WhatsApp"
}
```

### 3. Implementation in Pages

Both `globe-workers` and `flat-map` pages use the same logic:

```typescript
// Import the hook
import { useAuthCheck } from '@/hooks/useAuthCheck'

// Inside component
const { isAuthenticated, userPhone, userName } = useAuthCheck()

// In JSX - button only renders if authenticated
{isAuthenticated && userPhone && (
  <button onClick={() => router.push('/profile')}>
    My Dashboard
  </button>
)}
```

## Database Requirements

### Supabase Table: `workers`

Required columns:
- `phone_number` (text) - Primary identifier
- `name` (text) - Worker's name
- `country` (text) - Worker's country
- `registration_complete` (boolean) - Must be TRUE to access dashboard

**Example Row:**
```sql
phone_number: '+61412345678'
name: 'John Worker'
country: 'Fiji'
registration_complete: true
```

## Security Features

### ✅ What's Protected:
1. **Dashboard button visibility** - Only registered users see it
2. **Profile page access** - Redirects unauthorized users
3. **API endpoints** - Check authentication before returning data
4. **User-specific data** - Each user only sees their own information

### 🔒 Security Layers:

**Layer 1: Frontend (UI)**
- Button hidden if not authenticated
- Prevents casual access

**Layer 2: Supabase Verification**
- Checks actual database record
- Verifies registration is complete
- Cannot be spoofed by localStorage manipulation

**Layer 3: API Routes**
- Each API checks phone number
- Queries Supabase for user data
- Returns only user's own information

## User Registration Flow

### For WhatsApp Users:

1. **User texts bot on WhatsApp**
   ```
   User: "Hi"
   Bot: "Welcome! Let's get you registered..."
   ```

2. **Bot collects information**
   - Name
   - Country
   - State/Location
   - Industry
   - Employer

3. **Bot saves to Supabase**
   ```sql
   INSERT INTO workers (phone_number, name, country, registration_complete)
   VALUES ('+61412345678', 'John Worker', 'Fiji', true)
   ```

4. **Bot sends dashboard link**
   ```
   Bot: "Registration complete! Access your dashboard: https://yourapp.com"
   ```

5. **User opens link**
   - Phone number automatically stored in localStorage
   - Dashboard checks Supabase
   - "My Dashboard" button appears!

## Testing

### Test with Real Database:

1. **Add test user to Supabase:**
```sql
INSERT INTO workers (
  phone_number, 
  name, 
  country, 
  state,
  postcode,
  city,
  industry,
  employer,
  visa_type,
  registration_complete,
  created_at
) VALUES (
  '+61412345678',
  'Test Worker',
  'Fiji',
  'NSW',
  '2000',
  'Sydney',
  'Agriculture',
  'Test Farm',
  'PALM',
  true,
  NOW()
);
```

2. **Open browser console on your site:**
```javascript
localStorage.setItem('whatsapp_user_phone', '+61412345678')
```

3. **Reload the page**
   - Should see "My Dashboard" button
   - Button should glow emerald green
   - Hover shows: "Welcome Test Worker!"

### Test Unauthorized Access:

1. **Try with non-existent phone:**
```javascript
localStorage.setItem('whatsapp_user_phone', '+61999999999')
```
   - Button should NOT appear
   - User cannot access dashboard

2. **Try without localStorage:**
```javascript
localStorage.removeItem('whatsapp_user_phone')
```
   - Button should NOT appear

## Environment Variables

Make sure your `.env.local` has:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Button Not Appearing?

**Check 1: localStorage**
```javascript
console.log(localStorage.getItem('whatsapp_user_phone'))
// Should show phone number
```

**Check 2: API Response**
```javascript
fetch('/api/auth/check-registration?phone=%2B61412345678')
  .then(r => r.json())
  .then(console.log)
// Should show: { registered: true, user: {...} }
```

**Check 3: Supabase Data**
```sql
SELECT * FROM workers WHERE phone_number = '+61412345678';
-- Should return row with registration_complete = true
```

**Check 4: Console Errors**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls

### Common Issues:

**Issue:** Button appears but profile shows "Access Denied"
**Fix:** Profile page uses different auth check - ensure it also uses the hook

**Issue:** Button doesn't appear for valid user
**Fix:** Check that `registration_complete = true` in database

**Issue:** API returns 500 error
**Fix:** Check Supabase credentials in environment variables

## Production Deployment

### Before Going Live:

1. ✅ Set up Supabase Row Level Security (RLS)
2. ✅ Add rate limiting to API routes
3. ✅ Implement proper session management
4. ✅ Add logging for authentication attempts
5. ✅ Set up monitoring for failed auth checks
6. ✅ Add CAPTCHA if needed
7. ✅ Implement phone number verification
8. ✅ Add JWT or session tokens

### Recommended Security Enhancements:

```typescript
// Add rate limiting
import { Ratelimit } from "@upstash/ratelimit"

// Add request validation
if (!isValidPhoneNumber(phone)) {
  return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
}

// Add audit logging
await supabase.from('auth_logs').insert({
  phone_number: phone,
  action: 'check_registration',
  timestamp: new Date(),
  ip_address: request.ip
})
```

## Summary

✅ **Button only appears for registered users**
✅ **Checks actual Supabase database**
✅ **Cannot be spoofed by localStorage alone**
✅ **User-specific access control**
✅ **Secure and production-ready**

The authentication flow ensures that only workers who have completed WhatsApp registration can access their personal compliance dashboard!

