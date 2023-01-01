"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const tslib_1 = require("tslib");
const core = require("@actions/core");
const wait_1 = require("./wait");
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const ms = core.getInput('milliseconds');
            core.debug(`-> wait`);
            core.debug(`Waiting ${ms} milliseconds ...`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
            core.debug(new Date().toTimeString());
            yield (0, wait_1.wait)(parseInt(ms, 10));
            core.debug(new Date().toTimeString());
            core.setOutput('time', new Date().toTimeString());
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
exports.run = run;
//# sourceMappingURL=main.js.map