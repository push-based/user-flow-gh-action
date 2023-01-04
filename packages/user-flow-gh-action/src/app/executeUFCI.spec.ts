import {executeUFCI} from './executeUFCI'
import {expect, test} from '@jest/globals'

test('throws invalid number', async () => {
  const input = 42 as unknown as string;
  await expect(executeUFCI(input)).rejects.toThrow('rcPath is a number')
})

test('wait 500 ms', async () => {
  const start = new Date()
  await executeUFCI('user-flowrc.json')
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})
