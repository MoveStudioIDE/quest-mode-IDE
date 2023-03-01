import { execSync } from 'child_process';
import * as fs from 'fs';
import { CompileReturn, Project, SubmitReturn, TestReturn } from './types';
import axios from 'axios';
// import stripAnsi from 'strip-ansi';

const MOCK_TEST_MODULE = `module overmind::birthday_bot_test {

  #[test]
  fun test() {
    
  }
}`

export async function compile(projectName: string, projectPath: string): Promise<CompileReturn> {

  // Compile the project
  try {
    execSync(
      `aptos move compile --package-dir ${projectPath}`,
      { encoding: 'utf-8'}
    );

    const buildDirfiles = fs.readdirSync(`${projectPath}/build/${projectName}/bytecode_modules/`);
    let bytecodeFile;
    for(const file of buildDirfiles){
      if(file.endsWith(".mv")){
        bytecodeFile = file
      }
    }

    const compiledModules = fs.readFileSync(`${projectPath}/build/${projectName}/bytecode_modules/${bytecodeFile}`, "base64");

    // Remove the temporary project directory
    fs.rmdirSync(projectPath, { recursive: true });

    return {
      compiledModules: compiledModules as unknown as string[],
      errorCode: "",
      error: false
    }

  } catch (error: any) {
    // console.log('error', error)
    const errorMessage = error.stdout;

    // Check error message for update needed message - TODO

    // Remove the temporary project directory
    fs.rmdirSync(projectPath, { recursive: true });
    
    return {
      compiledModules: [],
      errorCode: errorMessage,
      error: true
    }
  }
}

export async function testPackage(projectPath: string): Promise<TestReturn> {

  // Test the project
  try {
    const test = execSync(
      `aptos move test --package-dir ${projectPath}`,
      { encoding: 'utf-8'}
    );

    // Find the index of the unit test results
    const testResultsIndex = test.search(`Running Move unit tests`);

    // Get the unit test results
    const testResults = test.slice(testResultsIndex);

    // Remove the temporary project directory
    fs.rmdirSync(projectPath, { recursive: true });

    return {
      result: testResults,
      errorCode: "",
      error: false
    };

  } catch (error: any) { // Error is caught if compile or tests fail

    const errorMessageToIgnore = error.stdout;
    const errorMessage = error.stderr.replace(errorMessageToIgnore, '');

    // Remove the temporary project directory
    fs.rmdirSync(projectPath, { recursive: true });
    

    return {
      result: "",
      errorCode: errorMessage,
      error: true
    };

  }
}

export async function submit(projectDir: string, user: string, callback: string): Promise<SubmitReturn>{
  const result = await testPackage(projectDir);
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