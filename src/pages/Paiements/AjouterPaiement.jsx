import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box, IconButton, Alert } from '@mui/material';
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
    montantPaye: '',
    montantRestant: '',
    modePaiement: 'Espèces',
    datePaiement: '',
    dateExpiration: '',
    actif: true,
    preuve: 'preuve.pdf'
  });

  const [error, setError] = useState('');

  // Générer un ID unique pour le nouveau paiement
  useEffect(() => {
    const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');
    const maxId = savedPaiements.reduce((max, p) => Math.max(max, p.id), 0);
    setFormData(prev => ({ ...prev, id: maxId + 1 }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };
      
      // Si on modifie soit le montant d'origine soit le montant payé
      if (name === 'montant' || name === 'montantPaye') {
        const montantOrigine = parseFloat(newData.montant) || 0;
        const montantPaye = parseFloat(newData.montantPaye) || 0;
        
        // Vérifier que le montant payé ne dépasse pas le montant d'origine
        if (montantPaye > montantOrigine) {
          setError('Le montant payé ne peut pas être supérieur au montant d\'origine');
          return prevData;
        }
        
        // Calculer le montant restant
        const montantRestant = montantOrigine - montantPaye;
        newData.montantRestant = montantRestant.toString();
      }

      // Validation des dates
      if (name === 'datePaiement' || name === 'dateExpiration') {
        const datePaiement = name === 'datePaiement' ? value : prevData.datePaiement;
        const dateExpiration = name === 'dateExpiration' ? value : prevData.dateExpiration;

        if (datePaiement && dateExpiration) {
          const paiementDate = new Date(datePaiement);
          const expirationDate = new Date(dateExpiration);

          if (expirationDate <= paiementDate) {
            setError('La date d\'expiration doit être strictement supérieure à la date de paiement');
            return prevData;
          }
        }
      }
      
      setError('');
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const montantOrigine = parseFloat(formData.montant);
    const montantPaye = parseFloat(formData.montantPaye);
    const montantRestant = parseFloat(formData.montantRestant);

    // Vérifier que les montants sont valides
    if (montantOrigine !== (montantPaye + montantRestant)) {
      setError('Le montant d\'origine doit être égal à la somme du montant payé et du montant restant');
      return;
    }

    // Vérifier les dates
    const paiementDate = new Date(formData.datePaiement);
    const expirationDate = new Date(formData.dateExpiration);
    
    if (expirationDate <= paiementDate) {
      setError('La date d\'expiration doit être strictement supérieure à la date de paiement');
      return;
    }

    // Récupérer les paiements existants
    const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');
    
    // Ajouter le nouveau paiement
    const newPaiement = {
      ...formData,
      montant: montantOrigine,
      montantPaye: montantPaye,
      montantRestant: montantRestant,
      actif: true
    };
    
    // Mettre à jour le localStorage des paiements
    localStorage.setItem('paiements', JSON.stringify([...savedPaiements, newPaiement]));

    // Créer l'historique initial avec le premier paiement
    const historiqueInitial = [{
      date: formData.datePaiement,
      montant: montantOrigine + ' DH',
      montantPaye: montantPaye + ' DH',
      montantRestant: montantRestant + ' DH',
      type: formData.abonnement
    }];
    
    // Sauvegarder l'historique dans le localStorage
    localStorage.setItem(`historique_${newPaiement.id}`, JSON.stringify(historiqueInitial));
    
    // Rediriger vers la liste des paiements
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="ID" name="id" value={formData.id} onChange={handleChange} required disabled/>
        <TextField fullWidth margin="normal" label="Nom" name="nom" value={formData.nom} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required />
        <TextField fullWidth select margin="normal" label="Abonnement" name="abonnement" value={formData.abonnement} onChange={handleChange} required>
            <MenuItem value="Mensuel">Mensuel</MenuItem>
            <MenuItem value="Trimestriel">Trimestriel</MenuItem>
            <MenuItem value="Annuel">Annuel</MenuItem>
        </TextField>
        <TextField 
          fullWidth 
          margin="normal" 
          label="Montant d'origine" 
          name="montant" 
          type="number" 
          value={formData.montant} 
          onChange={handleChange} 
          required 
          helperText="Le montant d'origine doit être égal à la somme du montant payé et du montant restant"
        />
        <TextField 
          fullWidth 
          margin="normal" 
          label="Montant payé" 
          name="montantPaye" 
          type="number" 
          value={formData.montantPaye} 
          onChange={handleChange} 
          required 
          helperText="Ne peut pas dépasser le montant d'origine"
        />
        <TextField 
          fullWidth 
          margin="normal" 
          label="Montant restant" 
          name="montantRestant" 
          type="number" 
          value={formData.montantRestant} 
          InputProps={{ readOnly: true }}
          disabled
        />
        <TextField fullWidth select margin="normal" label="Mode de Paiement" name="modePaiement" value={formData.modePaiement} onChange={handleChange} required>
            <MenuItem value="Espèces">Espèces</MenuItem>
            <MenuItem value="Chèque">Chèque</MenuItem>
            <MenuItem value="Virement">Virement</MenuItem>
            <MenuItem value="Carte">Carte</MenuItem>
        </TextField>
        <TextField 
          fullWidth 
          margin="normal" 
          label="Date de Paiement" 
          name="datePaiement" 
          type="date" 
          value={formData.datePaiement} 
          onChange={handleChange} 
          InputLabelProps={{ shrink: true }} 
          required 
        />
        <TextField 
          fullWidth 
          margin="normal" 
          label="Date d'Expiration" 
          name="dateExpiration" 
          type="date" 
          value={formData.dateExpiration} 
          onChange={handleChange} 
          InputLabelProps={{ shrink: true }} 
          required 
          helperText="Doit être strictement supérieure à la date de paiement"
        />
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