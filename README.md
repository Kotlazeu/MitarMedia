
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

### **Pasul 10 (Avansat): Configurarea unui Server de Mail cu Postfix și Dovecot**

Acest ghid vă arată cum să configurați un server de mail complet pe VPS-ul dumneavoastră folosind Postfix (pentru trimitere/primire) și Dovecot (pentru accesul clienților de mail). Vom folosi `mail.mitarmedia.com` ca exemplu.

#### **10.1. Configurare DNS pentru Mail**

Aceste înregistrări sunt **esențiale** pentru ca email-urile să ajungă la serverul dumneavoastră.

1.  **Înregistrare `A` pentru subdomeniu:**
    *   **Tip:** `A`
    *   **Gazdă/Nume:** `mail`
    *   **Valoare:** Adresa IP a VPS-ului (ex: `123.45.67.89`)

2.  **Înregistrare `MX` (Mail Exchange):**
    *   **Tip:** `MX`
    *   **Gazdă/Nume:** `@` (reprezintă domeniul principal `mitarmedia.com`)
    *   **Valoare (Server de mail):** `mail.mitarmedia.com`
    *   **Prioritate:** `10` (o valoare standard, mai mică înseamnă prioritate mai mare)

3.  **Înregistrare `SPF` (Sender Policy Framework) - Anti-Spam:**
    *   **Tip:** `TXT`
    *   **Gazdă/Nume:** `@`
    *   **Valoare:** `"v=spf1 mx -all"` (Permite doar serverului specificat în MX să trimită mail)

4.  **Înregistrare `DMARC` (Domain-based Message Authentication, Reporting & Conformance):**
    *   **Tip:** `TXT`
    *   **Gazdă/Nume:** `_dmarc`
    *   **Valoare:** `"v=DMARC1; p=none; rua=mailto:admin@mitarmedia.com"` (Mod de raportare; înlocuiți `admin@` cu un email valid)

#### **10.2. Instalarea Postfix și Dovecot**

1.  **Setați hostname-ul serverului:**
    ```bash
    sudo hostnamectl set-hostname mail.mitarmedia.com
    ```

2.  **Instalați pachetele necesare:**
    ```bash
    sudo apt update
    sudo apt install postfix dovecot-imapd dovecot-pop3d -y
    ```

3.  **Configurarea Postfix:**
    În timpul instalării, veți vedea o interfață de configurare:
    *   Alegeți **"Internet Site"**.
    *   La **"System mail name"**, introduceți domeniul principal: `mitarmedia.com`.

4.  **Editarea fișierului de configurare principal Postfix:**
    ```bash
    sudo nano /etc/postfix/main.cf
    ```
    Asigurați-vă că aceste linii arată astfel (adăugați sau modificați):
    ```
    myhostname = mail.mitarmedia.com
    mydestination = $myhostname, mitarmedia.com, localhost.com, localhost
    home_mailbox = Maildir/
    ```
    Salvați și închideți fișierul.

5.  **Reporniți Postfix:**
    ```bash
    sudo systemctl restart postfix
    ```

#### **10.3. Configurarea Dovecot**

1.  **Editarea fișierului de configurare pentru mail:**
    ```bash
    sudo nano /etc/dovecot/conf.d/10-mail.conf
    ```
    Găsiți linia `mail_location` și asigurați-vă că arată astfel (decomentați-o dacă este necesar):
    ```
    mail_location = maildir:~/Maildir
    ```

2.  **Editarea fișierului de autentificare:**
    ```bash
    sudo nano /etc/dovecot/conf.d/10-auth.conf
    ```
    Decomentați și modificați linia `disable_plaintext_auth`:
    ```
    disable_plaintext_auth = yes
    ```

3.  **Reporniți Dovecot:**
    ```bash
    sudo systemctl restart dovecot
    ```

#### **10.4. Securizarea cu SSL (Let's Encrypt)**

1.  **Instalați Certbot (dacă nu l-ați instalat deja):**
    ```bash
    sudo apt install certbot -y
    ```

2.  **Obțineți certificatul SSL pentru domeniul de mail:**
    ```bash
    # Folosim --standalone deoarece nu avem un server web pe acest subdomeniu
    sudo certbot certonly --standalone -d mail.mitarmedia.com
    ```
    Urmați instrucțiunile pentru a obține certificatul.

3.  **Configurați Postfix să folosească certificatul SSL:**
    ```bash
    sudo nano /etc/postfix/main.cf
    ```
    Adăugați aceste linii la finalul fișierului:
    ```
    # TLS parameters
    smtpd_tls_cert_file=/etc/letsencrypt/live/mail.mitarmedia.com/fullchain.pem
    smtpd_tls_key_file=/etc/letsencrypt/live/mail.mitarmedia.com/privkey.pem
    smtpd_use_tls=yes
    smtpd_tls_auth_only=yes
    ```

4.  **Configurați Dovecot să folosească certificatul SSL:**
    ```bash
    sudo nano /etc/dovecot/conf.d/10-ssl.conf
    ```
    Modificați liniile `ssl_cert` și `ssl_key`:
    ```
    ssl_cert = </etc/letsencrypt/live/mail.mitarmedia.com/fullchain.pem
    ssl_key = </etc/letsencrypt/live/mail.mitarmedia.com/privkey.pem
    ```

5.  **Reporniți serviciile:**
    ```bash
    sudo systemctl restart postfix
    sudo systemctl restart dovecot
    ```

#### **10.5. Crearea Căsuțelor de Email**

Fiecare căsuță de email este un utilizator de sistem standard.

1.  **Creați un utilizator nou (ex: `contact@mitarmedia.com`):**
    ```bash
    # 'contact' este numele utilizatorului
    sudo adduser contact
    ```
    Urmați pașii pentru a seta o parolă și celelalte informații.

2.  **Creați directorul pentru mail-uri:**
    ```bash
    mkdir -p /home/contact/Maildir
    sudo chown -R contact:contact /home/contact/Maildir
    sudo chmod -R 700 /home/contact/Maildir
    ```

#### **10.6. Testarea Serverului de Mail**

Puteți folosi un client de mail precum Thunderbird, Outlook sau clientul nativ de pe telefon.

*   **Configurare IMAP (primire):**
    *   **Server:** `mail.mitarmedia.com`
    *   **Port:** `993`
    *   **Securitate:** `SSL/TLS`
    *   **Utilizator:** `contact` (sau numele utilizatorului creat)
    *   **Parolă:** Parola setată la crearea utilizatorului
*   **Configurare SMTP (trimitere):**
    *   **Server:** `mail.mitarmedia.com`
    *   **Port:** `587`
    *   **Securitate:** `STARTTLS`
    *   **Utilizator:** `contact`
    *   **Parolă:** Parola setată

---

### **Gata!**

Felicitări! Ați publicat cu succes aplicația Next.js și ați configurat un server de mail funcțional. Site-ul este acum live, securizat cu HTTPS și rulează constant datorită PM2 și Nginx.
