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

        //plot1data
        //plot3data
        //m values
        //Y3 mapping
        //X3 mapping
        //DCN mapping
        


        const plotData3 = jsonData.map(group => ({
            x: (2 * group.m) / lcv0,
            y: group.ai,
            arm: group.arm
          }));
    
    
          console.log('plot3Data:', plotData3);
    
          const plotData2 = [];
    
          console.log()
    
          jsonData.forEach(group => {
            const { v, posv, arm } = group;
          if (Array.isArray(v) && Array.isArray(posv) && v.length === posv.length) {
            for (let i = 0; i < v.length; i++) {
              plotData2.push({
                x: posv[i],
                y: v[i],
                arm: arm
              });
            }
          } else {
            console.error(`Mismatched lengths in group with arm ${arm}`);
          }
        });
    
          console.log('plot2Data:', plotData2);
    
    
          const plotData1 = [];
    
    
          jsonData.forEach(group => {
            const { lcv, poslcv, arm } = group;
          if (Array.isArray(lcv) && Array.isArray(poslcv) && lcv.length === poslcv.length) {
            for (let i = 0; i < lcv.length; i++) {
              plotData1.push({
                x: poslcv[i],
                y: Math.log2(lcv[i]/lcv0),
                arm: arm
              });
            }
          } else {
            console.error(`Mismatched lengths in group with arm ${arm}`);
          }
        });
          console.log('plot1Data:', plotData1);
    
        
          const plotData4 = [];
    
          jsonData.forEach(group => {
            const { vq, arm } = group;
            for (let i = 0; i < vq.length; i++) {
              plotData4.push({
                x: vq[i],
                y: i,
                arm: arm
              });
            }
        });
    
          console.log('plot4Data:', plotData4);
    
    
          const plotData5 = [];
    
          jsonData.forEach(group => {
            const { lcvq, arm } = group;
            for (let i = 0; i < lcvq.length; i++) {
              plotData5.push({
                x: lcvq[i],
                y: i,
                arm: arm
              });
            }
        });
    
          console.log('plot5Data:', plotData5);
    

        const mValues = jsonData.map(group => group.m ? parseFloat(group.m-lcv0) : null);
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
