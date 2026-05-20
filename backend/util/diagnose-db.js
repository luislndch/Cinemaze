import pkg from 'pg';
const { Client } = pkg;
import { configDotenv } from "dotenv";
import dns from 'dns';

configDotenv();

const dbUrl = process.env.DB_URL;

async function diagnose() {
    console.log("--- Supabase Connectivity Diagnosis ---");
    
    if (!dbUrl) {
        console.error("❌ Error: DB_URL is not defined in .env");
        return;
    }

    try {
        const url = new URL(dbUrl);
        console.log(`Checking Host: ${url.hostname}`);
        console.log(`Checking Port: ${url.port || '5432'}`);

        // 1. DNS Resolution Check
        console.log("\n1. Testing DNS Resolution...");
        dns.lookup(url.hostname, (err, address, family) => {
            if (err) {
                console.error("❌ DNS Lookup Failed:", err.message);
            } else {
                console.log(`✅ DNS Resolved: ${address} (IPv${family})`);
            }
        });

        // 2. Connection Test
        console.log("\n2. Attempting Database Connection (5s timeout)...");
        const client = new Client({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000,
        });

        const start = Date.now();
        await client.connect();
        const end = Date.now();
        
        console.log(`✅ Successfully connected in ${end - start}ms!`);
        
        const res = await client.query('SELECT version();');
        console.log(`✅ Postgres Version: ${res.rows[0].version}`);
        
        await client.end();
    } catch (err) {
        console.error("\n❌ Connection Failed!");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
        
        if (err.message.includes("password authentication failed")) {
            console.log("\n💡 Tip: Check if your password contains special characters like @, !, #, or $. If it does, you MUST URL-encode them (e.g., @ becomes %40).");
        } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
            console.log("\n💡 Tip: This looks like a network/firewall issue. Try switching to the Supabase Connection Pooler (Port 6543) if you haven't already.");
        }
    }
}

diagnose();
