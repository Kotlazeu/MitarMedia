# Firebase Studio

## Ghid de Publicare pe un VPS cu Ubuntu

Acest ghid vă va arăta cum să publicați (să faceți "deploy") aplicația dumneavoastră Next.js pe un server privat virtual (VPS) care rulează Ubuntu. Vom folosi Nginx ca reverse proxy pentru a gestiona traficul și PM2 pentru a menține aplicația rulând în fundal.

### Pasul 1: Conectarea la VPS

Mai întâi, conectați-vă la serverul dumneavoastră Ubuntu prin SSH. De obicei, veți face acest lucru folosind un terminal. Înlocuiți `utilizator` cu numele dumneavoastră de utilizator și `adresa_ip_vps` cu adresa IP a serverului.

```bash
ssh utilizator@adresa_ip_vps
```

### Pasul 2: Actualizarea Serverului

Este o bună practică să vă asigurați că toate pachetele de pe server sunt la zi.

```bash
sudo apt update && sudo apt upgrade -y
```

### Pasul 3: Instalarea Node.js

Aplicația Next.js are nevoie de Node.js pentru a rula. Cea mai simplă metodă de a instala și gestiona versiunile de Node.js este folosind `nvm` (Node Version Manager).

1.  **Instalați `nvm`:**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```

2.  **Activați `nvm`:**
    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    ```
    Pentru a vă asigura că `nvm` este disponibil permanent, adăugați liniile de mai sus la finalul fișierului `~/.bashrc`.

3.  **Instalați cea mai recentă versiune stabilă (LTS) de Node.js:**
    ```bash
    nvm install --lts
    ```

### Pasul 4: Transferul Fișierelor Proiectului pe VPS

1.  **Pe calculatorul local**, navigați în directorul proiectului și creați o versiune de producție a aplicației:
    ```bash
    npm run build
    ```

2.  **Transferați fișierele pe server.** Excludeți directorul `node_modules` pentru a economisi timp și spațiu. Cea mai comună metodă este `rsync`. Asigurați-vă că sunteți în afara directorului proiectului când rulați comanda. Înlocuiți `cale/catre/proiect` cu calea reală și `mitar-media` cu numele directorului proiectului.

    ```bash
    rsync -av --exclude 'node_modules' --exclude '.next' cale/catre/proiect/mitar-media/ utilizator@adresa_ip_vps:~/
    ```
    Aceasta va copia directorul `mitar-media` în directorul "home" de pe VPS.

### Pasul 5: Configurarea Proiectului pe Server

1.  **Pe VPS**, navigați în directorul proiectului:
    ```bash
    cd ~/mitar-media
    ```

2.  **Instalați dependințele de producție:**
    ```bash
    npm install --production
    ```

### Pasul 6: Instalarea și Folosirea PM2

PM2 este un manager de procese care va menține aplicația rulând 24/7, chiar dacă închideți terminalul sau serverul se restartează.

1.  **Instalați PM2 global:**
    ```bash
    npm install pm2 -g
    ```

2.  **Porniți aplicația folosind PM2:**
    ```bash
    pm2 start npm --name "mitar-media" -- start
    ```
    *   `--name "mitar-media"` dă un nume procesului pentru a-l putea gestiona mai ușor.
    *   `-- start` este argumentul care îi spune lui PM2 să ruleze comanda `npm run start` din `package.json`.

3.  **Configurați PM2 să pornească automat la reboot:**
    ```bash
    pm2 startup
    ```
    Urmați instrucțiunile afișate de comandă. Apoi, salvați starea proceselor:
    ```bash
    pm2 save
    ```

### Pasul 7: Instalarea și Configurarea Nginx

Nginx va acționa ca un "reverse proxy". El va prelua cererile venite de la vizitatori pe portul standard (80 pentru HTTP) și le va redirecționa către aplicația Next.js, care rulează local pe portul 3000.

1.  **Instalați Nginx:**
    ```bash
    sudo apt install nginx -y
    ```

2.  **Creați un fișier de configurare pentru site:**
    Înlocuiți `domeniul-tau.ro` cu numele real al domeniului.
    ```bash
    sudo nano /etc/nginx/sites-available/domeniul-tau.ro
    ```

3.  **Adăugați următorul conținut în fișier.** Asigurați-vă că înlocuiți `domeniul-tau.ro` și `www.domeniul-tau.ro` cu domeniul dumneavoastră.

    ```nginx
    server {
        listen 80;
        listen [::]:80;

        server_name domeniul-tau.ro www.domeniul-tau.ro;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
    Salvați și închideți fișierul (Ctrl+X, apoi Y, apoi Enter în `nano`).

4.  **Activați configurația:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/domeniul-tau.ro /etc/nginx/sites-enabled/
    ```

5.  **Verificați sintaxa Nginx și reporniți serviciul:**
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

Acum, ar trebui să puteți accesa site-ul la adresa `http://domeniul-tau.ro`.

### Pasul 8 (Opțional, dar Recomandat): Securizarea cu SSL (HTTPS)

Vom folosi Let's Encrypt pentru a obține un certificat SSL gratuit.

1.  **Instalați Certbot:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```

2.  **Obțineți și instalați certificatul:**
    ```bash
    sudo certbot --nginx -d domeniul-tau.ro -d www.domeniul-tau.ro
    ```
    Urmați instrucțiunile de pe ecran. Certbot va modifica automat fișierul de configurare Nginx pentru a activa HTTPS și va configura reînnoirea automată.

### Gata!

Felicitări! Ați publicat cu succes aplicația Next.js pe serverul dumneavoastră. Site-ul este acum live, securizat și rulează constant datorită PM2 și Nginx.
