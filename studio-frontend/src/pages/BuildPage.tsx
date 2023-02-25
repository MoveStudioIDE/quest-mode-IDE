import PageLayout from "./utils/PageLayout";
import BuildInnerSidebar from "../components/BuildInnerSidebar";
import BuildCanvas from "../components/BuildCanvas";
import { useEffect, useState } from "react";
import { IndexedDb } from "../db/ProjectsDB";
import { getProjectData } from "../db/ProjectDB";
// import { Project } from "../types/project-types";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Joyride from 'react-joyride';
import {SPINNER_COLORS} from "../utils/theme";
import ScaleLoader from "react-spinners/ScaleLoader";
import Module from "module";
import {Buffer} from 'buffer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80/';

enum CHALLENGE_TYPE {
  puzzle, 
  quest
}

type PuzzleConfig = {
  name: string,
  description: string, 
  objective: string,
  instructions: string[],
}

type QuestConfig = {
  name: string, 
  description: string, 
  objective: string,
  steps: string[], 
  objectives: string[],
  instructions: string[][],
}

type ChallengeConfig = PuzzleConfig | QuestConfig;

export type Challenge = Puzzle | Quest;

export type Puzzle = {
  templates: PuzzleTemplates[]
}

export type Quest = {
  templates: string[],
}

export type PuzzleTemplates = {
  name: string,
  code: string,
}


