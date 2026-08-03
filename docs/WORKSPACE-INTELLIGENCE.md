# Workspace Intelligence Phase — Tickets

Branch: `feature/workspace-intelligence` → **PR to `develop`** (never direct merge).
Six unconsumed backend surfaces from the API gap matrix, in priority order.

## Ticket 01 — Server-side thread search

- [x] Service methods: `searchThreads(q)`, `searchByRepo(repo)`, `searchByStatus(status)` on `threadService`
- [x] Query hooks + keys for search variants
- [x] Threads list: debounced keyword search, repo filter, status filter chips wired to server endpoints
- [x] Tests for search service methods

## Ticket 02 — File comments (inline)

- [ ] Service: `listComments(threadId)`, `listCommentsByFile(threadId, file)`, `createComment`, `updateComment`, `deleteComment`
- [ ] Hooks + keys
- [ ] Comment chips on FileChangesPanel rows → expandable inline comment thread
- [ ] Tests

## Ticket 03 — Thread events timeline

- [ ] Service: `listEvents(threadId)`, `listEventsPaged`
- [ ] Activity timeline section on thread detail
- [ ] Tests

## Ticket 04 — Snapshots

- [ ] Service: `listSnapshots`, `createSnapshot`, `getSnapshot`, `getLatestSnapshot`
- [ ] Version history list + capture button on thread detail
- [ ] Tests

## Ticket 05 — Indexing explorer

- [ ] Service: `listIndexes`, `startIndexing`, `getIndex`, `searchFiles`, `getFilesByLanguage`, `getGraph`, `getFiles`
- [ ] New `/indexing` route: index list, start-index dialog (repo/branch/fileContents), per-index files + language + graph
- [ ] Tests

## Ticket 06 — API keys (Settings)

- [ ] Service: `listApiKeys`, `createApiKey`, `revokeApiKey`
- [ ] Settings → API Keys section: create dialog with show-once key + copy, revoke with confirm
- [ ] Tests

## Phase exit criteria

- [ ] All six surfaces implemented + tested (build, lint, tests green)
- [ ] PR raised to `develop`, reviewed, merged
- [ ] Latest `develop` pulled; `feature/workspace-intelligence` deleted locally + remotely
