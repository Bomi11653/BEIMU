import {
  portfolioCategories,
  type PortfolioCategoryId,
  type PortfolioPreview,
} from "./portfolioCategories";

export type CapabilityId = PortfolioCategoryId;

export type CapabilityPlaceholder = {
  id: string;
  kind: "placeholder";
  objectPosition?: string;
};

export type CapabilityMedia = PortfolioPreview | CapabilityPlaceholder;

export type Capability = {
  id: CapabilityId;
  index: string;
  label: string;
  media: CapabilityMedia[];
};

export const capabilities: Capability[] = portfolioCategories.map(
  (category) => ({
    id: category.id,
    index: category.index,
    label: category.labelZh,
    media:
      category.previewMedia.length > 0
        ? category.previewMedia
        : [
            {
              id: `${category.id}-awaiting-asset`,
              kind: "placeholder" as const,
            },
          ],
  }),
);
