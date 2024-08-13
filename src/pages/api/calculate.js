import { promises as fs } from 'fs';
import path from 'path';

export async function calculateM0(jsonData, cloneMapping) {
    const mValues = jsonData.filter(group => cloneMapping[group.arm] === 'REF').map(group => group.m);
    const m0 = mValues.reduce((acc, value) => acc + value, 0) / mValues.length;
    return m0;
}

export async function calculateAllMappings(jsonData, m0) {
    const lcv0 = m0;

    const plotData1 = jsonData.map(group => ({
        x: group.poslcv,
        y: Math.log2(group.lcv / lcv0),
        arm: group.arm
    }));

    const plotData3 = jsonData.map(group => ({
        x: (2 * group.m) / lcv0,
        y: group.ai,
        arm: group.arm
    }));

    const mValues = jsonData.map(group => group.m - lcv0);

    const Y3Mapping = jsonData.reduce((acc, group) => {
        acc[group.arm] = (2 * group.m) / lcv0;
        return acc;
    }, {});

    const X3Mapping = jsonData.reduce((acc, group) => {
        acc[group.arm] = group.ai;
        return acc;
    }, {});

    const dcnMapping = jsonData.reduce((acc, group) => {
        acc[group.arm] = (2 * group.dm) / lcv0 + (2 * group.m * mValues.reduce((a, b) => a + b, 0)) / (lcv0 ** 2);
        return acc;
    }, {});

    return {
        plotData1,
        plotData3,
        mValues,
        Y3Mapping,
        X3Mapping,
        dcnMapping
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { filePath, cloneMapping } = req.body;

    if (!filePath) {
        console.error('File path is required');
        return res.status(400).json({ message: 'File path is required' });
    }

    const absoluteFilePath = path.join(process.cwd(), 'uploads', path.basename(filePath));

    try {
        const fileContent = await fs.readFile(absoluteFilePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        // Initialize cloneMapping if not provided
        if (!cloneMapping) {
            const initialMapping = jsonData.reduce((acc, group) => {
                acc[group.arm] = group.clone === 'DIP' ? 'REF' : 'NOT_REF';
                return acc;
            }, {});
            cloneMapping = initialMapping;
        }

        // Calculate m0 using the cloneMapping
        const m0 = await calculateM0(jsonData, cloneMapping);

        // Calculate all necessary mappings and plot data
        const calculations = await calculateAllMappings(jsonData, m0);

        res.status(200).json(calculations);

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
