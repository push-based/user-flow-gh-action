# user-flow-gh-action

This repository maintains a GitHub action to run [@push-based/user-flow]() in a workflow.
It automatically detects flows, executes them and produces md reports as comments in your PR.

**Inputs:**  
| Name                         |  Type     | Default                     |  Description                                                                                               |  
|------------------------------| --------- | --------------------------- |----------------------------------------------------------------------------------------------------------- |  
| **`--rcPath`**               | `string`  | `./user-flowrc.json`        | Path to user-flow.config.json. e.g. `./user-flowrc.json`                                                   |  
| **`--verbose`**              | `string`  | `off`                       | Run with verbose logging (only 'on' and 'off' is possible)                                                 |  
| **`--dryRun`**               | `string`  | `off`                       | Run in `dryRun` mode (only 'on' and 'off' is possible)                                                     |  

# Setup

1. Create a file called `user-flow-ci.yml` in `./.github/workflows`.

2. Paste the following content into `user-flow-ci.yml`:

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
        uses: push-based/user-flow-gh-action@v0.0.0-alpha.20
```

# Configure
