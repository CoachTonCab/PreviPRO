// Barème fiscal officiel des indemnités kilométriques 2024
// Source: Bulletin officiel des finances publiques-impôts
const BAREME_IK = {
    thermique: {
        // Jusqu'à 5000 km : d × taux
        seuil1: {
            1: 0.529, 2: 0.529, 3: 0.529, // 3 CV et moins
            4: 0.606, // 4 CV
            5: 0.636, // 5 CV
            6: 0.665, // 6 CV
            7: 0.697, 8: 0.697, 9: 0.697, 10: 0.697 // 7 CV et plus
        },
        // De 5001 à 20000 km : (d × taux) + fixe
        seuil2: {
            1: { taux: 0.316, fixe: 1065 }, 
            2: { taux: 0.316, fixe: 1065 }, 
            3: { taux: 0.316, fixe: 1065 }, // 3 CV et moins
            4: { taux: 0.340, fixe: 1330 }, // 4 CV
            5: { taux: 0.357, fixe: 1395 }, // 5 CV
            6: { taux: 0.374, fixe: 1457 }, // 6 CV
            7: { taux: 0.394, fixe: 1515 }, // 7 CV et plus
            8: { taux: 0.394, fixe: 1515 },
            9: { taux: 0.394, fixe: 1515 },
            10: { taux: 0.394, fixe: 1515 }
        },
        // Plus de 20000 km : d × taux
        seuil3: {
            1: 0.370, 2: 0.370, 3: 0.370, // 3 CV et moins
            4: 0.407, // 4 CV
            5: 0.427, // 5 CV
            6: 0.447, // 6 CV
            7: 0.470, 8: 0.470, 9: 0.470, 10: 0.470 // 7 CV et plus
        }
    },
    hybride: {
        // Majoration de 20% sur les thermiques
        // Jusqu'à 5000 km
        seuil1: {
            1: 0.635, 2: 0.635, 3: 0.635,
            4: 0.727,
            5: 0.763,
            6: 0.798,
            7: 0.836, 8: 0.836, 9: 0.836, 10: 0.836
        },
        // De 5001 à 20000 km
        seuil2: {
            1: { taux: 0.379, fixe: 1278 },
            2: { taux: 0.379, fixe: 1278 },
            3: { taux: 0.379, fixe: 1278 },
            4: { taux: 0.408, fixe: 1596 },
            5: { taux: 0.428, fixe: 1674 },
            6: { taux: 0.449, fixe: 1748 },
            7: { taux: 0.473, fixe: 1818 },
            8: { taux: 0.473, fixe: 1818 },
            9: { taux: 0.473, fixe: 1818 },
            10: { taux: 0.473, fixe: 1818 }
        },
        // Plus de 20000 km
        seuil3: {
            1: 0.444, 2: 0.444, 3: 0.444,
            4: 0.488,
            5: 0.512,
            6: 0.536,
            7: 0.564, 8: 0.564, 9: 0.564, 10: 0.564
        }
    },
    electrique: {
        // Barème officiel pour voitures 100% électriques
        // Jusqu'à 5000 km : d × taux
        seuil1: {
            1: 0.635, 2: 0.635, 3: 0.635, // 3 CV et moins
            4: 0.727, // 4 CV
            5: 0.763, // 5 CV
            6: 0.798, // 6 CV
            7: 0.836, 8: 0.836, 9: 0.836, 10: 0.836 // 7 CV et plus
        },
        // De 5001 à 20000 km : (d × taux) + fixe
        seuil2: {
            1: { taux: 0.379, fixe: 1278 },
            2: { taux: 0.379, fixe: 1278 },
            3: { taux: 0.379, fixe: 1278 }, // 3 CV et moins
            4: { taux: 0.408, fixe: 1596 }, // 4 CV
            5: { taux: 0.428, fixe: 1674 }, // 5 CV
            6: { taux: 0.449, fixe: 1748 }, // 6 CV
            7: { taux: 0.473, fixe: 1818 }, // 7 CV et plus
            8: { taux: 0.473, fixe: 1818 },
            9: { taux: 0.473, fixe: 1818 },
            10: { taux: 0.473, fixe: 1818 }
        },
        // Plus de 20000 km : d × taux
        seuil3: {
            1: 0.444, 2: 0.444, 3: 0.444, // 3 CV et moins
            4: 0.488, // 4 CV
            5: 0.512, // 5 CV
            6: 0.536, // 6 CV
            7: 0.564, 8: 0.564, 9: 0.564, 10: 0.564 // 7 CV et plus
        }
    }
};

// Fonction pour obtenir la valeur pour un CV donné
function getCVValue(cv) {
    if (cv <= 3) return 3;
    if (cv <= 6) return cv;
    return 7; // 7 CV et plus
}

// Fonction pour obtenir les valeurs du barème selon le CV
function getValeurBareme(type, puissance, seuil) {
    const bareme = BAREME_IK[type];
    if (!bareme) return null;
    
    const cv = Math.round(puissance);
    const cvKey = getCVValue(cv);
    const tauxSeuil = bareme[seuil];
    
    return tauxSeuil[cvKey] || null;
}

// Fonction pour calculer les IK selon le barème officiel
// Le barème fiscal fonctionne ainsi :
// - Tranche 1 (≤5000 km) : d × taux
// - Tranche 2 (5001-20000 km) : (d × taux) + fixe (formule appliquée sur toute la distance d)
// - Tranche 3 (>20000 km) : on calcule d'abord jusqu'à 20000 avec la formule tranche 2, puis on ajoute la partie au-delà × taux3
function calculerIK(type, puissance, kmMois) {
    const kmAnnuels = kmMois * 12;
    
    let ik = 0;
    
    if (kmAnnuels <= 5000) {
        // Tranche 1 : jusqu'à 5000 km - Formule : d × taux
        const taux1 = getValeurBareme(type, puissance, 'seuil1');
        if (taux1) {
            ik = kmAnnuels * taux1;
        }
    } else if (kmAnnuels <= 20000) {
        // Tranche 2 : de 5001 à 20000 km - Formule : (d × taux) + fixe
        // La formule s'applique sur toute la distance d (pas seulement la partie > 5000)
        const taux2 = getValeurBareme(type, puissance, 'seuil2');
        if (taux2 && typeof taux2 === 'object' && taux2.taux && taux2.fixe) {
            ik = (kmAnnuels * taux2.taux) + taux2.fixe;
        }
    } else {
        // Plus de 20000 km : on calcule d'abord jusqu'à 20000 avec la formule tranche 2
        const taux2 = getValeurBareme(type, puissance, 'seuil2');
        if (taux2 && typeof taux2 === 'object' && taux2.taux && taux2.fixe) {
            ik = (20000 * taux2.taux) + taux2.fixe;
        }
        
        // Puis on ajoute la partie au-delà de 20000 km
        const taux3 = getValeurBareme(type, puissance, 'seuil3');
        if (taux3) {
            ik += (kmAnnuels - 20000) * taux3;
        }
    }
    
    return {
        annuel: ik,
        mensuel: ik / 12,
        kmAnnuels: kmAnnuels
    };
}

// Variables globales pour stocker les biens amortissables
let biensAmortissables = [];

// Fonction pour formater les nombres en euros
function formatEuro(montant) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(montant);
}

// Fonction pour obtenir une valeur numérique depuis un input
function getValue(id) {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
}

// Calculs hebdomadaires - Nouvelle version avec jours et demi-journées
function calculerHebdomadaire() {
    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    let seancesSemaine = 0;
    let joursTravailles = 0;
    
    jours.forEach(jour => {
        let jourTravaille = false;
        
        // Matin
        const matinCheck = document.querySelector(`.travaille-matin[data-jour="${jour}"]`);
        if (matinCheck && matinCheck.checked) {
            const seancesMatin = parseInt(document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="matin"]`)?.value || 0);
            seancesSemaine += seancesMatin;
            jourTravaille = true;
        }
        
        // Après-midi
        const apresMidiCheck = document.querySelector(`.travaille-apres-midi[data-jour="${jour}"]`);
        if (apresMidiCheck && apresMidiCheck.checked) {
            const seancesApresMidi = parseInt(document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="apres-midi"]`)?.value || 0);
            seancesSemaine += seancesApresMidi;
            jourTravaille = true;
        }
        
        if (jourTravaille) {
            joursTravailles++;
        }
    });
    
    document.getElementById('seances-semaine').textContent = seancesSemaine;
    document.getElementById('jours-semaine-calc').textContent = joursTravailles;
    
    return { joursSemaine: joursTravailles, seancesSemaine };
}

