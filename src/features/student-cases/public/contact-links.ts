import type { PublicStudentCaseDto } from "../contracts";

type Contact = PublicStudentCaseDto["contacts"][number];

function profileHandle(value: string, hosts: string[]): string | null {
  if (value.startsWith("https://")) {
    try {
      const url = new URL(value);
      if (
        !hosts.includes(url.hostname) ||
        url.username ||
        url.password ||
        url.port ||
        url.search ||
        url.hash
      )
        return null;
      return url.pathname.replace(/^\/@?/, "").replace(/\/$/, "");
    } catch {
      return null;
    }
  }
  return value.replace(/^@/, "");
}

/** Construct links from validated contact values, never accept an arbitrary protocol. */
export function publicContactHref(contact: Contact): string | null {
  const value = contact.value.trim();
  if (/\p{Cc}/u.test(value)) return null;
  switch (contact.type) {
    case "WEBSITE": {
      try {
        const url = new URL(value);
        return url.protocol === "https:" && !url.username && !url.password
          ? url.href
          : null;
      } catch {
        return null;
      }
    }
    case "EMAIL": {
      if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)) return null;
      const [local, domain] = value.split("@");
      return `mailto:${encodeURIComponent(local)}@${domain}`;
    }
    case "WHATSAPP": {
      const phone = value.replace(/[\s()+.-]/g, "");
      return /^\d{7,15}$/.test(phone) ? `https://wa.me/${phone}` : null;
    }
    case "TELEGRAM": {
      const handle = profileHandle(value, ["t.me", "telegram.me"]);
      if (handle && /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(handle))
        return `https://t.me/${handle}`;
      const phone = value.replace(/[\s()-]/g, "");
      return /^\+\d{7,15}$/.test(phone) ? `https://t.me/${phone}` : null;
    }
    case "INSTAGRAM": {
      const handle = profileHandle(value, [
        "instagram.com",
        "www.instagram.com",
      ]);
      return handle && /^[A-Za-z0-9._]{1,30}$/.test(handle)
        ? `https://www.instagram.com/${handle}/`
        : null;
    }
    case "TIKTOK": {
      const handle = profileHandle(value, ["tiktok.com", "www.tiktok.com"]);
      return handle && /^[A-Za-z0-9._]{2,24}$/.test(handle)
        ? `https://www.tiktok.com/@${handle}`
        : null;
    }
  }
}
