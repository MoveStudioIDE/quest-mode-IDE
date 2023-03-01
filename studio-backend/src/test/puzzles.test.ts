import { compile, submit, testPackage } from "../compile";
import * as fs from 'fs';
import { compilePuzzle, testPuzzle } from "../puzzles";

const code1 = fs.readFileSync("./puzzles/hello_blockchain/templates/hello_blockchain.move");
const code2 = fs.readFileSync("./puzzles/hello_blockchain/tests/hello_blockchain_test.move");
const project = {
    challenge: 'puzzle%hello_blockchain',
    templates: [
        {
            name: 'hello_blockchain',
            code: code1,
        },
        {
            name: 'hello_blockchain_test',
            code: code2,
        },
    ],
    // dependencies: [
    //     {
    //         name: "hello_blockchain",
    //         address: "0x0"
    //     },
    // ],
};

// test("Tests Aptos compile", async () => {
//     const res = await compile(project);
//     console.log(res.compiledModules)
// })

test("Tests Aptos test", async () => {
    
    const testResults = await testPuzzle(project);
    console.log(testResults.result) //Fails Because 
})

test("Compile Aptos test", async () => {
    
    const compileResult = await compilePuzzle(project);
    console.log(compileResult.compiledModules) //Fails Because 
})
// test("Tests submit and Callback", async () => {
//     const res = await submit(project, "greenpeppers100", " https://webhook.site/d82b7724-bccc-4b76-b94a-8974849bf13a")

// })

