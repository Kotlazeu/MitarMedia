
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

### **Pasul 3: Transferul Fișierelor Proiectului pe VPS (Doar la Prima Configurare)**

Această secțiune este necesară doar pentru prima instalare. Pentru actualizări viitoare, vom folosi scriptul de deploy.

1.  **Configurați Git pe server (dacă nu ați făcut-o deja):**
    ```bash
    # Instalați git
    sudo apt install git -y
    
    # Configurați-vă numele și email-ul
    git config --global user.name "Numele Tau"
    git config --global user.email "email@tau.com"
    ```

2.  **Clonați proiectul de pe GitHub:**
    Înlocuiți `URL_PROIECT_GITHUB` cu URL-ul real al repository-ului dumneavoastră.
    
    **(Atenție: Această comandă `git clone` se rulează o singură dată! Dacă directorul există deja, săriți peste acest pas și navigați direct în el cu `cd numele-proiectului`.)**

    ```bash
    # Navigați în directorul 'home'
    cd ~
    
    # Clonați proiectul
    git clone URL_PROIECT_GITHUB numele-proiectului
    ```
    Exemplu: `git clone https://github.com/nume-utilizator/proiectul-meu.git numele-proiectului`

---

### **Pasul 4: Configurarea și Construirea Proiectului pe Server**

Acum vom instala dependențele și vom crea build-ul de producție direct pe server.

1.  **Pe VPS, navigați în directorul nou creat.** Acesta este un pas **CRUCIAL**. Toate comenzile următoare trebuie rulate din interiorul directorului proiectului.
    ```bash
    # Înlocuiți 'numele-proiectului' cu numele real
    cd ~/numele-proiectului
    ```
    *Notă: Dacă nu sunteți sigur, rulați comanda `ls` pentru a vedea directoarele disponibile și a vă asigura că sunteți în locul corect.*

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

2.  **Faceți PM2 accesibil global (Pas Important!):** Rulați această comandă pentru a crea un link simbolic, astfel încât sistemul să găsească `pm2` indiferent de calea `nvm`.
    ```bash
    sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/pm2" /usr/local/bin/pm2
    ```
    *Notă de depanare: Dacă întâmpinați eroarea `pm2: command not found` sau `ln: failed to create symbolic link`, această comandă ar trebui să o rezolve. Ea construiește calea absolută către executabilul `pm2` și o leagă de un director standard din `PATH`-ul sistemului.*

3.  **Porniți aplicația folosind PM2:** Vom porni aplicația Next.js, care rulează implicit pe portul 3000. Folosim o sintaxă explicită pentru a ne asigura că PM2 execută corect scriptul.
    ```bash
    # Înlocuiți "numele-proiectului" cu un nume ușor de recunoscut
    pm2 start "npm run start" --name "numele-proiectului"
    ```
    *   `--name`: Dă un nume procesului în PM2.
    *   `"npm run start"`: Îi spune lui PM2 să ruleze exact comanda `npm run start` (definită în `package.json`).

4.  **Verificați starea aplicației (Opțional, dar recomandat):**
    ```bash
    pm2 list
    ```
    Ar trebui să vedeți procesul cu statusul `online`.

5.  **Configurați PM2 să pornească automat la reboot:**
    ```bash
    pm2 startup
    ```
    Urmați instrucțiunile afișate (de obicei, trebuie să rulați o comandă cu `sudo`). Apoi, salvați starea proceselor:
    ```bash
    pm2 save
    ```

---

### **Pasul 6: Instalarea și Configurarea Nginx (Metoda Directă și Simplificată)**

Nginx va prelua cererile de la vizitatori (pe portul 80) și le va redirecționa către aplicația Next.js, care rulează local pe portul 3000. Vom edita direct fișierul principal de configurare pentru a elimina posibilele erori.

1.  **Instalați Nginx:**
    ```bash
    sudo apt install nginx -y
    ```

2.  **Faceți un backup al fișierului de configurare original (recomandat):**
    ```bash
    sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
    ```

3.  **Deschideți fișierul de configurare pentru a-l edita:**
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

4.  **Înlocuiți întregul conținut al fișierului:**
    Ștergeți tot conținutul existent și înlocuiți-l cu configurația de mai jos.

    **Asigurați-vă că înlocuiți `domeniul-tau.ro` cu domeniul dumneavoastră real!**

    ```nginx
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
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
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

Acum, site-ul ar trebui să fie accesibil la adresa `http://domeniul-tau.ro` și să afișeze aplicația Next.js. Pagina implicită Nginx nu ar trebui să mai apară.

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
    Această comandă vă va arăta în timp real orice eroare pe care o generează aplicația Next.js. Erorile comune includ variabile de mediu lipsă, probleme în cod sau erori de build. Dacă vedeți o eroare aici, ea vă va oferi indiciul necesar pentru a rezolva problema.

---

### **Pasul 9: Automatizarea Actualizărilor cu un Script de Deploy**

Pentru a simplifica procesul de actualizare a site-ului după ce faceți modificări și le încărcați pe GitHub, puteți folosi scriptul `deploy.sh`. Aceasta este metoda recomandată pentru **toate actualizările viitoare**.

1.  **Faceți scriptul executabil (doar o singură dată):**
    Navigați în directorul proiectului și rulați comanda:
    ```bash
    chmod +x deploy.sh
    ```

