-- Création de la base de données
CREATE DATABASE IF NOT EXISTS project_association;
USE project_association;

-- Table des adhérents
CREATE TABLE IF NOT EXISTS adherents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    date_inscription DATE NOT NULL,
    date_naissance DATE,
    profession VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des types d'abonnement
CREATE TABLE IF NOT EXISTS types_abonnement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    duree_mois INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des abonnements
CREATE TABLE IF NOT EXISTS abonnements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    adherent_id INT NOT NULL,
    type_abonnement_id INT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    statut ENUM('actif', 'inactif', 'expiré') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (adherent_id) REFERENCES adherents(id) ON DELETE CASCADE,
    FOREIGN KEY (type_abonnement_id) REFERENCES types_abonnement(id)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS paiements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    abonnement_id INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    montant_restant DECIMAL(10,2) NOT NULL,
    date_paiement DATE NOT NULL,
    mode_paiement ENUM('espèces', 'chèque', 'virement', 'carte') NOT NULL,
    preuve_paiement VARCHAR(255),
    statut ENUM('complet', 'partiel', 'en_attente') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (abonnement_id) REFERENCES abonnements(id) ON DELETE CASCADE
);

-- Table des événements
CREATE TABLE IF NOT EXISTS evenements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    lieu VARCHAR(255),
    capacite INT,
    prix DECIMAL(10,2),
    statut ENUM('planifié', 'en_cours', 'terminé', 'annulé') DEFAULT 'planifié',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table de participation aux événements
CREATE TABLE IF NOT EXISTS participations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    adherent_id INT NOT NULL,
    evenement_id INT NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('inscrit', 'présent', 'absent') DEFAULT 'inscrit',
    FOREIGN KEY (adherent_id) REFERENCES adherents(id) ON DELETE CASCADE,
    FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE
);

-- Table des utilisateurs (pour l'administration)
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom_utilisateur VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'gestionnaire', 'membre') NOT NULL,
    statut ENUM('actif', 'inactif') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS logs_activite (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- Insertion des types d'abonnement par défaut
INSERT INTO types_abonnement (nom, duree_mois, montant, description) VALUES
('Mensuel', 1, 200.00, 'Abonnement mensuel'),
('Trimestriel', 3, 500.00, 'Abonnement trimestriel'),
('Annuel', 12, 1800.00, 'Abonnement annuel');

-- Création d'un utilisateur administrateur par défaut
INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe, role) VALUES
('admin', 'admin@association.com', '$2a$10$YourHashedPasswordHere', 'admin'); 