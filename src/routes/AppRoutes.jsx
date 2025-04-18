import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Membres from "../pages/Membres/Membres";
import Evenements from "../pages/Evenements/Evenements";
import Paiements from "../pages/Paiements/Paiements";
import Disciplines from "../pages/Disciplines/Disciplines";
import Sidebar from "../components/Sidebar";
import AjouterAdherent from "../pages/Membres/AjouterAdherent";
import AjouterPaiement from "../pages/Paiements/AjouterPaiement";
import Historique from "../pages/Paiements/Historique";



function AppRoutes() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="p-4 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/membres" element={<Membres />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/paiements" element={<Paiements />} />
            <Route path="/disciplines" element={<Disciplines />} />
            <Route path="/membres/ajouter-adherent" element={<AjouterAdherent />} /> 
            <Route path="/paiements/ajouter-paiement" element={<AjouterPaiement />} /> 
            <Route path="/paiements/historique/:id" element={<Historique />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppRoutes;