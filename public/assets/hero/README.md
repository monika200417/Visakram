# Hero film frames

`frames/f_0001.webp` … `f_0072.webp` are 72 frames (1280×720 WebP, ~51 KB each,
~3.7 MB in all) cut from the first 7.1 seconds of `../videos/home-tour.mp4`, one
frame every 0.1 s. The MP4 itself is untouched and is not a hero runtime asset.

`f_0001.webp` is also the hero's poster. The frames drive the scroll-scrubbed hero
film on wide screens (src/data/heroFilm.ts, src/media/createFrameSequence.ts); narrow
screens, reduced motion and data-saver show only the poster.

They inherit the Home Tour footage's status: replace them when cleared production
footage is supplied (re-export from the new clip, keep the same file names and count,
or update `heroFilm.frameCount`).
