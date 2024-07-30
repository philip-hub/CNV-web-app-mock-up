import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { filePath } = req.body;

    if (!filePath) {
        console.error('File path is required');
        return res.status(400).json({ message: 'File path is required' });
    }

    const absoluteFilePath = path.join(process.cwd(), 'uploads', path.basename(filePath));

    try {
        const fileContent = await fs.readFile(absoluteFilePath, 'utf8');
        console.log('File content read successfully');

        // Parse the TSV file content
        const parsedData = Papa.parse(fileContent, {
            header: true,
            delimiter: '\t'
        });

        const data = parsedData.data;
        console.log('Parsed data:', data);

        // Check if the required columns exist
        const requiredColumns = ['x', 'y'];
        for (const column of requiredColumns) {
            if (!data[0].hasOwnProperty(column)) {
                console.error(`Required column "${column}" not found`);
                return res.status(400).json({ message: `Required column "${column}" not found` });
            }
        }

        // Extract x and y data
        const plotData = data.map(row => ({
            x: parseFloat(row.x),
            y: parseFloat(row.y)
        }));

        console.log('Plot Data:', plotData);

        res.status(200).json({ plotData });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
