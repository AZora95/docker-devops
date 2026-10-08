# Bootcamp Docker & DevOps — progetto di partenza

Questo è il repository su cui lavori per tutto il bootcamp. Contiene due applicazioni campione, una per percorso: ne scegli una e lavori solo su quella.

| Cartella | Percorso | Cosa contiene |
|---|---|---|
| `percorso-be/` | Backend | API REST Node.js + Express con due endpoint, `/healthz` e `/accounts` |
| `percorso-fe/` | Frontend | Pagina Vite + React che legge la lista dei conti da `/api/accounts` |
| `docs/setup.md` | Comune | Verifiche dell'ambiente e problemi frequenti del Giorno 0 |
| `docker-compose.yml` | Frontend | Stack del Giorno 1: Nginx con la build di Vite, API simulata e Redis |

Al Giorno 0 l'app del tuo percorso gira a mano, senza Docker. Dal Giorno 1 la metti in container e la affianchi ai servizi che le servono; al Giorno 2 costruisci la pipeline che la verifica e ne pubblica l'immagine su GHCR.

## Mettilo sul tuo GitHub

Il progetto deve vivere su un repository tuo: al Giorno 2 è lì che girano i workflow GitHub Actions ed è lì che viene pubblicata l'immagine.

```bash
cd bootcamp-docker-devops
git init -b main
git add .
git commit -m "G0: setup ambiente locale"

# Su github.com: New repository, nome bootcamp-docker-devops, vuoto
# (niente README, .gitignore o licenza: li hai già qui)
git remote add origin https://github.com/<tuo-utente>/bootcamp-docker-devops.git
git push -u origin main
```

Quando git chiede la password, incolla il tuo Personal Access Token: la password dell'account GitHub non viene accettata.

## Smoke test del Giorno 0

Percorso BE:

```bash
cd percorso-be
npm ci
npm start
# in un altro terminale:
curl http://localhost:3000/healthz
# atteso: {"status":"ok","timestamp":"..."}
```

Percorso FE:

```bash
cd percorso-fe
npm ci
npm run dev
# apri http://localhost:5173 nel browser
```

I dettagli di ciascun percorso sono nel `README.md` della sua cartella.

## Giorno 1 — percorso FE in container

Dal Giorno 1 il frontend gira in uno stack Docker Compose, definito in `docker-compose.yml`. I tre servizi stanno sulla rete `app-net`:

| Servizio | Immagine | Ruolo |
|---|---|---|
| `frontend` | `lipari-fe:dev`, costruita da `percorso-fe/Dockerfile` | Nginx serve la build di Vite su `localhost:8080` e inoltra `/api/*` a `mock-api` |
| `mock-api` | `clue/json-server` | API simulata in `--watch`, che legge `percorso-fe/src/mocks/db.json` montato in sola lettura |
| `cache` | `redis:7.2-alpine` | Redis, richiesto dall'esercizio: il frontend non lo usa |

I file del Giorno 1:

| File | Contenuto |
|---|---|
| `percorso-fe/Dockerfile` | Multi-stage: build con `node:20.11.1-alpine3.19`, runtime `nginx:1.27-alpine` con `HEALTHCHECK` |
| `percorso-fe/.dockerignore` | Esclude `node_modules`, `dist`, `.git`, `.env` e i file che non servono alla build |
| `percorso-fe/nginx.conf` | Routing SPA con `try_files`, proxy di `/api/` verso `mock-api`, `Cache-Control: public, immutable` sugli asset |
| `docker-compose.yml` | Lo stack descritto sopra |
| `percorso-fe/src/Esercizio3/` | Esercizio 3: il Dockerfile sub-ottimale riscritto, con il suo `.dockerignore` |

### Avvio

```bash
docker compose up -d --build
docker compose ps
# atteso: STATUS "Up" per tutti e tre, con "(healthy)" su frontend
```

`--build` serve la prima volta e dopo ogni modifica al codice o al `Dockerfile`; negli altri casi basta `docker compose up -d`. Per seguire i log: `docker compose logs -f frontend mock-api`.

### Smoke test

```bash
# Conti dal mock-api, attraverso il proxy di Nginx
curl http://localhost:8080/api/accounts
# atteso: array JSON di conti

# Routing SPA: una rotta qualsiasi risponde con index.html
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/una/rotta/qualsiasi
# atteso: 200

# Header di cache sugli asset di Vite
ASSET=$(curl -s http://localhost:8080/ | grep -oE '/assets/[^"]+\.js' | head -1)
curl -sI "http://localhost:8080$ASSET" | grep -i cache-control
# atteso: Cache-Control: max-age=31536000 e Cache-Control: public, immutable

# Dimensione dell'immagine
docker images lipari-fe:dev
# atteso: meno di 50 MB
```

Nel browser apri `http://localhost:8080`: compare la lista dei conti. In DevTools → Network la chiamata è `http://localhost:8080/api/accounts`, sulla stessa origine della pagina: passa da Nginx e non genera errori CORS.

Per provare il `--watch`, modifica `percorso-fe/src/mocks/db.json` e ricarica la pagina. Se i dati non cambiano, lancia `docker compose restart mock-api`: il compose monta il singolo file, e quando un editor o `git checkout` lo sostituiscono con un file nuovo il container continua a leggere quello vecchio.

### Tear down

```bash
docker compose down
```

Ferma e rimuove i container e la rete `app-net`. Lo stack FE non ha volumi, quindi non si perdono dati. L'immagine `lipari-fe:dev` resta in locale e `docker compose up -d` la riusa senza ricostruirla.

## Due regole che valgono per tutto il bootcamp

Ogni giornata si chiude con un commit `GN: <argomento>` (`G0: setup ambiente locale`, `G1: ...`, `G2: ...`): la cronologia git fa parte di quello che consegni.

Le tue note di setup vanno in `setup-notes.md`, nella radice del progetto. Il `.gitignore` lo esclude, quindi resta sul tuo PC e non finisce su GitHub.
