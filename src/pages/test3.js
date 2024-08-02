import React, { useState } from 'react';

export default function Home() {
    const [plotData1, setPlotData1] = useState(null);
    const [plotData2, setPlotData2] = useState(null);

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

        const { plotData1, uniqueArm1Values, plotData2, uniqueArm2Values } = result;

        if (!plotData1 || !plotData2) {
            console.error('Invalid data structure from API');
            return;
        }

        const createAnnotationsAndShapes = (plotData, uniqueArmValues) => {
            const armPositions = {};
            plotData.forEach(d => {
                if (!armPositions[d.arm] || d.x < armPositions[d.arm].x) {
                    armPositions[d.arm] = { x: d.x, y: d.y };
                }
            });

            const annotations = uniqueArmValues.map(arm => {
                if (!armPositions[arm]) {
                    console.error(`No position found for arm: ${arm}`);
                    return null;
                }
                return {
                    x: armPositions[arm].x,
                    y: -0.1,  // Place closer to the axis
                    xref: 'x',
                    yref: 'paper',
                    text: arm,
                    showarrow: false,
                    xanchor: 'center',
                    yanchor: 'top',
                    font: {
                        size: 10
                    },
                    textangle: 270  // Rotate the text 180 degrees
                };
            }).filter(annotation => annotation !== null);

            const shapes = uniqueArmValues.map(arm => {
                if (!armPositions[arm]) {
                    console.error(`No position found for arm: ${arm}`);
                    return null;
                }
                return {
                    type: 'line',
                    x0: armPositions[arm].x,
                    y0: 0,
                    x1: armPositions[arm].x,
                    y1: 1,
                    xref: 'x',
                    yref: 'paper',
                    line: {
                        color: 'rgba(0, 0, 0, 0.3)',
                        width: 1
                    }
                };
            }).filter(shape => shape !== null);

            return { annotations, shapes };
        };

        // Plot data for the first plot
        const scatterPlot1 = {
            x: plotData1.map(d => d.x),
            y: plotData1.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 3, color: 'rgba(0, 255, 0, 0.5)' },
            name: 'Coverage Plot 1'
        };

        const layout1 = {
            title: 'Coverage Plot 1',
            showlegend: false,
            width: 1700,  // Increase width
            height: 300,  // Decrease height
            margin: {
                l: 40,
                r: 40,
                b: 120,
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
            ...createAnnotationsAndShapes(plotData1, uniqueArm1Values)
        };

        // Plot data for the second plot
        const scatterPlot2 = {
            x: plotData2.map(d => d.x),
            y: plotData2.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 3, color: 'rgba(0, 0, 255, 0.5)' },
            name: 'Coverage Plot 2'
        };

        const layout2 = {
            title: 'Coverage Plot 2',
            showlegend: false,
            width: 1700,  // Increase width
            height: 300,  // Decrease height
            margin: {
                l: 40,
                r: 40,
                b: 120,
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
            ...createAnnotationsAndShapes(plotData2, uniqueArm2Values)
        };

        setPlotData1({ scatterPlot: scatterPlot1, layout: layout1 });
        setPlotData2({ scatterPlot: scatterPlot2, layout: layout2 });
    };

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />
            {plotData1 && plotData2 && (
                <div>
                    <DynamicPlot scatterPlot={plotData1.scatterPlot} layout={plotData1.layout} />
                    <DynamicPlot scatterPlot={plotData2.scatterPlot} layout={plotData2.layout} />
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
