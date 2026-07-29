import { useMemo, useState } from "react";
import { RECIPES as DAILY_RECIPES, type Recipe as DailyRecipe } from "./daily-v5/recipes";
import {
  selectClassicMealPair,
  selectMealReplacement,
  selectOpenPotEvent,
} from "./daily-v5/randomizer";
import {
  getDailySeasonalFruit,
  getDailySeasonalSoup,
  getSoupProduceKeywords,
  getSoupProteinGroup,
  type SeasonalFruit,
} from "./daily-v5/seasonal";
import { getRecipeImage } from "./recipe-images";

type Goal = "cut" | "gain" | "recovery";
type Mode = "daily" | "fitness";
type Role = "protein" | "vegetable" | "staple" | "dairy";

type Nutrition = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type FitnessRecipe = {
  id: string;
  role: Role;
  name: string;
  note: string;
  time: string;
  servings: number;
  targets: Goal[];
  nutrition: Nutrition;
  ingredients: string[];
  steps: string[];
};

type DailyMeal = {
  protein: DailyRecipe;
  vegetable: DailyRecipe;
  soup: DailyRecipe;
  fruit: SeasonalFruit;
};

type DisplayMealItem = {
  id: string;
  key: string;
  label: string;
  name: string;
  note: string;
  time: string;
  ingredients: string[];
  steps: string[];
  fitnessRole?: Role;
  dailyRole?: "protein" | "vegetable";
  nutrition?: Nutrition;
};

type DiningOutOption = {
  id: string;
  name: string;
  order: string;
  note: string;
};

type MealSnapshot =
  | {
      mode: "fitness";
      goal: Goal;
      drawIndex: number;
      slotOffsets: Record<Role, number>;
    }
  | {
      mode: "daily";
      dailyMeal: DailyMeal;
      diningOut: DiningOutOption | null;
    };

const GOALS: Record<Goal, { label: string; title: string }> = {
  cut: {
    label: "减脂保肌",
    title: "今晚训练餐",
  },
  gain: {
    label: "增肌充能",
    title: "今晚增肌餐",
  },
  recovery: {
    label: "训练恢复",
    title: "今晚恢复餐",
  },
};

const FITNESS_GOALS: Goal[] = ["cut", "gain"];

const MODES: Record<Mode, { label: string }> = {
  daily: {
    label: "日常",
  },
  fitness: {
    label: "健身",
  },
};

const ROLE_LABELS: Record<Role, string> = {
  protein: "蛋白主菜",
  vegetable: "时蔬",
  staple: "主食",
  dairy: "奶及替代",
};

const DINING_OUT_OPTIONS: DiningOutOption[] = [
  { id: "cha-chaan-teng", name: "港式茶餐厅", order: "干炒牛河、菠萝油、冻柠茶", note: "想吃得丰富又不必等太久，茶餐厅最稳。" },
  { id: "beef-hotpot", name: "潮汕牛肉火锅", order: "吊龙、匙柄、胸口朥、粿条", note: "今晚适合约人一起吃，鲜切牛肉涮几秒就开动。" },
  { id: "roast-meat", name: "广式烧腊饭", order: "叉烧拼烧鸭、油菜、例汤", note: "一个人也好点，想快点吃上饭就选它。" },
  { id: "dim-sum", name: "粤式早茶", order: "虾饺、烧卖、凤爪、肠粉", note: "不赶时间的时候，多点几笼慢慢吃。" },
  { id: "claypot-rice", name: "煲仔饭小店", order: "腊味煲仔饭、窝蛋牛肉煲仔饭", note: "锅巴焦香、酱油够味，适合想吃得满足的晚上。" },
  { id: "seafood-stall", name: "海鲜大排档", order: "豉椒炒花甲、椒盐濑尿虾、炒时蔬", note: "适合两三个人分享，点菜时也别忘了补一碟青菜。" },
  { id: "congee", name: "潮汕砂锅粥", order: "鲜虾蟹粥、普宁豆腐、卤水拼盘", note: "想吃热乎又清鲜，今晚就去喝一锅粥。" },
  { id: "wonton-noodles", name: "竹升面小店", order: "鲜虾云吞面、牛腩捞面、油菜", note: "一碗面就能解决，清爽、直接、不费脑筋。" },
];

