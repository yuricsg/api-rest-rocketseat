/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import cookie from '@fastify/cookie'
import crypto from 'node:crypto'
import { db } from './database'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)

app.addHook('preHandler', async(request, reply) =>{
        console.log(`[${request.method}] ${request.url}`)
    })

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running')
  })
