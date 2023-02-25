import * as fs from 'fs';
import { Challenge, ChallengeType, Module} from './types';

export function getChallenge(type: ChallengeType, challengeName: string): Challenge{
    const dir = `./${type}s/${challengeName}`

    const sourceDir = dir+`/sources`
    const sourceFiles = fs.readdirSync(sourceDir)

    const sources: Module[] = []
    for(const name of sourceFiles){
        const code = fs.readFileSync(sourceDir+`/${name}`)
        sources.push({
            name,
            code
        })
    }

    const config = fs.readFileSync(dir+`/config.json`)

    const challenge = {
        modules:sources,
        config
    }

    return challenge
}