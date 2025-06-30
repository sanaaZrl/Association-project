import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, IconButton, Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import membreService from '../../services/membreService';

const ModifierAdherent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    adresse: '',
    email: '',
    telephone: '',
    certificatMedical: '',
    dateExamen: '',
    discipline: 'Basketball',
    groupe: '',
    montantRestant: 0,
    actif: true
  });
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  useEffect(() => {
    const loadMembre = () => {
      try {
        const membre = membreService.getAllMembres().find(m => m.id === parseInt(id));
        if (membre) {
          setFormData(membre);
        } else {
          alert('Membre non trouvé');
          navigate('/membres');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du membre:', error);
        alert('Une erreur est survenue lors du chargement du membre');
        navigate('/membres');
      }
    };

    loadMembre();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Vérifier que tous les champs requis sont remplis
      const requiredFields = ['nom', 'prenom', 'sexe', 'dateNaissance', 'adresse', 'email', 'telephone', 'certificatMedical', 'dateExamen', 'discipline', 'groupe'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        alert(`Veuillez remplir tous les champs requis. Champs manquants : ${missingFields.join(', ')}`);
        return;
      }

      // Mettre à jour le membre via le service
      const updatedMembre = membreService.updateMembre(parseInt(id), formData);
      console.log('Membre mis à jour:', updatedMembre);
      
      // Afficher le message de succès
      setShowSuccessCard(true);
      
      // Après 2 secondes, naviguer vers la page des membres
      setTimeout(() => {
        navigate('/membres');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la modification du membre:', error);
      alert('Une erreur est survenue lors de la modification du membre. Veuillez réessayer.');
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
      red: {
        main: '#dc0005',
        light: '#ff3d41',
        dark: '#c80004',
        contrastText: '#ffffff',
      },
    },
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 2, bgcolor: '#FFFBF7' }}>
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
            L'adhérent {formData.nom} {formData.prenom} est modifié avec succès
          </Typography>
        </Paper>
      )}

      <IconButton onClick={() => navigate('/membres')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#003a68', 
        fontSize: '25px', 
        fontWeight: 'bolder', 
        marginBottom: '20px', 
        fontFamily: 'Poppins, Lato, sans-serif', 
        letterSpacing: '3px',
        textShadow: '2px 4px 3px rgba(0,0,0,0.3)' 
      }}>
        Modifier un adhérent
      </h2>
      <form onSubmit={handleSubmit}>
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, color: '#003a68' }}>
            Certificat Médical
          </Typography>
          {formData.certificatMedical ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1">
                  Certificat actuel
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => window.open(formData.certificatMedical, '_blank')}
                  sx={{ 
                    color: '#003a68',
                    borderColor: '#003a68',
                    '&:hover': {
                      borderColor: '#002b4d',
                      bgcolor: 'rgba(0, 58, 104, 0.1)'
                    }
                  }}
                >
                  Voir le certificat
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'application/pdf,image/*';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, certificatMedical: URL.createObjectURL(file) });
                      }
                    };
                    input.click();
                  }}
                  sx={{ 
                    color: '#003a68',
                    borderColor: '#003a68',
                    '&:hover': {
                      borderColor: '#002b4d',
                      bgcolor: 'rgba(0, 58, 104, 0.1)'
                    }
                  }}
                >
                  Changer le certificat
                </Button>
              </Box>
            </Box>
          ) : (
            <TextField
              fullWidth
              type="file"
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
          )}
        </Box>
        <TextField fullWidth margin="normal" label="Date Examen" name="dateExamen" type="date" value={formData.dateExamen} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField 
          fullWidth 
          select 
          margin="normal" 
          label="Discipline" 
          name="discipline" 
          value={formData.discipline} 
          onChange={handleChange} 
          required
        >
          <MenuItem value="Basketball">Basketball</MenuItem>
        </TextField>
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
        <FormControlLabel
          control={
            <Switch
              checked={formData.actif}
              onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
              color="primary"
            />
          }
          label={
            <Typography sx={{ color: formData.actif ? '#4caf50' : '#f44336' }}>
              {formData.actif ? 'Actif' : 'Inactif'}
            </Typography>
          }
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <ThemeProvider theme={theme}>
            <Button variant="contained" color="red" onClick={() => navigate('/membres')}>Annuler</Button>
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Button variant="contained" color="blue" type="submit">Modifier</Button>
          </ThemeProvider>
        </Box>
      </form>
    </Box>
  );
};

export default ModifierAdherent; 