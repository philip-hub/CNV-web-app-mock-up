import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import DraggableWindow from '../components/DraggableWindow';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const colorPalette = [
    '#377eb8', '#ff7f00', '#4daf4a', '#f781bf', '#a65628', 
    '#984ea3', '#999999', '#e41a1c', '#dede00', '#a6cee3',
    '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c',
    '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99'
];

export default function Home() {
    const [plotData1, setPlotData1] = useState(null);
    const [plotData2, setPlotData2] = useState(null);
    const [plotData3, setPlotData3] = useState(null);
    const [plotData4, setPlotData4] = useState(null);
    const [plotData5, setPlotData5] = useState(null);
    const [highlightedArm, setHighlightedArm] = useState(null);
    const [draggableWindowPosition, setDraggableWindowPosition] = useState(null);
    const [draggableWindowData, setDraggableWindowData] = useState(null);

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

        const { plotData1, uniqueArm1Values, plotData2, uniqueArm2Values, plotData3, uniqueArm3Values, plotData4, uniqueArm4Values, plotData5, uniqueArm5Values, mValues, arm6Values, arm7ColorMapping, cloneMapping, Y3Mapping, X3Mapping, mMapping, dmMapping, dcnMapping } = result;

        if (!plotData1 || !plotData2 || !plotData3 || !plotData4 || !plotData5) {
            console.error('Invalid data structure from API');
            return;
        }

        // Combine unique arms from all plots
        const allUniqueArms = [...new Set([...uniqueArm1Values, ...uniqueArm2Values, ...uniqueArm3Values, ...uniqueArm4Values, ...uniqueArm5Values])];

        // Create a color mapping for all unique arms
        const colorMapping = {};
        allUniqueArms.forEach((arm, index) => {
            colorMapping[arm] = arm7ColorMapping[arm] || colorPalette[index % colorPalette.length];
        });

        const applyColorMapping = (plotData) => {
            return plotData.map(d => ({
                ...d,
                color: colorMapping[d.arm]
            }));
        };

        const coloredPlotData1 = applyColorMapping(plotData1);
        const coloredPlotData2 = applyColorMapping(plotData2);
        const coloredPlotData3 = applyColorMapping(plotData3);
        const coloredPlotData4 = applyColorMapping(plotData4);
        const coloredPlotData5 = applyColorMapping(plotData5);

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
            x: coloredPlotData1.map(d => d.x),
            y: coloredPlotData1.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 4, color: coloredPlotData1.map(d => d.color) },
            name: 'Coverage Plot'
        };

        const layout1 = {
            title: 'Coverage Plot',
            showlegend: false,
            width: 1400,  // Decrease width
            height: 200,  // Decrease height
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
            ...createAnnotationsAndShapes(coloredPlotData1, uniqueArm1Values)
        };

        // Plot data for the second plot
        const scatterPlot2 = {
            x: coloredPlotData2.map(d => d.x),
            y: coloredPlotData2.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 4, color: coloredPlotData2.map(d => d.color) },
            name: 'Vaf Plot'
        };

        const layout2 = {
            title: 'Vaf Plot',
            showlegend: false,
            width: 1400,  // Decrease width
            height: 200,  // Decrease height
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
                title: 'Vaf Score',
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
            ...createAnnotationsAndShapes(coloredPlotData2, uniqueArm2Values)
        };

        // Plot data for the third plot
        const scatterPlot3 = {
            x: coloredPlotData3.map(d => d.x),
            y: coloredPlotData3.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 8, color: coloredPlotData3.map(d => d.color) },
            name: 'AI vs CN'
        };

        const layout3 = {
            title: 'Scatter Plot of AI vs CN',
            showlegend: false,
            width: 500,
            height: 500,  // Make it square
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 0
            },
            xaxis: {
                title: 'CN',
                tickfont: {
                    size: 10
                }
            },
            yaxis: {
                title: 'AI',
                tickfont: {
                    size: 10
                }
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            grid: {
                color: 'lightgray'
            }
        };

        // Plot data for the fourth plot
        const scatterPlot4 = {
            x: coloredPlotData4.map(d => d.x),
            y: coloredPlotData4.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 3, color: coloredPlotData4.map(d => d.color) },
            name: 'Vaf Score CDF'
        };

        const layout4 = {
            title: 'Vaf Score CDF',
            showlegend: false,
            width: 500,
            height: 500,  // Make it square
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 0
            },
            xaxis: {
                title: 'X4',
                tickfont: {
                    size: 10
                }
            },
            yaxis: {
                title: 'Y4',
                tickfont: {
                    size: 10
                }
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            grid: {
                color: 'lightgray'
            }
        };

        // Plot data for the fifth plot
        const scatterPlot5 = {
            x: coloredPlotData5.map(d => d.x),
            y: coloredPlotData5.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 3, color: coloredPlotData5.map(d => d.color) },
            name: 'Coverage Score CDF'
        };

        const layout5 = {
            title: 'Coverage Score CDF',
            showlegend: false,
            width: 500,
            height: 500,  // Make it square
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 0
            },
            xaxis: {
                title: 'X5',
                tickfont: {
                    size: 10
                }
            },
            yaxis: {
                title: 'Y5',
                tickfont: {
                    size: 10
                }
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            grid: {
                color: 'lightgray'
            }
        };

        setPlotData1({ scatterPlot: scatterPlot1, layout: layout1 });
        setPlotData2({ scatterPlot: scatterPlot2, layout: layout2 });
        setPlotData3({ scatterPlot: scatterPlot3, layout: layout3 });
        setPlotData4({ scatterPlot: scatterPlot4, layout: layout4 });
        setPlotData5({ scatterPlot: scatterPlot5, layout: layout5 });
    };

    const handlePlotClick = (arm, event, plotIndex) => {
        setHighlightedArm(arm);
        setDraggableWindowPosition({ x: event.clientX - 30, y: event.clientY + 10 });
        setDraggableWindowData({
            clickedArm: arm,
            cn: plotData3.scatterPlot.x[plotData3.scatterPlot.customdata.findIndex(d => d === arm)],
            ai: plotData3.scatterPlot.y[plotData3.scatterPlot.customdata.findIndex(d => d === arm)],
            m: mMapping[arm],
            dm: dmMapping[arm],
            dcn: dcnMapping[arm]
        });
    };

    const closeDraggableWindow = () => {
        setDraggableWindowData(null);
    };

    const updatePlotDataWithHighlight = (plotData) => {
        if (!highlightedArm) return plotData;

        return {
            ...plotData,
            scatterPlot: {
                ...plotData.scatterPlot,
                marker: {
                    ...plotData.scatterPlot.marker,
                    color: plotData.scatterPlot.customdata.map(arm =>
                        arm === highlightedArm ? 'yellow' : arm7ColorMapping[arm]
                    ),
                    opacity: plotData.scatterPlot.customdata.map(arm =>
                        arm === highlightedArm ? 1 : 0.2
                    ),
                    size: plotData.scatterPlot.marker.size
                }
            }
        };
    };

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />
            {plotData1 && plotData2 && plotData3 && plotData4 && plotData5 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div>
                        <DynamicPlot
                            scatterPlot={updatePlotDataWithHighlight(plotData3).scatterPlot}
                            layout={updatePlotDataWithHighlight(plotData3).layout}
                            onClick={(event) => handlePlotClick(event.points[0].customdata, event, 3)}
                        />
                    </div>
                    <div>
                        <DynamicPlot
                            scatterPlot={updatePlotDataWithHighlight(plotData1).scatterPlot}
                            layout={updatePlotDataWithHighlight(plotData1).layout}
                            onClick={(event) => handlePlotClick(event.points[0].customdata, event, 1)}
                        />
                        <DynamicPlot
                            scatterPlot={updatePlotDataWithHighlight(plotData2).scatterPlot}
                            layout={updatePlotDataWithHighlight(plotData2).layout}
                            onClick={(event) => handlePlotClick(event.points[0].customdata, event, 2)}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 1' }}>
                        <DynamicPlot
                            scatterPlot={updatePlotDataWithHighlight(plotData4).scatterPlot}
                            layout={updatePlotDataWithHighlight(plotData4).layout}
                            onClick={(event) => handlePlotClick(event.points[0].customdata, event, 4)}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 1' }}>
                        <DynamicPlot
                            scatterPlot={updatePlotDataWithHighlight(plotData5).scatterPlot}
                            layout={updatePlotDataWithHighlight(plotData5).layout}
                            onClick={(event) => handlePlotClick(event.points[0].customdata, event, 5)}
                        />
                    </div>
                </div>
            )}
            {draggableWindowData && (
                <DraggableWindow
                    position={draggableWindowPosition}
                    onClose={closeDraggableWindow}
                    data={draggableWindowData}
                />
            )}
        </div>
    );
}

const DynamicPlot = ({ scatterPlot, layout, onClick }) => {
    const [Plot, setPlot] = useState(null);

    React.useEffect(() => {
        import('react-plotly.js').then((Plotly) => {
            setPlot(() => Plotly.default);
        });
    }, []);

    if (!Plot) return null;

    return (
        <Plot data={[scatterPlot]} layout={layout} config={{ responsive: true }} onClick={onClick} />
    );
};
