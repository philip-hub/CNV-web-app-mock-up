import { promises as fs } from 'fs';
import path from 'path';

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

        const jsonData = JSON.parse(fileContent);

        const plotData1 = jsonData.map(group => ({
            x: parseFloat(group.X1),
            y: parseFloat(group.Y1),
            arm: group.arm1
        }));
        const uniqueArm1Values = [...new Set(jsonData.map(group => group.arm1))];

        const plotData2 = jsonData.map(group => ({
            x: parseFloat(group.X2),
            y: parseFloat(group.Y2),
            arm: group.arm2
        }));
        const uniqueArm2Values = [...new Set(jsonData.map(group => group.arm2))];

        const plotData3 = jsonData.map(group => ({
            x: parseFloat(group.X3),
            y: parseFloat(group.Y3),
            arm: group.arm3
        }));
        const uniqueArm3Values = [...new Set(jsonData.map(group => group.arm3))];

        const plotData4 = jsonData.map(group => ({
            x: parseFloat(group.X4),
            y: parseFloat(group.Y4),
            arm: group.arm4
        }));
        const uniqueArm4Values = [...new Set(jsonData.map(group => group.arm4))];

        const plotData5 = jsonData.map(group => ({
            x: parseFloat(group.X5),
            y: parseFloat(group.Y5),
            arm: group.arm5
        }));
        const uniqueArm5Values = [...new Set(jsonData.map(group => group.arm5))];

        const mValues = jsonData.map(group => group.M ? parseFloat(group.M) : null);
        const arm6Values = jsonData.map(group => group.arm6);

        const cloneColorMapping = {
            'LOSS': 'blue',
            'LDIP': 'cyan',
            'DIP': 'green',
            'FDIP': 'pink',
            'RDIP': 'pink',
            'DUP': 'orange',
            'HDUP': 'olive',
            'LOH': 'brown',
            'GAIN': 'red',
            'GAIN+': 'purple'
        };

        const arm7ColorMapping = jsonData.reduce((acc, group) => {
            if (group.arm7 && group.clone) {
                const color = cloneColorMapping[group.clone];
                if (color) {
                    acc[group.arm7] = color;
                }
            }
            return acc;
        }, {});

        const cloneMapping = jsonData.reduce((acc, group) => {
            if (group.arm7 && group.clone) {
                acc[group.arm7] = group.clone;
            }
            return acc;
        }, {});

        const Y3Mapping = jsonData.reduce((acc, group) => {
            if (group.arm7) {
                acc[group.arm7] = parseFloat(group.Y3);
            }
            return acc;
        }, {});

        const X3Mapping = jsonData.reduce((acc, group) => {
            if (group.arm7) {
                acc[group.arm7] = parseFloat(group.X3);
            }
            return acc;
        }, {});

        const mMapping = jsonData.reduce((acc, group) => {
            if (group.arm7) {
                acc[group.arm7] = parseFloat(group.M);
            }
            return acc;
        }, {});

        const dmMapping = jsonData.reduce((acc, group) => {
            if (group.arm7) {
                acc[group.arm7] = parseFloat(group.dm);
            }
            return acc;
        }, {});

        const dcnMapping = jsonData.reduce((acc, group) => {
            if (group.arm7) {
                acc[group.arm7] = parseFloat(group.dcn);
            }
            return acc;
        }, {});

        res.status(200).json({
            plotData1, uniqueArm1Values,
            plotData2, uniqueArm2Values,
            plotData3, uniqueArm3Values,
            plotData4, uniqueArm4Values,
            plotData5, uniqueArm5Values,
            mValues, arm6Values,
            arm7ColorMapping, cloneMapping,
            Y3Mapping, X3Mapping,
            mMapping, dmMapping, dcnMapping
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
