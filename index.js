const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const PDFDocument = require('pdfkit');
const stream = require('stream');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(cors());

// Create table
db.serialize(() => {
    db.run("CREATE TABLE inspections (id INTEGER PRIMARY KEY AUTOINCREMENT, inspectorName TEXT, inspectionDate TEXT, location TEXT, comments TEXT)");
});

// API endpoint to receive data and generate PDF
app.post('/api/submitInspection', (req, res) => {
    const { inspectorName, inspectionDate, location, comments } = req.body;
    db.run("INSERT INTO inspections (inspectorName, inspectionDate, location, comments) VALUES (?, ?, ?, ?)", [inspectorName, inspectionDate, location, comments], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        
        const id = this.lastID;
        const doc = new PDFDocument();
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=inspection_${id}.pdf`,
                'Content-Length': pdfData.length
            });
            res.end(pdfData);
        });
        
        doc.fontSize(25).text('Inspection Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(18).text(`Inspector Name: ${inspectorName}`);
        doc.text(`Inspection Date: ${inspectionDate}`);
        doc.text(`Location: ${location}`);
        doc.text(`Comments: ${comments}`);
        doc.end();
    });
});

// API endpoint to retrieve all inspections
app.get('/api/getInspections', (req, res) => {
    db.all("SELECT * FROM inspections", [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// API endpoint to delete an inspection
app.delete('/api/deleteInspection/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM inspections WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send('Inspection deleted successfully');
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
