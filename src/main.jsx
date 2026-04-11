import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </ChatProvider>
    </AuthProvider>
  </StrictMode>,
)
