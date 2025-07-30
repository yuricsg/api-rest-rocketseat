/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import crypto from 'node:crypto'
import { db } from './database'
import { env } from './env'
import { transactionsROutes } from './routes/transactions'

const app = fastify()

app.register(transactionsROutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running')
  })
