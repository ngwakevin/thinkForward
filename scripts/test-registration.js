// test-registration.js
// Run with: node scripts/test-registration.js

const fetch = require('node-fetch');

async function testRegistration() {
  try {
    console.log('Testing new registration endpoint...');
    
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        track: 'Cloud Foundation',
        createAccount: true,
      }),
    });
    
    const result = await response.json();
    
    console.log('Registration response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error testing registration:', error);
  }
}

testRegistration();