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
