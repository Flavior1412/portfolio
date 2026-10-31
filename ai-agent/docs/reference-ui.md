# Reference-based portfolio UI

The current presentation was inspired by a local `portfolio-2026` reference.
That separate checkout is not required to run or continue this project. The
implemented presentation to preserve is:

- Bone/ink palette, Inter body type and Space Grotesk display type.
- Fixed navigation that inverts over the dark sections.
- Outlined marquee and a pinned hero with a still image in `public/frames/male0001.webp` and scroll-driven captions.
- Large typography sections, a light skills section that turns dark on hover, and work-row hover wipes.
- The original zigzag career timeline and eight-frame walking character, with the current fonts.
- A light contact section that turns dark on hover, with direct email and phone links.

Profile, career, skill and project content belongs to Khuong Nguyen Huu. Career
facts live in `src/features/timeline/infrastructure/data/timeline.json`; skills live in `src/features/skills/infrastructure/data/skills.json`.
`src/features/profile/infrastructure/data/profile.json` centralizes the existing profile copy; `content.json`
contains interface text, accessibility labels and metadata. Infrastructure
repositories provide records through application queries; the app composition
root passes the results into presentation components. The selected work
list is derived from the enterprise projects already present in the career data.
No reference profile, résumé, personal links or project descriptions were copied.

The hero image is in `public/frames`. Its canvas renderer is in
`src/features/hero/presentation/components`. GSAP and Lenis drive the normal
scroll experience; reduced-motion mode uses a still hero without pinning or
smooth scrolling. The career timeline retains its original zigzag path and walking animation.

Selected navigation targets persist in the URL hash. On refresh or a direct
anchor visit, scrolling waits for fonts and hero pin layout, then aligns the
target below the fixed navigation (90px). About uses its start marker; Hero
returns to the top. A missing or invalid section hash restores the document top.
Back/Forward restores anchors too, while subsequent manual
scrolling and resizing do not repeatedly snap back to the saved target.

After changes, rebuild and restart the server that serves `localhost:3000`.
An isolated `.next-verify` build on another port does not update that server.

Development and build commands run inside the repository root.
