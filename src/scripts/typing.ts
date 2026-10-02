const TYPE_MS = 62;
const DELETE_MS = 28;
const PAUSE_MS = 1800;

let timer: number | undefined;

const stop = () => {
    if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
    }
};

const start = () => {
    stop();

    const root = document.querySelector<HTMLElement>("[data-typing]");
    const target = root?.querySelector<HTMLElement>("[data-typing-text]");
    if (!root || !target) return;

    let phrases: string[] = [];
    try {
        phrases = JSON.parse(root.dataset.typing ?? "[]");
    } catch {
        return;
    }
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let phrase = 0;
    let chars = 0;
    let deleting = false;

    const step = () => {
        const text = phrases[phrase];
        if (!deleting) {
            chars++;
            if (chars >= text.length) {
                deleting = true;
                target.textContent = text;
                timer = window.setTimeout(step, PAUSE_MS);
                return;
            }
        } else {
            chars--;
            if (chars <= 0) {
                deleting = false;
                phrase = (phrase + 1) % phrases.length;
            }
        }
        target.textContent = text.slice(0, chars);
        timer = window.setTimeout(step, deleting ? DELETE_MS : TYPE_MS);
    };

    step();
};

export const initTyping = () => {
    document.addEventListener("astro:before-swap", stop);
    document.addEventListener("astro:page-load", start);
    start();
};
