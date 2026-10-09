# ADR-001: GitHub Container Registry come registry primario

## Stato
Accettata — 2026-XX-XX

## Contesto
Il bootcamp produce immagini Docker per due applicazioni (BE e FE). Serve un registry per:
- Memorizzare le immagini buildate dalla CI
- Permettere il pull dal cluster di destinazione
- Tracciare la provenienza (immagine ↔ commit ↔ workflow run)

Le opzioni considerate:
1. Docker Hub (gratuito per repo pubblici, rate limit pull)
2. GHCR (integrato GitHub, gratuito generoso, eredita visibilità repo)
3. ECR/ACR/GAR (managed cloud, ma vincola al cloud provider)

## Decisione
Usiamo **GHCR** come registry primario.

## Conseguenze
**Pro**
- Autenticazione via `GITHUB_TOKEN`, niente secret management aggiuntivo
- Visibilità ereditata dal repo (private repo → private image)
- Rate limit pull non restrittivo per CI
- `docker/metadata-action` supporta GHCR nativamente

**Contro**
- Vincolo a GitHub come SCM (se domani migriamo a GitLab dobbiamo cambiare registry)
- Niente vulnerability scanning integrato come ECR/ACR (mitigazione: Trivy step in CI)

**Da rivedere**
- Se il bootcamp diventa multi-cloud, valutare un registry vendor-neutral (Harbor)