import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Snackbar, Alert, Box, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import membreService from '../../services/membreService';

const Membres = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adherents, setAdherents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deletedMembre, setDeletedMembre] = useState(null);

  // Charger les membres au chargement du composant
  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Début du chargement des membres...');
        const membres = membreService.getAllMembres();
        console.log('Membres chargés:', membres);
        setAdherents(membres);
      } catch (error) {
        console.error('Erreur lors du chargement des membres:', error);
      }
    };

    loadData();
  }, [location]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDesactiver = (id) => {
    try {
      const updatedMembre = membreService.toggleMembreStatus(id);
      setAdherents(prevAdherents => 
        prevAdherents.map(m => m.id === id ? updatedMembre : m)
      );
    } catch (error) {
      console.error('Erreur lors de la désactivation/activation du membre:', error);
    }
  };

  const handleSupprimer = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet adhérent ?')) {
      try {
        const membreToDelete = adherents.find(m => m.id === id);
        membreService.deleteMembre(id);
        setAdherents(adherents.filter(m => m.id !== id));
        setDeletedMembre(membreToDelete);
        setShowDeleteSuccess(true);
        setTimeout(() => {
          setShowDeleteSuccess(false);
          setDeletedMembre(null);
        }, 2000);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const handleModifier = (id) => {
    navigate(`/membres/modifier/${id}`);
  };

  const handleVisualiser = (id) => {
    navigate(`/membres/visualiser/${id}`);
  };

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
      blue: {
        main: '#024b95',
        light: '#01569e',
        dark: '#01569e',
        contrastText: '#d7f6e7',
      },
    },
    
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3, ml: 10 }}>
        {/* Success Card */}
        {showSuccessCard && (
          <Paper 
            elevation={3} 
            sx={{ 
              position: 'fixed',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              p: 2,
              bgcolor: '#4caf50',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: '400px',
              zIndex: 1000,
              animation: 'slideIn 0.5s ease-out',
              '@keyframes slideIn': {
                '0%': { transform: 'translate(-50%, -100%)', opacity: 0 },
                '100%': { transform: 'translate(-50%, 0)', opacity: 1 }
              }
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {successMessage}
            </Typography>
          </Paper>
        )}

        {showDeleteSuccess && deletedMembre && (
          <Paper 
            elevation={3} 
            sx={{ 
              position: 'fixed',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              p: 2,
              bgcolor: '#f44336',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: '400px',
              zIndex: 1000,
              animation: 'slideIn 0.5s ease-out',
              '@keyframes slideIn': {
                '0%': { transform: 'translate(-50%, -100%)', opacity: 0 },
                '100%': { transform: 'translate(-50%, 0)', opacity: 1 }
              }
            }}
          >
            <DeleteIcon sx={{ fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              L'adhérent {deletedMembre.nom} {deletedMembre.prenom} a été supprimé avec succès
            </Typography>
          </Paper>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="orange"
              startIcon={<PersonAddAlt1Icon />}
              onClick={() => navigate("/membres/ajouter-adherent")}
            >
              Ajouter un adhérent
            </Button>
          </ThemeProvider>
          <TextField
            label="Rechercher"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "250px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "#FFFBF7" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{color: "#003a68"}}>ID</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Nom</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Prénom</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Sexe</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Date de Naissance</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Adresse</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Email</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Téléphone</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Certificat Médical</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Date Examen</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Discipline</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Groupe</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Statut</TableCell>
                <TableCell align="center" sx={{color: "#003a68"}}>Actions</TableCell>
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
                    <ThemeProvider theme={theme}>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="blue" 
                        size="small"
                        onClick={() => window.open(adherent.certificatMedical, '_blank')}
                      >
                        Voir
                      </Button>
                    </TableCell>
                    </ThemeProvider>
                    <TableCell>{adherent.dateExamen}</TableCell>
                    <TableCell>{adherent.discipline}</TableCell>
                    <TableCell>{adherent.groupe}</TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: adherent.actif ? 'green' : 'red' }}>
                      {adherent.actif ? 'Actif' : 'Inactif'}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton 
                          onClick={() => handleVisualiser(adherent.id)}
                          sx={{ 
                            color: '#003a68',
                            '&:hover': {
                              bgcolor: 'rgba(0, 58, 104, 0.1)'
                            }
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleModifier(adherent.id)}
                          sx={{ 
                            color: '#003a68',
                            '&:hover': {
                              bgcolor: 'rgba(0, 58, 104, 0.1)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDesactiver(adherent.id)}
                          sx={{ 
                            color: adherent.actif ? '#dc0005' : '#4caf50',
                            '&:hover': {
                              bgcolor: adherent.actif ? 'rgba(220, 0, 5, 0.1)' : 'rgba(76, 175, 80, 0.1)'
                            }
                          }}
                        >
                          {adherent.actif ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                        <IconButton 
                          onClick={() => handleSupprimer(adherent.id)}
                          sx={{ 
                            color: '#dc0005',
                            '&:hover': {
                              bgcolor: 'rgba(220, 0, 5, 0.1)'
                            }
                          }}
                        >
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