/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import crypto from 'node:crypto'
import { db } from './database'
import { title } from 'node:process'

const app = fastify()

app.get('/hello', async () => {
  
  const transaction = await db('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transação teste',
    amount: 1000,
  }).returning('*')

  return transaction
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running')
  })
