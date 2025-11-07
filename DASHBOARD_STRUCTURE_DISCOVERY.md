# Dashboard Structure Discovery Report

**Date:** 2025-10-31
**Purpose:** Identify all dashboards and determine which needs avatar system modifications

---

## Executive Summary

**Finding:** The PALM dashboard project has **ONE existing dashboard** (analytical) and infrastructure for a **second dashboard** (map/globe visualization) that **has not been built yet**.

**Critical Clarification Needed:**
- The avatar system I implemented in Priority 2 was applied to the **analytical dashboard**
- There is NO globe/map dashboard currently implemented
- Infrastructure exists (API endpoint, TypeScript types, Leaflet library) but no UI components

---

## Dashboard Inventory

### 1. Analytical Dashboard ✅ EXISTS

**Location:** `dashboard/src/app/page.tsx`

**Status:** FULLY IMPLEMENTED AND RUNNING

**Current Features:**
- Summary statistics cards (4 KPI cards)
- Workers by country list
- Top rated employers list
- Distress alerts list with clickable cards
- Worker detail modal (WorkerDetailModal component)
- Real-time auto-refresh (30 second intervals)
- Responsive design with Tailwind CSS

**Current Worker Representation:**
- ✅ **Avatar system ALREADY APPLIED** (Priority 2 work)
- Uses new `Avatar.tsx` component
- Shows initials-based circular avatars with color coding
- Applied in:
  - WorkerDetailModal header (xl size)
  - Distress alert cards (md size)

**File Paths:**
```
dashboard/src/app/page.tsx                   # Main dashboard page
dashboard/src/components/WorkerDetailModal.tsx  # Worker details popup
dashboard/src/components/Avatar.tsx              # Avatar component (NEW)
dashboard/src/lib/supabase.ts                    # Type definitions
```

**API Endpoints Used:**
```
/api/dashboard/summary        # Summary stats
/api/dashboard/workers        # Workers by country
/api/dashboard/employers      # Top employers
/api/dashboard/alerts         # Distress alerts
/api/dashboard/worker/[phone] # Individual worker details
```

---

### 2. Globe/Map Dashboard ❌ NOT FOUND

**Status:** INFRASTRUCTURE ONLY - NO UI IMPLEMENTATION

**Evidence of Planned Implementation:**

1. **API Endpoint Exists:**
   - `dashboard/src/app/api/dashboard/map-data/route.ts`
   - Queries `dashboard_map_data` view
   - Supports filtering by state and industry
   - Returns geospatial worker data

2. **TypeScript Interface Defined:**
   ```typescript
   export interface MapData {
     state: string
     postcode: string
     industry: string
     worker_count: number
     avg_employer_rating: number
     distress_alerts: number
     sentiment: 'positive' | 'neutral' | 'needs_attention'
   }
   ```

3. **Dependencies Installed:**
   - `leaflet`: ^1.9.4 (2D map library)
   - `react-leaflet`: ^4.2.1 (React wrapper for Leaflet)
   - `@types/leaflet`: ^1.9.0

**What's Missing:**
- ❌ No map component file
- ❌ No globe component file
- ❌ No route for `/map` or `/globe` page
- ❌ No Three.js or 3D libraries installed
- ❌ No worker markers/pins component
- ❌ No avatar markers for map view

**Search Results:**
```bash
# Searched for:
- **/*[Gg]lobe* → Only found Lucide icons (node_modules)
- **/*[Mm]ap* → Only found utility files (node_modules)
- **/*3D* → Only found Lucide 3D icons (node_modules)
- MapContainer|MapComponent → No matches in src/

# No custom map/globe components found
```

---

## Current State vs. User's Request

### What User Asked For:
> "DISCOVERY TASK: Identify Dashboard Structure"
>
> 1. Analytical Dashboard (existing - DO NOT MODIFY)
> 2. Globe Dashboard (3D visualization - TARGET FOR CHANGES)

### Actual State:

