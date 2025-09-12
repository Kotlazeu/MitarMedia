
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
            *   **Gazdă/Nume (Host/Name):** `@` (acesta reprezintă domeniul principal, ex: `mitarmedia.com`)
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

    **Asigurați-vă că înlocuiți `mitarmedia.com` cu domeniul dumneavoastră real!**

    ```nginx
    server {
        listen 80;
        listen [::]:80;

        server_name mitarmedia.com www.mitarmedia.com;

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

Acum, site-ul ar trebui să fie accesibil la adresa `http://mitarmedia.com` și să afișeze aplicația Next.js. Pagina implicită Nginx nu ar trebui să mai apară.

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
    sudo certbot --nginx -d mitarmedia.com -d www.mitarmedia.com
    ```
    Urmați instrucțiunile de pe ecran. Certbot va modifica automat fișierul de configurare Nginx pentru a activa HTTPS și va configura reînnoirea automată a certificatului.

---

### **Pasul 8 (Depanare): Ce fac dacă văd o eroare sau ceva nu funcționează?**

Când ceva nu merge bine, jurnalele (log-urile) sunt cel mai bun prieten al dumneavoastră.

1.  **Verificați Jurnalul Aplicației (PM2):** Acesta este cel mai important loc de verificat pentru erori legate de codul aplicației Next.js.
    ```bash
    # Înlocuiți "numele-proiectului" cu numele pe care l-ați dat în PM2
    pm2 logs numele-proiectului
    ```
    Această comandă arată erorile în timp real.

2.  **Verificați Jurnalul Postfix (serverul de trimitere):**
    ```bash
    journalctl -u postfix
    ```
    Uitați-vă după linii care conțin "error", "warning" sau "fatal".

3.  **Verificați Jurnalul Dovecot (serverul de primire/autentificare):**
    ```bash
    journalctl -u dovecot
    ```
    Aceasta este comanda cheie pentru a depana erorile de autentificare "imposibil de verificat numele sau parola".

Erorile comune sunt:
*   **502 Bad Gateway:** Nginx nu poate comunica cu aplicația. Verificați cu `pm2 list` dacă aplicația rulează.
*   **Erori de autentificare email:** De obicei, o greșeală în fișierele de configurare Dovecot sau Postfix. Verificați jurnalele lor.
*   **Erori de certificat SSL:** Asigurați-vă că ați rulat corect Certbot și că ați obținut certificate pentru *toate* domeniile necesare (`mitarmedia.com`, `www.mitarmedia.com`, `mail.mitarmedia.com`).

---

### **Pasul 9: Automatizarea Actualizărilor cu un Script de Deploy**

Pentru a simplifica procesul de actualizare a site-ului după ce faceți modificări și le încărcați pe GitHub, puteți folosi scriptul `deploy.sh`. Aceasta este metoda recomandată pentru **toate actualizările viitoare**.

1.  **Creați fișierul de deploy:**
    Navigați în directorul proiectului (`cd ~/numele-proiectului`) și creați fișierul:
    ```bash
    nano deploy.sh
    ```

2.  **Copiați conținutul în fișier:**
    Adăugați următorul conținut în fișier. **Nu uitați să modificați `PM2_PROCESS_NAME`!**
    ```sh
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
    ```
    Salvați și închideți (`Ctrl+X`, `Y`, `Enter`).

3.  **Faceți scriptul executabil (doar o singură dată):**
    ```bash
    chmod +x deploy.sh
    ```

4.  **Rulați scriptul de deploy:**
    De fiecare dată când doriți să actualizați site-ul, rulați o singură comandă din directorul proiectului:
    ```bash
    ./deploy.sh
    ```

---

### **Pasul 10 (Avansat): Configurarea unui Server de Mail cu Postfix și Dovecot**

Acest ghid vă arată cum să configurați un server de mail complet pe VPS-ul dumneavoastră folosind Postfix (pentru trimitere/primire) și Dovecot (pentru accesul clienților de mail). Vom folosi `mail.mitarmedia.com` ca exemplu.

#### **Pasul 10.0: Resetarea Configurației de Mail (Opțional)**

Dacă ați avut o tentativă anterioară de instalare și doriți să o luați de la zero, rulați aceste comenzi pentru a șterge complet Postfix și Dovecot, inclusiv fișierele de configurare.

```bash
# Oprirea serviciilor de mail
sudo systemctl stop postfix
sudo systemctl stop dovecot

