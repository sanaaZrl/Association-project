import db from '../data/db.json';

class MembreService {
  constructor() {
    // Vérifier si des données existent dans le localStorage
    const savedMembres = localStorage.getItem('membres');
    if (savedMembres) {
      // Si oui, utiliser ces données
      this.membres = JSON.parse(savedMembres);
    } else {
      // Sinon, initialiser avec les données du JSON
      this.membres = db.membres;
      // Sauvegarder les données initiales dans le localStorage
      this.saveChanges();
    }
  }

  // Sauvegarder les modifications dans le localStorage
  saveChanges() {
    try {
      localStorage.setItem('membres', JSON.stringify(this.membres));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des membres:', error);
      return false;
    }
  }

  // Récupérer tous les membres
  getAllMembres() {
    try {
      // Toujours récupérer les données depuis le localStorage
      const membres = localStorage.getItem('membres');
      if (membres) {
        this.membres = JSON.parse(membres);
      }
      return this.membres;
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      return [];
    }
  }

  // Ajouter un nouveau membre
  addMembre(membre) {
    try {
      // Charger les données actuelles depuis le localStorage
      const currentMembres = this.getAllMembres();
      const newId = Math.max(...currentMembres.map(m => m.id), 0) + 1;
      const newMembre = { ...membre, id: newId };
      
      // Mettre à jour les membres
      this.membres = [...currentMembres, newMembre];
      
      // Sauvegarder les modifications
      this.saveChanges();
      return newMembre;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      throw error;
    }
  }

  // Mettre à jour un membre
  updateMembre(id, updatedMembre) {
    try {
      // Charger les données actuelles depuis le localStorage
      const currentMembres = this.getAllMembres();
      const index = currentMembres.findIndex(m => m.id === id);
      
      if (index !== -1) {
        // Mettre à jour le membre
        this.membres = [
          ...currentMembres.slice(0, index),
          { ...currentMembres[index], ...updatedMembre },
          ...currentMembres.slice(index + 1)
        ];
        
        // Sauvegarder les modifications
        this.saveChanges();
        return this.membres[index];
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre:', error);
      throw error;
    }
  }

  // Supprimer un membre
  deleteMembre(id) {
    try {
      // Charger les données actuelles depuis le localStorage
      const currentMembres = this.getAllMembres();
      
      // Filtrer le membre à supprimer
      this.membres = currentMembres.filter(m => m.id !== id);
      
      // Sauvegarder les modifications
      this.saveChanges();
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      throw error;
    }
  }

  // Activer/Désactiver un membre
  toggleMembreStatus(id) {
    try {
      // Charger les données actuelles depuis le localStorage
      const currentMembres = this.getAllMembres();
      const membre = currentMembres.find(m => m.id === id);
      
      if (membre) {
        // Mettre à jour le statut
        membre.actif = !membre.actif;
        
        // Sauvegarder les modifications
        this.saveChanges();
        return membre;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du changement de statut du membre:', error);
      throw error;
    }
  }

  // Récupérer un membre par son ID
  getMembreById(id) {
    try {
      // Charger les données actuelles depuis le localStorage
      const currentMembres = this.getAllMembres();
      const membre = currentMembres.find(m => m.id === id);
      return membre || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du membre:', error);
      throw error;
    }
  }
}

export default new MembreService(); 