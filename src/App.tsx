import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BookingConfirmation from './pages/BookingConfirmation';
import MyRides from './pages/MyRides';
import ReferEarn from './pages/ReferEarn';
import HelpSupport from './pages/HelpSupport';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/refer-earn" element={<ReferEarn />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 