// Calculs annuels
function calculerAnnuel() {
    const { seancesSemaine, joursSemaine } = calculerHebdomadaire();
    const semainesVacances = getValue('semaines-vacances');
    const joursFeries = getValue('jours-feries');
    
    // 1. Calculer les semaines réellement travaillées (53 semaines pour 2026 - semaines de vacances)
    const semainesTravaillees = 53 - semainesVacances;
    
    // 2. Calculer les jours travaillés dans l'année
    // (semaines travaillées × jours par semaine) - jours fériés
    const joursTravailleesAnnuel = (semainesTravaillees * joursSemaine) - joursFeries;
    
    // 3. Calculer les séances annuelles
    // Séances par semaine × semaines travaillées - séances perdues à cause des jours fériés
    // Pour calculer les séances perdues : (séances par semaine / jours par semaine) × jours fériés
    const seancesParJour = joursSemaine > 0 ? seancesSemaine / joursSemaine : 0;
    const seancesPerduesJoursFeries = seancesParJour * joursFeries;
    const seancesAnnuelles = (seancesSemaine * semainesTravaillees) - seancesPerduesJoursFeries;
    
    document.getElementById('semaines-travaillees').textContent = semainesTravaillees;
    document.getElementById('jours-travaillees-annuel').textContent = joursTravailleesAnnuel;
    document.getElementById('seances-annuelles').textContent = Math.round(seancesAnnuelles);
    
    return { semainesTravaillees, joursTravailleesAnnuel, seancesAnnuelles: Math.round(seancesAnnuelles) };
}

// Calcul du CA
function calculerCA() {
    const { seancesAnnuelles } = calculerAnnuel();
    const prixSeance = getValue('prix-seance');
    
    // Utiliser le taux de base si un scénario est actif, sinon utiliser le taux actuel
    let tauxRemplissage = getValue('taux-remplissage') / 100;
    
    if (scenarioActuel && tauxRemplissageBase !== null) {
        // Appliquer le multiplicateur du scénario au taux de base
        switch(scenarioActuel) {
            case 'optimiste':
                tauxRemplissage = Math.min(1, (tauxRemplissageBase / 100) * 1.1);
                break;
            case 'pessimiste':
                tauxRemplissage = Math.max(0, (tauxRemplissageBase / 100) * 0.9);
                break;
            case 'realiste':
                tauxRemplissage = tauxRemplissageBase / 100;
                break;
        }
    }
    
    const caAnnuelBrut = seancesAnnuelles * prixSeance * tauxRemplissage;
    const caMensuel = caAnnuelBrut / 12;
    
    // Calcul de la redevance selon le type choisi
    let redevanceAnnuelle = 0;
    const redevanceType = document.querySelector('input[name="redevance-type"]:checked')?.value;
    
    if (redevanceType === 'pourcentage') {
        const tauxRedevance = getValue('redevance-pourcentage-input') / 100;
        redevanceAnnuelle = caAnnuelBrut * tauxRedevance;
    } else if (redevanceType === 'fixe') {
        redevanceAnnuelle = getValue('redevance-fixe-input');
    }
    
    document.getElementById('ca-annuel-brut').textContent = formatEuro(caAnnuelBrut);
    document.getElementById('ca-mensuel').textContent = formatEuro(caMensuel);
    
    if (redevanceAnnuelle > 0) {
        document.getElementById('redevance-annuelle').textContent = formatEuro(redevanceAnnuelle);
        document.getElementById('redevance-result').style.display = 'block';
    } else {
        document.getElementById('redevance-result').style.display = 'none';
    }
    
    return { caAnnuelBrut, caMensuel, redevanceAnnuelle };
}

// Calcul des charges
function calculerCharges() {
    const chargesIds = [
        'charge-petit-materiel', 'charge-loyer', 'charge-locatives',
        'charge-logiciels', 'charge-telephone', 'charge-assurances',
        'charge-mutuelle', 'charge-honoraires', 'charge-repas',
        'charge-deplacement', 'charge-formations', 'charge-bancaires',
        'charge-cfe', 'charge-interets'
    ];
    
    let totalMensuel = 0;
    chargesIds.forEach(id => {
        const montantMensuel = getValue(id);
        totalMensuel += montantMensuel;
        
        // Mettre à jour l'affichage annuel pour chaque charge
        const montantAnnuel = montantMensuel * 12;
        const annuelElement = document.getElementById(id + '-annuel');
        if (annuelElement) {
            annuelElement.textContent = formatEuro(montantAnnuel) + '/an';
        }
    });
    
    const totalAnnuel = totalMensuel * 12;
    
    document.getElementById('total-charges-mensuel').textContent = formatEuro(totalMensuel);
    document.getElementById('total-charges-annuel').textContent = formatEuro(totalAnnuel);
    
    return { totalMensuel, totalAnnuel };
}

// Calcul des IK
function calculerIKTotal() {
    const utiliseVehicule = document.getElementById('utilise-vehicule').checked;
    const ikDetails = document.getElementById('ik-details');
    
    if (!utiliseVehicule) {
        ikDetails.style.display = 'none';
        document.getElementById('ik-annuel').textContent = formatEuro(0);
        document.getElementById('ik-mensuel').textContent = formatEuro(0);
        document.getElementById('km-annuels').textContent = '0';
        return 0;
    }
    
    ikDetails.style.display = 'block';
    const type = document.getElementById('type-vehicule').value;
    const puissance = getValue('puissance-fiscale');
    const kmMois = getValue('km-mois');
    
    const ik = calculerIK(type, puissance, kmMois);
    
    document.getElementById('ik-annuel').textContent = formatEuro(ik.annuel);
    document.getElementById('ik-mensuel').textContent = formatEuro(ik.mensuel);
    document.getElementById('km-annuels').textContent = ik.kmAnnuels.toLocaleString('fr-FR');
    
    return ik.annuel;
}

// Calcul des amortissements
function calculerAmortissements() {
    let total = 0;
    biensAmortissables.forEach(bien => {
        if (bien.prix > 0 && bien.duree > 0) {
            total += bien.prix / bien.duree;
        }
    });
    
    document.getElementById('total-amortissements').textContent = formatEuro(total);
    return total;
}

// Gestion des biens amortissables
let formulaireAmortissementOuvert = false;
let bienEnModification = null; // ID du bien en cours de modification

function ouvrirFormulaireAmortissement() {
    const container = document.getElementById('amortissements-list');
    const formulaireExistant = container.querySelector('.amortissement-formulaire');
    
    if (formulaireExistant && bienEnModification === null) {
        formulaireExistant.remove();
        formulaireAmortissementOuvert = false;
        return;
    }
    
    // Si on ferme pendant une modification, annuler la modification
    if (formulaireExistant && bienEnModification !== null) {
        bienEnModification = null;
        formulaireExistant.remove();
        formulaireAmortissementOuvert = false;
        return;
    }
    
    formulaireAmortissementOuvert = true;
    const formulaireDiv = document.createElement('div');
    formulaireDiv.className = 'amortissement-formulaire';
    formulaireDiv.innerHTML = `
        <div class="form-group">
            <label>Nom du bien</label>
            <input type="text" id="nouveau-bien-nom" placeholder="Ex: Ordinateur" value="">
        </div>
        <div class="form-group">
            <label>Prix d'achat (€)</label>
            <input type="number" id="nouveau-bien-prix" min="0" step="0.01" placeholder="0" value="0">
        </div>
        <div class="form-group">
            <label>Durée d'amortissement (années)</label>
            <input type="number" id="nouveau-bien-duree" min="1" step="1" placeholder="3" value="3">
        </div>
        <button type="button" class="btn-add-amortissement" id="btn-confirm-ajouter-bien">Ajouter</button>
    `;
    container.appendChild(formulaireDiv);
    
    // Attacher l'événement listener au bouton
    const btnConfirm = document.getElementById('btn-confirm-ajouter-bien');
    if (btnConfirm) {
        btnConfirm.addEventListener('click', confirmerAjouterBien);
    }
}

function confirmerAjouterBien() {
    const nom = document.getElementById('nouveau-bien-nom').value.trim();
    const prix = parseFloat(document.getElementById('nouveau-bien-prix').value) || 0;
    const duree = parseInt(document.getElementById('nouveau-bien-duree').value) || 3;
    
    if (!nom) {
        alert('Veuillez entrer un nom pour le bien');
        return;
    }
    
    if (prix <= 0) {
        alert('Veuillez entrer un prix valide');
        return;
    }
    
    // Si on modifie un bien existant
    if (bienEnModification !== null) {
        const bien = biensAmortissables.find(b => b.id === bienEnModification);
        if (bien) {
            bien.nom = nom;
            bien.prix = prix;
            bien.duree = duree;
        }
        bienEnModification = null;
    } else {
        // Sinon, créer un nouveau bien
        const id = Date.now();
        biensAmortissables.push({
            id: id,
            nom: nom,
            prix: prix,
            duree: duree
        });
    }
    
    // Fermer le formulaire
    const formulaire = document.querySelector('.amortissement-formulaire');
    if (formulaire) {
        formulaire.remove();
        formulaireAmortissementOuvert = false;
    }
    
    renderAmortissements();
    calculerTout();
}

function modifierBienAmortissable(id) {
    const bien = biensAmortissables.find(b => b.id === id);
    if (!bien) return;
    
    // Marquer ce bien comme étant en modification
    bienEnModification = id;
    
    // Fermer le formulaire s'il est déjà ouvert
    const formulaireExistant = document.querySelector('.amortissement-formulaire');
    if (formulaireExistant) {
        formulaireExistant.remove();
        formulaireAmortissementOuvert = false;
    }
    
    // Ouvrir le formulaire avec les valeurs pré-remplies
    ouvrirFormulaireAmortissement();
    
    // Attendre que le DOM soit mis à jour avant de remplir les champs
    setTimeout(() => {
        const nomInput = document.getElementById('nouveau-bien-nom');
        const prixInput = document.getElementById('nouveau-bien-prix');
        const dureeInput = document.getElementById('nouveau-bien-duree');
        
        if (nomInput) nomInput.value = bien.nom;
        if (prixInput) prixInput.value = bien.prix;
        if (dureeInput) dureeInput.value = bien.duree;
    }, 10);
}

