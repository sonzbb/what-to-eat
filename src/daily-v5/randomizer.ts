import type { MainGroup, Recipe } from "./recipes";
import { getSeasonalVegetableIds } from "./seasonal";

export const DRAW_HISTORY_LIMIT = 12;

type SelectionInput = {
  recipes: Recipe[];
  eatenIds: Iterable<string>;
  historyIds: string[];
  candidateIds?: Iterable<string>;
  currentId?: string;
  random?: () => number;
};

export type SelectionResult = {
  recipe: Recipe;
  poolLevel: number;
};

type MealPairInput = {
  recipes: Recipe[];
  eatenIds: Iterable<string>;
  historyIds: string[];
  month?: number;
  avoidProteinGroups?: Iterable<MainGroup>;
  avoidVegetableKeywords?: Iterable<string>;
  random?: () => number;
};

type MealReplacementInput = MealPairInput & {
  role: "protein" | "vegetable";
  excludeIds?: Iterable<string>;
};

type DuelInput = Omit<SelectionInput, "currentId"> & {
  currentId?: string;
};

const SOUP_TECHNIQUES = new Set<Recipe["technique"]>(["老火汤", "快手汤"]);
const STAPLE_TECHNIQUES = new Set<Recipe["technique"]>(["饭面", "粥点"]);
const PROTEIN_GROUPS = new Set<Recipe["mainGroup"]>([
  "鸡禽",
  "鸭鹅",
  "猪肉",
  "牛肉",
  "羊肉",
  "鱼类",
  "虾蟹贝",
]);

export type OpenPotEvent = "dine-out" | "standard";
export type MealRole = "protein" | "vegetable" | "soup";

export function getMealRole(recipe: Recipe): MealRole | null {
  if (SOUP_TECHNIQUES.has(recipe.technique)) return "soup";
  if (recipe.mainGroup === "蔬菜") return "vegetable";
  if (
    PROTEIN_GROUPS.has(recipe.mainGroup) &&
    !STAPLE_TECHNIQUES.has(recipe.technique)
  ) {
    return "protein";
  }
  return null;
}

function pickOne<T>(items: T[], random: () => number): T {
  const value = Math.min(Math.max(random(), 0), 0.999999999);
  return items[Math.floor(value * items.length)];
}

function chooseBalanced(pool: Recipe[], random: () => number): Recipe {
  const groups = [...new Set(pool.map((recipe) => recipe.mainGroup))];
  const group = pickOne(groups, random);
  const groupPool = pool.filter((recipe) => recipe.mainGroup === group);
  const techniques = [...new Set(groupPool.map((recipe) => recipe.technique))];
  const technique = pickOne(techniques, random);
  return pickOne(
    groupPool.filter((recipe) => recipe.technique === technique),
    random,
  );
}

export function selectNextRecipe({
  recipes,
  eatenIds,
  historyIds,
  candidateIds,
  currentId,
  random = Math.random,
}: SelectionInput): SelectionResult | null {
  const eaten = new Set(eatenIds);
  const allowed = candidateIds ? new Set(candidateIds) : null;
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const validHistory = historyIds
    .filter((id) => byId.has(id))
    .slice(-DRAW_HISTORY_LIMIT);
  const newestFirst = validHistory
    .map((id) => byId.get(id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))
    .reverse();
  const historySet = new Set(validHistory);
  const lastThree = new Set(validHistory.slice(-3));
  const lastTwoGroups = new Set(newestFirst.slice(0, 2).map((recipe) => recipe.mainGroup));
  const lastTwoTechniques = new Set(newestFirst.slice(0, 2).map((recipe) => recipe.technique));
  const lastGroup = newestFirst[0]?.mainGroup;
  const lastTechnique = newestFirst[0]?.technique;

  const base = recipes.filter(
    (recipe) =>
      !eaten.has(recipe.id) &&
      recipe.id !== currentId &&
      (!allowed || allowed.has(recipe.id)),
  );
  if (!base.length) return null;

  const levels = [
    base.filter(
      (recipe) =>
        !historySet.has(recipe.id) &&
        !lastTwoGroups.has(recipe.mainGroup) &&
        !lastTwoTechniques.has(recipe.technique),
    ),
    base.filter(
      (recipe) =>
        !historySet.has(recipe.id) &&
        recipe.mainGroup !== lastGroup &&
        recipe.technique !== lastTechnique,
    ),
    base.filter(
      (recipe) => !historySet.has(recipe.id) && recipe.mainGroup !== lastGroup,
    ),
    base.filter((recipe) => !historySet.has(recipe.id)),
    base.filter(
      (recipe) => !lastThree.has(recipe.id) && recipe.mainGroup !== lastGroup,
    ),
    base,
  ];

  const poolLevel = levels.findIndex((pool) => pool.length > 0);
  const pool = levels[poolLevel];
  return {
    recipe: chooseBalanced(pool, random),
    poolLevel,
  };
}

