import { useEffect, useState } from 'react';
import './PackageFunction.css'
import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";
import { extractMutableReference } from '@mysten/sui.js';
import { shortenAddress } from '../utils/address-shortener';


function PackageFunction(
  props: {
    functionDetails: object,
    packageAddress: string,
    moduleName: string
  }
) {

  const [functionParameters, setFunctionParameters] = useState<any[]>();
  const [functionParameterList, setFunctionParameterList] = useState<JSX.Element[]>([]);

  const { connected, getAccounts, signAndExecuteTransaction } = useWallet();

  const functionName = (props.functionDetails as any).name
  
  console.log('function', props.functionDetails);

  useEffect(() => {
    getFunctionParameterList();
  }, [props.functionDetails])

  const getFunctionParameterList = () => {
    const params = (props.functionDetails as any).parameters;
    const types = (props.functionDetails as any).type_parameters;

    const paramsAndTypes = [];

    for (let i = 0; i < params.length; i++) {
      console.log('param', params[i])
      console.log('param type', typeof params[i])

      // console.log('type', types[i])

      if (typeof params[i] == 'object') {
        console.log('e')
        const object = extractMutableReference(params[i])
        if (object === undefined) {
          continue;
        }
        console.log("object", object)
        const struct = (object as any).Struct as {address: string, module: string, name: string};
        if (struct.address == "0x2" && struct.name == "TxContext") {
          continue; // Make sure this works. the TxContext might need to also be at the end of the list
        } else {
          paramsAndTypes.push(
            <FunctionParameter
              parameterName={`${shortenAddress(struct.address, 1)}::${struct.module}::${struct.name}`}
              // parameterType={types[i]}
              parameterIndex={i}
              handleParameterChange={handleParameterChange}
            />
          )
        }
      } else {
        console.log('f')
        paramsAndTypes.push(
          <FunctionParameter
            parameterName={params[i]}
            // parameterType={types[i]}
            parameterIndex={i}
            handleParameterChange={handleParameterChange}
          />
        )
      }
    }

    setFunctionParameterList(paramsAndTypes);

    const functionParams = [] as string[];

    setFunctionParameters(functionParams.fill('', 0, params.length))

    return paramsAndTypes;
  }

  const handleParameterChange = (index: number, parameter: any) => {
    console.log(index, parameter)
    console.log('function params', functionParameters)
    if (functionParameters === undefined) {
      console.log('in it')
      const newParams = [] as string[];
      newParams.fill('', 0, index)
      newParams[index] = parameter;
      setFunctionParameters(newParams);
    } else {
      console.log('passt it')
      const newParams = functionParameters;
      newParams[index] = parameter;
      setFunctionParameters(newParams);
    }

    console.log('functionParams', functionParameters)
    
  }

  console.log('function parameters', functionParameters)

  const handleExecuteMoveCall = async () => {
    console.log('execute move call')
    console.log('function parameters', functionParameters)
    console.log('function name', functionName)
    console.log('package address', props.packageAddress)
    console.log('type parameters', [])

    if (functionParameters == undefined) {
      return;
    }

    const moveCallTxn = await signAndExecuteTransaction({
      kind: 'moveCall',
      data: {
        packageObjectId: props.packageAddress,
        module: props.moduleName,
        function: functionName,
        typeArguments: [],
        arguments: functionParameters,
        gasBudget: 300000
      }
    });

    console.log('move call txn', moveCallTxn);
  }


  return (
    <div 
      className="card h-min bg-neutral-focus text-neutral-content shadow-xl card-bordered card-compact" 
      style={{margin: '10px 0px'}}
    >
      <div className="card-body">
        {/* <div style={{textAlign: 'center'}}>
          <h1>{functionName}</h1>
        </div> */}
        <h1 className="card-title">{functionName}</h1>
        {/* <div className='function-parameters'>
          {functionParameterList}
        </div> */}
        <div className="form-control">
          {functionParameterList}
        </div>
        <button 
          className="btn btn-xs glass" 
          style={{margin:"2px 5px"}}
          onClick={handleExecuteMoveCall}
        >
          Execute
        </button>
        <button onClick={() => {console.log('function params', functionParameters)}}>args</button>
      </div>
    </div>
  )
}

function FunctionParameter(
  props: {
    parameterName: string,
    // parameterType: string,
    parameterIndex: number,
    handleParameterChange: (index: number, parameter: string) => void
  }
) {

  const handleParameterChange = (event: any) => {
    props.handleParameterChange(
      props.parameterIndex,
      event.target.value,
      // props.parameterType
    );
  }

  return (
    // <div className='function-parameter'>
    //   <p><b>{props.parameterName}:</b></p>
    //   <div style={{left: '-50%'}}>
    //     <input 
    //       style={{position: 'relative', left: '50%'}} 
    //       type="text" placeholder='Enter parameter here'
    //       onChange={handleParameterChange} 
    //     />
    //   </div>
    // </div>
    <label className="input-group input-group-xs" style={{margin: "2px"}}>
      <span>Arg{props.parameterIndex}</span>
      <input type="text" placeholder={props.parameterName} className="input input-bordered input-xs" onChange={handleParameterChange} />
    </label>
  )
}

export default PackageFunction;

