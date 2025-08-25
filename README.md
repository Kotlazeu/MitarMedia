# Ghid Complet: Publicarea Aplicației Next.js pe un VPS cu Ubuntu

Acest ghid vă va purta prin toți pașii necesari pentru a publica (a face "deploy") aplicația dumneavoastră Next.js pe un server privat virtual (VPS) care rulează Ubuntu. Vom folosi Nginx ca reverse proxy și PM2 pentru a menține aplicația activă.

---

### **Pasul 0: Pregătirea Domeniului (Configurare DNS)**

Înainte de a lucra pe server, trebuie să vă asigurați că domeniul dumneavoastră "știe" unde să trimită vizitatorii.

1.  **Obțineți Adresa IP a VPS-ului:** După ce ați cumpărat un VPS, veți primi o adresă IP publică (de exemplu, `123.45.67.89`).

2.  **Configurați înregistrările DNS:**
    *   Mergeți la panoul de administrare al registrar-ului de unde ați cumpărat domeniul (GoDaddy, Namecheap, etc.).
    *   Căutați secțiunea de management DNS.
    *   Creați sau modificați următoarele înregistrări de tip **`A`**:
        *   **Înregistrarea principală (root):**
            *   **Tip:** `A`
            *   **Gazdă/Nume (Host/Name):** `@` (acesta reprezintă domeniul principal, ex: `domeniul-tau.ro`)
            *   **Valoare (Value/Points to):** Adresa IP a VPS-ului (ex: `123.45.67.89`)
            *   **TTL (Time To Live):** Lăsați valoarea implicită (de obicei 1 oră sau automat).
        *   **Înregistrarea pentru `www`:**
            *   **Tip:** `A`
            *   **Gazdă/Nume (Host/Name):** `www`
            *   **Valoare (Value/Points to):** Adresa IP a VPS-ului (ex: `123.45.67.89`)
            *   **TTL:** Lăsați valoarea implicită.

    *Notă: Propagarea DNS poate dura de la câteva minute la câteva ore.*

---

### **Pasul 1: Conectarea la VPS și Actualizarea Inițială**

1.  **Conectați-vă prin SSH:** Deschideți un terminal și folosiți comanda de mai jos. Înlocuiți `utilizator` cu numele de utilizator (de obicei `root` sau `ubuntu`) și `adresa_ip_vps`.

    ```bash
    ssh utilizator@adresa_ip_vps
    ```

2.  **Actualizați Serverul:** Este esențial să aveți toate pachetele software la zi.

    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

---

### **Pasul 2: Instalarea Node.js**

Aplicația Next.js rulează pe Node.js. Vom folosi `nvm` (Node Version Manager) pentru o instalare curată.

1.  **Instalați `nvm`:**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```

2.  **Activați `nvm` pentru sesiunea curentă:**
    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    ```

3.  **Instalați cea mai recentă versiune LTS (Long-Term Support) de Node.js:**
    ```bash
    nvm install --lts
    ```

---

### **Pasul 3: Transferul Fișierelor Proiectului pe VPS**

1.  **Pe calculatorul LOCAL**, navigați în directorul proiectului și creați o versiune de producție a aplicației:
    ```bash
    npm run build
    ```

2.  **Transferați fișierele pe server:** Vom folosi `rsync` pentru un transfer eficient. Asigurați-vă că rulați comanda din afara directorului proiectului.

    ```bash
    # Înlocuiți 'cale/catre/proiect' și 'numele-proiectului'
    rsync -av --exclude 'node_modules' --exclude '.next' cale/catre/proiect/numele-proiectului/ utilizator@adresa_ip_vps:~/
    ```
    Această comandă copiază directorul proiectului în directorul "home" (`~/`) de pe VPS.

---

### **Pasul 4: Configurarea Proiectului pe Server**

1.  **Pe VPS**, navigați în directorul nou creat:
    ```bash
    # Înlocuiți 'numele-proiectului' cu numele real
    cd ~/numele-proiectului
    ```

2.  **Instalați dependințele de producție:**
    ```bash
    npm install --production
    ```

---

### **Pasul 5: Rularea Aplicației cu PM2**

PM2 este un manager de procese care va menține aplicația rulând 24/7.

1.  **Instalați PM2 global:**
    ```bash
    npm install pm2 -g
    ```

2.  **Porniți aplicația folosind PM2:**
    ```bash
    # Înlocuiți "numele-proiectului" cu un nume ușor de recunoscut
    pm2 start npm --name "numele-proiectului" -- start
    ```
    *   `--name`: Dă un nume procesului.
    *   `-- start`: Îi spune lui PM2 să ruleze comanda `npm run start`.

3.  **Configurați PM2 să pornească automat la reboot:**
    ```bash
    pm2 startup
    ```
    Urmați instrucțiunile afișate de comandă (de obicei, trebuie să rulați o comandă cu `sudo`). Apoi, salvați starea proceselor:
    ```bash
    pm2 save
    ```

---

### **Pasul 6: Instalarea și Configurarea Nginx ca Reverse Proxy**

Nginx va prelua cererile de la vizitatori (pe portul 80) și le va redirecționa către aplicația Next.js, care rulează pe portul 3000.

1.  **Instalați Nginx:**
    ```bash
    sudo apt install nginx -y
    ```

2.  **Creați un fișier de configurare pentru site:**
    ```bash
    # Înlocuiți 'domeniul-tau.ro' cu domeniul real
    sudo nano /etc/nginx/sites-available/domeniul-tau.ro
    ```

3.  **Adăugați următorul conținut în fișier.** Asigurați-vă că înlocuiți `domeniul-tau.ro` cu domeniul dumneavoastră.

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

4.  **Activați configurația creând un link simbolic:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/domeniul-tau.ro /etc/nginx/sites-enabled/
    ```

5.  **Verificați sintaxa Nginx și reporniți serviciul:**
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

În acest moment, ar trebui să puteți accesa site-ul la adresa `http://domeniul-tau.ro`.

---

### **Pasul 7 (Recomandat): Securizarea cu SSL (HTTPS)**

Vom folosi Let's Encrypt și Certbot pentru a obține un certificat SSL gratuit.

1.  **Instalați Certbot:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```

2.  **Obțineți și instalați certificatul:**
    ```bash
    # Înlocuiți cu domeniile dumneavoastră
    sudo certbot --nginx -d domeniul-tau.ro -d www.domeniul-tau.ro
    ```
    Urmați instrucțiunile de pe ecran. Certbot va modifica automat fișierul de configurare Nginx pentru a activa HTTPS și va configura reînnoirea automată a certificatului.

---

### **Gata!**

Felicitări! Ați publicat cu succes aplicația Next.js. Site-ul este acum live, securizat cu HTTPS și rulează constant datorită PM2 și Nginx.
