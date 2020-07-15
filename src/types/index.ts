import { NightwatchTestHook, NightwatchTestFunctions } from 'nightwatch';

// Tests
export interface BaseTest extends NightwatchTestFunctions {
  '@disabled': boolean;
  after: NightwatchTestHook;
}

// Users
export type User = { email: string; pass: string; token: string; startPath: string };

// Programs
type Role = 'ADMIN' | 'COLLABORATOR' | 'SUBMITTER';

type Admin = {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type Program = {
  name: string;
  shortName: string;
  description: string;
  commitmentDonors: number;
  website: string;
  institutions: Array<string>;
  countries: Array<string>;
  regions: Array<string>;
  cancerTypes: Array<string>;
  primarySites: Array<string>;
  membershipType: 'FULL' | 'ASSOCIATE';
  admins: Array<Admin>;
};

// Browserstack
// https://www.browserstack.com/automate/rest-api#rest-api-sessions
export enum TestStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

// "nightwatch": "^1.3.6",
export type Done = (err?: any) => void;

export type Results = {
  time: string;
  assertions: Array<any>;
  passed: number;
  errors: number;
  failed: number;
  retries: any;
  skipped: number;
  tests: number;
  steps: Array<any>;
  stackTrace: string;
  timeMs: number;
};

type TestResults = {
  testCases: { [key: string]: TestCaseResults };
  lastError?: ResultLastError;
};

type ResultLastError = {
  name: string;
  message: string;
  showDiff?: boolean;
  abortOnFailure?: boolean;
};

export type TestCaseResults = TestResults & Results;

export type CurrentTest = { name: string; module: string; group: string; results: TestCaseResults };
