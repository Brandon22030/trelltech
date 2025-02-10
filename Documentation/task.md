### Répartition du travail (back et front pour chaque personne):

#### **Edem: Workspaces (Espaces de travail)**
- **Back-end**:
  - Mettre en place l'intégration API pour la gestion des espaces de travail (CRUD: Créer, Lire, Modifier, Supprimer) avec Trello.
  - Mettre en place l’authentification via OAuth pour interagir avec Trello API.
- **Front-end**:
  - Créer l'interface utilisateur pour lister, créer, mettre à jour et supprimer des espaces de travail.
  - Connecter l'interface utilisateur avec les appels API, gérer les états de chargement et les erreurs.
  
#### **Daniel: Board (Tableaux)**
- **Back-end**:
  - Implémenter les appels API pour la gestion des tableaux dans les espaces de travail (CRUD).
  - Intégrer les types de tableaux (ex : Kanban) et gérer les templates.
- **Front-end**:
  - Créer l’interface pour afficher, créer, mettre à jour et supprimer des tableaux dans un espace de travail.
  - S'assurer que les données des tableaux sont bien synchronisées avec les appels API Trello et que l'expérience utilisateur est fluide.

#### **James: List (Listes)**
- **Back-end**:
  - Mettre en place les appels API pour la création, la lecture, la mise à jour et la suppression des listes dans un tableau.
  - S'assurer que les opérations de liste sont bien synchronisées avec Trello.
- **Front-end**:
  - Créer les écrans pour gérer les listes dans un tableau (afficher, créer, mettre à jour, supprimer).
  - Connecter ces écrans avec les données des listes récupérées via l'API.

#### **MStone: Card (Cartes)**
- **Back-end**:
  - Implémenter les opérations de gestion des cartes dans les listes (CRUD, assigner des membres à des cartes).
  - Gérer l’intégration des membres et l’attribution des tâches sur les cartes avec Trello API.
- **Front-end**:
  - Créer l’interface utilisateur pour afficher, créer, modifier et assigner des membres aux cartes dans les listes.
  - Intégrer la fonctionnalité de **drag-and-drop** pour déplacer les cartes entre les listes.

### Planning jour par jour (Back et Front pour chaque membre) :

#### **Jour 1 (Initialisation et Authentification)**
- **Tous** : 
  - Mise en place du projet Expo et configuration des bibliothèques principales (react-navigation, Redux/Context API, etc.).
  - Mise en place de l'authentification via OAuth pour accéder aux données de Trello.
  - Chaque membre configure son environnement pour travailler sur sa partie (Workspaces, Boards, Lists, Cards).

#### **Jour 2 (Back-end et Front-end pour chaque composant)**:
- **Edem (Workspaces)** :
  - Back: Implémentation des appels API pour créer/lire/modifier/supprimer les espaces de travail.
  - Front: Créer l'interface utilisateur pour gérer les espaces de travail.
- **DAniel (Boards)** :
  - Back: Implémenter les appels API pour créer/lire/modifier/supprimer des tableaux.
  - Front: Créer l'interface de gestion des tableaux dans un espace de travail.
- **James (Boards)** :
  - Back: Implémenter les appels API pour créer/lire/modifier/supprimer des listes.
  - Front: Créer l'interface de gestion des listes dans un espace tableau.
- **Stone (Boards)** :
  - Back: Implémenter les appels API pour créer/lire/modifier/supprimer des cartes.
  - Front: Créer l'interface de gestion des cartes dans une liste.
  
#### **Jour 3 (Back-end et Front-end pour chaque composant)**:
- **Membre 3 (Lists)** :
  - Back: Implémenter les appels API pour la gestion des listes dans un tableau.
  - Front: Créer l'interface de gestion des listes.
- **Membre 4 (Cards)** :
  - Back: Mettre en place les API pour les cartes, y compris l'attribution des membres aux cartes.
  - Front: Créer l’interface utilisateur pour la gestion des cartes, y compris la fonctionnalité de drag-and-drop.

#### **Jour 4 (Finalisation et Intégration)**
- **Membre 1 (Workspaces)** :
  - Terminer l’intégration front/back des espaces de travail, s’assurer que les données se synchronisent correctement.
- **Membre 2 (Boards)** :
  - Finaliser l'intégration des tableaux et tester les flux d'interaction.
- **Membre 3 (Lists)** :
  - S’assurer que les listes fonctionnent correctement dans l’interface et que l’API renvoie les bonnes données.
- **Membre 4 (Cards)** :
  - Terminer l'intégration des cartes et tester le drag-and-drop, s'assurer que l'attribution des membres est fonctionnelle.

#### **Jour 5 (Polissage et Révisions)**
- **Tous** :
  - Finaliser l'interface utilisateur.
  - Optimiser l'intégration des API et s'assurer que toutes les fonctionnalités sont synchronisées.
  - Revoir et déboguer les problèmes éventuels de l'intégration.