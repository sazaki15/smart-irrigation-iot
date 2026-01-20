# 🌱 Système d'Irrigation Intelligent (IoT)

Ce projet est une solution **IoT (Internet of Things)** complète simulant un système d'irrigation intelligent. Il surveille l'humidité du sol et la température en temps réel pour automatiser l'arrosage, optimisant ainsi la consommation d'eau.

---

## 🚀 Fonctionnalités
- **Surveillance Temps Réel :** Affichage de la température et de l'humidité du sol.
- **Automatisation :** La pompe s'active automatiquement si l'humidité du sol est inférieure à **30%**.
- **Mode Démonstration :** Simulation de variations climatiques (valeurs aléatoires) pour tester la réactivité du système.
- **Dashboard Web :** Interface utilisateur avec graphiques dynamiques (**Chart.js**) et indicateurs d'état.
- **Historique des Données :** Stockage automatique des mesures dans une base de données **SQLite**.
- **Contrôle Manuel :** Possibilité de forcer l'activation/désactivation de la pompe depuis le web.

---

## 🛠️ Architecture Technique

Le système repose sur une architecture 4-tiers :

1.  **Capteurs/Actuateurs (Edge) :** Simulation **Wokwi** (ESP32 + DHT22 + LED/Pompe).
2.  **Communication :** Protocole **MQTT** (Broker public).
3.  **Backend (Serveur) :** **Node.js** + **Express.js**.
4.  **Stockage & Frontend :** **SQLite** (Base de données) + **HTML/JS/Socket.io**.

### 📦 Technologies utilisées
* ![ESP32](https://img.shields.io/badge/Hardware-ESP32-black)
* ![NodeJS](https://img.shields.io/badge/Backend-Node.js-green)
* ![SQLite](https://img.shields.io/badge/Database-SQLite-blue)
* ![MQTT](https://img.shields.io/badge/Protocol-MQTT-orange)
* ![ChartJS](https://img.shields.io/badge/Frontend-Chart.js-red)

---

## 📂 Structure du Projet

```bash
smart-irrigation-iot/
│
├── public/              # Fichiers Frontend (Site Web)
│   ├── index.html       # Dashboard principal
│
├── server.js            # Code du Serveur (Node.js + MQTT + SQLite)
├── package.json         # Dépendances du projet
├── irrigation.db        # Fichier de base de données (généré automatiquement)
│
├── code_esp32.txt       # Code C++ pour l'ESP32 (Arduino)
├── diagram.json         # Schéma de câblage Wokwi
└── README.md            # Documentation du projet