import fastify from 'fastify'
import { db } from './database'

const app = fastify()

app.get('/hello', async () => {
  const tables = await db('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running')
  })
