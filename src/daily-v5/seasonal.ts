import type { MainGroup, Recipe } from "./recipes";

export type SeasonalFruit = {
  id: string;
  name: string;
  months: number[];
  season: SeasonName;
  note: string;
};

export type SeasonName = "春季" | "夏季" | "秋季" | "冬季";

export const SEASONAL_FRUITS: SeasonalFruit[] = [
  { id: "cherry", name: "樱桃", months: [3, 4, 5], season: "春季", note: "洗净后食用，果核不食。" },
  { id: "loquat", name: "枇杷", months: [3, 4, 5], season: "春季", note: "春季当造，去皮去核后食用。" },
  { id: "pineapple", name: "菠萝", months: [3, 4, 5], season: "春季", note: "削皮去刺后切块，按需取一小份。" },
  { id: "mulberry", name: "桑葚", months: [3, 4], season: "春季", note: "轻柔冲洗后食用，深色果汁容易染衣。" },
  { id: "green-plum", name: "青梅", months: [3, 4, 5], season: "春季", note: "鲜果酸涩，不宜直接大量食用，可熟制后品尝。" },
  { id: "apricot", name: "杏", months: [4, 5, 6], season: "春季", note: "洗净后食用，果核不食。" },
  { id: "peach", name: "桃", months: [5, 6, 7, 8], season: "夏季", note: "洗净表面绒毛，去核后食用。" },
  { id: "plum", name: "李子", months: [5, 6, 7, 8], season: "夏季", note: "洗净后食用，果核不食。" },
  { id: "lychee", name: "荔枝", months: [5, 6, 7], season: "夏季", note: "夏季当造，剥壳去核后按需取一小份。" },
  { id: "wampee", name: "黄皮", months: [6, 7], season: "夏季", note: "洗净后食用，果核不食。" },
  { id: "longan", name: "龙眼", months: [7, 8], season: "夏季", note: "剥壳去核，按需取一小份。" },
  { id: "mango", name: "芒果", months: [5, 6, 7, 8], season: "夏季", note: "去皮切块；对芒果过敏者避免食用。" },
  { id: "watermelon", name: "西瓜", months: [5, 6, 7, 8], season: "夏季", note: "切开后冷藏并尽快食用。" },
  { id: "bayberry", name: "杨梅", months: [5, 6, 7], season: "夏季", note: "用流动水轻柔洗净后食用。" },
  { id: "grape", name: "葡萄", months: [7, 8, 9], season: "夏季", note: "剪成小串后清洗，果籽按品种处理。" },
  { id: "hami-melon", name: "哈密瓜", months: [6, 7, 8, 9], season: "夏季", note: "去皮去籽切块，切开后冷藏并尽快食用。" },
  { id: "pear", name: "梨", months: [8, 9, 10, 11], season: "秋季", note: "洗净去核，可直接切块食用。" },
  { id: "apple", name: "苹果", months: [8, 9, 10, 11], season: "秋季", note: "秋季新果较多，洗净去核后食用。" },
  { id: "pomelo", name: "柚子", months: [9, 10, 11, 12], season: "秋季", note: "剥去外皮和白膜后食用。" },
  { id: "pomegranate", name: "石榴", months: [8, 9, 10, 11], season: "秋季", note: "剥出果粒食用，注意不要误吞硬籽。" },
  { id: "persimmon", name: "柿子", months: [9, 10, 11], season: "秋季", note: "选择成熟果实，按需取一小份。" },
  { id: "kiwifruit", name: "猕猴桃", months: [9, 10, 11, 12], season: "秋季", note: "软熟后去皮切块食用。" },
  { id: "winter-jujube", name: "冬枣", months: [9, 10, 11], season: "秋季", note: "洗净后食用，枣核不食。" },
  { id: "fig", name: "无花果", months: [8, 9, 10], season: "秋季", note: "成熟后果皮柔软，洗净即可食用。" },
  { id: "sugar-orange", name: "沙糖桔", months: [11, 12, 1, 2], season: "冬季", note: "冬季当造，剥皮后按需取一小份。" },
  { id: "strawberry", name: "草莓", months: [12, 1, 2, 3], season: "冬季", note: "去蒂前用流动水轻柔冲洗。" },
  { id: "orange", name: "橙子", months: [11, 12, 1, 2], season: "冬季", note: "剥皮或切瓣后食用。" },
  { id: "mandarin", name: "柑橘", months: [11, 12, 1, 2], season: "冬季", note: "冬季柑橘集中上市，剥皮后食用。" },
  { id: "sugarcane", name: "甘蔗", months: [11, 12, 1, 2, 3], season: "冬季", note: "削净外皮后分段食用，咀嚼时注意纤维。" },
  { id: "kumquat", name: "金桔", months: [11, 12, 1, 2], season: "冬季", note: "充分洗净，可连皮食用并吐出果籽。" },
  { id: "avocado", name: "牛油果", months: [2, 3, 4, 5], season: "春季", note: "软熟后切开去核，可直接吃或拌沙拉。" },
  { id: "plantain", name: "大蕉", months: [3, 4, 5], season: "春季", note: "选择表皮转黄、果肉软熟的果实。" },
  { id: "papaya", name: "木瓜", months: [3, 4, 5], season: "春季", note: "去皮去籽切块食用。" },
  { id: "sapodilla", name: "人心果", months: [2, 3, 4, 5], season: "春季", note: "需放至果肉变软后食用，果籽不食。" },
  { id: "star-apple", name: "星苹果", months: [2, 3, 4, 5], season: "春季", note: "切开后挖取果肉，果皮和果籽不食。" },
  { id: "jaboticaba", name: "嘉宝果", months: [3, 4, 5], season: "春季", note: "洗净后食用，果籽按个人习惯吐出。" },
  { id: "acerola", name: "西印度樱桃", months: [3, 4, 5], season: "春季", note: "果实成熟后较软，洗净并尽快食用。" },
  { id: "surinam-cherry", name: "苏里南樱桃", months: [3, 4, 5], season: "春季", note: "选择完全转红或紫黑的成熟果，果籽不食。" },
  { id: "goldenberry", name: "姑娘果（灯笼果）", months: [3, 4, 5, 6], season: "春季", note: "剥去纸质外衣并洗净后食用。" },
  { id: "gooseberry", name: "鹅莓", months: [5, 6, 7], season: "春季", note: "成熟果可直接吃，偏酸时可搭配酸奶。" },
  { id: "honeyberry", name: "蓝靛果", months: [4, 5, 6], season: "春季", note: "果皮薄，轻柔冲洗后食用。" },
  { id: "cloudberry", name: "云莓", months: [5, 6, 7], season: "春季", note: "成熟果柔软易损，清洗后尽快食用。" },
  { id: "salmonberry", name: "鲑莓", months: [4, 5, 6], season: "春季", note: "选择橙红色成熟果，轻柔清洗后食用。" },
  { id: "breadfruit", name: "面包果", months: [3, 4, 5, 6], season: "春季", note: "通常需要蒸、烤或煮熟后食用，不作生食推荐。" },
  { id: "mamey-sapote", name: "玛米果", months: [4, 5, 6, 7, 8, 9, 10], season: "春季", note: "放软后切开去核，挖取果肉食用。" },
  { id: "white-sapote", name: "白柿", months: [4, 5, 6, 7], season: "春季", note: "果肉软熟后食用，果皮和果籽不食。" },
  { id: "ambarella", name: "六月李", months: [4, 5, 6, 7], season: "春季", note: "成熟果去核食用，青果酸度较高。" },
  { id: "soursop", name: "刺果番荔枝", months: [3, 4, 5, 6], season: "春季", note: "软熟后剥皮，果肉中的黑籽不可食用。" },
  { id: "cherimoya", name: "南美番荔枝", months: [2, 3, 4, 5], season: "春季", note: "软熟后挖取果肉，黑色果籽不可食用。" },
  { id: "blueberry", name: "蓝莓", months: [5, 6, 7, 8], season: "夏季", note: "食用前用流动水轻柔清洗。" },
  { id: "raspberry", name: "树莓", months: [5, 6, 7, 8], season: "夏季", note: "果实柔软，轻柔冲洗后尽快食用。" },
  { id: "blackberry", name: "黑莓", months: [5, 6, 7, 8], season: "夏季", note: "选择颜色深且饱满的果实，洗净后食用。" },
  { id: "cantaloupe", name: "网纹甜瓜", months: [5, 6, 7, 8, 9], season: "夏季", note: "洗净表皮后切开，去籽切块食用。" },
  { id: "honeydew", name: "蜜瓜", months: [5, 6, 7, 8, 9], season: "夏季", note: "去皮去籽切块，切开后冷藏。" },
  { id: "nectarine", name: "油桃", months: [5, 6, 7, 8], season: "夏季", note: "洗净后去核食用。" },
  { id: "fresh-prune", name: "鲜西梅", months: [7, 8, 9], season: "夏季", note: "洗净后食用，果核不食。" },
  { id: "passion-fruit", name: "百香果", months: [5, 6, 7, 8, 9, 10, 11, 12], season: "夏季", note: "切开取果浆，可直接吃或兑水饮用。" },
  { id: "wax-apple", name: "莲雾", months: [5, 6, 7, 8], season: "夏季", note: "洗净底部凹槽后切块食用。" },
  { id: "rambutan", name: "红毛丹", months: [6, 7, 8, 9], season: "夏季", note: "剥壳食用果肉，果核不食。" },
  { id: "mangosteen", name: "山竹", months: [5, 6, 7, 8, 9], season: "夏季", note: "按压果壳微软时剥开，食用白色果肉。" },
  { id: "durian", name: "榴莲", months: [5, 6, 7, 8, 9], season: "夏季", note: "开壳后取果肉，冷藏保存并尽快食用。" },
  { id: "jackfruit", name: "菠萝蜜", months: [5, 6, 7, 8, 9, 10], season: "夏季", note: "取黄色果肉食用，果核需煮熟后才能吃。" },
  { id: "dragon-fruit", name: "火龙果", months: [6, 7, 8, 9, 10, 11], season: "夏季", note: "去皮切块，按需取一小份。" },
  { id: "prickly-pear", name: "仙人掌果", months: [7, 8, 9, 10], season: "夏季", note: "处理时戴手套去净细刺，再剥皮食用。" },
  { id: "guava", name: "番石榴", months: [8, 9, 10, 11], season: "秋季", note: "洗净切块，较硬时切薄片更方便。" },
  { id: "starfruit", name: "杨桃", months: [8, 9, 10, 11], season: "秋季", note: "洗净切片；肾病人群应遵医嘱避免食用。" },
  { id: "hawthorn", name: "山楂", months: [9, 10, 11], season: "秋季", note: "鲜果较酸，去核后少量食用或熟制。" },
  { id: "sea-buckthorn", name: "沙棘果", months: [8, 9, 10], season: "秋季", note: "酸度较高，适合少量鲜食或打成果汁。" },
  { id: "cranberry", name: "蔓越莓", months: [9, 10, 11], season: "秋季", note: "鲜果偏酸，可少量鲜食或加热制作果酱。" },
  { id: "blackcurrant", name: "黑加仑", months: [7, 8, 9], season: "秋季", note: "去梗洗净，可鲜食或搭配酸奶。" },
  { id: "elderberry", name: "接骨木莓", months: [8, 9, 10], season: "秋季", note: "不可生食，需充分加热后制作果酱或糖浆。" },
  { id: "aronia", name: "黑果花楸", months: [8, 9, 10], season: "秋季", note: "鲜果涩味明显，适合少量食用或熟制。" },
  { id: "quince", name: "木梨（榅桲）", months: [9, 10, 11], season: "秋季", note: "果肉较硬且涩，通常煮熟或制作果酱。" },
  { id: "crabapple", name: "海棠果", months: [8, 9, 10], season: "秋季", note: "洗净去核，可鲜食或煮制。" },
  { id: "pawpaw", name: "美洲番木瓜", months: [8, 9, 10], season: "秋季", note: "软熟后切开，果皮和果籽不食。" },
  { id: "lingonberry", name: "越橘", months: [8, 9, 10], season: "秋季", note: "鲜果偏酸，可搭配酸奶或熟制。" },
  { id: "rose-hip", name: "玫瑰果", months: [9, 10, 11], season: "秋季", note: "需去除内部籽和绒毛，常用于煮茶或果酱。" },
  { id: "feijoa", name: "菲油果", months: [9, 10, 11], season: "秋季", note: "果实散发香气且微软时切开挖食。" },
  { id: "date-fruit", name: "鲜椰枣", months: [8, 9, 10, 11], season: "秋季", note: "去核后食用，甜度较高宜控制份量。" },
  { id: "medlar", name: "欧楂", months: [10, 11, 12], season: "秋季", note: "需后熟至果肉变软后食用。" },
  { id: "akebia", name: "八月瓜", months: [8, 9, 10], season: "秋季", note: "果皮自然裂开后取果肉，果籽较多。" },
  { id: "redcurrant", name: "红醋栗（红加仑）", months: [7, 8, 9], season: "秋季", note: "去梗洗净，可鲜食或搭配甜点。" },
  { id: "whitecurrant", name: "白加仑", months: [7, 8, 9], season: "秋季", note: "果实透明偏酸，去梗洗净后食用。" },
  { id: "grapefruit", name: "葡萄柚", months: [11, 12, 1, 2, 3], season: "冬季", note: "剥皮去膜后食用；服药人群注意药物相互作用提示。" },
  { id: "lemon", name: "柠檬", months: [11, 12, 1, 2, 3, 4], season: "冬季", note: "酸度高，适合切片泡水或用于调味。" },
  { id: "lime", name: "青柠", months: [11, 12, 1, 2, 3], season: "冬季", note: "酸度高，适合挤汁调味，不建议空腹大量食用。" },
  { id: "blood-orange", name: "血橙", months: [12, 1, 2, 3], season: "冬季", note: "剥皮或切瓣后食用。" },
  { id: "navel-orange", name: "脐橙", months: [11, 12, 1, 2], season: "冬季", note: "洗净外皮后切瓣或剥皮食用。" },
  { id: "dekopon", name: "丑橘", months: [1, 2, 3, 4], season: "冬季", note: "剥皮后食用，果籽不食。" },
  { id: "harumi", name: "春见柑橘", months: [12, 1, 2, 3], season: "冬季", note: "果皮较易剥，分瓣后食用。" },
  { id: "wogan", name: "沃柑", months: [1, 2, 3, 4], season: "冬季", note: "剥皮分瓣后食用。" },
  { id: "ehime-kashi", name: "红美人柑橘", months: [10, 11, 12, 1], season: "冬季", note: "果肉柔软多汁，可剥皮或切开食用。" },
  { id: "clementine", name: "克莱门氏小柑橘", months: [11, 12, 1, 2], season: "冬季", note: "剥皮分瓣后食用，通常籽较少。" },
  { id: "tangelo", name: "坦柑", months: [12, 1, 2, 3], season: "冬季", note: "剥皮或切瓣食用，兼有橘与柚的风味。" },
  { id: "finger-lime", name: "澳洲指橙", months: [11, 12, 1, 2, 3], season: "冬季", note: "切开挤出鱼子状果粒，适合少量搭配菜肴。" },
  { id: "ugli-fruit", name: "牙买加丑橘", months: [12, 1, 2, 3, 4], season: "冬季", note: "剥去厚皮和白膜后分瓣食用。" },
  { id: "tamarind", name: "酸角（罗望子）", months: [12, 1, 2, 3], season: "冬季", note: "剥壳去筋取果肉，味酸甜且果核不食。" },
  { id: "kiwano", name: "火参果", months: [11, 12, 1, 2], season: "冬季", note: "切开后挖取绿色果肉食用。" },
  { id: "tamarillo", name: "树番茄", months: [11, 12, 1, 2, 3], season: "冬季", note: "切开挖取果肉，果皮味涩通常不食。" },
  { id: "coconut", name: "椰子", months: [11, 12, 1, 2, 3], season: "冬季", note: "开壳饮用椰汁并挖取椰肉，注意开壳安全。" },
  { id: "camu-camu", name: "卡姆果", months: [11, 12, 1, 2, 3], season: "冬季", note: "鲜果酸度很高，通常制成果浆后少量食用。" },
  { id: "black-sapote", name: "黑柿", months: [11, 12, 1, 2], season: "冬季", note: "必须完全软熟后切开挖取果肉，果籽不食。" },
  { id: "sugar-apple", name: "释迦果", months: [11, 12, 1, 2], season: "冬季", note: "果皮变软后掰开食用，黑色果籽不可食用。" },
];

