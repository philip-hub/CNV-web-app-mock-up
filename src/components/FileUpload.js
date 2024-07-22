import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('file', file);
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('File uploaded successfully');
    } else {
      alert('Failed to upload file');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.tsv',
    multiple: false
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a .tsv file here, or click to select a file</p>
    </div>
  );
};

export default FileUpload;