export function selectDuelRecipes({
  recipes,
  eatenIds,
  historyIds,
  currentId,
  random = Math.random,
}: DuelInput): [Recipe, Recipe] | null {
  const eaten = new Set(eatenIds);
  const first = selectNextRecipe({
    recipes,
    eatenIds: eaten,
    historyIds,
    candidateIds: recipes
      .filter((recipe) => getMealRole(recipe) === "protein")
      .map((recipe) => recipe.id),
    currentId,
    random,
  });
  if (!first) return null;

  const available = recipes.filter(
    (recipe) =>
      !eaten.has(recipe.id) &&
      recipe.id !== currentId &&
      recipe.id !== first.recipe.id &&
      getMealRole(recipe) === "protein",
  );
  const contrasting = available.filter(
    (recipe) =>
      recipe.mainGroup !== first.recipe.mainGroup &&
      recipe.technique !== first.recipe.technique,
  );
  const second = selectNextRecipe({
    recipes,
    eatenIds: [],
    historyIds: [...historyIds, first.recipe.id],
    candidateIds: (contrasting.length ? contrasting : available).map(
      (recipe) => recipe.id,
    ),
    random,
  });

  return second ? [first.recipe, second.recipe] : null;
}

function selectRoleRecipe({
  recipes,
  eatenIds,
  historyIds,
  role,
  excludeIds = [],
  month,
  avoidProteinGroups = [],
  avoidVegetableKeywords = [],
  random = Math.random,
}: MealReplacementInput): Recipe | null {
  const excluded = new Set([...eatenIds, ...excludeIds]);
  const avoidedGroups = new Set(avoidProteinGroups);
  const avoidedVegetables = [...avoidVegetableKeywords];
  const roleCandidates = recipes.filter(
    (recipe) => getMealRole(recipe) === role,
  );
  const compatibleCandidates =
    role === "protein"
      ? roleCandidates.filter((recipe) => !avoidedGroups.has(recipe.mainGroup))
      : role === "vegetable"
        ? roleCandidates.filter((recipe) => {
            const content = [recipe.name, ...(recipe.ingredients ?? [])].join("、");
            return avoidedVegetables.every((keyword) => !content.includes(keyword));
          })
        : roleCandidates;
  const classicCandidates = roleCandidates.filter((recipe) => {
    if (recipe.cuisine === "其他家常" || recipe.technique === "家常") return false;
    return true;
  });
  const seasonalIds =
    role === "vegetable" && month
      ? new Set(getSeasonalVegetableIds(recipes, month))
      : new Set<string>();
  const seasonalCandidates = compatibleCandidates.filter((recipe) =>
    seasonalIds.has(recipe.id),
  );
  const compatibleClassicCandidates = classicCandidates.filter((recipe) =>
    compatibleCandidates.includes(recipe),
  );

  for (const candidates of [
    seasonalCandidates,
    compatibleClassicCandidates,
    compatibleCandidates,
    classicCandidates,
    roleCandidates,
  ]) {
    if (!candidates.length) continue;
    const selection = selectNextRecipe({
      recipes,
      eatenIds: excluded,
      historyIds,
      candidateIds: candidates.map((recipe) => recipe.id),
      random,
    });
    if (selection) return selection.recipe;
  }

  return null;
}

export function selectMealReplacement(
  input: MealReplacementInput,
): Recipe | null {
  return selectRoleRecipe(input);
}

export function selectClassicMealPair({
  recipes,
  eatenIds,
  historyIds,
  month,
  avoidProteinGroups,
  avoidVegetableKeywords,
  random = Math.random,
}: MealPairInput): [Recipe, Recipe] | null {
  const protein = selectRoleRecipe({
    recipes,
    eatenIds,
    historyIds,
    role: "protein",
    avoidProteinGroups,
    random,
  });
  if (!protein) return null;

  const vegetable = selectRoleRecipe({
    recipes,
    eatenIds,
    historyIds: [...historyIds, protein.id],
    role: "vegetable",
    excludeIds: [protein.id],
    month,
    avoidVegetableKeywords,
    random,
  });

  return vegetable ? [protein, vegetable] : null;
}

export function selectSoupReward({
  recipes,
  eatenIds,
  historyIds,
  random = Math.random,
}: MealPairInput): Recipe | null {
  const selection = selectNextRecipe({
    recipes,
    eatenIds,
    historyIds,
    candidateIds: recipes
      .filter((recipe) => getMealRole(recipe) === "soup")
      .map((recipe) => recipe.id),
    random,
  });
  return selection?.recipe ?? null;
}

export function selectOpenPotEvent(random: () => number = Math.random): OpenPotEvent {
  const value = Math.min(Math.max(random(), 0), 0.999999999);
  if (value < 0.08) return "dine-out";
  return "standard";
}
