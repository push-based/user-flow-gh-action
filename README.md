# Chrome Lighthouse user flows as GitHub action

This repository maintains a GitHub action to run [@push-based/user-flow](https://github.com/push-based/user-flow) in a workflow.
It automatically detects flows, executes them and produces md reports as comments in your PR.

![user-flow-gh-action-cover](https://user-images.githubusercontent.com/10064416/216605948-b8fffdda-3459-48c9-975a-75ec95544d30.png)

**Inputs:**  
| Name                         |  Type     | Default                     |  Description                                                                                               |  
|------------------------------| --------- | --------------------------- |----------------------------------------------------------------------------------------------------------- |  
| **`--customId`**             | `string`  | `user flow summary report`  | Custom id used to identify a comment in the PR (useful if multiple actions run user-flow for the same PR)  |  
| **`--customScript`**         | `string`  | `undefined`                 | Custom way to execute user-flow (helpfule if the default way of execution is not given)                    |  
| **`--rcPath`**               | `string`  | `./user-flowrc.json`        | Path to user-flow.config.json. e.g. `./user-flowrc.json`                                                   |  
| **`--verbose`**              | `string`  | `off`                       | Run with verbose logging (only 'on' and 'off' is possible)                                                 |  
| **`--dryRun`**               | `string`  | `off`                       | Run in `dryRun` mode (only 'on' and 'off' is possible)                                                     |  

# Setup

1. Create a file called `user-flow-ci.yml` in `./.github/workflows`.

This can be done by using the `init`:  
`npx @push-based/user-flow init --generateGhWorkflow`  

2. The generated `user-flow-ci.yml` file should have the following content:

```yml
name: user-flow-ci
on:
  pull_request:
jobs:
  user-flow-integrated-in-ci:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]
    steps:
      - uses: actions/checkout@v2
      - name: Executing user-flow CLI
        # without any parameters the rcPath defaults to `.user-flowrc.json`
        uses: push-based/user-flow-gh-action@v0.1.0
```

# How to test the setup

1. If you open a new PR in your repository you should see the runner execution your user-flow in the CI

<img width="672" alt="gh-ci-running" title="Action is executing" src="https://user-images.githubusercontent.com/10064416/216594684-ea9e3a5e-007e-47d6-b438-c16d2158f940.PNG">
<img width="583" alt="gh-ci-complete" title="Action completed" src="https://user-images.githubusercontent.com/10064416/216594803-65cb2cfd-1924-44ae-84ec-8b1d09e49ada.PNG">

2. After the user flow executed you should see a mark down report as comment attached to your PR

<img width="676" alt="gh-ci-comment" title="Action created comment in PR" src="https://user-images.githubusercontent.com/10064416/216596391-35a041e2-9839-4cf5-b8c5-b55e93cb622e.PNG">

---

made with ❤ by [push-based.io](https://www.push-based.io)

