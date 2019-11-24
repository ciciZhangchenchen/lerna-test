const readline = require('readline');
const child_process = require('child_process')
const fs = require('fs');
const path = require('path');
require('colors');
const getReadline = (tips) => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}
getReadline(`Please enter your package name, we will add a preset @cici/bbk- with it `.green).then(async pkgName => {
    const folderName = path.resolve( __dirname, `../packages/bbk-${pkgName}`) 
    if (fs.existsSync(folderName)) {
      console.log(`Sorry, bbk-${pkgName} is exsit`.red)
      return;
    } 
    const description = await getReadline(`Please enter your description`);
    const packageJson = require('../configs/createTemp')
    packageJson.name = `${packageJson.name}${pkgName}`;
    packageJson.description = description || `${packageJson.description}${pkgName}`;
    const readme = getReadMeContent(pkgName,description)
    const tsconfig = getTsconfig()
    fs.mkdirSync(folderName);
    fs.mkdirSync(path.resolve(folderName,`./src`));
    fs.writeFileSync(path.resolve(folderName, './src/index.tsx'), '', 'utf8');
    fs.mkdirSync(path.resolve(folderName,`./__tests__`));
    fs.writeFileSync(path.resolve(folderName, './__tests__/test.ts'), '', 'utf8');
    fs.writeFileSync(path.resolve(folderName, './package.json'), JSON.stringify(packageJson), 'utf8');
    fs.writeFileSync(path.resolve(folderName, './tsconfig.json'), JSON.stringify(tsconfig), 'utf8')
    fs.writeFileSync(path.resolve(folderName, './README.md'), readme, 'utf8')
    // add dependence
    const dependencies= packageJson.dependencies
    console.log(`dependencies`, dependencies)
    if (dependencies) {
      Object.keys(dependencies).forEach(de => {
        const cmd = `lerna add ${de} --scope ${packageJson.name}`
        console.log(`exce amd`.green, cmd)
        child_process.spawnSync(`lerna add ${de} --scope ${packageJson.name}`)
      })
    }
    console.log(`✔ Create package success`.green)
})

const getReadMeContent = (pkgName,description) => {
    return `
    # \`${pkgName}\`
    > ${description || "TODO: description"}
    ## Usage
    \`\`\`
    ${
      ` npm i ${pkgName}`
    }
    // TODO: DEMONSTRATE API
    \`\`\`
  `;
}
const getTsconfig = () =>({
        "extends": "../../tsconfig.json",
        "compilerOptions": {
          "outDir": "./dist"
        },
        "include": ["./src"]
      })
