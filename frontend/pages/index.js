import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagRequest, setTagRequest] = useState('');
  const [tags, setTags] = useState([
    { name: 'Customer Satisfaction', color: '#ff4e6e', request: 'Find customer satisfaction related content' },
    { name: 'Claims', color: '#4ade80', request: 'Find claims related content' },
    { name: 'Customer Summary', color: '#fbbf24', request: 'Find customer summary information' }
  ]);
  const router = useRouter();

  const handleFileClick = (fileName) => {
    setSelectedFile(fileName);
    setPreviewUrl(`/uploads/${fileName}`);
  };

	const handleNewFileUpload = () => {
		fileInputRef.current.click();
	};

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Starting upload:", file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        setFiles(prevFiles => [data.filename, ...prevFiles]);
        setSelectedFile(data.filename);
        setPreviewUrl(`/uploads/${data.filename}`);
        event.target.value = "";
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload file");
      event.target.value = "";
    }
  };

  const handleTagClick = async (tagRequest) => {
    if (!selectedFile) {
      alert('Please select a document first');
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: tagRequest,
          filename: selectedFile
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process tag request');
      }

      const data = await response.json();
      console.log('Tag response:', data);
      
      // Handle the response as needed
      // You might want to display the results somewhere in the UI
    } catch (error) {
      console.error('Tag processing error:', error);
      alert('Failed to process tag request');
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = { 
      name: tagName, 
      request: tagRequest,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
    };
    setTags(prevTags => [...prevTags, newTag]);
    
    // Also save to localStorage if you want persistence
    const savedTags = JSON.parse(localStorage.getItem('tags') || '[]');
    savedTags.push(newTag);
    localStorage.setItem('tags', JSON.stringify(savedTags));
    
    setShowTagModal(false);
    setTagName('');
    setTagRequest('');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      background: '#1a1a1a'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#2d2d2d',
        borderBottom: '1px solid #404040'
      }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>Vector Space</div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <button style={navButtonStyle}>View Tags</button>
          <button style={navButtonStyle}>Past Searches</button>
          <button style={{...navButtonStyle, color: '#4ade80', textDecoration: 'underline'}}>Switch Profile</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left sidebar */}
        <div style={{ 
          width: '250px', 
          padding: '20px', 
          borderRight: '1px solid #404040',
          background: '#2d2d2d'
        }}>
          <button 
            onClick={handleNewFileUpload}
            style={{
              padding: '15px',
              borderRadius: '15px',
              background: '#4ade80',
              color: 'black',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '15px'
            }}
          >
            + Upload new file
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => handleFileClick(file)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedFile === file ? '#404040' : '#e5e5e5',
                  color: selectedFile === file ? 'white' : 'black',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {file}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ 
          flex: 1, 
          padding: '30px',
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(245, 208, 254, 0.15) 0%, rgba(147, 197, 253, 0.15) 100%)',
          gap: '20px'
        }}>
          {/* Chat input */}
          <input
            type="text"
            placeholder="Chat..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{
              padding: '15px 25px',
              borderRadius: '30px',
              border: 'none',
              width: '100%',
              fontSize: '16px',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />

          {/* Document preview */}
          <div style={{
            flex: 1,
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            {previewUrl ? (
              <embed
                src={previewUrl}
                type="application/pdf"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#666',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Select a document to preview
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{
          width: '300px',
          padding: '30px 20px',
          borderLeft: '1px solid #404040',
          background: '#2d2d2d',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <button 
            onClick={() => setShowTagModal(true)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'transparent',
              color: 'white',
              border: '1px solid #4ade80',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Add Tags +
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag.request)}
                style={tagStyle(tag.color)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tag Modal */}
      {showTagModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ color: 'white', marginTop: 0 }}>Add New Tag</h3>
            <form onSubmit={handleAddTag}>
              <input
                type="text"
                placeholder="Tag Name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                style={modalInputStyle}
              />
              <textarea
                placeholder="Request"
                value={tagRequest}
                onChange={(e) => setTagRequest(e.target.value)}
                style={{...modalInputStyle, minHeight: '100px'}}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" style={{...buttonStyle, background: '#4ade80'}}>
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowTagModal(false)}
                  style={{...buttonStyle, background: '#374151'}}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const navButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '8px 16px',
  borderRadius: '4px'
};

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  fontWeight: '500'
};

const tagStyle = (color) => ({
  padding: '12px 20px',
  borderRadius: '8px',
  border: 'none',
  background: color,
  color: 'white',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '16px',
  fontWeight: '500'
});

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modalStyle = {
  background: '#2d2d2d',
  padding: '20px',
  borderRadius: '8px',
  width: '400px'
};

const modalInputStyle = {
  width: '100%',
  padding: '8px 12px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #404040',
  background: '#1a1a1a',
  color: 'white'
}; 