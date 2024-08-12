import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { filePath } = req.body;

    if (!filePath) {
        console.error('File path is required');
        return res.status(400).json({ message: 'File path is required' });
    }

    const absoluteFilePath = path.join(process.cwd(), 'uploads', path.basename(filePath));

    try {
        const fileContent = await fs.readFile(absoluteFilePath, 'utf8');
        console.log('File content read successfully');

        const jsonData = JSON.parse(fileContent);

        const cloneColorMapping = {
          'LOSS': 'blue',
          'LDIP': 'cyan',
          'DIP': 'green',
          'FDIP': 'pink',
          'RDIP': 'pink',
          'DUP': 'orange',
          'HDUP': 'olive',
          'LOH': 'brown',
          'GAIN': 'red',
          'GAIN+': 'purple'
        };

        const uniqueArm1Values = [...new Set(jsonData.map(group => group.arm))];
        const uniqueArm2Values = [...new Set(jsonData.map(group => group.arm))];
        const uniqueArm3Values = [...new Set(jsonData.map(group => group.arm))];
        const uniqueArm4Values = [...new Set(jsonData.map(group => group.arm))];
        const uniqueArm5Values = [...new Set(jsonData.map(group => group.arm))];
        const uniqueArm6Values = [...new Set(jsonData.map(group => group.arm))];
        const uniqueArm7Values = [...new Set(jsonData.map(group => group.arm))];

        const armNames = jsonData.map(group => group.arm);
        console.log('Array of arm names:', armNames);

        // Calculate lcv0 for DIP clones
        const calculatelcv0 = (data) => {
          const mValues = data.filter(group => group.clone === 'DIP').map(group => group.m);
          return mValues.reduce((acc, value) => acc + value, 0) / mValues.length;
        };

        const lcv0 = calculatelcv0(jsonData);
        console.log('Average m value (lcv0):', lcv0);

        // Generate plot data functions
        const generatePlot3Data = (data, lcv0) => {
          return data.map(group => ({
            x: group.ai,
            y: (2 * group.m) / lcv0,
            arm: group.arm
          }));
        };

        const generatePlotData = (data, xKey, yKey, transformX = x => x) => {
          const plotData = [];
          data.forEach(group => {
            const xArray = group[xKey];
            const yArray = group[yKey];
            if (Array.isArray(xArray) && Array.isArray(yArray) && xArray.length === yArray.length) {
              for (let i = 0; i < xArray.length; i++) {
                plotData.push({
                  x: transformX(xArray[i], lcv0),
                  y: yArray[i],
                  arm: group.arm
                });
              }
            } else {
              console.error(`Mismatched lengths in group with arm ${group.arm}`);
            }
          });
          return plotData;
        };

        // Generate and log all plot data
        const plotData3 = generatePlot3Data(jsonData, lcv0);
        //console.log('plot3Data:', plot3Data);

        const plotData2 = generatePlotData(jsonData, 'v', 'posv');
        //console.log('plot2Data:', plot2Data);

        const plotData1 = generatePlotData(jsonData, 'lcv', 'poslcv', (lcv) => Math.log2(lcv / lcv0));
        //console.log('plot1Data:', plot1Data);

        const plotData4 = generatePlotData(jsonData, 'vq', 'vq', x => x);
        //console.log('plot4Data:', plot4Data);

        const plotData5 = generatePlotData(jsonData, 'lcvq', 'lcvq', x => x);
        //console.log('plot5Data:', plot5Data);

        const mValues = jsonData.map(group => group.m ? parseFloat(group.m) : null);
        const arm6Values = jsonData.map(group => group.arm);

        // Creating mappings
        const cloneMapping = jsonData.reduce((acc, group) => {
          if (group.arm && group.clone) {
            acc[group.arm] = group.clone;
          }
          return acc;
        }, {});

        const Y3Mapping = jsonData.reduce((acc, group) => {
          if (group.arm) {
            acc[group.arm] = 2*(parseFloat(group.m))/lcv0;
          }
          return acc;
        }, {});

        const X3Mapping = jsonData.reduce((acc, group) => {
          if (group.arm) {
            acc[group.arm] = group.ai;
          }
          return acc;
        }, {});

        const mMapping = jsonData.reduce((acc, group) => {
          if (group.arm) {
            acc[group.arm] = parseFloat(group.m);
          }
          return acc;
        }, {});

        const dmMapping = jsonData.reduce((acc, group) => {
          if (group.arm) {
            acc[group.arm] = parseFloat(group.dm);
          }
          return acc;
        }, {});

        // Function to calculate the sample standard deviation of an array
        function standardDeviation(values) {
          const mean = values.reduce((acc, value) => acc + value, 0) / values.length;
          const variance = values.reduce((acc, value) => acc + ((value - mean) ** 2), 0) / (values.length - 1); // Sample std dev
          return Math.sqrt(variance);
        }
        
        // Calculate the standard deviation for all m values
        const stdDevM = standardDeviation(mValues);
        console.log('Standard Deviation of all m values:', stdDevM);
        
        const dcnMapping = jsonData.reduce((acc, group) => {
          if (group.arm && group.dm !== undefined && lcv0 !== undefined) {
            acc[group.arm] = (2 * group.dm) / lcv0 + (2 * group.m * stdDevM) / (lcv0 ** 2);
            console.log(`Calculated dcn for arm ${group.arm}: ${acc[group.arm]}`);
          } else {
            console.warn(`Missing values for arm ${group.arm} - dm: ${group.dm}, lcv0: ${lcv0}`);
          }
          return acc;
        }, {});


        const arm7ColorMapping = jsonData.reduce((acc, group) => {
          if (group.arm && group.clone) {
            const color = cloneColorMapping[group.clone];
            if (color) {
              acc[group.arm] = color;
            } else {
              console.warn(`No color mapping found for clone ${group.clone} on arm7 ${group.arm7}`);
            }
          }
          return acc;
        }, {});

       
        console.log('Final dcnMapping:', dcnMapping);
        console.log('mValues:', mValues);
        console.log('arm6Values:', arm6Values);
        console.log('cloneMapping:', cloneMapping);
        console.log('Y3Mapping:', Y3Mapping);
        console.log('X3Mapping:', X3Mapping);
        console.log('mMapping:', mMapping);
        console.log('dmMapping:', dmMapping);
        console.log('dcnMapping:', dcnMapping);
        console.log('arm7ColorMapping:', arm7ColorMapping);


        console.log('Unique Arm 1 Values:', uniqueArm1Values);
        console.log('Unique Arm 2 Values:', uniqueArm2Values);
        console.log('Unique Arm 3 Values:', uniqueArm3Values);
        console.log('Unique Arm 4 Values:', uniqueArm4Values);
        console.log('Unique Arm 5 Values:', uniqueArm5Values);
        console.log('Unique Arm 6 Values:', uniqueArm6Values);
        console.log('Unique Arm 7 Values:', uniqueArm7Values);
        
        // Send the response with all calculated values
        res.status(200).json({
            plotData1, uniqueArm1Values,
            plotData2, uniqueArm2Values,
            plotData3, uniqueArm3Values,
            plotData4, uniqueArm4Values,
            plotData5, uniqueArm5Values,
            mValues, arm6Values,
            arm7ColorMapping, cloneMapping,
            Y3Mapping, X3Mapping,
            mMapping, dmMapping, dcnMapping
        });

    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
