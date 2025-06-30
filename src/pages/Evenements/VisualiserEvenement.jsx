import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Grid,
  Chip,
  Divider,
  Button
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import evenementService from '../../services/evenementService';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const VisualiserEvenement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evenement, setEvenement] = useState(null);

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

  useEffect(() => {
    const foundEvenement = evenementService.getAllEvenements().find(e => e.id === parseInt(id));
    if (foundEvenement) {
      setEvenement(foundEvenement);
    } else {
      navigate('/evenements');
    }
  }, [id, navigate]);

  if (!evenement) {
    return null;
  }

  const getDestinatairesLabel = (destinataires) => {
    switch (destinataires) {
      case 'tous':
        return 'Tous les membres';
      case 'inscrits':
        return 'Membres inscrits uniquement';
      case 'non-inscrits':
        return 'Membres non inscrits uniquement';
      default:
        return destinataires;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/evenements')} sx={{ color: '#003a68' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="blue"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/evenements/modifier/${id}`)}
          >
            Modifier
          </Button>
        </ThemeProvider>
      </Box>

      <Typography variant="h4" sx={{ 
        textAlign: 'center', 
        color: '#003a68', 
        mb: 4,
        fontWeight: 'bold',
        fontFamily: 'Poppins, Lato, sans-serif'
      }}>
        Détails de l'événement
      </Typography>

      <Paper elevation={3} sx={{ p: 3, bgcolor: '#FFFBF7' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: '#003a68', mb: 2 }}>
              {evenement.titre}
            </Typography>
            <Chip 
              label={evenement.type === 'tournoi' ? 'Tournoi' : 'Message'} 
              color={evenement.type === 'tournoi' ? 'primary' : 'secondary'}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>
              Date de création
            </Typography>
            <Typography variant="body1">
              {new Date(evenement.dateCreation).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Africa/Casablanca'
              })}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>
              Date de délivrance
            </Typography>
            <Typography variant="body1">
              {new Date(evenement.dateDelivrance).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Africa/Casablanca'
              })}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>
              Destinataires
            </Typography>
            <Typography variant="body1">
              {getDestinatairesLabel(evenement.destinataires)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {evenement.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default VisualiserEvenement; 