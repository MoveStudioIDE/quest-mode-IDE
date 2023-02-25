import * as fs from "fs";
import { getChallengDir, getTemplates, transferChallengeToml } from "../challenges"
import { assembleQuest, transferQuestTests } from "../quests";

describe("Tests quest functions", () => {

    // it("Tests assemble quest", () => {
    //     const questDir = getChallengDir("quest", "birthday_bot");
    //     const templates = getTemplates(questDir);
    //     assembleQuest(templates, questDir, "./temp-packages/tests/assembled.move");
    // })

    it("Tests transfer tests", () => {
        const code = fs.readFileSync("./quests/birthday_bot/templates/add_birthday_gift.move");
        const template = {
            code: code,
            name: "add_birthday_gift.move"
        }

        const questName = "birthday_bot"
        const questDir = getChallengDir("quest", "birthday_bot");
        const destDir = "./temp-packages/thiswillberandom"

        transferChallengeToml(questDir, destDir)
        assembleQuest([template], questName, questDir, destDir)
        transferQuestTests([template], questDir, destDir);
    })

})