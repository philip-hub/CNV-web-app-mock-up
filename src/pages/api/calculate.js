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
        const requiredColumns = ['X1', 'Y1', 'arm1'];
        for (const column of requiredColumns) {
            if (!data[0].hasOwnProperty(column)) {
                console.error(`Required column "${column}" not found`);
                return res.status(400).json({ message: `Required column "${column}" not found` });
            }
        }

        // Extract X1, Y1, and arm1 data
        const plotData = data.map(row => ({
            x: parseFloat(row.X1),
            y: parseFloat(row.Y1),
            arm1: row.arm1
        }));

        // Extract unique arm1 values
        const uniqueArm1Values = [...new Set(data.map(row => row.arm1))];

        console.log('Plot Data:', plotData);
        console.log('Unique arm1 values:', uniqueArm1Values);

        res.status(200).json({ plotData, uniqueArm1Values });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
