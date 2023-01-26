export function processParamsToParamsArray(params: Record<string, string | boolean | string[]> ): string[] {
  return Object.entries(params).flatMap(([key, value]) => {
    if (key === '_') {
      return value.toString();
    } else if (Array.isArray(value)) {
      return value.map(v => `--${key}=${v.toString()}`);
    } else {
      if (typeof value === 'string') {
        return [`--${key}=${value + ''}`];
      } else if (typeof value === 'boolean') {
        return [`--${value ? '' : 'no-'}${key}`];
      }
      return [`--${key}=${value + ''}`];
    }
  }) as string[];
}
