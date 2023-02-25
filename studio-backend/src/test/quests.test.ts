import { getChallengDir, getTemplates } from "../challenges"
import { assembleQuest, transferQuestTests } from "../quests";

describe("Tests quest functions", () => {

    // it("Tests assemble quest", () => {
    //     const questDir = getChallengDir("quest", "birthday_bot");
    //     const templates = getTemplates(questDir);
    //     assembleQuest(templates, questDir, "./temp-packages/tests/assembled.move");
    // })

    it("Tests transfer tests", () => {
        const template = {
            code: new Buffer("a;skjdf;aksjdf", "base64"),
            name: "add_birthday_gift.move"
        }

        const questDir = getChallengDir("quest", "birthday_bot");
        transferQuestTests([template], questDir, "./temp-packages/thiswillberandom");
    })

})