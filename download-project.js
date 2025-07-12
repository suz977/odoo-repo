#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create directory structure
const dirs = [
  'src',
  'src/components',
  'src/components/Layout',
  'src/components/Auth',
  'src/components/Dashboard',
  'src/components/Skills',
  'src/components/Matches',
  'src/components/Requests',
  'src/components/Profile',
  'src/components/Admin',
  'src/contexts',
  'src/types'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log('Directory structure created!');
console.log('\nNext steps:');
console.log('1. Download all files from the Bolt editor');
console.log('2. Place them in the correct directories');
console.log('3. Run: npm install');
console.log('4. Initialize Git repository');