export type Promotion = {
  id: string;
  name: string;
  category: string;
  start: string;
  end: string;
  visible: boolean;
  autoHide: boolean;
  href: string;
  order: number;
  alt: string;
  code: string;
  discount: number;
  color: string;
  image?: string;
  fileName: string;
  fileInfo: string;
};

export type PromotionFilter = "all" | "active" | "scheduled" | "hidden";
export type PromotionStatus = Exclude<PromotionFilter, "all">;
