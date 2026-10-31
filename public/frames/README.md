# Hero image

`male0001.webp` is the only image drawn in the hero. It stays still while the
pinned section's captions change on scroll. The retired frame sequence and unused
alternate images are intentionally absent.

The image is loaded by `src/features/hero/presentation/hooks/useHeroImage.tsx` and drawn by
`HeroCanvas.tsx`. If it cannot load, the canvas uses a procedural still render.
