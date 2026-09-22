# BrainCare — Modules 5, 6, 7, 8 Integration Notes

This tree is the result of merging three independently-built deliveries:

- `braincare-module-5-6.zip` — Game engine + Games 1–4 (Memory Match, Sequence
  Recall, Pattern Recognition, Selective Attention)
- `braincare-module7-games-5-6.zip` — Games 5–6 (Word Memory, Logic Puzzles)
- `braincare-module8-progress-dashboard.zip` — Progress dashboard

They were built without sight of each other and did not compile together as
delivered. Both the module-7 and module-8 code included explicit
"ASSUMPTION" comments flagging that they were duplicating things that should
already exist elsewhere and asking for a merge — this integration does that
merge. Nothing about the games' actual gameplay logic, scoring, or content
was changed; only the plumbing that connects the pieces.

## Conflicts found and how they were resolved

### 1. Two `shared/types/game.ts`
Module 5-6 and Module 7 each shipped their own version of the core game
contract, with incompatible field names (`id` vs `gameId`,
`durationSeconds` vs `duration`, `supportsDifficulty` vs
`supportedDifficulties`).

**Resolved:** kept Module 5-6's version (it matches your master prompt's
required `GameController` interface — `startGame / restartGame / pauseGame /
finishGame / calculateScore / getResult` — exactly). Extended its `GameId`
union from 4 to all 6 games, and widened `category` to include
`"reasoning"` for Logic Puzzles. Also widened `GameResult.details` from
`Record<string, number | string>` to `Record<string, unknown>` so it can
hold Word Memory's word lists and Logic Puzzles' answer-record arrays
(display-only — this field is never sent to the backend, see below).

### 2. Two `GameShell` components
- `client/src/games/engine/GameShell.tsx` (Module 5-6) — full lifecycle:
  instructions → difficulty select → play (pause/resume) → results, with
  auto-submission to the backend and retry-on-error. Driven by a
  `GameController` object.
- `client/src/components/games/GameShell.tsx` (Module 7) — a lighter
  render-prop shell built just to unblock Games 5-6 in isolation.

**Resolved:** kept only the Module 5-6 `GameShell`. Word Memory and Logic
Puzzles were rewritten to plug into it the same way the other four games
do — see "Games 5 & 6 rewrite" below. Module 7's `GameShell.tsx` was
dropped.

### 3. Two result-submission services
`gameResultService.ts` (`submitGameResult`, cookie-authenticated, posts to
`POST /api/games/:gameId/sessions`) vs `gameSessionService.ts`
(`submitGameSession`, same endpoint, different payload shape).

**Resolved:** kept `gameResultService.ts` only. It's called once, centrally,
by `GameShell`'s results screen — individual games never call it directly,
so there's now exactly one network call site for session submission.

### 4. Game configs duplicated / scattered
Each of Games 1-4 declared its own `GameConfig` inline in its component
file. Module 7 assumed a shared `shared/constants/games.ts` registry
already existed and asked for its two configs to be merged into it.

**Resolved:** created `shared/constants/games.ts` as the single source of
truth for all 6 configs (`ALL_GAME_CONFIGS`). All six game components now
import their config from there instead of declaring their own copy, and
`registry.ts` builds the full game list from it. This means the id, name,
and description shown on the Games list can no longer drift from what
Module 4 seeds into the database (see "Still needed from Module 4" below).

### 5. Two auth mechanisms
`gameResultService.ts` (Module 5-6) sends the request with
`credentials: "include"`, relying on Module 2's HTTP-only session cookie.
Module 8's `apiClient.ts` instead read a bearer token out of
`localStorage` and sent it as an `Authorization` header — a second,
weaker auth path (storing a JWT in localStorage reopens the XSS exposure
HTTP-only cookies exist to prevent) that also wouldn't work against
Module 2's actual cookie-based session.

**Resolved:** `apiClient.ts` now sends `credentials: "include"` and drops
the bearer-token/localStorage code, matching `gameResultService.ts`. One
auth mechanism across the whole client.

## Games 5 & 6 rewrite (Word Memory, Logic Puzzles)

