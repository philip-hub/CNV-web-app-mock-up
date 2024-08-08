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

    const coolwarmColorscale = [
        [0, 'blue'],
        [0.5, 'white'],
        [1, 'red']
    ];

    const coolColorscale = [
        [0, 'blue'],
        [1, 'yellow']
    ];

    const createHeatmapData = (plotData, valueKey, valueLabel) => {
        const x = uniqueArms;
        const y = [];
        const z = [];
        const hoverText = [];
        const annotations = [];

        uniqueSamples.forEach((sample, sampleIndex) => {
            const sampleData = plotData.filter(d => d.sample === sample);
            const zRow = [];
            const hoverTextRow = [];
            uniqueArms.forEach((arm) => {
                const dataPoint = sampleData.find(d => d.arm === arm);
                if (dataPoint) {
                    zRow.push(dataPoint[valueKey]);
                    hoverTextRow.push(`arm: ${arm}<br>sample: ${sample}<br>${valueLabel}: ${dataPoint[valueKey]}`);
                } else {
                    zRow.push(null);
                    hoverTextRow.push(`arm: ${arm}<br>sample: ${sample}<br>${valueLabel}: N/A`);
                }
            });
            z.push(zRow);
            hoverText.push(hoverTextRow);
            annotations.push({
                xref: 'paper',
                yref: 'y',
                x: -0.1,
                y: sampleIndex,
                text: sample,
                showarrow: false,
                font: {
                    size: 10
                }
            });
            y.push(sampleIndex);
        });

        return { x, y, z, hoverText, annotations };
    };

    const createHeatmapPlot = (data, title, colorscale, zmid = null) => {
        return (
            <Plot
                data={[
                    {
                        x: data.x,
                        y: data.y,
                        z: data.z,
                        type: 'heatmap',
                        colorscale: colorscale,
                        zmid: zmid,
                        showscale: true,
                        text: data.hoverText,
                        hoverinfo: 'text',
                    },
                ]}
                layout={{
                    title: title,
                    xaxis: { title: 'Arm' },
                    yaxis: { title: 'Sample', showticklabels: false },
                    annotations: data.annotations,
                }}
            />
        );
    };

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />

            {plotData1 && plotData2 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        {createHeatmapPlot(createHeatmapData(plotData1, 'cn', 'copy number'), 'CN Heatmap', coolwarmColorscale, 2)}
                    </div>
                    <div>
                        {createHeatmapPlot(createHeatmapData(plotData2, 'ai', 'AI'), 'AI Heatmap', coolColorscale)}
                    </div>
                </div>
            )}
        </div>
    );
}
