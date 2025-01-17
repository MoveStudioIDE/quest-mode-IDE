import { useEffect, useState } from "react";
import "./BuildCanvas.css";
import Editor, {useMonaco} from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
import { Module, Project } from "../types/project-types";
import fs from 'fs';
import Ansi from "ansi-to-react";
import stripAnsi from 'strip-ansi';
import { shortenWord } from "../utils/address-shortener";
// import * as editorThemeJsons from "../utils/themes.json"
const editorThemeJsons = require('../utils/themes.json')

const editorTheme = {
  dark: 'GitHubDark',
  light: 'ChomeDevTools',
  dracula: 'Dracula',
  synthwave: 'NightOwl', 
  cupcake: 'Tomorrow',
  bumblebee: 'Clouds', 
  emerald: 'Dreamweaver',
  corporate: 'SlushandPoppies',
  retro: 'DominionDay',
  cyberpunk: 'Solarizeddark', 
  valentine: 'Tomorrow', 
  halloween: 'PastelsonDark',
  garden: 'SlushandPoppies',
  forest: 'Sunburst',
  aqua: 'Cobalt2',
  lofi: 'Dawn', 
  pastel: 'Tomorrow', 
  fantasy: 'SlushandPoppies',
  wireframe: 'Katzenmilch',
  black: 'krTheme',
  luxury: 'idleFingers',
  cmyk: 'ChromeDevTools',
  autumn: 'GitHubLight', 
  business: 'Twilight', 
  acid: 'GitHubLight', 
  lemonade: 'Clouds', 
  night: 'NightOwl',
  coffee: 'Twilight', 
  winter: 'Tomorrow'

} as {[key: string]: string}