# Dezinstalarea completă a pachetelor și a fișierelor de configurare
sudo apt-get purge -y postfix dovecot-*

# Curățarea pachetelor care nu mai sunt necesare
sudo apt-get autoremove -y

echo "Pachetele Postfix și Dovecot au fost eliminate complet."
```
După rularea acestor comenzi, puteți urma pașii de mai jos pentru o instalare curată.

#### **10.1. Configurare DNS pentru Mail**

Aceste înregistrări sunt **esențiale** pentru ca email-urile să ajungă la serverul dumneavoastră și pentru ca serverul să fie considerat de încredere. Introduceți valorile **fără ghilimele** în panoul de administrare DNS.

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
    *   **Valoare:** `v=spf1 mx -all`

4.  **Înregistrare `DMARC` (Domain-based Message Authentication, Reporting & Conformance):**
    *   **Tip:** `TXT`
    *   **Gazdă/Nume:** `_dmarc`
    *   **Valoare:** `v=DMARC1; p=none; rua=mailto:admin@mitarmedia.com` (înlocuiți `admin@` cu un email valid)

5.  **(Recomandat) Înregistrare `PTR` (Reverse DNS):**
    *   Această înregistrare se configurează de obicei în panoul de control al furnizorului de VPS (nu la registrarul de domenii).
    *   Asociați adresa IP a VPS-ului cu hostname-ul `mail.mitarmedia.com`. Acest pas este crucial pentru a evita ca email-urile să fie marcate ca spam.

#### **10.2. Instalarea Postfix și Dovecot**

1.  **Setați hostname-ul serverului:**
    ```bash
    sudo hostnamectl set-hostname mail.mitarmedia.com
    ```

2.  **Instalați pachetele necesare:**
    ```bash
    sudo apt update
    sudo apt install postfix dovecot-core dovecot-imapd dovecot-pop3d -y
    ```

3.  **Configurarea Postfix la instalare:**
    În timpul instalării, veți vedea o interfață de configurare:
    *   Alegeți **"Internet Site"**.
    *   La **"System mail name"**, introduceți domeniul principal: `mitarmedia.com`.

4.  **Editarea fișierului de configurare principal Postfix (`main.cf`):**
    Deschideți fișierul cu `sudo nano /etc/postfix/main.cf` și **înlocuiți complet** conținutul său cu următorul bloc de cod. Acest lucru asigură eliminarea setărilor conflictuale și aplicarea unei configurații curate și funcționale.

    ```ini
    # --- Setări Generale ---
    smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
    biff = no
    append_dot_mydomain = no
    readme_directory = no
    compatibility_level = 3.6

    # --- Hostname și Domeniu ---
    myhostname = mail.mitarmedia.com
    myorigin = /etc/mailname
    mydestination = $myhostname, localhost.$mydomain, localhost, mitarmedia.com
    mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128

    # --- Configurare Mailbox (pentru utilizatori de sistem) ---
    home_mailbox = Maildir/

    # --- Setări TLS (Securitate Conexiune) ---
    smtpd_tls_cert_file=/etc/letsencrypt/live/mail.mitarmedia.com/fullchain.pem
    smtpd_tls_key_file=/etc/letsencrypt/live/mail.mitarmedia.com/privkey.pem
    smtpd_use_tls=yes
    smtpd_tls_auth_only=yes
    smtp_tls_security_level = may
    smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache

    # --- Setări SASL (Autentificare SMTP) ---
    smtpd_sasl_type = dovecot
    smtpd_sasl_path = private/auth
    smtpd_sasl_auth_enable = yes
    smtpd_sasl_security_options = noanonymous
    smtpd_sasl_local_domain = $myhostname
    smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination
    ```

5.  **Editarea fișierului de servicii Postfix (`master.cf`):**
    Acest pas este **CRUCIAL** pentru a activa porturile securizate pe care le folosesc clienții de email precum Gmail/Outlook. Deschideți fișierul cu `sudo nano /etc/postfix/master.cf` și **înlocuiți complet** conținutul său cu următorul bloc.

    ```ini
    # ==========================================================================
    # service type  private unpriv  chroot  wakeup  maxproc command + args
    #               (yes)   (yes)   (yes)   (never) (100)
    # ==========================================================================
    smtp      inet  n       -       y       -       -       smtpd
    pickup    unix  n       -       y       60      1       pickup
    cleanup   unix  n       -       y       -       0       cleanup
    qmgr      unix  n       -       n       300     1       qmgr
    tlsmgr    unix  -       -       y       1000?   1       tlsmgr
    rewrite   unix  -       -       y       -       -       trivial-rewrite
    bounce    unix  -       -       y       -       0       bounce
    defer     unix  -       -       y       -       0       bounce
    trace     unix  -       -       y       -       0       bounce
    verify    unix  -       -       y       -       1       verify
    flush     unix  n       -       y       1000?   0       flush
    proxymap  unix  -       -       n       -       -       proxymap
    proxywrite unix -       -       n       -       1       proxymap
    smtp      unix  -       -       y       -       -       smtp
    relay     unix  -       -       y       -       -       smtp
    showq     unix  n       -       y       -       -       showq
    error     unix  -       -       y       -       -       error
    retry     unix  -       -       y       -       -       error
    discard   unix  -       -       y       -       -       discard
    local     unix  -       n       n       -       -       local
    virtual   unix  -       n       n       -       -       virtual
    lmtp      unix  -       -       y       -       -       lmtp
    anvil     unix  -       -       y       -       1       anvil
    scache    unix  -       -       y       -       1       scache
    # ====================================================================
    # Servicii pentru clienți de email (Submission și SMTPS)
    # ====================================================================
    submission inet n       -       y       -       -       smtpd
      -o syslog_name=postfix/submission
      -o smtpd_tls_security_level=encrypt
      -o smtpd_sasl_auth_enable=yes
      -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
    smtps     inet  n       -       y       -       -       smtpd
      -o syslog_name=postfix/smtps
      -o smtpd_tls_wrappermode=yes
      -o smtpd_sasl_auth_enable=yes
      -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
    ```
    Salvați și închideți.

#### **10.3. Configurarea Dovecot**

Dovecot va gestiona autentificarea și livrarea către căsuțele de email.

1.  **Editarea fișierului de configurare pentru mail (`10-mail.conf`):**
    ```bash
    sudo nano /etc/dovecot/conf.d/10-mail.conf
    ```
    Asigurați-vă că fișierul arată astfel, decomentând linia `mail_location`:
    ```ini
    mail_location = maildir:~/Maildir
    ```

2.  **Editarea fișierului de autentificare (`10-auth.conf`):**
    ```bash
    sudo nano /etc/dovecot/conf.d/10-auth.conf
    ```
    **Înlocuiți complet** conținutul fișierului cu următoarele trei linii. Aceasta este o versiune simplificată și corectă.
    ```ini
    disable_plaintext_auth = no
    auth_mechanisms = plain login
    !include auth-system.conf.ext
    ```
    *Notă de depanare: Setarea `disable_plaintext_auth = no` este sigură deoarece conexiunea este deja criptată prin TLS. Unii clienți de email (inclusiv Apple Mail) pot avea probleme dacă această opțiune este setată pe `yes`.*


3.  **Editarea fișierului master (`10-master.conf`) pentru a expune autentificarea pentru Postfix:**
    ```bash
    sudo nano /etc/dovecot/conf.d/10-master.conf
    ```
    Găsiți secțiunea `service auth` și modificați-o astfel încât să conțină socket-ul pentru Postfix, inclusiv permisiunile corecte.
    ```ini
    service auth {
      unix_listener /var/spool/postfix/private/auth {
        mode = 0666
        user = postfix
        group = postfix
      }
    }
    ```

4.  **Editarea fișierului SSL (`10-ssl.conf`) - Pas important!:**
    ```bash
    sudo nano /etc/dovecot/conf.d/10-ssl.conf
    ```
    Asigurați-vă că fișierul arată astfel, forțând utilizarea SSL și specificând căile corecte către certificate.
    ```ini
    ssl = required
    ssl_cert = /etc/letsencrypt/live/mail.mitarmedia.com/fullchain.pem
    ssl_key = /etc/letsencrypt/live/mail.mitarmedia.com/privkey.pem
    ssl_min_protocol = TLSv1.2
    ```

#### **10.4. Securizarea cu SSL (Let's Encrypt) și Firewall**

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

3.  **Configurați Postfix și Dovecot să folosească certificatul SSL:**
    Acești pași sunt deja acoperiți în secțiunile anterioare (`10.2` și `10.3`), dar verificați pentru a vă asigura că sunt corecți.

4.  **Deschiderea Porturilor în Firewall (Pas CRUCIAL!):**
    Dacă folosiți `ufw` (firewall-ul implicit din Ubuntu), trebuie să permiteți traficul pentru toate serviciile necesare **înainte** de a activa firewall-ul.
    
    ```bash
    # Pas IMPORTANT: Permiteți mai întâi conexiunile SSH pentru a nu vă bloca accesul!
    sudo ufw allow ssh

    # Permiteți traficul pentru Nginx (HTTP & HTTPS)
    sudo ufw allow 'Nginx Full'

    # Permiteți traficul pentru serviciile de mail (SMTP securizat și IMAP/POP3)
    sudo ufw allow 587    # Portul SMTP Submission (recomandat pentru clienți)
    sudo ufw allow 465    # Portul SMTPS (legacy, dar util pentru compatibilitate)
    sudo ufw allow 993    # Portul IMAPS (IMAP peste SSL)
    sudo ufw allow 995    # Portul POP3S (POP3 peste SSL)
    
    # Activați firewall-ul (rulați doar după ce ați permis SSH)
    sudo ufw enable 
    
    # Verificați starea
    sudo ufw status 
    ```
    **Notă de depanare urgentă:** Dacă după rularea `sudo ufw enable` nu vă mai puteți conecta la VPS, înseamnă că nu ați permis conexiunile SSH. Va trebui să folosiți consola web a furnizorului de VPS pentru a rula `sudo ufw allow ssh`.

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
    Urmați pașii pentru a seta o parolă și celelalte informații. Această parolă va fi parola pentru email.

2.  **Creați directorul pentru mail-uri (opțional, ar trebui creat automat):**
    Dacă nu se creează automat la primirea primului email, rulați:
    ```bash
    mkdir -p /home/contact/Maildir
    sudo chown -R contact:contact /home/contact/Maildir
    sudo chmod -R 700 /home/contact/Maildir
    ```

#### **10.6. Testarea Serverului de Mail**

Acum, la configurarea în Apple Mail, Gmail (sau alt client), folosiți următoarele setări. **Debifați orice opțiune de "setare automată" pentru a putea introduce manual porturile și metodele de securitate.**

*   **Configurare IMAP (primire):**
    *   **Server:** `mail.mitarmedia.com`
    *   **Port:** `993`
    *   **Securitate:** `SSL/TLS`
    *   **Autentificare:** `Parolă`
    *   **Nume utilizator:** `contact` (sau numele utilizatorului creat)
    *   **Parolă:** Parola setată la crearea utilizatorului
*   **Configurare SMTP (trimitere):**
    *   **Server:** `mail.mitarmedia.com`
    *   **Port:** `587`
    *   **Securitate:** `STARTTLS`
    *   **Autentificare:** `Parolă`
    *   **Nume utilizator:** `contact`
    *   **Parolă:** Parola setată

---

### **Gata!**

Felicitări! Ați publicat cu succes aplicația Next.js și ați configurat un server de mail funcțional și securizat. Site-ul este acum live, securizat cu HTTPS și rulează constant datorită PM2 și Nginx.
