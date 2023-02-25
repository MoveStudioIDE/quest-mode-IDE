export type CompileReturn = {
  compiledModules: string[];
  errorCode: string;
  error: boolean;
}

export type TestReturn = {
  result: string;
  errorCode: string;
  error: boolean;
}

export type SubmitReturn = {
  user: string;
  result: string;
  errorCode: string;
  error: boolean;
}

export type Project = {
  package: string;
  dependencies: Dependency[];
  modules: Module[];
}

export type Challenge = {
  config: Buffer;
  modules: Module[];
}

export type Dependency = {
  name: string;
  address: string;
}

export type Module = {
  name: string;
  code: Buffer;
}

export type ChallengeType = "puzzle" | "quest"