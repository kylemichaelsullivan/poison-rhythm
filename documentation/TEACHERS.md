# Teacher Guide — Poison Rhythm

Classroom-oriented guide for music teachers. For setup and tech details, see [README.md](../README.md). For developers and coding agents, see [AGENTS.md](../AGENTS.md).

## What students practice

Poison Rhythm is an ear-and-eye discrimination game: one **poison** pattern is hidden among decoy measures. Students scan (and optionally listen) to find the match.

Skills it targets:

- Steady pulse and subdivision awareness (quarters → eighths → sixteenths)
- Pattern comparison (same vs different measures)
- Optional **auditory preview** before a “your turn” pass
- Optional **memory** (poison hidden during playback)

It is not a full notation curriculum. **Grid** mode is a piano-roll view; **Notation** mode uses MusiSync glyphs for conventional note/rest shapes when you want staff-like reading practice.

## Five-minute classroom start

1. Open the app — a round is already generated (measures + poison appear immediately).
2. Set **Difficulty** (1–5) from the title **About** modal (click the Poison Rhythm title) or **Settings → Mode**; open the **i** control for level plain-language help.
3. Set **subdivision** in the header ShowNotes control (or Settings → Mode) to 1/4, 1/8, or 1/16 to match what students are ready to see and hear.
4. Point to the **Poison Rhythm** box so everyone knows the target pattern.
5. Use **Prev / Next** to walk measures together, or **Play** so the class hears them (count-in beats appear on the Play control when count-in is on).
6. Click **New** for a fresh poison and set of measures, or **Reuse** to keep the same poison and regenerate decoys.

## Difficulty (what changes)

| Level | Classroom feel (on a 1/16 reference grid) |
|-------|-------------------------------------------|
| 1 | Fewest hits — mainly downbeats |
| 2 | More hits — mostly downbeats, a few offbeats |
| 3 | Busier — mix of strong and weaker spots |
| 4 | Dense — freer placement across the grid |
| 5 | Densest — nearly filling the measure |

Hit counts **scale down** when you choose coarser subdivisions (1/8 or 1/4), so level 5 on quarters is not the same absolute density as level 5 on sixteenths.

Tip: raise **subdivision** before maxing difficulty if students struggle to *see* the grid, not just hear density.

## Play modes

Change mode from the **Difficulty** section badge in the title About modal (click Poison Rhythm), or under **Settings → Mode → Play Mode**.

| Mode | Use when… |
|------|-----------|
| **Poison Rhythm** (default) | You want a poison target among decoys; playback can stop when the poison measure is reached (unless Endless is on). |
| **Bucket Drumming** | You want endless practice without a poison target (good for groove / sticking-focused work). Endless is forced on. |
| **Endless** (checkbox under Poison Rhythm mode) | Keep streaming measures without ending the set when poison appears — useful for longer warm-ups. |

## Poison visibility (Eye toggle)

On the Poison Rhythm section (also **Show Poison?** under **Settings → Mode → Practice**):

- **Visible** — students can see the poison while they search and while measures play.
- **Hidden during playback** — poison is concealed while playing (memory / recall challenge). Generation still uses a poison when Poison Rhythm mode has poison enabled.
- Poison can also be turned **off** depending on mode/settings (Bucket Drumming does not use poison).

Former separate Memory / Mirror play modes are gone; use **Poison Rhythm** mode + the Eye toggle instead.

## Listening then playing (demo pass)

In **Settings → Mode**:

- **Preview Before Play** — for each measure: a **Listening** (demo) pass, then a **Playing** (student) pass.
- **Mute Rhythm Hits on Playing Pass** — students hear the metronome but not the pattern on the second pass (call-and-response style).

Optional **Count-In Before Play** is under **Settings → Sound**. During count-in, beat numbers show on the Play button.

## Display mode

From the badge on the Poison Rhythm section, or **Settings → Look → Display**:

| Mode | Teacher note |
|------|----------------|
| **Grid** | Clearest for counting cells and subdivisions; great for beginners. |
| **Notation** | MusiSync note/rest glyphs; better once students can map duration shapes. |
| **Scroll** | Guitar Hero–style highway; individual hit gems approach a judgment line during playback. |

## Suggested lesson arcs

**Warm-up (5–8 min)** — Subdivision 1/4 or 1/8, difficulty 1–2, Poison Rhythm mode, poison visible. Class votes which measure matches; confirm with Play.

**Compare & contrast (10–15 min)** — Subdivision 1/8, difficulty 2–3. Reuse the same poison while regenerating decoys so students practice *discrimination*, not memorizing one set.

**Memory challenge** — Same as above, but Eye → hidden during playback. Preview Before Play on; mute the Playing pass so students must internalize the Listening pass.

**Bucket groove** — Bucket Drumming mode, raise difficulty gradually; set tempo from the footer metronome or **Settings → Sound**.

**Notation bridge** — Switch Display Mode to Notation after students can find the poison in Grid; keep subdivision fixed so only the visual language changes.

## Accessibility & projection tips

- Prefer a larger window or projected display; section titles and the poison box are the visual anchors.
- Count-in and “Counting In” status help shared listening.
- Theme (light/dark/system) is under **Settings → Look**.
- Colors (dominant / secondary) are under **Settings → Look** — prefer the **Poison Rhythm** pairing for shared classrooms; low-contrast crayons show a bypassable warning modal. See [`COLORS.md`](COLORS.md).
- Feedback toggles (visual / audio) live under Look if the room setup needs quieter or less flashy play.

## Student records (printable PDF)

Use the one-page letter-size form to log sessions and observed skills:

- **PDF:** [`printables/student-record.pdf`](printables/student-record.pdf)
- **HTML source** (edit then regenerate): [`printables/student-record.html`](printables/student-record.html)

Regenerate after editing the HTML:

```bash
bun run printables:student-record
```

## What this guide is not

- It does not replace your curriculum sequence (stickings, accents, and multi-bar phrases are Coming Soon in Settings).
- It does not document commit messages, architecture, or test commands — see [`/git-commits`](../.cursor/skills/git-commits/SKILL.md), [ARCHITECTURE.md](ARCHITECTURE.md), and [TESTING.md](TESTING.md).
