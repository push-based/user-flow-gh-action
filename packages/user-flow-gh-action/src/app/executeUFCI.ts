export async function executeUFCI(rcPath: string): Promise<string> {
  return new Promise(resolve => {
    if (!isNaN(rcPath as any)) {
      throw new Error('rcPath is a number')
    }

    setTimeout(() => resolve(`rcPath is ${rcPath}`), 1000)
  })
}
