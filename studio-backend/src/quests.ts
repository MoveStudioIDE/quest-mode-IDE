import * as fs from "fs";
import { getTemplates } from "./challenges";

function getPlaceholder(questDir: string): Buffer{
    return fs.readFileSync(questDir+`/placeholder.move`)
}

function assembleQuest(questDir: string){
    const templates = getTemplates(questDir);



    const placeholder = getPlaceholder(questDir).toString();



}   