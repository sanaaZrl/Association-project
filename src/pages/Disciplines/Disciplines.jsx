import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Box, Card, CardContent, Collapse, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const Disciplines = () => {
    const navigate = useNavigate();
    const [disciplines, setDisciplines] = useState([
        { 
            id: 1, 
            nom: 'Basketball',
            groupes: [
                {
                    id: 'Groupe1',
                    nom: 'Groupe 1',
                    membres: [
                        { id: 1, nom: 'El Amrani', prenom: 'Yassine' },
                        { id: 5, nom: 'Ouazzani', prenom: 'Hamza' }
                    ]
                },
                {
                    id: 'Groupe2',
                    nom: 'Groupe 2',
                    membres: [
                        { id: 2, nom: 'Benkirane', prenom: 'Sofia' },
                        { id: 6, nom: 'Zeroual', prenom: 'Karim' }
                    ]
                }
            ]
        }
    ]);
    const [expandedDiscipline, setExpandedDiscipline] = useState(null);
    const [expandedGroupes, setExpandedGroupes] = useState({});
    const [openAddMember, setOpenAddMember] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteGroup, setDeleteGroup] = useState(null);
    const [newMember, setNewMember] = useState({ id: '', nom: '', prenom: '' });
    const [nouvelleDiscipline, setNouvelleDiscipline] = useState('');

    const ajouterDiscipline = () => {
        if (nouvelleDiscipline.trim() !== '') {
            setDisciplines([...disciplines, { 
                id: Date.now(), 
                nom: nouvelleDiscipline,
                groupes: []
            }]);
            setNouvelleDiscipline('');
        }
    };

    const supprimerDiscipline = (id) => {
        setDisciplines(disciplines.filter(discipline => discipline.id !== id));
    };

    const handleExpandDiscipline = (id) => {
        setExpandedDiscipline(expandedDiscipline === id ? null : id);
    };

    const handleExpandGroupe = (disciplineId, groupeId) => {
        setExpandedGroupes(prev => ({
            ...prev,
            [`${disciplineId}-${groupeId}`]: !prev[`${disciplineId}-${groupeId}`]
        }));
    };

    const handleAddMember = (disciplineId, groupeId) => {
        setSelectedGroup({ disciplineId, groupeId });
        setOpenAddMember(true);
    };

    const handleCloseAddMember = () => {
        setOpenAddMember(false);
        setNewMember({ id: '', nom: '', prenom: '' });
    };

    const handleAddMemberSubmit = () => {
        if (newMember.id && newMember.nom && newMember.prenom) {
            setDisciplines(prev => prev.map(discipline => {
                if (discipline.id === selectedGroup.disciplineId) {
                    return {
                        ...discipline,
                        groupes: discipline.groupes.map(groupe => {
                            if (groupe.id === selectedGroup.groupeId) {
                                return {
                                    ...groupe,
                                    membres: [...groupe.membres, newMember]
                                };
                            }
                            return groupe;
                        })
                    };
                }
                return discipline;
            }));
            handleCloseAddMember();
        }
    };

    const handleDeleteGroup = (disciplineId, groupeId) => {
        const discipline = disciplines.find(d => d.id === disciplineId);
        const groupe = discipline.groupes.find(g => g.id === groupeId);
        
        if (groupe.membres.length > 0) {
            alert("Impossible de supprimer ce groupe car il contient des membres. Veuillez d'abord supprimer tous les membres.");
            return;
        }
        setDeleteGroup({ disciplineId, groupeId });
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        setDisciplines(prev => prev.map(discipline => {
            if (discipline.id === deleteGroup.disciplineId) {
                return {
                    ...discipline,
                    groupes: discipline.groupes.filter(g => g.id !== deleteGroup.groupeId)
                };
            }
            return discipline;
        }));
        setOpenDeleteDialog(false);
        setDeleteGroup(null);
    };

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

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1, p: 3, ml: 10 }}>
                <Typography variant="h5" sx={{ textAlign: 'center', color: '#003a68', fontWeight: 'bold', mb: 3, letterSpacing: '3px', textShadow: '2px 4px 3px rgba(0,0,0,0.3)' }}>
                    Gestion des Disciplines
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        fullWidth
                        variant='standard'
                        label="Nouvelle Discipline"
                        value={nouvelleDiscipline}
                        onChange={(e) => setNouvelleDiscipline(e.target.value)}
                    />
                    <ThemeProvider theme={theme}>
                        <Button variant="contained" color="blue" onClick={ajouterDiscipline}>
                            Ajouter
                        </Button>
                    </ThemeProvider>
                </Box>
                <List>
                    {disciplines.map((discipline) => (
                        <Card key={discipline.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SportsBasketballIcon sx={{ color: 'orange' }} />
                                        <Typography variant="h6">{discipline.nom}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton onClick={() => handleExpandDiscipline(discipline.id)}>
                                            <ExpandMoreIcon sx={{ transform: expandedDiscipline === discipline.id ? 'rotate(180deg)' : 'none' }} />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => supprimerDiscipline(discipline.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Collapse in={expandedDiscipline === discipline.id}>
                                    {discipline.groupes.map((groupe) => (
                                        <Card key={groupe.id} sx={{ mt: 2, ml: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle1">{groupe.nom}</Typography>
                                                    <Box>
                                                        <IconButton onClick={() => navigate(`/disciplines/planifier-entrainement/${discipline.id}/${groupe.id}`)}>
                                                            <CalendarMonthIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleAddMember(discipline.id, groupe.id)}>
                                                            <PersonAddAlt1Icon />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDeleteGroup(discipline.id, groupe.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleExpandGroupe(discipline.id, groupe.id)}
                                                            sx={{ transform: expandedGroupes[`${discipline.id}-${groupe.id}`] ? 'rotate(180deg)' : 'none' }}
                                                        >
                                                            <ExpandMoreIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Collapse in={expandedGroupes[`${discipline.id}-${groupe.id}`]}>
                                                    <List>
                                                        {groupe.membres.map((membre) => (
                                                            <ListItem key={membre.id}>
                                                                <ListItemText 
                                                                    primary={`${membre.nom} ${membre.prenom}`}
                                                                    secondary={`ID: ${membre.id}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Collapse>
                                            </CardContent>
                                        </Card>
                                    ))}
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

export default Disciplines;