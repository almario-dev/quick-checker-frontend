import fs from 'fs';
import jsonfile from 'jsonfile';
import path from 'path';

// Get the current version from package.json
const packageJson = await jsonfile.readFile('./package.json');
const appVersion = packageJson.version;

// Derive versionCode from the current version (could be custom logic)
const versionParts = appVersion.split('.'); // Assuming "1.2.3"
const versionCode =
  parseInt(versionParts[0]) * 10000 + parseInt(versionParts[1]) * 100 + parseInt(versionParts[2]);

// Define the path to build.gradle
const buildGradlePath = path.join(process.cwd(), 'src-capacitor', 'android', 'app', 'build.gradle');

// Read the build.gradle file
let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

// Replace versionCode and versionName in the build.gradle file
buildGradle = buildGradle.replace(/versionCode \d+/g, `versionCode ${versionCode}`);
buildGradle = buildGradle.replace(/versionName ".*"/g, `versionName "${appVersion}"`);

// Write the updated build.gradle back to the file
fs.writeFileSync(buildGradlePath, buildGradle, 'utf8');

console.log(`Updated versionCode to ${versionCode} and versionName to ${appVersion}`);
