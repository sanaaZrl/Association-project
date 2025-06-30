import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import evenementService from '../../services/evenementService';

const Evenements = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [evenements, setEvenements] = useState([]);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deletedEvenement, setDeletedEvenement] = useState(null);

  useEffect(() => {
    const loadEvenements = () => {
      const allEvenements = evenementService.getAllEvenements();
      setEvenements(allEvenements);
    };

    loadEvenements();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        const evenementToDelete = evenements.find(e => e.id === id);
        evenementService.deleteEvenement(id);
        setEvenements(evenements.filter(e => e.id !== id));
        setDeletedEvenement(evenementToDelete);
        setShowDeleteSuccess(true);
        setTimeout(() => {
          setShowDeleteSuccess(false);
          setDeletedEvenement(null);
        }, 2000);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const getDestinatairesLabel = (destinataires) => {
    switch (destinataires) {
      case 'tous':
        return 'Tous les membres';
      case 'inscrits':
        return 'Membres inscrits';
      case 'non-inscrits':
        return 'Membres non inscrits';
      default:
        return destinataires;
    }
  };

  const theme = createTheme({
    palette: {
      blue: {
        main: '#024b95',
        light: '#01569e',
        dark: '#01569e',
        contrastText: '#d7f6e7',
      },
    },
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 3 }}>
      {showDeleteSuccess && deletedEvenement && (
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
            L'événement {deletedEvenement.titre} a été supprimé avec succès
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: '#003a68', 
          fontWeight: 'bold',
          fontFamily: 'Poppins, Lato, sans-serif'
        }}>
          Événements
        </Typography>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="blue"
            startIcon={<AddIcon />}
            onClick={() => navigate('/evenements/ajouter')}
          >
            Créer un événement
          </Button>
        </ThemeProvider>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "#FFFBF7" }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{color: "#003a68"}}>ID</TableCell>
              <TableCell align="center" sx={{color: "#003a68"}}>Titre</TableCell>
              <TableCell align="center" sx={{color: "#003a68"}}>Type</TableCell>
              <TableCell align="center" sx={{color: "#003a68"}}>Date de création</TableCell>
              <TableCell align="center" sx={{color: "#003a68"}}>Date de délivrance</TableCell>
              <TableCell align="center" sx={{color: "#003a68"}}>Destinataires</TableCell>
              <TableCell align="center" sx={{color: "#003a68"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evenements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Aucun événement trouvé
                </TableCell>
              </TableRow>
            ) : (
              evenements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((evenement) => (
                  <TableRow key={evenement.id}>
                    <TableCell align="center">{evenement.id}</TableCell>
                    <TableCell align="center">{evenement.titre}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={evenement.type === 'tournoi' ? 'Tournoi' : 'Message'} 
                        color={evenement.type === 'tournoi' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {new Date(evenement.dateCreation).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Africa/Casablanca'
                      })}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(evenement.dateDelivrance).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Africa/Casablanca'
                      })}
                    </TableCell>
                    <TableCell align="center">
                      {getDestinatairesLabel(evenement.destinataires)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton 
                          onClick={() => navigate(`/evenements/modifier/${evenement.id}`)}
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
                          onClick={() => navigate(`/evenements/visualiser/${evenement.id}`)}
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
                          onClick={() => handleDelete(evenement.id)}
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
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={evenements.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page"
      />
    </Box>
  );
};

export default Evenements;