const SOUP_NAMES_BY_SEASON: Record<SeasonName, string[]> = {
  春季: [
    "莲子扁豆猪腱汤",
    "芡实陈皮鲫鱼汤",
    "淮山脊骨汤",
    "金针豆腐瘦肉汤",
    "粉葛鲮鱼汤",
    "五指毛桃鸡汤",
    "枸杞叶猪肝汤",
    "春砂仁鲫鱼汤",
    "浮小麦猪腱汤",
    "五指毛桃茯苓排骨汤",
    "木棉花扁豆猪骨汤",
    "麦芽谷芽陈皮瘦肉汤",
  ],
  夏季: [
    "党参黄皮瘦肉汤",
    "橄榄陈皮瘦肉汤",
    "白瓜眉豆筒骨汤",
    "苦瓜黄豆排骨汤",
    "冬瓜薏米排骨汤",
    "老黄瓜赤小豆汤",
    "节瓜瑶柱肉片汤",
    "丝瓜鱼片汤",
    "冬瓜咸蛋肉片汤",
    "苦瓜鲍鱼排骨汤",
    "荷叶冬瓜老鸭汤",
    "茅根竹蔗马蹄瘦肉汤",
    "绿豆海带排骨汤",
    "白果枝竹冬瓜老鸭汤",
    "赤小豆薏米老鸭汤",
  ],
  秋季: [
    "鲜石斛雪梨排骨汤",
    "雪梨银耳百合汤",
    "无花果猪肺瘦肉汤",
    "白扁豆莲藕莲子排骨汤",
    "莲藕章鱼猪骨汤",
    "霸王花猪骨汤",
    "海底椰雪梨瘦肉汤",
    "苹果雪梨瘦肉汤",
    "墨鱼莲藕排骨汤",
    "沙参玉竹老鸭汤",
    "南北杏雪梨瘦肉汤",
    "海底椰无花果响螺汤",
    "罗汉果菜干猪肺汤",
  ],
  冬季: [
    "茅根甘蔗羊肉汤",
    "白萝卜羊肉汤",
    "川芎白芷鱼头汤",
    "三参玉竹水鸭汤",
    "胡椒猪肚汤",
    "淮山杞子乌鸡汤",
    "西洋菜陈肾汤",
    "菜干猪肺汤",
    "茶树菇老鸭汤",
    "番茄薯仔牛尾汤",
    "栗子淮山猪蹄汤",
    "黑豆核桃杜仲猪骨汤",
    "当归生姜羊肉汤",
    "党参黄芪鸡汤",
    "莲子芡实猪肚汤",
  ],
};

