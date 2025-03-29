import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Connect to the database
const sql = postgres(
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/crypto'
);

async function deleteTables() {
    try {
        console.log('Checking for existing tables...');

        // Drop Member table first due to foreign key constraint
        try {
            console.log('Dropping Member table...');
            await sql`DROP TABLE IF EXISTS member CASCADE`;
            console.log('Member table dropped successfully.');
        } catch (error) {
            console.error('Error dropping Member table:', error);
        }

        // Then drop Address table
        try {
            console.log('Dropping Address table...');
            await sql`DROP TABLE IF EXISTS address CASCADE`;
            console.log('Address table dropped successfully.');
        } catch (error) {
            console.error('Error dropping Address table:', error);
        }

        console.log('All tables dropped successfully!');
    } catch (error) {
        console.error('Error deleting tables:', error);
    } finally {
        await sql.end();
    }
}

// Run the script
deleteTables()
    .catch(err => {
        console.error('Error in main execution:', err);
        process.exit(1);
    });
