import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';

const Membres = () => {
  const [adherents, setAdherents] = useState([
    { id: 1, nom: 'El Amrani', prenom: 'Yassine', sexe: 'Homme', dateNaissance: '2006-08-12', adresse: 'Casablanca',
      email: 'yassine@gmail.com', telephone: '0600000001', certificatMedical: true, dateExamen: '2024-01-10',
      discipline: 'Basketball', categorie: 'U17', actif: false 
    },
    { id: 2, nom: 'Benkirane', prenom: 'Sofia', sexe: 'Femme', dateNaissance: '2009-02-20', adresse: 'Casablanca',
      email: 'sofia@gmail.com', telephone: '0600000002', certificatMedical: false, dateExamen: '2024-02-05',
      discipline: 'Basketball', categorie: 'U15', actif: true 
    },
    { id: 3, nom: 'Tahiri', prenom: 'Omar', sexe: 'Homme', dateNaissance: '2007-06-15', adresse: 'Casablanca',
      email: 'omar@gmail.com', telephone: '0600000003', certificatMedical: true, dateExamen: '2023-12-20',
      discipline: 'Basketball', categorie: 'U16', actif: true
    },
    { id: 4, nom: 'Naciri', prenom: 'Leila', sexe: 'Femme', dateNaissance: '2006-11-30', adresse: 'Casablanca',
      email: 'leila@gmail.com', telephone: '0600000004', certificatMedical: true, dateExamen: '2024-01-25',
      discipline: 'Basketball', categorie: 'U17', actif: true 
    },
    { id: 5, nom: 'Ouazzani', prenom: 'Hamza', sexe: 'Homme', dateNaissance: '2009-05-08', adresse: 'Casablanca',
      email: 'hamza@gmail.com', telephone: '0600000005', certificatMedical: false, dateExamen: '2024-03-01',
      discipline: 'Basketball', categorie: 'U15', actif: false
    },
    { id: 6, nom: 'Zeroual', prenom: 'Karim', sexe: 'Homme', dateNaissance: '2008-07-22', adresse: 'Rabat',
      email: 'karim@gmail.com', telephone: '0600000006', certificatMedical: true, dateExamen: '2024-02-15',
      discipline: 'Football', categorie: 'U16', actif: true 
    },
    { id: 7, nom: 'Bennani', prenom: 'Amina', sexe: 'Femme', dateNaissance: '2007-09-10', adresse: 'Marrakech',
      email: 'amina@gmail.com', telephone: '0600000007', certificatMedical: false, dateExamen: '2024-01-30',
      discipline: 'Volleyball', categorie: 'U17', actif: true 
    },
    { id: 8, nom: 'Khalidi', prenom: 'Mehdi', sexe: 'Homme', dateNaissance: '2006-12-05', adresse: 'Fès',
      email: 'mehdi@gmail.com', telephone: '0600000008', certificatMedical: true, dateExamen: '2024-03-10',
      discipline: 'Basketball', categorie: 'U18', actif: true 
    },
    { id: 9, nom: 'Rachidi', prenom: 'Sara', sexe: 'Femme', dateNaissance: '2009-04-18', adresse: 'Tanger',
      email: 'fatima@gmail.com', telephone: '0600000009', certificatMedical: true, dateExamen: '2024-02-20',
      discipline: 'Handball', categorie: 'U15', actif: true 
    },
    { id: 10, nom: 'Saidi', prenom: 'Youssef', sexe: 'Homme', dateNaissance: '2007-03-25', adresse: 'Agadir',
      email: 'youssef@gmail.com', telephone: '0600000010', certificatMedical: false, dateExamen: '2024-01-05',
      discipline: 'Football', categorie: 'U16', actif: true
    },
    { id: 11, nom: 'Lahlou', prenom: 'Hafsa', sexe: 'Femme', dateNaissance: '2008-10-12', adresse: 'Oujda',
      email: 'hafsa@gmail.com', telephone: '0600000011', certificatMedical: true, dateExamen: '2024-03-05',
      discipline: 'Volleyball', categorie: 'U17', actif: true 
    },
    { id: 12, nom: 'Bouzidi', prenom: 'Anas', sexe: 'Homme', dateNaissance: '2006-05-30', adresse: 'Meknès',
      email: 'anas@gmail.com', telephone: '0600000012', certificatMedical: true, dateExamen: '2024-02-10',
      discipline: 'Basketball', categorie: 'U18', actif: true 
    },
    { id: 13, nom: 'Cherkaoui', prenom: 'Sara', sexe: 'Femme', dateNaissance: '2009-01-15', adresse: 'Tétouan',
      email: 'sara@gmail.com', telephone: '0600000013', certificatMedical: false, dateExamen: '2024-01-20',
      discipline: 'Handball', categorie: 'U15', actif: true
    },
    { id: 14, nom: 'El Fassi', prenom: 'Younes', sexe: 'Homme', dateNaissance: '2007-08-08', adresse: 'Kénitra',
      email: 'younes@gmail.com', telephone: '0600000014', certificatMedical: true, dateExamen: '2024-03-15',
      discipline: 'Football', categorie: 'U16', actif: true 
    },
    { id: 15, nom: 'Mourad', prenom: 'Lina', sexe: 'Femme', dateNaissance: '2008-06-20', adresse: 'Safi',
      email: 'lina@gmail.com', telephone: '0600000015', certificatMedical: true, dateExamen: '2024-02-25',
      discipline: 'Volleyball', categorie: 'U17', actif: true 
    },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDesactiver = (id) => {
    setAdherents(adherents.map(a => a.id === id ? { ...a, actif: !a.actif } : a));
  };

  const handleSupprimer = (id) => {
    setAdherents(adherents.filter(a => a.id !== id));
  };

  const navigate = useNavigate();

  // Filtrer les adhérents en fonction du terme de recherche
  const filteredAdherents = adherents.filter((adherent) =>
    adherent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adherent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(adherent.id).includes(searchTerm.trim())
  );

  const theme = createTheme({
    palette: {
      orange: {
        main: '#fa870b',
        light: '#fa870b',
        dark: '#ffcc2e',
        contrastText: '#003a68',
      },
    },
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3, ml: 10 }}>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="orange"
            style={{ marginBottom: '10px' }}
            startIcon={<PersonAddAlt1Icon />}
            onClick={() => navigate("/membres/ajouter-adherent")}
          >
            Ajouter un adhérent
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

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "#FFFBF7" }}>
            <TableHead >
              <TableRow>
                <TableCell sx={{color: "#003a68"}}>ID</TableCell>
                <TableCell sx={{color: "#003a68"}}>Nom</TableCell>
                <TableCell sx={{color: "#003a68"}}>Prénom</TableCell>
                <TableCell sx={{color: "#003a68"}}>Sexe</TableCell>
                <TableCell sx={{color: "#003a68"}}>Date de Naissance</TableCell>
                <TableCell sx={{color: "#003a68"}}>Adresse</TableCell>
                <TableCell sx={{color: "#003a68"}}>Email</TableCell>
                <TableCell sx={{color: "#003a68"}}>Téléphone</TableCell>
                <TableCell sx={{color: "#003a68"}}>Certificat Médical</TableCell>
                <TableCell sx={{color: "#003a68"}}>Date Examen</TableCell>
                <TableCell sx={{color: "#003a68"}}>Discipline</TableCell>
                <TableCell sx={{color: "#003a68"}}>Catégorie</TableCell>
                <TableCell sx={{color: "#003a68"}}>Statut</TableCell>
                <TableCell sx={{color: "#003a68"}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdherents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((adherent) => (
                  <TableRow key={adherent.id}>
                    <TableCell>{adherent.id}</TableCell>
                    <TableCell>{adherent.nom}</TableCell>
                    <TableCell>{adherent.prenom}</TableCell>
                    <TableCell>{adherent.sexe}</TableCell>
                    <TableCell>{adherent.dateNaissance}</TableCell>
                    <TableCell>{adherent.adresse}</TableCell>
                    <TableCell>{adherent.email}</TableCell>
                    <TableCell>{adherent.telephone}</TableCell>
                    <TableCell style={{ color: adherent.certificatMedical ? 'green' : 'red' }}>
                      {adherent.certificatMedical ? 'Valide' : 'Non valide'}
                    </TableCell>
                    <TableCell>{adherent.dateExamen}</TableCell>
                    <TableCell>{adherent.discipline}</TableCell>
                    <TableCell>{adherent.categorie}</TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: adherent.actif ? 'green' : 'gray' }}>
                      {adherent.actif ? 'Actif' : 'Inactif'}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton color={adherent.actif ? "success" : "default"} onClick={() => handleDesactiver(adherent.id)}>
                        <AccessibilityNewIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleSupprimer(adherent.id)}>
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
          count={filteredAdherents.length} 
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

export default Membres;