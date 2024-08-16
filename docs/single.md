# Single.js Functionality Overview

This document provides a detailed explanation of the `single.js` file, which is a React component responsible for handling the single-file CNV (Copy Number Variation) analysis in the web application. The file utilizes dynamic imports, state management, and interaction with an API to upload, process, and visualize genomic data.

## Key Features and Workflow

### 1. **File Upload and API Interaction**
   - The `handleFileUpload` function handles the file upload process. When a user selects a file, it is uploaded to the server using the `/api/upload` endpoint.
   - The server stores the uploaded file and returns the file path. This file path is then sent to the `/api/calculate` endpoint, which processes the data and returns the results.

### 2. **State Management**
   - The component uses multiple `useState` hooks to manage the state of various elements:
     - `plotData1`, `plotData2`, `plotData3`, `plotData4`, `plotData5`: Store the data for different plots.
     - `clickedArm`, `highlightedArm`, `clickedArmData`: Manage the state of the selected arm (chromosomal region) in the plots.
     - `arm7ColorMapping`, `cloneMapping`, `Y3Mapping`, `X3Mapping`, `mMapping`, `dmMapping`, `dcnMapping`: Store various mappings related to chromosomal arms, clones, and calculated values.
     - `lcv0`, `mavg`, `lcvMapping`, `s0Mapping`, `startMMapping`, `middleMMapping`, `endMMapping`: Store specific computed values related to CNV analysis.

### 3. **Plotting and Visualization**
   - **Dynamic Plotting:** The `Plot` component is dynamically imported using `dynamic` from Next.js to ensure the plot rendering happens on the client side.
   - **Scatter Plots:** Several scatter plots are created to visualize the genomic data. These include:
     - **Plot 1:** Coverage plot visualizing the log2 of coverage values.
     - **Plot 2:** VAF (Variant Allele Frequency) plot.
     - **Plot 3:** AI vs CN scatter plot.
     - **Plot 4:** VAF CDF (Cumulative Distribution Function).
     - **Plot 5:** Coverage CDF.
   - **Combined Plot:** While Plots 1 and 2 look like they into a single layout for easier comparison, they actually are not. This has no impact on the code and can be deleted.

### 4. **Interaction with Plots**
   - Users can interact with the plots, selecting different chromosomal arms. When a user clicks on a plot, the `handlePlotClick` function captures the event, identifies the clicked arm, and updates the relevant state variables (`clickedArm`, `clickedArmData`).

### 5. **Control Panel for Analysis**
   - The control panel allows users to update reference values and toggle the selection of chromosomal arms. It includes functions such as `handleCheckAll`, `handleUncheckAll`, and `handleUpdateRef` to manage user interactions with the data.

### 6. **Color and Shape Annotations**
   - **Color Mapping:** Chromosomal arms are color-coded based on their clone types, as specified in `arm7ColorMapping`.
   - **Annotations and Shapes:** The function `createAnnotationsAndShapes` generates labels and lines on the plots to help users identify and compare chromosomal arms.

### 7. **Mathematical Calculations and Updates**
   - **Standard Deviation and Averaging:** `calculateLcv0ForCheckedArms`  perform average lcv0 calculations needed for accurate plotting. `standardDeviation` is not yet implemented as it is needed for dcn updates which is not implemented yet.
   - **Dynamic Updates:** The plots and calculations can be dynamically updated based on user interaction, specifically through the `handleUpdateRef` function.

### 8. **Rendering and Layout**
   - The layout of the plots is managed to ensure they are centered and properly aligned, with specific configurations for margins, axis labels, and plot sizes.

### 9. **Styling and User Interface**
   - The component uses CSS modules (`Home.module.css`) for styling. This includes custom styles for the control panel, buttons, file upload sections, and plot containers.

### 10. **Error Handling**
   - The component includes basic error handling, logging errors to the console if file uploads or API requests fail.

## Conclusion

