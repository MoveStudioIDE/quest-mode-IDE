import * as fs from "fs";
import { getTemplates } from "./challenges";
import { Template } from "./types";

export function getPlaceholder(questDir: string): Buffer{
    return fs.readFileSync(questDir+`/placeholder.move`)
}

export function assembleQuest(templates: Template[], questDir: string, outputFile: string){
    let tempStrs = templates.map((t) => t.code.toString());
    const tempNames = templates.map((t) => t.name.slice(0, t.name.length-5));

    const placeholder = getPlaceholder(questDir).toString();
    let assembled = placeholder;

    for(let i=0; i<tempNames.length; i++){
        assembled = assembled.replace(`//${tempNames[i]}`, tempStrs[i])
    }

    fs.writeFileSync(outputFile, assembled)
}   

export function transferQuestTests(templates: Template[], questDir: string, tempDir: string){
    const questTests = fs.readdirSync(questDir+"/tests");
    const tempNames = templates.map((t) => t.name.slice(0, t.name.length-5));

    if(!fs.existsSync(tempDir+"/sources")){
        console.log("Making")
        fs.mkdirSync(tempDir+"/sources/", {recursive: true})
    }

    for(const name of tempNames){
        const testName = `${name}_test.move`
        if(questTests.includes(testName)){
            fs.copyFileSync(questDir+`/tests/${testName}`, tempDir+`/sources/${testName}`);
        }
    }

}