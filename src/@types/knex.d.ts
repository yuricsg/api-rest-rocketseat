/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Knex } from "knex";
import { title } from "process";
import { number, string } from "zod";

declare module 'knex/types/tables' {
    export interface Tables{
        transactions: {
            id: string
            title: string
            amount: number
            created_at: string
            session_id?: string
        }
    }
}