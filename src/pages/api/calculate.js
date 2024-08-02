import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { polynomialRegression } from './polynomialRegression';

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

        for (const column of [...requiredColumns1, ...requiredColumns2, ...requiredColumns3, ...requiredColumns4]) {
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

        const lineData4 = uniqueArm4Values.map(arm => {
            const armData = plotData4.filter(d => d.arm === arm);
            const coefficients = polynomialRegression(armData.map(d => d.x), armData.map(d => d.y), 2);

            const xMin = Math.min(...armData.map(d => d.x));
            const xMax = Math.max(...armData.map(d => d.x));
            const xFit = [];
            const yFit = [];

            for (let x = xMin; x <= xMax; x += (xMax - xMin) / 100) {
                xFit.push(x);
                yFit.push(coefficients.reduce((sum, coef, index) => sum + coef * Math.pow(x, index), 0));
            }

            return {
                arm,
                x: xFit,
                y: yFit
            };
        });

        console.log('Plot Data 1:', plotData1);
        console.log('Unique arm1 values:', uniqueArm1Values);
        console.log('Plot Data 2:', plotData2);
        console.log('Unique arm2 values:', uniqueArm2Values);
        console.log('Plot Data 3:', plotData3);
        console.log('Unique arm3 values:', uniqueArm3Values);
        console.log('Plot Data 4:', plotData4);
        console.log('Unique arm4 values:', uniqueArm4Values);
        console.log('Line Data 4:', lineData4);

        res.status(200).json({ plotData1, uniqueArm1Values, plotData2, uniqueArm2Values, plotData3, uniqueArm3Values, plotData4, uniqueArm4Values, lineData4 });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
