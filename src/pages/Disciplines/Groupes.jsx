
import React, { useState } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Collapse, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

function Groupes() {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState({});
  const [openAddMember, setOpenAddMember] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteGroup, setDeleteGroup] = useState(null);
  const [newMember, setNewMember] = useState({ id: '', nom: '', prenom: '' });

  // Données des groupes et leurs membres (à remplacer par vos données réelles)
  const [groupes, setGroupes] = useState([
    {
      id: 'Groupe1',
      nom: 'Groupe 1',
      membres: [
        { id: 1, nom: 'El Amrani', prenom: 'Yassine' },
        { id: 5, nom: 'Ouazzani', prenom: 'Hamza' },
        { id: 9, nom: 'Rachidi', prenom: 'Sara' },
        { id: 13, nom: 'Cherkaoui', prenom: 'Sara' }
      ]
    },
    {
      id: 'Groupe2',
      nom: 'Groupe 2',
      membres: [
        { id: 2, nom: 'Benkirane', prenom: 'Sofia' },
        { id: 6, nom: 'Zeroual', prenom: 'Karim' },
        { id: 10, nom: 'Saidi', prenom: 'Youssef' },
        { id: 14, nom: 'El Fassi', prenom: 'Younes' }
      ]
    },
    {
      id: 'Groupe3',
      nom: 'Groupe 3',
      membres: [
        { id: 3, nom: 'Tahiri', prenom: 'Omar' },
        { id: 7, nom: 'Bennani', prenom: 'Amina' },
        { id: 11, nom: 'Lahlou', prenom: 'Hafsa' },
        { id: 15, nom: 'Mourad', prenom: 'Lina' }
      ]
    },
    {
      id: 'Groupe4',
      nom: 'Groupe 4',
      membres: [
        { id: 4, nom: 'Naciri', prenom: 'Leila' },
        { id: 8, nom: 'Khalidi', prenom: 'Mehdi' },
        { id: 12, nom: 'Bouzidi', prenom: 'Anas' }
      ]
    }
  ]);

  const handleExpandClick = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleAddMember = (groupId) => {
    setSelectedGroup(groupId);
    setOpenAddMember(true);
  };

  const handleCloseAddMember = () => {
    setOpenAddMember(false);
    setNewMember({ id: '', nom: '', prenom: '' });
  };

  const handleAddMemberSubmit = () => {
    if (newMember.id && newMember.nom && newMember.prenom) {
      setGroupes(prev => prev.map(group => {
        if (group.id === selectedGroup) {
          return {
            ...group,
            membres: [...group.membres, newMember]
          };
        }
        return group;
      }));
      handleCloseAddMember();
    }
  };

  const handleDeleteGroup = (groupId) => {
    const group = groupes.find(g => g.id === groupId);
    if (group.membres.length > 0) {
      alert("Impossible de supprimer ce groupe car il contient des membres. Veuillez d'abord supprimer tous les membres.");
      return;
    }
    setDeleteGroup(groupId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setGroupes(prev => prev.filter(group => group.id !== deleteGroup));
    setOpenDeleteDialog(false);
    setDeleteGroup(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, p: 3, ml: 10 }}>
        <IconButton onClick={() => navigate('/disciplines')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h6" sx={{ textAlign: 'center', color: '#003a68', fontWeight: 'bold', mb: 3 }}>
          Gestion des Groupes
        </Typography>
        <List>
          {groupes.map((groupe) => (
            <Card key={groupe.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">{groupe.nom}</Typography>
                  <Box>
                    <IconButton onClick={() => navigate(`/disciplines/planifier-entrainement/${groupe.id}`)}>
                      <CalendarMonthIcon />
                    </IconButton>
                    <IconButton onClick={() => handleAddMember(groupe.id)}>
                      <PersonAddAlt1Icon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteGroup(groupe.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleExpandClick(groupe.id)}
                      sx={{ transform: expandedGroups[groupe.id] ? 'rotate(180deg)' : 'none' }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Collapse in={expandedGroups[groupe.id]}>
                  <List>
                    {groupe.membres.map((membre) => (
                      <ListItem key={membre.id}>
                        <ListItemText 
                          primary={`${membre.nom} ${membre.prenom}`}
                          secondary={`ID: ${membre.id} | Date de Naissance: ${membre.dateNaissance}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </List>

        {/* Dialog pour ajouter un membre */}
        <Dialog open={openAddMember} onClose={handleCloseAddMember}>
          <DialogTitle>Ajouter un membre</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="ID"
              fullWidth
              value={newMember.id}
              onChange={(e) => setNewMember({ ...newMember, id: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Nom"
              fullWidth
              value={newMember.nom}
              onChange={(e) => setNewMember({ ...newMember, nom: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Prénom"
              fullWidth
              value={newMember.prenom}
              onChange={(e) => setNewMember({ ...newMember, prenom: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Date de Naissance"
              type="date"
              fullWidth
              value={newMember.dateNaissance}
              onChange={(e) => setNewMember({ ...newMember, dateNaissance: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddMember}>Annuler</Button>
            <Button onClick={handleAddMemberSubmit} variant="contained" color="primary">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour confirmer la suppression */}
        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <Typography>Êtes-vous sûr de vouloir supprimer ce groupe ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Groupes;
