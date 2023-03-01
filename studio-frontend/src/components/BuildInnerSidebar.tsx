import { useEffect, useState } from "react";
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
    // stepIndex: number,

    resetProject: () => void,


    title: string, 
    objective: string,
    objectives: string[],
    instructions: string[] | string[][],
  }
) {

  //---Helper---//

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (props.currentProject == undefined) {
      setStepIndex(0);
      return;
    } 
    const index = props.currentProject.templates.findIndex((t) => t.name === props.currentModule)
    if (index === -1) {
      setStepIndex(0);
    } else {
      setStepIndex(index);
    }
  }, [props.currentModule])

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
    <div className="w-full h-full">
      {
        props.challengeType === CHALLENGE_TYPE.puzzle &&
        props.currentProject &&
        <div className="card w-full h-full card-compact">
          <div className="card w-full overflow-y-auto">
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
        <div className="card w-full overflow-y-auto">
          <div className="card-body">
            <div className="flex flex-col justify-center max-h-full">
                <table  className="table table-compact table-zebra w-full max-w-full [&_tr.hover:hover_*]:!bg-neutral p-8">
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
          </div>
        </div>


          

        <div className="absolute inset-x-0 bottom-0">
          <hr className="p-1 "/>
          <div className="" style={{display: "flex", justifyContent: "center"}}>
            <button 
              onClick={props.compileCode} 
              className={`btn btn-xs btn-warning btn-outline w-min h-min m-1 mb-3`}
              // style={{margin:"2px 2px"}}
            >
              Compile
            </button>
            
            <button 
              onClick={props.testProject} 
              className={`btn btn-xs btn-warning btn-outline w-min h-min m-1 mb-3`}
              // style={{margin:"2px 2px"}}
            >
              Test
            </button>
            <button 
              onClick={props.resetProject} 
              className={`btn btn-xs btn-error btn-outline w-min h-min m-1 mb-3`}
              // style={{margin:"2px 2px"}}
            >
              Reset
            </button>
            <button 
              onClick={props.testProject} 
              className={`btn btn-xs btn-success btn-outline w-min h-min m-1 mb-3`}
              // style={{margin:"2px 2px"}}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      }
      {
        props.challengeType === CHALLENGE_TYPE.quest &&
        props.currentProject &&
        <div className="card w-full h-full card-compact">
          <div className="card-body -mt-3 ">

            <div className="card w-full y-full overflow-y-auto row-auto">
              <div className="card-body">
                <div className="flex justify-start content-center items-center">
                  <h2 className="card-title">Quest: </h2>
                  <p className="font-mono p-2">{props.title}</p>
                </div>
                <h2 className='font-semibold'>Objective:</h2>
                <code>
                  {props.objective}
                </code>
                <hr className="opacity-50"/>
                <h2 className='font-semibold'>Step #{stepIndex + 1}: </h2>
                <code>
                  {props.objectives[stepIndex]}
                </code>
                <h2 className='font-semibold'>Instructions:</h2>
                <p>
                  {(props.instructions as string [][])[stepIndex].map((instruction, index) => {
                    return (
                      <div>
                        <p> {index + 1}. {instruction} </p>
                      </div>
                    )
                  })}
                </p>
              </div>
            </div>


          </div>

          <hr className="p-1 "/>

          <div className="">
            <div className="" style={{display: "flex", justifyContent: "center"}}>
              <button 
                onClick={props.compileCode} 
                className={`btn btn-xs btn-warning btn-outline w-min h-min m-1 mb-3`}
                // style={{margin:"2px 2px"}}
              >
                Compile
              </button>
              
              <button 
                onClick={props.testProject} 
                className={`btn btn-xs btn-warning btn-outline w-min h-min m-1 mb-3`}
                // style={{margin:"2px 2px"}}
              >
                Test
              </button>
              <button 
                onClick={props.resetProject} 
                className={`btn btn-xs btn-error btn-outline w-min h-min m-1 mb-3`}
                // style={{margin:"2px 2px"}}
              >
                Reset
              </button>
              <button 
                onClick={props.testProject} 
                className={`btn btn-xs btn-success btn-outline w-min h-min m-1 mb-3`}
                // style={{margin:"2px 2px"}}
              >
                Submit
              </button>
            </div>
          </div>

            {/* <hr className="p-1 row-auto"/> */}
          <div className="inset-x-0 bottom-0 mb-3">
              <div className="flex justify-center">
                <div className="btn-group">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={props.decrementStep}
                  >
                    «
                  </button>
                  <button className="btn btn-outline no-animation btn-sm">step {stepIndex + 1}/{props.currentProject?.templates.length}</button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={props.incrementStep}
                  >
                    »
                  </button>
                </div>
              </div>
              
            </div>
        </div>
      }
    </div>
  );
}

export default BuildInnerSidebar;