function supprimerBienAmortissable(id) {
    biensAmortissables = biensAmortissables.filter(b => b.id !== id);
    renderAmortissements();
    calculerTout();
}

// Rendre les fonctions accessibles globalement
window.supprimerBienAmortissable = supprimerBienAmortissable;
window.modifierBienAmortissable = modifierBienAmortissable;

function renderAmortissements() {
    const container = document.getElementById('amortissements-list');
    
    // Garder le formulaire s'il est ouvert
    const formulaire = container.querySelector('.amortissement-formulaire');
    const formulaireHTML = formulaire ? formulaire.outerHTML : '';
    
    container.innerHTML = '';
    
    // Réafficher le formulaire s'il était ouvert
    if (formulaireHTML && formulaireAmortissementOuvert) {
        container.innerHTML = formulaireHTML;
        const btnConfirm = document.getElementById('btn-confirm-ajouter-bien');
        if (btnConfirm) {
            btnConfirm.addEventListener('click', confirmerAjouterBien);
        }
    }
    
    // Afficher les biens ajoutés sous forme de récapitulatifs
    biensAmortissables.forEach((bien) => {
        const amortissementAnnuel = bien.prix > 0 && bien.duree > 0 ? bien.prix / bien.duree : 0;
        const recapDiv = document.createElement('div');
        recapDiv.className = 'amortissement-recap';
        recapDiv.innerHTML = `
            <div class="amortissement-recap-content">
                <div class="amortissement-recap-info">
                    <div class="amortissement-recap-nom">${bien.nom || 'Bien sans nom'}</div>
                    <div class="amortissement-recap-details">
                        Prix : ${formatEuro(bien.prix)} | Durée : ${bien.duree} an${bien.duree > 1 ? 's' : ''} | Amortissement annuel : <strong>${formatEuro(amortissementAnnuel)}</strong>
                    </div>
                </div>
                <div class="amortissement-recap-actions">
                    <button type="button" class="btn-edit-amortissement" onclick="modifierBienAmortissable(${bien.id})">Modifier</button>
                    <button type="button" class="btn-delete-amortissement" onclick="supprimerBienAmortissable(${bien.id})">Supprimer</button>
                </div>
            </div>
        `;
        container.appendChild(recapDiv);
    });
}

// Calcul global
function calculerTout() {
    const { caAnnuelBrut, redevanceAnnuelle } = calculerCA();
    const { totalAnnuel } = calculerCharges();
    const ikAnnuel = calculerIKTotal();
    const amortissements = calculerAmortissements();
    
    // La redevance est déduite du résultat (c'est une charge basée sur le CA)
    const totalChargesAvecRedevance = totalAnnuel + redevanceAnnuelle;
    
    // Résultat avant cotisations
    const resultatAvantCotisations = caAnnuelBrut - totalChargesAvecRedevance - ikAnnuel - amortissements;
    
    // Affichage des résultats
    // Chiffre d'affaires annuel
    const caElement = document.getElementById('result-ca');
    caElement.textContent = formatEuro(caAnnuelBrut);
    caElement.className = 'result-main-value positive';
    
    // Dépenses annuelles - détails
    document.getElementById('result-charges').textContent = formatEuro(totalChargesAvecRedevance);
    document.getElementById('result-ik').textContent = formatEuro(ikAnnuel);
    document.getElementById('result-amortissements').textContent = formatEuro(amortissements);
    
    // Total des dépenses
    const totalDepenses = totalChargesAvecRedevance + ikAnnuel + amortissements;
    document.getElementById('result-total-depenses').textContent = formatEuro(totalDepenses);
    
    // Résultat avant cotisations
    const resultElement = document.getElementById('result-avant-cotisations');
    resultElement.textContent = formatEuro(resultatAvantCotisations);
    
    // Changer la couleur selon le résultat (style simple sans fond coloré)
    if (resultatAvantCotisations > 0) {
        resultElement.className = 'result-main-value positive';
    } else if (resultatAvantCotisations < 0) {
        resultElement.className = 'result-main-value negative';
    } else {
        resultElement.className = 'result-main-value';
    }
    
    // Mettre à jour les prévisualisations des scénarios
    mettreAJourScenarios();
}

// Fonction pour charger le logo avec plusieurs formats
function chargerLogo() {
    const logoImg = document.getElementById('logo-img');
    if (!logoImg) return;
    
    const formats = ['logo.png', 'logo.jpg', 'logo.jpeg', 'logo.svg', 'Logo.png', 'Logo.jpg', 'Logo.jpeg', 'Logo.svg'];
    let index = 1; // On commence à 1 car le premier est déjà dans le HTML
    let logoCharge = false;
    
    function essayerProchain() {
        if (index < formats.length) {
            logoImg.src = formats[index];
            index++;
        } else {
            // Si aucun logo trouvé, on cache le conteneur
            const logoContainer = logoImg.closest('.logo-container');
            if (logoContainer) {
                logoContainer.style.display = 'none';
            }
        }
    }
    
    logoImg.onerror = essayerProchain;
    
    // Vérifier si le logo initial a réussi
    logoImg.onload = function() {
        logoImg.style.display = 'block';
        logoImg.style.visibility = 'visible';
        logoCharge = true;
        if (logoPlaceholder) {
            logoPlaceholder.style.display = 'none';
        }
    };
    
    // Si le logo initial échoue immédiatement, essayer les autres formats
    setTimeout(function() {
        if (!logoCharge && logoImg.complete && logoImg.naturalHeight === 0) {
            essayerProchain();
        }
    }, 100);
}

// Variable pour stocker le scénario actuel et le taux de base
let scenarioActuel = null;
let tauxRemplissageBase = null;

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    chargerLogo();
    // Inputs de base
    ['prix-seance', 'taux-remplissage', 'semaines-vacances', 'jours-feries'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function() {
                // Si le taux de remplissage est modifié manuellement, réinitialiser le scénario
                if (id === 'taux-remplissage') {
                    scenarioActuel = null;
                    tauxRemplissageBase = null;
                }
                calculerTout();
            });
        }
    });
    
    // Gestion des demi-journées travaillées
    document.querySelectorAll('.travaille-matin, .travaille-apres-midi').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const jour = this.dataset.jour;
            const demi = this.classList.contains('travaille-matin') ? 'matin' : 'apres-midi';
            const inputSeances = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="${demi}"]`);
            
            if (inputSeances) {
                inputSeances.disabled = !this.checked;
                if (!this.checked) {
                    inputSeances.value = 0;
                }
            }
            calculerTout();
        });
    });
    
    // Inputs pour le nombre de séances par demi-journée
    document.querySelectorAll('.seances-demi-journee').forEach(input => {
        input.addEventListener('input', calculerTout);
    });
    
    // Redevance : gestion du type (pourcentage ou fixe)
    document.querySelectorAll('input[name="redevance-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const isPourcentage = this.value === 'pourcentage';
            document.getElementById('redevance-pourcentage-container').style.display = isPourcentage ? 'block' : 'none';
            document.getElementById('redevance-fixe-container').style.display = isPourcentage ? 'none' : 'block';
            calculerTout();
        });
    });
    
    // Redevance : inputs
    ['redevance-pourcentage-input', 'redevance-fixe-input'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calculerTout);
        }
    });
    
    // Charges - mettre à jour les montants annuels en temps réel
    document.querySelectorAll('.charge-input').forEach(input => {
        input.addEventListener('input', function() {
            // Mettre à jour le montant annuel de cette charge immédiatement
            const montantMensuel = parseFloat(this.value) || 0;
            const montantAnnuel = montantMensuel * 12;
            const annuelElement = document.getElementById(this.id + '-annuel');
            if (annuelElement) {
                annuelElement.textContent = formatEuro(montantAnnuel) + '/an';
            }
            // Puis calculer tout le reste
            calculerTout();
        });
    });
    
    // IK
    document.getElementById('utilise-vehicule').addEventListener('change', function() {
        calculerIKTotal();
        calculerTout();
    });
    
    ['type-vehicule', 'puissance-fiscale', 'km-mois'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', calculerTout);
        }
    });
    
    // Gestion des demi-journées travaillées
    document.querySelectorAll('.travaille-matin, .travaille-apres-midi').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const jour = this.dataset.jour;
            const demi = this.classList.contains('travaille-matin') ? 'matin' : 'apres-midi';
            const inputSeances = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="${demi}"]`);
            
            if (inputSeances) {
                inputSeances.disabled = !this.checked;
                if (!this.checked) {
                    inputSeances.value = 0;
                }
            }
            calculerTout();
        });
    });
    
    // Inputs pour le nombre de séances par demi-journée
    document.querySelectorAll('.seances-demi-journee').forEach(input => {
        input.addEventListener('input', calculerTout);
    });
    
    // Amortissements
    document.getElementById('btn-ajouter-bien').addEventListener('click', ouvrirFormulaireAmortissement);
    // Le bouton "Ajouter" dans le formulaire sera géré dans renderAmortissements
    
    // S'assurer que tous les modals sont cachés au démarrage
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Calcul initial
    chargerDonneesSauvegardees();
    calculerTout();
    
    // Initialiser l'affichage des montants annuels pour les charges
    document.querySelectorAll('.charge-input').forEach(input => {
        const montantMensuel = parseFloat(input.value) || 0;
        const montantAnnuel = montantMensuel * 12;
        const annuelElement = document.getElementById(input.id + '-annuel');
        if (annuelElement) {
            annuelElement.textContent = formatEuro(montantAnnuel) + '/an';
        }
    });
    
    // Event listeners pour sauvegarde et chargement des simulations
    document.getElementById('btn-save-simulation')?.addEventListener('click', () => {
        openModal('modal-save');
        document.getElementById('simulation-name').focus();
    });
    
    document.getElementById('btn-load-simulations')?.addEventListener('click', () => {
        openModal('modal-load');
    });
    
    // Bouton pour ouvrir le calendrier des jours fériés
    const btnCalendrier = document.getElementById('btn-calendrier-feries');
    if (btnCalendrier) {
        btnCalendrier.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modal = document.getElementById('modal-calendrier-feries');
            if (modal) {
                openModal('modal-calendrier-feries');
            } else {
                console.error('Modal calendrier non trouvé');
            }
        });
    } else {
        console.error('Bouton calendrier non trouvé');
    }
    
    document.getElementById('btn-confirm-save')?.addEventListener('click', () => {
        const name = document.getElementById('simulation-name').value.trim();
        if (!name) {
            alert('Veuillez entrer un nom pour la simulation');
            return;
        }
        saveSimulation(name);
        document.getElementById('simulation-name').value = '';
        closeModal('modal-save');
        alert('Simulation sauvegardée avec succès !');
    });
    
    document.getElementById('btn-cancel-save')?.addEventListener('click', () => {
        document.getElementById('simulation-name').value = '';
        closeModal('modal-save');
    });
    
    // Fermer les modales en cliquant sur X ou en dehors
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Permettre de sauvegarder avec Entrée dans le champ nom
    document.getElementById('simulation-name')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('btn-confirm-save').click();
        }
    });
    
    // Event listeners pour scénarios
    document.getElementById('scenario-optimiste')?.addEventListener('click', () => appliquerScenario('optimiste'));
    document.getElementById('scenario-realiste')?.addEventListener('click', () => appliquerScenario('realiste'));
    document.getElementById('scenario-pessimiste')?.addEventListener('click', () => appliquerScenario('pessimiste'));
    
    // Event listeners pour simulations "Et si..."
    ['simul-consultations-ajout', 'simul-consultations-reduction', 'simul-vacances-plus', 
     'simul-vacances-moins', 'simul-charges-ajout', 'simul-charges-reduction'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', mettreAJourSimulations);
        }
    });
    
    // Calcul initial des simulations
    mettreAJourSimulations();
});

