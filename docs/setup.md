# Setup dell'ambiente — verifiche e problemi frequenti

La guida completa è la pagina del Giorno 0 su Moodle. Qui trovi le verifiche da rilanciare quando cambi PC o qualcosa smette di funzionare, e i problemi che ricorrono più spesso.

## Verifiche

Su Windows lanciale tutte dentro la shell WSL Ubuntu, non in PowerShell.

| Comando | Atteso |
|---|---|
| `docker --version` | 24 o superiore |
| `docker info` | Nessun errore: il daemon risponde |
| `docker run hello-world` | Il messaggio di benvenuto (su Linux senza `sudo`) |
| `wsl -l -v` (da PowerShell, solo Windows) | Una distro con `VERSION 2` |
| `git --version` | 2.30 o superiore |
| `git config --global user.name` e `user.email` | Il tuo nome e la tua email |
| `node --version` | `v20.11.0` o superiore |
| `which node` e `which npm` (WSL, Linux, macOS) | Un percorso sotto `~/.nvm/` per tutti e due |
| `npm --version` | 10 o superiore |
| Login su GHCR, con i due comandi qui sotto | `Login Succeeded` |

```bash
read -s PAT   # incolla il token e premi Invio: non si vede e non finisce nello storico
echo "$PAT" | docker login ghcr.io -u <utente> --password-stdin
```

## Node.js

Le app campione richiedono Node.js in versione LTS, almeno la 20.11. Il pacchetto `nodejs` di Ubuntu è più vecchio (la 12 sulla 22.04, la 18 sulla 24.04): con la 12 Vite non parte, con la 18 npm avvisa che la versione non è supportata. Installa l'ultima LTS con [nvm](https://github.com/nvm-sh/nvm), su WSL, Linux e macOS:

```bash
nvm install --lts
node --version
which node
which npm
```

Su macOS, se l'installer di nvm risponde `Profile not found`, crea il file con `touch ~/.zshrc` e rilancialo.

Su Windows Node va installato dentro WSL, non con l'installer per Windows: le app le lanci dalla shell Ubuntu. Se in WSL `which node` non risponde nulla e `which npm` risponde un percorso che comincia con `/mnt/c/`, la shell sta usando l'npm di Windows: `npm --version` funziona, ma Node dentro WSL non c'è. Chiudi e riapri il terminale dopo l'installazione di nvm e ricontrolla.

## Problemi frequenti

**`permission denied while trying to connect to the Docker daemon socket`** (Linux). L'utente non è nel gruppo `docker`: `sudo usermod -aG docker $USER`, poi esci dalla sessione e rientra.

**`docker login ghcr.io` risponde `denied` o `unauthorized`.** Quasi sempre il token non ha gli scope `write:packages` e `read:packages`, oppure è scaduto. Rigeneralo su GitHub, Settings → Developer settings → Personal access tokens.

**`git push` risponde `refusing to allow a Personal Access Token to create or update workflow`.** Stai pubblicando un file in `.github/workflows/` con un token senza lo scope `workflow`. Rigenera il token aggiungendo `workflow` e rilancia il push.

**`npm ci` risponde `can only install packages when your package.json and package-lock.json ... are in sync`.** Hai modificato il `package.json` o rigenerato il lockfile. Riporta entrambi allo stato del repository con `git checkout -- package.json package-lock.json` e rilancia.

**`npm ci` è lentissimo o il container non vede le modifiche ai file** (Windows). Il progetto sta sotto `C:\Users\...`. Spostalo nel filesystem WSL (`/home/<utente>/...`) e apri VS Code da lì con `code .`.

**`Error: listen EADDRINUSE: address already in use :::3000`.** Un'altra istanza dell'API è ancora accesa. Chiudila, oppure avvia su un'altra porta con `PORT=3001 npm start`.
