import * as fs from 'fs';
import { Challenge, ChallengeType, Template} from './types';

export function getChallenge(type: ChallengeType, challengeName: string): Challenge{
    const challengeDir = getChallengDir(type, challengeName)
    const templates = getTemplates(challengeDir);
    const config = getConfig(challengeDir)

    const challenge = {
        templates,
        config
    }

    return challenge
}

export function getChallengDir(type: ChallengeType, challengeName: string): string {
    return `./${type}s/${challengeName}`;
}

export function getConfig(challengeDir: string): Buffer {
   return fs.readFileSync(challengeDir+`/config.json`)
}

export function getTemplates(challengeDir: string): Template[] {
    const templatesDir = challengeDir+`/templates`
    const sourceFiles = fs.readdirSync(templatesDir)

    const templates: Template[] = []
    for(const name of sourceFiles){
        const code = fs.readFileSync(templatesDir+`/${name}`)
        templates.push({
            name,
            code
        })
    }
    return templates
}