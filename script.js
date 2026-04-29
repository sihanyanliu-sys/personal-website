const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const caseCards = document.querySelectorAll(".case-card");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const closeLightbox = document.querySelector(".lightbox-close");
const heroBoard = document.querySelector(".hero-board");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

caseCards.forEach((card) => {
  const button = card.querySelector(".case-top");
  button.addEventListener("click", () => {
    const isOpen = card.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

document.querySelectorAll(".image-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const image = trigger.dataset.img;
    const caption = trigger.dataset.caption || trigger.querySelector("img")?.alt || "";
    lightboxImg.src = image;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

const hideLightbox = () => {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
};

closeLightbox.addEventListener("click", hideLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    hideLightbox();
  }
});

if (heroBoard) {
  heroBoard.addEventListener("pointermove", (event) => {
    const rect = heroBoard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroBoard.querySelectorAll(".floating-card").forEach((card, index) => {
      const depth = (index + 1) * 8;
      card.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });

  heroBoard.addEventListener("pointerleave", () => {
    heroBoard.querySelectorAll(".floating-card").forEach((card) => {
      card.style.translate = "0 0";
    });
  });
}
