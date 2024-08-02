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

        const { plotData, uniqueArm1Values } = result;

        if (!plotData) {
            console.error('Invalid data structure from API');
            return;
        }

        // Find the lowest x1 point for each arm1 value
        const arm1Positions = {};
        plotData.forEach(d => {
            if (!arm1Positions[d.arm1] || d.x < arm1Positions[d.arm1].x) {
                arm1Positions[d.arm1] = { x: d.x, y: d.y };
            }
        });

        // Create annotations for the x-axis
        const annotations = uniqueArm1Values.map(arm1 => ({
            x: arm1Positions[arm1].x,
            y: -0.2,  // Place below the axis
            xref: 'x',
            yref: 'paper',
            text: arm1,
            showarrow: false,
            xanchor: 'center',
            yanchor: 'top',
            font: {
                size: 10
            },
            textangle: 90  // Rotate the text vertically
        }));

        // Plot data
        const scatterPlot = {
            x: plotData.map(d => d.x),
            y: plotData.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 3, color: 'rgba(0, 255, 0, 0.5)' },
            name: 'Coverage Plot'
        };

        const layout = {
            title: 'Coverage Plot',
            showlegend: false,
            width: 1500,
            height: 400,
            margin: {
                l: 40,
                r: 40,
                b: 100,
                t: 40,
                pad: 0
            },
            xaxis: {
                title: '',
                showticklabels: false,  // Remove x-axis numbers
                tickangle: 90,
                tickfont: {
                    size: 10
                }
            },
            yaxis: {
                title: 'log2(median/ref)',
                showticklabels: true,
                tickfont: {
                    size: 10
                }
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            grid: {
                color: 'lightgray'
            },
            annotations: annotations
        };

        setPlotData({ scatterPlot, layout });
    };

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />
            {plotData && (
                <div>
                    <DynamicPlot 
                        scatterPlot={plotData.scatterPlot} 
                        layout={plotData.layout} 
                    />
                </div>
            )}
        </div>
    );
}

const DynamicPlot = ({ scatterPlot, layout }) => {
    const [Plot, setPlot] = useState(null);

    React.useEffect(() => {
        import('react-plotly.js').then((Plotly) => {
            setPlot(() => Plotly.default);
        });
    }, []);

    if (!Plot) return null;

    return (
        <Plot data={[scatterPlot]} layout={layout} config={{ responsive: true }} />
    );
};
