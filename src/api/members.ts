import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { memberSchema, updateMemberSchema } from '../model/member.js';
import { uploadImage } from '../util/img.js';
import validate from 'express-zod-safe';
import { tryCatch } from '../util/trycatch.js';
import { z } from 'zod';
import { MemberRepository } from '../db/member.js';

dotenv.config();

const membersRouter = Router();
const repo = new MemberRepository();

// Get all members
membersRouter.get('/', async (request: Request, response: Response) => { 

    const { members, error } = await repo.getMembers();

    if (error) {
        console.error('Error fetching members:', error);
        response.status(500).json({ error: 'Failed to retrieve members' });
    }

    response.status(200).json(members);
});

// Get member by ID
membersRouter.get('/:id', async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);

    const { active, error }  = await repo.existMember(id);
    if (error) {
        return response.status(500).json(error);
    }

    if (!active) {
        return response.status(404).json({ error: 'Member not found' });
    }

    const { member, error:notGet }  = await repo.getMember(id);

    if (notGet) {
        return response.status(500).json('Unable to get member');
    }

    response.status(200).json(member);
});

// Create new member
membersRouter.post('/', validate({ body: memberSchema, handler: (errors, req, res) => {
    console.log(req.body);
    res.status(400).json({
        message: 'Invalid request data',
        errors: errors.map((error) => error.errors.errors),
    });

} }), async (request: Request, response: Response) => {

    const valid = memberSchema.safeParse(request.body);

    if (valid.error) {
        response.status(400);
        return response.json({
            errors: valid.error.errors
        });
    }
    
    const {
        firstname, lastname,
        image 
    } = valid.data;

    const { data: url, error } = await tryCatch(
        uploadImage(
            image, 'Profile Picture', 'Profile Picture for ' + firstname + ' ' + lastname
        )
    );

    if (error) {
        console.log(error);
        response.status(500);
        response.json({
            error
        });
        return;
    }

    const  { newMember, error: createError }  = await repo.createMember(valid.data, url);

    if (createError) {
        response.status(500);
        return response.json({
            error: createError
        });
    }

    
    response.status(201).json(newMember);
});

const params = {
    id: z.string(),
};
// Update member
membersRouter.put('/:id', validate({ body: updateMemberSchema, params }), async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    // Check if member exists
    const { active, error: errorMember } = await repo.existMember(id);

    if (errorMember) {
        return response.status(500).json({ error: errorMember });
    }

    if (!active) {
        return response.status(404).json({ error: 'Member not found' });
    }

    const valid = updateMemberSchema.safeParse(request.body);

    if (valid.error) {
        return response.status(404).json({ error: 'Member format error' });
    }

    const { updated, error } = await repo.updateMember(valid.data, id);

    if (error) {
        return response.status(500).json({
            error,
            updated: false
        });
    }

    return response.status(200).json({
        updated
    });
});

// Delete member
membersRouter.delete('/:id', async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);

    try {

        const { active, error } = await repo.existMember(id);

        if (error) {
            return response.status(500).json(error);
        }

        if (!active) {
            return response.status(200).json({ 
                error: 'Member is already inactive' 
            });
        }
        
        const { member, error: deleteErr } = await repo.deleteMember(id);

        if (deleteErr) {
            return response.status(500).json(deleteErr);
        }

        response.status(200).json({ 
            message: `Member ${member[0].firstName} ${member[0].lastName} deleted successfully`
        });
    } catch (error) {
        console.error('Error deleting member:', error);
        response.status(500).json({ error: 'Failed to delete member' });
    }
});

export {
    membersRouter
}; 
