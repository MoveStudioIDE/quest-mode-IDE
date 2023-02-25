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
  templates: Template[];
}

export type Challenge = {
  config: Buffer;
  templates: Template[];
}

export type Dependency = {
  name: string;
  address: string;
}

export type Template = {
  name: string;
  code: Buffer;
}

export type ChallengeType = "puzzle" | "quest"