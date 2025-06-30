const evenementService = {
  evenements: [],
  lastId: 0,

  init() {
    try {
      const savedData = localStorage.getItem('evenementsData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.evenements = data.evenements;
        this.lastId = data.lastId;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.evenements = [];
      this.lastId = 0;
    }
  },

  getAllEvenements() {
    return this.evenements;
  },

  addEvenement(evenement) {
    this.lastId += 1;
    const newEvenement = {
      id: this.lastId,
      ...evenement
    };
    this.evenements.push(newEvenement);
    this.saveToLocalStorage();
    return newEvenement;
  },

  deleteEvenement(id) {
    this.evenements = this.evenements.filter(e => e.id !== id);
    this.saveToLocalStorage();
  },

  updateEvenement(id, updatedEvenement) {
    this.evenements = this.evenements.map(e => 
      e.id === id ? { ...e, ...updatedEvenement } : e
    );
    this.saveToLocalStorage();
  },

  saveToLocalStorage() {
    const data = {
      evenements: this.evenements,
      lastId: this.lastId
    };
    localStorage.setItem('evenementsData', JSON.stringify(data));
  }
};

// Initialiser le service au chargement
evenementService.init();

export default evenementService; 