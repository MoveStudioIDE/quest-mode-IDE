import { Dependency, Module, Project } from "../types/project-types";
import './BuildInnerSidebar.css'

function BuildInnerSidebar(
  props: {
    projectList: string[],
    currentProject: Project | null,
    currentModule: string | null,
    compileCode: () => void,
    compiledModules: string[],
    compileError: string
    changeProject: (project: string) => void,
    deleteProject: (project: string) => void,
    changeModule: (module: string) => void,
    deleteModule: (module: string) => void,
    addDependency: (dependency: string, address: string) => void,
  }
) {

  //---Helper---//

  const projects = props.projectList.map((project: string) => {
    return <option value={project}>{project}</option>
  });

  const modules = props.currentProject?.modules.map((module: Module) => {
    return <option value={module.name}>{module.name}</option>
  });

  const dependencies = props.currentProject?.dependencies.map((dependency: Dependency) => {
    return (
      <tr>
        <td>
          <p>{dependency.name}</p>
        </td>
        <td>
          <p>{dependency.address}</p>
        </td>
      </tr>
    )
  });

  //---Handlers---//

  const handleProjectChange = (event: any) => {
    console.log('handleProjectChange', event.target.value);
    props.changeProject(event.target.value);

    const moduleSelect = document.getElementById('moduleSelector') as HTMLSelectElement;
    moduleSelect.value = 'default';

    // Empty the select element if addProject is selected
    if (event.target.value === 'addProject') {
      event.target.value = 'default';
      // event.target.value =
    }
  }

  const handleProjectDelete = () => {
    // confirm delete with user
    if (prompt('Type "delete" to confirm deletion of project') !== 'delete') return;

    console.log('handleProjectDelete', props.currentProject);
    if (props.currentProject) {
      props.deleteProject(props.currentProject.package);
      const projectSelect = document.getElementById('projectSelector') as HTMLSelectElement;
      projectSelect.value = 'default';
    }
  }

  const handleModuleChange = (event: any) => {
    console.log('handleModuleChange', event.target.value);
    props.changeModule(event.target.value);

    if (event.target.value === 'addModule') {
      event.target.value = 'default';
    }
  }

  const handleModuleDelete = () => {
    // confirm delete with user
    if (prompt('Type "delete" to confirm deletion of module') !== 'delete') return;

    console.log('handleModuleDelete', props.currentProject);
    const moduleSelect = document.getElementById('moduleSelector') as HTMLSelectElement;

    if (moduleSelect.value !== 'default' && moduleSelect.value !== 'addModule' && props.currentProject) {
      props.deleteModule(moduleSelect.value);
      moduleSelect.value = 'default';
    }
  }

  const addDepencies = () => {
    const dependency = document.getElementById('dependency') as HTMLInputElement;
    const address = document.getElementById('address') as HTMLInputElement;

    if (dependency.value && address.value) {
      props.addDependency(dependency.value, address.value);
      dependency.value = '';
      address.value = '';
    }
  }

  //---Render---//

  return (
    <div>
      <h1>Packages</h1>
      <select 
        name="project" 
        id="projectSelector"
        onChange={handleProjectChange}
        style={{width: '60%'}}
      >
        <option value="default">--Select a project--</option>
        <option value="addProject">++Add Project++</option>
        {projects}
      </select>
      {props.currentProject && <button onClick={handleProjectDelete}>Delete Project</button>}
      {props.currentProject && <div>
        <table className="dependency-table">
          <tr>
            <th>
              <p>Dependency</p>
            </th>
            <th>
              <p>Address</p>
            </th>
          </tr>
            {dependencies}
          <tr>
            <td>
              <input type="text" id="dependency" placeholder="package" />
            </td>
            <td>
              <input type="text" id="address" placeholder="0x..." />
            </td>
          </tr>
          <tr>
            <th colSpan={2}>
              <button onClick={addDepencies}>Add Dependency</button>
            </th>
          </tr>
        </table>
        <select 
          name="modules"
          id="moduleSelector"
          onChange={handleModuleChange}
          style={{width: '40%'}}
        >
          <option value="default">--Select a module--</option>
          <option value="addModule">++Add Module++</option>
          {modules}
        </select>
        {props.currentModule && <button onClick={handleModuleDelete}>Delete Module</button>}
        {props.currentProject && <button onClick={props.compileCode}>Compile</button>}
        {props.compileError && <p>{props.compileError}</p>}
        {props.compiledModules && props.compiledModules.length > 0 && <ul>{props.compiledModules.map((module: string) => {
        return <p>{module}</p>
      })}</ul>}
      </div>}
    </div>
  );
}

export default BuildInnerSidebar;