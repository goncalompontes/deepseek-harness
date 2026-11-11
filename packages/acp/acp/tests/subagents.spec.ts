import { describe, expect, it } from 'vitest'
import type { SessionId } from '@deepseek-ai/dsh-session'
import { DEEPSEEK_SUBAGENT_META, subagentStateNotification } from '../src/session.ts'

const parent = 'parent-session' as SessionId
const child = 'child-session' as SessionId
const info = { runId: 'run-1', provider: 'spawn-in-process', id: child, local: true }

describe('ACP native subagent exposure', () => {
  it('publishes a running child session under the child id', () => {
    expect(subagentStateNotification(parent, info, 'running')).toEqual({
      sessionId: child,
      update: {
        sessionUpdate: 'state_update',
        state: 'running',
        _meta: {
          [DEEPSEEK_SUBAGENT_META]: {
            parentSessionId: parent,
            runId: 'run-1',
            provider: 'spawn-in-process',
            local: true,
          },
        },
      },
    })
  })

  it('publishes the terminal stop reason on the child session', () => {
    expect(subagentStateNotification(parent, info, 'idle', 'cancelled')).toMatchObject({
      sessionId: child,
      update: { sessionUpdate: 'state_update', state: 'idle', stopReason: 'cancelled' },
    })
  })
})
