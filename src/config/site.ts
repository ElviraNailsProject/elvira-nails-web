export const siteHeaderConfig = {
  brand: {
    logo: {
      src: "/logo.svg",
      alt: "Elvira",
      width: 2170,
      height: 725,
      href: "/",
    },

    descriptors: {
      home: "NAIL STUDIO & EDUCATION - LEIDERDORP",

      // Exact Instagram names will be added later.
      services: "",
      training: "",
    },
  },

  navigation: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Training",
      href: "/training",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Book Appointment",
      href: "/book-appointment",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],

  primaryCta: {
    label: "Start Training",
    href: "/training",
  },
} as const;

export const siteHeroConfig = {
  title: "Nails that feel like art",
  subtitle:
    "From soft everyday manicures to advanced training for nail artists — welcome to the studio of Elvira, in the heart of Leiderdorp.",

  background: {
    mobile: "/images/hero-mob-dev.png",
    tablet: "/images/hero-tablet-dev.png",
    desktop: "/images/hero-desktop-dev.png",
  },

  primaryCta: {
    label: "Start Your Training",
    href: "/training",
  },
  secondaryCta: {
    label: "Explore the Course",
    href: "/training",
  },
  tertiaryCta: {
    label: "Book a Manicure / Pedicure",
    href: "/book-appointment",
  },
} as const;
