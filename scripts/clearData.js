import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Connect to the database using the connection string from index.ts
const sql = postgres(
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/crypto'
);

async function clearData() {
    try {
        console.log('Checking for data in the database...');
        
        // Check if Member table exists and has data
        try {
            const memberCount = await sql`SELECT COUNT(*) FROM member`;
            console.log(`Found ${memberCount[0].count} records in Member table`);
            
            if (memberCount[0].count > 0) {
                // Delete all data from Member table first (due to foreign key constraint)
                console.log('Deleting data from Member table...');
                await sql`DELETE FROM member`;
                console.log('Member table cleared.');
            } else {
                console.log('Member table is already empty.');
            }
        } catch (error) {
            console.log('Member table not found or cannot be accessed:', error.message);
        }
        
        // Check if Address table exists and has data
        try {
            const addressCount = await sql`SELECT COUNT(*) FROM address`;
            console.log(`Found ${addressCount[0].count} records in Address table`);
            
            if (addressCount[0].count > 0) {
                // Delete all data from Address table
                console.log('Deleting data from Address table...');
                await sql`DELETE FROM address`;
                console.log('Address table cleared.');
            } else {
                console.log('Address table is already empty.');
            }
        } catch (error) {
            console.log('Address table not found or cannot be accessed:', error.message);
        }
        
        // Reset the sequences (auto-increment) for both tables
        console.log('Checking sequences...');
        
        // Check if sequences exist before trying to reset them
        const memberSeqResult = await sql`
            SELECT EXISTS (
                SELECT FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'member_id_seq'
            )
        `;
        
        const addressSeqResult = await sql`
            SELECT EXISTS (
                SELECT FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'address_id_seq'
            )
        `;
        
        if (memberSeqResult[0].exists) {
            await sql`ALTER SEQUENCE member_id_seq RESTART WITH 1`;
            console.log('Reset Member sequence.');
        } else {
            console.log('Member sequence not found.');
        }
        
        if (addressSeqResult[0].exists) {
            await sql`ALTER SEQUENCE address_id_seq RESTART WITH 1`;
            console.log('Reset Address sequence.');
        } else {
            console.log('Address sequence not found.');
        }
        
        console.log('Database cleanup completed!');
    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        // Close the database connection
        await sql.end();
    }
}

// Run the script
clearData()
    .catch(err => {
        console.error('Error in main execution:', err);
        process.exit(1);
    }); 