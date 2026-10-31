# Timeline sprites

- `student-walk-cycle.webp`: original student walking sprite.
- `junior.png`: supplied source image, copied from the other local project checkout.
  Its alpha channel is fully opaque, including the black background.
- `junior-walk-cycle.webp`: transparent runtime asset, produced using the built-in
  `image_gen` tool and converted to lossless WebP. It contains eight frames in a
  4-column, 2-row grid (1774 × 887),
  with an employee ID badge and navy neck lanyard in each pose.
  The anatomical left hand holds the coffee consistently across all eight frames;
  the empty right arm swings separately below the cup.
- `middle-walk-cycle.webp`: Middle runtime variant wearing a white short-sleeve
  T-shirt, headphones and carrying a laptop. The jacket-free variant was renamed
  to this runtime filename. Transparent 1774 × 887 sheet, encoded as lossless WebP.
- `senior.png`: supplied Senior source image with an opaque dark background.
- `senior-walk-cycle.webp`: transparent Senior runtime sprite with an orange
  T-shirt, watch and open laptop. Eight frames in a 4-column, 2-row grid, extracted
  using built-in `image_gen` and encoded as lossless WebP.
  The watch-wearing hand stays in the front jeans pocket in all eight frames;
  the other hand carries the laptop.

The character changes to Junior at milestone ID 1 (ODMS), then Middle at ID 2
(ORIENT/Retail DDS), then Senior at ID 3 (FPT/Buyer Red Line, March 2021). Senior
remains for subsequent milestones. All sprites use the
same eight-step animation and 600ms opacity crossfade, including scroll reversal.
Reduced motion disables walking and crossfades. An earlier available character
remains visible until the next stage's image loads.
After 80px of continuous reverse scrolling, the character turns in 180ms;
reduced motion switches direction immediately.

## Generation prompts

Senior hand-in-pocket correction, with `transparent_background: true`, followed
by lossless WebP conversion:

> Use case: precise-object-edit. Edit target: this transparent 8-frame Senior developer walking sprite sheet. Fix ONLY the watch-wearing arm and hand. In ALL EIGHT walking frames, the hand on the arm wearing the wristwatch must stay tucked INSIDE the same front jeans pocket. The wristwatch remains visible just above the pocket opening, the elbow is relaxed, and the forearm angles naturally down toward the pocket. No swinging free hand, visible fist outside the pocket or change of pocket. In particular, correct the top-row third frame where the watch hand currently swings forward. The OTHER hand continues holding the open laptop steadily in every frame, unchanged. Preserve the face, hair, orange T-shirt, jeans, shoes, laptop, original leg poses, pixel-art style, character sizes, positions, baseline, all eight frames, right-facing direction and 4-column by 2-row grid. Preserve the 1774 by 887 pixel 2:1 canvas and genuine transparent alpha background. Do not add limbs or accessories, mirror, crop or reorder frames. Only make the watch-wearing hand remain in the pocket consistently throughout the walking cycle.

Senior background extraction, with `transparent_background: true`, followed by
lossless WebP conversion:

> Use case: background-extraction. Edit target: this existing eight-frame Senior developer walking sprite sheet. Remove ONLY the opaque black background to genuine transparent alpha, including negative spaces around the arms, legs and open laptop. Preserve the dark hair, blue jeans, watch, orange T-shirt, white sneakers, open gray laptop and its small existing sticker. Preserve every face, hand, laptop-carrying arm, free arm and original walking pose. Keep all eight characters facing right, in the same 4-column by 2-row grid of equal square cells with the same scale, placement and baseline. Keep the 2:1 canvas, preferably its original 1440 by 720 pixels. Do not crop, reorder, mirror, redraw, add accessories or alter the character. Keep dark clothing and outlines opaque; clean antialiased edges without a black halo. Genuine transparent background, no opaque backdrop or baked checkerboard. Only background extraction.

Middle without jacket variant, using built-in `image_gen` with
`transparent_background: true`, followed by lossless WebP conversion:

> Use case: precise-object-edit. Edit target: this transparent eight-frame Middle developer walking sprite sheet. Create a clothing variant by removing the BLACK HOODIE/JACKET completely in ALL EIGHT frames. The character should wear ONLY the existing plain WHITE short-sleeved crew-neck T-SHIRT on his upper body. No jacket, hood, zipper, drawstrings, open outer layer or long sleeves. Show natural bare forearms with the same skin tone as his face, while preserving the exact arm positions, hands, wrists, laptop grip and walking poses from each frame. Preserve face, hair, over-ear headphones, gray laptop, dark trousers, shoes, body proportions, pixel-art style, character size, placement and foot baseline. Add no accessories, text or logos. Keep the original 1774 by 887 pixel canvas, 2:1 aspect ratio, four columns by two rows of equal cells, eight right-facing full-body walking frames. Do not crop, mirror, reorder or redesign the poses. Preserve genuine transparent alpha outside the figures and opaque white fabric on the T-shirts and shoe soles. Clean antialiased edges with no colored halo, no solid backdrop or baked checkerboard. Only remove the jacket and reveal the white short-sleeve T-shirt and forearms.

Middle background extraction, with `transparent_background: true`, followed by
lossless WebP conversion:

