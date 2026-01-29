import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Anti-Brute Force Protection
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: { error: 'TOO_MANY_ATTEMPTS' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
});

// AUTH GATE
const ACCESS_KEY = "meepisagoodbotbotbot";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader === `Bearer ${ACCESS_KEY}`) {
        next();
    } else {
        res.status(401).json({ error: 'UNAUTHORIZED' });
    }
};

app.post('/api/login', loginLimiter, (req, res) => {
    const { password } = req.body;
    if (password === ACCESS_KEY) {
        res.json({ success: true, token: ACCESS_KEY });
    } else {
        res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
});

// Protected Endpoints
app.get('/api/stats', apiLimiter, authMiddleware, (req, res) => {
    res.json({
        cpu: (Math.random() * 10 + 1).toFixed(1),
        memory: (process.memoryUsage().rss / 1024 / 1024).toFixed(0),
        uptime: process.uptime().toFixed(0),
        load: (Math.random() * 0.2 + 0.05).toFixed(2),
        latency: (Math.random() * 5 + 5).toFixed(0)
    });
});

app.get('/api/workspace', apiLimiter, authMiddleware, (req, res) => {
    const workspacePath = '/data/workspace';
    try {
        const files = fs.readdirSync(workspacePath).map(file => {
            const stats = fs.statSync(path.join(workspacePath, file));
            return {
                name: file,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                mtime: stats.mtime
            };
        });
        res.json({ path: workspacePath, items: files });
    } catch (e) {
        res.status(500).json({ error: 'FAILED_TO_READ_WORKSPACE' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'nominal', core: '075C4' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
    console.log(`WORKBENCH_RUNNING_ON_PORT: ${port}`);
});
