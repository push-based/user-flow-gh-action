module.exports = {
  flowOptions: {
    name: 'test flow 2'
  },
  interactions: async (ctx: Record<string, any>): Promise<void> => {
    const { flow, collectOptions } = ctx;
    await flow.navigate(collectOptions.url);
  },
  launchOptions: {
    headless: true
  }
};
