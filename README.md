# 📦 IPSLStock — Frontend (Angular 17+)

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Stable-success?style=for-the-badge" />
</p>

## 🚀 Vision du Projet
**IPSLStock** est une plateforme de gestion de stock intelligente conçue pour l'IPSL. Elle transcende la simple saisie de données en intégrant des couches de prédiction (IA) et une interface utilisateur haute performance. Ce frontend repose sur les standards les plus récents d'Angular (Standalone Architecture) pour garantir scalabilité et maintenabilité.



---

## ✨ Points Forts du Frontend
* **📊 Dashboard Analytique** : Visualisation en temps réel des flux et des alertes via Chart.js.
* **🧠 Intelligence Prédictive** : Module dédié affichant les probabilités de rupture calculées par l'IA.
* **🛡️ Sécurité de Niveau Entreprise** : Authentification JWT, interception systématique des requêtes HTTP et protection des routes par Guards.
* **⚡ Performance Optimisée** : Chargement paresseux (Lazy Loading) et composants autonomes (Standalone) pour un bundle ultra-léger.

---

## 🛠️ Stack Technologique
* **Framework** : Angular 17.3.12 (Architecture moderne sans NgModules)
* **Langage** : TypeScript
* **Design & UI** : Tailwind CSS / Bootstrap 5 (Responsive Design)
* **Data Vis** : Chart.js (Visualisation réactive)
* **Gestion de flux** : RxJS (Streams et Observables)

---

## ⚙️ Installation & Lancement rapide

### Prérequis
* **Node.js** (v18+)
* **Angular CLI** installé globalement (`npm install -g @angular/cli`)

### Déploiement local
1.  **Récupérer le code** :
    ```bash
    git clone [https://github.com/Xhadee/produit-frontend.git](https://github.com/Xhadee/produit-frontend.git)
    cd produit-frontend
    ```
2.  **Installer les dépendances** :
    ```bash
    npm install
    ```
3.  **Lancer le moteur** :
    ```bash
    ng serve
    ```
    👉 Naviguez vers `http://localhost:4200/`

---

## 🏗️ Architecture des Dossiers
Le projet suit une structure moderne et organisée pour séparer les responsabilités :

```text
src/app/
├── components/    # Composants d'interface (Dashboard, Listes, Formulaires)
├── guards/        # Protection des routes (Contrôle d'accès)
├── interceptors/  # Interception HTTP (Injection auto du Token JWT)
├── models/        # Typages et interfaces de données (TypeScript)
└── services/      # Logique métier et appels API (RxJS)

---

## 🔗 Écosystème IPSLStock
Ce frontend est conçu pour fonctionner en symbiose avec son API dédiée. Elle assure la persistance des données, la logique métier de l'inventaire et les calculs prédictifs.

* **Repository Backend** : [🚀 Accéder au Backend Spring Boot](https://github.com/Xhadee/produit-backend.git)

---

## 👤 Auteur
<p align="left">
  <strong>Développeur :</strong> [Khady NDIAYE]<br>
  <strong>Formation :</strong> IPSL (Institut Polytechnique de Saint-Louis)<br>
  <strong>Promotion :</strong> 2025-2026
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Projet-Académique-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Completed-success?style=flat-square" />
</p>
