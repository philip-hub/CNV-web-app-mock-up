multicalc.js Functionality Overview
===================================

This document provides a detailed explanation of the `multicalc.js` file, which processes TSV files containing CNV (Copy Number Variation) data across multiple samples. The file reads, parses, and structures the data for use in heatmaps and scatter plots in the web application.

Overview
--------

The `multicalc.js` file is an API route handler in a Next.js application that handles the processing of uploaded TSV files. It reads the file, parses the content, checks for required columns, and then formats the data to be used in visualizations like heatmaps and scatter plots.

### Key Components and Workflow

### 1\. Importing Dependencies

    import { promises as fs } from 'fs';
    import path from 'path';
    import Papa from 'papaparse';

*   **Purpose**: These imports bring in the necessary modules for file system operations (`fs`), file path manipulation (`path`), and CSV/TSV parsing (`Papa` from `papaparse`).

### 2\. Request Handling

    export default async function handler(req, res) { ... }

*   **Purpose**: Handles incoming HTTP requests to the API endpoint.
*   **How it works**:
    *   Checks that the request method is `POST`.
    *   Extracts the `filePath` from the request body.
    *   If the method is not `POST` or if `filePath` is missing, it returns an error response.

### 3\. Reading the File

    const absoluteFilePath = path.join(process.cwd(), 'uploads', path.basename(filePath));
    const fileContent = await fs.readFile(absoluteFilePath, 'utf8');

*   **Purpose**: Reads the content of the uploaded TSV file.
*   **How it works**:
    *   Constructs the absolute path to the file in the `uploads/` directory.
    *   Reads the file content asynchronously and stores it as a string.

### 4\. Parsing the File Content

    const parsedData = Papa.parse(fileContent, {
        header: true,
        delimiter: '\t'
    });

*   **Purpose**: Parses the TSV file content into a structured JSON format.
*   **How it works**:
    *   Uses `Papa.parse` to parse the file content.
    *   The `header: true` option ensures that the first row of the file is used as the header.
    *   The `delimiter: '\t'` option specifies that the file is tab-separated.

### 5\. Validating Required Columns

    const requiredColumns = ['ai', 'cn', 'arm', 'sample', 'clone', 'filename'];
    
    for (const column of requiredColumns) {
        if (!data[0].hasOwnProperty(column)) {
            console.error(`Required column "${column}" not found`);
            return res.status(400).json({ message: `Required column "${column}" not found` });
        }
    }

*   **Purpose**: Ensures that the necessary columns are present in the uploaded file.
*   **How it works**:
    *   Iterates over a list of required columns (`ai`, `cn`, `arm`, `sample`, `clone`, `filename`).
    *   Checks if each column exists in the parsed data.
    *   If any column is missing, returns an error response.

### 6\. Structuring the Data for Plots

#### Creating Plot Data

    const plotData1 = data.map(row => ({
        sample: row.sample,
        arm: row.arm,
        cn: parseFloat(row.cn),
        filename: row.filename,
    }));
    
    const plotData2 = data.map(row => ({
        sample: row.sample,
        arm: row.arm,
        ai: parseFloat(row.ai),
        filename: row.filename,
    }));

*   **Purpose**: Prepares the data for generating heatmaps and scatter plots.
*   **How it works**:
    *   Creates `plotData1` for Copy Number (CN) values and `plotData2` for Allele Imbalance (AI) values.
    *   Each entry includes the sample, arm, CN or AI value, and filename.

#### Extracting Unique Samples and Arms

    const uniqueSamples = [...new Set(data.map(row => row.sample))];
    const uniqueArms = [...new Set(data.map(row => row.arm))];

*   **Purpose**: Identifies the unique samples and chromosomal arms in the dataset.
*   **How it works**:
    *   Uses a `Set` to filter out duplicate samples and arms, ensuring each appears only once in the `uniqueSamples` and `uniqueArms` arrays.

#### Mapping Filenames to Samples

    const filenameMapping = data.reduce((acc, row) => {
        acc[row.sample] = row.filename;
        return acc;
    }, {});

*   **Purpose**: Maps each sample to its corresponding filename.
*   **How it works**:
    *   Iterates over the data, creating a dictionary where each sample is linked to its filename.

### 7\. Sending the Response

    res.status(200).json({ plotData1, plotData2, uniqueSamples, uniqueArms, filenameMapping });

*   **Purpose**: Sends the structured data back to the frontend.
*   **Data Included**:
    *   `plotData1`: Data for the CN heatmap.
    *   `plotData2`: Data for the AI heatmap.
    *   `uniqueSamples`: List of unique samples.
    *   `uniqueArms`: List of unique chromosomal arms.
    *   `filenameMapping`: Mapping of samples to filenames.

Conclusion
----------

The `multicalc.js` file processes TSV files containing CNV data for multiple samples. It ensures that the required columns are present, parses the data, and structures it for use in heatmaps and scatter plots. The file plays a crucial role in preparing data for visualization in the CNV analysis web application.