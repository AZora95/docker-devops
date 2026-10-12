# Kubernetes: flusso del traffico (percorso FE)

Manifest in [`k8s/`](../k8s/): `deployment.yaml`, `service.yaml`, `configmap.yaml`.
Immagine: `ghcr.io/azora95/docker-devops-fe:edc5fd4`, pushata dal workflow Docker per il commit `edc5fd4`.

## Il percorso di una richiesta

```text
utente ─► Service lipari-fe (ClusterIP :80) ─► uno dei 3 Pod (app=lipari-fe)
                                                └─► container nginx :80
                                                      ├─ /      → file statici React (dist/)
                                                      └─ /api/  → proxy_pass → Node.js (BE :3000)
```

1. **Utente → Service.** Un Service ClusterIP ha un IP virtuale raggiungibile solo dentro il cluster. Per provarlo da fuori serve `kubectl port-forward svc/lipari-fe 8080:80`; in produzione ci vorrebbe un Ingress.
2. **Service → Pod.** Il Service cerca i Pod con label `app=lipari-fe` e tiene la lista dei loro IP (EndpointSlice). Le regole di kube-proxy mandano ogni connessione a uno dei Pod. Nella lista entrano solo i Pod la cui readinessProbe passa.
3. **Pod → container.** Il Service inoltra da `port: 80` a `targetPort: 80`, cioè alla `containerPort` di nginx. L'esercizio indica `targetPort: 3000`, ma quella è la porta di Node.js nel percorso BE: qui nel container gira nginx sulla 80.
4. **Container → Node.js.** nginx serve direttamente i file statici della build Vite: Node.js nel FE serve solo in fase di build (primo stage del Dockerfile). Le chiamate a `/api/` vengono girate da `proxy_pass` al backend, dove risponde Node.js/Express sulla 3000.

Probe: la readiness parte dopo 5 s e decide se il Pod riceve traffico; la liveness parte dopo 30 s e, dopo 3 fallimenti di fila, kubelet riavvia il container.

## Problemi se andasse in produzione così

1. **nginx non parte.** `nginx.conf` contiene `proxy_pass http://mock-api:80/`. Nel cluster non esiste un Service `mock-api`, quindi nginx all'avvio non risolve il nome (`host not found in upstream`) e il Pod va in CrashLoopBackOff.
2. **Nessun Ingress.** Il Service ClusterIP non è raggiungibile da fuori; mancano anche dominio e TLS.
3. **Nessun Secret.** `redis-url` sta in chiaro in un ConfigMap: se contiene una password deve andare in un Secret.
4. **Nessun PodDisruptionBudget né anti-affinity.** Le 3 repliche possono finire sullo stesso nodo, e un `kubectl drain` può spegnerle tutte insieme.
5. **Nessun imagePullSecrets.** Oggi il pacchetto GHCR è pubblico; se diventa privato i nodi non riescono a scaricarlo (ImagePullBackOff).
6. **Nessun securityContext né namespace.** Il container gira come root, senza `runAsNonRoot` né `readOnlyRootFilesystem`, e tutto finisce nel namespace `default`.
