const fs = require('fs');
let src = fs.readFileSync('server.js','utf8');
// Replace signInActivity reference with createdDateTime
src = src.replace(
  "const lastLogin = user.signInActivity?.lastSignInDateTime;",
  "const lastLogin = user.createdDateTime || null;"
);
src = src.replace(
  "lastLogin: lastLogin ? `${daysSince}d ago` : \"Never\",",
  "lastLogin: lastLogin ? `created ${daysSince}d ago` : \"Unknown\","
);
fs.writeFileSync('server.js', src);
console.log('Patched');
