import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TablePagination, TextField, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useNavigate } from "react-router-dom";
import DownloadIcon from '@mui/icons-material/Download';
import { generateHistoriquePDF } from '../../utils/pdfGenerator';


// Liste des paiements simulés
const initialPaiements = [
    { id: 1, nom: "El Amrani", prenom: "Yassine", abonnement: "Annuel", datePaiement: "2024-01-15", dateExpiration: "2025-01-15", actif : false, montantRestant: 0, preuve: "preuve1.pdf" },
    { id: 2, nom: "Benkirane", prenom: "Sofia", abonnement: "Mensuel", datePaiement: "2024-02-01", dateExpiration: "2024-03-01", actif : true, montantRestant: 200, preuve: "preuve2.pdf" },
    { id: 3, nom: "Tahiri", prenom: "Omar", abonnement: "Trimestriel", datePaiement: "2023-12-20", dateExpiration: "2024-03-20", actif : true, montantRestant: 0, preuve: "preuve3.pdf" },
    { id: 4, nom: "Naciri", prenom: "Leila", abonnement: "Mensuel", datePaiement: "2024-02-05", dateExpiration: "2024-03-05", actif : true, montantRestant: 150, preuve: "preuve4.pdf" },
    { id: 5, nom: "Ouazzani", prenom: "Hamza", abonnement: "Annuel", datePaiement: "2024-01-20", dateExpiration: "2025-01-20", actif : false, montantRestant: 0, preuve: "preuve5.pdf" },
    { id: 6, nom: "Zeroual", prenom: "Karim", abonnement: "Trimestriel", datePaiement: "2024-02-15", dateExpiration: "2024-05-15", actif : true, montantRestant: 300, preuve: "preuve6.pdf" },
    { id: 7, nom: "Bennani", prenom: "Amina", abonnement: "Mensuel", datePaiement: "2024-01-30", dateExpiration: "2024-02-29", actif : true, montantRestant: 0, preuve: "preuve7.pdf" },
    { id: 8, nom: "Khalidi", prenom: "Mehdi", abonnement: "Annuel", datePaiement: "2024-03-10", dateExpiration: "2025-03-10", actif : true, montantRestant: 0, preuve: "preuve8.pdf" },
    { id: 9, nom: "Rachidi", prenom: "Sara", abonnement: "Trimestriel", datePaiement: "2024-02-20", dateExpiration: "2024-05-20", actif : true, montantRestant: 400, preuve: "preuve9.pdf" },
    { id: 10, nom: "Saidi", prenom: "Youssef", abonnement: "Mensuel", datePaiement: "2024-01-05", dateExpiration: "2024-02-05", actif : true, montantRestant: 0, preuve: "preuve10.pdf" },
    { id: 11, nom: "Lahlou", prenom: "Hafsa", abonnement: "Annuel", datePaiement: "2024-03-05", dateExpiration: "2025-03-05", actif : true, montantRestant: 0, preuve: "preuve11.pdf" },
    { id: 12, nom: "Bouzidi", prenom: "Anas", abonnement: "Mensuel", datePaiement: "2024-02-10", dateExpiration: "2024-03-10", actif : true, montantRestant: 100, preuve: "preuve12.pdf" },
    { id: 13, nom: "Cherkaoui", prenom: "Sara", abonnement: "Trimestriel", datePaiement: "2024-01-20", dateExpiration: "2024-04-20", actif : true, montantRestant: 0, preuve: "preuve13.pdf" },
    { id: 14, nom: "El Fassi", prenom: "Younes", abonnement: "Annuel", datePaiement: "2024-03-15", dateExpiration: "2025-03-15", actif : true, montantRestant: 0, preuve: "preuve14.pdf" },
    { id: 15, nom: "Mourad", prenom: "Lina", abonnement: "Mensuel", datePaiement: "2024-02-25", dateExpiration: "2024-03-25", actif : true, montantRestant: 250, preuve: "preuve15.pdf" },
];

