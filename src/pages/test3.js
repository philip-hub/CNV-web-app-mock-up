import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });




export default function Home() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleControlBar = () => {
        setIsOpen(!isOpen);}
    
    const [plotData1, setPlotData1] = useState(null);
    const [plotData2, setPlotData2] = useState(null);
    const [plotData3, setPlotData3] = useState(null);
    const [plotData4, setPlotData4] = useState(null);
    const [plotData5, setPlotData5] = useState(null);
    const [clickedArm, setClickedArm] = useState(null); 
    const [highlightedArm, setHighlightedArm] = useState(null); 
    const [arm7ColorMapping, setArm7ColorMapping] = useState({}); 
    const [cloneMapping, setCloneMapping] = useState({});
    const [Y3Mapping, setY3Mapping] = useState({}); 
    const [X3Mapping, setX3Mapping] = useState({});
    const [mMapping, setMMapping] = useState({});  
    const [dmMapping, setDmMapping] = useState({}); 
    const [dcnMapping, setDcnMapping] = useState({}); 
    const [clickedArmData, setClickedArmData] = useState({}); 
    const [PlotCombined, setPlotCombined] = useState(null);
    const [lcv0, setLCV0] = useState(null);
    const [mavg, setMAvg] = useState(null);
    const [lcvMapping, setLcvMapping] = useState(null);
    const [coloredPlotData1, setColoredPlotData1] = useState(null);
    const [coloredPlotData3, setColoredPlotData3] = useState(null);
    const [s0Mapping, setS0Mapping] = useState(null);
    const [startMMapping, setStartMMapping] = useState(null);
    const [ middleMMapping, setMiddleMMapping] = useState(null);
    const [endMMapping, setEndMMapping] = useState(null);


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
        console.log('API result:', result); 

        const { plotData1, uniqueArm1Values, plotData2, uniqueArm2Values, plotData3, uniqueArm3Values, plotData4, uniqueArm4Values, plotData5, uniqueArm5Values, mValues, arm6Values, arm7ColorMapping, cloneMapping, Y3Mapping, X3Mapping, mMapping, dmMapping, dcnMapping, lcv0, mavg, lcvMapping, s0Mapping, startMMapping, middleMMapping, endMMapping } = result;

        if (!plotData1 || !plotData2 || !plotData3 || !plotData4 || !plotData5) {
            console.error('Invalid data structure from API');
            return;
        }


        const applyColorMapping = (plotData) => {
            return plotData.map(d => ({
                ...d,
                color: arm7ColorMapping[d.arm],
                customdata: d.arm  
            }));
        };


        const coloredPlotData1 = applyColorMapping(plotData1);
        const coloredPlotData2 = applyColorMapping(plotData2);
        const coloredPlotData3 = applyColorMapping(plotData3);
        const coloredPlotData4 = applyColorMapping(plotData4);
        const coloredPlotData5 = applyColorMapping(plotData5);
    

        setArm7ColorMapping(arm7ColorMapping); 
        setCloneMapping(cloneMapping); 
        setY3Mapping(Y3Mapping);     
        setX3Mapping(X3Mapping);      
        setMMapping(mMapping);         
        setDmMapping(dmMapping);      
        setDcnMapping(dcnMapping);     
        setLCV0(lcv0)
        setMAvg(mavg)
        setLcvMapping(lcvMapping)
        setS0Mapping(s0Mapping)
        setStartMMapping(startMMapping)
        setMiddleMMapping(middleMMapping)
        setEndMMapping(endMMapping)
        setColoredPlotData1(coloredPlotData1);
        setColoredPlotData3(coloredPlotData3);


        console.log('startMMapping:', startMMapping);
        console.log('endMMapping:', endMMapping)

        console.log(lcv0)
        console.log(mavg)

        const createAnnotationsAndShapes = (plotData, uniqueArmValues) => {
            let annotations = [];

            for (let arm of uniqueArm1Values) {
                let middleX = middleMMapping[arm];  
                
                // label settings for how the arm labels are veiw
                annotations.push({
                    x: middleX,
                    y: -0.1,  
                    xref: 'x',
                    yref: 'paper',
                    text: arm,
                    showarrow: false,
                    xanchor: 'center',
                    yanchor: 'top',
                    font: {
                        size: 10
                    },
                    textangle: 270  // Rotate the text 180 degrees for readability
                });
            }


            const armPositions = {};
            plotData.forEach(d => {
                if (!armPositions[d.arm] || d.x < armPositions[d.arm].x) {
                    armPositions[d.arm] = { x: d.x, y: d.y };
                }
            });

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

        const createLines = (mValues, startMMapping, endMMapping) => {
            const lines = [];
            console.log('createLines called'); 
            
            if (!startMMapping || !endMMapping) {
                console.error('startMMapping or endMMapping is undefined or null');
                return lines; 
            }
        
            Object.keys(startMMapping).forEach((arm, index) => {
          
                const m = mValues[index];
                const x0 = startMMapping[arm];
                const x1 = endMMapping[arm];

                console.log(`Arm: ${arm} X0:${x0} X1:${x1} m ${m}`);
        
        
                if (x0 === undefined) {
                    console.error(`startMMapping is missing a value for arm: ${arm}`);
                }
                if (x1 === undefined) {
                    console.error(`endMMapping is missing a value for arm: ${arm}`);
                }
        
                if (x0 !== undefined && x1 !== undefined && m !== undefined) {
                    lines.push({
                        type: 'line',
                        x0: x0,
                        y0: m - mavg,
                        x1: x1,
                        y1: m - mavg,
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


        // plot 1 coverage
        const scatterPlot1 = {
            x: coloredPlotData1.map(d => d.x),
            y: coloredPlotData1.map(d => (Math.log2(d.y/(lcv0)))),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 1, color: coloredPlotData1.map(d => d.color) },
            name: 'Coverage Plot',
            customdata: coloredPlotData1.map(d => d.customdata), 
            line: {
                color: 'transparent',  
                width: .5 
            },

        };

        const layout1 = {
            title: 'Coverage Plot',
            showlegend: false,
            width: 1800, 
            height: 150,  
            margin: {
                l: 40,
                r: 40,
                b: 45,
                t: 30,
                pad: 0
            },
            xaxis: {
                title: '',
                showticklabels: false,
                tickangle: 90,
                tickfont: {
                    size: 10
                },
                range: [Math.min(...coloredPlotData1.map(d => d.x)), Math.max(...coloredPlotData1.map(d => d.x))]
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
            shapes: createAnnotationsAndShapes(coloredPlotData1, uniqueArm1Values).shapes.concat(createLines(mValues, startMMapping,endMMapping)),
            annotations: createAnnotationsAndShapes(coloredPlotData1, uniqueArm1Values).annotations
        };

        // plot 2 vaf
        const scatterPlot2 = {
            x: coloredPlotData2.map(d => d.x),
            y: coloredPlotData2.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 1, color: coloredPlotData2.map(d => d.color) },
            name: 'Vaf Plot',
            customdata: coloredPlotData2.map(d => d.customdata), 
            line: {
                color: 'transparent',  
                width: 1 
            },
        };

        const layout2 = {
            title: 'Vaf Plot',
            showlegend: false,
            width: 1800,  
            height: 150, 
            margin: {
                l: 40,
                r: 40,
                b: 45,
                t: 30,
                pad: 0
            },
            xaxis: {
                title: '',
                showticklabels: false,  
                tickangle: 90,
                tickfont: {
                    size: 10
                },
                range: [Math.min(...coloredPlotData2.map(d => d.x)), Math.max(...coloredPlotData2.map(d => d.x))] 
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
        
        const plot_1_2_data = [scatterPlot1, scatterPlot2];

        const layout_combined = {
            grid: {rows: 2, columns: 1, pattern: 'independent'}, // 2 rows, 1 column layout
            width: 1600,  
            height: 500,  
            margin: {
                l: 40,
                r: 40,
                b: 40,
                t: 40,
                pad: 0
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            xaxis: {
                title: '',
                showticklabels: false,  
                tickangle: 90,
                tickfont: {
                    size: 10
                },
                domain: [0, 1],  
                anchor: 'y1'
            },
            xaxis2: {
                title: '',
                showticklabels: false,  
                tickangle: 90,
                tickfont: {
                    size: 10
                },
                domain: [0, 1],
                anchor: 'y2'
            },
            yaxis: {
                title: 'log2(median/ref)',
                showticklabels: true,
                tickfont: {
                    size: 10
                }
            },
            yaxis2: {
                title: 'Vaf Score',
                showticklabels: true,
                tickfont: {
                    size: 10
                }
            },
            shapes: createAnnotationsAndShapes(coloredPlotData1, uniqueArm1Values).shapes.concat(createLines(mValues, startMMapping,endMMapping)),
            annotations: createAnnotationsAndShapes(coloredPlotData1, uniqueArm1Values).annotations.concat(createAnnotationsAndShapes(coloredPlotData2, uniqueArm2Values).annotations)
        };
        //plot 3 cn vs ai
        const scatterPlot3 = {
            x: coloredPlotData3.map(d => ((2*d.x)/mavg)),
            y: coloredPlotData3.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 8, color: coloredPlotData3.map(d => d.color) },
            name: 'AI vs CN',
            customdata: coloredPlotData3.map(d => d.customdata) 
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

        // plot 4 vaf cdf
        const scatterPlot4 = {
            x: coloredPlotData4.map(d => d.x),
            y: coloredPlotData4.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 3, color: coloredPlotData4.map(d => d.color), opacity: 1 },
            name: 'Vaf Score CDF',
            customdata: coloredPlotData4.map(d => d.customdata) 
        };

        const layout4 = {
            title: 'Vaf Score CDF',
            showlegend: false,
            width: 500,
            height: 500, 
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

        //plot 5 coverage cdf
        const scatterPlot5 = {
            x: coloredPlotData5.map(d => d.x),
            y: coloredPlotData5.map(d => d.y),
            type: 'scatter',
            mode: 'markers',
            marker: { size: 3, color: coloredPlotData5.map(d => d.color), opacity: 1 },
            name: 'Coverage Score CDF',
            customdata: coloredPlotData5.map(d => d.customdata) 
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
        setPlotCombined({scatterPlot: plot_1_2_data, layout: layout_combined});
    };

    const handlePlotClick = (event) => {
        if (event.points && event.points.length > 0) {
            const clickedPoint = event.points[0];
            const clickedArm = clickedPoint.customdata;
            const cloneName = cloneMapping[clickedArm] || 'Unknown clone';
            console.log(clickedArm); 
            setClickedArm(`${clickedArm} ${cloneName}`);
            setHighlightedArm(clickedArm); //highlights it yellow

            //look at the clicked values
            setClickedArmData({
                CN: X3Mapping[clickedArm] || 'N/A',
                AI: Y3Mapping[clickedArm] || 'N/A',
                M: mMapping[clickedArm] || 'N/A',
                dm: dmMapping[clickedArm] || 'N/A',
                dcn: dcnMapping[clickedArm] || 'N/A'
            });
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
                        arm === highlightedArm ? 'gold' : arm7ColorMapping[arm]
                    ),
                    size: plotData.scatterPlot.customdata.map(arm =>
                        arm === highlightedArm ? 9 : (plotDataRef === plotData4 || plotDataRef === plotData5 ? 3 : (plotDataRef === plotData1 || plotDataRef === plotData2 ? .5 : (plotDataRef === plotData3 ? 10 : 2)))
                    ),
                    opacity: plotData.scatterPlot.customdata.map(arm =>
                        arm === highlightedArm ? 1 : (plotDataRef === plotData4 || plotDataRef === plotData5 ? 0.1 : 1)
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

    const handleCheckboxChange = (arm) => {
        setCloneMapping((prevMapping) => ({
            ...prevMapping,
            [arm]: prevMapping[arm] === 'DIP' ? 'Not REF' : 'DIP',
        }));
    };

    const calculateLcv0ForCheckedArms = (checkedArms) => {
        const filteredData = checkedArms
            .map(arm => ({
                clone: cloneMapping[arm],
                lcv: lcvMapping[arm]
            }))
            .filter(group => group.clone === 'DIP' && group.lcv !== undefined);
    
        const totalSum = filteredData
            .map(group => group.lcv.reduce((acc, value) => acc + value, 0)) 
            .reduce((acc, sum) => acc + sum, 0); 
    
        const totalLength = filteredData
            .map(group => group.lcv.length) 
            .reduce((acc, length) => acc + length, 0);
    
        return totalSum / totalLength; 

    }

    const handleUpdateRef = () => {
        const checkedArms = Object.keys(cloneMapping).filter(arm => cloneMapping[arm] === 'DIP');
        
        let oldLcv0 = lcv0;
        let oldMavg = mavg;

        if (checkedArms.length === 0) {
            console.error('Cannot divide by zero fwen');
            return;
        }

        const newLcv0 = calculateLcv0ForCheckedArms(checkedArms);
   
        const mValuesForCheckedArms = checkedArms
            .map(arm => mMapping[arm])
            .filter(mValue => mValue !== undefined);
    
        if (mValuesForCheckedArms.length === 0) {
            console.error('No m values found for checked arms. Check rAI or calculate.js');
            return;
        }
    
        const newMavg = mValuesForCheckedArms.reduce((sum, mValue) => sum + mValue, 0) / mValuesForCheckedArms.length;
    
        setMAvg(newMavg);
        setLCV0(newLcv0);
    
        console.log(`Updated M0: ${newMavg}`);
        console.log(`Updated lcv0: ${newLcv0}`);
    
        if (oldMavg !== newMavg) {

        const updatedLayout1 = {
                ...originalPlotData1.layout,
                // shapes: updatedShapesPlot1
            };

        const updatedPlotData1 = {
                ...originalPlotData1,
                scatterPlot: {
                    ...originalPlotData1.scatterPlot,
                    y: coloredPlotData1.map(d => (Math.log2(d.y/(newLcv0))))
                },
                layout: updatedLayout1
        };
            
            
        const updatedPlotData3 = {
                ...plotData3,
                scatterPlot: {
                    ...plotData3.scatterPlot,
                    x: coloredPlotData3.map(d => ((2*d.x)/newMavg))
                }
        };
            
     
        console.log("Original Plot1:",originalPlotData1.scatterPlot.y);
        console.log("Updated Plot1:",updatedPlotData1.scatterPlot.y);
        console.log("Original Plot3:",plotData3.scatterPlot.x)
        console.log("Updated Plot3:",updatedPlotData3.scatterPlot.x);
            
        setPlotData1(updatedPlotData1);
        setPlotData3(updatedPlotData3);

        }

    }
    
    const handleCheckAll = () => {
        const updatedMapping = Object.keys(cloneMapping).reduce((acc, arm) => {
            acc[arm] = 'DIP';
            return acc;
        }, {});
        setCloneMapping(updatedMapping);
    };

    const handleUncheckAll = () => {
        const updatedMapping = Object.keys(cloneMapping).reduce((acc, arm) => {
            acc[arm] = 'Not REF';
            return acc;
        }, {});
        setCloneMapping(updatedMapping);
    };


    return (
        <div className={styles.container}>
    
            <div className={`${styles.controlBar} ${isOpen ? styles.open : ''}`}>
                <h2>Control Bar</h2>
                <p>Some controls and settings go here.</p>
                <h4>For now these are here</h4>
                <div className={styles.chromosomeSelection}>
                    {Object.keys(cloneMapping).map((arm, index) => (
                        <div key={index} className={styles.chromosomeArm}>
                            <label htmlFor={`chromosome-arm-${index}`}>
                                {arm.toUpperCase().replace('CHR', '')} S0 : {s0Mapping[arm] || 'N/A'}
                            </label>
                            <input
                                type="checkbox"
                                id={`chromosome-arm-${index}`}
                                name={`chromosome-arm-${index}`}
                                checked={cloneMapping[arm] === 'DIP'}
                                onChange={() => handleCheckboxChange(arm)}
                            />
                        </div>
                    ))}
                </div>
                <button className={styles.updateButton} onClick={handleCheckAll}>
                    Check All
                </button>
                <button className={styles.updateButton} onClick={handleUncheckAll}>
                    Uncheck All
                </button>
    
                <button className={styles.updateButton} onClick={handleUpdateRef}>
                    Update Ref
                </button>
            </div>
    
            <div className={`${styles.content} ${isOpen ? styles.shifted : ''}`}>
                <button className={styles.toggleButton} onClick={toggleControlBar}>
                    {isOpen ? 'Close' : 'Open'} Control Panel
                </button>
    
                <div className={styles.header}>
                    <h1>Upload your JSON file</h1>
                    <input type="file" className={styles.fileUpload} onChange={handleFileUpload} />
                    <div className={styles.grid}>
                        {colors.map((color, index) => (
                            <div key={index} className={`${styles.gridItem} ${color.className}`}>
                                {color.label}
                            </div>
                        ))}
                    </div>
                </div>
    
                {plotData1 && plotData2 && plotData3 && plotData4 && plotData5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                            <div className={styles.plotContainer}>
                                <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData1, plotData1).scatterPlot} layout={plotData1.layout} onClick={handlePlotClick} />
                            </div>
                            <div className={styles.plotContainer}>
                                <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData2, plotData2).scatterPlot} layout={plotData2.layout} onClick={handlePlotClick} />
                            </div>
                        </div>
    
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData3, plotData3).scatterPlot} layout={plotData3.layout} onClick={handlePlotClick} />
                            <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData4, plotData4).scatterPlot} layout={plotData4.layout} onClick={handlePlotClick} />
                            <DynamicPlot scatterPlot={updatePlotDataWithHighlight(plotData5, plotData5).scatterPlot} layout={plotData5.layout} onClick={handlePlotClick} />
                        </div>
                    </div>
                )}
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