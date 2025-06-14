const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')
const db = new sqlite3.Database(':memory:');
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = process.env.PORT || 8500
app.use(express.json())
app.use(cors())

// Create table on startup
db.serialize(() => {
    db.run(`CREATE TABLE incidents (
      id TEXT PRIMARY KEY,
      incidentType TEXT,
      severity TEXT,
      description TEXT,
      latitude REAL,
      longitude REAL,
      reporterName TEXT,
      timestamp TEXT
    )`);
});
app.get('/api/incidents', (req, res) => {
    let query = 'SELECT * FROM incidents WHERE 1=1';
    const params = [];
    if (req.query.type) {
        const types = Array.isArray(req.query.type) ? req.query.type : [req.query.type];
        query += ` AND incidentType IN (${types.map(() => '?').join(', ')})`;
        params.push(...types);
    }
    if (req.query.severity) {
        const severities = Array.isArray(req.query.severity) ? req.query.severity : [req.query.severity];
        query += ` AND severity IN (${severities.map(() => '?').join(', ')})`;
        params.push(...severities);
    }
    if (req.query.startDate) {
        query += ' AND timestamp >= ?';
        params.push(req.query.startDate);
    }
    if (req.query.endDate) {
        query += ' AND timestamp <= ?';
        params.push(req.query.endDate);
    }
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.post('/api/incidents', (req, res) => {
    const { incidentType, severity, description, latitude, longitude, reporterName } = req.body;
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    db.run(`INSERT INTO incidents (id, incidentType, severity, description, latitude, longitude, reporterName, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, incidentType, severity, description, latitude, longitude, reporterName, timestamp],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id });
        });
});

app.listen(port, () => {
    console.log(`listening on port number ${port}`)
})