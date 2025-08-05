/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { config } from 'dotenv'
import path from 'path'
import { z } from 'zod'

if(process.env.NODE_ENV == 'test'){
    config({path: '.env.test'})
}else{
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)


// eslint-disable-next-line eqeqeq
if(_env.success == false){
    console.error('Invalid enviroment variable!', _env.error.format())

    throw new Error('Invalid enviroment variables.')
}

export const env = _env.data