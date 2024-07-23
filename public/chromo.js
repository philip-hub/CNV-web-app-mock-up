// Ensure this script is loaded only on the client side
if (typeof window !== "undefined") {
    document.addEventListener('DOMContentLoaded', () => {
      const plotLogRatio = document.getElementById('plotLogRatio');
      const plotAllFreq = document.getElementById('plotAllFreq');
  
      if (plotLogRatio) {
        Plotly.newPlot(plotLogRatio, [{
          x: [1, 2, 3, 4, 5],
          y: [1, 2, 3, 4, 5],
          type: 'scatter',
          mode: 'markers'
        }], {
          title: 'Log Ratio Plot'
        });
  
        plotLogRatio.on('plotly_click', (data) => {
          // Handle click event on plotLogRatio
          console.log('Log Ratio Plot clicked:', data.points[0]);
        });
      }
  
      if (plotAllFreq) {
        Plotly.newPlot(plotAllFreq, [{
          x: [1, 2, 3, 4, 5],
          y: [1, 2, 3, 4, 5],
          type: 'scatter',
          mode: 'markers'
        }], {
          title: 'B Allele Frequency Plot'
        });
  
        plotAllFreq.on('plotly_click', (data) => {
          // Handle click event on plotAllFreq
          console.log('B Allele Frequency Plot clicked:', data.points[0]);
        });
      }
    });
  }
  