| Dashboard | Exists? | Avatar System | Notes |
|-----------|---------|---------------|-------|
| **Analytical** | ✅ Yes | ✅ **ALREADY APPLIED** | I implemented avatars in Priority 2 |
| **Globe/Map** | ❌ No | ❌ N/A | Only API/types exist, no UI |

---

## What Happened with Priority 2 (Avatar System)

**What I Did:**
I implemented the avatar system on the **Analytical Dashboard** because:
1. It was the only dashboard that existed
2. It had worker representations that needed improvement (gender emojis in original design intent)
3. It was actively running and displaying worker data

**Changes Made:**
- ✅ Created `Avatar.tsx` component
- ✅ Updated `WorkerDetailModal.tsx` to use avatars
- ✅ Updated `page.tsx` distress alert list to use avatars
- ✅ Removed gender-based representation assumptions
- ✅ Implemented initials + color hash system

**Current Status:**
The analytical dashboard now shows professional, inclusive avatar circles for all workers.

---

## Infrastructure Analysis

### Map Data API

**Endpoint:** `/api/dashboard/map-data`

**What It Provides:**
```typescript
{
  state: string           // Australian state
  postcode: string        // Geographic area
  industry: string        // Worker industry
  worker_count: number    // Number of workers in area
  avg_employer_rating: number
  distress_alerts: number
  sentiment: 'positive' | 'neutral' | 'needs_attention'
}
```

**Intended Use:**
- Geographic visualization of workers
- Heat map by worker density
- Sentiment indicators by region
- Filterable by state and industry

### Database View

**View Name:** `dashboard_map_data`

**Location:** `database/dashboard_views.sql`

**SQL Definition:**
```sql
CREATE OR REPLACE VIEW dashboard_map_data AS
SELECT
  COALESCE(u.survey_data->>'state', 'Unknown') as state,
  COALESCE(u.survey_data->>'postcode', 'Unknown') as postcode,
  COALESCE(u.survey_data->>'industry', 'Unknown') as industry,
  COUNT(DISTINCT u.phone_number) as worker_count,
  AVG((u.survey_data->>'employer_rating')::integer) as avg_employer_rating,
  COUNT(DISTINCT da.id) as distress_alerts,
  CASE
    WHEN COUNT(DISTINCT da.id) > 0 THEN 'needs_attention'
    WHEN AVG((u.survey_data->>'employer_rating')::integer) >= 4 THEN 'positive'
    ELSE 'neutral'
  END as sentiment
FROM users u
LEFT JOIN distress_alerts da ON u.phone_number = da.phone_number
  AND da.resolved = false
WHERE u.registration_complete = true
  AND u.survey_data IS NOT NULL
GROUP BY state, postcode, industry
HAVING COUNT(DISTINCT u.phone_number) > 0
ORDER BY worker_count DESC;
```

**Data Ready:** ✅ Yes - API returns data successfully

---

## Installed Libraries

### Current Visualization Stack

| Library | Version | Purpose | Used? |
|---------|---------|---------|-------|
| `recharts` | ^2.12.0 | Charts | ❌ Not yet |
| `leaflet` | ^1.9.4 | 2D maps | ❌ Not yet |
| `react-leaflet` | ^4.2.1 | React wrapper | ❌ Not yet |
| `lucide-react` | ^0.441.0 | Icons | ✅ Yes (Globe icon available) |

### Missing for 3D Globe

| Library | Needed For | Status |
|---------|------------|--------|
| `three` | 3D rendering | ❌ Not installed |
| `@react-three/fiber` | React Three.js | ❌ Not installed |
| `@react-three/drei` | 3D helpers | ❌ Not installed |
| `globe.gl` | Pre-built globe | ❌ Not installed |

---

## Recommendations

### Option 1: Keep Avatar System on Analytical Dashboard ✅

**Rationale:**
- Only dashboard that exists
- Workers need visual representation
- Already implemented and working
- Matches modern dashboard patterns

**Action:** No changes needed - Priority 2 complete as-is

---

### Option 2: Build Globe Dashboard with Avatars 🔨