// ===== GESTION DES SIMULATIONS MULTIPLES =====
function getAllSimulations() {
    const simulations = localStorage.getItem('previsionnel_simulations');
    return simulations ? JSON.parse(simulations) : [];
}

function saveSimulation(name) {
    // S'assurer que tous les calculs sont à jour
    calculerTout();
    
    const donnees = collectAllData();
    const simulations = getAllSimulations();
    
    // Extraire les valeurs numériques pour l'aperçu
    const caText = document.getElementById('ca-annuel-brut')?.textContent || '0 €';
    const resultatText = document.getElementById('result-avant-cotisations')?.textContent || '0 €';
    
    const caAnnuel = parseFloat(caText.replace(/[^\d,]/g, '').replace(',', '.') || 0);
    const resultat = parseFloat(resultatText.replace(/[^\d,]/g, '').replace(',', '.') || 0);
    
    const newSimulation = {
        id: Date.now().toString(),
        name: name || `Simulation ${new Date().toLocaleDateString('fr-FR')}`,
        date: new Date().toISOString(),
        data: donnees,
        preview: {
            caAnnuel: caAnnuel,
            resultat: resultat
        }
    };
    
    simulations.push(newSimulation);
    localStorage.setItem('previsionnel_simulations', JSON.stringify(simulations));
    return newSimulation;
}

function deleteSimulation(id) {
    const simulations = getAllSimulations();
    const filtered = simulations.filter(sim => sim.id !== id);
    localStorage.setItem('previsionnel_simulations', JSON.stringify(filtered));
    displaySimulationsList();
}

function loadSimulation(id) {
    const simulations = getAllSimulations();
    const simulation = simulations.find(sim => sim.id === id);
    if (!simulation) return false;
    
    chargerDonneesFromData(simulation.data);
    return true;
}

function collectAllData() {
    const donnees = {
        prixSeance: getValue('prix-seance'),
        tauxRemplissage: getValue('taux-remplissage'),
        redevanceType: document.querySelector('input[name="redevance-type"]:checked')?.value || 'pourcentage',
        redevancePourcentage: getValue('redevance-pourcentage-input'),
        redevanceFixe: getValue('redevance-fixe-input'),
        organisationHebdo: {},
        semainesVacances: getValue('semaines-vacances'),
        joursFeries: getValue('jours-feries'),
        charges: {},
        utiliseVehicule: document.getElementById('utilise-vehicule')?.checked || false,
        typeVehicule: getValue('type-vehicule'),
        puissanceFiscale: getValue('puissance-fiscale'),
        kmMois: getValue('km-mois'),
        biensAmortissables: biensAmortissables
    };
    
    // Sauvegarder les charges
    document.querySelectorAll('.charge-input').forEach(input => {
        donnees.charges[input.id] = parseFloat(input.value) || 0;
    });
    
    // Sauvegarder l'organisation hebdomadaire
    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    jours.forEach(jour => {
        donnees.organisationHebdo[jour] = {
            matin: {
                travaille: document.querySelector(`.travaille-matin[data-jour="${jour}"]`)?.checked || false,
                seances: parseInt(document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="matin"]`)?.value || 0)
            },
            apresMidi: {
                travaille: document.querySelector(`.travaille-apres-midi[data-jour="${jour}"]`)?.checked || false,
                seances: parseInt(document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="apres-midi"]`)?.value || 0)
            }
        };
    });
    
    return donnees;
}

function chargerDonneesFromData(data) {
    if (data.prixSeance) document.getElementById('prix-seance').value = data.prixSeance;
    if (data.tauxRemplissage) document.getElementById('taux-remplissage').value = data.tauxRemplissage;
    if (data.semainesVacances) document.getElementById('semaines-vacances').value = data.semainesVacances;
    if (data.joursFeries) document.getElementById('jours-feries').value = data.joursFeries;
    
    // Charger l'organisation hebdomadaire
    if (data.organisationHebdo) {
        Object.keys(data.organisationHebdo).forEach(jour => {
            const org = data.organisationHebdo[jour];
            if (org && org.matin) {
                const matinCheck = document.querySelector(`.travaille-matin[data-jour="${jour}"]`);
                const matinInput = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="matin"]`);
                if (matinCheck && matinInput) {
                    matinCheck.checked = org.matin.travaille || false;
                    matinInput.disabled = !matinCheck.checked;
                    if (org.matin.travaille && org.matin.seances) {
                        matinInput.value = org.matin.seances;
                    }
                }
            }
            if (org && org.apresMidi) {
                const apresMidiCheck = document.querySelector(`.travaille-apres-midi[data-jour="${jour}"]`);
                const apresMidiInput = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="apres-midi"]`);
                if (apresMidiCheck && apresMidiInput) {
                    apresMidiCheck.checked = org.apresMidi.travaille || false;
                    apresMidiInput.disabled = !apresMidiCheck.checked;
                    if (org.apresMidi.travaille && org.apresMidi.seances) {
                        apresMidiInput.value = org.apresMidi.seances;
                    }
                }
            }
        });
    }
    
    // Redevance
    if (data.redevanceType) {
        document.getElementById(data.redevanceType === 'pourcentage' ? 'redevance-pourcentage' : 'redevance-fixe').checked = true;
        if (data.redevancePourcentage) document.getElementById('redevance-pourcentage-input').value = data.redevancePourcentage;
        if (data.redevanceFixe) document.getElementById('redevance-fixe-input').value = data.redevanceFixe;
    }
    
    // Charges
    Object.keys(data.charges || {}).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = data.charges[id];
    });
    
    // IK
    if (data.utiliseVehicule) document.getElementById('utilise-vehicule').checked = true;
    if (data.typeVehicule) document.getElementById('type-vehicule').value = data.typeVehicule;
    if (data.puissanceFiscale) document.getElementById('puissance-fiscale').value = data.puissanceFiscale;
    if (data.kmMois) document.getElementById('km-mois').value = data.kmMois;
    
    // Amortissements
    if (data.biensAmortissables && data.biensAmortissables.length > 0) {
        biensAmortissables = data.biensAmortissables;
        renderAmortissements();
    }
    
    // Déclencher les événements pour mettre à jour l'affichage
    const event = new Event('input');
    document.querySelectorAll('input, select').forEach(el => {
        if (el.value) el.dispatchEvent(event);
    });
    
    mettreAJourVisualisations();
}