const RECIPES: FitnessRecipe[] = [
  {
    id: "ginger-chicken-thigh",
    role: "protein",
    name: "姜葱香煎鸡腿肉",
    note: "去皮鸡腿更嫩，少油煎熟后再拌姜葱。",
    time: "25 分钟",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 245, protein: 34, carbs: 7, fat: 9, fiber: 1 },
    ingredients: ["去皮鸡腿肉 320 克", "姜 15 克", "葱 2 根", "低钠生抽 2 茶匙", "食用油 1 茶匙", "黑胡椒适量"],
    steps: ["鸡腿肉去皮切大块，用生抽和黑胡椒腌 10 分钟。", "不粘锅放油，中火将鸡肉两面煎熟。", "加入姜末和葱段快速翻匀，关火装盘。"],
  },
  {
    id: "steamed-cod-tofu",
    role: "protein",
    name: "清蒸鳕鱼豆腐",
    note: "鱼和豆腐共同提供蛋白质，口味清淡。",
    time: "18 分钟",
    servings: 2,
    targets: ["cut", "recovery"],
    nutrition: { kcal: 228, protein: 31, carbs: 8, fat: 8, fiber: 2 },
    ingredients: ["鳕鱼柳 260 克", "北豆腐 200 克", "姜丝 10 克", "葱 1 根", "低钠生抽 2 茶匙", "香油半茶匙"],
    steps: ["豆腐切片铺盘，放上鳕鱼和姜丝。", "水开后大火蒸 8 至 10 分钟，确认鱼肉熟透。", "倒去多余蒸汁，淋生抽和香油，撒葱花。"],
  },
  {
    id: "beef-mushroom",
    role: "protein",
    name: "黑椒牛肉炒口蘑",
    note: "瘦牛肉搭配菌菇，适合训练日正餐。",
    time: "22 分钟",
    servings: 2,
    targets: ["gain", "recovery"],
    nutrition: { kcal: 286, protein: 32, carbs: 13, fat: 12, fiber: 3 },
    ingredients: ["牛里脊 280 克", "口蘑 220 克", "彩椒 100 克", "低钠生抽 2 茶匙", "食用油 1 茶匙", "黑胡椒适量"],
    steps: ["牛肉逆纹切片，用一半生抽腌 10 分钟。", "热锅放油，牛肉快速炒至变色后盛出。", "炒软口蘑和彩椒，倒回牛肉，以余下生抽和黑胡椒调味。"],
  },
  {
    id: "tomato-shrimp-egg",
    role: "protein",
    name: "番茄虾仁滑蛋",
    note: "虾仁、鸡蛋和番茄组成快手训练餐主菜。",
    time: "16 分钟",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 258, protein: 29, carbs: 11, fat: 11, fiber: 2 },
    ingredients: ["去壳虾仁 220 克", "鸡蛋 3 个", "番茄 300 克", "食用油 1 茶匙", "盐 1 克", "葱花适量"],
    steps: ["虾仁吸干水分，番茄切块，鸡蛋打散。", "锅中放一半油，将虾仁炒熟后盛出。", "余油炒软番茄，倒入蛋液和虾仁，轻推至蛋液凝固。"],
  },
  {
    id: "soy-pumpkin-chicken",
    role: "protein",
    name: "南瓜豆豉蒸鸡胸",
    note: "鸡胸和南瓜同蒸，保留训练所需碳水。",
    time: "28 分钟",
    servings: 2,
    targets: ["cut", "gain"],
    nutrition: { kcal: 270, protein: 35, carbs: 20, fat: 6, fiber: 4 },
    ingredients: ["鸡胸肉 320 克", "南瓜 300 克", "豆豉 1 茶匙", "蒜 2 瓣", "低钠生抽 2 茶匙", "淀粉 1 茶匙"],
    steps: ["鸡胸切片，与豆豉、蒜、生抽和淀粉抓匀。", "南瓜切片铺盘，鸡肉平码在上面。", "水开后蒸 12 至 14 分钟，确认鸡肉熟透。"],
  },
  {
    id: "salmon-mushroom",
    role: "protein",
    name: "柠香三文鱼烤菌菇",
    note: "脂肪稍高，适合需要更多能量的训练日。",
    time: "25 分钟",
    servings: 2,
    targets: ["gain", "recovery"],
    nutrition: { kcal: 315, protein: 30, carbs: 8, fat: 18, fiber: 3 },
    ingredients: ["三文鱼 280 克", "海鲜菇 200 克", "柠檬半个", "食用油半茶匙", "黑胡椒适量", "盐 1 克"],
    steps: ["烤箱预热至 200℃，菌菇铺入烤盘。", "三文鱼放在菌菇上，抹油、盐和黑胡椒。", "烤 12 至 15 分钟，出炉后挤柠檬汁。"],
  },
  {
    id: "garlic-broccoli",
    role: "vegetable",
    name: "蒜蓉西兰花",
    note: "先焯后炒，控制用油并保留脆嫩口感。",
    time: "10 分钟",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 88, protein: 5, carbs: 11, fat: 4, fiber: 5 },
    ingredients: ["西兰花 400 克", "蒜 3 瓣", "食用油 1 茶匙", "盐 1 克"],
    steps: ["西兰花切小朵，沸水焯 60 至 90 秒后沥干。", "锅中放油，小火炒香蒜末。", "倒入西兰花大火翻匀，以盐调味。"],
  },
  {
    id: "spinach-mushroom",
    role: "vegetable",
    name: "菠菜炒口蘑",
    note: "深色叶菜搭配菌菇，清爽不寡淡。",
    time: "12 分钟",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 92, protein: 6, carbs: 10, fat: 4, fiber: 4 },
    ingredients: ["菠菜 350 克", "口蘑 180 克", "蒜 2 瓣", "食用油 1 茶匙", "盐 1 克"],
    steps: ["菠菜洗净切段，口蘑切片。", "热锅放油，先炒口蘑至出香。", "加入蒜末和菠菜，快速炒至菠菜刚变软。"],
  },
  {
    id: "cabbage-wood-ear",
    role: "vegetable",
    name: "包菜木耳小炒",
    note: "高纤维、耐储存，适合日常备餐。",
    time: "13 分钟",
    servings: 2,
    targets: ["cut", "gain"],
    nutrition: { kcal: 78, protein: 3, carbs: 12, fat: 3, fiber: 4 },
    ingredients: ["包菜 380 克", "泡发木耳 100 克", "蒜 2 瓣", "食用油 1 茶匙", "米醋 1 茶匙", "盐 1 克"],
    steps: ["包菜撕小片，木耳去硬根。", "锅中放油炒香蒜末，加入木耳翻炒。", "放包菜大火炒至断生，沿锅边淋米醋。"],
  },
  {
    id: "pepper-sprouts",
    role: "vegetable",
    name: "彩椒豆芽",
    note: "快炒蔬菜，适合搭配较浓味的蛋白主菜。",
    time: "9 分钟",
    servings: 2,
    targets: ["cut", "recovery"],
    nutrition: { kcal: 86, protein: 5, carbs: 12, fat: 3, fiber: 4 },
    ingredients: ["绿豆芽 300 克", "红黄彩椒 180 克", "葱 1 根", "食用油 1 茶匙", "盐 1 克"],
    steps: ["豆芽洗净沥干，彩椒切丝。", "热锅放油，先炒彩椒 1 分钟。", "加入豆芽和葱段，大火炒至刚熟。"],
  },
  {
    id: "mixed-grain-rice",
    role: "staple",
    name: "杂粮饭",
    note: "大米加入糙米和燕麦米，每人约 120 克熟饭。",
    time: "35 分钟",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 175, protein: 4, carbs: 37, fat: 1, fiber: 3 },
    ingredients: ["大米 80 克", "糙米 40 克", "燕麦米 30 克", "清水适量"],
    steps: ["糙米和燕麦米提前浸泡 30 分钟。", "与大米淘洗后放入电饭锅。", "按杂粮饭水量煮熟，焖 10 分钟再打散。"],
  },
  {
    id: "sweet-potato-oat-rice",
    role: "staple",
    name: "红薯燕麦饭",
    note: "训练日增加一份容易准备的复合碳水。",
    time: "32 分钟",
    servings: 2,
    targets: ["gain", "recovery"],
    nutrition: { kcal: 210, protein: 5, carbs: 44, fat: 2, fiber: 5 },
    ingredients: ["大米 100 克", "燕麦米 30 克", "红薯 220 克", "清水适量"],
    steps: ["红薯去皮切 2 厘米块。", "大米和燕麦米洗净，加水后铺上红薯。", "按正常煮饭程序完成，食用前拌匀。"],
  },
  {
    id: "corn-yam-rice",
    role: "staple",
    name: "玉米山药饭",
    note: "谷薯搭配，适合不喜欢粗糙杂粮口感的人。",
    time: "35 分钟",
    servings: 2,
    targets: ["cut", "gain"],
    nutrition: { kcal: 205, protein: 5, carbs: 43, fat: 2, fiber: 4 },
    ingredients: ["大米 110 克", "鲜玉米粒 100 克", "山药 180 克", "清水适量"],
    steps: ["山药戴手套去皮切小块。", "大米洗净，与玉米和山药一同入锅。", "按正常水量煮熟，焖 10 分钟。"],
  },
  {
    id: "buckwheat-noodles",
    role: "staple",
    name: "荞麦拌面",
    note: "适合需要快速补充碳水的训练后正餐。",
    time: "12 分钟",
    servings: 2,
    targets: ["gain", "recovery"],
    nutrition: { kcal: 230, protein: 9, carbs: 45, fat: 2, fiber: 6 },
    ingredients: ["荞麦面 160 克", "低钠生抽 2 茶匙", "米醋 2 茶匙", "葱花适量", "芝麻 1 茶匙"],
    steps: ["荞麦面按包装时间煮熟。", "捞出后以温水快速冲散并沥干。", "拌入生抽、米醋、葱花和芝麻。"],
  },
  {
    id: "plain-yogurt",
    role: "dairy",
    name: "无糖高蛋白酸奶",
    note: "选择原味、低添加糖产品，每人约 150 克。",
    time: "即食",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 105, protein: 10, carbs: 11, fat: 2, fiber: 0 },
    ingredients: ["原味无糖高蛋白酸奶 300 克"],
    steps: ["冷藏保存。", "分成两份直接食用，不额外加糖。"],
  },
  {
    id: "low-fat-milk",
    role: "dairy",
    name: "低脂牛奶",
    note: "每人一杯，乳糖不耐受者选低乳糖产品。",
    time: "即饮",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 120, protein: 9, carbs: 12, fat: 4, fiber: 0 },
    ingredients: ["低脂或低乳糖牛奶 500 毫升"],
    steps: ["按个人习惯冷饮或温热。", "加热时不要长时间沸腾。"],
  },
  {
    id: "banana-yogurt",
    role: "dairy",
    name: "香蕉酸奶杯",
    note: "训练后需要更多碳水时选择，不额外加糖。",
    time: "5 分钟",
    servings: 2,
    targets: ["gain", "recovery"],
    nutrition: { kcal: 170, protein: 10, carbs: 32, fat: 2, fiber: 3 },
    ingredients: ["原味无糖酸奶 300 克", "香蕉 1 根（约 120 克）", "即食燕麦 20 克"],
    steps: ["香蕉切片。", "酸奶分杯，加入香蕉和燕麦。", "拌匀后尽快食用。"],
  },
  {
    id: "fortified-soy",
    role: "dairy",
    name: "无糖强化豆奶",
    note: "不喝奶时选择含钙强化、无添加糖的豆奶。",
    time: "即饮",
    servings: 2,
    targets: ["cut", "gain", "recovery"],
    nutrition: { kcal: 110, protein: 9, carbs: 10, fat: 4, fiber: 1 },
    ingredients: ["无糖含钙强化豆奶 500 毫升"],
    steps: ["饮用前摇匀。", "按个人习惯冷饮或温热。"],
  },
];