function BuildPage(props: {
  challenge: string // Encoding: TYPE%NAME
}) {

  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState<JSX.Element | undefined>();

  // Challenge data
  const [challengeType, setChallengeType] = useState<CHALLENGE_TYPE>();
  const [challengeConfig, setChallengeConfig] = useState<ChallengeConfig>();

  useEffect(() => {
    const challengeType1 = props.challenge.split('%')[0].toLowerCase();
    if (challengeType1 === 'puzzle') {
      setChallengeType(CHALLENGE_TYPE.puzzle);
    } else if (challengeType1 === 'quest') {
      setChallengeType(CHALLENGE_TYPE.quest);
    } else {
      return
    }
  }, [props.challenge]);

  // Initialize indexedDb
  let indexedDb: IndexedDb;
  useEffect(() => {    

    // Retrieve challenge data from backend
    const getChallengConfigeData = async () => {
      
      const challengeName = props.challenge.split('%')[1];
      const challengeType1 = props.challenge.split('%')[0].toLowerCase();
      console.log(`Challenge name: ${challengeName}`);
      console.log(`Challenge type: ${challengeType1}`);

      if (challengeType1 === 'puzzle') {
        await setChallengeType(CHALLENGE_TYPE.puzzle);
      } else if (challengeType1 === 'quest') {
        await setChallengeType(CHALLENGE_TYPE.quest);
      } else {
        return
      }

      console.log(`Challenge type: ${challengeType}`)

      if (challengeType === undefined) {
        return
      }

      const res = await axios.get(`${BACKEND_URL}config?type=${CHALLENGE_TYPE[challengeType]}&name=${challengeName}`); // Figure out this with evan
      let challengeConfigData;
      console.log('res.data.config', res.data.config)
      const challengeConfigDataEncoded = Buffer.from(res.data.config, 'base64');
      if (challengeType === CHALLENGE_TYPE.puzzle) {
        challengeConfigData = JSON.parse(challengeConfigDataEncoded.toString()) as PuzzleConfig;
      } else if (challengeType === CHALLENGE_TYPE.quest){
        challengeConfigData = JSON.parse(challengeConfigDataEncoded.toString()) as QuestConfig;
      } else {
        return
      }
      console.log('challengeConfigData', challengeConfigData);
      setChallengeConfig(challengeConfigData);
    }

    const initializeIndexedDb = async () => {

      if (challengeType === undefined) {
        return
      }

      indexedDb = new IndexedDb(`move-studio-ide-${CHALLENGE_TYPE[challengeType]}`);
      await indexedDb.createObjectStore(['challenges'], {keyPath: 'challenge'});
      
      const existingUser = localStorage.getItem(props.challenge);
      console.log('existingUser', existingUser);
      if (!existingUser) {
        console.log('setting user');
        localStorage.setItem(props.challenge, 'true');
        
        const res = await axios.get(`${BACKEND_URL}templates?type=${CHALLENGE_TYPE[challengeType]}&name=${challengeName}`); // Figure out this with evan
        const templatesBase64 = res.data as {templates: string[], templateNames: string[]};
        console.log('templatesBase64', templatesBase64)
        const decodedTemplates = templatesBase64.templates.map((template) => (Buffer.from(template, 'base64').toString()));

        const templates = decodedTemplates.map((template, index) => {
          return {
            name: templatesBase64.templateNames[index],
            code: template,
          }
        });
        
        await indexedDb.putValue('challenges', {
          challenge: props.challenge,
          templates: templates
        }); 
      }
         
    }

    if (props.challenge.split('%').length !== 2) {
      throw new Error('Invalid challenge');
    }

    const challengeName = props.challenge.split('%')[1];
    const challengeType1 = props.challenge.split('%')[0].toLowerCase();
    console.log(`Challenge name: ${challengeName}`);
    console.log(`Challenge type: ${challengeType1}`);

    if (challengeType1 === 'puzzle') {
      setChallengeType(CHALLENGE_TYPE.puzzle);
    } else if (challengeType1 === 'quest') {
      setChallengeType(CHALLENGE_TYPE.quest);
    } else {
      return
    }


    getChallengConfigeData().then(() => {
      initializeIndexedDb().then(() => {
        getProjectData(props.challenge);
      });
    });

  }, [challengeType]);

  const [code, setCode] = useState('');

  const [challenge, setChallenge] = useState<Challenge>();
  const [currentModule, setCurrentModule] = useState<string>();

  const [compiledModules, setCompiledModules] = useState<string[]>([]);
  const [compileError, setCompileError] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [testResults, setTestResults] = useState<string>('');
  const [showTestResults, setShowTestResults] = useState(false);

  const [activeModules, setActiveModules] = useState<string[]>([]);
  

  //---Helpers---//

  const getProjectData = async (project: string) => {
    if (challengeType === undefined) {
      return
    }
    indexedDb = new IndexedDb(`move-studio-ide-${CHALLENGE_TYPE[challengeType]}`);
    await indexedDb.createObjectStore(['challenges'], {keyPath: 'challenge'});
    const challengeData = await indexedDb.getValue('challenges', project);
    setChallenge(challengeData);
  }

  const compileCode = () => {
    
    setToast(
      <div className="alert alert-info">
        <div>
          <ScaleLoader
            color={SPINNER_COLORS[theme].infoContent}
            height={20}
          />
          <span className="normal-case" style={{color: 'hsl(var(--inc))'}} >Compiling...</span>
        </div>
      </div>
    )

    setCompileError('');
    setCompiledModules([]);
    setShowError(false);
    setShowTestResults(false);

    console.log('compiling with backend: ', BACKEND_URL);

    axios.post(`${BACKEND_URL}compile`, props.challenge).then((res) => {
      const compileResults = res.data as {
        compiledModules: string[];
        errorCode: string;
        error: boolean;
      };
      console.log('res', compileResults);
      if (compileResults.error) {
        setCompiledModules([]);
        setCompileError(compileResults.errorCode);

        setToast(
          <div className="alert alert-error">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Compile failed</span>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  console.log()
                  if (challenge == null || challenge.templates == null) {
                    return;
                  }
                  if (activeModules.length == 0) {
                    console.log('no active modules')
                    addActiveModulesHandler((challenge as Puzzle).templates[0].name);
                  }
                  setShowError(true);
                }}
              >
                View
              </button>
              <button onClick={() => setToast(undefined)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
          </div>
        </div>
        )

        return;
      }

      setToast(
        <div className="alert alert-success">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Package compiled</span>
          <button onClick={() => setToast(undefined)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      )

      setCompiledModules(compileResults.compiledModules);
      setCompileError('');
    });
  }

  const testProject = () => {
    
    setToast(
      <div className="alert alert-info">
        <div>
          <ScaleLoader
            color={SPINNER_COLORS[theme].infoContent}
            height={20}
            // width={15}
          />
          <span className="normal-case" style={{color: 'hsl(var(--inc))'}} >Testing...</span>
        </div>
      </div>
    )

    setCompileError('');
    setCompiledModules([]);
    setShowError(false);
    setShowTestResults(false);
    if (!challenge) {
      return;
    }

    console.log('testing with backend: ', BACKEND_URL);

    axios.post(`${BACKEND_URL}test`, challenge).then((res) => {
      const testResults = res.data as {
        result: string;
        errorCode: string;
        error: boolean;
      }
      console.log('res test', testResults);

      if (testResults.error) {
        setTestResults(testResults.errorCode);
      } else {
        setTestResults(testResults.result);
      }
            
      setToast(
        <div className="alert alert-warning">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Tests complete</span>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => {
                console.log()
                if (challenge == null || challenge.templates == null) {
                  return;
                }
                if (activeModules.length == 0) {
                  console.log('no active modules')
                  addActiveModulesHandler((challenge as Puzzle).templates[0].name);
                }
                setShowTestResults(true);
              }}
            >
              View
            </button>
            <button onClick={() => setToast(undefined)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      )

    });


  }

  useEffect(() => {
    if (challenge && challenge.templates.length > 0 && currentModule == null && activeModules.length == 0) {
      setActiveModules([(challenge as Puzzle).templates[0].name])
      setCurrentModule((challenge as Puzzle).templates[0].name);
    }
  }, [challenge]);
  

  //---Handlers---//

  const handleNewCode = (newCode: string, module: string) => {
    const updateModuleInIndexdb = async (newCode: string) => {
      if (challengeType === undefined) {
        return
      }
      indexedDb = new IndexedDb(`move-studio-ide-${CHALLENGE_TYPE[challengeType]}`);
      await indexedDb.createObjectStore(['challenges'], {keyPath: 'challenge'});
      if (!challenge || !currentModule) {
        console.log('f')
        return;
      }
      await indexedDb.updateModule('challenges', props.challenge, currentModule, newCode);
    }
    if (!challenge || !currentModule) {
      console.log('f')
      console.log('challenge', challenge);
      console.log('currentModule', currentModule);
      return;
    }

    console.log('heere')
    // console.log('handling code', newCode);
    console.log('currentModule', currentModule);
    console.log('module to update', module);



    updateModuleInIndexdb(newCode).then(() => {
      getProjectData(props.challenge);
    }).then(() => {

    });
    setCode(newCode);
  }

  const handleModuleChange = (module: string) => {
    if (module === '0') {
      setCurrentModule(undefined);
      setCode('')
      console.log('default');
    } else if (module.startsWith('1')) {
      console.log('addModule:', module.slice(1));
      const addModuleToIndexdb = async (newModuleName: string) => {
        await setCurrentModule(undefined);
        setCode('')
        if (challengeType === undefined) {
          return
        }
        indexedDb = new IndexedDb(`move-studio-ide-${CHALLENGE_TYPE[challengeType]}`);
        await indexedDb.createObjectStore(['challenges'], {keyPath: 'challenge'});
        if (!challenge) {
          console.log('f')
          return;
        }
        console.log('indexdb', indexedDb);
        console.log('currentProject', challenge);
        console.log('currentModule', currentModule);
        console.log('code', code);
        await indexedDb.addNewModule('projects', props.challenge, newModuleName);
      }
      if (!challenge) {
        console.log('f')
        return;
      }
      const newModuleName = module.slice(1)
      if (!newModuleName) {
        console.log('f')
        return;
      }
      addModuleToIndexdb(newModuleName).then(() => {
        getProjectData(props.challenge);
        setActiveModules([...activeModules, newModuleName])
        setCurrentModule(newModuleName);
        setCode('');
        setShowError(false);
        setCompileError('');
        setCompiledModules([]);
        setShowTestResults(false);
        // setActiveModules([...activeModules, newModuleName])
        setToast(undefined)
        // setCompileError('');
        // setCompiledModules([]);
      });
      // setCurrentModule(null);
      // setCode('');
      
    } else {
      console.log('newModule', module);
      if (!challenge) {
        console.log('f')
        return;
      }
      
      setCurrentModule(module);
      console.log('new module set', currentModule);

      // setCode(currentProject.modules.find((m) => m.name === module)?.code || '');

      // console.log('code set', code);
      // setCurrentModuleCode(currentProject.modules.find((m) => m.name === module)?.code || '');
    }
  }

  // fix later
  useEffect(() => {
    if (!challenge || !currentModule) {
      console.log('f')
      return;
    }

    for (let i = 0; i < (challenge as Puzzle).templates.length; i++) {
      if ((challenge as Puzzle).templates[i].name === currentModule) {
        setCode((challenge as Puzzle).templates[i].code);
        return;
      }
    }

    setCode('');
    console.log('code set', code);
  }, [currentModule])


  const handleModuleDelete = (moduleName: string) => {

    // Get confirmation from user
    if (confirm(`Are you sure you want to delete ${moduleName}?`) == false) {
      return;
    }

    const removeModuleFromIndexdb = async (moduleName: string) => {
      if (challengeType === undefined) {
        return
      }
      indexedDb = new IndexedDb(`move-studio-ide-${CHALLENGE_TYPE[challengeType]}`);
      await indexedDb.createObjectStore(['challenges'], {keyPath: 'challenge'});
      if (!challenge) {
        return;
      }
      await indexedDb.deleteModule('projects', props.challenge, moduleName);
    }
    if (!challenge) {
      return;
    }
    removeModuleFromIndexdb(moduleName).then(() => {
      getProjectData(props.challenge);
      removeActiveModuleHandler(moduleName);
    });
    // setCurrentModule(null);
    // setCode('')
    setShowError(false);
    setCompileError('');
    setCompiledModules([]);
    setShowTestResults(false);
    // Remove form active modules
    // setActiveModules(activeModules.filter((m) => m !== moduleName));
  }

  const resetCache = async () => {
    const confirmReset = confirm("This will clear all of your projects and reset the demo project. Press OK to continue.")

    if (confirmReset === false) {
      alert('Reset cancelled.')
      return;
    }

    // handleProjectChange('**default');

    if (challengeType === undefined) {
      return
    }

    indexedDb = new IndexedDb(`move-studio-ide-${CHALLENGE_TYPE[challengeType]}`);
    await indexedDb.createObjectStore(['challenges'], {keyPath: 'challenge'});

    await indexedDb.deleteObjectStore('projects');

    localStorage.clear();
    window.location.reload();
  }

  const addActiveModulesHandler = (moduleName: string) => {
    if (!challenge) {
      return;
    }

    // Check if module already exists
    if (activeModules.includes(moduleName)) {
      handleModuleChange(moduleName);
      return;
    }

    setActiveModules([...activeModules, moduleName]);

    handleModuleChange(moduleName);

  }

  const removeActiveModuleHandler = async (moduleName: string) => {
    if (!challenge) {
      return;
    }

    const newActiveModules = activeModules.filter((module) => module !== moduleName);
    await setActiveModules(newActiveModules);

    if (newActiveModules.length > 0) {
      await handleModuleChange(newActiveModules[0]);
    }
  }

  return (
    <div className="tutorial-header">
      <PageLayout
        header={
          <Header 
            // resetDemo={resetDemo}
            resetCache={resetCache}
          />
        }
        innerSidebar={
          <BuildInnerSidebar
            currentProject={challenge}
            currentModule={currentModule}
            compileCode={compileCode} 
            testProject={testProject}
            // compiledModules={compiledModules}
            // compileError={compileError}
            // activeModules={activeModules}
            addActiveModules={addActiveModulesHandler}
            
            title={challengeConfig?.name || ''}
            objective={challengeConfig?.objective || ''}
            instructions={challengeConfig?.instructions || []}
            
            // tutorialSteps={steps}
            // tutorialCallback={tutorialCallback}
            // runTutorial={runTutorial}
            // setRunTutorial={setRunTutorial}
            // stepIndex={stepIndex}
            // setStepIndex={setStepIndex}
            // changeProject={handleProjectChange}
            // changeProjectName={handleProjectNameChange}
            // deleteProject={handleProjectDelete}
            // duplicateProject={handleDuplicateProject}
            // changeModule={handleModuleChange}
            // deleteModule={handleModuleDelete}
            // duplicateModule={handleDuplicateModule}
            // addDependency={handleDependencyAdd}
            // removeDependency={handleDependencyRemove}
          />
        }
        canvas={
          <BuildCanvas 
            currentProject={challenge} 
            currentModule={currentModule}
            compiledModules={compiledModules}
            compileError={compileError}
            showError={showError}
            setShowError={setShowError}
            testResults={testResults}
            showTestResults={showTestResults}
            setShowTestResults={setShowTestResults}
            activeModules={activeModules}
            removeActiveModule={removeActiveModuleHandler}
            toast={toast}
            // tutorialSteps={steps}
            // tutorialCallback={tutorialCallback}
            // runTutorial={runTutorial}
            // setRunTutorial={setRunTutorial}
            // stepIndex={stepIndex}
            // setStepIndex={setStepIndex}
            code={code} setCode={handleNewCode} 
            changeModule={handleModuleChange}
            deleteModule={handleModuleDelete}
          />
        }
      />
      <div className="toast toast-end">
        {!showError && !showTestResults && toast}
      </div>
    </div>
  );
}

export default BuildPage;