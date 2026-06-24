#!/bin/sh
# Strip private Mocha platform packages that need registry auth not
# available in Vercel. vite.config.vercel.ts does not import them.
node -e "
const fs=require('fs');
const p=JSON.parse(fs.readFileSync('package.json','utf8'));
delete p.devDependencies['@getmocha/vite-plugins'];
delete p.devDependencies['@getmocha/users-service'];
fs.writeFileSync('package.json',JSON.stringify(p,null,2));
"
npm install --include=dev
