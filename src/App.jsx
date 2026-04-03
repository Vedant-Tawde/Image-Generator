import { useState } from 'react'
import './index.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    
    try {
      const response = await fetch('/hf-api/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API Error:", errorText);
        throw new Error(`\nStatus: ${response.status}\nDetails: ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`Failed to generate image. Error: ${error.message}\n\nCheck the browser console for more details.`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Image Generator</h1>
        <p>Turn your imagination into stunning visual reality</p>
      </header>
      
      <main className="main-content">
        <div className="input-section">
          <input 
            type="text" 
            className="text-input" 
            placeholder="Describe what you want to see... (e.g. A futuristic city at sunset)" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            className="generate-button" 
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="image-display-section">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Weaving the pixels...</p>
            </div>
          ) : imageUrl ? (
            <div className="image-container">
              <img src={imageUrl} alt={prompt} className="generated-image" />
              <div className="image-overlay">
                <p className="prompt-label">{prompt}</p>
                <div className="actions">
                  <a href={imageUrl} download="generated-image.jpg" className="action-btn" target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder-container">
              <div className="placeholder-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <p>Your creation will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