function displaySimulationsList() {
    const simulations = getAllSimulations();
    const listContainer = document.getElementById('simulations-list');
    
    if (simulations.length === 0) {
        listContainer.innerHTML = '<p class="no-simulations">Aucune simulation sauvegardée pour le moment.</p>';
        return;
    }
    
    // Trier par date (plus récent en premier)
    simulations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    listContainer.innerHTML = simulations.map(sim => {
        const date = new Date(sim.date);
        const dateStr = date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const caStr = sim.preview.caAnnuel ? sim.preview.caAnnuel.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : 'N/A';
        const resultatStr = sim.preview.resultat ? sim.preview.resultat.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : 'N/A';
        
        return `
            <div class="simulation-item">
                <div class="simulation-info">
                    <div class="simulation-name">${sim.name}</div>
                    <div class="simulation-date">📅 ${dateStr}</div>
                    <div class="simulation-preview">CA: ${caStr} | Résultat: ${resultatStr}</div>
                </div>
                <div class="simulation-actions">
                    <button class="btn-load" onclick="loadSimulationById('${sim.id}')">Charger</button>
                    <button class="btn-delete" onclick="deleteSimulationById('${sim.id}')">Supprimer</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadSimulationById(id) {
    if (loadSimulation(id)) {
        closeModal('modal-load');
        // Scroll vers le haut pour voir les résultats
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function deleteSimulationById(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette simulation ?')) {
        deleteSimulation(id);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        if (modalId === 'modal-load') {
            displaySimulationsList();
        } else if (modalId === 'modal-calendrier-feries') {
            genererCalendrier2026();
        }
    } else {
        console.error('Modal non trouvé:', modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== SAUVEGARDE AUTOMATIQUE (localStorage) =====
function sauvegarderDonnees() {
    const donnees = {
        prixSeance: getValue('prix-seance'),
        tauxRemplissage: getValue('taux-remplissage'),
        redevanceType: document.querySelector('input[name="redevance-type"]:checked')?.value || 'pourcentage',
        redevancePourcentage: getValue('redevance-pourcentage-input'),
        redevanceFixe: getValue('redevance-fixe-input'),
        // Organisation hebdomadaire : sauvegarder les checkboxes et inputs
        organisationHebdo: {},
        semainesVacances: getValue('semaines-vacances'),
        joursFeries: getValue('jours-feries'),
        charges: {},
        utiliseVehicule: document.getElementById('utilise-vehicule')?.checked || false,
        typeVehicule: getValue('type-vehicule'),
        puissanceFiscale: getValue('puissance-fiscale'),
        kmMois: getValue('km-mois'),
        biensAmortissables: biensAmortissables
    };
    
    // Sauvegarder les charges
    document.querySelectorAll('.charge-input').forEach(input => {
        donnees.charges[input.id] = parseFloat(input.value) || 0;
    });
    
    // Sauvegarder l'organisation hebdomadaire
    const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    jours.forEach(jour => {
        donnees.organisationHebdo[jour] = {
            matin: {
                travaille: document.querySelector(`.travaille-matin[data-jour="${jour}"]`)?.checked || false,
                seances: parseInt(document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="matin"]`)?.value || 0)
            },
            apresMidi: {
                travaille: document.querySelector(`.travaille-apres-midi[data-jour="${jour}"]`)?.checked || false,
                seances: parseInt(document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="apres-midi"]`)?.value || 0)
            }
        };
    });
    
    localStorage.setItem('previsionnel_data', JSON.stringify(donnees));
}

function chargerDonneesSauvegardees() {
    const donnees = localStorage.getItem('previsionnel_data');
    if (!donnees) return;
    
    try {
        const data = JSON.parse(donnees);
        if (data.prixSeance) document.getElementById('prix-seance').value = data.prixSeance;
        if (data.tauxRemplissage) document.getElementById('taux-remplissage').value = data.tauxRemplissage;
        if (data.semainesVacances) document.getElementById('semaines-vacances').value = data.semainesVacances;
        if (data.joursFeries) document.getElementById('jours-feries').value = data.joursFeries;
        
        // Charger l'organisation hebdomadaire
        if (data.organisationHebdo) {
            Object.keys(data.organisationHebdo).forEach(jour => {
                const org = data.organisationHebdo[jour];
                if (org && org.matin) {
                    const matinCheck = document.querySelector(`.travaille-matin[data-jour="${jour}"]`);
                    const matinInput = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="matin"]`);
                    if (matinCheck && matinInput) {
                        matinCheck.checked = org.matin.travaille || false;
                        matinInput.disabled = !matinCheck.checked;
                        if (org.matin.travaille && org.matin.seances) {
                            matinInput.value = org.matin.seances;
                        }
                    }
                }
                if (org && org.apresMidi) {
                    const apresMidiCheck = document.querySelector(`.travaille-apres-midi[data-jour="${jour}"]`);
                    const apresMidiInput = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="apres-midi"]`);
                    if (apresMidiCheck && apresMidiInput) {
                        apresMidiCheck.checked = org.apresMidi.travaille || false;
                        apresMidiInput.disabled = !apresMidiCheck.checked;
                        if (org.apresMidi.travaille && org.apresMidi.seances) {
                            apresMidiInput.value = org.apresMidi.seances;
                        }
                    }
                }
            });
        }
        
        // Charger l'organisation hebdomadaire
        if (data.organisationHebdo) {
            Object.keys(data.organisationHebdo).forEach(jour => {
                const org = data.organisationHebdo[jour];
                if (org && org.matin) {
                    const matinCheck = document.querySelector(`.travaille-matin[data-jour="${jour}"]`);
                    const matinInput = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="matin"]`);
                    if (matinCheck && matinInput) {
                        matinCheck.checked = org.matin.travaille || false;
                        matinInput.disabled = !matinCheck.checked;
                        if (org.matin.travaille && org.matin.seances) {
                            matinInput.value = org.matin.seances;
                        }
                    }
                }
                if (org && org.apresMidi) {
                    const apresMidiCheck = document.querySelector(`.travaille-apres-midi[data-jour="${jour}"]`);
                    const apresMidiInput = document.querySelector(`.seances-demi-journee[data-jour="${jour}"][data-demi="apres-midi"]`);
                    if (apresMidiCheck && apresMidiInput) {
                        apresMidiCheck.checked = org.apresMidi.travaille || false;
                        apresMidiInput.disabled = !apresMidiCheck.checked;
                        if (org.apresMidi.travaille && org.apresMidi.seances) {
                            apresMidiInput.value = org.apresMidi.seances;
                        }
                    }
                }
            });
        }
        
        // Redevance
        if (data.redevanceType) {
            document.getElementById(data.redevanceType === 'pourcentage' ? 'redevance-pourcentage' : 'redevance-fixe').checked = true;
            if (data.redevancePourcentage) document.getElementById('redevance-pourcentage-input').value = data.redevancePourcentage;
            if (data.redevanceFixe) document.getElementById('redevance-fixe-input').value = data.redevanceFixe;
        }
        
        // Charges
        Object.keys(data.charges || {}).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data.charges[id];
        });
        
        // IK
        if (data.utiliseVehicule) document.getElementById('utilise-vehicule').checked = true;
        if (data.typeVehicule) document.getElementById('type-vehicule').value = data.typeVehicule;
        if (data.puissanceFiscale) document.getElementById('puissance-fiscale').value = data.puissanceFiscale;
        if (data.kmMois) document.getElementById('km-mois').value = data.kmMois;
        
        // Amortissements
        if (data.biensAmortissables && data.biensAmortissables.length > 0) {
            biensAmortissables = data.biensAmortissables;
            renderAmortissements();
        }
        
        // Déclencher les événements pour mettre à jour l'affichage
        const event = new Event('input');
        document.querySelectorAll('input, select').forEach(el => {
            if (el.value) el.dispatchEvent(event);
        });
    } catch (e) {
        console.error('Erreur lors du chargement des données:', e);
    }
}

// Fonction pour mettre à jour toutes les visualisations
function mettreAJourVisualisations() {
    sauvegarderDonnees();
    mettreAJourCalculsAvances();
    mettreAJourScenarios();
    mettreAJourSimulations();
}

// Wrapper pour calculerTout
const originalCalculerTout = calculerTout;
calculerTout = function() {
    originalCalculerTout();
    mettreAJourVisualisations();
};

// ===== SCÉNARIOS =====
function appliquerScenario(type) {
    // Sauvegarder le taux de base si c'est la première fois ou si on change de scénario
    if (tauxRemplissageBase === null || scenarioActuel !== type) {
        tauxRemplissageBase = getValue('taux-remplissage');
    }
    
    // Stocker le scénario actuel sans modifier le champ
    scenarioActuel = type;
    
    // Ne pas modifier le champ taux-remplissage, juste recalculer
    calculerTout();
    mettreAJourScenarios();
}

