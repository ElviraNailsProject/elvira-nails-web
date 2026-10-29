export type Category = "Маникюр" | "Педикюр" | "Наращивание" | "Дизайн";
export type AddOn = {
  id: string;
  title: string;
  price: number;
  minutes: number;
};
export type Service = {
  id: string;
  title: string;
  category: Category;
  price: number;
  minutes: number;
  description: string;
  visible: boolean;
  color: string;
  image?: string;
  imageName?: string;
  addOns: AddOn[];
};
