const mqtt = require('mqtt');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const sqlite3 = require('sqlite3').verbose(); // Zidna hada

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 1. Création / Connexion à la Base de Données
const db = new sqlite3.Database('./irrigation.db', (err) => {
    if (err) console.error("Erreur DB:", err.message);
    else console.log("✅ Base de données SQLite connectée.");
});

// Créer la table si elle n'existe pas
db.run(`CREATE TABLE IF NOT EXISTS mesures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temp REAL,
    sol INTEGER,
    date TEXT
)`);

const client = mqtt.connect('mqtt://broker.emqx.io'); // Ila kan khdam lik emqx, khallih. Ila la, dir test.mosquitto.org

app.use(express.static('public'));

// API bach njibo l-historique l l-graphique
app.get('/api/history', (req, res) => {
    db.all("SELECT * FROM mesures ORDER BY id DESC LIMIT 20", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "data": rows.reverse() }); // Nqelbouhom bach ybanou b tertib
    });
});

client.on('connect', () => {
    console.log('✅ Connecté au MQTT Broker');
    client.subscribe('projet/irrigation/data');
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    const now = new Date().toLocaleTimeString(); // Sa3a dyl daba
    
    console.log(`📡 Reçu: Temp ${data.temp}°C, Sol ${data.sol}%`);
    
    // 2. Sauvegarder dans SQLite
    db.run(`INSERT INTO mesures (temp, sol, date) VALUES (?, ?, ?)`, 
        [data.temp, data.sol, now], 
        function(err) {
            if (err) return console.error(err.message);
        }
    );

    // Envoyer au Frontend avec l'heure
    io.emit('sensor-data', { ...data, time: now });

    // Logique Pompe
    if (data.sol < 30) {
        client.publish('projet/irrigation/pompe', 'ON');
        io.emit('pompe-status', 'ON');
    } else {
        client.publish('projet/irrigation/pompe', 'OFF');
        io.emit('pompe-status', 'OFF');
    }
});

io.on('connection', (socket) => {
    socket.on('control-pompe', (action) => {
        client.publish('projet/irrigation/pompe', action);
    });
});

server.listen(3000, () => {
    console.log('🚀 Serveur démarré sur http://localhost:3000');
});