import { compile, submit, testPackage } from "../compile";
import * as fs from 'fs';

const code1 = fs.readFileSync("./testPackages/hello-blockchain/sources/hello_blockchain.move", "utf-8");
const code2 = fs.readFileSync("./testPackages/hello-blockchain/sources/hello_blockchain_test.move", "utf-8");
const project = {
    package: 'hello_blockchain',
    modules: [
        {
            name: 'hello_blockchain',
            code: code1,
        },
        {
            name: 'hello_blockchain_test',
            code: code2,
        },
    ],
    dependencies: [
        {
            name: "hello_blockchain",
            address: "0x0"
        },
    ],
};

// test("Tests Aptos compile", async () => {
//     const res = await compile(project);
//     console.log(res.compiledModules)
// })

// test("Tests Aptos test", async () => {
//     const testResults = await testPackage(project);
//     console.log(testResults.result)
// })

test("Tests submit and Callback", async () => {
    const res = await submit(project, "greenpeppers100", " https://webhook.site/d82b7724-bccc-4b76-b94a-8974849bf13a")

})

