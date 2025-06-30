import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Grid
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import evenementService from '../../services/evenementService';

const ModifierEvenement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    titre: '',
    type: '',
    description: '',
    dateDelivrance: '',
    destinataires: 'tous'
  });
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const evenement = evenementService.getAllEvenements().find(e => e.id === parseInt(id));
    if (evenement) {
      setFormData({
        titre: evenement.titre,
        type: evenement.type,
        description: evenement.description,
        dateDelivrance: evenement.dateDelivrance.slice(0, 16),
        destinataires: evenement.destinataires
      });
    } else {
      navigate('/evenements');
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'dateDelivrance') {
      setError('');
    }
  };

  const validateDates = () => {
    const dateDelivrance = new Date(formData.dateDelivrance);
    const now = new Date();
    
    if (dateDelivrance < now) {
      setError('La date de délivrance doit être supérieure ou égale à la date actuelle');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
      return;
    }

    const updatedEvenement = {
      titre: formData.titre,
      type: formData.type,
      description: formData.description,
      dateDelivrance: new Date(formData.dateDelivrance).toISOString(),
      destinataires: formData.destinataires
    };

    evenementService.updateEvenement(parseInt(id), updatedEvenement);
    setShowSuccessCard(true);
    setTimeout(() => {
      navigate('/evenements');
    }, 2000);
  };

  const theme = createTheme({
    palette: {
      blue: {
        main: '#024b95',
        light: '#01569e',
        dark: '#01569e',
        contrastText: '#d7f6e7',
      },
      red: {
        main: '#dc0005',
        light: '#ff3d41',
        dark: '#c80004',
        contrastText: '#ffffff',
      },
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
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
            L'événement a été modifié avec succès
          </Typography>
        </Paper>
      )}

      <IconButton onClick={() => navigate('/evenements')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
        <ArrowBackIosNewIcon />
      </IconButton>

      <Typography variant="h4" sx={{ 
        textAlign: 'center', 
        color: '#003a68', 
        mb: 4,
        fontWeight: 'bold',
        fontFamily: 'Poppins, Lato, sans-serif'
      }}>
        Modifier l'événement
      </Typography>

      <Paper elevation={3} sx={{ p: 3, bgcolor: '#FFFBF7' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="type-label">Type d'événement *</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  label="Type d'événement *"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: formData.type ? 'transparent' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: formData.type ? 'transparent' : 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: formData.type ? 'transparent' : '#1976d2',
                    }
                  }}
                >
                  <MenuItem value="tournoi">Tournoi</MenuItem>
                  <MenuItem value="message">Message</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="destinataires-label">Destinataires</InputLabel>
                <Select
                  labelId="destinataires-label"
                  name="destinataires"
                  value={formData.destinataires}
                  onChange={handleChange}
                  required
                  label="Destinataires"
                >
                  <MenuItem value="tous">Tous les membres</MenuItem>
                  <MenuItem value="inscrits">Membres inscrits uniquement</MenuItem>
                  <MenuItem value="non-inscrits">Membres non inscrits uniquement</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date de délivrance"
                name="dateDelivrance"
                type="datetime-local"
                value={formData.dateDelivrance}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                error={!!error}
                helperText={error}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="red" onClick={() => navigate('/evenements')}>
                    Annuler
                  </Button>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                  <Button variant="contained" color="blue" type="submit">
                    Enregistrer les modifications
                  </Button>
                </ThemeProvider>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ModifierEvenement; 