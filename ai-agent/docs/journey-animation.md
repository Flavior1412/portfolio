# Zigzag career journey

The timeline now uses one full-page route that connects the career cards. The
separate “Small steps” scene has been removed. Cards alternate sides on desktop;
on narrow screens the curve stays beside a readable single-column list.

The SVG route is measured from the actual card positions. Its wide bends stay in
the gaps between cards. Vertical reading progress places the traveler on that
same curve and fills the route up to the traveler's position. Resizing and font
loading trigger a fresh measurement. Reduced motion freezes the gait animation.

The character now has an eight-frame looping walk cycle with alternating legs,
rather than six static poses tied to different scroll stages. CSS displays one
frame at a time, using four columns and two rows. The cadence increases gently
through the journey.

- Runtime sprite: `public/images/journey/student-walk-cycle.webp` (lossless WebP).
- The generated PNG source and previous static sprite sheets were removed after WebP conversion.
- Generator: built-in ImageGen, using the previous schoolboy sprite as the identity reference.
- Layout and scroll-path inspiration: [GSAP Vault — Scroll Path Journey](https://gsapvault.com/demos/scroll-path-journey/).
- Implementation: `src/features/timeline/presentation/components/CharacterJourney.tsx` and `src/features/timeline/presentation/lib/journey-path.tsx`.

## Final ImageGen prompt

Create a new production sprite animation sheet using the supplied image ONLY as character identity reference. Keep exactly this anime schoolboy: black spiky hair, youthful face, dark navy school suit and trousers, white shirt, red tie, blue backpack, gray and white sneakers. We need a TRUE LOOPING WALK CYCLE, not different walking-to-running speeds. Draw exactly EIGHT sequential frames of ONE smooth brisk walk cycle. All eight face RIGHT in strict SIDE PROFILE. Frames1-4 are right-foot-leading contact, down, passing, up; frames5-8 are left-foot-leading contact, down, passing, up. Arms counter-swing opposite legs, alternate knees visibly and naturally, backpack stays on his back. Same identity, head position, body proportions, overall scale in every frame. Layout is perfectly regular FOUR COLUMNS x TWO ROWS on a 2048x1024 canvas, eight512x512 SQUARE CELLS ordered left-to-right then down. Every whole character must fit in its own cell. Character head at y80 from top of EACH cell, foot baseline y430 within EACH cell, full figure around350px tall; widest stride less than310px. CENTER each figure x256 in its cell. At least70px fully transparent padding on EVERY side of EVERY cell. No limb, head, backpack or shoe may touch a cell boundary. NO grid lines, NO numbering, NO text, NO scenery, NO drop shadows, NO haze, NO glow, no background of any kind, only eight clean full-body character cutouts on genuine transparent alpha. The empty padding including a60px gutter on both sides of the midline MUST BE COMPLETELY EMPTY AND TRANSPARENT. Clean crisp anime cel shading. Only one character per cell. Each frame is a distinct phase of stepping, so feet move through a continuous cyclic gait.

Development and build commands run inside the repository root.
