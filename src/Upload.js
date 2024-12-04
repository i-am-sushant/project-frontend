import React, { useState } from "react";
import axios from "axios";
import './Upload.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
        } catch (error) {
            setMessage("Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {loading && <div className="loader"></div>}
            <p>{message}</p>
        </div>
    );
};

export default Upload;
