import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Membres from "../pages/Membres/Membres";
import Evenements from "../pages/Evenements/Evenements";
import Paiements from "../pages/Paiements/Paiements";
import Disciplines from "../pages/Disciplines/Disciplines";
import Sidebar from "../components/Sidebar";
import AjouterAdherent from "../pages/Membres/AjouterAdherent";
import ModifierAdherent from "../pages/Membres/ModifierAdherent";
import VisualiserAdherent from "../pages/Membres/VisualiserAdherent";
import AjouterPaiement from "../pages/Paiements/AjouterPaiement";
import Historique from "../pages/Paiements/Historique";
import AjouterEvenement from '../pages/Evenements/AjouterEvenement';
import ModifierEvenement from '../pages/Evenements/ModifierEvenement';
import VisualiserEvenement from '../pages/Evenements/VisualiserEvenement';

function AppRoutes() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="p-4 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/membres" element={<Membres />} />
            <Route path="/membres/ajouter-adherent" element={<AjouterAdherent />} />
            <Route path="/membres/modifier/:id" element={<ModifierAdherent />} />
            <Route path="/membres/visualiser/:id" element={<VisualiserAdherent />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/evenements/ajouter" element={<AjouterEvenement />} />
            <Route path="/evenements/modifier/:id" element={<ModifierEvenement />} />
            <Route path="/evenements/visualiser/:id" element={<VisualiserEvenement />} />
            <Route path="/paiements" element={<Paiements />} />
            <Route path="/paiements/ajouter-paiement" element={<AjouterPaiement />} />
            <Route path="/paiements/historique/:id" element={<Historique />} />
            <Route path="/disciplines" element={<Disciplines />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppRoutes;