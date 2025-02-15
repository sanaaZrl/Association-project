import React, { useState } from 'react';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Typography, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    {
        "id": 1,
        "nom": "U17",
        "membres": [
          { "id": 1, "nom": "El Amrani", "prenom": "Yassine", "dateNaissance": "2006-08-12" },
          { "id": 4, "nom": "Naciri", "prenom": "Leila", "dateNaissance": "2006-11-30" },
          { "id": 12, "nom": "Bouzidi", "prenom": "Anas", "dateNaissance": "2006-05-30" }
        ]
      },
      {
        "id": 2,
        "nom": "U15",
        "membres": [
          { "id": 2, "nom": "Benkirane", "prenom": "Sofia", "dateNaissance": "2009-02-20" },
          { "id": 5, "nom": "Ouazzani", "prenom": "Hamza", "dateNaissance": "2009-05-08" },
          { "id": 9, "nom": "Rachidi", "prenom": "Sara", "dateNaissance": "2009-04-18" },
          { "id": 13, "nom": "Cherkaoui", "prenom": "Sara", "dateNaissance": "2009-01-15" }
        ]
      },
      {
        "id": 3,
        "nom": "U16",
        "membres": [
          { "id": 3, "nom": "Tahiri", "prenom": "Omar", "dateNaissance": "2007-06-15" },
          { "id": 6, "nom": "Zeroual", "prenom": "Karim", "dateNaissance": "2008-07-22" },
          { "id": 10, "nom": "Saidi", "prenom": "Youssef", "dateNaissance": "2007-03-25" },
          { "id": 14, "nom": "El Fassi", "prenom": "Younes", "dateNaissance": "2007-08-08" }
        ]
      },
      {
        "id": 4,
        "nom": "U18",
        "membres": [
          { "id": 8, "nom": "Khalidi", "prenom": "Mehdi", "dateNaissance": "2006-12-05" },
          { "id": 12, "nom": "Bouzidi", "prenom": "Anas", "dateNaissance": "2006-05-30" }
        ]
      }
  ]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { id: Date.now(), nom: newCategory, membres: [] }]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const toggleCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const theme = createTheme({
    palette: {
      blue: {
        main: '#024b95',
        contrastText: '#d7f6e7',
      },
    },
  });

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: '#FFFBF7' }}>
      <IconButton onClick={() => navigate('/disciplines')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <Typography variant="h6" sx={{ textAlign: 'center', color: '#003a68', fontWeight: 'bold', mb: 3 }}>
        Gestion des Catégories 
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField 
          fullWidth 
          variant='standard'
          label="Nouvelle Catégorie" 
          value={newCategory} 
          onChange={(e) => setNewCategory(e.target.value)} 
        />
        <ThemeProvider theme={theme}>
          <Button variant="contained" color="blue" onClick={handleAddCategory}>
            Ajouter
          </Button>
        </ThemeProvider>
      </Box>
      <List>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <ListItem 
              button 
              onClick={() => toggleCategory(category.id)}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <ListItemText primary={category.nom} />
              <Box>
                <IconButton edge="end" color="error" onClick={() => handleDeleteCategory(category.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => toggleCategory(category.id)}>
                  {expandedCategory === category.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </ListItem>
            <Collapse in={expandedCategory === category.id} timeout="auto" unmountOnExit>
              <List sx={{ pl: 4 }}>
                {category.membres.length > 0 ? (
                  category.membres.map((membre) => (
                    <ListItem key={membre.id} sx={{ borderBottom: '1px solid #ddd' }}>
                      <ListItemText 
                        primary={`${membre.nom} ${membre.prenom}`} 
                        secondary={`ID: ${membre.id} | Date de Naissance: ${membre.dateNaissance}`} 
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Aucun membre dans cette catégorie" />
                  </ListItem>
                )}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Categories;
