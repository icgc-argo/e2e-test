import { NodePlopAPI } from 'plop';

module.exports = function(plop: NodePlopAPI) {
  plop.setGenerator('test', {
    description: 'Create a test file',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Please enter test name...',
      },
      { type: 'input', name: 'group', message: 'Please enter test group name...' },
      { type: 'input', name: 'developer', message: 'Please enter your name (test developer)...' },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/tests/{{dashCase group}}/{{dashCase name}}.ts',
        templateFile: './templates/test.hbs',
      },
    ],
  });
};
