import { dtoMember, Member, updateMember } from "../model/member.js";
import { tryCatch } from "../util/trycatch.js";
import { sql } from "./connect.js";

export class MemberRepository {


    constructor() {
    }

    async getMembers() {

        const { data: members, error }  = await tryCatch(sql`
            SELECT * FROM member
            where active 
            order by id
        `);

        return {
            members,
            error
        };
    }

    async existMember(id: number) {
        const { data, error } = await tryCatch(sql`SELECT active FROM member WHERE id = ${id}`);

        if (error) {
            return { active: null, error } ;
        }

        if (data.length === 0) {
            return { active: false, error: `The member doesn't exist`};
        }

        const active: boolean = data[0].active;
        
        return {
            active,
            error: null
        };
    }

    async getMember(id: number) {
        const { data, error } = await tryCatch(sql`SELECT * FROM member WHERE id = ${id}`);

        if (error) {
            return { member: null, error } ;
        }

        const member = data[0] as Member;

        return {
            member,
            error: null
        };
    }

    async createMember(member: dtoMember, url: string) {
        const {
            firstname, lastname, middlename, dateofbirth, gender,
            maritalstatus, occupation, phonenumber, mobilenumber,
            email, whatsapp, socialmedia: socialMedia, contactnotes, addressid 
        } = member;

        const result = await tryCatch(sql`SELECT COALESCE(MAX(id), 0) as max_id FROM member`);

        if (result.error) {
            return {
                newMember: null,
                error: result.error
            };
        }

        const newId: number = result.data[0].max_id + 1;
     
        const { data: newMember, error: saveFailed } = await tryCatch(sql`
                INSERT INTO member (
                    id, firstname, lastname, middlename, active, profile_url, dateofbirth,
                    gender, maritalstatus, occupation, phonenumber,
                    mobilenumber, email, whatsapp, socialmedia,
                    contactnotes, addressid
                ) VALUES (
                    ${newId}, ${firstname}, ${lastname}, ${middlename}, ${true},
                    ${url}, ${dateofbirth}, ${gender}, ${maritalstatus},
                    ${occupation}, ${phonenumber}, ${mobilenumber},
                    ${email}, ${whatsapp}, ${socialMedia},
                    ${contactnotes}, ${addressid}
                ) RETURNING *
            `);
        
        if (saveFailed) {
            return { newMember: null, error: saveFailed };
        }

        return { newMember, error: null };
    } 

    async updateMember(member: updateMember, id: number) {

        const { member: existingMember, error: errorGetMember } = await this.getMember(id);

        console.log(existingMember);
        if (errorGetMember) {
            return { updated: false, error: errorGetMember };
        }

        if (!existingMember.active) {
            return {
                updated: false,
                error: 'User not found'
            };
        }

        const {
            firstname, lastname, middlename, dateofbirth, gender,
            maritalstatus, occupation, phonenumber, mobilenumber, email, 
            whatsapp, socialmedia, contactnotes, addressid
        } = member;


        const { error } = await tryCatch(sql`
            UPDATE member SET
                firstname = ${firstname ?? existingMember.firstname},
                lastname = ${lastname ?? existingMember.lastname},
                middlename = ${middlename ?? existingMember.middlename},
                dateofbirth = ${dateofbirth ?? existingMember.dateofbirth},
                gender = ${gender ?? existingMember.gender},
                maritalstatus = ${maritalstatus ?? existingMember.maritalstatus},
                occupation = ${occupation ?? existingMember.occupation},
                phonenumber = ${phonenumber ?? existingMember.phonenumber},
                mobilenumber = ${mobilenumber ?? existingMember.mobilenumber},
                email = ${email ?? existingMember.email},
                whatsapp = ${whatsapp ?? existingMember.whatsapp},
                socialmedia = ${socialmedia ?? existingMember.socialmedia},
                contactnotes = ${contactnotes ?? existingMember.contactnotes},
                addressid = ${addressid ?? existingMember.addressid}
            WHERE id = ${id}
            RETURNING *
        `);

        if (error) {
            return {
                updated: false,
                error
            };
        }

        return {
            updated: true,
            error: null
        };
    }

    async deleteMember(id: number) {
        const { data, error } = await tryCatch(sql`
            UPDATE member
            SET active = false
            where id = ${id}
            returning *
        `);

        if(error) {
            return {
                error,
                member: null
            };
        }

        return {
            member: data,
            error: null
        };
    }
}

