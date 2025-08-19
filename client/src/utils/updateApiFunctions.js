// This script will update all API functions to use the new fetchApi utility
const fs = require('fs');
const path = require('path');

const apiFilePath = path.join(__dirname, 'api.js');

// Read the current api.js file
let apiContent = fs.readFileSync(apiFilePath, 'utf8');

// Replace all fetch calls with fetchApi
apiContent = apiContent.replace(
  /const response = await fetch\(`\${API_BASE_URL}\${API_PREFIX}([^`]+)`, \{[\s\S]*?\}\);/g,
  'return fetchApi("$1", {'
);

// Remove the old imports and handleResponse function
apiContent = `import fetchApi from './apiConfig';

${apiContent}`;

// Write the updated content back to the file
fs.writeFileSync(apiFilePath, apiContent, 'utf8');

console.log('API functions updated successfully!');
