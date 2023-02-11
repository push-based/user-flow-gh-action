module.exports = {
  flowOptions: {
    name: 'test flow'
  },
  interactions: async (ctx: Record<string, any>): Promise<void> => {
    const { flow, collectOptions } = ctx;
    await flow.navigate(collectOptions.url);
  }
};
