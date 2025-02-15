import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const AjouterPaiement = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    abonnement: '',
    montant: '',
    modePaiement: 'Espèces',
    datePaiement: '',
    dateExpiration: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Paiement ajouté :', formData);
    navigate('/paiements');
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
            contrastText: '#ffffff ',
          },

      },
});

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 2, bgcolor: '#FFFBF7' }}>
      <IconButton onClick={() => navigate('/paiements')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
        <ArrowBackIosNewIcon />
      </IconButton>
       <h2 style={{ 
        textAlign: 'center', 
        color: '#003a68', 
        fontSize: '25px', 
        fontWeight: 'bolder', 
        marginBottom: '20px', 
        fontFamily: 'Poppins, ,Lato, sans-serif', 
        letterSpacing: '3px',
        textShadow: '2px 4px 3px rgba(0,0,0,0.3)' 
        }}>
        Ajouter un paiement
        </h2>
        <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" label="ID" name="id" value={formData.id} onChange={handleChange} required disabled/>
            <TextField fullWidth margin="normal" label="Nom" name="nom" value={formData.nom} onChange={handleChange} required disabled/>
            <TextField fullWidth margin="normal" label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required disabled/>
            <TextField fullWidth select margin="normal" label="Abonnement" name="abonnement" value={formData.abonnement} onChange={handleChange} required>
                <MenuItem value="Mensuel">Mensuel</MenuItem>
                <MenuItem value="Trimestriel">Trimestriel</MenuItem>
                <MenuItem value="Annuel">Annuel</MenuItem>
            </TextField>
            <TextField fullWidth margin="normal" label="Montant" name="montant" type="number" value={formData.montant} onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Mode de Paiement" name="modePaiement" value={formData.modePaiement} disabled/>
            <TextField fullWidth margin="normal" label="Date de Paiement" name="datePaiement" type="date" value={formData.datePaiement} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
            <TextField fullWidth margin="normal" label="Date d'Expiration" name="dateExpiration" type="date" value={formData.dateExpiration} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" color="red" onClick={() => navigate('/paiements')}>Annuler</Button>
                </ThemeProvider>
                <ThemeProvider theme={theme}>
                    <Button variant="contained" color="blue" type="submit">Ajouter</Button>
                </ThemeProvider>
            </Box>
      </form>
    </Box>
  );
};

export default AjouterPaiement;