2.  **Editați scriptul (dacă este necesar):**
    Scriptul este pre-configurat pentru o structură standard. Deschideți-l cu `nano deploy.sh` dacă numele proiectului sau numele procesului PM2 este diferit.

3.  **Rulați scriptul de deploy:**
    De fiecare dată când doriți să actualizați site-ul cu cele mai recente modificări de pe GitHub, navigați în directorul proiectului și rulați o singură comandă:
    ```bash
    ./deploy.sh
    ```
    Scriptul se va ocupa de tot: va crea un backup, va descărca modificările, va instala pachetele necesare, va construi proiectul și va reîncărca aplicația în PM2 fără downtime.

---

### **Gata!**

Felicitări! Ați publicat cu succes aplicația Next.js. Site-ul este acum live, securizat cu HTTPS și rulează constant datorită PM2 și Nginx.

---
---

### **Anexă: Publicarea paginii Social pe un Subdomeniu (VPS Separat)**

Acest ghid explică cum să publicați pagina `/social` pe un subdomeniu dedicat (ex: `social.domeniul-tau.ro`) folosind un server VPS separat. Se presupune că ați urmat deja pașii 1-5 din ghidul principal pe acest nou VPS.

#### **Pasul A: Configurare DNS pentru Subdomeniu**

1.  **Obțineți Adresa IP a noului VPS:** Veți avea o adresă IP diferită pentru acest al doilea server (ex: `198.51.100.100`).

2.  **Adăugați o nouă înregistrare DNS:**
    *   Mergeți la panoul de administrare al domeniului dumneavoastră.
    *   Căutați secțiunea de management DNS.
    *   Creați o nouă înregistrare de tip **`A`**:
        *   **Tip:** `A`
        *   **Gazdă/Nume (Host/Name):** `social` (acesta este prefixul subdomeniului)
        *   **Valoare (Value/Points to):** Adresa IP a **celui de-al doilea** VPS (ex: `198.51.100.100`)
        *   **TTL:** Lăsați valoarea implicită.

    *Notă: Propagarea DNS poate dura câteva ore.*

#### **Pasul B: Configurare Nginx pentru Subdomeniu**

Pe al doilea VPS (cel pentru `social`), trebuie să configurăm Nginx să "asculte" cererile venite pe subdomeniu și să le trimită către aplicația Next.js (care rulează pe portul 3000, conform Pasului 5).

Metoda recomandată este crearea unui fișier de configurare separat pentru fiecare site/subdomeniu.

1.  **Dezactivați configurația implicită (dacă nu este necesară):**
    ```bash
    # Această comandă șterge link-ul simbolic, dar nu fișierul original
    sudo unlink /etc/nginx/sites-enabled/default
    ```

2.  **Creați un fișier de configurare nou pentru subdomeniu:**
    ```bash
    sudo nano /etc/nginx/sites-available/social.domeniul-tau.ro
    ```
    *(Înlocuiți cu subdomeniul dumneavoastră real)*

3.  **Adăugați configurația Nginx în fișierul nou:**
    Copiați și lipiți configurația de mai jos. **Asigurați-vă că înlocuiți `social.domeniul-tau.ro` cu subdomeniul dumneavoastră real!**

    ```nginx
    server {
        listen 80;
        listen [::]:80;

        server_name social.domeniul-tau.ro;

        # Important: Redirectează tot traficul către pagina /social
        # Acest lucru este necesar deoarece întreaga aplicație este pe server.
        location / {
            # Trimite cererea către aplicația Next.js care afișează implicit pagina /
            # Aplicația trebuie să fie configurată să afișeze conținutul dorit la ruta /
            # În cazul nostru, Next.js va afișa pagina principală, care ar trebui să fie pagina social.
            # Pentru a face asta, ar trebui să modificați src/app/page.tsx să fie pagina social.
            # Alternativ, puteți face un rewrite aici.

            # Metoda simplă (dacă pagina /social este singura relevantă)
            # Adăugăm /social la cerere
            rewrite ^/(.*)$ /social/$1 break;
            
            proxy_pass http://127.0.0.1:3000; # Portul pe care rulează aplicația Next.js
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```
    *Notă: Am adăugat o regulă `rewrite` pentru a ne asigura că orice vizitator al subdomeniului este direcționat automat către conținutul paginii `/social`, chiar dacă accesează rădăcina subdomeniului.*

4.  **Activați noua configurație creând un link simbolic:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/social.domeniul-tau.ro /etc/nginx/sites-enabled/
    ```

5.  **Verificați sintaxa și reîncărcați Nginx:**
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```

#### **Pasul C: Securizare SSL pentru Subdomeniu**

1.  **Rulați Certbot pentru subdomeniul specific:**
    ```bash
    # Înlocuiți cu subdomeniul dumneavoastră
    sudo certbot --nginx -d social.domeniul-tau.ro
    ```
    Urmați instrucțiunile de pe ecran. Certbot va detecta și va modifica automat fișierul `social.domeniul-tau.ro` pentru a activa HTTPS.

Gata! Acum subdomeniul `social.domeniul-tau.ro` ar trebui să fie live, securizat cu SSL și să afișeze pagina de link-uri sociale. Puteți actualiza site-ul folosind scriptul `deploy.sh` exact ca în ghidul principal.
