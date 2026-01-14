# 📋 MODULE CANDIDATS - Documentation Complète

## 🎯 Vue d'ensemble

Le module Candidats permet une gestion complète du processus de recrutement, de la réception du CV jusqu'à l'embauche finale.

## 📊 3.3.1 Vue Tableau - Champs Obligatoires

### Champs Principaux
- **Job ID**: Identifiant unique du poste
- **Département / Direction**: Service concerné
- **Intitulé du poste**: Titre du poste à pourvoir
- **Date d'ouverture**: Date de création de l'offre
- **Recruteur responsable**: Personne en charge du recrutement
- **Motif du recrutement**: Raison de l'embauche (remplacement, augmentation, etc.)
- **Mode de recrutement**: INTERNE / EXTERNE
- **Statut**: VACANT, EMBAUCHÉ, EN_COURS, TERMINÉ, ANNULÉ, SUSPENDU
- **Date d'embauche**: Date effective d'embauche
- **Coût d'embauche (DT)**: Coût total du processus
- **Durée du processus**: Nombre de jours
- **Ratio de performance (RD)**: Indicateur de performance

## 🎨 3.3.2 Indicateurs Visuels

### Codes Couleur par Statut
- 🟢 **VACANT**: Vert - Poste ouvert
- 🔵 **EN_COURS**: Bleu - Recrutement en cours
- 🟡 **EMBAUCHÉ**: Jaune/Or - Candidat embauché
- ✅ **TERMINÉ**: Vert foncé - Processus terminé
- 🔴 **ANNULÉ**: Rouge - Annulé
- ⏸️ **SUSPENDU**: Orange - Temporairement suspendu

### Formatage Automatique
- Valeurs numériques: Format avec séparateurs de milliers
- Pourcentages: Affichage avec symbole %
- Dates: Format DD/MM/YYYY
- Coûts: Format monétaire DT

### Alertes Visuelles
- ⚠️ Retards dans le processus (> 30 jours)
- 🚨 Incohérences de données
- 📊 Performance en dessous du seuil

## ⚙️ 3.3.3 Fonctionnalités

### Gestion des Fiches Candidats
- ✅ Création complète de fiche
- ✏️ Modification des informations
- 🗑️ Suppression (avec confirmation)
- 📋 Duplication de fiche
- 🔍 Recherche avancée multi-critères

### Importation de Documents
- 📄 **CV**: PDF, DOCX
- 📎 **Documents joints**: Lettres de motivation, diplômes
- 💾 Stockage sécurisé
- 👁️ Prévisualisation en ligne

### Historique
- 📅 Entretiens passés
- ✅ Décisions prises
- 💬 Commentaires des recruteurs
- 📊 Évolution du statut

### Notifications
- 📧 Email automatique
- 🔔 Notifications internes
- ⏰ Rappels programmés
- 📱 Alertes temps réel

## 🆕 3.4 MODULE CRÉATION

### 3.4.1 Champs de Création Initiale

#### Informations Personnelles
- **Nom et prénom**: Obligatoire
- **Email**: Validation format email
- **Téléphone**: Format international
- **Date de naissance**: Date
- **Genre**: Masculin / Féminin
- **Adresse**: Adresse complète
- **Code postal**: Code postal
- **Ville**: Ville
- **Pays**: Pays

#### Informations Professionnelles
- **Poste visé**: Sélection depuis postes vacants
- **Département**: Auto-rempli depuis le poste
- **Spécialité**: Spécialité du poste
- **Niveau**: Niveau du poste
- **Experience**: Nombre d'années d'expérience
- **Langue**: Langue du poste

#### Origine de la Candidature
- **Source**: Site web, LinkedIn, Email, Autre
- **Date de réception**: Date du jour par défaut
- **Statut initial**: EN_COURS, SHORTLISTÉ
- **Statut final**: EMBAUCHÉ, NON_RETENU
- **Statut**: VACANT, EMBAUCHÉ, EN_COURS, TERMINÉ, ANNULÉ, SUSPENDU