function mettreAJourScenarios() {
    const previewOptimiste = document.getElementById('preview-optimiste');
    const previewRealiste = document.getElementById('preview-realiste');
    const previewPessimiste = document.getElementById('preview-pessimiste');
    
    if (!previewOptimiste || !previewRealiste || !previewPessimiste) return;
    
    // Toujours utiliser le taux de base pour les prévisualisations (pas le taux modifié par un scénario)
    const tauxBase = tauxRemplissageBase !== null ? tauxRemplissageBase : getValue('taux-remplissage');
    
    // Calculer les résultats pour chaque scénario
    const { seancesAnnuelles } = calculerAnnuel();
    const prixSeance = getValue('prix-seance');
    const { totalAnnuel } = calculerCharges();
    const ikAnnuel = calculerIKTotal();
    const amortissements = calculerAmortissements();
    const redevanceType = document.querySelector('input[name="redevance-type"]:checked')?.value;
    const tauxRedevance = getValue('redevance-pourcentage-input');
    const redevanceFixe = getValue('redevance-fixe-input');
    
    function calculerResultat(taux) {
        const ca = seancesAnnuelles * prixSeance * (taux / 100);
        const redevanceCalc = redevanceType === 'pourcentage' ? (ca * tauxRedevance / 100) : redevanceFixe;
        return ca - totalAnnuel - redevanceCalc - ikAnnuel - amortissements;
    }
    
    // Les prévisualisations utilisent toujours le taux de base
    const resultatOptimiste = calculerResultat(Math.min(100, tauxBase * 1.1));
    const resultatRealiste = calculerResultat(tauxBase);
    const resultatPessimiste = calculerResultat(Math.max(0, tauxBase * 0.9));
    
    previewOptimiste.textContent = formatEuro(resultatOptimiste);
    previewRealiste.textContent = formatEuro(resultatRealiste);
    previewPessimiste.textContent = formatEuro(resultatPessimiste);
}

// ===== CALCULS AVANCÉS =====
function mettreAJourCalculsAvances() {
    const { caAnnuelBrut } = calculerCA();
    const { totalAnnuel } = calculerCharges();
    const ikAnnuel = calculerIKTotal();
    const amortissements = calculerAmortissements();
    const redevanceType = document.querySelector('input[name="redevance-type"]:checked')?.value;
    const redevance = redevanceType === 'pourcentage' ? 
        (caAnnuelBrut * getValue('redevance-pourcentage-input') / 100) : 
        getValue('redevance-fixe-input');
    
    const totalCharges = totalAnnuel + redevance + ikAnnuel + amortissements;
    const resultat = caAnnuelBrut - totalCharges;
}

// ===== SIMULATIONS "ET SI..." =====
function mettreAJourSimulations() {
    // Calculer les valeurs de base
    const { caAnnuelBrut, caMensuel, redevanceAnnuelle } = calculerCA();
    const { totalAnnuel } = calculerCharges();
    const ikAnnuel = calculerIKTotal();
    const amortissements = calculerAmortissements();
    const { seancesSemaine, joursSemaine } = calculerHebdomadaire();
    const semainesVacances = getValue('semaines-vacances');
    const prixSeance = getValue('prix-seance');
    const tauxRemplissage = getValue('taux-remplissage') / 100;
    const redevanceType = document.querySelector('input[name="redevance-type"]:checked')?.value;
    const tauxRedevance = getValue('redevance-pourcentage-input') / 100;
    const redevanceFixe = getValue('redevance-fixe-input');
    
    // Récupérer toutes les modifications
    const consultationsAjout = parseInt(getValue('simul-consultations-ajout')) || 0;
    const consultationsReduction = parseInt(getValue('simul-consultations-reduction')) || 0;
    const vacancesPlus = parseInt(getValue('simul-vacances-plus')) || 0;
    const vacancesMoins = parseInt(getValue('simul-vacances-moins')) || 0;
    const chargesAjout = parseFloat(getValue('simul-charges-ajout')) || 0;
    const chargesReduction = parseFloat(getValue('simul-charges-reduction')) || 0;
    
    // Vérifier s'il y a des modifications
    const hasModifications = consultationsAjout > 0 || consultationsReduction > 0 || 
                             vacancesPlus > 0 || vacancesMoins > 0 || 
                             chargesAjout > 0 || chargesReduction > 0;
    
    if (!hasModifications) {
        // Afficher les valeurs de base
        const caElement = document.getElementById('simul-result-ca');
        caElement.textContent = formatEuro(caAnnuelBrut);
        caElement.className = 'result-main-value positive';
        
        const totalDepenses = totalAnnuel + redevanceAnnuelle + ikAnnuel + amortissements;
        const resultat = caAnnuelBrut - totalDepenses;
        const resultElement = document.getElementById('simul-result-avant-cotisations');
        resultElement.textContent = formatEuro(resultat);
        
        if (resultat > 0) {
            resultElement.className = 'result-main-value positive';
        } else if (resultat < 0) {
            resultElement.className = 'result-main-value negative';
        } else {
            resultElement.className = 'result-main-value';
        }
        return;
    }
    
    // Calculer les valeurs modifiées
    let nouvellesCharges = totalAnnuel;
    let nouvellesVacances = semainesVacances;
    let nouvellesSeancesSemaine = seancesSemaine;
    
    // Modifications des consultations
    if (consultationsAjout > 0) {
        nouvellesSeancesSemaine += consultationsAjout;
    }
    
    if (consultationsReduction > 0) {
        nouvellesSeancesSemaine = Math.max(0, nouvellesSeancesSemaine - consultationsReduction);
    }
    
    // Modifications des vacances
    if (vacancesPlus > 0) {
        nouvellesVacances += vacancesPlus;
    }
    
    if (vacancesMoins > 0) {
        nouvellesVacances = Math.max(0, nouvellesVacances - vacancesMoins);
    }
    
    // Recalculer le CA avec les nouvelles séances
    // Prendre en compte les jours fériés comme dans calculerAnnuel()
    const joursFeries = getValue('jours-feries');
    const nouvellesSemainesTravaillees = 53 - nouvellesVacances;
    
    // Calculer les séances annuelles en tenant compte des jours fériés
    // Séances par semaine × semaines travaillées - séances perdues à cause des jours fériés
    const seancesParJour = nouvellesSeancesSemaine > 0 && joursSemaine > 0 ? nouvellesSeancesSemaine / joursSemaine : 0;
    const seancesPerduesJoursFeries = seancesParJour * joursFeries;
    const nouvellesSeancesAnnuelles = Math.max(0, (nouvellesSeancesSemaine * nouvellesSemainesTravaillees) - seancesPerduesJoursFeries);
    
    const nouveauCA = nouvellesSeancesAnnuelles * prixSeance * tauxRemplissage;
    
    // Modifications des charges
    if (chargesReduction > 0) {
        nouvellesCharges -= chargesReduction * 12;
    }
    
    if (chargesAjout > 0) {
        nouvellesCharges += chargesAjout * 12;
    }
    
    // Recalculer la redevance
    let nouvelleRedevance = 0;
    if (redevanceType === 'pourcentage') {
        nouvelleRedevance = nouveauCA * tauxRedevance;
    } else {
        nouvelleRedevance = redevanceFixe;
    }
    
    const totalDepensesSimul = nouvellesCharges + nouvelleRedevance + ikAnnuel + amortissements;
    const nouveauResultat = nouveauCA - totalDepensesSimul;
    
    // Afficher les résultats après simulation
    const caElement = document.getElementById('simul-result-ca');
    caElement.textContent = formatEuro(nouveauCA);
    caElement.className = nouveauCA > caAnnuelBrut ? 'result-main-value positive' : 
                          nouveauCA < caAnnuelBrut ? 'result-main-value negative' : 
                          'result-main-value positive';
    
    const resultElement = document.getElementById('simul-result-avant-cotisations');
    resultElement.textContent = formatEuro(nouveauResultat);
    
    const resultatBase = caAnnuelBrut - totalAnnuel - redevanceAnnuelle - ikAnnuel - amortissements;
    if (nouveauResultat > resultatBase) {
        resultElement.className = 'result-main-value positive';
    } else if (nouveauResultat < resultatBase) {
        resultElement.className = 'result-main-value negative';
    } else {
        resultElement.className = 'result-main-value';
    }
}

// ===== CALENDRIER DES JOURS FÉRIÉS 2026 =====
// Jours fériés français en 2026
const joursFeries2026 = [
    { date: new Date(2026, 0, 1), nom: 'Jour de l\'An', jourSemaine: 'jeudi' },
    { date: new Date(2026, 3, 6), nom: 'Lundi de Pâques', jourSemaine: 'lundi' },
    { date: new Date(2026, 4, 1), nom: 'Fête du Travail', jourSemaine: 'vendredi' },
    { date: new Date(2026, 4, 8), nom: 'Victoire en Europe 1945', jourSemaine: 'dimanche' },
    { date: new Date(2026, 4, 14), nom: 'Ascension', jourSemaine: 'samedi' },
    { date: new Date(2026, 4, 25), nom: 'Lundi de Pentecôte', jourSemaine: 'lundi' },
    { date: new Date(2026, 6, 14), nom: 'Fête Nationale', jourSemaine: 'mardi' },
    { date: new Date(2026, 7, 15), nom: 'Assomption', jourSemaine: 'samedi' },
    { date: new Date(2026, 10, 1), nom: 'Toussaint', jourSemaine: 'dimanche' },
    { date: new Date(2026, 10, 11), nom: 'Armistice 1918', jourSemaine: 'mercredi' },
    { date: new Date(2026, 11, 25), nom: 'Noël', jourSemaine: 'vendredi' }
];