const Paiements = () => {
    const [paiements, setPaiements] = useState([]);

    // Charger les paiements depuis le localStorage au chargement du composant
    useEffect(() => {
        const savedPaiements = localStorage.getItem('paiements');
        if (savedPaiements) {
            setPaiements(JSON.parse(savedPaiements));
        } else {
            // Si aucun paiement n'est sauvegardé, utiliser les données initiales
            setPaiements(initialPaiements);
            localStorage.setItem('paiements', JSON.stringify(initialPaiements));

            // Créer l'historique pour chaque paiement initial
            initialPaiements.forEach(paiement => {
                const historiqueInitial = [{
                    date: paiement.datePaiement,
                    montant: paiement.montantRestant + ' DH',
                    type: paiement.abonnement
                }];
                localStorage.setItem(`historique_${paiement.id}`, JSON.stringify(historiqueInitial));
            });
        }
    }, []);

    const handleDesactiver = (id) => {
        const updatedPaiements = paiements.map(p => p.id === id ? { ...p, actif: !p.actif } : p);
        setPaiements(updatedPaiements);
        localStorage.setItem('paiements', JSON.stringify(updatedPaiements));
    };
    
    const handleSupprimer = (id) => {
        const updatedPaiements = paiements.filter(p => p.id !== id);
        setPaiements(updatedPaiements);
        localStorage.setItem('paiements', JSON.stringify(updatedPaiements));
    };

    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
          orange: {
            main: '#fa870b',
            light: '#fa870b',
            dark: '#ffcc2e',
            contrastText: '#003a68',
          },
          blue: {
            main: '#003a68',
            light: '#003a68',
            dark: '#003a68',
            contrastText: '#003a68',
          },
        },
      });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche
    // Filtrer les adhérents en fonction du terme de recherche
  const filteredPaiements = paiements.filter((paiement) =>
    paiement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(paiement.id).includes(searchTerm.trim())
  );

  const handleDownloadHistorique = async (paiement) => {
    try {
      // Récupérer l'historique du paiement
      const historiqueData = localStorage.getItem(`historique_${paiement.id}`);
      const historique = JSON.parse(historiqueData || '[]');
      
      // Générer le PDF
      generateHistoriquePDF(paiement, historique);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

   return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexGrow: 1, p: 3, ml: 10 }}>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="orange"
            style={{ marginBottom: '10px' }}
            startIcon={<PersonAddAlt1Icon />}
            onClick={() => navigate("/paiements/ajouter-paiement")}
          >
            Ajouter un paiement
          </Button>
        </ThemeProvider>
        <TextField
          fullWidth
          label="Rechercher"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: '20px', width: "250px", position: 'absolute', right: "20px", top: "70px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "#FFFBF7" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{color: "#003a68"}}>ID</TableCell>
                <TableCell sx={{color: "#003a68"}}>Nom</TableCell>
                <TableCell sx={{color: "#003a68"}}>Prénom</TableCell>
                <TableCell sx={{color: "#003a68"}}>Abonnement</TableCell>
                <TableCell sx={{color: "#003a68"}}>Date de Paiement</TableCell>
                <TableCell sx={{color: "#003a68"}}>Date d'Expiration</TableCell>
                <TableCell sx={{color: "#003a68"}}>Montant d'origine</TableCell>
                <TableCell sx={{color: "#003a68"}}>Montant payé</TableCell>
                <TableCell sx={{color: "#003a68"}}>Montant restant</TableCell>
                <TableCell sx={{color: "#003a68"}}>Preuve</TableCell>
                <TableCell sx={{color: "#003a68"}}>Statut</TableCell>
                <TableCell sx={{color: "#003a68"}}>Historique</TableCell>
                <TableCell sx={{color: "#003a68"}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPaiements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell>{paiement.id}</TableCell>
                  <TableCell>{paiement.nom}</TableCell>
                  <TableCell>{paiement.prenom}</TableCell>
                  <TableCell>{paiement.abonnement}</TableCell>
                  <TableCell>{paiement.datePaiement}</TableCell>
                  <TableCell>{paiement.dateExpiration}</TableCell>
                  <TableCell>{paiement.montant !== undefined && paiement.montant !== null ? `${paiement.montant} DH` : ''}</TableCell>
                  <TableCell>{paiement.montantPaye !== undefined && paiement.montantPaye !== null ? `${paiement.montantPaye} DH` : ''}</TableCell>
                  <TableCell>{paiement.montantRestant !== undefined && paiement.montantRestant !== null ? `${paiement.montantRestant} DH` : ''}</TableCell>
                  <TableCell>
                    <ThemeProvider theme={theme}>
                      <Button
                        variant="outlined"
                        color="orange"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadHistorique(paiement)}
                      >
                        Télécharger
                      </Button>
                    </ThemeProvider>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", color: paiement.actif ? "green" : "red" }}>
                    {paiement.actif ? "Actif" : "Inactif"}
                  </TableCell>
                  <TableCell>
                    <ThemeProvider theme={theme}>
                        <Button variant="outlined" color="orange" style={{ marginBottom: '10px' }} onClick={() => navigate(`/paiements/historique/${paiement.id}`)}>
                          Voir plus
                        </Button>
                    </ThemeProvider>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                      <IconButton color={paiement.actif ? "success" : "error"} onClick={() => handleDesactiver(paiement.id)}> 
                        <AccessibilityNewIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleSupprimer(paiement.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredPaiements.length} 
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
        />
      </Box>
    </Box>
  );
};

export default Paiements;