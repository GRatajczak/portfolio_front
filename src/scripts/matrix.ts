// "Matrix" hover: text scrambles for 480ms on `[data-matrix]`; buttons
// (`data-matrix="btn"`) also get falling characters on a canvas clipped to the
// button shape. Disabled for touch (`hover: none`) and reduced motion.

const RAIN =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ0123456789";
const SCRAMBLE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>/{}=#$%&*";
const SCRAMBLE_MS = 480;
const FONT_SIZE = 11;
const CORNER = 14;

type Session = {
    el: HTMLElement;
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
let canvas: HTMLCanvasElement | null = null;

// The canvas lives in <body>, which View Transitions replace — recreate lazily.
const getCanvas = () => {
    if (canvas?.isConnected) return canvas;

    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
        position: "fixed",
        left: "0",
        top: "0",
        pointerEvents: "none",
        zIndex: "9998",
    });
    document.body.appendChild(canvas);
    fitCanvas();
    return canvas;
};

const fitCanvas = () => {
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const stop = () => {
    if (!session) return;

    cancelAnimationFrame(session.raf);
    session.nodes.forEach((node, i) => {
        node.nodeValue = session!.originals[i];
    });
    session = null;
    canvas
        ?.getContext("2d")
        ?.clearRect(0, 0, innerWidth, innerHeight);
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
    const ctx = rain ? getCanvas().getContext("2d") : null;
    const startedAt = performance.now();
    const current: Session = { el, nodes, originals, raf: 0 };
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

        if (ctx) {
            const r = el.getBoundingClientRect();
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(r.left, r.top);
            ctx.lineTo(r.right - CORNER, r.top);
            ctx.lineTo(r.right, r.top + CORNER);
            ctx.lineTo(r.right, r.bottom);
            ctx.lineTo(r.left + CORNER, r.bottom);
            ctx.lineTo(r.left, r.bottom - CORNER);
            ctx.closePath();
            ctx.clip();
            ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
            ctx.fillStyle = color;
            for (let k = 0; k < columns; k++) {
                drops[k] += 0.32;
                if ((drops[k] - 6) * FONT_SIZE > r.height) {
                    drops[k] = -Math.random() * 4;
                }
                for (let j = 0; j < 6; j++) {
                    ctx.globalAlpha = j === 0 ? 0.6 : 0.32 * (1 - j / 6);
                    ctx.fillText(
                        pick(RAIN),
                        r.left + k * FONT_SIZE,
                        r.top + (drops[k] - j) * FONT_SIZE,
                    );
                }
            }
            ctx.restore();
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
    window.addEventListener("resize", fitCanvas);
};
