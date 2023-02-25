import cors from 'cors';
import express from 'express';
import { getChallenge } from './challenges';
import { compile, testPackage } from './compile';
import { ChallengeType } from './types';

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
    templates: challenge.modules.map((module) => module.code.toString('base64')),
    config: challenge.config.toString("base64")
  });
});

app.post('/compile', async (req, res) => {
  const project = req.body;

  // console.log(project);
  console.log('compiling project...')

  // Call compile function
  const compileResult = await compile(project);

  // console.log(compileResult)

  res.send(compileResult);

});

app.post('/test', async (req, res) => {
  const project = req.body;

  // console.log(project);
  console.log('testing project...')

  // Call compile function
  const testResults = await testPackage(project);

  // console.log(compileResult)

  res.send(testResults);

});

app.listen(process.env.PORT || portHttp, () => {
  console.log(`REST API is listening on port: ${process.env.PORT || portHttp}.`);
});