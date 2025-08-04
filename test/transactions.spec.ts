/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { afterAll, beforeAll, test, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'
import { it } from 'node:test'
import { title } from 'process'


describe('transactions routes', () => {

    // beforeEach(() =>{
    //     execSync('npm run knex migrate:latest')
    // })

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })


    beforeEach(() =>{
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    test('should be able a new transaction', async () => {
            await request(app.server)
                .post('/transactions')
                .send({
                    title: 'New transaction',
                    amount: 5000,
                    type: 'credit',
                }).expect(201)
            

        })

    test('should be able to list all transactions', async () =>{

        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

            expect(listTransactionsResponse.body.transactions).toEqual([
                expect.objectContaining({
                    title: 'New transaction',
                    amount: 5000,
                })
            ])
        })

})


