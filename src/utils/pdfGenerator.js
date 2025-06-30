import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateHistoriquePDF = (paiement, historique) => {
    // Créer un nouveau document PDF
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Définir la police et la taille
    doc.setFont('helvetica');
    
    // Ajouter le titre
    doc.setFontSize(24);
    doc.setTextColor(0, 58, 104); // #003a68
    doc.text('HISTORIQUE DES PAIEMENTS', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Informations de l'adhérent
    doc.setFontSize(16);
    doc.setTextColor(250, 135, 11); // #fa870b
    doc.text('Informations de l\'adhérent', 15, 40);

    // Détails de l'adhérent
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`ID: ${paiement.id}`, 15, 50);
    doc.text(`Nom: ${paiement.nom}`, 15, 57);
    doc.text(`Prénom: ${paiement.prenom}`, 15, 64);

    // Titre de la section historique
    doc.setFontSize(16);
    doc.setTextColor(250, 135, 11);
    doc.text('Historique des transactions', 15, 80);

    // Préparer les données pour le tableau
    const tableData = historique.map(transaction => [
        transaction.date,
        transaction.montant,
        transaction.montantPaye || 'N/A',
        transaction.montantRestant || 'N/A',
        transaction.type,
        transaction.estPaiementPartiel ? 'Paiement partiel' : 'Paiement initial'
    ]);

    // Définir les colonnes du tableau
    const columns = [
        'Date',
        'Montant d\'origine',
        'Montant payé',
        'Montant restant',
        'Type d\'abonnement',
        'Type de paiement'
    ];

    // Ajouter le tableau
    doc.autoTable({
        startY: 85,
        head: [columns],
        body: tableData,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 3,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: [0, 58, 104],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        columnStyles: {
            0: { cellWidth: 25 }, // Date
            1: { cellWidth: 30 }, // Montant d'origine
            2: { cellWidth: 30 }, // Montant payé
            3: { cellWidth: 30 }, // Montant restant
            4: { cellWidth: 35 }, // Type d'abonnement
            5: { cellWidth: 40 }  // Type de paiement
        },
    });

    // Ajouter le pied de page avec numéro de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Page ${i} sur ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    // Sauvegarder le PDF
    doc.save(`historique_paiements_${paiement.nom}_${paiement.prenom}_${paiement.id}.pdf`);
}; 