function sumNutrition(recipes: FitnessRecipe[]): Nutrition {
  return recipes.reduce(
    (total, recipe) => ({
      kcal: total.kcal + recipe.nutrition.kcal,
      protein: total.protein + recipe.nutrition.protein,
      carbs: total.carbs + recipe.nutrition.carbs,
      fat: total.fat + recipe.nutrition.fat,
      fiber: total.fiber + recipe.nutrition.fiber,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}

function pickRecipe(goal: Goal, role: Role, index: number) {
  const pool = RECIPES.filter(
    (recipe) => recipe.role === role && recipe.targets.includes(goal),
  );
  return pool[index % pool.length];
}

const ROLES: Role[] = ["protein", "vegetable", "staple", "dairy"];

function createDailyMeal(previous?: DailyMeal): DailyMeal {
  const today = new Date();
  const soup = getDailySeasonalSoup(
    DAILY_RECIPES,
    today,
    Math.random,
    previous?.soup.id,
  );
  const pair = selectClassicMealPair({
    recipes: DAILY_RECIPES,
    eatenIds: previous ? [previous.protein.id, previous.vegetable.id] : [],
    historyIds: previous ? [previous.protein.id, previous.vegetable.id] : [],
    month: today.getMonth() + 1,
    avoidProteinGroups: [getSoupProteinGroup(soup)].filter(
      (group): group is DailyRecipe["mainGroup"] => Boolean(group),
    ),
    avoidVegetableKeywords: getSoupProduceKeywords(soup),
  });

  if (!pair || !soup) {
    throw new Error("日常菜谱无法配齐一荤一素和汤水。");
  }

  return {
    protein: pair[0],
    vegetable: pair[1],
    soup,
    fruit: getDailySeasonalFruit(today, Math.random, previous?.fruit.id),
  };
}

export default function Prototype() {
  const [mode, setMode] = useState<Mode>("fitness");
  const [dailyMeal, setDailyMeal] = useState<DailyMeal>(() => createDailyMeal());
  const [diningOut, setDiningOut] = useState<DiningOutOption | null>(null);
  const [goal, setGoal] = useState<Goal>("cut");
  const [drawIndex, setDrawIndex] = useState(0);
  const [slotOffsets, setSlotOffsets] = useState<Record<Role, number>>({
    protein: 0,
    vegetable: 0,
    staple: 0,
    dairy: 0,
  });
  const [modeOpen, setModeOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [openRecipeKey, setOpenRecipeKey] = useState<string | null>(null);
  const [pastMeals, setPastMeals] = useState<MealSnapshot[]>([]);
  const [futureMeals, setFutureMeals] = useState<MealSnapshot[]>([]);

  const meal = useMemo(
    () =>
      ROLES.map((role, roleIndex) =>
        pickRecipe(goal, role, drawIndex + roleIndex + slotOffsets[role]),
      ),
    [drawIndex, goal, slotOffsets],
  );
  const nutrition = sumNutrition(meal);
  const goalCopy = GOALS[goal];
  const isFitness = mode === "fitness";
  const mealCopy = isFitness
    ? goalCopy
    : {
        title: "今晚家常饭",
      };
  const displayMeal: DisplayMealItem[] = isFitness
    ? meal.map((recipe) => ({
        id: recipe.id,
        key: recipe.role,
        label: ROLE_LABELS[recipe.role],
        name: recipe.name,
        note: recipe.note,
        time: recipe.time,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        fitnessRole: recipe.role,
        nutrition: recipe.nutrition,
      }))
    : [
        {
          id: dailyMeal.protein.id,
          key: "daily-protein",
          label: "荤菜",
          name: dailyMeal.protein.name,
          note: dailyMeal.protein.note,
          time: dailyMeal.protein.time,
          ingredients: dailyMeal.protein.ingredients,
          steps: dailyMeal.protein.steps,
          dailyRole: "protein",
        },
        {
          id: dailyMeal.vegetable.id,
          key: "daily-vegetable",
          label: "时蔬",
          name: dailyMeal.vegetable.name,
          note: dailyMeal.vegetable.note,
          time: dailyMeal.vegetable.time,
          ingredients: dailyMeal.vegetable.ingredients,
          steps: dailyMeal.vegetable.steps,
          dailyRole: "vegetable",
        },
        {
          id: dailyMeal.soup.id,
          key: "daily-soup",
          label: "汤水",
          name: dailyMeal.soup.name,
          note: dailyMeal.soup.note,
          time: dailyMeal.soup.time,
          ingredients: dailyMeal.soup.ingredients,
          steps: dailyMeal.soup.steps,
        },
        {
          id: dailyMeal.fruit.id,
          key: "daily-fruit",
          label: "水果",
          name: dailyMeal.fruit.name,
          note: dailyMeal.fruit.note,
          time: "即食",
          ingredients: [`${dailyMeal.fruit.name} 适量`],
          steps: [dailyMeal.fruit.note],
        },
      ];

  function getCurrentMealSnapshot(): MealSnapshot {
    return isFitness
      ? { mode: "fitness", goal, drawIndex, slotOffsets }
      : { mode: "daily", dailyMeal, diningOut };
  }

  function rememberCurrentMeal() {
    const snapshot = getCurrentMealSnapshot();
    setPastMeals((items) => [...items, snapshot].slice(-3));
    setFutureMeals([]);
    setOpenRecipeKey(null);
  }

  function applyMealSnapshot(snapshot: MealSnapshot) {
    setMode(snapshot.mode);
    setModeOpen(false);
    setOpenRecipeKey(null);

    if (snapshot.mode === "fitness") {
      setGoal(snapshot.goal);
      setDrawIndex(snapshot.drawIndex);
      setSlotOffsets(snapshot.slotOffsets);
      return;
    }

    setDailyMeal(snapshot.dailyMeal);
    setDiningOut(snapshot.diningOut);
  }

  function showPreviousMeal() {
    const previous = pastMeals[pastMeals.length - 1];
    if (!previous) return;

    setFutureMeals((items) => [...items, getCurrentMealSnapshot()].slice(-3));
    setPastMeals((items) => items.slice(0, -1));
    applyMealSnapshot(previous);
    setNotice("已翻回上一组搭配。");
  }

  function showNextMeal() {
    const next = futureMeals[futureMeals.length - 1];
    if (!next) return;

    setPastMeals((items) => [...items, getCurrentMealSnapshot()].slice(-3));
    setFutureMeals((items) => items.slice(0, -1));
    applyMealSnapshot(next);
    setNotice("已翻到下一组搭配。");
  }

  function redrawMeal() {
    rememberCurrentMeal();
    if (!isFitness) {
      if (selectOpenPotEvent() === "dine-out") {
        const options = DINING_OUT_OPTIONS.filter((item) => item.id !== diningOut?.id);
        setDiningOut(options[Math.floor(Math.random() * options.length)]);
        setNotice("翻到隐藏彩蛋：今晚出去小搓一顿。");
        return;
      }
      setDiningOut(null);
      setDailyMeal((current) => createDailyMeal(current));
      setNotice("已重新抽取一荤一素、汤水和水果。");
      return;
    }
    setDrawIndex((value) => value + 1);
    setSlotOffsets({ protein: 0, vegetable: 0, staple: 0, dairy: 0 });
    setNotice(`整桌已重开：已换成另一套${GOALS[goal].label}训练餐。`);
  }

  function replaceRecipe(role: Role) {
    const roleIndex = ROLES.indexOf(role);
    const current = meal[roleIndex];
    const replacement = pickRecipe(
      goal,
      role,
      drawIndex + roleIndex + slotOffsets[role] + 1,
    );
    rememberCurrentMeal();
    setSlotOffsets((value) => ({ ...value, [role]: value[role] + 1 }));
    setNotice(`已将「${current.name}」换成「${replacement.name}」，其他三项保留。`);
  }

  function replaceDailyRecipe(role: "protein" | "vegetable") {
    const current = dailyMeal[role];
    const replacement = selectMealReplacement({
      recipes: DAILY_RECIPES,
      eatenIds: [],
      historyIds: [current.id],
      role,
      month: new Date().getMonth() + 1,
      avoidProteinGroups:
        role === "protein"
          ? [getSoupProteinGroup(dailyMeal.soup)].filter(
              (group): group is DailyRecipe["mainGroup"] => Boolean(group),
            )
          : [],
      avoidVegetableKeywords:
        role === "vegetable" ? getSoupProduceKeywords(dailyMeal.soup) : [],
      excludeIds: [
        dailyMeal.protein.id,
        dailyMeal.vegetable.id,
        dailyMeal.soup.id,
      ],
    });

    if (!replacement) return;
    rememberCurrentMeal();
    setDailyMeal((value) => ({ ...value, [role]: replacement }));
    setNotice(`已将「${current.name}」换成「${replacement.name}」，其他三项保留。`);
  }

  function drawDailyMealWithoutEvent() {
    rememberCurrentMeal();
    setDiningOut(null);
    setDailyMeal((current) => createDailyMeal(current));
    setNotice("已返回在家做饭，并重新搭配今晚菜单。");
  }

  function replaceDiningOut() {
    rememberCurrentMeal();
    const options = DINING_OUT_OPTIONS.filter((item) => item.id !== diningOut?.id);
    const replacement = options[Math.floor(Math.random() * options.length)];
    setDiningOut(replacement);
    setNotice(`外食盲盒已换成「${replacement.name}」。`);
  }

  function selectGoal(nextGoal: Goal) {
    if (nextGoal === goal) {
      setModeOpen(false);
      return;
    }
    rememberCurrentMeal();
    setGoal(nextGoal);
    setDrawIndex((value) => value + 1);
    setSlotOffsets({ protein: 0, vegetable: 0, staple: 0, dairy: 0 });
    setModeOpen(false);
    setNotice(`已切换为${GOALS[nextGoal].label}。`);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode) {
      setModeOpen(nextMode === "fitness");
      return;
    }
    rememberCurrentMeal();
    setMode(nextMode);
    setModeOpen(nextMode === "fitness");
    setNotice(`已切换为${MODES[nextMode].label}。`);
  }

  const historyPosition = pastMeals.length + 1;
  const historyTotal = pastMeals.length + futureMeals.length + 1;
  const historyState =
    historyTotal === 1
      ? "只有当前搭配"
      : pastMeals.length === 0
        ? "已到最早一组"
        : futureMeals.length === 0
          ? "当前是最新一组"
          : "可前后回看";

  return (
    <>
      <section className="app-screen v6-screen">
        <main className="screen-content v6-content" data-testid="v6-fitness-screen">
          <div className="mode-switcher">
            <button
              className="mode-trigger"
              type="button"
              aria-label={`当前模式：${MODES[mode].label}。切换模式`}
              aria-haspopup="dialog"
              aria-expanded={modeOpen}
              aria-controls="mode-popover"
              onClick={() => setModeOpen((value) => !value)}
            >
              <span>当前：{MODES[mode].label}</span>
              <b>切换模式</b>
            </button>
            {modeOpen ? (
              <div className="mode-popover" id="mode-popover" role="dialog" aria-label="切换用餐模式和健身目标">
                <p>用餐模式</p>
                <div className="compact-choice-grid">
                  {(Object.keys(MODES) as Mode[]).map((item) => (
                    <button
                      className={mode === item ? "is-selected" : ""}
                      type="button"
                      key={item}
                      aria-pressed={mode === item}
                      onClick={() => selectMode(item)}
                    >
                      <strong>{MODES[item].label}</strong>
                      <span>{mode === item ? "当前" : "选择"}</span>
                    </button>
                  ))}
                </div>
                {isFitness ? (
                  <>
                    <p>健身目标</p>
                    <div className="compact-choice-grid">
                      {FITNESS_GOALS.map((item) => (
                        <button
                          className={goal === item ? "is-selected" : ""}
                          type="button"
                          key={item}
                          aria-pressed={goal === item}
                          onClick={() => selectGoal(item)}
                        >
                          <strong>{GOALS[item].label}</strong>
                          <span>{goal === item ? "当前" : "选择"}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          <header className="brand">
            <img src="/pot-mark.png" width="58" height="50" alt="" />
            <p>别想了，开饭吧</p>
          </header>

          {!isFitness && diningOut ? (
            <section className="dining-out-card" aria-live="polite">
              <p className="eyebrow">开锅隐藏彩蛋</p>
              <span>今晚不用开火</span>
              <h2>{diningOut.name}</h2>
              <p>{diningOut.note}</p>
              <div>
                <small>推荐这样点</small>
                <strong>{diningOut.order}</strong>
              </div>
              <button className="primary-action" type="button" onClick={() => setNotice(`今晚就去吃「${diningOut.name}」`)}>就去吃这个</button>
              <button className="secondary-action" type="button" onClick={drawDailyMealWithoutEvent}>还是在家做</button>
              <button className="text-action" type="button" onClick={replaceDiningOut}>外食也换一个</button>
            </section>
          ) : (
            <>
              <section className="meal-hero" aria-label="今晚菜单摘要">
                <p className="eyebrow">{mealCopy.title}</p>
                <div className="meal-grid">
                  {displayMeal.map((item) => (
                    <div className="meal-tile" key={item.key}>
                      <span>{item.label}</span>
                      <strong>{item.name}</strong>
                    </div>
                  ))}
                </div>
              </section>

              {isFitness ? (
                <section className="nutrition-strip" aria-label="本餐营养估算">
                  <strong>热量估算 {nutrition.kcal} 千卡</strong>
                  <span>蛋白质估算 {nutrition.protein}g</span>
                </section>
              ) : null}

              <section className="meal-builder" aria-labelledby="builder-title">
                <div className="builder-heading">
                  <div>
                    <p className="eyebrow">保留喜欢的那道</p>
                    <h1 id="builder-title">一桌四味</h1>
                  </div>
                  <button type="button" onClick={redrawMeal}>整桌重开</button>
                </div>

                {isFitness ? (
                  <>
                    <div className="macro-row" aria-label="营养素估算">
                      <span>碳水估算 {nutrition.carbs}g</span>
                      <span>脂肪估算 {nutrition.fat}g</span>
                      <span>膳食纤维估算 {nutrition.fiber}g</span>
                    </div>
                    <p className="nutrition-basis">
                      按所列食材用量与常见食物成分估算，实际会因品牌、份量和烹调方式变化。
                    </p>
                  </>
                ) : null}

                <div
                  className="history-controls"
                  aria-label={`刚才的搭配，第 ${historyPosition} 组，共 ${historyTotal} 组`}
                >
                  <button
                    type="button"
                    aria-label={pastMeals.length === 0 ? "上一组，已到最早一组" : "查看上一组搭配"}
                    onClick={showPreviousMeal}
                    disabled={pastMeals.length === 0}
                  >
                    ‹ 上一组
                  </button>
                  <span>
                    <strong>刚才的搭配</strong>
                    <small>第 {historyPosition} / {historyTotal} 组 · {historyState}</small>
                  </span>
                  <button
                    type="button"
                    aria-label={futureMeals.length === 0 ? "下一组，当前已是最新一组" : "查看下一组搭配"}
                    onClick={showNextMeal}
                    disabled={futureMeals.length === 0}
                  >
                    下一组 ›
                  </button>
                </div>

                <div className="recipe-list">
                  {displayMeal.map((item) => {
                    const image = getRecipeImage(item.id);
                    const detailsOpen = openRecipeKey === item.key;
                    const detailsId = `recipe-details-${item.key}`;
                    return (
                    <article className="recipe-row" key={item.key} data-recipe-id={item.id}>
                      <div className="recipe-row-heading">
                        <div className="recipe-image-shell" data-image-state={image ? "available" : "fallback"}>
                          <img
                            className={`recipe-image${image ? "" : " is-fallback"}`}
                            src={image?.src ?? "/pot-mark.png"}
                            alt={image?.alt ?? ""}
                            width="64"
                            height="64"
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                            onError={(event) => {
                              const target = event.currentTarget;
                              if (target.dataset.fallback === "true") {
                                target.hidden = true;
                                return;
                              }
                              target.src = "/pot-mark.png";
                              target.alt = "";
                              target.dataset.fallback = "true";
                              target.classList.add("is-fallback");
                            }}
                          />
                        </div>
                        <div>
                          <span>{item.label}</span>
                          <h4>{item.name}</h4>
                          <p>
                            {item.time}
                            {item.nutrition ? ` · 热量估算 ${item.nutrition.kcal} 千卡 · 蛋白质估算 ${item.nutrition.protein}g` : ""}
                          </p>
                        </div>
                        {item.fitnessRole ? (
                          <button
                            type="button"
                            aria-label={`只换这道：${item.name}`}
                            onClick={() => replaceRecipe(item.fitnessRole!)}
                          >
                            只换这道
                          </button>
                        ) : item.dailyRole ? (
                          <button
                            type="button"
                            aria-label={`只换这道：${item.name}`}
                            onClick={() => replaceDailyRecipe(item.dailyRole!)}
                          >
                            只换这道
                          </button>
                        ) : null}
                      </div>
                      <button
                        className="recipe-details-toggle"
                        type="button"
                        aria-label={`${detailsOpen ? "收起" : "查看"}「${item.name}」的用料和做法`}
                        aria-expanded={detailsOpen}
                        aria-controls={detailsId}
                        onClick={() => setOpenRecipeKey((key) => key === item.key ? null : item.key)}
                      >
                        {detailsOpen ? "收起用料和做法" : "查看用料和做法"}
                      </button>
                      {detailsOpen ? (
                        <div className="recipe-details-content" id={detailsId}>
                          <p className="recipe-note">{item.note}</p>
                          <h5>用料</h5>
                          <ul>
                            {item.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
                          </ul>
                          <h5>步骤</h5>
                          <ol>
                            {item.steps.map((step) => <li key={step}>{step}</li>)}
                          </ol>
                        </div>
                      ) : null}
                    </article>
                    );
                  })}
                </div>

                <div className="builder-actions">
                  <button className="primary-action" type="button" onClick={redrawMeal}>整桌重开</button>
                </div>
              </section>
            </>
          )}

          {notice ? <p className="notice" role="status">{notice}</p> : null}
        </main>
      </section>
    </>
  );
}
