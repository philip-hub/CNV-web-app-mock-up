import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
    const [plotData1, setPlotData1] = useState(null);
    const [plotData2, setPlotData2] = useState(null);
    const [uniqueSamples, setUniqueSamples] = useState([]);
    const [uniqueArms, setUniqueArms] = useState([]);
    const [selectedArm, setSelectedArm] = useState(null);

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

    const handleArmChange = (event) => {
        setSelectedArm(event.target.value);
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
        const rowHeight = 70; // Set a fixed row height for each sample
        const height = 50 + uniqueSamples.length * rowHeight; // Calculate the total height based on the number of samples
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
                    yaxis: { title: 'Sample', tickvals: data.y, ticktext: uniqueSamples, tickmode: 'array' },
                    annotations: data.annotations,
                    height: height,
                }}
            />
        );
    };

    const createScatterPlot = (plotData1, plotData2, selectedArm) => {
        if (!selectedArm) return null;

        const selectedData1 = plotData1.filter(d => d.arm === selectedArm);
        const selectedData2 = plotData2.filter(d => d.arm === selectedArm);

        const x = selectedData1.map(d => d.cn);
        const y = selectedData2.map(d => d.ai);

        const annotations = x.map((cn, i) => {
            if (i < x.length - 1) {
                return {
                    ax: cn,
                    ay: y[i],
                    axref: 'x',
                    ayref: 'y',
                    x: x[i + 1],
                    y: y[i + 1],
                    xref: 'x',
                    yref: 'y',
                    showarrow: true,
                    arrowhead:3,
                    arrowsize: 2,
                    arrowwidth: 2,
                    arrowcolor: 'lime'
                };
            }
            return null;
        }).filter(a => a !== null);

        return (
            <Plot
                data={[
                    {
                        x: x,
                        y: y,
                        mode: 'markers+lines',
                        type: 'scatter',
                        marker: { size: 10, color: 'blue' },
                        text: selectedData1.map((d, i) => `Sample: ${d.sample}<br>CN: ${d.cn}<br>AI: ${selectedData2[i].ai}`)
                    }
                ]}
                layout={{
                    title: `Scatter Plot for Arm: ${selectedArm}`,
                    xaxis: { title: 'CN' },
                    yaxis: { title: 'AI' },
                    annotations: annotations,
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

            {plotData1 && plotData2 && uniqueArms.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="arm-select">Select Arm: </label>
                    <select id="arm-select" onChange={handleArmChange}>
                        <option value="">--Select an arm--</option>
                        {uniqueArms.map((arm) => (
                            <option key={arm} value={arm}>{arm}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedArm && (
                <div style={{ marginTop: '20px' }}>
                    {createScatterPlot(plotData1, plotData2, selectedArm)}
                </div>
            )}
        </div>
    );
}
