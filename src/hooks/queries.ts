import { useQuery } from '@tanstack/react-query'
import { threadService } from '@/services/thread.service'
import githubService from '@/services/github.service'
import indexingService from '@/services/indexing.service'
import { apiKeyService } from '@/services/api-key.service'

/**
 * Central query-key factory. All pages derive keys from here so mutations can
 * invalidate/update the exact caches they touch.
 */
export const queryKeys = {
  threads: ['threads'] as const,
  threadsSearch: (q: string) => ['threads', 'search', q] as const,
  threadsByStatus: (status: string) => ['threads', 'status', status] as const,
  thread: (id: string) => ['threads', id] as const,
  threadNotes: (id: string) => ['threads', id, 'notes'] as const,
  threadComments: (id: string) => ['threads', id, 'comments'] as const,
  threadEvents: (id: string) => ['threads', id, 'events'] as const,
  threadSnapshots: (id: string) => ['threads', id, 'snapshots'] as const,
  threadBrief: (id: string) => ['threads', id, 'brief'] as const,
  threadReview: (id: string) => ['threads', id, 'review'] as const,
  briefs: ['briefs'] as const,
  brief: (id: string) => ['briefs', id] as const,
  notes: ['notes'] as const,
  github: {
    status: ['github', 'status'] as const,
    repos: ['github', 'repos'] as const,
    branches: (owner: string, repo: string) => ['github', 'branches', owner, repo] as const,
  },
  indexing: {
    indexes: ['indexing', 'indexes'] as const,
    index: (id: string) => ['indexing', 'indexes', id] as const,
    files: (id: string) => ['indexing', 'indexes', id, 'files'] as const,
    search: (id: string, pattern: string) =>
      ['indexing', 'indexes', id, 'search', pattern] as const,
    graph: (id: string) => ['indexing', 'indexes', id, 'graph'] as const,
  },
  apiKeys: ['api-keys'] as const,
} as const

export function useThreadsQuery() {
  return useQuery({ queryKey: queryKeys.threads, queryFn: () => threadService.listThreads(0, 50) })
}

export function useThreadsSearchQuery(q: string) {
  return useQuery({
    queryKey: queryKeys.threadsSearch(q),
    queryFn: () => threadService.searchThreads(q, 0, 50),
    enabled: q.trim().length > 0,
  })
}

export function useThreadsByStatusQuery(status: string) {
  return useQuery({
    queryKey: queryKeys.threadsByStatus(status),
    queryFn: () => threadService.searchByStatus(status, 0, 50),
    enabled: status !== 'all',
  })
}

export function useThreadQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.thread(id),
    queryFn: () => threadService.getThread(id),
    enabled: !!id,
  })
}

export function useThreadNotesQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.threadNotes(id),
    queryFn: () => threadService.listThreadNotes(id),
    enabled: !!id,
  })
}

export function useThreadCommentsQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.threadComments(id),
    queryFn: () => threadService.listComments(id),
    enabled: !!id,
  })
}

export function useThreadEventsQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.threadEvents(id),
    queryFn: () => threadService.listEvents(id),
    enabled: !!id,
  })
}

export function useThreadSnapshotsQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.threadSnapshots(id),
    queryFn: () => threadService.listSnapshots(id),
    enabled: !!id,
  })
}

/** Brief for a thread — null when none generated yet (endpoint 404s). */
export function useThreadBriefQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.threadBrief(id),
    queryFn: () => threadService.getBrief(id).catch(() => null),
    enabled: !!id,
    retry: false,
  })
}

/** Latest Code-Rabbit-style PR review for a thread — null when none ran yet. */
export function useThreadReviewQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.threadReview(id),
    queryFn: () => threadService.getReview(id).catch(() => null),
    enabled: !!id,
    retry: false,
  })
}

export function useBriefsQuery() {
  return useQuery({ queryKey: queryKeys.briefs, queryFn: () => threadService.listBriefs(0, 20) })
}

export function useBriefQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.brief(id),
    queryFn: () => threadService.getBriefById(id),
    enabled: !!id,
  })
}

export function useNotesQuery() {
  return useQuery({ queryKey: queryKeys.notes, queryFn: () => threadService.listNotes(0, 50) })
}

export function useGitHubStatusQuery() {
  return useQuery({ queryKey: queryKeys.github.status, queryFn: () => githubService.getStatus() })
}

export function useIndexesQuery() {
  return useQuery({
    queryKey: queryKeys.indexing.indexes,
    queryFn: () => indexingService.listIndexes(),
  })
}

export function useIndexFilesQuery(indexId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.indexing.files(indexId),
    queryFn: () => indexingService.getFiles(indexId),
    enabled: !!indexId && enabled,
  })
}

export function useIndexSearchQuery(indexId: string, pattern: string) {
  return useQuery({
    queryKey: queryKeys.indexing.search(indexId, pattern),
    queryFn: () => indexingService.searchFiles(indexId, pattern),
    enabled: !!indexId && pattern.trim().length > 0,
  })
}

export function useIndexGraphQuery(indexId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.indexing.graph(indexId),
    queryFn: () => indexingService.getGraph(indexId),
    enabled: !!indexId && enabled,
  })
}

export function useReposQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.github.repos,
    queryFn: () => githubService.listRepositories(),
    enabled,
  })
}

export function useBranchesQuery(owner: string, repo: string) {
  return useQuery({
    queryKey: queryKeys.github.branches(owner, repo),
    queryFn: () => githubService.listBranches(owner, repo),
    enabled: !!owner && !!repo,
  })
}

export function useApiKeysQuery() {
  return useQuery({ queryKey: queryKeys.apiKeys, queryFn: () => apiKeyService.listApiKeys() })
}
