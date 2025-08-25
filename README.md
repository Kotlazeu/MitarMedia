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

1.  **Pe calculatorul LOCAL**, navigați în directorul proiectului.

2.  **Transferați fișierele pe server:** Vom folosi `rsync` pentru un transfer eficient. Asigurați-vă că excludeți `node_modules` și `.next`.

    ```bash
    # Înlocuiți 'cale/catre/proiect' și 'numele-proiectului'
    rsync -av --exclude 'node_modules' --exclude '.next' cale/catre/proiect/numele-proiectului/ utilizator@adresa_ip_vps:~/
    ```
    Această comandă copiază directorul proiectului în directorul "home" (`~/`) de pe VPS.

---

### **Pasul 4: Configurarea și Construirea Proiectului pe Server**

Acum vom instala dependențele și vom crea build-ul de producție direct pe server.

1.  **Pe VPS**, navigați în directorul nou creat:
    ```bash
    # Înlocuiți 'numele-proiectului' cu numele real
    cd ~/numele-proiectului
    ```

2.  **Instalați TOATE dependințele (inclusiv cele de dev, necesare pentru build):**
    ```bash
    npm install
    ```

3.  **Creați build-ul de producție (Pas Crucial!):**
    ```bash
    npm run build
    ```
    Acest pas creează directorul `.next`, care conține versiunea optimizată a site-ului.

---

### **Pasul 5: Rularea Aplicației cu PM2**

PM2 este un manager de procese care va menține aplicația rulând 24/7.

1.  **Instalați PM2 global:**
    ```bash
    npm install pm2 -g
    ```

2.  **Porniți aplicația folosind PM2:** Vom porni aplicația Next.js, care rulează implicit pe portul 3000.
    ```bash
    # Înlocuiți "numele-proiectului" cu un nume ușor de recunoscut
    pm2 start npm --name "numele-proiectului" -- start
    ```
    *   `--name`: Dă un nume procesului în PM2.
    *   `-- start`: Îi spune lui PM2 să ruleze comanda `npm run start` (definită în `package.json`).

3.  **Verificați starea aplicației (Opțional, dar recomandat):**
    ```bash
    pm2 list
    ```
    Ar trebui să vedeți procesul cu statusul `online`.

4.  **Configurați PM2 să pornească automat la reboot:**
    ```bash
    pm2 startup
    ```
    Urmați instrucțiunile afișate (de obicei, trebuie să rulați o comandă cu `sudo`). Apoi, salvați starea proceselor:
    ```bash
    pm2 save
    ```

---

### **Pasul 6: Instalarea și Configurarea Nginx (Metoda Directă)**

Nginx va prelua cererile de la vizitatori (pe portul 80) și le va redirecționa către aplicația Next.js, care rulează local pe portul 3000. Vom edita direct fișierul principal de configurare pentru a evita erorile comune.

1.  **Instalați Nginx:**
    ```bash
    sudo apt install nginx -y
    ```

2.  **Faceți un backup al fișierului de configurare original (recomandat):**
    ```bash
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    ```

3.  **Deschideți fișierul principal de configurare pentru a-l edita:**
    ```bash
    sudo nano /etc/nginx/nginx.conf
    ```

4.  **Înlocuiți blocul `server` implicit:**
    Localizați blocul `http { ... }`. În interiorul acestuia, ar trebui să vedeți o linie `include /etc/nginx/sites-enabled/*;` și posibil alte directive. Vom șterge acea includere și vom pune configurația noastră direct aici.

    Modificați blocul `http { ... }` astfel încât să arate ca mai jos. **Ștergeți sau comentați linia `include /etc/nginx/sites-enabled/*;`** și adăugați blocul `server` de mai jos în interiorul `http { ... }`.

    **Asigurați-vă că înlocuiți `domeniul-tau.ro` cu domeniul dumneavoastră real!**

    ```nginx
    # ... alte setări din nginx.conf ...

    http {
        # ... alte directive http ...

        # Ștergeți sau comentați linia de mai jos dacă există:
        # include /etc/nginx/sites-enabled/*;

        # Adăugați acest bloc server:
        server {
            listen 80;
            listen [::]:80;

            server_name domeniul-tau.ro www.domeniul-tau.ro;

            location / {
                proxy_pass http://127.0.0.1:3000; # Portul pe care rulează aplicația Next.js
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        }

        # ... restul directivelor http ...
    }

    # ... restul fișierului nginx.conf ...
    ```
    Salvați și închideți fișierul (Ctrl+X, apoi Y, apoi Enter în `nano`).

5.  **Verificați sintaxa Nginx (Pas Crucial!):**
    ```bash
    sudo nginx -t
    ```
    Dacă primiți `syntax is ok` și `test is successful`, puteți continua. Dacă nu, mesajul de eroare vă va indica exact linia cu problema.

6.  **Reîncărcați Nginx pentru a aplica modificările:**
    ```bash
    sudo systemctl reload nginx
    ```

Acum, site-ul ar trebui să fie accesibil la adresa `http://domeniul-tau.ro` și să afișeze aplicația Next.js.

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

### **Pasul 8 (Depanare): Ce fac dacă văd o eroare 502 Bad Gateway?**

Eroarea 502 înseamnă că Nginx nu poate comunica cu aplicația Next.js.

1.  **Verificați starea aplicației în PM2:**
    ```bash
    pm2 list
    ```
    Asigurați-vă că procesul are statusul `online`. Dacă este `errored` sau `stopped`, ceva este în neregulă cu aplicația.

2.  **Verificați log-urile (jurnalele) aplicației:** Acesta este cel mai important pas de depanare.
    ```bash
    # Înlocuiți "numele-proiectului" cu numele pe care l-ați dat în PM2
    pm2 logs numele-proiectului
    ```
    Această comandă vă va arăta în timp real orice eroare pe care o generează aplicația Next.js. Erorile comune includ variabile de mediu lipsă, probleme în cod sau erori de build.

---

### **Gata!**

Felicitări! Ați publicat cu succes aplicația Next.js. Site-ul este acum live, securizat cu HTTPS și rulează constant datorită PM2 și Nginx.
