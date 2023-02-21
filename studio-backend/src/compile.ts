import { execSync } from 'child_process';
import * as fs from 'fs';
import { Project } from './schema/user-schema';
import dotenv from 'dotenv';
import axios from 'axios';
// import stripAnsi from 'strip-ansi';



const TEMP_DIR = `${__dirname}/../temp-packages`;

// const exampleModule = fs.readFileSync(`${__dirname}/example.move`, 'utf8');

// const exampleProject = {
//   package: 'test',
//   modules: [
//     {
//       name: 'test',
//       code: exampleModule,
//     },
//   ],
//   dependencies: [
//     {
//       name: 'Sui',
//       address: '0x2',
//     },
//   ],
// };

type CompileReturn = {
  compiledModules: string[];
  errorCode: string;
  error: boolean;
}

type TestReturn = {
  result: string;
  errorCode: string;
  error: boolean;
}

type SubmitReturn = {
  user: string;
  result: string;
  errorCode: string;
  error: boolean;
}

function makeRandString(length: number) {
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

export async function compile(project: Project): Promise<CompileReturn> {

  // Created temporary project in user directory
  const tempProjectPath = `${TEMP_DIR}/${project.package+makeRandString(20)}`;

  // console.log(tempProjectPath)

  // Create the project directory
  fs.mkdirSync(tempProjectPath, { recursive: true });

  // Created the project's sources directory
  const tempProjectSourcesPath = `${tempProjectPath}/sources`;
  fs.mkdirSync(tempProjectSourcesPath, { recursive: true });

  // Add the module files to the project's sources directory
  project.modules.forEach((module) => {
    fs.writeFileSync(`${tempProjectSourcesPath}/${module.name}.move`, module.code);
  });

  // Create toml file based on the project's dependencies and project name
  let addresses = '';
  project.dependencies.forEach((dependency) => {
    addresses += `${dependency.name} = "${dependency.address}"\n`;
  });

  // NOTE: remove line in addresses once it is a default dependency in the FE
  // NOTE: I replaced the two dependencies with the ones used in the overmind repo 
  //        This was the old one: AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "main"  }

  const toml = `
    [package]
    name = "${project.package}"
    version = "0.0.1"
    [dependencies]
    MoveStdlib = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/move-stdlib", rev = "093b497d1267715a222845aad4fd3ca59da90e8d" }
    AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "093b497d1267715a222845aad4fd3ca59da90e8d" }
    [addresses]
    ${addresses}
  `;

  fs.writeFileSync(
    `${tempProjectPath}/Move.toml`,
    toml
  )

  // Compile the project
  try {
    execSync(
      `aptos move compile --package-dir ${tempProjectPath}`,
      { encoding: 'utf-8'}
    );

    const buildDirfiles = fs.readdirSync(`${tempProjectPath}/build/${project.package}/bytecode_modules/`);
    let bytecodeFile;
    for(const file of buildDirfiles){
      if(file.endsWith(".mv")){
        bytecodeFile = file
      }
    }

    const compiledModules = fs.readFileSync(`${tempProjectPath}/build/${project.package}/bytecode_modules/${bytecodeFile}`, "base64");

    // Remove the temporary project directory
    // NOTE: uncomment this line when done debugging
    // fs.rmdirSync(tempProjectPath, { recursive: true });

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
    // NOTE: uncomment this line when done debugging
    // fs.rmdirSync(tempProjectPath, { recursive: true });
    
    return {
      compiledModules: [],
      errorCode: errorMessage,
      error: true
    }
  }
}

export async function testPackage(project: Project): Promise<TestReturn> {
// Created temporary project in user directory
  const tempProjectPath = `${TEMP_DIR}/${project.package+makeRandString(20)}`;

  // console.log(tempProjectPath)

  // Create the project directory
  fs.mkdirSync(tempProjectPath, { recursive: true });

  // Created the project's sources directory
  const tempProjectSourcesPath = `${tempProjectPath}/sources`;
  fs.mkdirSync(tempProjectSourcesPath, { recursive: true });

  // Add the module files to the project's sources directory
  project.modules.forEach((module) => {
    fs.writeFileSync(`${tempProjectSourcesPath}/${module.name}.move`, module.code);
  });

  // Create toml file based on the project's dependencies and project name
  let addresses = '';
  project.dependencies.forEach((dependency) => {
    addresses += `${dependency.name} = "${dependency.address}"\n`;
  });

  // NOTE: remove line in addresses once it is a default dependency in the FE
  const toml = `
    [package]
    name = "${project.package}"
    version = "0.0.1"
    [dependencies]
    AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "main"  }
    [addresses]
    ${addresses}
  `;

  fs.writeFileSync(
    `${tempProjectPath}/Move.toml`,
    toml
  )

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

    const errorMessage = error.stdout;

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