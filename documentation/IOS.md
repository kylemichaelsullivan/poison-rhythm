# iOS WebKit — performance and styling

Chrome on iOS and Safari on iOS share WebKit. Treat a color or animation that fails in one as likely to fail in the other. Versions below are the ones already recorded in [`src/index.css`](../src/index.css) from caniuse, not a new device matrix.

Each note is marked **experienced** (it showed up in this repo, or it is the fix written into the stylesheet / PostCSS plugin) or **speculative** (it follows from that documentation and from how WebKit behaves, and was not separately reproduced on a device for the timed notice).

## Experienced

### A modern color as the only value paints nothing

Tailwind’s `@theme` block keeps a single value per token. Putting a second `oklch()` or `light-dark()` declaration in that block dropped the hex at build time, and iOS was left with no color.

What the stylesheet does instead:

- Hex and rgba live in `@theme`. `--color-primary` is `var(--color-brand-purple-deep)` (`#914893`). `--color-secondary` is `var(--color-brand-mint-deep)` (`#246028`). Dark mode primary is `--color-brand-purple-bright` (`#c39ac4`), a lighter mix of that purple, still a plain hex.
- Brand and ink tokens are registered with `@property` (`syntax: "<color>"`, `initial-value` the sRGB hex). An untyped custom property does not fall back: `--token: #hex; --token: oklch(...)` always keeps the `oklch()`, and a failed substitution blanks the property that uses the variable. A registered color uses the hex initial value when `oklch()` cannot be computed.
- `oklch()` is only assigned inside `@supports (color: oklch(50% 0.1 0))`. Engines older than that skip the block and keep the `@theme` hex. `@property` itself is iOS 16.4+, so the hex initial value is the fallback on engines that understand registration.
- `color-mix()` is only inside `@supports (color: color-mix(in srgb, red, blue))`.
- `light-dark()` is iOS 17.5 and newer. Dark mode uses `prefers-color-scheme` (iOS 13 and newer) and `data-theme` instead.
- Contrast meter bars and crayon swatch chips list Light, then Dark, and keep that visual order in every theme. They do not use flex `order` or `light-dark()` to shuffle rows. Chip/bar fills use stable `--color-ink-*` tokens (`bg-ink-100` / `bg-ink-950`) so Dark Mode cannot invert Light chrome into a dark chip.

Recorded support in the stylesheet comment: `oklch()` iOS 15.4+, `color-mix()` iOS 16.2+, `@property` iOS 16.4+, `light-dark()` iOS 17.5+.

Crayon choices are applied as hex custom properties (`applyColorPreferenceVars`). Those inline values beat both the `@theme` hex and the `oklch()` upgrade, so a selected pair stays sRGB.

### There is no prefixed `color-mix()`

`postcss/ios-color-fallback.ts` inserts a plain color ahead of `color-mix()`, and a `-webkit-` gradient ahead of an unprefixed `linear-gradient()` / `radial-gradient()`. If the modern declaration is dropped, the earlier one still applies. The plugin does not rewrite `to right` into the older `left` direction, so a gradient that must survive very old WebKit has to include `-webkit-linear-gradient(left, …)` itself.

### Gradients and clipped text

The page wash uses rgba stops and `-webkit-radial-gradient` before the standard `radial-gradient`, so older WebKit still paints. The title treatment sets a solid `color` first, then `-webkit-background-clip: text` where clipping is supported.

### Shadows

Shadow colors are rgba. They do not depend on `color-mix()`.

## Speculative

### Timed notice progress bar

The difficulty acknowledgement (`dismissAfterMs` on `Modal`, duration `TIMED_NOTICE_DURATION_MS`) draws `.TimedNoticeProgress` along the top of the panel.

- **Layout vs transform.** Animating `width` or `left` forces layout on every frame. The bar uses `transform: scaleX` from the left edge so the motion can stay on the compositor. Speculative cost on top of that: the dialog panel uses `backdrop-blur-md`. A blur behind a transforming child is expensive on WebKit; this bar is one short animation (2.5 seconds by default).
- **Timers in the background.** `setTimeout` can run late when the tab is hidden or Low Power Mode is on. `useTimedDismiss` stores a start time and reschedules from the elapsed time on `visibilitychange`. CSS animations also pause while the document is hidden, so the bar and the dismiss stay nearer each other. Not checked on a device.
- **Gradient stops.** A gradient whose only stops are `oklch()` or `color-mix()` can fail to paint even when a solid color would show. The bar sets `background-color: var(--color-primary)` before either gradient. The stops are `--color-primary` and `--color-secondary` (brand hex by default, crayon hex when a pair is selected). The rule itself does not contain `color-mix()` or `oklch()`.
- **Old gradient direction.** `-webkit-linear-gradient(left, …)` is declared before `linear-gradient(to right, …)`. An engine that ignores `to right` can still use the earlier image.
- **`scaleX(0)`.** Some WebKit builds have been reported to skip an animation that starts at a zero scale. If the bar never moves on device but the solid color is visible, start the keyframes just above zero. Not reproduced here.
- **Reduced motion.** `prefers-reduced-motion: reduce` shows the full gradient immediately and still dismisses on the timer. The words in the dialog do not depend on the motion.
- **Hover.** The timer pauses on `mouseenter` / `mouseleave` of the dialog, not on a CSS `:hover` rule. A tap can leave `:hover` stuck on iOS and would hold the notice open; mouse events do not fire for that tap. Not separately device-checked.

### Other stylesheet behavior

- `background-attachment: fixed` on `html` is often ignored or janky on iOS. It is already in the page wash and is unchanged by the notice.
- `100vh` includes the browser chrome. Full-height shells in this app use `dvh`. The notice does not size itself from the viewport.
- `text-wrap: pretty` avoids a one-word last line. Paragraphs, lists, and headings declare `balance` first, then `pretty`. An engine that drops `pretty` keeps `balance`. Speculative on older WebKit: `pretty` is newer than `balance`, and neither property exists on very old iOS, so a one-word last line can still appear there.

## What to run

`src/lib/__tests__/timed-notice.test.ts` fails if the duration, the `0.5rem` height, the hex defaults, the crayon hex overrides, or the gradient fallbacks drift. `e2e/difficulty-regen-ack.spec.ts` fails if the OK button returns, the notice does not dismiss itself, or hovering fails to pause it.

## Related

- [`src/index.css`](../src/index.css) — tokens and the notice rule
- [`src/lib/css/color-mix-fallback.ts`](../src/lib/css/color-mix-fallback.ts) — fallback values
- [`postcss/ios-color-fallback.ts`](../postcss/ios-color-fallback.ts) — build plugin
- [`COLORS.md`](COLORS.md) — crayon preferences
- [`A11Y.md`](A11Y.md) — keyboard dismiss for this notice
