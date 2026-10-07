// Swiper core + the two modules the certificates gallery uses. Loaded with a
// dynamic import from `certificatesGallery`, so it is a separate chunk.

import { register } from "swiper/element";
import { Keyboard, Navigation } from "swiper/modules";

register();

export const initCertificatesSwiper = (swiperEl: HTMLElement) => {
    const section = swiperEl.closest("section");
    const prevEl = section?.querySelector("[data-carousel-prev]");
    const nextEl = section?.querySelector("[data-carousel-next]");

    Object.assign(swiperEl, {
        modules: [Keyboard, Navigation],
        slidesPerView: "auto",
        spaceBetween: 12,
        grabCursor: true,
        keyboard: { enabled: true },
        navigation: prevEl && nextEl ? { prevEl, nextEl } : false,
    });
    (swiperEl as HTMLElement & { initialize: () => void }).initialize();
};
