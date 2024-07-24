import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onUpload }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      const filePath = `/uploads/${file.name}`;

      // Call the calculate API
      const calcResponse = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });

      if (!calcResponse.ok) {
        alert('Failed to calculate log ratios and NRMF');
      } else {
        const calcData = await calcResponse.json();
        onUpload(calcData);
      }
    } else {
      alert('Failed to upload file');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ border: '1px dashed black', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a .tsv file here, or click to select a file</p>
    </div>
  );
};

export default FileUpload;