The actual gameplay logic — `wordBank.ts` (word generation) and
`questionBank.ts` (puzzle generation) — is unchanged, copied verbatim.
What changed is how each game plugs into the shell:

- New `wordMemoryLogic.ts` / `logicPuzzleLogic.ts`: pure state-transition
  functions (`createInitialState`, `toggleWord`, `submitSelections`,
  `selectOption`, `continueToNext`, score/accuracy calculators), in the
  same style as `memoryMatchLogic.ts` and `sequenceRecallLogic.ts`.
- New `useWordMemoryGame.ts` / `useLogicPuzzlesGame.ts`: wrap that logic
  with `useGameController` (the shared engine hook), the same way
  `useMemoryMatchGame.ts` does.
- Rewritten `WordMemoryGame.tsx` / `LogicPuzzlesGame.tsx`: render inside
  the shared `<GameShell config={...} controller={...} renderPlayArea={...}
  />`, instead of the old render-prop shell.
- The old component-level tests (`WordMemoryGame.test.tsx`,
  `LogicPuzzlesGame.test.tsx`) mocked the removed `gameSessionService` and
  the removed `GameShell`'s DOM flow ("click Easy, then click Start Game"
  — the kept `GameShell` starts a game the moment a difficulty is picked,
  with no separate Start button). Rather than patch tests to a shell
  that's being replaced, they were replaced with `wordMemoryLogic.test.ts`
  / `logicPuzzleLogic.test.ts` — pure-logic tests matching the convention
  every other game in this codebase already uses (no game in Module 5-6
  had component/DOM-level tests either).

## Module 8 (Progress Dashboard) — no game-specific changes needed

Worth calling out: the dashboard never hardcodes a game list. It derives
every `gameId` it displays from the API responses
(`useGameProgressList`, `GameSelector`, `GameDetailPanel`), so Word Memory
and Logic Puzzles will show up automatically once Module 4 starts
returning sessions for them — no code changes required here. The only fix
in this module was the auth mechanism in `apiClient.ts` above.

## Validation performed

- Every non-test `.ts`/`.tsx` file in the merged tree (53 files) was run
  through esbuild's TypeScript/JSX transform as a syntax check — 0
  failures.
- Every relative import in the tree (68 files) was checked to resolve to
  an actual file on disk — 0 unresolved, with one expected exception:
  imports of `../../components/ui/{Button,Card,DifficultySelector,
  LoadingSpinner,ErrorMessage}`, which are Module 1's design-system
  components and aren't part of this batch of uploads (both `GameShell.tsx`
  and the individual games already documented this dependency in their own
  comments).
- This was a static/structural check (syntax + import graph), not a full
  `tsc`/build, since Modules 1, 2, and 4's source wasn't uploaded here and
  a real compile needs their types too.

## Still needed from modules not in this batch

These aren't things this merge could fix, since those modules' code isn't
part of this delivery — flagging them so whoever owns those modules can
close the loop:

1. **Module 4 (game data backend)** needs to:
   - Seed its `Game` table from all 6 games, not the original 4. If it
     seeds from a hand-written list today, point it at
     `shared/constants/games.ts`'s `ALL_GAME_CONFIGS` instead, so the seed
     data can't drift from the client's game list again.
   - Add the progress-aggregation endpoints Module 8 depends on:
     `GET /api/progress/overview`, `GET /api/progress/games`,
     `GET /api/progress/sessions/recent?limit=`,
     `GET /api/progress/weekly-activity?weeks=`, and
     `GET /api/progress/games/:gameId/history` — matching the shapes in
     `shared/types/progress.ts`. Module 4's original spec only defined
     `GET /api/progress` and `GET /api/progress/:gameId`; Module 8 was
     built against a richer contract that Module 4 hasn't implemented yet.
2. **Module 1 (design system)** needs to supply
   `client/src/components/ui/{Button,Card,DifficultySelector,
   LoadingSpinner,ErrorMessage}` — every game and the dashboard already
   assume these exist at that path.
3. **Module 2 (auth)** — no changes needed; this merge made the rest of the
   app consistent with its actual cookie-based session instead of the
   other way around.
