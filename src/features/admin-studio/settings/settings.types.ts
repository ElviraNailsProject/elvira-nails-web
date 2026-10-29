export type StudioSocialLink = {
  name: string;
  url: string;
  enabled: boolean;
};

export type StudioSettings = {
  phone: string;
  whatsapp: string;
  customerEmail: string;
  notificationEmail: string;
  hours: string;
  street: string;
  postcode: string;
  city: string;
  directions: string;
  mapUrl: string;
  socials: StudioSocialLink[];
};

export type SettingsTextField = Exclude<keyof StudioSettings, "socials">;
export type SettingsFieldChange = (
  field: SettingsTextField,
  value: string,
) => void;
