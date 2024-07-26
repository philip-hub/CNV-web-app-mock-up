// components/PlotGraphs.js
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const groupDataByChromosome = (data) => {
    const groupedData = {};
    data.forEach(row => {
        const { arm, Pos, v, lcv } = row;
        const chrom = arm;
        if (!groupedData[chrom]) {
            groupedData[chrom] = { pos: [], v: [], lcv: [] };
        }
        groupedData[chrom].pos.push(Pos);
        groupedData[chrom].v.push(v);
        groupedData[chrom].lcv.push(lcv);
    });
    return groupedData;
};

const generateGraphData = (groupedData, yField) => {
    const graphData = [];
    Object.keys(groupedData).forEach(chrom => {
        const chromData = groupedData[chrom];
        graphData.push({
            x: chromData.pos,
            y: chromData[yField],
            mode: 'markers',
            name: chrom
        });
    });
    return graphData;
};

const PlotGraphs = ({ data }) => {
    const [vafData, setVafData] = useState([]);
    const [coverageData, setCoverageData] = useState([]);

    useEffect(() => {
        const groupedData = groupDataByChromosome(data);
        setVafData(generateGraphData(groupedData, 'v'));
        setCoverageData(generateGraphData(groupedData, 'lcv'));
    }, [data]);

    return (
        <div>
            <Plot
                data={vafData}
                layout={{
                    title: 'Vaf Score vs Position',
                    xaxis: { title: 'Position' },
                    yaxis: { title: 'Vaf Score' }
                }}
            />
            <Plot
                data={coverageData}
                layout={{
                    title: 'Coverage Score vs Position',
                    xaxis: { title: 'Position' },
                    yaxis: { title: 'Coverage Score' }
                }}
            />
        </div>
    );
};

export default PlotGraphs;
