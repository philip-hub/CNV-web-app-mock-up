import React, { useState } from 'react';
import Plot from 'react-plotly.js';

export default function Home() {
    const [plotData, setPlotData] = useState(null);

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

        const calculateResponse = await fetch('/api/calculate', {
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
        console.log('API result:', result); // Debugging line

        const vafData = result.vafData;
        const coverageData = result.coverageData;

        if (!vafData || !coverageData) {
            console.error('Invalid data structure from API');
            return;
        }

        const chromosomes = [...new Set(vafData.map(d => d.arm))];

        const vafPlots = chromosomes.map((chrom, index) => ({
            x: vafData.filter(d => d.arm === chrom).map(d => d.Pos),
            y: vafData.filter(d => d.arm === chrom).map(d => d.v),
            type: 'scatter',
            mode: 'markers',
            name: chrom,
            marker: { size: 3 },
            xaxis: 'x' + (index + 1),
            yaxis: 'y1'
        }));

        const coveragePlots = chromosomes.map((chrom, index) => ({
            x: coverageData.filter(d => d.arm === chrom).map(d => d.Pos),
            y: coverageData.filter(d => d.arm === chrom).map(d => d.lcv),
            type: 'scatter',
            mode: 'markers',
            name: chrom,
            marker: { size: 3 },
            xaxis: 'x' + (index + 1),
            yaxis: 'y1'
        }));

        const layout = {
            title: 'Vaf Score vs Position',
            height: 600, // Adjust height as needed
            showlegend: true,
            grid: { rows: 1, columns: chromosomes.length, pattern: 'independent' },
            xaxis: { title: 'Position', automargin: true },
            yaxis: { title: 'Vaf Score', automargin: true }
        };

        const layout2 = {
            title: 'Coverage Score vs Position',
            height: 600, // Adjust height as needed
            showlegend: true,
            grid: { rows: 1, columns: chromosomes.length, pattern: 'independent' },
            xaxis: { title: 'Position', automargin: true },
            yaxis: { title: 'Coverage Score', automargin: true }
        };

        setPlotData({ vafPlots, coveragePlots, layout, layout2 });
    };

    return (
        <div>
            <h1>Upload File</h1>
            <input type="file" onChange={handleFileUpload} />
            {plotData && (
                <div>
                    <Plot
                        data={plotData.vafPlots}
                        layout={plotData.layout}
                        useResizeHandler
                        style={{ width: '100%', height: '100%' }}
                    />
                    <Plot
                        data={plotData.coveragePlots}
                        layout={plotData.layout2}
                        useResizeHandler
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            )}
        </div>
    );
}
