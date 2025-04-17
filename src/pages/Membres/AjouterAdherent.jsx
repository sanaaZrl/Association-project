
import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const AjouterAdherent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    adresse: '',
    email: '',
    telephone: '',
    certificatMedical: '',
    dateExamen: '',
    discipline: '',
    groupe: '',
    montantRestant: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adhérent ajouté :', formData);
    navigate('/membres');
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
      <IconButton onClick={() => navigate('/membres')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
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
        Ajouter un adhérent
        </h2>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="ID" name="id" value={formData.id} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Nom" name="nom" value={formData.nom} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required />
        <TextField fullWidth select margin="normal" label="Sexe" name="sexe" value={formData.sexe} onChange={handleChange} required>
          <MenuItem value="Homme">Homme</MenuItem>
          <MenuItem value="Femme">Femme</MenuItem>
        </TextField>
        <TextField fullWidth margin="normal" label="Date de Naissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField fullWidth margin="normal" label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} required />
        <TextField
          fullWidth
          margin="normal"
          type="file"
          label="Certificat Médical"
          name="certificatMedical"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({ ...formData, certificatMedical: URL.createObjectURL(file) });
            }
          }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField fullWidth margin="normal" label="Date Examen" name="dateExamen" type="date" value={formData.dateExamen} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField fullWidth margin="normal" label="Discipline" name="discipline" value={formData.discipline} onChange={handleChange} required />
        <TextField 
          fullWidth 
          select 
          margin="normal" 
          label="Groupe" 
          name="groupe" 
          value={formData.groupe} 
          onChange={handleChange} 
          required
        >
          <MenuItem value="Groupe1">Groupe 1</MenuItem>
          <MenuItem value="Groupe2">Groupe 2</MenuItem>
          <MenuItem value="Groupe3">Groupe 3</MenuItem>
          <MenuItem value="Groupe4">Groupe 4</MenuItem>
        </TextField>
        <TextField 
          fullWidth 
          margin="normal" 
          label="Montant restant" 
          name="montantRestant" 
          type="number" 
          value={formData.montantRestant} 
          onChange={handleChange} 
          required 
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <ThemeProvider theme={theme}>
                <Button variant="contained" color="red" onClick={() => navigate('/membres')}>Annuler</Button>
            </ThemeProvider>
            <ThemeProvider theme={theme}>
                <Button variant="contained" color="blue" type="submit">Ajouter</Button>
             </ThemeProvider>
        </Box>
      </form>
    </Box>
  );
};

export default AjouterAdherent;
