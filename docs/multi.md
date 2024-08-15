multi.js Functionality Overview
===============================

This document provides a detailed explanation of the `multi.js` file, which is a React component that handles the multi-file CNV (Copy Number Variation) analysis in the web application. It enables users to upload a TSV file containing multiple samples and visualize the data through heatmaps and scatter plots.

Overview
--------

The `multi.js` file is a React component that uses various React hooks and external libraries such as `react-plotly.js` to provide an interactive interface for analyzing CNV data across multiple samples. It includes functionality for file upload, data processing, heatmap generation, and scatter plot creation.

### Key Components and Workflow

### 1\. Importing Dependencies

    import Head from 'next/head';
    import React, { useState, useEffect } from 'react';
    import dynamic from 'next/dynamic';
    import styles from '../styles/Home.module.css';
    import tableStyles from '../styles/DraggableTable.module.css';

*   **Purpose**: These imports bring in the necessary modules for building the component, including `next/head` for managing the document head, React hooks for state management, `next/dynamic` for dynamic imports, and CSS modules for styling.

### 2\. Setting Up State Variables

    const [plotData1, setPlotData1] = useState(null);
    const [plotData2, setPlotData2] = useState(null);
    const [uniqueSamples, setUniqueSamples] = useState([]);
    const [uniqueArms, setUniqueArms] = useState([]);
    const [selectedArm, setSelectedArm] = useState(null);
    const [filenameMapping, setFilenameMapping] = useState({});
    const [filenameOrder, setFilenameOrder] = useState([]);

*   **Purpose**: Initializes state variables to store plot data, unique sample and arm values, selected arm, and mappings for filenames and their order.
*   **How it works**: These state variables are updated dynamically based on user interactions and API responses.

### 3\. File Upload and Processing

#### File Upload Handler

    const handleFileUpload = async (event) => { ... }

*   **Purpose**: Handles the file upload process.
*   **How it works**:
    *   Captures the file selected by the user.
    *   Sends the file to the `/api/upload` endpoint using a `POST` request.
    *   Once the file is uploaded, it sends the file path to the `/api/multicalc` endpoint for processing.
    *   Receives the processed data, including plot data, unique samples, and unique arms, which are then stored in the state.

### 4\. Heatmap Generation

#### Creating Heatmap Data

    const createHeatmapData = (plotData, valueKey, valueLabel) => { ... }

*   **Purpose**: Prepares the data needed to generate heatmaps.
*   **How it works**:
    *   Iterates over the unique samples and arms to extract relevant data points.
    *   Populates arrays for the heatmap's X (arms), Y (samples), Z (values), and hover text.

#### Rendering Heatmaps

    const createHeatmapPlot = (data, title, colorscale, zmid = null) => { ... }

*   **Purpose**: Generates and renders a heatmap using Plotly.
*   **How it works**:
    *   Uses the `Plot` component from `react-plotly.js` to render a heatmap based on the provided data, title, and colorscale.
    *   Configures the plot layout, including axis titles, tick values, and plot height.

### 5\. Scatter Plot Creation

#### Creating Scatter Plot Data

    const createScatterPlot = (plotData1, plotData2, selectedArm) => { ... }

*   **Purpose**: Generates and renders a scatter plot for a selected arm.
*   **How it works**:
    *   Filters the plot data based on the selected arm.
    *   Extracts the `CN` (Copy Number) and `AI` (Allele Imbalance) values.
    *   Creates annotations to visualize the relationships between data points.
    *   Renders the scatter plot using the `Plot` component from `react-plotly.js`.

### 6\. User Interactions

#### Arm Selection

    const handleArmChange = (event) => { ... }

*   **Purpose**: Updates the selected arm based on user input.
*   **How it works**: Sets the selected arm state when the user selects an arm from the dropdown.

#### File Order Management

    const handleDragStart = (event, index) => { ... }
    const handleDrop = (event, index) => { ... }
    const handleUpdateOrder = () => { ... }

*   **Purpose**: Allows users to reorder the files by dragging and dropping rows in the table.
*   **How it works**:
    *   Captures the index of the file being dragged.
    *   Updates the file order when the file is dropped into a new position.
    *   Updates the `uniqueSamples` state based on the new order.

### 7\. Rendering the Component

**Purpose**: The component renders the entire user interface, including the file upload button, draggable file order table, heatmaps, and scatter plot.

**How it works**: The component conditionally renders elements based on the availability of plot data and user interactions.

Conclusion
----------

The `multi.js` file provides an interactive interface for analyzing CNV data across multiple samples. It handles file uploads, processes data on the server, and visualizes the results using heatmaps and scatter plots. The component is designed to be user-friendly, allowing for file reordering and dynamic selection of arms for scatter plot visualization.