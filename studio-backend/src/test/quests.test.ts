import * as fs from "fs";
import { assembleQuest, compileQuest } from "../quests";

describe("Tests quest functions", () => {

    // it("Tests assemble quest", () => {
    //     const questDir = getChallengDir("quest", "birthday_bot");
    //     const templates = getTemplates(questDir);
    //     assembleQuest(templates, questDir, "./temp-packages/tests/assembled.move");
    // })

    it("Tests transfer tests", async () => {
        const code = fs.readFileSync("./quests/birthday_bot/templates/add_birthday_gift.move");
        const template = {
            code: code,
            name: "add_birthday_gift.move"
        }

        const project = {
            challenge: "quest%birthday_bot",
            templates: [template]
        }

        const compileResult = await compileQuest(project);
        // console.log(compileResult)
    })

})