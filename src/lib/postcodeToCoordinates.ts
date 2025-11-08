/**
 * Convert Australian postcode to approximate latitude/longitude coordinates
 * Based on major city/region centers for plotting on globe
 */

interface Coordinates {
  lat: number
  lng: number
  city: string
}

/**
 * Australian postcode regions mapped to coordinates
 * Grouped by first 2 digits (postcode prefix)
 */
const POSTCODE_REGIONS: Record<string, Coordinates> = {
  // NSW - 2000-2999
  '20': { lat: -33.8688, lng: 151.2093, city: 'Sydney CBD' },
  '21': { lat: -33.8688, lng: 151.2093, city: 'Sydney' },
  '22': { lat: -33.8688, lng: 151.2093, city: 'Sydney' },
  '23': { lat: -33.7488, lng: 151.1873, city: 'Parramatta' },
  '24': { lat: -33.9173, lng: 151.2313, city: 'Kingsford' },
  '25': { lat: -33.7969, lng: 151.2849, city: 'Ryde' },
  '26': { lat: -35.2809, lng: 149.1300, city: 'Canberra' }, // ACT postcodes
  '27': { lat: -31.9523, lng: 115.8613, city: 'Central Coast' },
  '28': { lat: -32.9267, lng: 151.7789, city: 'Newcastle' },
  '29': { lat: -35.2809, lng: 149.1300, city: 'Canberra' }, // ACT postcodes

  // VIC - 3000-3999
  '30': { lat: -37.8136, lng: 144.9631, city: 'Melbourne CBD' },
  '31': { lat: -37.8136, lng: 144.9631, city: 'Melbourne' },
  '32': { lat: -37.8136, lng: 144.9631, city: 'Melbourne' },
  '33': { lat: -37.8683, lng: 145.2036, city: 'Outer Melbourne' },
  '34': { lat: -38.1499, lng: 144.3617, city: 'Geelong' },
  '35': { lat: -36.3704, lng: 146.9294, city: 'Shepparton' },
  '36': { lat: -37.5622, lng: 143.8503, city: 'Ballarat' },
  '37': { lat: -38.3834, lng: 142.1958, city: 'Warrnambool' },
  '38': { lat: -37.5622, lng: 143.8503, city: 'Regional VIC' },
  '39': { lat: -37.5622, lng: 143.8503, city: 'Regional VIC' },

  // QLD - 4000-4999
  '40': { lat: -27.4705, lng: 153.0260, city: 'Brisbane CBD' },
  '41': { lat: -27.4705, lng: 153.0260, city: 'Brisbane' },
  '42': { lat: -27.4705, lng: 153.0260, city: 'Brisbane' },
  '43': { lat: -28.0167, lng: 153.4000, city: 'Gold Coast' },
  '44': { lat: -19.2590, lng: 146.8169, city: 'Townsville' },
  '45': { lat: -26.6507, lng: 153.0663, city: 'Sunshine Coast' },
  '46': { lat: -23.3431, lng: 150.5145, city: 'Rockhampton' },
  '47': { lat: -16.9186, lng: 145.7781, city: 'Cairns' },
  '48': { lat: -27.5614, lng: 151.9539, city: 'Toowoomba' },
  '49': { lat: -20.7264, lng: 139.4927, city: 'Mount Isa' },

  // SA - 5000-5799
  '50': { lat: -34.9285, lng: 138.6007, city: 'Adelaide CBD' },
  '51': { lat: -34.9285, lng: 138.6007, city: 'Adelaide' },
  '52': { lat: -34.9285, lng: 138.6007, city: 'Adelaide' },
  '53': { lat: -34.7348, lng: 138.5233, city: 'Elizabeth' },
  '54': { lat: -35.1206, lng: 138.5107, city: 'Port Adelaide' },
  '55': { lat: -35.4734, lng: 138.5213, city: 'Victor Harbor' },
  '56': { lat: -34.7213, lng: 138.5255, city: 'Murray Bridge' },
  '57': { lat: -32.4935, lng: 137.7835, city: 'Port Augusta' },

  // WA - 6000-6797
  '60': { lat: -31.9505, lng: 115.8605, city: 'Perth CBD' },
  '61': { lat: -31.9505, lng: 115.8605, city: 'Perth' },
  '62': { lat: -31.9505, lng: 115.8605, city: 'Perth' },
  '63': { lat: -32.0391, lng: 115.7439, city: 'Fremantle' },
  '64': { lat: -33.3264, lng: 115.6366, city: 'Bunbury' },
  '65': { lat: -34.9601, lng: 117.8828, city: 'Albany' },
  '66': { lat: -28.7775, lng: 114.6120, city: 'Geraldton' },
  '67': { lat: -20.3100, lng: 118.5741, city: 'Broome' },

  // TAS - 7000-7799
  '70': { lat: -42.8821, lng: 147.3272, city: 'Hobart' },
  '71': { lat: -41.4332, lng: 147.1441, city: 'Launceston' },
  '72': { lat: -41.1910, lng: 145.5311, city: 'Burnie' },
  '73': { lat: -42.1500, lng: 145.1400, city: 'Queenstown' },

  // NT - 0800-0899
  '08': { lat: -12.4634, lng: 130.8456, city: 'Darwin' },
  '09': { lat: -23.6980, lng: 133.8807, city: 'Alice Springs' },
}

/**
 * Get coordinates for an Australian postcode
 * @param postcode - Australian postcode (4 digits)
 * @returns Coordinates object with lat, lng, and city name
 */
export function postcodeToCoordinates(postcode: string | null | undefined): Coordinates | null {
  if (!postcode) return null

  // Clean postcode - remove spaces, take first 4 digits
  const cleaned = postcode.toString().replace(/\s/g, '').slice(0, 4)

  if (cleaned.length < 2) return null

  // Get first 2 digits for region lookup
  const prefix = cleaned.slice(0, 2)

  // Return region coordinates or null
  return POSTCODE_REGIONS[prefix] || null
}

/**
 * Add small random offset to coordinates to prevent exact overlapping
 * Creates "spread" effect when multiple workers in same postcode
 * @param coords - Original coordinates
 * @param index - Index for deterministic offset
 * @returns Slightly offset coordinates
 */
export function addJitter(coords: Coordinates, index: number): Coordinates {
  // Small random offset (±0.05 degrees ≈ ±5km)
  const offset = 0.05
  const latJitter = (Math.sin(index * 1.618) * offset)
  const lngJitter = (Math.cos(index * 2.618) * offset)

  return {
    lat: coords.lat + latJitter,
    lng: coords.lng + lngJitter,
    city: coords.city
  }
}
