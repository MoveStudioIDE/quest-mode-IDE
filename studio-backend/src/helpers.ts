import * as fs from 'fs';
import { Project } from './types';

const TEMP_DIR = `${__dirname}/../temp-packages`;

function makeRandString(length: number){
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export async function setupPackage(project: Project, challengeType: string): Promise<string> {
  
  const challengeName = project.challenge.split('%')[1].toLowerCase();
  
  // Created temporary project in user directory
  const tempProjectPath = `${TEMP_DIR}/${challengeName+makeRandString(20)}`;

  // Create the project directory
  fs.mkdirSync(tempProjectPath, { recursive: true });

  // Created the project's sources directory
  const tempProjectSourcesPath = `${tempProjectPath}/sources`;
  fs.mkdirSync(tempProjectSourcesPath, { recursive: true });

  // Add the module files to the project's sources directory
  project.templates.forEach((module) => {
    fs.writeFileSync(`${tempProjectSourcesPath}/${module.name}.move`, module.code);
  });

  console.log(fs.readFileSync(`${__dirname}/../${challengeType}s/${challengeName}/Move.toml`, 'utf-8'))

  fs.writeFileSync(
    `${tempProjectPath}/Move.toml`,
    fs.readFileSync(`${__dirname}/../${challengeType}s/${challengeName}/Move.toml`, 'utf-8')
  )

  return tempProjectPath;
}