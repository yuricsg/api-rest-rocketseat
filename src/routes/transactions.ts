/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fastify, { FastifyInstance } from "fastify";
import { z } from 'zod'
import { db } from "../database";
import { title } from "process";
import { randomUUID } from "node:crypto";



export async function transactionsROutes(app:FastifyInstance){

    app.post('/', async (request, reply)=>{
        
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const {title, amount, type} = createTransactionBodySchema.parse(
            request.body,
        )

        await db('transactions').insert({
            id: randomUUID(),
            title,
            amount: type == 'credit' ? amount : amount * -1,
        })

        return reply.status(201).send()
    })

}