> Use case: background-extraction. Edit target: this existing eight-frame Middle developer walking sprite sheet. Remove ONLY the opaque white background to genuine transparent alpha, including the gaps between legs and arms. Preserve the white T-shirt, gray laptop, headphone highlights and white shoe soles as opaque foreground. Keep all eight exact poses, face, dark hair, headphones, black hoodie, laptop-carrying hand, free hand, dark trousers, shoes, pixel-art texture, original character positions, size and baseline. Keep the 4-column by 2-row grid, eight right-facing full-body characters, equal square cells and 2:1 canvas; preserve 1440 by 720 pixels if possible. No cropping, rearranging, new poses, new accessories or character redesign. Clean antialiased transparent edges without white halos. No opaque backdrop or baked checkerboard. Only background extraction.

Final hand continuity repair, with `transparent_background: true`:

> Use case: precise-object-edit. Edit target: this transparent 8-frame walking sprite sheet. Correct the HAND AND ARM CONTINUITY only. All eight characters must continue facing RIGHT, exactly as in the source. The character's anatomical LEFT arm (the FAR arm, behind the torso from this camera view) must hold the coffee cup in ALL EIGHT frames. Keep that same left elbow bent, left forearm extending forward, left wrist natural, and left hand gripping the same upright cup at a consistent height. The anatomical RIGHT arm (the NEAR, camera-facing arm attached to the large visible sleeve on the left side of the torso) must remain EMPTY and swing naturally through the walking cycle. IMPORTANT: in bottom-row columns 2 and 3, the current near arm incorrectly reaches up and holds the cup. Repair those poses so the near/right forearm swings forward LOWER, with an empty relaxed fist clearly separated below the coffee cup, while the far/left hand alone continues holding the coffee. Never switch the cup to the near/right hand; do not have both hands hold it. Exactly two anatomically coherent arms and hands per frame, natural wrists and fingers, no extra hands, fused fingers or duplicated limbs. Preserve the original face, hair, navy lanyard and employee ID badge, orange shirt, backpack, coffee cup, trousers, shoes, leg poses, pixel-art style, frame scale, character positions and baseline. Do not mirror the image or change the character's facing direction. Preserve the exact 1774 by 887 canvas, 4 columns by 2 rows of equal cells, eight frames, and genuine transparent alpha background. Only repair the hands/forearms needed to keep the coffee in the same anatomical left hand through the entire cycle.

Earlier employee badge edit, with `transparent_background: true`:

> Use case: precise-object-edit. Edit target: the supplied transparent walking sprite sheet. Add an employee ID badge on a neck lanyard to this Junior developer in ALL EIGHT frames. Use a thin dark navy lanyard hanging naturally from the neck in a V over the orange shirt, ending in a small clearly visible white rectangular ID card on the upper-middle chest, with a subtle blue header and tiny generic photo block. No readable text, company name or logo. Keep the badge consistently sized and attached in every pose; let the arms correctly occlude it when crossing the chest. Make only this addition. Preserve the same face, hair, orange shirt, backpack, coffee cup, hands, trousers, shoes, original walking poses, character scale, exact frame placement and baseline. Keep the 1774 by 887 pixel canvas, 2:1 aspect ratio, four columns and two rows of equal square cells. No cropping, reflowing, extra frames, added character motion or redesign. Preserve the pixel-art style and genuine transparent alpha background, with clean edges and no opaque backdrop.

### Earlier background preparation

Background extraction from `junior.png`, with `transparent_background: true`:

> Use case: background-extraction. Asset type: existing 8-frame CSS walking sprite sheet. This image is the edit target. Remove ONLY its solid black background to genuine transparent alpha, including the negative spaces between the legs and under the arms. Keep the dark hair, black trousers and character outlines opaque. Preserve the orange shirt, blue backpack, coffee cup, every pose, facial identity and pixel-art texture. Preserve exactly the original arrangement: four equal columns, two equal rows, eight right-facing full-body walking poses, a 2:1 canvas, each character centered in its original square cell. Keep the source canvas 1440 by 720 if possible. Do not crop, rearrange, rescale individual frames, add frames, redraw the characters or change their placement. Produce clean antialiased transparent edges without a black halo; no backdrop, no checkerboard baked into pixels, no text. Only background extraction.

Final edge cleanup, with `transparent_background: true`:

> Use case: background-extraction edge cleanup. This is the edit target, a transparent 8-frame pixel-art sprite sheet. Repair ONLY the cutout edges: remove the spurious bright red, yellow and electric-blue fringe pixels outside the character silhouette, and isolated white pixels under the feet. These colored edge artifacts were introduced by background removal and must not remain. Use clean natural dark charcoal character outlines with soft partial-alpha edge pixels appropriate for placement on a light gray webpage. Keep the true orange shirt, blue backpack, skin, dark trousers, white shoes, coffee cup and steam unchanged. Keep exactly the same 4-column by 2-row grid, eight full-body right-facing poses, character sizes, frame alignment, 2:1 canvas proportions and walking poses. Do not redraw, recompose, crop, move or omit any frame. Preserve genuine transparent alpha outside all eight silhouettes. No new colors, halo, background or baked checkerboard.
