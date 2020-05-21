import Debug from 'debug'
import http from 'http'
import { config } from './config'
import { initProcessPolling, startPolling } from './polling'

const debug = Debug('mail')

debug('🚜 Mail API is starting...')

// Worker
const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ status: 'UP' }))
})

const run = async () => {
  initProcessPolling()

  debug('⌚️ Start polling...')
  await startPolling()
}

run().then(() => {
  server.listen(config.port, () => {
    debug(`💉 Healthcheck running at ${config.port} port`)
  })
})
