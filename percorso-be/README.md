# Percorso BE — API Node.js

API REST minimale in Express. Al Giorno 0 risponde con dati fissi, senza database.

| Endpoint | Risposta |
|---|---|
| `GET /healthz` | `{"status":"ok","timestamp":"..."}` |
| `GET /accounts` | Due conti di esempio, con IBAN e saldo |

## Avvio

```bash
npm ci
npm start
```

L'API ascolta sulla porta `3000`; per cambiarla imposti la variabile `PORT` (`PORT=3001 npm start`). `npm run dev` la riavvia da sola a ogni modifica di `src/`.

## Smoke test

```bash
curl http://localhost:3000/healthz
curl http://localhost:3000/accounts
```

## Le dipendenze

Il `package.json` dichiara già `pg` e `ioredis`, che al Giorno 0 il codice non usa: servono dal Giorno 1, quando l'API si collega a Postgres e Redis. Sono già risolte nel `package-lock.json`, quindi `npm ci` installa sempre le stesse versioni, sul tuo PC come dentro un container.

Non cancellare né rigenerare il `package-lock.json`: `npm ci` lavora solo se lockfile e `package.json` sono allineati, e da quell'allineamento dipende la riproducibilità di tutte le build del bootcamp.