function BuildCanvas(
  props: {
    code: string,
    currentProject: Project | null,
    currentModule: string | null,
    compiledModules: string[],
    compileError: string,
    testResults: string,
    showError: boolean,
    showTestResults: boolean,
    activeModules: string[],
    removeActiveModule: (module: string) => void,
    toast: JSX.Element | undefined,

    // tutorialSteps:  any[],
    // runTutorial: boolean,
    // setRunTutorial: (runTutorial: boolean) => void,
    // stepIndex: number,
    // setStepIndex: (stepIndex: number) => void,
    // tutorialCallback: (data: any) => void,
    setShowError: (showError: boolean) => void,
    setShowTestResults: (showTestResults: boolean) => void,
    setCode: (code: string, module: string) => void,
    changeModule: (module: string) => void,
    deleteModule: (module: string) => void,
  }
) {

  // useEffect(() => {
  //   if (props.runTutorial && props.stepIndex === 9) {
  //     props.setStepIndex(10)
  //   }
  // }, [props.compiledModules, props.compileError])

  
  // const [editorThemeTemp, setEditorTheme] = useState("vs-dark");

  // useEffect(() => {
  //   if (monaco === null) {
  //     return;
  //   }

  //   console.log('theme', editorThemeTemp)

  //   monaco.editor.setTheme(editorThemeTemp)
  // }, [editorThemeTemp])


  const monaco = useMonaco();

  useEffect(() => {

    if (monaco === null) {
      return;
    }

    let hasMoveBeenSet = false;

    monaco.languages.getLanguages().forEach((language) => {
      if (language.id === 'sui-move') {
        hasMoveBeenSet = true; 
      }
    })

    if (!hasMoveBeenSet) {
      monaco.languages.register({id: 'sui-move'});
      monaco.languages.setMonarchTokensProvider('sui-move', {
        keywords: [
          'module',
          'struct',
          'fun',
          'use',
          'has'
        ],
        typeKeywords: [
          'boolean', 'address', 'u8', 'u64', 'u128'
        ],
      
        operators: [
          '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
          '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
          '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
          '%=', '<<=', '>>=', '>>>='
        ],
      
        // we include these common regular expressions
        symbols:  /[=><!~?:&|+\-*\/\^%]+/,
      
        // C# style strings
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      
        // The main tokenizer for our languages
        tokenizer: {
          root: [
            // identifiers and keywords
            [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword',
                                         '@keywords': 'keyword',
                                         '@default': 'identifier' } }],
            [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
      
            // whitespace
            { include: '@whitespace' },
      
            // delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, { cases: { '@operators': 'operator',
                                    '@default'  : '' } } ],
      
            // @ annotations.
            // As an example, we emit a debugging log message on these tokens.
            // Note: message are supressed during the first load -- change some lines to see them.
            [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
      
            // numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
      
            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],
      
            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
            [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
      
            // characters
            [/'[^\\']'/, 'string'],
            [/(')(@escapes)(')/, ['string','string.escape','string']],
            [/'/, 'string.invalid']
          ],
      
          comment: [
            [/[^\/*]+/, 'comment' ],
            [/\/\*/,    'comment', '@push' ],    // nested comment
            ["\\*/",    'comment', '@pop'  ],
            [/[\/*]/,   'comment' ]
          ],
      
          string: [
            [/[^\\"]+/,  'string'],
            [/@escapes/, 'string.escape'],
            [/\\./,      'string.escape.invalid'],
            [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
          ],
      
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/,       'comment', '@comment' ],
            [/\/\/.*$/,    'comment'],
          ],
        },
      })
    }

    // console.log('monaco', monaco.languages);
    // console.log('monaco', monaco.languages.getLanguages());

  })

  useEffect(() => {

    if (monaco == null) {
      // console.log('monaco is null')
      return;
    }

    Object.entries(editorThemeJsons).forEach(([key, value]) => {
      // console.log('key', key)
      // console.log('value', value)
      monaco.editor.defineTheme(key, value as monaco.editor.IStandaloneThemeData);
    })

    // monaco.editor.defineTheme('Dracula', editorThemeJsons['Dracula'] as monaco.editor.IStandaloneThemeData);
    // monaco.editor.setTheme(editorTheme[props.theme]);
    // console.log('theme', props.theme)
    // console.log('editorTheme', editorTheme[props.theme])
  }, );


  const handleEditorChange = (value: any) => {
    console.log('code changed', value)
    console.log('currentModule', props.currentModule)
    props.setCode(value, props.currentModule ? props.currentModule : '');
  };

  

  const modules = props.activeModules.map((moduleName: string) => {
    return (
      <a 
        className={`tab tab-bordered ${props.currentModule === moduleName ? 'tab-active' : ''}`}
        id={moduleName}
        onClick={() => props.changeModule(moduleName)}
        style={{display: "flex", alignItems: "center", flexWrap: "nowrap"}}
      >
        {shortenWord(moduleName, 15)}
        {
          props.currentModule === moduleName &&
          <label 
            tabIndex={0} 
            className="btn btn-square btn-ghost btn-xs text-error"  onClick={() => props.removeActiveModule(moduleName)}
            style={{marginLeft: "2px", marginRight: "-10px"}}
          >
            <svg xmlns="http://www.w3.org/2000/svg"  className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </label>
        }
      </a>
    ) 
  });

  //---Render---//

  return (
    <div className="step7">
      {
        modules && modules.length > 0 &&
        <div>
          <div className="tabs step4" style={{overflow: "auto", display: "flex", flexWrap: "inherit"}}>
            {/* <a className="tab tab-bordered">Tab 1</a> 
            <a className="tab tab-bordered tab-active">Tab 2</a> 
            <a className="tab tab-bordered">Tab 3</a> */}
            {modules}
          </div>
          <Editor
            height="90vh"
            width={`100%`}
            language="sui-move"
            value={props.code}
            onChange={handleEditorChange}
            theme='GitHubDark'
            className="step5"
          />
          {
            props.showError &&
            <div className="alert shadow-lg -m-6 alert-error" style={{position: "relative", top: "-250px", left: "5%", width: "95%", height: "240px", overflow: "auto"}}>
              <div style={{position: 'absolute', top: "0px", right: "0px", margin: "10px"}}>
                <button 
                  className="btn btn-square btn-sm btn-error"
                  onClick={() => {
                    props.setShowError(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{marginTop: "auto", whiteSpace: "pre-wrap", lineHeight: "125%", }}>
                <Ansi>
                  {stripAnsi(props.compileError)}
                </Ansi>
              </div>
            </div>
          }
          {
            props.showTestResults &&
            <div className="alert shadow-lg -m-6 alert-warning relative inset-x-0 bottom-0" style={{ top: Math.min(250, ((props.testResults.match(/\n/g) || []).length) * 30 + 10) * -1, left: "5%", width: "95%", height: Math.min(((props.testResults.match(/\n/g) || []).length) * 30, 240), overflow: "auto"}}>
              <div style={{position: 'absolute', top: "0px", right: "0px", margin: "10px"}}>
                <button 
                  className="btn btn-square btn-outline btn-sm btn-error"
                  onClick={() => {
                    props.setShowTestResults(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div style={{marginTop: "auto", whiteSpace: "pre-wrap", lineHeight: "125%", }}>
                <Ansi>
                  {stripAnsi(props.testResults)}
                </Ansi>
              </div>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default BuildCanvas