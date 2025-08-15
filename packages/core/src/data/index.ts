import foods from "./foods.db.json";
import frequents from "./frequents.json";

export interface Nutrients {
	totalFats: number | null;
	saturatedFats: number | null;
	unSaturatedFats: number | null;
	sugar: number | null;
	carbs: number | null;
	proteins: number | null;
	sodium: number | null;
	potassium: number | null;
	magnesium: number | null;
	vitaminA: number | null;
	vitaminC: number | null;
	vitaminD: number | null;
	fiber: number | null;
	calcium: number | null;
	iron: number | null;
}

export interface FoodItem {
	itemName: string;
	id: string;
	calories: number;
	calorieMeasurement: string;
	nutrients: Nutrients | Record<keyof Nutrients, number> | null;
	taste: string;
	region: string[];
	mealType: string[];
	isVeg: boolean;
	isVegan: boolean;
	description: string;
	note?: string;
	searchKeys?: string[];
}

export type StandardMealType = "breakfast" | "lunch" | "dinner" | "snacks";

export type MealType = StandardMealType | "pre-workout" | "post-workout" | "late-night";

export interface RegionMealTypes {
	breakfast: string[];
	lunch: string[];
	dinner: string[];
	snacks: string[];
}

export interface FrequentFoods {
	[region: string]: Record<string, string[]>;
}

export const foodData: Record<string, FoodItem> = foods;
export const foodItemsKeys: string[] = Object.keys(foodData);
export const foodItems: FoodItem[] = Object.values(foodData);

export const frequentFoods: FrequentFoods = frequents;
export const regions = Object.keys(frequentFoods).filter((region) => !["global", "_foods_not_in_db_"].includes(region));

export const standardNutrientsMeasurementMap: Record<keyof Nutrients, string> = {
	totalFats: "g",
	saturatedFats: "g",
	unSaturatedFats: "g",
	sugar: "g",
	fiber: "g",
	carbs: "g",
	proteins: "g",
	iron: "mg",
	calcium: "mg",
	sodium: "mg",
	potassium: "mg",
	magnesium: "mg",
	vitaminA: "mg",
	vitaminC: "mg",
	vitaminD: "mg"
};

export const standardMealTypesMap: Record<StandardMealType, string> = {
	breakfast: "Breakfast",
	lunch: "Lunch",
	dinner: "Dinner",
	snacks: "Snacks"
};

export const FOODS_NOT_IN_DB = [
	"adai",
	"semiya_upma",
	"rava_idli",
	"mini_idli",
	"mor_kuzhambu",
	"vathal_kuzhambu",
	"poriyal",
	"thuvayal",
	"bajji",
	"bonda",
	"sundal",
	"mixture",
	"ribbon_pakoda",
	"pathiri",
	"ela_ada",
	"karimeen_curry",
	"olan",
	"thoran",
	"pachadi",
	"achappam",
	"kozhukatta",
	"ethakka_appam",
	"punjabi_kadhi",
	"chicken_tikka_masala",
	"pakora",
	"bhajiya",
	"bedmi_puri",
	"delhi_chaat",
	"chicken_changezi",
	"mutton_korma",
	"chicken_biryani",
	"keema_naan",
	"gol_gappa",
	"aloo_tikki",
	"dahi_bhalla",
	"kochuri",
	"alur_dom",
	"charchari",
	"dal_bhaja",
	"bhaja_moong_dal",
	"chicken_kosha",
	"mutton_rezala",
	"jhal_muri",
	"phuchka",
	"egg_roll",
	"cutlet",
	"benne_dosa",
	"set_dosa",
	"akki_roti",
	"huli",
	"gojju",
	"palya",
	"kosambari",
	"jolada_roti",
	"enne_badnekai",
	"congress_kadalekai",
	"churumuri",
	"gobi_manchurian",
	"misal_pav",
	"thalipeeth",
	"bhakri",
	"zunka_bhakar",
	"sol_kadhi",
	"amti",
	"bhindi_masala",
	"kanda_bhaji",
	"dhokla",
	"khandvi",
	"fafda_jalebi",
	"gujarati_thali",
	"dal_dhokli",
	"undhiyu",
	"rotli",
	"shaak",
	"gathiya",
	"bati_churma",
	"gatte_ki_sabzi",
	"ker_sangri",
	"bajra_roti",
	"laal_maas",
	"bhujiya",
	"pyaaz_kachori",
	"",
	"bagel",
	"muffin",
	"cereal",
	"toast",
	"caesar_salad",
	"grilled_chicken",
	"sub_sandwich",
	"steak",
	"bbq_ribs",
	"tacos",
	"pretzels",
	"chips",
	"cookies",
	"full_english_breakfast",
	"beans_on_toast",
	"porridge",
	"bangers_and_mash",
	"shepherds_pie",
	"sunday_roast",
	"cottage_pie",
	"crisps",
	"biscuits",
	"scones",
	"cornetto",
	"espresso",
	"cappuccino",
	"carbonara",
	"lasagna",
	"risotto",
	"spaghetti_bolognese",
	"osso_buco",
	"gelato",
	"bruschetta",
	"antipasto",
	"pretzel",
	"bread_rolls",
	"schnitzel",
	"bratwurst",
	"sauerbraten",
	"currywurst",
	"beer",
	"stroopwafel",
	"erwtensoep",
	"bitterballen",
	"stamppot",
	"haring",
	"muesli",
	"fondue",
	"raclette",
	"rosti",
	"chocolate",
	"nuts",
	"falafel",
	"hummus",
	"pita_bread",
	"labneh",
	"kebab",
	"mansaf",
	"tabbouleh",
	"lamb_curry",
	"kabsa",
	"baklava",
	"dates",
	"huevos_rancheros",
	"chilaquiles",
	"burritos",
	"enchiladas",
	"pozole",
	"mole",
	"carnitas",
	"tamales",
	"nachos",
	"churros",
	"elote",
	"guacamole",
	"congee",
	"baozi",
	"youtiao",
	"dim_sum",
	"chow_mein",
	"kung_pao_chicken",
	"sweet_sour_pork",
	"dumplings",
	"prawn_crackers",
	"fortune_cookies",
	"miso_soup",
	"nori",
	"tamagoyaki",
	"sushi",
	"ramen",
	"udon",
	"tempura",
	"bento",
	"sashimi",
	"yakitori",
	"teriyaki",
	"katsu",
	"mochi",
	"pocky",
	"rice_crackers",
	"matcha_tea",
	"thai_rice_soup",
	"thai_omelet",
	"pad_thai",
	"tom_yum",
	"green_curry",
	"fried_rice_thai",
	"massaman_curry",
	"som_tam",
	"pad_see_ew",
	"mango_sticky_rice",
	"thai_tea",
	"coconut_ice_cream"
];