// Vacances scolaires 2026 (commencent le samedi soir, se terminent le dimanche soir)
// Les dates sont ajustées pour commencer le samedi et se terminer le dimanche inclus
const vacancesScolaires2026 = [
    // Vacances de la Toussaint (toutes zones) - samedi 17 oct au dimanche 1 nov
    { debut: new Date(2026, 9, 17), fin: new Date(2026, 10, 1), nom: 'Vacances de la Toussaint', zone: 'Toutes zones', couleur: '#7a9fb8' },
    // Vacances de Noël (toutes zones) - samedi 19 déc au dimanche 4 jan 2027
    { debut: new Date(2026, 11, 19), fin: new Date(2027, 0, 4), nom: 'Vacances de Noël', zone: 'Toutes zones', couleur: '#7a9fb8' },
    // Vacances d'hiver - Zone A - samedi 7 fév au dimanche 22 fév
    { debut: new Date(2026, 1, 7), fin: new Date(2026, 1, 22), nom: 'Vacances d\'hiver', zone: 'Zone A', couleur: '#d4a5a5' },
    // Vacances d'hiver - Zone B - samedi 14 fév au dimanche 1 mar
    { debut: new Date(2026, 1, 14), fin: new Date(2026, 2, 1), nom: 'Vacances d\'hiver', zone: 'Zone B', couleur: '#8fb88f' },
    // Vacances d'hiver - Zone C - samedi 21 fév au dimanche 8 mar
    { debut: new Date(2026, 1, 21), fin: new Date(2026, 2, 8), nom: 'Vacances d\'hiver', zone: 'Zone C', couleur: '#b3d9f2' },
    // Vacances de printemps - Zone A - samedi 4 avr au dimanche 20 avr
    { debut: new Date(2026, 3, 4), fin: new Date(2026, 3, 20), nom: 'Vacances de printemps', zone: 'Zone A', couleur: '#d4a5a5' },
    // Vacances de printemps - Zone B - samedi 11 avr au dimanche 27 avr
    { debut: new Date(2026, 3, 11), fin: new Date(2026, 3, 27), nom: 'Vacances de printemps', zone: 'Zone B', couleur: '#8fb88f' },
    // Vacances de printemps - Zone C - samedi 18 avr au dimanche 4 mai
    { debut: new Date(2026, 3, 18), fin: new Date(2026, 4, 4), nom: 'Vacances de printemps', zone: 'Zone C', couleur: '#b3d9f2' },
    // Vacances d'été (toutes zones) - samedi 4 juil au dimanche 31 août
    { debut: new Date(2026, 6, 4), fin: new Date(2026, 7, 31), nom: 'Vacances d\'été', zone: 'Toutes zones', couleur: '#7a9fb8' }
];

const nomsMois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const nomsJours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Fonction pour vérifier si une date est dans une période de vacances
function estEnVacances(date) {
    return vacancesScolaires2026.some(vac => {
        const dateDebut = new Date(vac.debut.getFullYear(), vac.debut.getMonth(), vac.debut.getDate());
        const dateFin = new Date(vac.fin.getFullYear(), vac.fin.getMonth(), vac.fin.getDate());
        const dateTest = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return dateTest >= dateDebut && dateTest <= dateFin;
    });
}

// Fonction pour obtenir les vacances d'une date
function getVacancesDate(date) {
    return vacancesScolaires2026.find(vac => {
        const dateDebut = new Date(vac.debut.getFullYear(), vac.debut.getMonth(), vac.debut.getDate());
        const dateFin = new Date(vac.fin.getFullYear(), vac.fin.getMonth(), vac.fin.getDate());
        const dateTest = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return dateTest >= dateDebut && dateTest <= dateFin;
    });
}

// Fonction pour obtenir toutes les vacances d'une date (plusieurs zones peuvent être en vacances en même temps)
function getAllVacancesDate(date) {
    return vacancesScolaires2026.filter(vac => {
        const dateDebut = new Date(vac.debut.getFullYear(), vac.debut.getMonth(), vac.debut.getDate());
        const dateFin = new Date(vac.fin.getFullYear(), vac.fin.getMonth(), vac.fin.getDate());
        const dateTest = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return dateTest >= dateDebut && dateTest <= dateFin;
    });
}

