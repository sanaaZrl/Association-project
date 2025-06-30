import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    orange: {
      main: '#fa870b',
      light: '#fa870b',
      dark: '#ffcc2e',
      contrastText: '#003a68',
    },
  },
});

const Historique = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historique, setHistorique] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPayRestantDialog, setOpenPayRestantDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [error, setError] = useState('');
  const [montantPayeRestant, setMontantPayeRestant] = useState('');
  const [dernierPaiement, setDernierPaiement] = useState(null);
  const [paiementActuel, setPaiementActuel] = useState(null);
  const [newPaiement, setNewPaiement] = useState({
    date: '',
    montant: '',
    montantPaye: '',
    montantRestant: '',
    type: ''
  });
  const [editPaiement, setEditPaiement] = useState({
    abonnement: '',
    datePaiement: '',
    dateExpiration: '',
    montant: '',
    montantPaye: '',
    montantRestant: ''
  });

  useEffect(() => {
    // Charger l'historique depuis le localStorage
    const savedHistorique = localStorage.getItem(`historique_${id}`);
    console.log('Chargement historique pour ID:', id);
    console.log('Données sauvegardées:', savedHistorique);
    
    if (savedHistorique) {
      try {
        const parsedHistorique = JSON.parse(savedHistorique);
        console.log('Historique parsé:', parsedHistorique);
        setHistorique(parsedHistorique);
      } catch (error) {
        console.error('Erreur lors du parsing de l\'historique:', error);
        setHistorique([]);
      }
    } else {
      // Si aucun historique n'existe, essayer de créer un historique initial
      const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');
      const paiement = savedPaiements.find(p => p.id === parseInt(id));
      
      if (paiement) {
        const historiqueInitial = [{
          date: paiement.datePaiement,
          montant: paiement.montantRestant + ' DH',
          type: paiement.abonnement
        }];
        console.log('Création historique initial:', historiqueInitial);
        setHistorique(historiqueInitial);
        localStorage.setItem(`historique_${id}`, JSON.stringify(historiqueInitial));
      } else {
        console.log('Aucun paiement trouvé pour cet ID');
        setHistorique([]);
      }
    }
  }, [id]);

  useEffect(() => {
    // Charger les données du paiement actuel
    const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');
    const paiement = savedPaiements.find(p => p.id === parseInt(id));
    if (paiement) {
      setPaiementActuel(paiement);
      setEditPaiement({
        abonnement: paiement.abonnement,
        datePaiement: paiement.datePaiement,
        dateExpiration: paiement.dateExpiration,
        montant: paiement.montant,
        montantPaye: paiement.montantPaye,
        montantRestant: paiement.montantRestant
      });
    }
  }, [id]);

  const handleOpenDialog = () => {
    if (historique.length > 0) {
      const dernierPaiement = historique[historique.length - 1];
      const montantRestant = parseFloat(dernierPaiement.montantRestant);
      
      if (montantRestant > 0) {
        setDernierPaiement(dernierPaiement);
        setError(`Vous devez d'abord payer le montant restant de ${dernierPaiement.montantRestant} du paiement précédent.`);
        setOpenPayRestantDialog(true);
        return;
      }
    }
    
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setNewPaiement({
      date: '',
      montant: '',
      montantPaye: '',
      montantRestant: '',
      type: ''
    });
  };

  const handleClosePayRestantDialog = () => {
    setOpenPayRestantDialog(false);
    setMontantPayeRestant('');
    setError('');
  };

  const updatePaiementPrincipal = (historiqueActuel) => {
    if (historiqueActuel && historiqueActuel.length > 0) {
      // Récupérer le montant d'origine du paiement initial
      const montantOrigine = parseFloat(historiqueActuel[0].montant.replace(' DH', ''));
      
      // Calculer la somme totale des montants payés
      const montantPayeTotal = historiqueActuel.reduce((total, paiement) => {
        const montantPaye = parseFloat(paiement.montantPaye?.replace(' DH', '') || '0');
        return total + montantPaye;
      }, 0);

      // Récupérer le dernier montant restant
      const dernierPaiement = historiqueActuel[historiqueActuel.length - 1];
      const montantRestant = parseFloat(dernierPaiement.montantRestant?.replace(' DH', '') || '0');

      // Mettre à jour le paiement principal dans le localStorage
      const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');
      const updatedPaiements = savedPaiements.map(p => {
        if (p.id === parseInt(id)) {
          return {
            ...p,
            montant: montantOrigine,
            montantPaye: montantPayeTotal,
            montantRestant: montantRestant
          };
        }
        return p;
      });
      
      localStorage.setItem('paiements', JSON.stringify(updatedPaiements));
      
      // Mettre à jour l'état local
      setPaiementActuel(prev => ({
        ...prev,
        montant: montantOrigine,
        montantPaye: montantPayeTotal,
        montantRestant: montantRestant
      }));
    }
  };

  // Ajouter un useEffect pour mettre à jour les montants quand l'historique change
  useEffect(() => {
    updatePaiementPrincipal(historique);
  }, [historique, id]);

  const handlePayerMontantRestant = () => {
    if (!montantPayeRestant || parseFloat(montantPayeRestant) <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    const montantRestantActuel = parseFloat(dernierPaiement.montantRestant);
    const montantPaye = parseFloat(montantPayeRestant);

    if (montantPaye > montantRestantActuel) {
      setError('Le montant payé ne peut pas dépasser le montant restant');
      return;
    }

    // Calculer le nouveau montant restant
    const nouveauMontantRestant = montantRestantActuel - montantPaye;
    
    // Créer une nouvelle entrée dans l'historique pour ce paiement partiel
    const nouvelleLigne = {
      date: new Date().toISOString().split('T')[0],
      montant: dernierPaiement.montant, // Garder le montant d'origine
      montantPaye: montantPaye.toFixed(2) + ' DH',
      montantRestant: nouveauMontantRestant.toFixed(2) + ' DH',
      type: dernierPaiement.type,
      estPaiementPartiel: true // Marquer comme paiement partiel
    };

    const updatedHistorique = [...historique, nouvelleLigne];
    
    setHistorique(updatedHistorique);
    localStorage.setItem(`historique_${id}`, JSON.stringify(updatedHistorique));
    handleClosePayRestantDialog();

    // Si le montant restant est maintenant 0, permettre l'ajout d'un nouveau paiement
    if (nouveauMontantRestant === 0) {
      setError('');
      setOpenDialog(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPaiement(prevData => {
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
      
      setError('');
      return newData;
    });
  };

  const handleAddPaiement = () => {
    // Validation des montants
    const montantOrigine = parseFloat(newPaiement.montant);
    const montantPaye = parseFloat(newPaiement.montantPaye);
    const montantRestant = parseFloat(newPaiement.montantRestant);

    if (montantOrigine !== (montantPaye + montantRestant)) {
      setError('Le montant d\'origine doit être égal à la somme du montant payé et du montant restant');
      return;
    }

    if (newPaiement.date && newPaiement.montant && newPaiement.type) {
      const updatedHistorique = [...historique, {
        ...newPaiement,
        montant: montantOrigine + ' DH',
        montantPaye: montantPaye + ' DH',
        montantRestant: montantRestant + ' DH'
      }];
      setHistorique(updatedHistorique);
      localStorage.setItem(`historique_${id}`, JSON.stringify(updatedHistorique));
      handleCloseDialog();
    }
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPaiement(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'montant' || name === 'montantPaye') {
        const montantOrigine = parseFloat(newData.montant) || 0;
        const montantPaye = parseFloat(newData.montantPaye) || 0;
        
        if (montantPaye > montantOrigine) {
          setError('Le montant payé ne peut pas être supérieur au montant d\'origine');
          return prev;
        }
        
        newData.montantRestant = (montantOrigine - montantPaye).toString();
      }

      if (name === 'datePaiement' || name === 'dateExpiration') {
        const datePaiement = name === 'datePaiement' ? value : newData.datePaiement;
        const dateExpiration = name === 'dateExpiration' ? value : newData.dateExpiration;

        if (datePaiement && dateExpiration && new Date(dateExpiration) <= new Date(datePaiement)) {
          setError('La date d\'expiration doit être strictement supérieure à la date de paiement');
          return prev;
        }
      }
      
      setError('');
      return newData;
    });
  };

  const handleSaveEdit = () => {
    const montantOrigine = parseFloat(editPaiement.montant);
    const montantPaye = parseFloat(editPaiement.montantPaye);
    const montantRestant = parseFloat(editPaiement.montantRestant);

    if (montantOrigine !== (montantPaye + montantRestant)) {
      setError('Le montant d\'origine doit être égal à la somme du montant payé et du montant restant');
      return;
    }

    const datePaiement = new Date(editPaiement.datePaiement);
    const dateExpiration = new Date(editPaiement.dateExpiration);
    
    if (dateExpiration <= datePaiement) {
      setError('La date d\'expiration doit être strictement supérieure à la date de paiement');
      return;
    }

    // Récupérer l'historique actuel
    const savedHistorique = JSON.parse(localStorage.getItem(`historique_${id}`) || '[]');
    
    if (savedHistorique.length > 0) {
      // Vérifier si nous modifions le paiement initial (premier élément)
      const isPaiementInitial = editPaiement.datePaiement === savedHistorique[0].date;

      if (isPaiementInitial) {
        // Mise à jour du paiement initial dans le tableau principal
        const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');
        const updatedPaiements = savedPaiements.map(p => {
          if (p.id === parseInt(id)) {
            return {
              ...p,
              abonnement: editPaiement.abonnement,
              datePaiement: editPaiement.datePaiement,
              dateExpiration: editPaiement.dateExpiration,
              montant: montantOrigine,
              montantPaye: montantPaye,
              montantRestant: montantRestant
            };
          }
          return p;
        });
        localStorage.setItem('paiements', JSON.stringify(updatedPaiements));
        setPaiementActuel({ ...paiementActuel, ...editPaiement });
      }

      // Mise à jour dans l'historique
      const updatedHistorique = savedHistorique.map(p => {
        // Comparer à la fois la date et le type de paiement pour identifier l'entrée exacte
        if (p.date === editPaiement.datePaiement && 
            ((isPaiementInitial && !p.estPaiementPartiel) || (!isPaiementInitial && p.estPaiementPartiel))) {
          return {
            date: editPaiement.datePaiement,
            montant: montantOrigine + ' DH',
            montantPaye: montantPaye + ' DH',
            montantRestant: montantRestant + ' DH',
            type: editPaiement.abonnement,
            estPaiementPartiel: p.estPaiementPartiel
          };
        }
        return p;
      });
      
      setHistorique(updatedHistorique);
      localStorage.setItem(`historique_${id}`, JSON.stringify(updatedHistorique));
    }

    handleCloseEditDialog();
    setError(''); // Réinitialiser les erreurs après un enregistrement réussi
  };

  const handleDesactiver = (id) => {
    // Mettre à jour le statut actif dans le localStorage
    const savedPaiements = JSON.parse(localStorage.getItem('paiements') || '[]');
    const updatedPaiements = savedPaiements.map(p => {
      if (p.id === id) {
        return { ...p, actif: !p.actif };
      }
      return p;
    });
    
    localStorage.setItem('paiements', JSON.stringify(updatedPaiements));
    
    // Mettre à jour l'état local
    const updatedPaiement = updatedPaiements.find(p => p.id === id);
    setPaiementActuel(updatedPaiement);
  };

  const handleSupprimerPaiementHistorique = (paiementIndex) => {
    // Empêcher la suppression du paiement initial
    if (paiementIndex === 0) {
      setError('Le paiement initial ne peut pas être supprimé');
      return;
    }

    // Récupérer l'historique actuel
    const savedHistorique = JSON.parse(localStorage.getItem(`historique_${id}`) || '[]');
    
    // Supprimer le paiement spécifique de l'historique
    const updatedHistorique = savedHistorique.filter((_, index) => index !== paiementIndex);
    
    // Mettre à jour l'historique
    setHistorique(updatedHistorique);
    localStorage.setItem(`historique_${id}`, JSON.stringify(updatedHistorique));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 2, bgcolor: '#FFFBF7' }}>
      <IconButton onClick={() => navigate('/paiements')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
        <ArrowBackIosNewIcon />
      </IconButton>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#003a68', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
          Historique des paiements
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ color: '#fa870b' }}>
            {paiementActuel?.nom} {paiementActuel?.prenom}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#003a68' }}>
            ID: {id}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ThemeProvider theme={theme}>
        <Button
          variant="contained"
          color="orange"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 2 }}
        >
          Ajouter un paiement
        </Button>
      </ThemeProvider>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Date</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Montant d'origine</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Montant payé</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Montant restant</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Type d'abonnement</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Type de paiement</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historique.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Aucun historique disponible</TableCell>
              </TableRow>
            ) : (
              historique.map((paiement, index) => (
                <TableRow 
                  key={index}
                  sx={paiement.estPaiementPartiel ? { backgroundColor: '#f5f5f5' } : {}}
                >
                  <TableCell>{paiement.date}</TableCell>
                  <TableCell>{paiement.montant}</TableCell>
                  <TableCell>{paiement.montantPaye}</TableCell>
                  <TableCell>{paiement.montantRestant}</TableCell>
                  <TableCell>{paiement.type}</TableCell>
                  <TableCell>
                    {paiement.estPaiementPartiel ? 'Paiement partiel' : 'Paiement initial'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                      <IconButton color="primary" onClick={() => {
                        // Préremplir avec les données de la ligne courante
                        setEditPaiement({
                          abonnement: paiement.type,
                          datePaiement: paiement.date,
                          dateExpiration: paiementActuel?.dateExpiration || '',
                          montant: paiement.montant.replace(' DH', ''),
                          montantPaye: paiement.montantPaye?.replace(' DH', '') || '',
                          montantRestant: paiement.montantRestant?.replace(' DH', '') || ''
                        });
                        handleOpenEditDialog();
                      }}>
                        <EditIcon />
                      </IconButton>
                      {index !== 0 && ( // N'afficher le bouton de suppression que pour les paiements non-initiaux
                        <IconButton 
                          color="error" 
                          onClick={() => handleSupprimerPaiementHistorique(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog pour payer le montant restant */}
      <Dialog open={openPayRestantDialog} onClose={handleClosePayRestantDialog}>
        <DialogTitle>Payer le montant restant</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body1" sx={{ mb: 2, mt: 1 }}>
            Montant restant à payer : {dernierPaiement?.montantRestant}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Montant à payer"
            type="number"
            value={montantPayeRestant}
            onChange={(e) => setMontantPayeRestant(e.target.value)}
            required
            helperText="Entrez le montant que vous souhaitez payer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePayRestantDialog}>Annuler</Button>
          <Button onClick={handlePayerMontantRestant} variant="contained" color="primary">
            Payer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog existant pour ajouter un nouveau paiement */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter un paiement</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            name="date"
            type="date"
            value={newPaiement.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Montant d'origine"
            name="montant"
            type="number"
            value={newPaiement.montant}
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
            value={newPaiement.montantPaye}
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
            value={newPaiement.montantRestant}
            InputProps={{ readOnly: true }}
            disabled
          />
          <TextField
            fullWidth
            select
            margin="normal"
            label="Type d'abonnement"
            name="type"
            value={newPaiement.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="Mensuel">Mensuel</MenuItem>
            <MenuItem value="Trimestriel">Trimestriel</MenuItem>
            <MenuItem value="Annuel">Annuel</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleAddPaiement} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour modifier le paiement */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier le paiement</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            select
            margin="normal"
            label="Type d'abonnement"
            name="abonnement"
            value={editPaiement.abonnement}
            onChange={handleEditChange}
            required
          >
            <MenuItem value="Mensuel">Mensuel</MenuItem>
            <MenuItem value="Trimestriel">Trimestriel</MenuItem>
            <MenuItem value="Annuel">Annuel</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Date de Paiement"
            name="datePaiement"
            type="date"
            value={editPaiement.datePaiement}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date d'Expiration"
            name="dateExpiration"
            type="date"
            value={editPaiement.dateExpiration}
            onChange={handleEditChange}
            InputLabelProps={{ shrink: true }}
            required
            helperText="Doit être strictement supérieure à la date de paiement"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Montant d'origine"
            name="montant"
            type="number"
            value={editPaiement.montant}
            onChange={handleEditChange}
            required
            helperText="Le montant d'origine doit être égal à la somme du montant payé et du montant restant"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Montant payé"
            name="montantPaye"
            type="number"
            value={editPaiement.montantPaye}
            onChange={handleEditChange}
            required
            helperText="Ne peut pas dépasser le montant d'origine"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Montant restant"
            name="montantRestant"
            type="number"
            value={editPaiement.montantRestant}
            InputProps={{ readOnly: true }}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annuler</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Historique;
