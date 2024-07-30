import React, { useState } from 'react';

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
            text: [],
            name: chrom,
            marker: { size: 2 },
            xaxis: `x${index + 1}`,
            yaxis: `y${index + 1}`
        }));

        const coveragePlots = chromosomes.map((chrom, index) => ({
            x: coverageData.filter(d => d.arm === chrom).map(d => d.Pos),
            y: coverageData.filter(d => d.arm === chrom).map(d => d.lcv),
            type: 'scatter',
            mode: 'markers',
            name: chrom,
            text: [],
            marker: { size: 2 },
            xaxis: `x${index + 1}`,
            yaxis: `y${index + 1}`
        }));

        const plotWidth = chromosomes.length * 150; // Adjust the multiplier as needed
        const plotHeight = 600;

        const vafLayout = {
            title: 'Vaf Score vs Position',
            showlegend: false,
            width: plotWidth,
            height: plotHeight, // Adjust the height if needed
            grid: {
                rows: 1,
                columns: chromosomes.length,
                pattern: 'independent'
            },
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                pad: 0 // Reduced padding to eliminate extra space
            },
            font: {
                size: 10
            }
        };

        const coverageLayout = {
            title: 'Coverage Score vs Position',
            showlegend: false,
            width: plotWidth,
            height: plotHeight, // Adjust the height if needed
            grid: {
                rows: 1,
                columns: chromosomes.length,
                pattern: 'independent'
            },
            margin: {
                l: 10,
                r: 10,
                b: 10,
                t: 10,
                pad: 0 // Reduced padding to eliminate extra space
            },
            font: {
                size: 10
            }
        };

        chromosomes.forEach((chrom, index) => {
            vafLayout[`xaxis${index + 1}`] = { title: `(${chrom})`, showticklabels: index === 0, domain: [(index / chromosomes.length), ((index + 1) / chromosomes.length) - 0.01] };
            vafLayout[`yaxis${index + 1}`] = { title: index === 0 ? 'Vaf Score' : '', showticklabels: index === 0, domain: [0, 1] };
            coverageLayout[`xaxis${index + 1}`] = { title: `(${chrom})`, showticklabels: index === 0, domain: [(index / chromosomes.length), ((index + 1) / chromosomes.length) - 0.01] };
            coverageLayout[`yaxis${index + 1}`] = { title: index === 0 ? 'Coverage Score' : '', showticklabels: index === 0, domain: [0, 1] };
        });

        setPlotData({ vafPlots, vafLayout, coveragePlots, coverageLayout });
    };

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />
            {plotData && (
                <div>
                    <DynamicPlot 
                        vafPlots={plotData.vafPlots} 
                        vafLayout={plotData.vafLayout} 
                        coveragePlots={plotData.coveragePlots} 
                        coverageLayout={plotData.coverageLayout} 
                    />
                </div>
            )}
        </div>
    );
}

const DynamicPlot = ({ vafPlots, vafLayout, coveragePlots, coverageLayout }) => {
    const [Plot, setPlot] = useState(null);

    React.useEffect(() => {
        import('react-plotly.js').then((Plotly) => {
            setPlot(() => Plotly.default);
        });
    }, []);

    if (!Plot) return null;

    return (
        <>
            <Plot data={vafPlots} layout={vafLayout} config={{ responsive: true }} />
            <Plot data={coveragePlots} layout={coverageLayout} config={{ responsive: true }} />
        </>
    );
};