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

        const plotData = result.plotData;

        if (!plotData) {
            console.error('Invalid data structure from API');
            return;
        }

        // Plot data
        const scatterPlot = {
            x: plotData.map(d => d.x),
            y: plotData.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 5 },
            name: 'Scatter Plot'
        };

        const layout = {
            title: 'Scatter Plot of x and y',
            showlegend: false,
            width: 800,
            height: 600,
            margin: {
                l: 40,
                r: 40,
                b: 60,
                t: 40,
                pad: 0
            },
            xaxis: {
                title: 'x',
                showticklabels: true
            },
            yaxis: {
                title: 'y',
                showticklabels: true
            }
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
