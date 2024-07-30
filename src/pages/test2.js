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

        const concatenatePositions = (data) => {
            let globalPositions = [];
            let startPositions = {};
            let currentPosition = 0;

            const chromosomes = [...new Set(data.map(d => d.arm))];

            chromosomes.forEach(chrom => {
                const chromData = data.filter(d => d.arm === chrom);
                chromData.forEach(d => {
                    globalPositions.push({
                        arm: chrom,
                        Pos: currentPosition + d.Pos,
                        value: d.v || d.lcv
                    });
                });
                startPositions[chrom] = currentPosition;
                currentPosition += chromData.length;
            });

            return { globalPositions, startPositions, chromosomes };
        };

        const vafProcessedData = concatenatePositions(vafData);
        const coverageProcessedData = concatenatePositions(coverageData);

        // VAF Plot
        const vafPlot = {
            x: vafProcessedData.globalPositions.map(d => d.Pos),
            y: vafProcessedData.globalPositions.map(d => d.value),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 2 },
            name: 'VAF'
        };

        // Coverage Plot
        const coveragePlot = {
            x: coverageProcessedData.globalPositions.map(d => d.Pos),
            y: coverageProcessedData.globalPositions.map(d => d.value),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 2 },
            name: 'Coverage'
        };

        const vafLayout = {
            title: 'VAF Scores vs Position',
            showlegend: false,
            width: 1200,
            height: 600,
            margin: {
                l: 40,
                r: 40,
                b: 60,
                t: 40,
                pad: 0
            },
            font: {
                size: 10
            },
            xaxis: {
                title: 'Position',
                showticklabels: true
            },
            yaxis: {
                title: 'VAF Score',
                showticklabels: true
            },
            shapes: vafProcessedData.chromosomes.map(chrom => ({
                type: 'line',
                x0: vafProcessedData.startPositions[chrom],
                y0: 0,
                x1: vafProcessedData.startPositions[chrom],
                y1: 1,
                line: {
                    color: 'grey',
                    width: 1,
                    dash: 'dot'
                }
            })),
            annotations: vafProcessedData.chromosomes.map(chrom => ({
                x: vafProcessedData.startPositions[chrom],
                y: 1.05,
                xref: 'x',
                yref: 'paper',
                text: chrom,
                showarrow: false
            }))
        };

        const coverageLayout = {
            title: 'Coverage Scores vs Position',
            showlegend: false,
            width: 1200,
            height: 600,
            margin: {
                l: 40,
                r: 40,
                b: 60,
                t: 40,
                pad: 0
            },
            font: {
                size: 10
            },
            xaxis: {
                title: 'Position',
                showticklabels: true
            },
            yaxis: {
                title: 'Coverage Score',
                showticklabels: true
            },
            shapes: coverageProcessedData.chromosomes.map(chrom => ({
                type: 'line',
                x0: coverageProcessedData.startPositions[chrom],
                y0: 0,
                x1: coverageProcessedData.startPositions[chrom],
                y1: 1,
                line: {
                    color: 'grey',
                    width: 1,
                    dash: 'dot'
                }
            })),
            annotations: coverageProcessedData.chromosomes.map(chrom => ({
                x: coverageProcessedData.startPositions[chrom],
                y: 1.05,
                xref: 'x',
                yref: 'paper',
                text: chrom,
                showarrow: false
            }))
        };

        setPlotData({ vafPlot, vafLayout, coveragePlot, coverageLayout });
    };

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />
            {plotData && (
                <div>
                    <DynamicPlot 
                        vafPlot={plotData.vafPlot} 
                        vafLayout={plotData.vafLayout} 
                        coveragePlot={plotData.coveragePlot} 
                        coverageLayout={plotData.coverageLayout} 
                    />
                </div>
            )}
        </div>
    );
}

const DynamicPlot = ({ vafPlot, vafLayout, coveragePlot, coverageLayout }) => {
    const [Plot, setPlot] = useState(null);

    React.useEffect(() => {
        import('react-plotly.js').then((Plotly) => {
            setPlot(() => Plotly.default);
        });
    }, []);

    if (!Plot) return null;

    return (
        <>
            <Plot data={[vafPlot]} layout={vafLayout} config={{ responsive: true }} />
            <Plot data={[coveragePlot]} layout={coverageLayout} config={{ responsive: true }} />
        </>
    );
};
