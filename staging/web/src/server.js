// Import required packages for server functionality
import express from 'express';
import mustacheExpress from 'mustache-express';
import os from 'os';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Server setup
const app = express();

// This is the key part - express.static makes the 'public' directory
// accessible at the root URL path
app.use(express.static(join(__dirname, 'public')));
app.use(express.json()); // For parsing application/json

app.set('view engine', 'html');
app.engine('html', mustacheExpress());
app.set('views', __dirname);

const port = 3000;
const dbhost = process.env.DB_HOST || 'localhost';

console.log(`DB_HOST: ${dbhost}`);
const pool = new Pool({
    host: dbhost,
    user: 'dockeruser',
    password: process.env.POSTGRES_PASSWORD,
    database: 'leaderboard',
    port: 5432,
});

// Serve the main app page
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'app.html'));
});

// API endpoint to save scores
app.post('/api/save-score', async (req, res) => {
    try {
        const { playerName, score } = req.body;
        const client = await pool.connect();
        const query = `INSERT INTO leaderboard (playername, score) VALUES ($1, $2) RETURNING *`;
        const values = [playerName, score];
        const result = await client.query(query, values);
        client.release();
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//API endpoint to load high scores
app.get('/api/load-highscores', async (req, res) => {
    try {
        const client = await pool.connect();
        const query = `SELECT playername, score FROM leaderboard ORDER BY score DESC LIMIT 5`;
        const result = await client.query(query);
        client.release();
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Application listening on port ${port}`);
    console.log(`Access the app at http://localhost:${port}`);
});
