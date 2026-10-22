import { portfolioCategories, type PortfolioCategoryId } from "./portfolioCategories";

// Homepage slots are curated independently from the complete archive.
const featuredIds: PortfolioCategoryId[] = [
  "3d-scene", "ai-development", "3d-product-motion", "new-media",
];

export const featuredCategories = featuredIds.flatMap((id) => {
  const category = portfolioCategories.find((item) => item.id === id);
  return category ? [category] : [];
});
