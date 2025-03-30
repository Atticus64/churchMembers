import { Router, Request, Response } from 'express';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { dtoMember } from '../model/member.js';
import { uploadImage } from '../util/img.js';

dotenv.config();
const sql = postgres(
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/crypto'
);

const membersRouter = Router();

// Get all members
membersRouter.get('/', async (request: Request, response: Response) => {
    try {
        const members = await sql`SELECT * FROM member`;
        response.status(200).json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        response.status(500).json({ error: 'Failed to retrieve members' });
    }
});

// Get member by ID
membersRouter.get('/:id', async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    
    try {
        const member = await sql`SELECT * FROM member WHERE id = ${id}`;
        
        if (member.length === 0) {
            return response.status(404).json({ error: 'Member not found' });
        }
        
        response.status(200).json(member[0]);
    } catch (error) {
        console.error('Error fetching member:', error);
        response.status(500).json({ error: 'Failed to retrieve member' });
    }
});

// Create new member
membersRouter.post('/', async (request: Request, response: Response) => {
    const { 
        firstName, lastName, middleName, image, dateOfBirth, gender, 
        maritalStatus, occupation, phoneNumber, mobileNumber,
        email, whatsapp, socialMedia, contactNotes, addressId 
    }: dtoMember = request.body;
    
    try {
        // Get the next available ID
        const result = await sql`SELECT COALESCE(MAX(id), 0) as max_id FROM member`;
        const newId = result[0].max_id + 1;

        const url = await uploadImage(image, 'Profile Picture', 'Profile Picture for ' + firstName + ' ' + lastName);
        
        const newMember = await sql`
            INSERT INTO member (
                id, firstname, lastname, middlename, profile_url, dateofbirth,
                gender, maritalstatus, occupation, phonenumber,
                mobilenumber, email, whatsapp, socialmedia,
                contactnotes, addressid
            ) VALUES (
                ${newId}, ${firstName}, ${lastName}, ${middleName},
                ${url}, ${dateOfBirth}, ${gender}, ${maritalStatus},
                ${occupation}, ${phoneNumber}, ${mobileNumber},
                ${email}, ${whatsapp}, ${socialMedia},
                ${contactNotes}, ${addressId}
            ) RETURNING *
        `;
        
        response.status(201).json(newMember[0]);
    } catch (error) {
        console.error('Error creating member:', error);
        response.status(500).json({ error: 'Failed to create member' });
    }
});

// Update member
membersRouter.put('/:id', async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    const { 
        firstname, lastname, middlename, dateofbirth, gender, 
        maritalstatus, occupation, phonenumber, mobilenumber,
        email, whatsapp, socialmedia, contactnotes, addressid 
    } = request.body;
    
    try {
        // Check if member exists
        const existingMember = await sql`SELECT * FROM member WHERE id = ${id}`;
        
        if (existingMember.length === 0) {
            return response.status(404).json({ error: 'Member not found' });
        }
        
        const updatedMember = await sql`
            UPDATE member SET
                firstname = ${firstname || existingMember[0].firstname},
                lastname = ${lastname || existingMember[0].lastname},
                middlename = ${middlename || existingMember[0].middlename},
                dateofbirth = ${dateofbirth || existingMember[0].dateofbirth},
                gender = ${gender || existingMember[0].gender},
                maritalstatus = ${maritalstatus || existingMember[0].maritalstatus},
                occupation = ${occupation || existingMember[0].occupation},
                phonenumber = ${phonenumber || existingMember[0].phonenumber},
                mobilenumber = ${mobilenumber || existingMember[0].mobilenumber},
                email = ${email || existingMember[0].email},
                whatsapp = ${whatsapp || existingMember[0].whatsapp},
                socialmedia = ${socialmedia || existingMember[0].socialmedia},
                contactnotes = ${contactnotes || existingMember[0].contactnotes},
                addressid = ${addressid || existingMember[0].addressid}
            WHERE id = ${id}
            RETURNING *
        `;
        
        response.status(200).json(updatedMember[0]);
    } catch (error) {
        console.error('Error updating member:', error);
        response.status(500).json({ error: 'Failed to update member' });
    }
});

// Delete member
membersRouter.delete('/:id', async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    
    try {
        const deletedMember = await sql`
            DELETE FROM member
            WHERE id = ${id}
            RETURNING *
        `;
        
        if (deletedMember.length === 0) {
            return response.status(404).json({ error: 'Member not found' });
        }
        
        response.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        response.status(500).json({ error: 'Failed to delete member' });
    }
});

export {
    membersRouter
}; 