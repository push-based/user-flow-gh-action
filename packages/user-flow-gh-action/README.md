# user-flow-gh-action

A GitHub action's integration for @push-based/user-flow.

## Building

Run `nx build user-flow-gh-action` to build the library.

## Testing

### Unit tests
Unit tests should be located next to the file in the `src/lib` folder.

Run `nx test user-flow-gh-action` to execute the unit tests via [Jest](https://jestjs.io).

**Example Folder Structure**
```bash
...
 ┣ ...
📦my-app
  ┣ ...
  ┣ 📄pure-function1.ts
  ┣ 📄pure-function1.spec.ts
  ┣ 📄pure-function2.ts
  ┗ 📄pure-function3.test.ts
```

### e2e tests

E2e tests should be located a separate project as the folder structure is easier to organize.
We have a pattern for the naming: `<project-name>-e2e`.

Run `nx e2e user-flow-gh-action-e2e` to execute the unit tests via [Jest](https://jestjs.io).


**Example Folder Structure**
```bash
...
 ┣ ...
📦my-app-e2e
  ┣ ...
  ┣ 📂e2e
  ┣ ┗ 📄execute-process1.spec.ts
  ┣ 📂fixtures
  ┣ ┣ 📄constants.ts  
  ┣ ┗ 📄config.v1.json
  ┣ 📂support
  ┣ ┗ 📄wrapper.object.ts
```
