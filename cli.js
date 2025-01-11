#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

async function main() {
  try {
    const { projectType } = await inquirer.prompt([{
      type: 'list',
      name: 'projectType',
      message: 'What type of project are you using?',
      choices: ['JavaScript', 'TypeScript']
    }]);

    const sourceDir = projectType === 'JavaScript' ? 
      path.join(__dirname, 'templates/js') : 
      path.join(__dirname, 'templates/ts');

    const targetPaths = {
      api: path.join(process.cwd(), 'app/api/droplert'),
      components: path.join(process.cwd(), 'components/droplert'),
      lib: path.join(process.cwd(), 'lib'),
      utils: path.join(process.cwd(), 'lib/utils.ts')
    };

    if (!fs.existsSync(targetPaths.components)) {
      console.log('Creating /components directory...');
      fs.mkdirSync(targetPaths.components, { recursive: true });
    }

    if (!fs.existsSync(targetPaths.lib)) {
      console.log('Creating /lib directory...');
      fs.mkdirSync(targetPaths.lib, { recursive: true });
    }

    if (fs.existsSync(targetPaths.utils)) {
      const { overwriteUtils } = await inquirer.prompt([{
        type: 'confirm',
        name: 'overwriteUtils',
        message: 'utils.ts already exists in /lib. Do you want to overwrite it?',
        default: false
      }]);

      if (!overwriteUtils) {
        console.log('Skipping utils.ts overwrite.');
      } else {
        await fs.copy(path.join(sourceDir, 'lib/utils.ts'), targetPaths.utils);
        console.log('✅ utils.ts overwritten successfully.');
      }
    } else {
      await fs.copy(path.join(sourceDir, 'lib/utils.ts'), targetPaths.utils);
      console.log('✅ utils.ts copied successfully.');
    }

    await Promise.all([
      fs.copy(path.join(sourceDir, 'api'), targetPaths.api),
      fs.copy(path.join(sourceDir, 'components'), targetPaths.components)
    ]);

    console.log('✅ Droplert files installed successfully!');
    console.log("Please configure the following env variables:\n");

    console.log(`DROPLERT_KEY: Go to https://droplert.vercel.app/ to get your key`);
    console.log(`NEXT_PUBLIC_DROPLERT_ID: Go to https://droplert.vercel.app/ to get your ID`);
    console.log(`NEXT_PUBLIC_WS_SERVER_URL: https://alertsockets.onrender.com/`);
    
  } catch (error) {
    console.error('❌ Error during installation:', error);
    process.exit(1);
  }
}

main().catch(console.error);