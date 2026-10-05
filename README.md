# Bootcamp Docker & DevOps — progetto di partenza

Questo è il repository su cui lavori per tutto il bootcamp. Contiene due applicazioni campione, una per percorso: ne scegli una e lavori solo su quella.

| Cartella | Percorso | Cosa contiene |
|---|---|---|
| `percorso-be/` | Backend | API REST Node.js + Express con due endpoint, `/healthz` e `/accounts` |
| `percorso-fe/` | Frontend | Pagina Vite + React che legge la lista dei conti da `/api/accounts` |
| `docs/setup.md` | Comune | Verifiche dell'ambiente e problemi frequenti del Giorno 0 |

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

## Due regole che valgono per tutto il bootcamp

Ogni giornata si chiude con un commit `GN: <argomento>` (`G0: setup ambiente locale`, `G1: ...`, `G2: ...`): la cronologia git fa parte di quello che consegni.

Le tue note di setup vanno in `setup-notes.md`, nella radice del progetto. Il `.gitignore` lo esclude, quindi resta sul tuo PC e non finisce su GitHub.
