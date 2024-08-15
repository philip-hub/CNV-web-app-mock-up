upload.js Functionality Overview
================================

This document provides a detailed explanation of the `upload.js` file, which handles file uploads in the CNV (Copy Number Variation) analysis web application. The file leverages `multer` to manage file uploads and ensures that files are properly stored on the server.

Overview
--------

The `upload.js` file is an API route handler in a Next.js application. It handles the uploading of files from the client to the server, storing them in a specified directory, and then returning the file path to the client.

### Key Components and Workflow

### 1\. Importing Dependencies

    import { promises as fs } from 'fs';
    import path from 'path';
    import multer from 'multer';

*   **Purpose**: These imports bring in the necessary modules for file system operations (`fs`), file path manipulation (`path`), and file upload handling (`multer`).

### 2\. Configuring Multer for File Uploads

    const upload = multer({ dest: 'uploads/' });

*   **Purpose**: Configures `multer` to store uploaded files in the `uploads/` directory.
*   **How it works**: Files uploaded via the API will be temporarily stored in the `uploads/` directory with a generated filename.

### 3\. Disabling Body Parsing for the Route

    export const config = {
      api: {
        bodyParser: false,
      },
    };

*   **Purpose**: Disables the default body parsing in Next.js for this API route.
*   **How it works**: Since `multer` handles the parsing of `multipart/form-data` (used for file uploads), the default body parser is disabled to prevent conflicts.

### 4\. Handling File Uploads

    export default async function handler(req, res) {
      if (req.method === 'POST') {
        upload.single('file')(req, res, async (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error uploading file' });
          }
    
          const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
    
          res.status(200).json({ filePath });
        });
      } else {
        res.status(405).json({ message: 'Method not allowed' });
      }
    }

*   **Purpose**: The `handler` function processes incoming requests to the API.
*   **How it works**:
    *   **Method Check**: It first checks if the request method is `POST`. If not, it returns a `405 Method Not Allowed` response.
    *   **Handling Uploads**: If the method is `POST`, it uses `multer` to handle the file upload. The `single('file')` method expects a file with the name `file` in the form data.
    *   **Error Handling**: If there is an error during the upload process, it returns a `500 Internal Server Error` with a message.
    *   **Returning the File Path**: Upon successful upload, it constructs the file path using `path.join` and sends this path back in the response as JSON.

Conclusion
----------

The `upload.js` file is a critical part of the CNV analysis application, enabling users to upload files to the server securely. By utilizing `multer`, it efficiently handles file storage, ensuring that files are stored in the appropriate directory and that the client receives the file path for further processing.