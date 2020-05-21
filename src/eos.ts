import { JsonRpc } from 'eosjs'
import { config } from './config'
import fetch from 'node-fetch'

const rpc = new JsonRpc(config.rpcUrl, { fetch })

export const getLetters = async (limit: number) => {
  return rpc.get_table_rows({
    json: true,
    code: config.contractName,
    scope: config.contractName,
    table: 'letters',
    table_key: 'date',
    reverse: true,
    limit,
  })
}