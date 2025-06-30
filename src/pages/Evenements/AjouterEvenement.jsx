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
  TextareaAutosize,
  FormControlLabel,
  RadioGroup,
  Radio,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import evenementService from '../../services/evenementService';

const AjouterEvenement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    type: '',
    description: '',
    dateCreation: (() => {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return now.toISOString().slice(0, 16);
    })(),
    dateDelivrance: '',
    message: '',
    destinataires: 'tous',
    lieu: '',
    prix: '',
    nombreParticipants: '',
    niveau: '',
    reglement: ''
  });
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser l'erreur quand l'utilisateur modifie la date de délivrance
    if (name === 'dateDelivrance') {
      setError('');
    }
  };

  const validateDates = () => {
    const dateCreation = new Date(formData.dateCreation);
    const dateDelivrance = new Date(formData.dateDelivrance);
    
    if (dateDelivrance < dateCreation) {
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

    const { titre, type, description, dateCreation, dateDelivrance, message, destinataires, lieu, prix, nombreParticipants, niveau, reglement } = formData;

    const nouvelEvenement = {
      titre,
      type,
      dateCreation: new Date(dateCreation).toISOString(),
      dateDelivrance: new Date(dateDelivrance).toISOString(),
      destinataires,
      description: type === 'tournoi' ? description : undefined,
      message: type === 'message' ? message : undefined,
      lieu: type === 'tournoi' ? lieu : undefined,
      prix: type === 'tournoi' ? prix : undefined,
      nombreParticipants: type === 'tournoi' ? nombreParticipants : undefined,
      niveau: type === 'tournoi' ? niveau : undefined,
      reglement: type === 'tournoi' ? reglement : undefined
    };

    evenementService.addEvenement(nouvelEvenement);
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
            L'événement a été créé avec succès
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
        Créer un nouvel événement
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

            {formData.type === 'tournoi' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description du tournoi"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </>
            )}

            {formData.type === 'message' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={6}
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Card sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#003a68', fontWeight: 'bold' }}>
                    Destinataires
                  </Typography>
                  <RadioGroup
                    name="destinataires"
                    value={formData.destinataires}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="tous" control={<Radio />} label="Tous les membres" />
                    <FormControlLabel value="inscrits" control={<Radio />} label="Membres inscrits uniquement" />
                    <FormControlLabel value="non-inscrits" control={<Radio />} label="Membres non inscrits uniquement" />
                  </RadioGroup>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date de création"
                name="dateCreation"
                type="datetime-local"
                value={formData.dateCreation}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ mb: 2 }}
              />
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
                sx={{ 
                  mb: 2,
                  '& input[type="datetime-local"]': {
                    padding: '14px',
                    cursor: 'pointer',
                    '&::-webkit-calendar-picker-indicator': {
                      padding: '4px',
                      cursor: 'pointer'
                    }
                  }
                }}
                inputProps={{
                  min: new Date().toISOString().slice(0, 16)
                }}
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
                    Créer l'événement
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

export default AjouterEvenement; 