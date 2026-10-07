// Responsive images served straight from the Sanity CDN: `auto=format` picks
// AVIF/WebP per browser and `fit=max` never upscales past the original.

const DEFAULT_WIDTHS = [320, 480, 640, 800, 960, 1280, 1600, 1920];

type Options = {
    /** The `sizes` attribute: how wide the image is rendered in the layout. */
    sizes: string;
    /** Original width; candidates above it are dropped. */
    sourceWidth?: number | null;
    widths?: number[];
};

export function sanityImageUrl(url: string, width: number) {
    return `${url}?w=${width}&fit=max&auto=format`;
}

export function sanityImage(
    url: string,
    { sizes, sourceWidth, widths = DEFAULT_WIDTHS }: Options,
) {
    let candidates = widths;
    if (sourceWidth) {
        candidates = widths.filter((width) => width < sourceWidth);
        if (sourceWidth <= widths[widths.length - 1]) {
            candidates.push(sourceWidth);
        }
    }

    const fallback =
        candidates.find((width) => width >= 800) ??
        candidates[candidates.length - 1];

    return {
        src: sanityImageUrl(url, fallback),
        srcset: candidates
            .map((width) => `${sanityImageUrl(url, width)} ${width}w`)
            .join(", "),
        sizes,
    };
}