function genererCalendrier2026() {
    const container = document.getElementById('calendrier-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Liste des jours fériés en haut
    const listeFeries = document.createElement('div');
    listeFeries.style.cssText = 'margin-bottom: 30px; padding: 20px; background: #FEEFDB; border-radius: 8px; border: 2px solid #e6c99c;';
    listeFeries.innerHTML = '<h3 style="margin-bottom: 15px; color: #073641;">📅 Jours fériés en 2026</h3>';
    
    const liste = document.createElement('div');
    liste.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px;';
    
    joursFeries2026.forEach(ferie => {
        const jour = ferie.date.getDate();
        const mois = nomsMois[ferie.date.getMonth()];
        const jourSemaine = ferie.jourSemaine;
        
        const item = document.createElement('div');
        item.style.cssText = 'padding: 10px; background: white; border-radius: 6px; border: 1px solid #e6c99c;';
        item.innerHTML = `
            <strong style="color: #073641;">${jour} ${mois}</strong><br>
            <span style="color: #666; font-size: 0.9em;">${ferie.nom}</span><br>
            <span style="color: #d4a5a5; font-size: 0.85em; font-weight: 600;">${jourSemaine.charAt(0).toUpperCase() + jourSemaine.slice(1)}</span>
        `;
        liste.appendChild(item);
    });
    
    listeFeries.appendChild(liste);
    container.appendChild(listeFeries);
    
    // Liste des vacances scolaires (regroupées et triées par date)
    const listeVacances = document.createElement('div');
    listeVacances.style.cssText = 'margin-bottom: 30px; padding: 20px; background: #e8f4f8; border-radius: 8px; border: 2px solid #7a9fb8;';
    listeVacances.innerHTML = '<h3 style="margin-bottom: 15px; color: #073641;">🏖️ Vacances scolaires 2026</h3>';
    
    const listeVac = document.createElement('div');
    listeVac.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;';
    
    // Trier toutes les vacances par date de début
    const vacancesTriees = [...vacancesScolaires2026].sort((a, b) => {
        return a.debut.getTime() - b.debut.getTime();
    });
    
    // Regrouper par type de vacances
    const vacancesParType = {};
    vacancesTriees.forEach(vac => {
        if (!vacancesParType[vac.nom]) {
            vacancesParType[vac.nom] = [];
        }
        vacancesParType[vac.nom].push(vac);
    });
    
    // Afficher dans l'ordre chronologique
    Object.keys(vacancesParType).forEach(nomVacances => {
        const vacances = vacancesParType[nomVacances];
        
        if (vacances.length === 1) {
            // Vacances uniques (Toussaint, Noël, été)
            const vac = vacances[0];
            const item = document.createElement('div');
            item.style.cssText = 'padding: 10px; background: white; border-radius: 6px; border: 1px solid #7a9fb8;';
            item.innerHTML = `
                <strong style="color: #073641;">${vac.nom}</strong><br>
                <span style="color: #666; font-size: 0.9em;">${vac.debut.getDate()} ${nomsMois[vac.debut.getMonth()]} - ${vac.fin.getDate()} ${nomsMois[vac.fin.getMonth()]}</span>
            `;
            listeVac.appendChild(item);
        } else {
            // Vacances avec plusieurs zones (hiver, printemps)
            const item = document.createElement('div');
            item.style.cssText = 'padding: 10px; background: white; border-radius: 6px; border: 1px solid #7a9fb8;';
            let zonesHtml = '';
            vacances.forEach(vac => {
                const debutStr = `${vac.debut.getDate()} ${nomsMois[vac.debut.getMonth()]}`;
                const finStr = `${vac.fin.getDate()} ${nomsMois[vac.fin.getMonth()]}`;
                zonesHtml += `<div style="margin-top: 5px;"><span style="color: ${vac.couleur}; font-weight: 600;">●</span> <span style="color: #666; font-size: 0.9em;">${vac.zone}: ${debutStr} - ${finStr}</span></div>`;
            });
            item.innerHTML = `
                <strong style="color: #073641;">${nomVacances}</strong>
                ${zonesHtml}
            `;
            listeVac.appendChild(item);
        }
    });
    
    listeVacances.appendChild(listeVac);
    container.appendChild(listeVacances);
    
    // Légende
    const legende = document.createElement('div');
    legende.style.cssText = 'margin-bottom: 30px; padding: 15px; background: white; border-radius: 8px; border: 2px solid #e6c99c;';
    legende.innerHTML = `
        <h4 style="margin-bottom: 10px; color: #073641;">Légende :</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 30px; height: 30px; background: #FEDDDB; border: 2px solid #d4a5a5; border-radius: 4px;"></div>
                <span>Jours fériés</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 30px; height: 4px; background: #d4a5a5; border-radius: 2px;"></div>
                <span>Vacances Zone A</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 30px; height: 4px; background: #8fb88f; border-radius: 2px;"></div>
                <span>Vacances Zone B</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 30px; height: 4px; background: #b3d9f2; border-radius: 2px;"></div>
                <span>Vacances Zone C</span>
            </div>
        </div>
    `;
    container.appendChild(legende);
    
    // Générer un calendrier pour chaque mois
    for (let mois = 0; mois < 12; mois++) {
        const moisDiv = document.createElement('div');
        moisDiv.style.cssText = 'margin-bottom: 30px;';
        
        const titreMois = document.createElement('h3');
        titreMois.style.cssText = 'margin-bottom: 15px; color: #073641; font-size: 1.3em;';
        titreMois.textContent = nomsMois[mois] + ' 2026';
        moisDiv.appendChild(titreMois);
        
        const calendrier = document.createElement('div');
        calendrier.style.cssText = 'background: white; border: 2px solid #e6c99c; border-radius: 8px; padding: 15px;';
        
        // En-tête des jours de la semaine (commence par lundi)
        const enTete = document.createElement('div');
        enTete.style.cssText = 'display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin-bottom: 10px;';
        // Réorganiser pour commencer par lundi
        const nomsJoursLundi = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        nomsJoursLundi.forEach(jour => {
            const cell = document.createElement('div');
            cell.style.cssText = 'text-align: center; font-weight: 600; color: #073641; padding: 8px;';
            cell.textContent = jour;
            enTete.appendChild(cell);
        });
        calendrier.appendChild(enTete);
        
        // Jours du mois
        const premierJour = new Date(2026, mois, 1);
        const dernierJour = new Date(2026, mois + 1, 0);
        // Convertir dimanche (0) en 7 pour que lundi soit le premier jour
        let premierJourSemaine = premierJour.getDay();
        if (premierJourSemaine === 0) {
            premierJourSemaine = 7; // Dimanche devient le 7ème jour
        }
        premierJourSemaine = premierJourSemaine - 1; // Ajuster pour que lundi = 0
        const nbJours = dernierJour.getDate();
        
        const joursGrid = document.createElement('div');
        joursGrid.style.cssText = 'display: grid; grid-template-columns: repeat(7, 1fr); gap: 0; position: relative;';
        
        // Cases vides avant le premier jour
        for (let i = 0; i < premierJourSemaine; i++) {
            const vide = document.createElement('div');
            vide.style.cssText = 'padding: 8px; height: 60px; box-sizing: border-box;';
            joursGrid.appendChild(vide);
        }
        
        // Stocker les informations de vacances pour créer des lignes continues
        const vacancesParJour = [];
        
        // Jours du mois
        for (let jour = 1; jour <= nbJours; jour++) {
            const date = new Date(2026, mois, jour);
            const jourSemaine = date.getDay();
            const jourSemaineNom = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][jourSemaine];
            
            const jourFerie = joursFeries2026.find(f => 
                f.date.getDate() === jour && f.date.getMonth() === mois
            );
            
            const toutesVacances = getAllVacancesDate(date);
            const estVacances = estEnVacances(date);
            
            // Préparer les zones pour ce jour
            const zonesAVoir = [];
            if (estVacances && !jourFerie && toutesVacances.length > 0) {
                toutesVacances.forEach((vac) => {
                    if (vac.zone === 'Toutes zones') {
                        zonesAVoir.push({ couleur: '#d4a5a5', zone: 'A', vacance: vac });
                        zonesAVoir.push({ couleur: '#8fb88f', zone: 'B', vacance: vac });
                        zonesAVoir.push({ couleur: '#b3d9f2', zone: 'C', vacance: vac });
                    } else {
                        zonesAVoir.push({ couleur: vac.couleur, zone: vac.zone, vacance: vac });
                    }
                });
            }
            
            vacancesParJour.push({
                jour: jour,
                zones: zonesAVoir,
                jourSemaine: jourSemaine,
                jourFerie: jourFerie,
                estVacances: estVacances
            });
            
            const cell = document.createElement('div');
            let cellStyle = 'padding: 8px; height: 60px; box-sizing: border-box; border-radius: 0; text-align: center; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: visible; border-right: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0;';
            
            // Style selon le type de jour
            if (jourFerie) {
                cellStyle += 'background: #FEDDDB; border: 2px solid #d4a5a5; font-weight: 600;';
            } else {
                cellStyle += 'background: #f9f9f9;';
            }
            
            if (jourSemaine === 0 || jourSemaine === 6) {
                cellStyle += 'color: #999;';
            } else {
                cellStyle += 'color: #073641;';
            }
            
            cell.style.cssText = cellStyle;
            
            const numJour = document.createElement('div');
            numJour.style.cssText = 'font-weight: 600; font-size: 0.9em; position: relative; z-index: 2;';
            numJour.textContent = jour;
            cell.appendChild(numJour);
            
            if (jourFerie) {
                const nomFerie = document.createElement('div');
                nomFerie.style.cssText = 'font-size: 0.6em; color: #073641; line-height: 1.1; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 95%; text-align: center; z-index: 2; padding-top: 2px;';
                nomFerie.textContent = jourFerie.nom;
                cell.appendChild(nomFerie);
                
                // Ajuster la position du numéro pour éviter le chevauchement
                numJour.style.marginBottom = '8px';
            }
            
            joursGrid.appendChild(cell);
        }
        
        // Ajouter les lignes horizontales continues pour les vacances
        // Pour chaque zone, créer des lignes continues qui traversent plusieurs cases
        const zonesUniques = new Set();
        vacancesParJour.forEach(j => {
            j.zones.forEach(z => zonesUniques.add(z.zone));
        });
        
        // Trier les zones pour un affichage cohérent (A, B, C)
        const ordreZones = { 'A': 1, 'B': 2, 'C': 3 };
        const zonesTriees = Array.from(zonesUniques).sort((a, b) => (ordreZones[a] || 99) - (ordreZones[b] || 99));
        
        zonesTriees.forEach((zoneNom, zoneIndex) => {
            // Trouver toutes les périodes continues pour cette zone
            let periodeDebut = null;
            let couleurZone = null;
            
            for (let i = 0; i <= vacancesParJour.length; i++) {
                const jourInfo = i < vacancesParJour.length ? vacancesParJour[i] : null;
                const zonePresente = jourInfo && !jourInfo.jourFerie ? jourInfo.zones.find(z => z.zone === zoneNom) : null;
                
                if (zonePresente) {
                    if (periodeDebut === null) {
                        periodeDebut = i;
                        couleurZone = zonePresente.couleur;
                    }
                } else {
                    // Si on avait une période en cours, créer la ligne continue
                    if (periodeDebut !== null && couleurZone && i > periodeDebut) {
                        const ligne = document.createElement('div');
                        const indexDebut = periodeDebut + premierJourSemaine;
                        const indexFin = (i - 1) + premierJourSemaine;
                        const colDebut = indexDebut % 7;
                        const colFin = indexFin % 7;
                        const rowDebut = Math.floor(indexDebut / 7);
                        const rowFin = Math.floor(indexFin / 7);
                        
                        // Calculer la position et la largeur en pourcentage
                        const leftPercent = (colDebut / 7) * 100;
                        const widthPercent = ((colFin - colDebut + 1) / 7) * 100;
                        // Décaler verticalement selon la zone (A en haut, B au milieu, C en bas)
                        const topOffset = rowDebut * 60 + 57 - (zoneIndex * 3); // Empiler les lignes
                        
                        if (rowDebut === rowFin) {
                            // Même ligne : une seule ligne continue
                            ligne.style.cssText = `
                                position: absolute;
                                top: ${topOffset}px;
                                left: ${leftPercent}%;
                                width: ${widthPercent}%;
                                height: 3px;
                                background: ${couleurZone};
                                z-index: 1;
                                pointer-events: none;
                            `;
                            joursGrid.appendChild(ligne);
                        } else {
                            // Plusieurs lignes : créer des segments
                            // Première ligne (jusqu'à la fin de la semaine)
                            const ligne1 = document.createElement('div');
                            ligne1.style.cssText = `
                                position: absolute;
                                top: ${rowDebut * 60 + 57 - (zoneIndex * 3)}px;
                                left: ${leftPercent}%;
                                width: ${((7 - colDebut) / 7) * 100}%;
                                height: 3px;
                                background: ${couleurZone};
                                z-index: 1;
                                pointer-events: none;
                            `;
                            joursGrid.appendChild(ligne1);
                            
                            // Lignes complètes au milieu
                            for (let r = rowDebut + 1; r < rowFin; r++) {
                                const ligneMid = document.createElement('div');
                                ligneMid.style.cssText = `
                                    position: absolute;
                                    top: ${r * 60 + 57 - (zoneIndex * 3)}px;
                                    left: 0;
                                    width: 100%;
                                    height: 3px;
                                    background: ${couleurZone};
                                    z-index: 1;
                                    pointer-events: none;
                                `;
                                joursGrid.appendChild(ligneMid);
                            }
                            
                            // Dernière ligne (du début jusqu'à colFin)
                            const ligne2 = document.createElement('div');
                            ligne2.style.cssText = `
                                position: absolute;
                                top: ${rowFin * 60 + 57 - (zoneIndex * 3)}px;
                                left: 0;
                                width: ${((colFin + 1) / 7) * 100}%;
                                height: 3px;
                                background: ${couleurZone};
                                z-index: 1;
                                pointer-events: none;
                            `;
                            joursGrid.appendChild(ligne2);
                        }
                        
                        periodeDebut = null;
                        couleurZone = null;
                    }
                }
            }
        });
        
        calendrier.appendChild(joursGrid);
        moisDiv.appendChild(calendrier);
        container.appendChild(moisDiv);
    }
}

