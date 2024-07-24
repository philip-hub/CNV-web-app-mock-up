import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).json({ message: 'File path is required' });
    }

    try {
        const fileContent = await fs.readFile(path.join(process.cwd(), filePath), 'utf8');

        // Parse the TSV file content
        const parsedData = Papa.parse(fileContent, {
            header: true,
            delimiter: '\t'
        });

        const karyotypes = parsedData.data;

        // Check if the coverage column exists
        if (!karyotypes[0].hasOwnProperty('dm')) {
            return res.status(400).json({ message: 'Coverage column "dm" not found' });
        }

        // Convert columns to numbers where necessary
        karyotypes.forEach(row => {
            row.dm = parseFloat(row.dm);
        });

        // Calculate the median coverage
        const medianCoverage = karyotypes.reduce((acc, row) => acc + row.dm, 0) / karyotypes.length;

        // Calculate the log ratio and NRMF
        const totalReads = karyotypes.reduce((acc, row) => acc + row.dm, 0);
        const expectedFraction = 1 / karyotypes.length;

        karyotypes.forEach(row => {
            row.log_ratio = Math.log2(row.dm / medianCoverage);
            row.read_mapping_fraction = row.dm / totalReads;
            row.NRMF = row.read_mapping_fraction / expectedFraction;
        });

        // Select the relevant columns
        const result = karyotypes.map(row => ({
            arm: row.arm,
            log_ratio: row.log_ratio,
            NRMF: row.NRMF
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
