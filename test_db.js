const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://otfwnkansibvitjdefje.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90Zndua2Fuc2lidml0amRlZmplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4MTA1MSwiZXhwIjoyMDc2OTU3MDUxfQ.g3giUlJotkvqGZAaQwg5hLDUmzYHJmoJ6z3ysCbqMtU'
)

async function testQuery() {
  console.log('Testing users table query...\n')

  // Test 1: Get first user to see structure
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .limit(3)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Found ${users.length} users`)
  console.log('\nFirst user structure:')
  if (users[0]) {
    console.log(JSON.stringify(users[0], null, 2))
  }

  // Test 2: Check for users with survey_data.postcode
  console.log('\n\nChecking for users with postcode in survey_data...')
  const usersWithPostcode = users.filter(u => u.survey_data?.postcode)
  console.log(`Users with postcode: ${usersWithPostcode.length}`)

  if (usersWithPostcode.length > 0) {
    console.log('\nSample user with postcode:')
    console.log(JSON.stringify(usersWithPostcode[0], null, 2))
  }
}

testQuery()
