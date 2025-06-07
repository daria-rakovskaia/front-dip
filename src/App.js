import MainPage from './pages/MainPage/MainPage';
import UploadPage from './pages/LoadPage/UploadPage';
import EditPage from './pages/EditPage/EditPage';
import ResultPage from './pages/ResultPage/ResultPage';
import ReportsPage from './pages/ReportsPage/ReportsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/editCode" element={<EditPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
