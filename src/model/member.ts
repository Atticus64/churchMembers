
import { z } from 'zod';

export const memberSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    middlename: z.string(),
    image: z.string(),
    dateofbirth: z.string(),
    gender: z.string(),
    maritalstatus: z.string(),
    occupation: z.string(),
    phonenumber: z.string(),
    mobilenumber: z.string(),
    email: z.string(),
    whatsapp: z.string(),
    socialmedia: z.string(),
    contactnotes: z.string(),
    addressid: z.number()
});

export const updateMemberSchema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    middlename: z.string().optional(),
    image: z.string().optional(),
    dateofbirth: z.string().optional(),
    gender: z.string().optional(),
    maritalstatus: z.string().optional(),
    occupation: z.string().optional(),
    phonenumber: z.string().optional(),
    mobilenumber: z.string().optional(),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
    socialmedia: z.string().optional(),
    contactnotes: z.string().optional(),
    addressid: z.number().optional()
});

export type dtoMember = typeof memberSchema._type;
export type Member = typeof memberSchema._type & { active: boolean, id: number };
export type updateMember = typeof updateMemberSchema._type;