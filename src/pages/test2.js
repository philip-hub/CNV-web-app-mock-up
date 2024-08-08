import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
    const [plotData1, setPlotData1] = useState(null);
    const [plotData2, setPlotData2] = useState(null);
    const [uniqueSamples, setUniqueSamples] = useState([]);
    const [uniqueArms, setUniqueArms] = useState([]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            console.error('Failed to upload file');
            return;
        }

        const uploadResult = await uploadResponse.json();
        const filePath = uploadResult.filePath;

        if (!filePath) {
            console.error('File path is required');
            return;
        }

        const calculateResponse = await fetch('/api/multicalc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filePath })
        });

        if (!calculateResponse.ok) {
            console.error('Failed to process file');
            return;
        }

        const result = await calculateResponse.json();
        console.log('API result:', result);

        const { plotData1, plotData2, uniqueSamples, uniqueArms } = result;

        setPlotData1(plotData1);
        setPlotData2(plotData2);
        setUniqueSamples(uniqueSamples);
        setUniqueArms(uniqueArms);
    };

    const getColorScale = (value, min, max) => {
        const normalizedValue = (value - min) / (max - min);
        const red = Math.min(255, Math.floor(normalizedValue * 255));
        const blue = Math.min(255, Math.floor((1 - normalizedValue) * 255));
        return `rgb(${red}, 0, ${blue})`;
    };

    const createHeatmapData = (plotData, valueKey) => {
        const x = [];
        const y = [];
        const z = [];
        const colors = [];

        uniqueSamples.forEach((sample) => {
            const sampleData = plotData.filter(d => d.sample === sample);
            const zRow = [];
            const colorRow = [];
            uniqueArms.forEach((arm) => {
                const dataPoint = sampleData.find(d => d.arm === arm);
                if (dataPoint) {
                    zRow.push(dataPoint[valueKey]);
                    colorRow.push(getColorScale(dataPoint[valueKey], 0, 1)); // Adjust the range as needed
                } else {
                    zRow.push(null);
                    colorRow.push('rgb(255, 255, 255)');
                }
            });
            z.push(zRow);
            colors.push(colorRow);
        });

        return {
            x: uniqueArms,
            y: uniqueSamples,
            z: z,
            type: 'heatmap',
            colorscale: colors,
            showscale: false,
        };
    };

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />

            {plotData1 && plotData2 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <Plot
                            data={[createHeatmapData(plotData1, 'cn')]}
                            layout={{ title: 'CN Heatmap', xaxis: { title: 'Arm' }, yaxis: { title: 'Sample' } }}
                        />
                    </div>
                    <div>
                        <Plot
                            data={[createHeatmapData(plotData2, 'ai')]}
                            layout={{ title: 'AI Heatmap', xaxis: { title: 'Arm' }, yaxis: { title: 'Sample' } }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
