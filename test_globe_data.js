// Test if worker data can be successfully mapped to globe coordinates
const worker = {
  "phone": "61406778531",
  "name": "Jovi",
  "country": "Fiji",
  "state": "Australian Capital Terri",
  "postcode": "2607",
  "industry": "Aged Care",
  "employer": "Uniting Age Care",
  "visa_type": "Pacific Labour Schem",
  "created_at": "2025-10-25T13:51:41.569839+00:00",
  "updated_at": "2025-11-08T10:23:20.133563+00:00",
  "registration_complete": true
}

// Import the postcode utility (simulated)
const POSTCODE_REGIONS = {
  '26': { lat: -35.2809, lng: 149.1300, city: 'Canberra' }
}

function postcodeToCoordinates(postcode) {
  if (!postcode) return null
  const cleaned = postcode.toString().replace(/\s/g, '').slice(0, 4)
  if (cleaned.length < 2) return null
  const prefix = cleaned.slice(0, 2)
  return POSTCODE_REGIONS[prefix] || null
}

function addJitter(coords, index) {
  const offset = 0.05
  const latJitter = (Math.sin(index * 1.618) * offset)
  const lngJitter = (Math.cos(index * 2.618) * offset)

  return {
    lat: coords.lat + latJitter,
    lng: coords.lng + lngJitter,
    city: coords.city
  }
}

console.log('Testing worker to globe point conversion...\n')
console.log('Worker data:', worker)
console.log('\nPostcode:', worker.postcode)

const coords = postcodeToCoordinates(worker.postcode)
console.log('\nBase coordinates:', coords)

if (coords) {
  const jitteredCoords = addJitter(coords, 0)
  console.log('Jittered coordinates:', jitteredCoords)

  const globePoint = {
    lat: jitteredCoords.lat,
    lng: jitteredCoords.lng,
    size: 0.3,
    color: '#10b981', // Fiji green
    name: worker.name,
    phone: worker.phone,
    country: worker.country,
    state: worker.state || 'Unknown',
    postcode: worker.postcode || 'Unknown',
    city: jitteredCoords.city,
    industry: worker.industry || 'Unknown'
  }

  console.log('\nGlobe point:', JSON.stringify(globePoint, null, 2))
  console.log('\n✅ SUCCESS: Worker can be mapped to globe')
} else {
  console.log('\n❌ ERROR: Could not map postcode to coordinates')
}
