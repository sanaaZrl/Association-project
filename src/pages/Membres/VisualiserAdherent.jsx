import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Switch, FormControlLabel, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import membreService from '../../services/membreService';

const VisualiserAdherent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adherent, setAdherent] = useState(null);

  useEffect(() => {
    const loadAdherent = () => {
      try {
        const membre = membreService.getAllMembres().find(m => m.id === parseInt(id));
        if (membre) {
          setAdherent(membre);
        } else {
          alert('Adhérent non trouvé');
          navigate('/membres');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'adhérent:', error);
        alert('Une erreur est survenue lors du chargement de l\'adhérent');
        navigate('/membres');
      }
    };

    loadAdherent();
  }, [id, navigate]);

  const handleStatusChange = (e) => {
    try {
      const updatedAdherent = { ...adherent, actif: e.target.checked };
      membreService.updateMembre(parseInt(id), updatedAdherent);
      setAdherent(updatedAdherent);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Une erreur est survenue lors de la mise à jour du statut');
    }
  };

  if (!adherent) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <IconButton onClick={() => navigate('/membres')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
        <ArrowBackIosNewIcon />
      </IconButton>

      <Typography variant="h4" sx={{ 
        textAlign: 'center', 
        color: '#003a68', 
        mb: 4,
        fontWeight: 'bold',
        fontFamily: 'Poppins, Lato, sans-serif'
      }}>
        Détails de l'adhérent
      </Typography>

      <Paper elevation={3} sx={{ p: 3, bgcolor: '#FFFBF7' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Nom</Typography>
            <Typography variant="body1">{adherent.nom}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Prénom</Typography>
            <Typography variant="body1">{adherent.prenom}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Sexe</Typography>
            <Typography variant="body1">{adherent.sexe}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Date de Naissance</Typography>
            <Typography variant="body1">{new Date(adherent.dateNaissance).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Adresse</Typography>
            <Typography variant="body1">{adherent.adresse}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Email</Typography>
            <Typography variant="body1">{adherent.email}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Téléphone</Typography>
            <Typography variant="body1">{adherent.telephone}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Date Examen</Typography>
            <Typography variant="body1">{new Date(adherent.dateExamen).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Discipline</Typography>
            <Typography variant="body1">{adherent.discipline}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold' }}>Groupe</Typography>
            <Typography variant="body1">{adherent.groupe}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#003a68', fontWeight: 'bold', mb: 1 }}>Certificat Médical</Typography>
            {adherent.certificatMedical && (
              <Button
                variant="outlined"
                onClick={() => window.open(adherent.certificatMedical, '_blank')}
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
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={adherent.actif}
                  onChange={handleStatusChange}
                  color="primary"
                />
              }
              label={
                <Typography sx={{ color: adherent.actif ? '#4caf50' : '#f44336' }}>
                  {adherent.actif ? 'Actif' : 'Inactif'}
                </Typography>
              }
            />
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/membres/modifier/${id}`)}
              sx={{
                bgcolor: '#003a68',
                '&:hover': {
                  bgcolor: '#002b4d'
                }
              }}
            >
              Modifier
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default VisualiserAdherent; 