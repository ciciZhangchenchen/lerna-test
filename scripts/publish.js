const readline = require('readline');
const child_process = require('child_process')
const fs = require('fs');
const path = require('path');
require('colors');
console.log('>> start building...'.green)
child_process.execSync('lerna run buildts');
console.log('✔ built'.green)
console.log('>> add dist dir...'.green)
child_process.execSync(`git add ./packages/*/dist -f`);
child_process.execSync(`git commit -am "add dist files" && git push origin master --force`);
console.log('✔ added'.green)
console.log('>> publish...'.green)
// child_process.execSync('lerna publish');