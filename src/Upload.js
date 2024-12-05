import React, { useState, useEffect } from "react";
import axios from "axios";
import './Upload.css';
//import { envodeURIComponent } from 'querystring';


const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/files");
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post("http://127.0.0.1:5000/upload", formData);
            setMessage(`File uploaded! URL: ${response.data.file_url}`);
            fetchFiles();
        } catch (error) {
            setMessage("Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownload = async (fileName) => {
        //const encodedFileName = encodeURIComponent(fileName);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/download/${encodeURIComponent(fileName)}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const handleDelete = async (fileName) => {
        //const encodedFileName = encodeURIComponent(fileName);
        try {
            await axios.delete(`http://127.0.0.1:5000/delete/${fileName}`);
            setMessage("File deleted successfully.");
            //fetchFiles(); // Refresh the file list
            // Remove the file from the state without refetching
            setFiles(prevFiles => prevFiles.filter(file => file.file_name !== fileName));
        } catch (error) {
            console.error("Error deleting file:", error);
            setMessage("Delete failed. Please try again.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {loading && <div className="loader"></div>}
            <p>{message}</p>
            <h2>Contents of the container: </h2>
            <ul>
                {files.map(file => (
                    <li key={file.id}>
                        {file.file_name} ({file.file_size.toFixed(2)} KB)
                        <button onClick={() => handleDownload(file.file_name)}>Download</button>
                        <button onClick={() => handleDelete(file.file_name)}>Delete</button>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Upload;
