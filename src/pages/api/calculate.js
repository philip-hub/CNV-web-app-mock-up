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

        const parsedData = Papa.parse(fileContent, {
            header: true,
            delimiter: '\t'
        });

        const data = parsedData.data;
        console.log('Parsed data:', data);

        const requiredColumns1 = ['X1', 'Y1', 'arm1'];
        const requiredColumns2 = ['X2', 'Y2', 'arm2'];
        const requiredColumns3 = ['X3', 'Y3', 'arm3'];
        const requiredColumns4 = ['X4', 'Y4', 'arm4'];
        const requiredColumns5 = ['X5', 'Y5', 'arm5'];
        const requiredColumns6 = ['M', 'arm6'];
        const requiredColumns7 = ['arm7', 'color'];
        const requiredColumns8 = ['clone'];
        const requiredColumns9 = ['dm', 'dcn'];

        for (const column of [...requiredColumns1, ...requiredColumns2, ...requiredColumns3, ...requiredColumns4, ...requiredColumns5, ...requiredColumns6, ...requiredColumns7, ...requiredColumns8, ...requiredColumns9]) {
            if (!data[0].hasOwnProperty(column)) {
                console.error(`Required column "${column}" not found`);
                return res.status(400).json({ message: `Required column "${column}" not found` });
            }
        }

        const plotData1 = data.map(row => ({
            x: parseFloat(row.X1),
            y: parseFloat(row.Y1),
            arm: row.arm1
        }));
        const uniqueArm1Values = [...new Set(data.map(row => row.arm1))];

        const plotData2 = data.map(row => ({
            x: parseFloat(row.X2),
            y: parseFloat(row.Y2),
            arm: row.arm2
        }));
        const uniqueArm2Values = [...new Set(data.map(row => row.arm2))];

        const plotData3 = data.map(row => ({
            x: parseFloat(row.X3),
            y: parseFloat(row.Y3),
            arm: row.arm3
        }));
        const uniqueArm3Values = [...new Set(data.map(row => row.arm3))];

        const plotData4 = data.map(row => ({
            x: parseFloat(row.X4),
            y: parseFloat(row.Y4),
            arm: row.arm4
        }));
        const uniqueArm4Values = [...new Set(data.map(row => row.arm4))];

        const plotData5 = data.map(row => ({
            x: parseFloat(row.X5),
            y: parseFloat(row.Y5),
            arm: row.arm5
        }));
        const uniqueArm5Values = [...new Set(data.map(row => row.arm5))];

        const mValues = data.map(row => row.M ? parseFloat(row.M) : null);
        const arm6Values = data.map(row => row.arm6);

        const arm7ColorMapping = data.reduce((acc, row) => {
            if (row.arm7 && row.color) {
                acc[row.arm7] = row.color;
            }
            return acc;
        }, {});

        const cloneMapping = data.reduce((acc, row) => {
            if (row.arm7 && row.clone) {
                acc[row.arm7] = row.clone;
            }
            return acc;
        }, {});

        const Y3Mapping = data.reduce((acc, row) => {
            if (row.arm7) {
                acc[row.arm7] = parseFloat(row.Y3);
            }
            return acc;
        }, {});

        const X3Mapping = data.reduce((acc, row) => {
            if (row.arm7) {
                acc[row.arm7] = parseFloat(row.X3);
            }
            return acc;
        }, {});

        const mMapping = data.reduce((acc, row) => {
            if (row.arm7) {
                acc[row.arm7] = parseFloat(row.M);
            }
            return acc;
        }, {});

        const dmMapping = data.reduce((acc, row) => {
            if (row.arm7) {
                acc[row.arm7] = parseFloat(row.dm);
            }
            return acc;
        }, {});

        const dcnMapping = data.reduce((acc, row) => {
            if (row.arm7) {
                acc[row.arm7] = parseFloat(row.dcn);
            }
            return acc;
        }, {});
        
        console.log(plotData1)
        console.log(uniqueArm1Values)

        
        res.status(200).json({ plotData1, uniqueArm1Values, plotData2, uniqueArm2Values, plotData3, uniqueArm3Values, plotData4, uniqueArm4Values, plotData5, uniqueArm5Values, mValues, arm6Values, arm7ColorMapping, cloneMapping, Y3Mapping, X3Mapping, mMapping, dmMapping, dcnMapping });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