const COMMON_SOUP_NAMES = [
  "玉米胡萝卜排骨汤",
  "椰子鸡汤",
  "虫草花鸡汤",
  "无花果瘦肉汤",
  "豆腐鲫鱼汤",
  "番茄鱼片汤",
  "紫菜鱼丸汤",
  "海皇豆腐羹",
  "龙骨玉米萝卜汤",
  "眉豆红枣花生猪尾汤",
  "大地鱼瘦肉豆腐汤",
];

export function getSeasonForMonth(month: number): SeasonName {
  if (month >= 3 && month <= 5) return "春季";
  if (month >= 6 && month <= 8) return "夏季";
  if (month >= 9 && month <= 11) return "秋季";
  return "冬季";
}

export function getDailySeasonalFruit(
  date = new Date(),
  random: () => number = Math.random,
  excludeId?: string,
): SeasonalFruit {
  const month = date.getMonth() + 1;
  const pool = SEASONAL_FRUITS.filter((fruit) => fruit.months.includes(month));
  const candidates =
    excludeId && pool.length > 1
      ? pool.filter((fruit) => fruit.id !== excludeId)
      : pool;
  return candidates[Math.floor(random() * candidates.length)];
}

export function getDailySeasonalSoup(
  recipes: Recipe[],
  date = new Date(),
  random: () => number = Math.random,
  excludeId?: string,
): Recipe | null {
  const season = getSeasonForMonth(date.getMonth() + 1);
  const pool = [...SOUP_NAMES_BY_SEASON[season], ...COMMON_SOUP_NAMES]
    .map((name) => recipes.find((recipe) => recipe.name === name))
    .filter((recipe): recipe is Recipe => Boolean(recipe));
  const candidates =
    excludeId && pool.length > 1
      ? pool.filter((recipe) => recipe.id !== excludeId)
      : pool;
  return candidates.length
    ? candidates[Math.floor(random() * candidates.length)]
    : null;
}

