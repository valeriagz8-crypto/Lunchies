/**
 * Static content and data layer for the Lunchies marketing engine.
 *
 * Content rules baked into this file:
 * - No customer counts, ratings, reviews or testimonials are stated as fact.
 * - No outcome claims ("kids eat 30% better") that we cannot evidence.
 * - Social proof placeholders exist only as clearly marked templates to be
 *   filled in later with real, consented parent voices.
 */

/* -------------------------------------------------------------------------- */
/* Brand system                                                               */
/* -------------------------------------------------------------------------- */

export type BrandColor = {
  name: string;
  hex: string;
  tailwind: string;
  usage: string;
};

export type BrandFont = {
  role: "headings" | "text";
  family: string;
  fallback: string;
  weights: number[];
};

export type BrandVoiceWord = {
  word: "Friendly" | "Trustworthy" | "Modern" | "Nutritious";
  meaning: string;
  soundsLike: string;
};

export type Brand = {
  name: string;
  tagline: string;
  colors: {
    darkGreen: BrandColor;
    lightGreen: BrandColor;
    orange: BrandColor;
    peach: BrandColor;
  };
  fonts: {
    headings: BrandFont;
    text: BrandFont;
  };
  voice: BrandVoiceWord[];
};

export const BRAND: Brand = {
  name: "Lunchies",
  tagline: "Better lunches, brighter days.",
  colors: {
    darkGreen: {
      name: "Dark green",
      hex: "#27633c",
      tailwind: "leaf-700",
      usage: "Headings, primary buttons, logo and anything that carries trust.",
    },
    lightGreen: {
      name: "Light green",
      hex: "#c2e6cb",
      tailwind: "leaf-200",
      usage: "Soft section backgrounds, cards, badges and dividers.",
    },
    orange: {
      name: "Orange",
      hex: "#ec6410",
      tailwind: "peach-600",
      usage: "Calls to action, highlights and the one thing we want tapped.",
    },
    peach: {
      name: "Peach",
      hex: "#ffedd9",
      tailwind: "peach-100",
      usage: "Warm backgrounds behind food imagery and friendly callouts.",
    },
  },
  fonts: {
    headings: {
      role: "headings",
      family: "Poppins",
      fallback: "ui-sans-serif, system-ui, sans-serif",
      weights: [500, 600, 700],
    },
    text: {
      role: "text",
      family: "Inter",
      fallback: "ui-sans-serif, system-ui, sans-serif",
      weights: [400, 500, 600],
    },
  },
  voice: [
    {
      word: "Friendly",
      meaning: "We talk like a parent who has been through the 7am rush.",
      soundsLike: "Warm, plain language. No lectures about what kids should eat.",
    },
    {
      word: "Trustworthy",
      meaning: "We say what we actually do, and nothing we cannot back up.",
      soundsLike: "Clear ingredients, clear prices, no miracle promises.",
    },
    {
      word: "Modern",
      meaning: "Planning a week of lunches should feel like using a good app.",
      soundsLike: "Short sentences, clean layouts, a few taps and done.",
    },
    {
      word: "Nutritious",
      meaning: "Balance is the default, not an upgrade.",
      soundsLike: "Real food named out loud: fruit, protein, whole grains.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Target persona                                                             */
/* -------------------------------------------------------------------------- */

export type PersonaInsight = {
  title: string;
  detail: string;
};

export type Persona = {
  name: string;
  ageRange: string;
  location: string;
  description: string;
  insights: PersonaInsight[];
};

export const PERSONA: Persona = {
  name: "Busy parents (30-45)",
  ageRange: "30-45",
  location: "Mexico City",
  description:
    "Parents of school-age children in Mexico City who work full time and still want to send a lunch they feel good about. Mornings are short, the week is full, and deciding what goes in the lunchbox is one more decision in an already long list.",
  insights: [
    {
      title: "Values health and nutrition",
      detail:
        "Wants balanced lunches with real ingredients, and reads labels when there is time to read them.",
    },
    {
      title: "Limited time during the week",
      detail:
        "Weekday mornings are measured in minutes, so anything that needs improvising gets dropped.",
    },
    {
      title: "Wants convenient solutions",
      detail:
        "Will happily trade browsing and guessing for a plan that is ready when the week starts.",
    },
    {
      title: "Looks for variety and quality",
      detail:
        "The same sandwich five days in a row comes home uneaten, so rotation and quality both matter.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Landing page copy and A/B tests                                            */
/* -------------------------------------------------------------------------- */

export type AbVariantId = "A" | "B";

export type AbVariant = {
  id: AbVariantId;
  text: string;
  rationale: string;
};

export type AbTest = {
  id: string;
  element: string;
  hypothesis: string;
  variants: [AbVariant, AbVariant];
};

export type LandingCopy = {
  subheadline: string;
  callToAction: string;
  headlineTest: AbTest;
  buttonTest: AbTest;
};

export const LANDING_COPY: LandingCopy = {
  subheadline:
    "Lunchies plans a week of balanced lunches for your kids, so you can stop deciding at 7am and start the day already sorted.",
  callToAction: "Build your first week of lunches in a few minutes.",
  headlineTest: {
    id: "ab-headline",
    element: "Landing hero headline",
    hypothesis:
      "Parents respond more to the outcome for their child than to the ease of the tool. Variant A leads with the child, variant B leads with simplicity.",
    variants: [
      {
        id: "A",
        text: "Healthy lunches. Happier kids.",
        rationale: "Leads with the emotional payoff for the child.",
      },
      {
        id: "B",
        text: "Nutritious lunches, made simple.",
        rationale: "Leads with the practical payoff for the parent.",
      },
    ],
  },
  buttonTest: {
    id: "ab-cta-button",
    element: "Primary call-to-action button",
    hypothesis:
      "Ownership wording converts better than instruction wording. Variant A frames the plan as already theirs, variant B frames the first step.",
    variants: [
      {
        id: "A",
        text: "Create my plan",
        rationale: "First person, makes the plan feel personal and owned.",
      },
      {
        id: "B",
        text: "Start your plan",
        rationale: "Second person, lowers commitment to a single first step.",
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* Social posts                                                               */
/* -------------------------------------------------------------------------- */

export type SocialChannel = "Instagram" | "TikTok";

export type SocialPostId =
  | "post-01"
  | "post-02"
  | "post-03"
  | "post-04"
  | "post-05"
  | "post-06"
  | "post-07"
  | "post-08"
  | "post-09"
  | "post-10";

export type SocialPost = {
  id: SocialPostId;
  title: string;
  channel: SocialChannel;
  caption: string;
  hashtags: string[];
};

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: "post-01",
    title: "What a balanced lunchbox looks like",
    channel: "Instagram",
    caption:
      "A lunchbox that works has four things in it: something fresh, something with protein, something with whole grain, and something your kid actually likes. That last one is not optional. Swipe to see how the four fit together, then build your own week with Lunchies.",
    hashtags: ["#Lunchies", "#SchoolLunch", "#BalancedLunch", "#CDMXParents", "#KidsNutrition"],
  },
  {
    id: "post-02",
    title: "Sunday plan, calm week",
    channel: "Instagram",
    caption:
      "Plan once on Sunday and the rest of the week stops asking questions. Pick the meals, get the shopping list, done. Better lunches, brighter days.",
    hashtags: ["#Lunchies", "#MealPlanning", "#SundayPrep", "#BusyParents", "#LunchboxIdeas"],
  },
  {
    id: "post-03",
    title: "The 7am decision we all know",
    channel: "TikTok",
    caption:
      "Fridge open. Nothing obvious. Clock says leave in nine minutes. We built Lunchies for exactly this moment, so the decision is already made before you walk into the kitchen.",
    hashtags: ["#Lunchies", "#MorningRoutine", "#SchoolMornings", "#ParentingCDMX", "#LunchHack"],
  },
  {
    id: "post-04",
    title: "Three lunches you can pack in ten minutes",
    channel: "TikTok",
    caption:
      "Three lunches, ten minutes, ingredients you can find at the mercado on the corner. Save this for the next time the week starts faster than you do.",
    hashtags: ["#Lunchies", "#QuickLunch", "#LunchboxIdeas", "#CDMX", "#KidsLunch"],
  },
  {
    id: "post-05",
    title: "Variety without more work",
    channel: "Instagram",
    caption:
      "The same sandwich on Monday is fine. The same sandwich on Thursday comes home untouched. Lunchies rotates the week for you, so variety stops being extra work.",
    hashtags: ["#Lunchies", "#PickyEaters", "#MealVariety", "#SchoolLunch", "#FamilyFood"],
  },
  {
    id: "post-06",
    title: "Allergies and preferences, set once",
    channel: "Instagram",
    caption:
      "Tell us once what your child cannot eat, or simply will not eat, and every week of lunches respects it. No re-explaining, no checking every label twice.",
    hashtags: ["#Lunchies", "#AllergyFriendly", "#SafeLunch", "#ParentsOfCDMX", "#KidsNutrition"],
  },
  {
    id: "post-07",
    title: "What goes in, and why",
    channel: "Instagram",
    caption:
      "We name what is in the box. Fruit, protein, whole grains, and water instead of a surprise. If an ingredient needs a paragraph to explain, it probably does not belong in a kid's lunch.",
    hashtags: ["#Lunchies", "#RealIngredients", "#CleanLabel", "#HealthyKids", "#Transparency"],
  },
  {
    id: "post-08",
    title: "Mexico City morning, minute by minute",
    channel: "TikTok",
    caption:
      "6:40 alarm. 7:05 uniform. 7:15 traffic on the way to school. Somewhere in there, lunch. Here is where a plan made on Sunday quietly saves the morning.",
    hashtags: ["#Lunchies", "#CDMX", "#SchoolRun", "#MorningRoutine", "#BusyParents"],
  },
  {
    id: "post-09",
    title: "Snack swaps that still feel like treats",
    channel: "Instagram",
    caption:
      "Swapping a snack does not have to feel like taking something away. Fruit with yogurt, nuts with dark chocolate, popcorn instead of chips. Small changes your kid will not protest.",
    hashtags: ["#Lunchies", "#SnackIdeas", "#HealthySwaps", "#KidsSnacks", "#LunchboxIdeas"],
  },
  {
    id: "post-10",
    title: "Ask us anything about lunches",
    channel: "TikTok",
    caption:
      "Drop your lunchbox problem in the comments. Soggy sandwiches, the kid who only eats beige food, lunches that survive a backpack until noon. We will answer the most common ones this week.",
    hashtags: ["#Lunchies", "#AskUsAnything", "#LunchboxProblems", "#ParentingTips", "#CDMXParents"],
  },
];

/* -------------------------------------------------------------------------- */
/* Short video scripts                                                        */
/* -------------------------------------------------------------------------- */

export type VideoScriptId = "script-01" | "script-02" | "script-03";

export type VideoScript = {
  id: VideoScriptId;
  title: string;
  duration: string;
  hook: string;
  problem: string;
  solution: string;
  callToAction: string;
  /** Present only on scripts that must be produced with a real, consented person. */
  productionNote?: string;
};

export const VIDEO_SCRIPTS: VideoScript[] = [
  {
    id: "script-01",
    title: "Nine minutes before we leave",
    duration: "20s",
    hook: "Open fridge. Nine minutes before we leave. Sound familiar?",
    problem:
      "Every weekday morning ends with the same question, and the answer has to be fast, which usually means it is not the answer you wanted.",
    solution:
      "Lunchies plans the week ahead of time: balanced lunches your kid will actually open, with a shopping list that matches.",
    callToAction: "Create your plan at lunchies.mx. Better lunches, brighter days.",
  },
  {
    id: "script-02",
    title: "Plan once, eat all week",
    duration: "25s",
    hook: "What if lunch was decided before Monday even started?",
    problem:
      "Deciding five lunches, five separate times, in five short mornings is what makes packing lunch feel heavy.",
    solution:
      "Pick your week in Lunchies in a few minutes: set allergies and preferences once, get a rotating menu and the list of what to buy.",
    callToAction: "Start your plan at lunchies.mx and get your week back.",
  },
  {
    id: "script-03",
    title: "Parent story (template for a future real testimonial)",
    duration: "30s",
    hook: "[PARENT, on camera, in their own words: the moment packing lunch stopped feeling manageable.]",
    problem:
      "[PARENT describes their own weekday reality. Prompt to ask on set: what did mornings look like before? Do not supply the line, record what they say.]",
    solution:
      "[PARENT describes how they use Lunchies now, in their own words. Prompt: walk me through your Sunday. Keep only what they genuinely experienced.]",
    callToAction:
      "[PARENT, optional, only if offered unprompted. Otherwise close on brand card: Better lunches, brighter days. lunchies.mx]",
    productionNote:
      "This is a template, not a script. Nothing here may be published until it is filmed with a real Lunchies parent who has given written consent to use their name, face and words. Do not write lines for them, do not add numbers or results, and do not voice this with an actor. If no consented parent is available, publish the brand card alone and keep this slot empty.",
  },
];

/* -------------------------------------------------------------------------- */
/* 14-day campaign calendar                                                   */
/* -------------------------------------------------------------------------- */

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type ContentType =
  | "Carousel"
  | "Reel"
  | "Story"
  | "Short video"
  | "Static post"
  | "Poll"
  | "Q&A";

/** Every calendar day points at a real social post or video script. */
export type ContentReference = SocialPostId | VideoScriptId;

export type CampaignDay = {
  day: number;
  weekday: Weekday;
  channel: SocialChannel;
  contentType: ContentType;
  topic: string;
  reference: ContentReference;
};

export const CAMPAIGN_CALENDAR: CampaignDay[] = [
  {
    day: 1,
    weekday: "Monday",
    channel: "Instagram",
    contentType: "Carousel",
    topic: "Launch the week: what a balanced lunchbox actually looks like",
    reference: "post-01",
  },
  {
    day: 2,
    weekday: "Tuesday",
    channel: "TikTok",
    contentType: "Short video",
    topic: "The nine-minutes-before-we-leave morning",
    reference: "script-01",
  },
  {
    day: 3,
    weekday: "Wednesday",
    channel: "Instagram",
    contentType: "Static post",
    topic: "Named ingredients and why we keep the label short",
    reference: "post-07",
  },
  {
    day: 4,
    weekday: "Thursday",
    channel: "TikTok",
    contentType: "Reel",
    topic: "Three lunches packed in ten minutes",
    reference: "post-04",
  },
  {
    day: 5,
    weekday: "Friday",
    channel: "Instagram",
    contentType: "Story",
    topic: "Snack swaps that still feel like treats",
    reference: "post-09",
  },
  {
    day: 6,
    weekday: "Saturday",
    channel: "Instagram",
    contentType: "Poll",
    topic: "Which lunchbox problem should we solve first?",
    reference: "post-10",
  },
  {
    day: 7,
    weekday: "Sunday",
    channel: "Instagram",
    contentType: "Carousel",
    topic: "Sunday planning ritual: pick the week, get the list",
    reference: "post-02",
  },
  {
    day: 8,
    weekday: "Monday",
    channel: "TikTok",
    contentType: "Short video",
    topic: "Plan once, eat all week",
    reference: "script-02",
  },
  {
    day: 9,
    weekday: "Tuesday",
    channel: "Instagram",
    contentType: "Static post",
    topic: "Allergies and preferences set once, respected every week",
    reference: "post-06",
  },
  {
    day: 10,
    weekday: "Wednesday",
    channel: "TikTok",
    contentType: "Reel",
    topic: "A Mexico City school morning, minute by minute",
    reference: "post-08",
  },
  {
    day: 11,
    weekday: "Thursday",
    channel: "Instagram",
    contentType: "Carousel",
    topic: "Variety without more work: how the week rotates",
    reference: "post-05",
  },
  {
    day: 12,
    weekday: "Friday",
    channel: "TikTok",
    contentType: "Q&A",
    topic: "Answering the lunchbox questions you sent us",
    reference: "post-10",
  },
  {
    day: 13,
    weekday: "Saturday",
    channel: "TikTok",
    contentType: "Short video",
    topic: "Parent story, filmed with a real consented Lunchies parent",
    reference: "script-03",
  },
  {
    day: 14,
    weekday: "Sunday",
    channel: "Instagram",
    contentType: "Story",
    topic: "Close the campaign: build next week's plan in a few minutes",
    reference: "post-03",
  },
];

/* -------------------------------------------------------------------------- */
/* Aggregate export                                                           */
/* -------------------------------------------------------------------------- */

export type MarketingData = {
  brand: Brand;
  persona: Persona;
  landingCopy: LandingCopy;
  socialPosts: SocialPost[];
  videoScripts: VideoScript[];
  campaignCalendar: CampaignDay[];
};

export const MARKETING_DATA: MarketingData = {
  brand: BRAND,
  persona: PERSONA,
  landingCopy: LANDING_COPY,
  socialPosts: SOCIAL_POSTS,
  videoScripts: VIDEO_SCRIPTS,
  campaignCalendar: CAMPAIGN_CALENDAR,
};
