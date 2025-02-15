import React, { useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TablePagination, TextField, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useNavigate } from "react-router-dom";


// Liste des paiements simulés
const initialPaiements = [
    { id: 1, nom: "El Amrani", prenom: "Yassine", abonnement: "Annuel", datePaiement: "2024-01-15", dateExpiration: "2025-01-15", actif : false },
    { id: 2, nom: "Benkirane", prenom: "Sofia", abonnement: "Mensuel", datePaiement: "2024-02-01", dateExpiration: "2024-03-01", actif : true  },
    { id: 3, nom: "Tahiri", prenom: "Omar", abonnement: "Trimestriel", datePaiement: "2023-12-20", dateExpiration: "2024-03-20", actif : true  },
    { id: 4, nom: "Naciri", prenom: "Leila", abonnement: "Mensuel", datePaiement: "2024-02-05", dateExpiration: "2024-03-05", actif : true  },
    { id: 5, nom: "Ouazzani", prenom: "Hamza", abonnement: "Annuel", datePaiement: "2024-01-20", dateExpiration: "2025-01-20", actif : false  },
    { id: 6, nom: "Zeroual", prenom: "Karim", abonnement: "Trimestriel", datePaiement: "2024-02-15", dateExpiration: "2024-05-15", actif : true  },
    { id: 7, nom: "Bennani", prenom: "Amina", abonnement: "Mensuel", datePaiement: "2024-01-30", dateExpiration: "2024-02-29", actif : true  },
    { id: 8, nom: "Khalidi", prenom: "Mehdi", abonnement: "Annuel", datePaiement: "2024-03-10", dateExpiration: "2025-03-10", actif : true  },
    { id: 9, nom: "Rachidi", prenom: "Sara", abonnement: "Trimestriel", datePaiement: "2024-02-20", dateExpiration: "2024-05-20", actif : true  },
    { id: 10, nom: "Saidi", prenom: "Youssef", abonnement: "Mensuel", datePaiement: "2024-01-05", dateExpiration: "2024-02-05", actif : true  },
    { id: 11, nom: "Lahlou", prenom: "Hafsa", abonnement: "Annuel", datePaiement: "2024-03-05", dateExpiration: "2025-03-05", actif : true  },
    { id: 12, nom: "Bouzidi", prenom: "Anas", abonnement: "Mensuel", datePaiement: "2024-02-10", dateExpiration: "2024-03-10", actif : true  },
    { id: 13, nom: "Cherkaoui", prenom: "Sara", abonnement: "Trimestriel", datePaiement: "2024-01-20", dateExpiration: "2024-04-20", actif : true  },
    { id: 14, nom: "El Fassi", prenom: "Younes", abonnement: "Annuel", datePaiement: "2024-03-15", dateExpiration: "2025-03-15", actif : true  },
    { id: 15, nom: "Mourad", prenom: "Lina", abonnement: "Mensuel", datePaiement: "2024-02-25", dateExpiration: "2024-03-25", actif : true  },  
];

const Paiements = () => {
    const [paiements, setPaiements] = useState(initialPaiements);

    const handleDesactiver = (id) => {
        setPaiements(paiements.map(p => p.id === id ? { ...p, actif: !p.actif } : p));
      };
    
      const handleSupprimer = (id) => {
        setPaiements(paiements.filter(p => p.id !== id));
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
                  <TableCell style={{ fontWeight: "bold", color: paiement.actif ? "green" : "gray" }}>
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
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color={paiement.actif ? "success" : "default"} onClick={() => handleDesactiver(paiement.id)}>
                      <AccessibilityNewIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleSupprimer(paiement.id)}>
                      <DeleteIcon />
                    </IconButton>
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