export function getSoupSeason(recipe: Recipe, date = new Date()): SeasonName {
  for (const [season, names] of Object.entries(SOUP_NAMES_BY_SEASON)) {
    if (names.includes(recipe.name)) return season as SeasonName;
  }
  return getSeasonForMonth(date.getMonth() + 1);
}

export function getSeasonalVegetableIds(
  recipes: Recipe[],
  month: number,
): string[] {
  return recipes
    .filter(
      (recipe) =>
        recipe.mainGroup === "蔬菜" && recipe.peakMonths?.includes(month),
    )
    .map((recipe) => recipe.id);
}

export function getSoupProteinGroup(soup: Recipe | null): MainGroup | null {
  if (!soup || soup.mainGroup === "蔬菜" || soup.mainGroup === "其他") {
    return null;
  }
  return soup.mainGroup;
}

export function getSoupProduceKeywords(soup: Recipe | null): string[] {
  if (!soup) return [];
  const produce = [
    "冬瓜",
    "节瓜",
    "丝瓜",
    "老黄瓜",
    "莲藕",
    "淮山",
    "西洋菜",
    "番茄",
    "玉米",
    "胡萝卜",
    "木瓜",
    "雪梨",
    "苹果",
    "苦瓜",
    "白瓜",
    "黄皮",
    "白萝卜",
    "金针菇",
    "银耳",
    "百合",
    "海带",
    "马蹄",
    "竹蔗",
    "甘蔗",
    "栗子",
    "白菜干",
    "菜干",
  ];
  const content = [soup.name, ...soup.ingredients].join("、");
  return produce.filter((item) => content.includes(item));
}
