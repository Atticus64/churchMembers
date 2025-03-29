import postgres from 'postgres';
import { config } from 'dotenv';
import { faker } from '@faker-js/faker';

// Load environment variables from .env file
config();

// Connect to the database
const sql = postgres(
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/crypto'
);

async function generateFakeData(numRecords = 10) {
    try {
        console.log(`Generating ${numRecords} fake records...`);

        // Generate addresses first
        for (let i = 0; i < numRecords; i++) {
            const address = {
                id: i + 1,
                streetName: faker.location.street(),
                exteriorNumber: faker.number.int({ min: 1, max: 9999 }).toString(),
                neighborhood: faker.location.county(),
                postalCode: faker.location.zipCode('#####')
            };

            await sql`
                INSERT INTO address (
                    id, streetName, exteriorNumber, neighborhood, postalCode
                ) VALUES (
                    ${address.id},
                    ${address.streetName},
                    ${address.exteriorNumber},
                    ${address.neighborhood},
                    ${address.postalCode}
                )
            `;
        }

        console.log('Addresses generated successfully!');

        // Generate members
        for (let i = 0; i < numRecords; i++) {
            const member = {
                id: i + 1,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                middleName: faker.person.middleName(),
                profileUrl: faker.image.avatar(),
                dateOfBirth: faker.date.birthdate(),
                gender: faker.helpers.arrayElement(['M', 'F']),
                maritalStatus: faker.helpers.arrayElement(['S', 'M', 'D', 'W']),
                occupation: faker.person.jobTitle(),
                phoneNumber: faker.phone.number(),
                mobileNumber: faker.phone.number(),
                email: faker.internet.email(),
                whatsapp: faker.phone.number(),
                socialMedia: faker.internet.userName(),
                contactNotes: faker.lorem.sentence({ max: 5 }),
                addressId: i + 1
            };

            console.log(`INSERT INTO member (
    id, firstName, lastName, middleName, profile_url,
    dateOfBirth, gender, maritalStatus, occupation,
    phoneNumber, mobileNumber, email, whatsapp,
    socialMedia, contactNotes, addressId
) VALUES (
    ${member.id}, '${member.firstName}', '${member.lastName}',
    '${member.middleName}', '${member.profileUrl}',
    '${member.dateOfBirth}', '${member.gender}',
    '${member.maritalStatus}', ${member.occupation},
    '${member.phoneNumber}', ${member.mobileNumber},
    '${member.email}', '${member.whatsapp}',
    '${member.socialMedia}', '${member.contactNotes}',
    ${member.addressId}
);`);

            await sql`
                INSERT INTO member (
                    id, firstName, lastName, middleName, profile_url,
                    dateOfBirth, gender, maritalStatus, occupation,
                    phoneNumber, mobileNumber, email, whatsapp,
                    socialMedia, contactNotes, addressId
                ) VALUES (
                    ${member.id}, ${member.firstName}, ${member.lastName},
                    ${member.middleName}, ${member.profileUrl},
                    ${member.dateOfBirth}, ${member.gender},
                    ${member.maritalStatus}, ${member.occupation},
                    ${member.phoneNumber}, ${member.mobileNumber},
                    ${member.email}, ${member.whatsapp},
                    ${member.socialMedia}, ${member.contactNotes},
                    ${member.addressId}
                );`;
        }


        console.log('Members generated successfully!');
        console.log(`Generated ${numRecords} fake records successfully!`);
    } catch (error) {
        console.error('Error generating fake data:', error);
    } finally {
        await sql.end();
    }
}

// Run the script
generateFakeData()
    .catch(err => {
        console.error('Error in main execution:', err);
        process.exit(1);
    }); 