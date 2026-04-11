import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Housing from './pages/Housing';
import Roommates from './pages/Roommates';
import ListProperty from './pages/ListProperty';
import ListRoommate from './pages/ListRoommate';
import PropertyDetail from './pages/PropertyDetail';
import Auth from './pages/Auth';
import ChatPage from './pages/ChatPage';
import Saved from './pages/Saved';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/housing" element={<Housing />} />
            <Route path="/housing/:id" element={<PropertyDetail />} />
            <Route path="/roommates" element={<Roommates />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/list-roommate" element={<ListRoommate />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
