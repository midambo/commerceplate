// Script to check Supabase connection and environment variables
const { createClient } = require('@supabase/supabase-js');
const dns = require('dns');
const https = require('https');

// Function to safely check if an environment variable exists without logging its value
function checkEnvVar(name) {
  const value = process.env[name];
  console.log(`${name}: ${value ? '✓ Set' : '✗ Missing'}`);
  
  // For Supabase URL, perform additional checks
  if (name === 'NEXT_PUBLIC_SUPABASE_URL' && value) {
    // Extract hostname from URL
    try {
      const url = new URL(value);
      const hostname = url.hostname;
      console.log(`  - Hostname: ${hostname}`);
      
      // Check DNS resolution
      dns.lookup(hostname, (err, address) => {
        if (err) {
          console.log(`  - DNS Resolution: ✗ Failed (${err.code})`);
          console.log(`  - This explains the ERR_NAME_NOT_RESOLVED error`);
        } else {
          console.log(`  - DNS Resolution: ✓ Success (${address})`);
        }
      });
    } catch (e) {
      console.log(`  - Invalid URL format: ${e.message}`);
    }
  }
  
  return !!value;
}

console.log('=== Environment Variables Check ===');
const supabaseUrl = checkEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = checkEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
checkEnvVar('SHOPIFY_STORE_DOMAIN');
checkEnvVar('SHOPIFY_STOREFRONT_ACCESS_TOKEN');

// Only attempt connection if both Supabase variables are set
if (supabaseUrl && supabaseKey) {
  console.log('\n=== Testing Supabase Connection ===');
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test connection with a simple query
    supabase
      .from('orders')
      .select('count(*)')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.log(`Connection test: ✗ Failed`);
          console.log(`Error: ${error.message}`);
        } else {
          console.log(`Connection test: ✓ Success`);
          console.log(`Response received from Supabase`);
        }
      })
      .catch(err => {
        console.log(`Connection test: ✗ Failed`);
        console.log(`Error: ${err.message}`);
      });
  } catch (e) {
    console.log(`Connection test: ✗ Failed to initialize client`);
    console.log(`Error: ${e.message}`);
  }
}

// Check image domains configuration
console.log('\n=== Next.js Image Configuration ===');
const fs = require('fs');
const path = require('path');

try {
  const configPath = path.join(__dirname, '..', 'next.config.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Extract domains array using regex
  const domainsMatch = configContent.match(/domains:\s*\[(.*?)\]/s);
  if (domainsMatch && domainsMatch[1]) {
    const domains = domainsMatch[1]
      .split(',')
      .map(d => d.trim().replace(/['"]/g, ''))
      .filter(Boolean);
    
    console.log('Configured image domains:');
    domains.forEach(domain => console.log(`  - ${domain}`));
    
    // Check if placeholder domain is included
    if (domains.includes('via.placeholder.com')) {
      console.log('✓ Placeholder domain is correctly configured');
    } else {
      console.log('✗ Missing via.placeholder.com in image domains');
    }
  } else {
    console.log('Could not parse image domains from next.config.js');
  }
} catch (e) {
  console.log(`Error reading Next.js config: ${e.message}`);
}

// Test placeholder image accessibility
console.log('\n=== Testing Placeholder Image Accessibility ===');
const testUrl = 'https://via.placeholder.com/424x306?text=Test';
https.get(testUrl, (res) => {
  console.log(`Placeholder image status: ${res.statusCode} ${res.statusMessage}`);
  if (res.statusCode === 200) {
    console.log('✓ Placeholder service is accessible');
  } else {
    console.log('✗ Placeholder service returned non-200 status');
  }
}).on('error', (err) => {
  console.log(`Placeholder image error: ${err.message}`);
});
