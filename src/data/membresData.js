// Fonction pour sauvegarder les membres dans le localStorage
export const saveMembres = (membres) => {
  try {
    if (!Array.isArray(membres)) {
      console.error('Les données à sauvegarder ne sont pas un tableau');
      return false;
    }
    const membresString = JSON.stringify(membres);
    localStorage.setItem('membres', membresString);
    console.log('Membres sauvegardés avec succès:', membres);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des membres:', error);
    return false;
  }
};

// Fonction pour charger les membres depuis le localStorage
export const loadMembres = () => {
  try {
    const membresString = localStorage.getItem('membres');
    if (!membresString) {
      console.log('Aucun membre trouvé dans le localStorage');
      return [];
    }
    const membres = JSON.parse(membresString);
    if (!Array.isArray(membres)) {
      console.error('Les données chargées ne sont pas un tableau');
      return [];
    }
    console.log('Membres chargés depuis le localStorage:', membres);
    return membres;
  } catch (error) {
    console.error('Erreur lors du chargement des membres:', error);
    return [];
  }
};

// Données initiales des membres
export const initialMembres = [
  { id: 1, nom: 'El Amrani', prenom: 'Yassine', sexe: 'Homme', dateNaissance: '2006-08-12', adresse: 'Casablanca',
    email: 'yassine@gmail.com', telephone: '0600000001', certificatMedical: 'certificat1.pdf', dateExamen: '2024-01-10',
    discipline: 'Basketball', groupe: 'Groupe1', actif: false, montantRestant: 0 
  },
  { id: 2, nom: 'Benkirane', prenom: 'Sofia', sexe: 'Femme', dateNaissance: '2009-02-20', adresse: 'Casablanca',
    email: 'sofia@gmail.com', telephone: '0600000002', certificatMedical: 'certificat2.pdf', dateExamen: '2024-02-05',
    discipline: 'Basketball', groupe: 'Groupe2', actif: true, montantRestant: 0 
  },
  { id: 3, nom: 'Tahiri', prenom: 'Omar', sexe: 'Homme', dateNaissance: '2007-06-15', adresse: 'Casablanca',
    email: 'omar@gmail.com', telephone: '0600000003', certificatMedical: 'certificat3.pdf', dateExamen: '2023-12-20',
    discipline: 'Basketball', groupe: 'Groupe3', actif: true, montantRestant: 0
  },
  { id: 4, nom: 'Naciri', prenom: 'Leila', sexe: 'Femme', dateNaissance: '2006-11-30', adresse: 'Casablanca',
    email: 'leila@gmail.com', telephone: '0600000004', certificatMedical: 'certificat4.pdf', dateExamen: '2024-01-25',
    discipline: 'Basketball', groupe: 'Groupe4', actif: true, montantRestant: 0 
  },
  { id: 5, nom: 'Ouazzani', prenom: 'Hamza', sexe: 'Homme', dateNaissance: '2009-05-08', adresse: 'Casablanca',
    email: 'hamza@gmail.com', telephone: '0600000005', certificatMedical: 'certificat5.pdf', dateExamen: '2024-03-01',
    discipline: 'Basketball', groupe: 'Groupe1', actif: false, montantRestant: 0
  }
]; 