import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Box, Card, CardContent, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Alert, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import RemoveIcon from '@mui/icons-material/Remove';

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
    const [openAddGroup, setOpenAddGroup] = useState(false);
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [newGroup, setNewGroup] = useState({ nom: '', description: '' });
    const [openDeleteMemberDialog, setOpenDeleteMemberDialog] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'warning' });

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

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const supprimerDiscipline = (id) => {
        const discipline = disciplines.find(d => d.id === id);
        const hasMembers = discipline.groupes.some(groupe => groupe.membres.length > 0);
        
        if (hasMembers) {
            setAlert({
                open: true,
                message: "Impossible de supprimer cette discipline car elle contient des groupes avec des membres. Veuillez d'abord supprimer tous les membres des groupes.",
                severity: 'warning'
            });
            return;
        }
        
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
            setAlert({
                open: true,
                message: "Impossible de supprimer ce groupe car il contient des membres. Veuillez d'abord supprimer tous les membres.",
                severity: 'warning'
            });
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

    const handleAddGroup = (disciplineId) => {
        setSelectedDiscipline(disciplineId);
        setOpenAddGroup(true);
    };

    const handleCloseAddGroup = () => {
        setOpenAddGroup(false);
        setNewGroup({ nom: '', description: '' });
    };

    const handleAddGroupSubmit = () => {
        if (newGroup.nom.trim()) {
            setDisciplines(prev => prev.map(discipline => {
                if (discipline.id === selectedDiscipline) {
                    return {
                        ...discipline,
                        groupes: [...discipline.groupes, {
                            id: `Groupe${discipline.groupes.length + 1}`,
                            nom: newGroup.nom,
                            description: newGroup.description,
                            membres: []
                        }]
                    };
                }
                return discipline;
            }));
            handleCloseAddGroup();
        }
    };

    const handleDeleteMember = (disciplineId, groupeId, memberId) => {
        setMemberToDelete({ disciplineId, groupeId, memberId });
        setOpenDeleteMemberDialog(true);
    };

    const handleConfirmDeleteMember = () => {
        setDisciplines(prev => prev.map(discipline => {
            if (discipline.id === memberToDelete.disciplineId) {
                return {
                    ...discipline,
                    groupes: discipline.groupes.map(groupe => {
                        if (groupe.id === memberToDelete.groupeId) {
                            return {
                                ...groupe,
                                membres: groupe.membres.filter(membre => membre.id !== memberToDelete.memberId)
                            };
                        }
                        return groupe;
                    })
                };
            }
            return discipline;
        }));
        setOpenDeleteMemberDialog(false);
        setMemberToDelete(null);
    };

    const theme = createTheme({
        palette: {
            blue: {
                main: '#024b95',
                light: '#01569e',
                dark: '#01569e',
                contrastText: '#d7f6e7',
            },
            blueInverse: {
                main: '#01569e',
                light: '#024b95',
                dark: '#024b95',
                contrastText: '#024b95',
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
                                        <Tooltip title="Afficher/Masquer les groupes">
                                            <IconButton onClick={() => handleExpandDiscipline(discipline.id)}>
                                                <ExpandMoreIcon sx={{ transform: expandedDiscipline === discipline.id ? 'rotate(180deg)' : 'none' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Ajouter un groupe">
                                            <IconButton onClick={() => handleAddGroup(discipline.id)}>
                                                <GroupAddIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Supprimer la discipline">
                                            <IconButton color="error" onClick={() => supprimerDiscipline(discipline.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                                <Collapse in={expandedDiscipline === discipline.id}>
                                    {discipline.groupes.map((groupe) => (
                                        <Card key={groupe.id} sx={{ mt: 2, ml: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle1">{groupe.nom}</Typography>
                                                    <Box>
                                                        <Tooltip title="Planifier un entraînement">
                                                            <IconButton onClick={() => navigate(`/disciplines/planifier-entrainement/${discipline.id}/${groupe.id}`)}>
                                                                <CalendarMonthIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Ajouter un membre">
                                                            <IconButton onClick={() => handleAddMember(discipline.id, groupe.id)}>
                                                                <PersonAddAlt1Icon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Supprimer le groupe">
                                                            <IconButton onClick={() => handleDeleteGroup(discipline.id, groupe.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Afficher/Masquer les membres">
                                                            <IconButton
                                                                onClick={() => handleExpandGroupe(discipline.id, groupe.id)}
                                                                sx={{ transform: expandedGroupes[`${discipline.id}-${groupe.id}`] ? 'rotate(180deg)' : 'none' }}
                                                            >
                                                                <ExpandMoreIcon />
                                                            </IconButton>
                                                        </Tooltip>
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
                                                                <Tooltip title="Supprimer le membre">
                                                                    <IconButton 
                                                                        onClick={() => handleDeleteMember(discipline.id, groupe.id, membre.id)}
                                                                        color="error"
                                                                    >
                                                                        <RemoveIcon />
                                                                    </IconButton>
                                                                </Tooltip>
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
                    <DialogTitle sx={{ 
                        boxShadow: 1, 
                        fontStyle: 'italic', 
                        fontFamily: 'Serif', 
                        color: '#024b95'
                    }}>
                        Ajouter un membre
                    </DialogTitle>
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
                        <ThemeProvider theme={theme}>
                            <Button onClick={handleCloseAddMember} color="blueInverse">Annuler</Button>
                        </ThemeProvider>
                        <ThemeProvider theme={theme}>
                            <Button onClick={handleAddMemberSubmit} variant="contained" color="blue">
                                Ajouter
                            </Button>
                        </ThemeProvider>
                    </DialogActions>
                </Dialog>

                {/* Dialog pour confirmer la suppression */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogContent>
                        <Typography>Êtes-vous sûr de vouloir supprimer ce groupe ?</Typography>
                    </DialogContent>
                    <DialogActions>
                    <ThemeProvider theme={theme}>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="blueInverse">Annuler</Button>
                    </ThemeProvider>
                    <ThemeProvider theme={theme}>
                        <Button onClick={handleConfirmDelete} color="red" variant="contained">
                            Supprimer
                        </Button>
                     </ThemeProvider>
                    </DialogActions>
                </Dialog>

                {/* Dialog pour ajouter un groupe */}
                <Dialog open={openAddGroup} onClose={handleCloseAddGroup}>
                    <DialogTitle sx={{ 
                        boxShadow: 1, 
                        fontStyle: 'italic', 
                        fontFamily: 'Serif',
                        color: '#024b95'
                    }}>
                        Ajouter un groupe
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nom du groupe"
                            fullWidth
                            value={newGroup.nom}
                            onChange={(e) => setNewGroup({ ...newGroup, nom: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Description (facultatif)"
                            fullWidth
                            multiline
                            rows={3}
                            value={newGroup.description}
                            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <ThemeProvider theme={theme}>
                            <Button onClick={handleCloseAddGroup} color="blueInverse">Annuler</Button>
                        </ThemeProvider>
                        <ThemeProvider theme={theme}>
                            <Button onClick={handleAddGroupSubmit} variant="contained" color="blue">
                                Ajouter
                            </Button>
                        </ThemeProvider>
                    </DialogActions>
                </Dialog>

                {/* Dialog pour confirmer la suppression d'un membre */}
                <Dialog open={openDeleteMemberDialog} onClose={() => setOpenDeleteMemberDialog(false)}>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogContent>
                        <Typography>Êtes-vous sûr de vouloir supprimer ce membre du groupe ?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <ThemeProvider theme={theme}>
                            <Button onClick={() => setOpenDeleteMemberDialog(false)} color="blueInverse">
                                Annuler
                            </Button>
                        </ThemeProvider>
                        <ThemeProvider theme={theme}>
                            <Button onClick={handleConfirmDeleteMember} color="red" variant="contained">
                                Supprimer
                            </Button>
                        </ThemeProvider>
                    </DialogActions>
                </Dialog>

                {/* Snackbar pour afficher les alertes */}
                <Snackbar 
                    open={alert.open} 
                    autoHideDuration={6000} 
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseAlert} 
                        severity={alert.severity}
                        sx={{ width: '100%' }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default Disciplines;