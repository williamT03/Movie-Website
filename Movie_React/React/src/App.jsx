
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Discover from './Discover.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
