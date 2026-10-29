import type { GalleryPhoto } from "./gallery.types";

export const initialPhotos: GalleryPhoto[] = [
  ["Маникюр", "#e9d9cc"],
  ["Дизайн", "#e6d5d1"],
  ["Наращивание", "#e0d8ca"],
  ["Маникюр", "#dce0d6"],
  ["Работы учениц", "#e8e0d7"],
  ["Педикюр", "#e4dad6"],
  ["Дизайн", "#e9d9cc"],
  ["Наращивание", "#e6d5d1"],
  ["Маникюр", "#e0d8ca"],
  ["Работы учениц", "#dce0d6"],
  ["Дизайн", "#e8e0d7"],
].map(([category, color], index) => ({
  id: `example-${index + 1}`,
  name: `rabota-${index + 1}.jpg`,
  category,
  color,
  alt: `${category} — работа студии Elvira`,
  onHome: index < 6,
  width: 1080,
  height: 1080,
}));
