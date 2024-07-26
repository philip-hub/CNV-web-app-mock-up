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
            xaxis: `x${index + 1}`,
            yaxis: `y${index + 1}`
        }));

        console.log(chromosomes.length)
        const plotWidth = chromosomes.length * 300; // Adjust the multiplier as needed

        const vafLayout = {
            title: 'Vaf Score vs Position',
            showlegend: false,
            width: plotWidth,
            height: 600, // Adjust the height if needed
            grid: {
                rows: 1,
                columns: chromosomes.length,
                pattern: 'independent'
            },
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            }
        };

        const coverageLayout = {
            title: 'Coverage Score vs Position',
            showlegend: false,
            width: plotWidth,
            height: 600, // Adjust the height if needed
            grid: {
                rows: 1,
                columns: chromosomes.length,
                pattern: 'independent'
            },
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            }
        };

        chromosomes.forEach((chrom, index) => {
            vafLayout[`xaxis${index + 1}`] = { title: `Position (${chrom})` };
            vafLayout[`yaxis${index + 1}`] = { title: 'Vaf Score' };
            coverageLayout[`xaxis${index + 1}`] = { title: `Position (${chrom})` };
            coverageLayout[`yaxis${index + 1}`] = { title: 'Coverage Score' };
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