The `single.js` file is a comprehensive React component designed to handle the entire workflow of uploading, processing, and visualizing CNV data in a single-file analysis scenario. It combines dynamic data handling with interactive plots and a user-friendly control panel, making it a robust tool for genomic analysis.


# Detailed Code Explanations:

\# single.js Function Documentation This document provides a detailed explanation of each function present in the \`single.js\` file, which handles the single-file CNV (Copy Number Variation) analysis in the web application.

Main Component: \`Home\`
------------------------

### Overview

The \`Home\` component is the central piece of the application, responsible for managing file uploads, processing data, and displaying the results in various plots.

### 1\. \`toggleControlBar\`

    
    const toggleControlBar = () => {
        setIsOpen(!isOpen);
    }
    

*   **Purpose**: Toggles the visibility of the control panel.
*   **How it works**: This function toggles the \`isOpen\` state between \`true\` and \`false\`, showing or hiding the control panel.

### 2\. \`handleFileUpload\`

    
    const handleFileUpload = async (event) => { ... }
    

*   **Purpose**: Handles the upload and processing of the selected file.
*   **How it works**:
    *   Extracts the file from the input event.
    *   Uploads the file using the \`/api/upload\` endpoint.
    *   Once uploaded, the file path is sent to \`/api/calculate\` for processing.
    *   The processed data is then used to update the state variables (\`plotData1\`, \`plotData2\`, etc.).

### 3\. \`applyColorMapping\`

    
    const applyColorMapping = (plotData) => { ... }
    

*   **Purpose**: Applies color mapping to the plot data based on the \`arm7ColorMapping\`.
*   **How it works**:
    *   Iterates through the plot data and assigns colors to each data point based on its chromosomal arm.

### 4\. \`createAnnotationsAndShapes\`

    
    const createAnnotationsAndShapes = (plotData, uniqueArmValues) => { ... }
    

*   **Purpose**: Generates annotations and shapes for plot visualization.
*   **How it works**:
    *   Creates labels and lines for the plot to indicate the positions of chromosomal arms.
    *   Uses \`middleMMapping\` for positioning annotations on the plot.

### 5\. \`createCoverageLines\`

    
    const createCoverageLines = (mValues, startMMapping, endMMapping) => { ... }
    

*   **Purpose**: Creates lines on the plot representing coverage data.
*   **How it works**:
    *   Iterates through the mappings and generates lines that represent the coverage information for each arm.
    *   These lines are added to the plot as shapes.

### 6\. \`createVafLines\`

    
    const createVafLines = (aiValues, startMMapping, endMMapping) => { ... }
    

*   **Purpose**: Creates lines representing Variant Allele Frequency (VAF) on the plot.
*   **How it works**:
    *   Similar to \`createCoverageLines\`, this function generates lines for VAF based on the \`aiValues\` and mappings.
    *   These lines are used to visualize the spread of VAF data on the plot.

### 7\. \`createMathFunctionLines\`

    
    const createMathFunctionLines = (kValues) => { ... }
    

*   **Purpose**: Creates lines and annotations for mathematical functions on the plot.
*   **How it works**:
    *   Generates function lines based on the array \`kValues\`.
    *   Each function (f1, g1, f2, g2, etc.) is mapped to a set of lines and annotated appropriately.

### 8\. \`handlePlotClick\`

    
    const handlePlotClick = (event) => { ... }
    

*   **Purpose**: Handles user interactions when clicking on a plot.
*   **How it works**:
    *   Captures the clicked point on the plot.
    *   Retrieves and updates the clicked arm's data (such as CN, AI, M values) to display it in the control panel.
    *   Highlights the clicked arm in the plot.

### 9\. \`updatePlotDataWithHighlight\`

    
    const updatePlotDataWithHighlight = (plotData, plotDataRef) => { ... }
    

*   **Purpose**: Updates plot data to highlight specific chromosomal arms.
*   **How it works**:
    *   Adjusts the color, size, and opacity of the plot data based on whether an arm is highlighted.

### 10\. \`handleCheckboxChange\`

    
    const handleCheckboxChange = (arm) => { ... }
    

*   **Purpose**: Toggles the selection status of a chromosomal arm.
*   **How it works**:
    *   Updates the \`cloneMapping\` for the selected arm between \`DIP\` and \`Not REF\`.

### 11\. \`calculateLcv0ForCheckedArms\`

    
    const calculateLcv0ForCheckedArms = (checkedArms) => { ... }
    

*   **Purpose**: Calculates the LCV0 value for the selected (checked) arms.
*   **How it works**:
    *   Filters the data for arms marked as \`DIP\`.
    *   Sums the LCV values and divides by the total length to compute the average LCV0.

### 12\. \`deepCopy\`

    
    function deepCopy(obj) { ... }
    

*   **Purpose**: Creates a deep copy of an object.
*   **How it works**:
    *   Uses \`JSON.parse\` and \`JSON.stringify\` to ensure a deep copy, including nested objects.

### 13\. \`standardDeviation\`

    
    function standardDeviation(values) { ... }
    

*   **Purpose**: Calculates the sample standard deviation of an array.
*   **How it works**:
    *   Computes the mean of the values.
    *   Calculates the variance and returns the square root of the variance as the standard deviation.

### 14\. \`handleUpdateRef\`

    
    const handleUpdateRef = () => { ... }
    

*   **Purpose**: Updates reference values for M0 and LCV0 based on user selection.
*   **How it works**:
    *   Recalculates LCV0 and M0 for selected arms.
    *   Updates the plots accordingly, recalculating the Y values for the plots based on the new LCV0 and M0.

### 15\. \`handleCheckAll\`

    
    const handleCheckAll = () => { ... }
    

*   **Purpose**: Marks all chromosomal arms as selected (\`DIP\`).
*   **How it works**:
    *   Iterates through all arms and sets their \`cloneMapping\` to \`DIP\`.

### 16\. \`handleUncheckAll\`

    
    const handleUncheckAll = () => { ... }
    

*   **Purpose**: Unchecks all chromosomal arms, marking them as \`Not REF\`.
*   **How it works**:
    *   Iterates through all arms and sets their \`cloneMapping\` to \`Not REF\`.

### 17\. \`DynamicPlot\`

    
    const DynamicPlot = ({ scatterPlot, layout, onClick }) => { ... }
    

*   **Purpose**: Dynamically loads and renders a Plotly plot.
*   **How it works**:
    *   Uses \`React.useEffect\` to dynamically import \`react-plotly.js\`.
    *   Renders the plot with the provided data, layout, and click handler.

Conclusion
----------

The \`single.js\` file is a comprehensive React component designed to manage the entire workflow of single-file CNV analysis. It includes functionality for file uploads, data processing, plotting, and user interaction. The file makes extensive use of React hooks for state management and Next.js for dynamic imports and API interactions.

#Plot Info


Scatter Plot and Layout Documentation
=====================================

Plot 1: Coverage Plot
---------------------

### Scatter Plot

The `scatterPlot1` object represents the coverage plot. It visualizes the log2 of the median coverage divided by the reference coverage for each arm.

*   **X-Axis:** Chromosomal positions.
*   **Y-Axis:** Log2 of the median coverage divided by the reference coverage (`log2(med/ref)`).
*   **Markers:** The markers are colored based on the chromosomal arm using `arm7ColorMapping`.
*   **Custom Data:** Stores arm data for each marker to be used for tooltips and interactions.

### Layout

The `layout1` object defines the appearance and configuration of the coverage plot.

*   **Title:** "Coverage Plot/Vaf Plot".
*   **Size:** Width of 1800px and height of 150px.
*   **X-Axis:** No tick labels, tick angle is 90 degrees.
*   **Y-Axis:** Shows tick labels with the title "log2(med/ref)".
*   **Shapes and Annotations:** Adds vertical lines and labels for chromosomal arms.

Plot 2: Vaf Plot
----------------

### Scatter Plot

The `scatterPlot2` object represents the Variant Allele Frequency (Vaf) plot.

*   **X-Axis:** Chromosomal positions.
*   **Y-Axis:** Vaf score for each arm.
*   **Markers:** The markers are colored based on the chromosomal arm using `arm7ColorMapping`.
*   **Custom Data:** Stores arm data for each marker to be used for tooltips and interactions.

### Layout

The `layout2` object defines the appearance and configuration of the Vaf plot.

*   **Size:** Width of 1800px and height of 170px.
*   **X-Axis:** No tick labels, tick angle is 90 degrees.
*   **Y-Axis:** Shows tick labels with the title "Vaf Score".
*   **Shapes and Annotations:** Adds vertical lines and labels for chromosomal arms, as well as lines representing Vaf intervals.

Combined Layout for Plot 1 and Plot 2
-------------------------------------

### Layout

The `layout_combined` object combines Plot 1 and Plot 2 into a single layout with independent axes.

*   **Grid Layout:** 2 rows and 1 column.
*   **Size:** Width of 1600px and height of 500px.
*   **X-Axis:** Configured separately for each plot, with no tick labels.
*   **Y-Axis:** The first plot shows "log2(median/ref)" and the second plot shows "Vaf Score".
*   **Shapes and Annotations:** Combines shapes and annotations from both plots.

Plot 3: AI vs CN Scatter Plot
-----------------------------

### Scatter Plot

The `scatterPlot3` object represents the scatter plot of Allele Imbalance (AI) versus Copy Number (CN).

*   **X-Axis:** Scaled CN values.
*   **Y-Axis:** AI values for each arm.
*   **Markers:** The markers are colored based on the chromosomal arm using `arm7ColorMapping`.
*   **Custom Data:** Stores arm data for each marker to be used for tooltips and interactions.

### Layout

The `layout3` object defines the appearance and configuration of the AI vs CN scatter plot.

*   **Title:** "Scatter Plot of AI vs CN".
*   **Size:** Width and height of 500px (square layout).
*   **X-Axis:** Shows tick labels with the title "CN".
*   **Y-Axis:** Shows tick labels with the title "AI".
*   **Shapes and Annotations:** Adds function lines and annotations to visualize mathematical relationships.

Plot 4: Vaf CDF
---------------

### Scatter Plot

The `scatterPlot4` object represents the Cumulative Distribution Function (CDF) of Vaf scores.

*   **X-Axis:** Vaf score values.
*   **Y-Axis:** CDF values for each arm.
*   **Markers:** The markers are colored based on the chromosomal arm using `arm7ColorMapping`.
*   **Custom Data:** Stores arm data for each marker to be used for tooltips and interactions.

### Layout

The `layout4` object defines the appearance and configuration of the Vaf CDF plot.

*   **Title:** "Vaf Score CDF".
*   **Size:** Width and height of 500px (square layout).
*   **X-Axis:** Shows tick labels with the title "X4".
*   **Y-Axis:** Shows tick labels with the title "Y4".

Plot 5: Coverage CDF
--------------------

### Scatter Plot

The `scatterPlot5` object represents the Cumulative Distribution Function (CDF) of coverage scores.

*   **X-Axis:** Coverage score values.
*   **Y-Axis:** CDF values for each arm.
*   **Markers:** The markers are colored based on the chromosomal arm using `arm7ColorMapping`.
*   **Custom Data:** Stores arm data for each marker to be used for tooltips and interactions.

### Layout

The `layout5` object defines the appearance and configuration of the Coverage CDF plot.

*   **Title:** "Coverage Score CDF".
*   **Size:** Width and height of 500px (square layout).
*   **X-Axis:** Shows tick labels with the title "X5".
*   **Y-Axis:** Shows tick labels with the title "Y5".