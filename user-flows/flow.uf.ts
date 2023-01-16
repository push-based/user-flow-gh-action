module.exports = {
  flowOptions: {
    name: 'test flow'
  },
  interactions: async (ctx: Record<string, any>): Promise<void> => {
    const { flow, collectOptions } = ctx;
    const { url } = collectOptions;
    const testUrl = url;
    await flow.navigate(testUrl);
  },
  launchOptions: {
    // to be able to run tests in the CLI without chrome popping up (for debugging switch it off)
    headless: true
  }
};
