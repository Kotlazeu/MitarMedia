#!/bin/bash
# Script de Deploy pentru Aplicații Next.js
set -e

# --- Configurație (Modificați numele procesului PM2) ---
PM2_PROCESS_NAME="numele-proiectului" # IMPORTANT: Schimbați cu numele din `pm2 list`

echo "#######################################"
echo "# Pornire script de deploy..."
echo "#######################################"

# Resetare modificări locale și descărcare de pe GitHub
echo "-> Resetare modificări locale..."
git reset --hard
echo "-> Descărcare modificări de pe GitHub (git pull)..."
git pull origin main # sau 'master' dacă acesta este branch-ul principal

# Instalare dependențe noi
echo "-> Instalare dependențe (npm install)..."
npm install

# Construirea aplicației pentru producție
echo "-> Construire proiect (npm run build)..."
npm run build

# Reîncărcarea aplicației cu PM2 (fără downtime)
echo "-> Reîncărcare aplicație în PM2 (pm2 reload)..."
pm2 reload $PM2_PROCESS_NAME

echo "#######################################"
echo "# Deploy finalizat cu succes!"
echo "#######################################"
