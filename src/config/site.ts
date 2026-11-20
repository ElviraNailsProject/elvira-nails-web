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

export const siteEducationConfig = {
  subtitle: "Education",
  title: "More than a skill.",
  titleAccent: "A profession.",
  firstParagraph:
    "Elvira's training is designed for women who want to do more than learn a technique. It is a complete foundation for working independently — practical knowledge, refined craftsmanship, and the confidence to build your own business.",
  secondParagraph:
    "Every course is one-to-one, unhurried, and centered around your hands. You leave with real skill, a professional starter kit, and continued mentorship as you take on your first clients.",
  primaryCta: {
    label: "View Training Program",
    href: "/training",
  },
  secondaryCta: {
    label: "Meet Elvira →",
    href: "/about",
  },
} as const;

export const siteTheCoreProgramConfig = {
  image: {
    src: "/images/home/theCoreProgram/theCoreProgram.webp",
    alt: "Course training",
  },
  subtitle: "The Core Program",
  title: "Professional Nail Training",
  description:
    "A complete one-to-one program covering manicure, pedicure and the professional practice of running your own studio.",
  checklist: {
    items: [
      "Individual one-to-one training",
      "Manicure and pedicure",
      "Practical hands-on learning",
      "Approximately one month",
      "Beginner-friendly structure",
      "Professional materials included",
      "Post-course support",
      "Certificate of completion",
    ],
    icon: "/icons/check.svg",
  },
  primaryCta: {
    label: "View Training Program",
    href: "/training",
    icon: "/icons/arrow.svg",
  },
} as const;

export const siteWhyElviraConfig = {
  subtitle: "Why Elvira",
  title: "A refined education,",
  titleAccent: "shaped around you.",
  advantages: {
    title: [
      "10+ years of experience",
      "Individual training",
      "Hands-on practice",
      "Professional materials",
      "Support after the course",
    ],
    description: [
      "A decade of professional nail work informs every lesson and every technique taught.",
      "Every course is one-to-one, tailored to your pace, your hands and your goals.",
      "You spend most of the course working with real tools on real hands from day one.",
      "Your starter kit is a curated selection of the same products used in the studio.",
      "Continued guidance while you take your first steps as an independent nail technician.",
    ],
  },
} as const;
