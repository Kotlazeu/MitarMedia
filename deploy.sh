#!/bin/bash

# Script de Deploy pentru Aplicații Next.js
# Oprește scriptul dacă orice comandă eșuează
set -e

# --- Configurații (modificați dacă este necesar) ---
PROJECT_DIR="~/numele-proiectului" # Schimbați "numele-proiectului" cu numele real al directorului
PM2_PROCESS_NAME="numele-proiectului" # Numele procesului din `pm2 list`
BACKUP_DIR="~/backups" # Directorul unde vor fi salvate backup-urile

# --- Script ---
echo "#######################################"
echo "# Pornire script de deploy..."
echo "#######################################"

# Navigare către directorul proiectului
# Folosim `eval` pentru a expanda corect `~` la directorul home
eval cd $PROJECT_DIR

# Creare director de backup dacă nu există
eval mkdir -p $BACKUP_DIR

# Creare backup
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILENAME="backup-$TIMESTAMP.tar.gz"
echo "-> Creare backup: $BACKUP_FILENAME..."
# Arhivăm tot, cu excepția `node_modules`
tar --exclude='node_modules' -czf "$BACKUP_DIR/$BACKUP_FILENAME" .
echo "-> Backup creat cu succes în $BACKUP_DIR/$BACKUP_FILENAME"

# Descărcare ultimele modificări din branch-ul principal (main)
echo "-> Descărcare modificări de pe GitHub (git pull)..."
git pull origin main # sau 'master' dacă acesta este branch-ul principal

# Instalare dependențe noi (dacă există)
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
