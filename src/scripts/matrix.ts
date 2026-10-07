// "Matrix" hover: text scrambles for 480ms on `[data-matrix]`; buttons
// (`data-matrix="btn"`) also get falling characters on a canvas inside the
// button. Disabled for touch (`hover: none`) and reduced motion.

const RAIN = "01";
const SCRAMBLE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>/{}=#$%&*";
const SCRAMBLE_MS = 480;
const FONT_SIZE = 11;

type Session = {
    el: HTMLElement;
    canvas?: HTMLCanvasElement;
    nodes: Text[];
    originals: string[];
    raf: number;
};

const pick = (chars: string) => chars[(Math.random() * chars.length) | 0];

const isDisabled = () =>
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let initialized = false;
let session: Session | null = null;
// Rain is drawn on a canvas placed inside the button (which has
// `overflow-hidden` and its own clip-path), so it can never leak out.
const createCanvas = (el: HTMLElement) => {
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = el.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    Object.assign(canvas.style, {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    });
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);

    return { canvas, ctx, width, height };
};

const stop = () => {
    if (!session) return;

    cancelAnimationFrame(session.raf);
    session.nodes.forEach((node, i) => {
        node.nodeValue = session!.originals[i];
    });
    session.canvas?.remove();
    session = null;
};

const start = (el: HTMLElement) => {
    stop();
    if (isDisabled()) return;

    // Scrambling swaps in characters of other widths; only monospace text
    // stays put while it runs.
    if (!/mono/i.test(getComputedStyle(el).fontFamily)) return;

    const nodes: Text[] = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
        if (node.nodeValue?.trim()) nodes.push(node as Text);
    }
    if (nodes.length === 0) return;

    const originals = nodes.map((n) => n.nodeValue ?? "");
    const rain = el.dataset.matrix === "btn";
    const color = getComputedStyle(el.querySelector("span") ?? el).color;
    const startRect = el.getBoundingClientRect();
    const columns = Math.ceil(startRect.width / FONT_SIZE);
    const drops = Array.from(
        { length: columns },
        () => -Math.random() * (startRect.height / FONT_SIZE) * 2,
    );
    const layer = rain ? createCanvas(el) : null;
    const ctx = layer?.ctx ?? null;
    const startedAt = performance.now();
    const current: Session = {
        el,
        canvas: layer?.canvas,
        nodes,
        originals,
        raf: 0,
    };
    session = current;

    const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / SCRAMBLE_MS);

        nodes.forEach((textNode, i) => {
            const original = originals[i];
            let out = "";
            for (let j = 0; j < original.length; j++) {
                const char = original[j];
                out +=
                    char === " " || j / original.length < progress
                        ? char
                        : pick(SCRAMBLE);
            }
            textNode.nodeValue = out;
        });

        if (ctx && layer) {
            ctx.clearRect(0, 0, layer.width, layer.height);
            ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
            ctx.fillStyle = color;
            for (let k = 0; k < columns; k++) {
                drops[k] += 0.32;
                if ((drops[k] - 6) * FONT_SIZE > layer.height) {
                    drops[k] = -Math.random() * 4;
                }
                for (let j = 0; j < 6; j++) {
                    ctx.globalAlpha = j === 0 ? 0.6 : 0.32 * (1 - j / 6);
                    ctx.fillText(
                        pick(RAIN),
                        k * FONT_SIZE,
                        (drops[k] - j) * FONT_SIZE,
                    );
                }
            }
        }

        if (progress < 1 || rain) current.raf = requestAnimationFrame(tick);
    };

    current.raf = requestAnimationFrame(tick);
};

export const initMatrix = () => {
    if (initialized) return;
    initialized = true;

    // Delegated on `document`, so it survives View Transitions.
    document.addEventListener("mouseover", (event) => {
        const el = (event.target as Element | null)?.closest?.<HTMLElement>(
            "[data-matrix]",
        );
        if (el && session?.el !== el) start(el);
    });
    document.addEventListener("mouseout", (event) => {
        if (session && !session.el.contains(event.relatedTarget as Node | null)) {
            stop();
        }
    });
    document.addEventListener("mousedown", stop, true);
    document.addEventListener("astro:before-swap", stop);
};