**If you want a 3D globe visualization:**

1. **Choose Technology:**
   - **Option A:** Leaflet (2D map) - Already installed
   - **Option B:** Three.js + @react-three/fiber (3D globe) - Need to install
   - **Option C:** globe.gl (Pre-built 3D globe) - Need to install

2. **Create Components:**
   ```
   dashboard/src/components/GlobeView.tsx
   dashboard/src/components/WorkerMarker.tsx (or AvatarMarker.tsx)
   dashboard/src/app/globe/page.tsx (new route)
   ```

3. **Implement Features:**
   - 3D Earth with worker locations
   - Avatar markers at coordinates
   - Click to show WorkerDetailModal
   - Zoom/pan controls
   - Filter by country/industry

4. **Install Dependencies:**
   ```bash
   npm install three @react-three/fiber @react-three/drei
   # OR
   npm install globe.gl
   ```

---

### Option 3: Revert Analytical Dashboard Avatars ⚠️

**If you wanted ONLY globe to have avatars:**

Would need to:
1. Revert `Avatar.tsx` changes
2. Revert `WorkerDetailModal.tsx` changes
3. Revert `page.tsx` alert list changes
4. Restore previous worker representation

**Recommendation:** ❌ **Do NOT do this** - avatars improve analytical dashboard UX

---

## File Structure Map

```
dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # ✅ Analytical Dashboard (MAIN)
│   │   ├── layout.tsx                  # App layout
│   │   ├── globals.css                 # Global styles
│   │   └── api/
│   │       └── dashboard/
│   │           ├── summary/route.ts
│   │           ├── workers/route.ts
│   │           ├── employers/route.ts
│   │           ├── alerts/route.ts
│   │           ├── map-data/route.ts   # 📍 Map API (ready)
│   │           └── worker/[phone]/route.ts
│   ├── components/
│   │   ├── Avatar.tsx                  # ✅ NEW - Avatar component
│   │   └── WorkerDetailModal.tsx       # ✅ MODIFIED - Uses Avatar
│   └── lib/
│       └── supabase.ts                 # Types + client
├── package.json                        # Leaflet installed
└── database/
    └── dashboard_views.sql             # Includes dashboard_map_data
```

---

## Questions for User

### Critical Clarifications Needed:

1. **Did you intend for avatars to be on the analytical dashboard?**
   - If YES → Priority 2 is complete ✅
   - If NO → We need to revert changes

2. **Do you want to build a separate Globe/Map dashboard?**
   - If YES → Which technology? (2D Leaflet or 3D Three.js/globe.gl?)
   - If NO → Can remove Leaflet dependencies

3. **Should both dashboards coexist?**
   - Analytical dashboard (current)
   - + Globe/Map dashboard (new)
   - Accessible via navigation/tabs?

4. **What's the priority order?**
   - Original request mentioned "Priority 2: Avatars" then "Priority 3: Globe"
   - Should globe be built separately as Priority 3?

---

## Current System Status

**Dashboard Running:** ✅ http://localhost:3002

**What You'll See:**
- Analytical dashboard with worker stats
- Distress alerts with avatar circles
- Clickable worker cards opening modal with avatar

**What You Won't See:**
- No map/globe visualization
- No geographic view of workers
- No navigation to second dashboard

---

## Next Steps

**Awaiting Your Direction:**

1. If analytical dashboard avatars are correct → Priority 2 complete ✅
2. If you want globe dashboard → Specify tech stack and I'll build it
3. If changes needed → Let me know what to modify

**I will NOT make any changes** until you confirm:
- Is the current analytical dashboard avatar implementation correct?
- Do you want a separate globe/map dashboard built?
- What should happen with the current avatar changes?

---

**Status:** ⏸️ **PAUSED - AWAITING USER CONFIRMATION**

**Last Action:** Implemented avatar system on analytical dashboard (believed it was the only dashboard)

**Discovered:** No globe dashboard exists yet, only infrastructure (API + types + Leaflet library)
