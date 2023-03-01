import cors from 'cors';
import express from 'express';
import { getChallengDir, getChallenge, getConfig, getTemplates } from './challenges';
import { compile, testPackage } from './compile';
import { compilePuzzle, testPuzzle } from './puzzles';
import { compileQuest, testQuest } from './quests';
import { ChallengeType, CompileReturn, TestReturn } from './types';

const app = express();
const portHttp = 80;
const portHttps = 443;

// // PRODUCTION
// import https from 'https';
// import fs from 'fs';
// const CERT_PATH = "/etc/letsencrypt/live/api.movestudio.dev/fullchain.pem"
// const KEY_PATH = "/etc/letsencrypt/live/api.movestudio.dev/privkey.pem"
// const options = {
//   key: fs.readFileSync(KEY_PATH),
//   cert: fs.readFileSync(CERT_PATH)
// };
// const httpsServer = https.createServer(options, app);
// httpsServer.listen(portHttps, () => {
// 	console.log('HTTPs Server running on port ', portHttps);
// });


app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// app.get('/projects/:address', (req, res) => {
//   const address = req.params.address as string;

//   // Get projects for address
//   const projects = getProjectsOfAddress(address);

//   res.send(projects);
// });

app.get('/challenge', async (req, res) => {
  const type = req.query.type as ChallengeType;
  const name = req.query.name as string;
  const challenge = getChallenge(type, name);
  res.send({
    templateNames: challenge.templates.map((template) => template.name),
    templates: challenge.templates.map((template) => template.code.toString('base64')),
    config: challenge.config.toString("base64")
  });
});

app.get('/config', async (req, res) => {
  const type = req.query.type as ChallengeType;
  const name = req.query.name as string;
  const challengeDir = getChallengDir(type, name)
  const config = getConfig(challengeDir)
  res.send({
    config: config.toString("base64")
  });
});

app.get('/templates', async (req, res) => {
  const type = req.query.type as ChallengeType;
  const name = req.query.name as string;
  const challengeDir = getChallengDir(type, name)
  const templates = getTemplates(challengeDir)
  res.send({
    templateNames: templates.map((template) => template.name),
    templates: templates.map((template) => template.code.toString('base64'))
  });
});

app.post('/compile', async (req, res) => {
  const project = req.body;

  const challengeType = project.challenge.split('%')[0].toLowerCase();

  console.log('compiling project...')

  let compileResult: CompileReturn;
  if(challengeType == "puzzle"){
    compileResult = await compilePuzzle(project)
  }
  else if(challengeType == "quest"){
    compileResult  = await compileQuest(project)
  }
  else{
    res.sendStatus(400).send("Invalid challenge type")
    return;
  }

  res.send(compileResult);

});

app.post('/test', async (req, res) => {
  const project = req.body;

  const challengeType = project.challenge.split('%')[0].toLowerCase();

  console.log('testing project...')

  let testResult: TestReturn;
  if(challengeType == "puzzle"){
    testResult = await testPuzzle(project)
  }
  else if(challengeType == "quest"){
    testResult  = await testQuest(project)
  }
  else{
    res.sendStatus(400).send("Invalid challenge type")
    return;
  }

  res.send(testResult);

});

app.listen(process.env.PORT || portHttp, () => {
  console.log(`REST API is listening on port: ${process.env.PORT || portHttp}.`);
});