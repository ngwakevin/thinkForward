#!/usr/bin/env node

/**
 * This script tests the bootcamp registration API endpoints
 * with and without account creation.
 */

const fetch = require('node-fetch');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const EMAIL_PREFIX = `test-${Date.now()}`;

// Test data
const regularRegistration = {
  name: 'Regular Test User',
  email: `${EMAIL_PREFIX}-regular@example.com`,
  phone: '+1234567890',
  provider: 'azure',
  inIt: 'yes',
  current_role: 'Developer',
  experience: '1-3',
  goal: 'skill-upgrade',
  exposure: 'Some Azure experience',
  notes: 'Test registration',
  track: 'cloud-engineer'
};

const accountRegistration = {
  name: 'Account Test User',
  email: `${EMAIL_PREFIX}-account@example.com`,
  phone: '+1234567890',
  provider: 'azure',
  inIt: 'yes',
  current_role: 'Developer',
  experience: '1-3',
  goal: 'skill-upgrade',
  exposure: 'Some Azure experience',
  notes: 'Test registration with account',
  track: 'cloud-engineer',
  password: 'TestPassword123',
  confirmPassword: 'TestPassword123',
  createAccount: true
};

// Test regular registration
async function testRegularRegistration() {
  console.log('Testing regular bootcamp registration...');
  try {
    const response = await fetch(`${BASE_URL}/api/bootcamps/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(regularRegistration)
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.ok && data.registration) {
      console.log('✅ Regular registration test passed');
      return true;
    } else {
      console.log('❌ Regular registration test failed');
      return false;
    }
  } catch (error) {
    console.error('Error testing regular registration:', error);
    return false;
  }
}

// Test registration with account creation
async function testAccountRegistration() {
  console.log('\nTesting bootcamp registration with account creation...');
  try {
    // Try direct endpoint first
    const response = await fetch(`${BASE_URL}/api/register-bootcamp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(accountRegistration)
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.ok && (data.registration || data.createdUser)) {
      console.log('✅ Account registration test passed');
      return true;
    } else {
      console.log('❌ Account registration test failed');
      return false;
    }
  } catch (error) {
    console.error('Error testing account registration:', error);
    return false;
  }
}

// Test forwarding from regular endpoint with createAccount flag
async function testForwarding() {
  console.log('\nTesting forwarding from regular endpoint with createAccount flag...');
  try {
    // Use a different email to avoid conflicts
    const forwardTestData = {
      ...accountRegistration,
      email: `${EMAIL_PREFIX}-forward@example.com`
    };
    
    const response = await fetch(`${BASE_URL}/api/bootcamps/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(forwardTestData)
    });

    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.ok && (data.registration || data.createdUser)) {
      console.log('✅ Forwarding test passed');
      return true;
    } else {
      console.log('❌ Forwarding test failed');
      return false;
    }
  } catch (error) {
    console.error('Error testing forwarding:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== BOOTCAMP REGISTRATION API TESTS ===\n');
  
  const regularResult = await testRegularRegistration();
  const accountResult = await testAccountRegistration();
  const forwardResult = await testForwarding();
  
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Regular Registration: ${regularResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Account Registration: ${accountResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Forwarding: ${forwardResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (regularResult && accountResult && forwardResult) {
    console.log('\n✅ All tests passed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Check the logs above for details.');
    process.exit(1);
  }
}

runTests();