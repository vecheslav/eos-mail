import { MailSlurp } from 'mailslurp-client'
import { config } from './config'
import { ContractLetter } from './types'

const mailSlurp = new MailSlurp({ apiKey: config.apiMailKey })

export const send = async ({ from, to_email, date, msg }: ContractLetter) => {
  return mailSlurp.sendEmail(config.apiMailRootId, {
    to: [to_email],
    subject: `Email from ${from}, date: ${date}`,
    body: msg,
  })
}