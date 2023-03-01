import * as fs from "fs";
import { getTemplates, transferChallengeToml } from "./challenges";
import { compile, testPackage } from "./compile";
import { makeRandString } from "./helpers";
import { Project, Template } from "./types";

const TEMP_DIR = `${__dirname}/../temp-packages`;
const QUEST_DIR = `${__dirname}/../quests`;

export function getPlaceholder(questDir: string): Buffer{
    return fs.readFileSync(questDir+`/placeholder.move`)
}

export function assembleQuest(templates: Template[], questName: string, questDir: string, tempDir: string){
    if(!fs.existsSync(tempDir+"/sources")){
        fs.mkdirSync(tempDir+"/sources/", {recursive: true})
    }

    let tempStrs = templates.map((t) => t.code.toString());
    const tempNames = templates.map((t) => t.name.slice(0, t.name.length-5));

    const placeholder = getPlaceholder(questDir).toString();
    let assembled = placeholder;

    for(let i=0; i<tempNames.length; i++){
        assembled = assembled.replace(`//${tempNames[i]}`, tempStrs[i])
    }

    fs.writeFileSync(tempDir+`/sources/${questName}.move`, assembled)
}   

export function transferQuestTests(templates: Template[], questDir: string, tempDir: string){
    const questTests = fs.readdirSync(questDir+"/tests");
    const tempNames = templates.map((t) => t.name.slice(0, t.name.length-5));

    if(!fs.existsSync(tempDir+"/sources")){
        fs.mkdirSync(tempDir+"/sources/", {recursive: true})
    }

    for(const name of tempNames){
        const testName = `${name}_test.move`
        if(questTests.includes(testName)){
            fs.copyFileSync(questDir+`/tests/${testName}`, tempDir+`/sources/${testName}`);
        }
    }
}

export async function compileQuest(project: Project){
    const questName = project.challenge.split('%')[1].toLowerCase();
    const questDir = QUEST_DIR+`/${questName}`;
    const projectDir = TEMP_DIR+`/${questName + makeRandString(20)}`;
    assembleQuest(project.templates, questName, questDir, projectDir); 
    transferQuestTests(project.templates, questDir, projectDir);
    transferChallengeToml(questDir, projectDir);
    const compileResult = await compile(questName, projectDir);
    return compileResult;
}

export async function testQuest(project: Project){
    const questName = project.challenge.split('%')[1].toLowerCase();
    const questDir = QUEST_DIR+`/${questName}`;
    const projectDir = TEMP_DIR+`/${questName + makeRandString(20)}`;
    assembleQuest(project.templates, questName, questDir, projectDir); 
    transferQuestTests(project.templates, questDir, projectDir);
    transferChallengeToml(questDir, projectDir);
    const testResult = await testPackage(projectDir);
    return testResult;
}
