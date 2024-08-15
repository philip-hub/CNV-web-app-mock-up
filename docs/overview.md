# Project Overview

This project is a web application designed to analyze Copy Number Variation (CNV) data across multiple samples. It provides users with the ability to upload files, process data, and visualize the results using heatmaps and scatter plots. The application is built with Next.js and React, and it leverages various APIs and components to handle data processing and visualization.

## Key Components and Files

The project is divided into several key components, each responsible for a specific aspect of the application's functionality. Below is an overview of these components, along with the corresponding documentation files that should be consulted when updating or modifying the scripts.

### 1. **File Upload Handling**
   - **Relevant File**: `upload.js`
   - **Description**: This file handles the uploading of TSV files to the server. It uses the `multer` library to manage file storage in the `uploads/` directory.
   - **Documentation**: Refer to `upload.js` documentation for details on file upload processing, error handling, and API response structure.

### 2. **Multi-File Data Processing**
   - **Relevant File**: `multicalc.js`
   - **Description**: This file processes the uploaded TSV files, parsing and structuring the data for use in heatmaps and scatter plots. It ensures that the necessary columns are present and extracts unique samples and chromosomal arms.
   - **Documentation**: Consult the `multicalc.js` documentation for information on file parsing, data validation, and the format of the data returned to the frontend.

### 3. **Single-File Data Processing**
   - **Relevant File**: `calculate.js`
   - **Description**: Similar to `multicalc.js`, this file processes data for single-file CNV analysis. It reads the file content, performs necessary calculations, and returns the data in a format suitable for visualization.
   - **Documentation**: Refer to `calculate.js` documentation for details on the calculations performed and the structure of the returned data.

### 4. **Multi-File CNV Analysis Interface**
   - **Relevant File**: `multi.js`
   - **Description**: This React component provides the user interface for multi-file CNV analysis. It includes functionality for uploading files, managing file order, and rendering heatmaps and scatter plots.
   - **Documentation**: See the `multi.js` documentation for details on state management, heatmap generation, and scatter plot creation.

### 5. **Single-File CNV Analysis Interface**
   - **Relevant File**: `single.js`
   - **Description**: This React component handles the single-file CNV analysis interface, enabling users to upload a single TSV file and visualize the data through interactive plots.
   - **Documentation**: Check the `single.js` documentation for information on plot configurations, data handling, and user interactions.

## Updating the Scripts

When updating the scripts, it's important to identify the component or functionality you want to modify. The documentation files listed above provide detailed information on how each key component works, what data it processes, and how it interacts with other parts of the application.

- **If modifying the file upload process**: Consult `upload.js`.
- **If processing or validating TSV data**: Consult `multicalc.js` or `calculate.js` depending on whether you're working with multi-file or single-file analysis.
- **If updating the user interface or visualization components**: Refer to `multi.js` for multi-file analysis or `single.js` for single-file analysis.

By following the appropriate documentation, you can ensure that your updates are made accurately and efficiently.
