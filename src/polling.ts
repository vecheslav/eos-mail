import Bull from 'bull'
import Debug from 'debug'
import { config } from './config'
import { getLetters } from './eos'
import { ContractLetter } from './types'
import { send } from './mail'

const debug = Debug('mail')

const pollingQueue = new Bull('POLLING', config.redisUrl)
const pollingKey = 'polling'

export const initProcessPolling = () => {
  pollingQueue.process(pollingKey, processPolling)
}

export const startPolling = async () => {
  // Duplicate job removal
  await pollingQueue.removeRepeatable(pollingKey, { every: config.pollingRepeatEvery })

  // Adding new job with repeating every 5* sec
  await pollingQueue.add(
    pollingKey,
    {},
    { repeat: { every: config.pollingRepeatEvery } },
  )
}

const processPolling = async () => {
  try {
    const timeStart = Date.now() - config.pollingRepeatEvery
    const letterRows = (await getLetters(10)).rows as ContractLetter[]
    const letters = letterRows.filter(letter => letter.date * 1000 > timeStart)

    await Promise.all(letters.map(letter => processLetter(letter)))
  } catch (err) {
    console.error(err)
    throw err
  }
}

const processLetter = async (letter: ContractLetter) => {
  debug('📮️ Sending letter...')
  await send(letter)
}
