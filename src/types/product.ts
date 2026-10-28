export type Category =
  | "刀・剣"
  | "鬼の面"
  | "置物・フィギュア"
  | "インテリア雑貨"
  | "装飾品";
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  gallery: string[];
  imageIndex: number;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  supports3D: boolean;
  model3DUrl?: string;
  specifications: Record<string, string>;
}
