import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '../components/NavBar';
import FileUpload from '../components/FileUpload';

// Dynamically import Plotly component with SSR disabled
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Test() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [results, setResults] = useState(null);

  const handleFileUpload = (data) => {
    setResults(data);
  };

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue) {
      router.push(`/${selectedValue}`);
    }
  };

  const renderPlot = () => {
    if (!results) {
      return null;
    }

    const x = results.map(item => item.arm);
    const y = results.map(item => item.log_ratio);
    const chromosomes = results.map(item => item.arm); // Assuming the arm property is used to distinguish chromosomes

    return (
      <Plot
        data={[
          {
            x: x,
            y: y,
            mode: 'markers',
            type: 'scatter',
            marker: {
              size: 2,
              color: chromosomes,
              colorscale: 'Viridis'
            },
            name: 'Log Ratio'
          }
        ]}
        layout={{
          title: 'Log Ratio',
          xaxis: {
            title: 'Genomic Position',
            tickvals: Array.from({ length: results.length }, (_, i) => i),
            ticktext: x
          },
          yaxis: {
            title: 'Log Ratio',
            range: [-2, 2]
          },
          shapes: [] // Initial empty shapes array for vertical lines
        }}
      />
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Test Page</title>
        <meta name="description" content="Welcome to the test page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar />
        <h1 className={styles.title}>
          Copy Number Analysis
        </h1>
        <p className={styles.description}>
          Upload the files and select analysis options
        </p>
        <FileUpload onUpload={handleFileUpload} />
        <div style={{ marginTop: '20px' }}>
          <select value={selectedOption} onChange={handleSelectionChange}>
            <option value="" disabled>Select Analysis Type</option>
            <option value="single">Single Sample Analysis</option>
            <option value="multi">Multifile Sample Analysis</option>
            <option value="timeseries">Timeseries Analysis</option>
            <option value="test">View Plot Test</option>
          </select>
        </div>
        {results && renderPlot()}
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/philip-hub/CNV-web-app-mock-up" target="_blank">Source Code</a>
      </footer>
    </div>
  );
}
