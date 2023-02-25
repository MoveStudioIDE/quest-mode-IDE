import { execSync } from 'child_process';
import * as fs from 'fs';
import { CompileReturn, Project, SubmitReturn, TestReturn } from './types';
import dotenv from 'dotenv';
import axios from 'axios';
import { setupPackage } from './helpers';
// import stripAnsi from 'strip-ansi';

const MOCK_TEST_MODULE = `module overmind::birthday_bot_test {

  #[test]
  fun test() {
    
  }
}`

const TEMP_DIR = `${__dirname}/../temp-packages`;

export async function compile(project: Project): Promise<CompileReturn> {

  const challengeType = project.challenge.split('%')[0].toLowerCase();
  const challengeName = project.challenge.split('%')[1].toLowerCase();

  const tempProjectPath = await setupPackage(project, challengeType);

  // Compile the project
  try {
    execSync(
      `aptos move compile --package-dir ${tempProjectPath}`,
      { encoding: 'utf-8'}
    );

    const buildDirfiles = fs.readdirSync(`${tempProjectPath}/build/${challengeName}/bytecode_modules/`);
    let bytecodeFile;
    for(const file of buildDirfiles){
      if(file.endsWith(".mv")){
        bytecodeFile = file
      }
    }

    const compiledModules = fs.readFileSync(`${tempProjectPath}/build/${challengeName}/bytecode_modules/${bytecodeFile}`, "base64");

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });

    return {
      compiledModules: compiledModules as unknown as string[],
      errorCode: "",
      error: false
    }

  } catch (error: any) {
    console.log('error', error)
    const errorMessage = error.stdout;

    // Check error message for update needed message - TODO

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });
    
    return {
      compiledModules: [],
      errorCode: errorMessage,
      error: true
    }
  }
}

export async function testPackage(project: Project): Promise<TestReturn> {

  const challengeType = project.challenge.split('%')[0].toLowerCase();
  // const challengeName = project.challenge.split('%')[1].toLowerCase();

  const tempProjectPath = await setupPackage(project, challengeType);

  // Compile the project
  try {
    const test = execSync(
      `aptos move test --package-dir ${tempProjectPath}`,
      { encoding: 'utf-8'}
    );

    // Find the index of the unit test results
    const testResultsIndex = test.search(`Running Move unit tests`);

    // Get the unit test results
    const testResults = test.slice(testResultsIndex);

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });

    return {
      result: testResults,
      errorCode: "",
      error: false
    };

  } catch (error: any) { // Error is caught if compile or tests fail

    const errorMessageToIgnore = error.stdout;
    const errorMessage = error.stderr.replace(errorMessageToIgnore, '');

    // Remove the temporary project directory
    fs.rmdirSync(tempProjectPath, { recursive: true });
    

    return {
      result: "",
      errorCode: errorMessage,
      error: true
    };

  }
}

export async function submit(project: Project, user: string, callback: string): Promise<SubmitReturn>{
  const result = await testPackage(project);
  if(result.error){
    console.log("Error")
    return{
      user: user,
      ...result
    }
  }

  try{
    const res = await axios.get(callback+`?user=${user}`);
  }
  catch(error: any){
    console.error(error)
  }
  
  return {
    user,
    ...result
  }
}