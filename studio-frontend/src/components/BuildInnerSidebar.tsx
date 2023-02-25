import { useEffect } from "react";
import { Challenge, CHALLENGE_TYPE, Puzzle, PuzzleTemplates } from "../pages/BuildPage";
import { Dependency, Module, Project } from "../types/project-types";

function BuildInnerSidebar(
  props: {
    compileCode: () => void,
    testProject: () => void,
    addActiveModules: (module: string) => void,
    currentProject: Challenge | undefined,
    currentModule: string | undefined,

    challengeType: CHALLENGE_TYPE | undefined,
    incrementStep: () => void,
    decrementStep: () => void,


    title: string, 
    objective: string,
    instructions: string[] | string[][],
  }
) {

  //---Helper---//

  const tableModules = (props.challengeType === CHALLENGE_TYPE.puzzle) ? (props.currentProject as Puzzle)?.templates.map((template: PuzzleTemplates) => {
    const templateName = template.name;

    return (
      <tr 
        className="hover cursor-pointer"
        onClick={() => {
          console.log('module.name in row click', templateName)
          props.addActiveModules(templateName)
        }}
      >
        <td className="pr-0">
          <label 
            tabIndex={0} 
            className="text-info" 
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
          </label>
        </td>
        <td className="pl-0">
          <p 
            className="ml-1 font-mono text-xs w-52 whitespace-normal break-words"
          >
            {/* TODO: Eventually get this to work with wrapping, not truncating */}
            {/* {shortenWord(module.name, 17)}{module.name.length < 18 ? ".move" : ""} */}
            {templateName}
          </p>
        </td>
      </tr>
    )
  }) : [];


  //---Render---//

  return (
    <div style={{overflow: "auto"}}>
      <div className="card w-full shadow-xl card-compact ">
        <div className="card-body -mt-3 ">
          
          <div className="card w-full max-h-60 overflow-y-auto">
            <div className="card-body">
              <div className="flex justify-start content-center items-center">
                <h2 className="card-title">Puzzle: </h2>
                <p className="font-mono p-2">{props.title}</p>
              </div>
              <h2 className='font-semibold'>Objective:</h2>
              <code>
                {props.objective}
              </code>
              <h2 className='font-semibold'>Instructions:</h2>
              <p>
                {props.instructions.map((instruction, index) => {
                  return (
                    <div>
                      <p> {index + 1}. {instruction} </p>
                    </div>
                  )
                })}
              </p>
            </div>
          </div>

          <hr className="p-1"/>

          {
            props.challengeType === CHALLENGE_TYPE.puzzle &&
            <div>
              <table  className="table table-compact table-zebra w-full [&_tr.hover:hover_*]:!bg-neutral">
                <thead>
                  <tr>
                    <th colSpan={3} style={{position: "relative"}} className="text-center">Modules</th>
                  </tr>
                </thead>
                <tbody className="">
                  {tableModules}
                </tbody>
              </table>
            </div>
          }
          

          <div className="" style={{display: "flex", justifyContent: "center"}}>
            <button 
              onClick={props.compileCode} 
              className={`btn btn-xs btn-warning btn-outline w-min h-min `}
              style={{margin:"2px 2px", marginRight:"10px"}}
            >
              Compile
            </button>
            
            <button 
              onClick={props.testProject} 
              className={`btn btn-xs btn-warning btn-outline w-min h-min `}
              style={{margin:"2px 2px", marginLeft:"10px"}}
            >
              Test
            </button>
          </div>
          <div style={{display: "flex", justifyContent: "space-around"}}>
            <button 
              onClick={props.testProject} 
              className={`btn btn-xs btn-success btn-outline w-min h-min `}
              style={{margin:"2px 2px", marginLeft:"10px"}}
            >
              Submit
            </button>
          </div>

          {
            props.challengeType === CHALLENGE_TYPE.quest &&
            <div>
              <hr className="p-1"/>
              <div className="flex justify-center">
                <div className="btn-group">
                  <button 
                    className="btn btn-outline"
                    onClick={props.decrementStep}
                  >
                    «
                  </button>
                  <button className="btn btn-outline">step {props.currentProject?.templates.findIndex((t) => t.name === props.currentModule) || 0 + 1}/{props.currentProject?.templates.length}</button>
                  <button 
                    className="btn btn-outline"
                    onClick={props.incrementStep}
                  >
                    »
                  </button>
                </div>
              </div>
              
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default BuildInnerSidebar;