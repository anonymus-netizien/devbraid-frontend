# Workspace Intelligence Phase — Tickets

Branch: `feature/workspace-intelligence` → **PR to `develop`** (never direct merge).
Six unconsumed backend surfaces from the API gap matrix, in priority order.

## Ticket 01 — Server-side thread search

- [x] Service methods: `searchThreads(q)`, `searchByRepo(repo)`, `searchByStatus(status)` on `threadService`
- [x] Query hooks + keys for search variants
- [x] Threads list: debounced keyword search, repo filter, status filter chips wired to server endpoints
- [x] Tests for search service methods

## Ticket 02 — File comments (inline)

- [x] Service: `listComments(threadId)`, `listCommentsByFile(threadId, file)`, `createComment`, `updateComment`, `deleteComment`
- [x] Hooks + keys
- [x] Comment chips on FileChangesPanel rows → expandable inline comment thread
- [x] Tests

## Ticket 03 — Thread events timeline

- [x] Service: `listEvents(threadId)`, `listEventsPaged`
- [x] Activity timeline section on thread detail
- [x] Tests

## Ticket 04 — Snapshots

- [x] Service: `listSnapshots`, `createSnapshot`, `getSnapshot`, `getLatestSnapshot`
- [x] Version history list + capture button on thread detail
- [x] Tests

## Ticket 05 — Indexing explorer

- [x] Service: `listIndexes`, `startIndexing`, `getIndex`, `searchFiles`, `getFilesByLanguage`, `getGraph`, `getFiles`
- [x] New `/indexing` route: index list, start-index dialog (repo/branch/fileContents), per-index files + language + graph
- [x] Tests

## Ticket 06 — API keys (Settings)

- [x] Service: `listApiKeys`, `createApiKey`, `revokeApiKey`
- [x] Settings → API Keys section: create dialog with show-once key + copy, revoke with confirm
- [x] Tests

## Phase exit criteria

- [ ] All six surfaces implemented + tested (build, lint, tests green)
- [ ] PR raised to `develop`, reviewed, merged
- [ ] Latest `develop` pulled; `feature/workspace-intelligence` deleted locally + remotely
