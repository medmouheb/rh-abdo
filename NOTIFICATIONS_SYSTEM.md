# 🔔 Système de Notifications

## Vue d'ensemble

Le système de notifications envoie automatiquement des notifications au CO et au RH lorsqu'un candidat est validé en entretien RH ou Technique.

## 📋 Fonctionnalités

### 1. **Notifications automatiques**
- ✅ Notification envoyée au CO et au RH quand un candidat est validé (ADMITTED) en entretien
- ✅ Support pour entretiens RH et Technique
- ✅ Message personnalisé avec nom du candidat et poste

### 2. **Composant de notifications**
- ✅ Badge avec compteur de notifications non lues
- ✅ Liste des notifications avec animations
- ✅ Marquer comme lu individuellement ou toutes
- ✅ Liens vers les éléments concernés
- ✅ Actualisation automatique toutes les 30 secondes

## 🗄️ Base de données

### Modèle Notification
```prisma
model Notification {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  userId      Int      // Destinataire
  type        String   // "INTERVIEW_VALIDATED", "HIRING_REQUEST", etc.
  title       String
  message     String
  relatedId   Int?     // ID de l'entretien/candidat
  relatedType String?  // "interview", "candidate", "hiringRequest"
  isRead      Boolean  @default(false)
  readAt      DateTime?
  createdBy   Int?     // ID de l'utilisateur qui a créé la notification
}
```

## 🔧 API Endpoints

### GET `/api/notifications`
Récupère les notifications de l'utilisateur connecté
- Query params: `?unreadOnly=true` (optionnel)

### POST `/api/notifications`
Crée une nouvelle notification

### PATCH `/api/notifications/[id]`
Marque une notification comme lue

### DELETE `/api/notifications/[id]`
Supprime une notification

### PATCH `/api/interviews/[id]`
Met à jour le résultat d'un entretien et crée automatiquement des notifications si `result === "ADMITTED"`

## 📝 Utilisation

### Créer une notification manuellement
```typescript
import { createNotification } from "@/lib/notifications";

await createNotification({
  userId: 1,
  type: "INTERVIEW_VALIDATED",
  title: "Candidat validé",
  message: "Le candidat X a été validé...",
  relatedId: interviewId,
  relatedType: "interview",
  createdBy: currentUserId,
});
```

### Notification automatique lors de validation d'entretien
Lorsqu'un entretien est mis à jour avec `result: "ADMITTED"`, les notifications sont créées automatiquement via:
- `/api/interviews/[id]` (PATCH)
- `updateInterviewResult()` dans `actions/candidates.ts`

## 🎨 Interface utilisateur

### Composant Notification
- **Emplacement**: Header (en haut à droite)
- **Badge**: Affiche le nombre de notifications non lues
- **Dropdown**: Liste des notifications avec:
  - Icône selon le type
  - Titre et message
  - Date de création
  - Indicateur "non lu"
  - Lien vers l'élément concerné

## 🚀 Migration

Pour appliquer les changements à la base de données:

```bash
npx prisma migrate deploy
# ou en développement:
npx prisma db push
```

Puis régénérer le client Prisma:
```bash
npx prisma generate
```

## 📊 Types de notifications

- `INTERVIEW_VALIDATED` - Candidat validé en entretien
- `HIRING_REQUEST` - Nouvelle demande d'embauche (à implémenter)
- `CANDIDATE_UPDATE` - Mise à jour candidat (à implémenter)

## 🔄 Flux de notification

1. Un utilisateur valide un candidat en entretien (RH ou Technique)
2. Le résultat est mis à jour avec `result: "ADMITTED"`
3. Le système récupère tous les utilisateurs avec rôle CO et RH
4. Une notification est créée pour chaque utilisateur CO et RH
5. Les notifications apparaissent dans le header avec un badge
6. Les utilisateurs peuvent voir et marquer les notifications comme lues

## ✅ Test

1. Connectez-vous en tant que RH ou Manager
2. Validez un candidat en entretien (mettre `result: "ADMITTED"`)
3. Connectez-vous en tant que CO ou RH
4. Vérifiez que la notification apparaît dans le header
5. Cliquez sur la notification pour la marquer comme lue
