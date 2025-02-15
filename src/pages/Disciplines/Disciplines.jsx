import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Disciplines = () => {
    const navigate = useNavigate();
    const [disciplines, setDisciplines] = useState([{ id: 1, nom: 'Basketball' }]);
    const [nouvelleDiscipline, setNouvelleDiscipline] = useState('');

    const ajouterDiscipline = () => {
        if (nouvelleDiscipline.trim() !== '') {
            setDisciplines([...disciplines, { id: Date.now(), nom: nouvelleDiscipline }]);
            setNouvelleDiscipline('');
        }
    };

    const supprimerDiscipline = (id) => {
        setDisciplines(disciplines.filter(discipline => discipline.id !== id));
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
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 2, bgcolor: '#FFFBF7' }}>
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
                    <ListItem
                        key={discipline.id}
                        secondaryAction={
                            <IconButton edge="end" color="error" onClick={() => supprimerDiscipline(discipline.id)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                        button
                        onClick={() => navigate(`/disciplines/categories/${discipline.id}`)}
                    >
                        {discipline.nom === 'Basketball' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SportsBasketballIcon sx={{ color: 'orange' }} />
                                <ListItemText primary={discipline.nom} />
                            </Box>
                        ) : (
                            <ListItemText primary={discipline.nom} />
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Disciplines;
