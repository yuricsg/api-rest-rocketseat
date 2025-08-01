/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fastify, { FastifyInstance } from "fastify";
import { z } from 'zod'
import { db } from "../database";
import { title } from "process";
import { randomUUID } from "node:crypto";
import { request } from "node:http";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";



export async function transactionsRoutes(app:FastifyInstance){

    app.get('/', 
        {
        preHandler: [checkSessionIdExists],
    },async(request, reply)=> {

        const { sessionId } = request.cookies

        const transactions = await db('transactions')
        .where('session_id', sessionId)
        .select()

        return{ transactions }
    })

    app.get('/:id',  
        {
        preHandler: [checkSessionIdExists],
    }, 
    async(request) => {
        const getTransactionParamSchema = z.object({
            id: z.uuid(),
        })
    
        const { id } = getTransactionParamSchema.parse(request.params)

        const { sessionId } = request.cookies

        const transaction = await db('transactions')
        .where({
            session_id: sessionId,
            id,
        })
        .first()

        return { transaction }

    })

    app.get('/summary', {
        preHandler: [checkSessionIdExists],
    },
    async(request) =>{

        const { sessionId } = request.cookies

        const summary = await db('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount: ' })
        .first()

        return { summary }
    })

    app.post('/', async (request, reply)=>{
        
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const {title, amount, type} = createTransactionBodySchema.parse(
            request.body,
        )

        let sessionId = request.cookies.sessionId

        if(!sessionId){
             sessionId = randomUUID()

             reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 dias
             })
        }

        await db('transactions').insert({
            id: randomUUID(),
            title,
            amount: type == 'credit' ? amount : amount * -1,
            session_id: sessionId
        })

        return reply.status(201).send()
    })

}