import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const Historique = () => {
  const { id } = useParams(); //Récupérer l'ID du membre depuis l'URL
  const navigate = useNavigate();
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    // 🔹 Simuler un appel API (remplacer par une vraie requête backend)
    const fakeData = [
      { date: '2024-01-10', montant: '50 DH', type: 'Mensuel' },
      { date: '2024-02-10', montant: '50 DH', type: 'Mensuel' },
      { date: '2024-03-10', montant: '50 DH', type: 'Mensuel' },
    ];
    setHistorique(fakeData);
  }, [id]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, boxShadow: 5, borderRadius: 2, bgcolor: '#FFFBF7' }}>
      <IconButton onClick={() => navigate('/paiements')} sx={{ position: 'absolute', top: 70, left: 60, color: '#003a68' }}>
        <ArrowBackIosNewIcon />
      </IconButton>

      <Typography variant="h5" sx={{ textAlign: 'center', color: '#003a68', fontWeight: 'bold', mb: 3 }}>
        Historique des paiements - Membre {id}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Date</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Montant</TableCell>
              <TableCell sx={{color: "#003a68", fontWeight: "bolder"}}>Type d'abonnement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historique.map((paiement, index) => (
              <TableRow key={index}>
                <TableCell>{paiement.date}</TableCell>
                <TableCell>{paiement.montant}</TableCell>
                <TableCell>{paiement.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Historique;
