import imageManifest from "../public/recipe-images/manifest.json";

export type RecipeImage = {
  src: string;
  alt: string;
};

const RECIPE_IMAGES = Object.fromEntries(
  imageManifest
    .filter((item) => item.imageStatus === "approved")
    .map((item) => [
      item.id,
      {
        src: `/recipe-images/${item.imageFile}`,
        alt: `Q版${item.name}插画`,
      },
    ]),
) as Record<string, RecipeImage>;

export function getRecipeImage(id: string): RecipeImage | undefined {
  return RECIPE_IMAGES[id];
}
