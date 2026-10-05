# Percorso FE — Vite + React

Pagina React che mostra la lista dei conti letta da `/api/accounts`.

## Avvio

```bash
npm ci
npm run dev
```

Apri `http://localhost:5173` nel browser.

## Cosa vedi al Giorno 0

La pagina mostra il titolo «Lipari Accounts» e un messaggio di errore al posto della lista, mentre il terminale di Vite scrive `http proxy error: /accounts` con `ECONNREFUSED`. È il comportamento atteso: `vite.config.js` inoltra le chiamate `/api` a `http://localhost:8081`, dove al Giorno 0 non risponde nessuno. Dal Giorno 1 la pagina la serve Nginx dentro uno stack Compose, insieme a un backend simulato che risponde a `/api/accounts`.

## Build statica

```bash
npm run build
```

Produce la cartella `dist/` con `index.html` e gli asset: è quello che al Giorno 1 finisce dentro l'immagine.

## Il lockfile

Non cancellare né rigenerare il `package-lock.json`: `npm ci` lavora solo se lockfile e `package.json` sono allineati, e da quell'allineamento dipende la riproducibilità di tutte le build del bootcamp.
