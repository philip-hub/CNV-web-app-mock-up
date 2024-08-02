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

        // Check if the required columns exist for both sets
        const requiredColumns1 = ['X1', 'Y1', 'arm1'];
        const requiredColumns2 = ['X2', 'Y2', 'arm2'];

        for (const column of requiredColumns1.concat(requiredColumns2)) {
            if (!data[0].hasOwnProperty(column)) {
                console.error(`Required column "${column}" not found`);
                return res.status(400).json({ message: `Required column "${column}" not found` });
            }
        }

        // Extract data for the first plot
        const plotData1 = data.map(row => ({
            x: parseFloat(row.X1),
            y: parseFloat(row.Y1),
            arm: row.arm1
        }));
        const uniqueArm1Values = [...new Set(data.map(row => row.arm1))];

        // Extract data for the second plot
        const plotData2 = data.map(row => ({
            x: parseFloat(row.X2),
            y: parseFloat(row.Y2),
            arm: row.arm2
        }));
        const uniqueArm2Values = [...new Set(data.map(row => row.arm2))];

        console.log('Plot Data 1:', plotData1);
        console.log('Unique arm1 values:', uniqueArm1Values);
        console.log('Plot Data 2:', plotData2);
        console.log('Unique arm2 values:', uniqueArm2Values);

        res.status(200).json({ plotData1, uniqueArm1Values, plotData2, uniqueArm2Values });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
