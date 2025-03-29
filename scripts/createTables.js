import postgres from 'postgres';
import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
const sql = postgres(
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/crypto'
);

async function createTables() {
    try {
        console.log('Reading SQL structure file...');
        const sqlFilePath = path.join(__dirname, '..', 'db', 'struct.sql');
        const sqlContent = await fs.readFile(sqlFilePath, 'utf-8');

        const sqlParsed = sqlContent.split('\n')
            .filter(line => !line.includes('--'))
            .join(' ');

        // Split the SQL content into individual statements
        const statements = sqlParsed
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        console.log(statements);

        console.log('Creating tables...');
        for (const statement of statements) {
            try {
                await sql.unsafe(statement);
                console.log('Successfully executed:', statement.substring(0, 50) + '...');
            } catch (error) {
                if (error.code === '42P07') { // Table already exists
                    console.log('Table already exists, skipping...');
                } else {
                    throw error;
                }
            }
        }

        console.log('Tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        await sql.end();
    }
}

// Run the script
createTables()
    .catch(err => {
        console.error('Error in main execution:', err);
        process.exit(1);
    }); 