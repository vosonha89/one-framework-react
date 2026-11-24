/**
 * Plop generators scaffolding layered features that comply with the
 * template's strict OOP / type-safety / JSDoc / layer-boundary rules.
 * @param {import('plop').NodePlopAPI} plop Plop API.
 */
export default function (plop) {
  plop.setGenerator('view', {
    description: 'Create a layered view (View / Hook / State / Model / SCSS)',
    prompts: [
      { type: 'input', name: 'name', message: 'View name (PascalCase):' },
    ],
    actions: [
      { type: 'add', path: 'src/views/{{kebabCase name}}/{{pascalCase name}}.tsx', templateFile: 'templates/view/view.tsx.hbs' },
      { type: 'add', path: 'src/views/{{kebabCase name}}/{{pascalCase name}}.hook.tsx', templateFile: 'templates/view/view.hook.tsx.hbs' },
      { type: 'add', path: 'src/views/{{kebabCase name}}/{{pascalCase name}}.state.ts', templateFile: 'templates/view/view.state.ts.hbs' },
      { type: 'add', path: 'src/views/{{kebabCase name}}/{{pascalCase name}}.model.ts', templateFile: 'templates/view/view.model.ts.hbs' },
      { type: 'add', path: 'src/views/{{kebabCase name}}/{{pascalCase name}}.scss', templateFile: 'templates/view/view.scss.hbs' },
    ],
  });

  plop.setGenerator('service', {
    description: 'Create a business service with request/response/object',
    prompts: [
      { type: 'input', name: 'name', message: 'Service name (PascalCase):' },
    ],
    actions: [
      { type: 'add', path: 'src/services/{{camelCase name}}.Service.ts', templateFile: 'templates/service/service.ts.hbs' },
      { type: 'add', path: 'src/services/requestObject/{{camelCase name}}.Request.ts', templateFile: 'templates/service/request.ts.hbs' },
      { type: 'add', path: 'src/services/responseObject/{{camelCase name}}.Response.ts', templateFile: 'templates/service/response.ts.hbs' },
      { type: 'add', path: 'src/types/{{camelCase name}}Object.ts', templateFile: 'templates/service/object.ts.hbs' },
    ],
  });

  plop.setGenerator('model', {
    description: 'Create a view model extending BaseModel',
    prompts: [
      { type: 'input', name: 'name', message: 'Model name (PascalCase):' },
    ],
    actions: [
      { type: 'add', path: 'src/views/{{kebabCase name}}/{{pascalCase name}}.model.ts', templateFile: 'templates/model/model.ts.hbs' },
    ],
  });
}