#### Documents
- **CV**: Upload PDF/DOCX
- **Documents joints**: Multiples fichiers
- **Commentaires recruteur**: Zone de texte

### Fonctionnalités Automatiques
- ✅ Validation champs obligatoires
- 🆔 Attribution ID candidat unique
- 💾 Enregistrement base de données
- 📧 Notification recruteur

## 📝 3.4.2 Validations par Phase

### 1️⃣ Validation Fiche Demande Personnel
**Champs:**
- Nom du validateur RH
- Date de validation
- Commentaire de validation

**Actions:**
- Mise à jour statut → "VALIDÉ"
- Notification au recruteur
- Archivage de la décision

### 2️⃣ Validation Shortlist
**Champs:**
- Liste candidats présélectionnés
- Critères de sélection appliqués
- Observations du recruteur

**Actions:**
- Statut → "SHORTLISTÉ"
- Email aux candidats retenus
- Planification entretiens

### 3️⃣ Entretien Technique
**Champs:**
- Date et heure
- Membres du jury (multi-sélection)
- Résultat: ADMIS, EN_ATTENTE, REFUSÉ
- Commentaires du jury

**Actions:**
- Statut → "ENTRETIEN_TECHNIQUE"
- Notification candidat
- Mise à jour score

### 4️⃣ Entretien RH
**Champs:**
- Date et heure du 2ème entretien
- Évaluateurs présents
- Résultat final
- Recommandations

**Actions:**
- Statut → "ENTRETIEN_RH"
- Évaluation globale
- Décision finale

### 5️⃣ Sélection Finale
**Champs:**
- Nom du candidat retenu
- Décision: EMBAUCHÉ / NON_RETENU
- Date de décision
- Signature responsable RH

**Actions:**
- Statut → "SÉLECTIONNÉ"
- Email candidat retenu
- Email candidats non retenus
- Préparation visite médicale

### 6️⃣ Visite Médicale
**Champs:**
- Date de la visite
- Résultat: APTE / INAPTE
- Observations médicales

**Actions:**
- Statut → "VISITE_MÉDICALE"
- Validation aptitude
- Préparation offre

### 7️⃣ Offre d'Emploi
**Champs:**
- Date d'envoi offre
- Réponse candidat: ACCEPTÉE / REFUSÉE
- Date d'embauche effective

**Actions:**
- Statut → "OFFRE_ENVOYÉE"
- Si acceptée → "EMBAUCHÉ"
- Mise à jour poste vacant
- Clôture du processus

## 🔔 Notifications Automatiques

Chaque validation déclenche:
1. **Mise à jour statut** candidat
2. **Enregistrement** date + validateur
3. **Notification** recruteur + manager
4. **Email** au candidat (si applicable)
5. **Mise à jour** tableau de bord

## 📊 Métriques et Rapports

### Indicateurs Clés
- Temps moyen de recrutement
- Taux de conversion par étape
- Coût par embauche
- Source la plus performante
- Taux d'acceptation des offres

### Rapports Disponibles
- 📈 Rapport mensuel de recrutement
- 📊 Analyse par département
- 💰 Analyse des coûts
- ⏱️ Performance du processus
- 📋 Pipeline de candidats

## 🎨 Interface Utilisateur

### Design
- ✨ Animations fluides
- 🎨 Codes couleur intuitifs
- 📱 Responsive design
- 🌙 Mode sombre/clair
- ♿ Accessibilité WCAG 2.1

### Navigation
- 🔍 Recherche instantanée
- 🎯 Filtres avancés
- 📑 Tri multi-colonnes
- 📊 Export Excel/PDF
- 🔄 Actualisation temps réel

---

**Version**: 1.0.0  
**Date**: 2026-01-14  
**Statut**: ✅ Spécifications complètes
