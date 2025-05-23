import React from 'react';
import MainPage from './pages/MainPage/MainPage';
import UploadPage from './pages/LoadPage/UploadPage';
import CodeEditor from './pages/EditPage/EditPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeAnalysisPage from './pages/CodeAnalysisPage/CodeAnalysisPage';
import ReportsPage from './pages/ReportsPage/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReportsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
