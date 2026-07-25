# Sécurité — Beatshelf

Audit de sécurité et correctifs (revue de juillet 2026).

## ✅ Correctifs appliqués dans le code

| # | Fichier | Problème | Correctif |
|---|---------|----------|-----------|
| 1 | `app/api/upload/route.ts` | Upload **non authentifié** + aucune validation de fichier | Vérification du token Supabase (401 sinon) ; contrôle du type MIME et de la taille ; clés de stockage générées côté serveur (le nom de fichier client n'est plus utilisé) |
| 2 | `app/api/deezer/route.ts` | **SSRF** : le paramètre `path` était concaténé sans contrôle | Résolution via `new URL()`, vérification de l'origine `api.deezer.com`, et allowlist d'endpoints |
| 3 | `lib/supabaseData.ts` | **IDOR** : suppression / mise à jour d'une playlist par `id` seul | Ajout du filtre `user_id` (défense en profondeur) |
| 4 | `components/intro/IntroAnimation.tsx` | **Accessibilité** : animations infinies non désactivables | Respect de `prefers-reduced-motion` (intro sautée) |

## ⚠️ Action manuelle OBLIGATOIRE — Row Level Security

Les filtres `.eq("user_id", ...)` côté client **ne sont pas une sécurité** : ce ne sont que des filtres. La vraie protection, c'est la **RLS** dans Supabase.

1. Ouvre **Supabase → SQL Editor**.
2. Exécute le fichier [`supabase/policies.sql`](./supabase/policies.sql).
3. Vérifie que le cadenas **RLS activé** est vert sur `likes`, `playlists`, `history`, `tracks` **et** sur le bucket storage `tracks`.

Sans ça, un utilisateur connecté peut accéder aux données des autres.

## 🔜 Pistes d'amélioration

- Protection des routes **côté serveur** (middleware `@supabase/ssr`) plutôt qu'une simple redirection JS dans `useAuth`.
- Colonne `uploaded_by` sur `tracks` pour tracer l'auteur de chaque upload.
- Vérification du **contenu réel** des fichiers uploadés (magic bytes) en plus du type MIME déclaré.
- Rate-limiting sur `/api/upload` et `/api/deezer`.
