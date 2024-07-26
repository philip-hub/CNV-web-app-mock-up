// pages/api/data.js
import fs from 'fs';
import path from 'path';

export default (req, res) => {
    const filePath = path.join(process.cwd(), 'random_data.tsv');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data file' });
        } else {
            res.status(200).send(data);
        }
    });
};
