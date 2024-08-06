import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
    const [plotData1, setPlotData1] = useState(null);
    const [plotData2, setPlotData2] = useState(null);
    const [plotData3, setPlotData3] = useState(null);
    const [plotData4, setPlotData4] = useState(null);
    const [plotData5, setPlotData5] = useState(null);
    const [clickedArm, setClickedArm] = useState(null); // State to hold the clicked arm name
    const [highlightedArm, setHighlightedArm] = useState(null); // State to hold the highlighted arm for coloring
    const [arm7ColorMapping, setArm7ColorMapping] = useState({}); // State to hold arm7ColorMapping
    const [cloneMapping, setCloneMapping] = useState({}); // State to hold cloneMapping

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

        const { plotData1, uniqueArm1Values, plotData2, uniqueArm2Values, plotData3, uniqueArm3Values, plotData4, uniqueArm4Values, plotData5, uniqueArm5Values, mValues, arm6Values, arm7ColorMapping, cloneMapping } = result;

        if (!plotData1 || !plotData2 || !plotData3 || !plotData4 || !plotData5) {
            console.error('Invalid data structure from API');
            return;
        }

        setArm7ColorMapping(arm7ColorMapping); // Set arm7ColorMapping state

        setCloneMapping(cloneMapping); // Set cloneMapping state

        const applyColorMapping = (plotData) => {
            return plotData.map(d => ({
                ...d,
                color: arm7ColorMapping[d.arm],
                customdata: d.arm  // Add arm to customdata
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

        const createLines = (mValues, arm6Values) => {
            const lines = [];
            mValues.forEach((m, index) => {
                const arm = arm6Values[index];
                const xValues = plotData1.filter(d => d.arm === arm).map(d => d.x);
                if (xValues.length > 10) {
                    const x0 = Math.min(...xValues);
                    const x1 = Math.max(...xValues);
                    lines.push({
                        type: 'line',
                        x0: x0,
                        y0: m,
                        x1: x1,
                        y1: m,
                        xref: 'x',
                        yref: 'y',
                        line: {
                            color: 'red',
                            width: 2
                        }
                    });
                }
            });
            return lines;
        };

        // Plot data for the first plot
        const scatterPlot1 = {
            x: coloredPlotData1.map(d => d.x),
            y: coloredPlotData1.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 4, color: coloredPlotData1.map(d => d.color) },
            name: 'Coverage Plot',
            customdata: coloredPlotData1.map(d => d.customdata) // Add customdata to plot
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
                showticklabels: false,  // Show x-axis numbers
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
            shapes: createAnnotationsAndShapes(coloredPlotData1, uniqueArm1Values).shapes.concat(createLines(mValues, arm6Values)),
            annotations: createAnnotationsAndShapes(coloredPlotData1, uniqueArm1Values).annotations
        };

        // Plot data for the second plot
        const scatterPlot2 = {
            x: coloredPlotData2.map(d => d.x),
            y: coloredPlotData2.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 4, color: coloredPlotData2.map(d => d.color) },
            name: 'Vaf Plot',
            customdata: coloredPlotData2.map(d => d.customdata) // Add customdata to plot
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
                showticklabels: false,  // Show x-axis numbers
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
            shapes: createAnnotationsAndShapes(coloredPlotData2, uniqueArm2Values).shapes,
            annotations: createAnnotationsAndShapes(coloredPlotData2, uniqueArm2Values).annotations
        };

        // Plot data for the third plot
        const scatterPlot3 = {
            x: coloredPlotData3.map(d => d.x),
            y: coloredPlotData3.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 8, color: coloredPlotData3.map(d => d.color) },
            name: 'AI vs CN',
            customdata: coloredPlotData3.map(d => d.customdata) // Add customdata to plot
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
            name: 'Vaf Score CDF',
            customdata: coloredPlotData4.map(d => d.customdata) // Add customdata to plot
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
            name: 'Coverage Score CDF',
            customdata: coloredPlotData5.map(d => d.customdata) // Add customdata to plot
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

    const handlePlotClick = (event) => {
        if (event.points && event.points.length > 0) {
            const clickedPoint = event.points[0];
            const clickedArm = clickedPoint.customdata;
            const cloneName = cloneMapping[clickedArm] || 'Unknown clone'; // Get the clone name
            console.log(clickedArm); // Log the clicked arm name to the console
            setClickedArm(`${clickedArm} ${cloneName}`); // Set the clicked arm name and clone name
            setHighlightedArm(clickedArm); // Set the highlighted arm for coloring
        }
    };

    const updatePlotDataWithHighlight = (plotData, plotDataRef) => {
        if (!arm7ColorMapping) {
            return plotData;
        }
        return {
            ...plotData,
            scatterPlot: {
                ...plotData.scatterPlot,
                marker: {
                    ...plotData.scatterPlot.marker,
                    color: plotData.scatterPlot.customdata.map(arm =>
                        arm === highlightedArm ? 'yellow' : arm7ColorMapping[arm]
                    ),
                    size: plotData.scatterPlot.customdata.map(arm =>
                        arm === highlightedArm ? 7 : (plotDataRef === plotData4 || plotDataRef === plotData5 ? 3 : (plotDataRef === plotData1 || plotDataRef === plotData2 ? 4 : 8))
                    )
                }
            }
        };
    };


    const colors = [
        { label: 'LOSS', className: styles.LOSS },
        { label: 'LDIP', className: styles.LDIP },
        { label: 'DIP', className: styles.DIP },
        { label: 'FDIP', className: styles.FDIP },
        { label: 'RDIP', className: styles.RDIP },
        { label: 'DUP', className: styles.DUP },
        { label: 'HDUP', className: styles.HDUP },
        { label: 'LOH', className: styles.LOH },
        { label: 'GAIN', className: styles.GAIN },
        { label: 'GAIN+', className: styles.GAINPLUS },
    ];
    

    return (
        <div>
            <h1>Upload your TSV file</h1>
            <input type="file" onChange={handleFileUpload} />



            {plotData1 && plotData2 && plotData3 && plotData4 && plotData5 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div>
                        <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData3, plotData3).scatterPlot} layout={plotData3.layout} onClick={handlePlotClick} />
                    </div>
                    <div>
                        <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData1, plotData1).scatterPlot} layout={plotData1.layout} onClick={handlePlotClick} />
                        <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData2, plotData2).scatterPlot} layout={plotData2.layout} onClick={handlePlotClick} />
                    </div>
                    <div style={{ gridColumn: 'span 1' }}>
                        <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData4, plotData4).scatterPlot} layout={plotData4.layout} onClick={handlePlotClick} />
                    </div>
                    <div style={{ gridColumn: 'span 1' }}>
                        <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData5, plotData5).scatterPlot} layout={plotData5.layout} onClick={handlePlotClick} />
                    </div>
                </div>
            )}
            {clickedArm && <h1>Clicked Arm: {clickedArm}</h1>} {/* Render the clicked arm name */}
            <div className={styles.grid}>
            {colors.map((color, index) => (
                <div key={index} className={`${styles.gridItem} ${color.className}`}>
                    {color.label}
                </div>
            ))}
        </div>
        
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
