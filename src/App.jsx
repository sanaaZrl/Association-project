import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Membres from './pages/Membres/Membres';
import AjouterAdherent from './pages/Membres/AjouterAdherent';
import ModifierAdherent from './pages/Membres/ModifierAdherent';
import VisualiserAdherent from './pages/Membres/VisualiserAdherent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/membres" element={<Membres />} />
        <Route path="/membres/ajouter-adherent" element={<AjouterAdherent />} />
        <Route path="/membres/modifier/:id" element={<ModifierAdherent />} />
        <Route path="/membres/visualiser/:id" element={<VisualiserAdherent />} />
      </Routes>
    </Router>
  );
}

export default App; 