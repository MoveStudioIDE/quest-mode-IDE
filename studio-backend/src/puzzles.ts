import * as fs from 'fs';
import { transferChallengeTests, transferChallengeToml } from './challenges';
import { compile, testPackage } from './compile';
import { makeRandString } from './helpers';
import { Project, Template } from './types';

const TEMP_DIR = `${__dirname}/../temp-packages`;
const PUZZLES_DIR = `${__dirname}/../puzzles`;

export async function assemblePuzzle(project: Project, puzzleName: string, outputDir: string): Promise<string> {
    
    // Created temporary project in user directory
    const tempProjectPath = `${outputDir}/${puzzleName+makeRandString(20)}`;
  
    // Create the project directory
    fs.mkdirSync(tempProjectPath, { recursive: true });
  
    // Created the project's sources directory
    const tempProjectSourcesPath = `${tempProjectPath}/sources`;
    fs.mkdirSync(tempProjectSourcesPath, { recursive: true });
  
    // Add the module files to the project's sources directory
    project.templates.forEach((module) => {
      fs.writeFileSync(`${tempProjectSourcesPath}/${module.name}.move`, module.code);
    });
  
    fs.readFileSync(`${__dirname}/../puzzles/${puzzleName}/Move.toml`, 'utf-8')
  
    fs.writeFileSync(
      `${tempProjectPath}/Move.toml`,
      fs.readFileSync(`${__dirname}/../puzzles/${puzzleName}/Move.toml`, 'utf-8')
    )
  
    return tempProjectPath;
  }

export async function compilePuzzle(project: Project){
    const challengeName = project.challenge.split('%')[1].toLowerCase();
    const puzzlePath = PUZZLES_DIR+`/${challengeName}`;
    const projectPath = await assemblePuzzle(project, challengeName, TEMP_DIR)
    transferChallengeToml(puzzlePath, projectPath);
    const compileResult = await compile(challengeName, projectPath);
    return compileResult;
}

export async function testPuzzle(project: Project){
    const challengeName = project.challenge.split('%')[1].toLowerCase();
    const puzzlePath = PUZZLES_DIR+`/${challengeName}`;
    console.log(puzzlePath)
    const projectPath = await assemblePuzzle(project, challengeName, TEMP_DIR)
    transferChallengeTests(project.templates, puzzlePath, projectPath)
    transferChallengeToml(puzzlePath, projectPath);
    const testResult = await testPackage(projectPath);
    return testResult;
}