# PERSONAL GROWTH APPLICATION — PRODUCT & ENGINEERING BLUEPRINT

**Working codename:** `Evolve`

**One-line product:** A charming, game-like personal growth companion that turns ordinary daily actions into visible growth across seven life dimensions, inspired by the symbolic language of the seven chakras but explicitly positioned as a modern self-development framework rather than a medical or scientific chakra system.

**Primary objective:** Help users gradually develop seven aspects of their lives through small, personally relevant habits. The application starts almost frictionless and becomes richer only as the user's behavior creates a reason for more complexity.

---

## 0. PRODUCT NORTH STAR

The experience should make a user feel:

> “My ordinary life is already full of opportunities to grow. I don't need to become a different person overnight; I just need to notice what I'm doing and choose the next small action.”

The product should NOT feel like:

- a clinical mental-health product;
- a chakra-healing medical claim;
- a rigid habit checklist;
- a productivity dashboard overloaded with metrics;
- a game that manipulates users into opening the app repeatedly;
- a streak app that punishes missed days.

The desired loop is **meaning → action → recognition → visible growth → curiosity → another useful action**.

---

# 1. CONCEPT FOUNDATION

## 1.1 The seven aspects

Use the traditional seven-chakra vocabulary as an optional symbolic layer. Internally, the product should treat them as seven human-development dimensions:

| Aspect | Traditional name | Core life domain | Example behaviors |
|---|---|---|---|
| 1 | Muladhara | Grounding & stability | sleep routine, tidy room, budgeting, walking, eating regularly, planning essentials |
| 2 | Svadhisthana | Emotion & creativity | hobbies, music, art, emotional reflection, play, time with nature |
| 3 | Manipura | Agency & vitality | exercise, completing a task, setting a boundary, initiating something, focused work |
| 4 | Anahata | Connection & compassion | calling someone, gratitude, helping, quality time, kindness, self-compassion |
| 5 | Vishuddha | Expression & communication | honest conversation, journaling, speaking up, listening, writing, singing |
| 6 | Ajna | Attention & reflection | meditation, reading, digital detox, mindful pauses, reflection, learning |
| 7 | Sahasrara | Meaning & perspective | contemplation, spirituality, nature, values, gratitude, purpose reflection |

These are **design metaphors**, not claims that the human body contains scientifically established energy centers.

## 1.2 Core product principle: any relevant healthy behavior counts

The user does not need to perform yoga or chakra-specific exercises.

A behavior should contribute to an aspect when its meaning is relevant. Examples:

- “I went for a 30-minute walk” → Grounding + Vitality.
- “I finally called my sister” → Connection + Expression.
- “I cleaned my desk before work” → Grounding + Agency.
- “I painted for 20 minutes” → Emotion & Creativity.
- “I turned my phone off for an hour” → Attention & Reflection.
- “I wrote down what I actually want” → Expression + Reflection + Meaning.
- “I cooked a balanced dinner” → Grounding + Vitality.

Avoid forcing users into one-to-one mappings. A single behavior can nourish several dimensions.

## 1.3 Evidence-informed behavior design

The application should emphasize self-monitoring, goal setting, prompts/cues, feedback, personalization, and positive reinforcement. A systematic review of digital interventions for habit formation found self-monitoring, goal setting, prompts/cues, feedback, and personalization among the most common design strategies. citeturn819869search2

Behavior should be easy enough to perform in context. The Fogg Behavior Model frames behavior as requiring motivation, ability, and a prompt at the same moment, and specifically emphasizes simplifying a behavior when possible. citeturn819869search0turn819869search3

The product may use gameful mechanics, but prioritize autonomy, competence, and meaningful progress over coercive retention mechanics. Recent reviews discussing gamification and self-determination theory emphasize autonomy, competence, relatedness, personalization, challenge, narrative, feedback, and progress; they also note that a heavy collection of game features can become cognitively demanding. citeturn819869search9turn819869search11

---

# 2. THE CORE EXPERIENCE

## 2.1 The user's “world”

The home screen is not a checklist. It is a **living personal ecosystem**.

Visual idea:

- a central evolving organism / tree / constellation;
- seven surrounding growth nodes, one per aspect;
- each aspect has its own hue;
- weak dimensions are desaturated, cooler, closer to gray;
- healthy/improving dimensions become warmer, richer, more luminous;
- the whole environment subtly changes as the user's life changes.

Do NOT make it look like seven disconnected progress bars.

Think “evolutionary game map” more than “habit tracker”.

## 2.2 The universal loop

1. **Notice:** App recognizes or asks about something the user did.
2. **Translate:** Behavior is mapped to one or more aspects.
3. **Reward meaningfully:** The user sees what changed and why it matters.
4. **Grow:** The relevant colors, world objects, traits, or narrative evolve.
5. **Offer a next step:** One tiny optional action is suggested.
6. **Return naturally:** The user's own routine, not an aggressive notification strategy, creates the next opportunity.

## 2.3 “One next thing” rule

At any point, the user should be able to answer:

> “What is one useful thing I can do now?”

Do not present 20 recommended tasks on first launch.

---

# 3. ONBOARDING

## 3.1 First-launch experience

Target: **under 90 seconds** before the user can reach the home world.

Screen 1 — Welcome

Copy concept:

> “Your life is already growing. Let’s see where.”

Screen 2 — Choose what matters

Present 7 simple aspect cards with human language first and chakra name second.

Example:

- Grounded — Muladhara
- Creative — Svadhisthana
- Driven — Manipura
- Connected — Anahata
- Expressive — Vishuddha
- Clear-minded — Ajna
- Purposeful — Sahasrara

Allow selecting 1–3 areas to pay more attention to. Never imply the others are irrelevant.

Screen 3 — Pick a starting rhythm

Choices:

- “Tiny — 2 minutes”
- “Light — 10 minutes”
- “Open-ended — I’ll log naturally”

Screen 4 — First action

Offer 3 very easy choices generated across different dimensions.

Examples:

- Drink a glass of water.
- Step outside for 3 minutes.
- Send one kind message.

The objective is to create an immediate success, not a commitment burden.

Screen 5 — Reveal the world

The user's personal ecosystem appears with the seven colors currently mostly muted. The first completed action creates the first visible warmth.

---

# 4. INITIAL STATE → ADAPTIVE COMPLEXITY

This is a central product rule.

## 4.1 Complexity should be earned

Start with only:

- seven aspects;
- one home world;
- one “add what you did” action;
- one daily reflection;
- simple color feedback.

Only unlock new concepts when behavior suggests they will help.

## 4.2 Progressive evolution examples

After 3 logged behaviors:

- show aspect history;
- introduce a small “growth event”.

After ~7 behaviors:

- introduce personal routines;
- begin recognizing recurring patterns.

After ~14 behaviors:

- introduce “evolution traits” such as “Morning Grounder” or “Connector”.

After ~21–30 behaviors:

- offer optional quests;
- offer weekly reflection;
- offer personalized experiments.

Never use days as a hard gate if the user is inactive. Unlock through meaningful interaction count or demonstrated need.

## 4.3 Adaptive UI principle

The app should become **more capable, not more crowded**.

New functionality should replace or collapse into existing surfaces rather than adding permanent tabs.

---

# 5. BEHAVIOR INPUT SYSTEM

## 5.1 Logging methods

Support three levels from MVP onward:

### A. “I did something” quick log

One-tap entry from a flexible action picker.

### B. Natural-language log

Example:

> “I cooked dinner and talked to my friend.”

The system extracts candidate behaviors and maps them to aspects.

Show the mapping before saving when uncertainty is material.

### C. Structured habit

Optional recurring habit with:

- name;
- frequency;
- preferred cue/time;
- effort estimate;
- target aspect(s).

Do not require users to define a formal habit to use the app.

## 5.2 Behavior taxonomy

Each behavior has:

```text
Behavior
- id
- userId
- title
- description?
- source: manual | recurring | imported | system_suggestion
- timestamp
- duration?
- effort: tiny | light | moderate | substantial
- aspectWeights: [7 floats]
- evidenceType
- confidence
- emotionalTag?
- notes?
```

## 5.3 Aspect mapping

Use a weighted vector instead of one label.

Example:

```json
{
  "grounding": 0.8,
  "creativity": 0.0,
  "agency": 0.4,
  "connection": 0.1,
  "expression": 0.0,
  "attention": 0.1,
  "meaning": 0.0
}
```

Weights should be interpretable and editable.

The user can always say:

> “This felt more like creativity than productivity.”

This becomes valuable personalization data.

---

# 6. GROWTH / SCORING ENGINE

## 6.1 Do NOT use a simplistic 0–100 health score

The score should not imply that a person is objectively “healthy” or “unhealthy” in an aspect.

Instead use an internal **Growth Energy** value for visual progression.

Recommended internal range: `0–1000` per aspect.

User-facing language should prefer:

- dormant;
- awakening;
- warming;
- flourishing;
- radiant;

or similarly non-clinical language.

Avoid “deficient”, “damaged”, “blocked”, or diagnoses.

## 6.2 Growth Energy model

For each aspect:

```text
raw_gain = base_value
          × effort_multiplier
          × consistency_bonus
          × personal_relevance
          × novelty_factor
```

Then apply:

```text
energy_t = clamp(
  energy_{t-1}
  + raw_gain
  - gentle_decay,
  0,
  1000
)
```

### Recommended behavior

- Tiny actions always produce some progress.
- Larger actions produce more, but not proportionally more.
- Consistency matters more than heroic one-off actions.
- Missed days should produce only gentle visual fading, never a punishment.
- Repeated behaviors can continue contributing, but diminishing returns should prevent grinding.

## 6.3 Why gentle decay?

The world should visually communicate that growth needs attention, but it must never create shame.

Possible implementation:

```text
warmth = 0.85 + 0.15 * normalized_recent_energy
saturation = 0.20 + 0.80 * normalized_recent_energy
```

Use smoothing over 7–14 days so one missed day does not radically change the appearance.

## 6.4 Momentum

Separate **level** from **momentum**.

Level = accumulated long-term growth.

Momentum = recent engagement.

This allows a user to have:

> “A mature foundation, currently resting.”

instead of visually feeling like they lost everything because they missed a few days.

---

# 7. COLOR SYSTEM

This is one of the signature mechanics.

## 7.1 Seven base hues

Suggested palette direction:

- Grounding — red
- Creativity — orange
- Agency — yellow
- Connection — green
- Expression — blue
- Reflection — indigo/violet
- Meaning — violet/white

Exact colors should be defined in a design token file, not hard-coded across components.

## 7.2 Warmth model

Each aspect has a `warmth` parameter from `0.0 → 1.0`.

At low warmth:

- hue approaches neutral gray;
- saturation is low;
- lightness is muted;
- animations are minimal.

At high warmth:

- hue becomes more saturated;
- subtle glow appears;
- particles or environmental details become richer;
- the aspect's corresponding world element evolves.

## 7.3 Avoid misleading “red = bad” semantics

Warmth means **recent attention / growth activity**, not worth or virtue.

A faded aspect should look peaceful, quiet, dormant—not broken.

---

# 8. THE EVOLUTIONARY GAME LAYER

The application is game-like, but the reward is the visualization of real life progress.

## 8.1 Evolution instead of points

Instead of “You earned 10 coins”, say:

> “Your Grove became denser.”

or:

> “Your Expression path opened.”

The user's growth changes a persistent world.

## 8.2 World-building model

Each aspect owns a world region.

Examples:

- Grounding → roots, stones, earth, shelter
- Creativity → flowers, pigments, streams, unusual plants
- Agency → sun, pathways, towers, movement
- Connection → bridges, birds, shared spaces
- Expression → wind, ribbons, bells, flowing symbols
- Reflection → stars, pools, mirrors, lanterns
- Meaning → sky, constellations, horizon, temple-like abstract geometry

Do not copy religious iconography aggressively. Keep the experience respectful and contemporary.

## 8.3 Evolution stages

Each aspect can evolve through 6 abstract stages:

```text
Dormant
  ↓
Seed
  ↓
Sprout
  ↓
Established
  ↓
Flourishing
  ↓
Radiant
```

Stage changes should be infrequent and memorable.

## 8.4 Discovery events

After meaningful progress, reveal a short moment:

> “Something changed here.”

A new visual detail appears.

This gives the user the feeling of discovery without requiring conventional loot-box mechanics.

## 8.5 Traits

Traits are narrative summaries generated from actual behavior.

Examples:

- “The Early Walker”
- “The Quiet Listener”
- “The Finisher”
- “The Maker”
- “The Reconnector”
- “The Reflector”
- “The Steady One”

Traits should be descriptive, not identity traps.

Users can outgrow them.

---

# 9. DAILY EXPERIENCE

## 9.1 Home screen

Primary elements only:

1. Living world / seven aspects.
2. “What did you do?” button.
3. One optional “small next step”.
4. Today indicator.
5. Gentle summary of recent growth.

No dashboard wall of numbers.

## 9.2 Quick logging flow

Tap:

> `+ I did something`

Then options:

- type naturally;
- choose a recent habit;
- choose a suggested tiny action;
- optionally use voice input.

After entry:

```text
“You spent 20 minutes walking.”

Grounding +
Vitality +

[Save]
```

Then the relevant world areas visibly respond.

## 9.3 Daily reflection

One question only.

Rotate questions such as:

- “What gave you energy today?”
- “What felt meaningful?”
- “Where did you show courage?”
- “What helped you feel connected?”
- “What would make tomorrow 1% easier?”

Responses should optionally become behaviors or insights.

---

# 10. ROUTINES

Routines are optional and should emerge naturally.

## 10.1 User-created routine

Example:

> “After coffee, I walk for 10 minutes.”

Store:

```text
Routine
- trigger/context
- action
- optional duration
- preferred days
- aspectWeights
- active/inactive
```

## 10.2 Adaptive routines

The system may notice:

> “You often walk after lunch.”

Then offer:

> “This already looks like a routine. Add it?”

One tap confirms.

## 10.3 Routine evolution

A routine can evolve:

```text
Remembered
→ Emerging
→ Familiar
→ Automatic-looking
→ Integrated
```

Do NOT claim scientifically that the behavior has become automatic based solely on app logs. “Integrated” is an app metaphor.

---

# 11. QUESTS

Quests should help users explore an aspect without becoming a rigid curriculum.

Examples:

### Grounding quest
> “Create a calmer landing zone.”
> Do one 5-minute reset of your room.

### Creativity quest
> “Make something without a goal.”
> Draw, cook, write, photograph, or build for 10 minutes.

### Agency quest
> “One thing you have been postponing.”
> Take the smallest meaningful first step.

### Connection quest
> “Close one distance.”
> Send a message you have been meaning to send.

### Expression quest
> “Say the true thing kindly.”
> Practice one honest sentence.

### Reflection quest
> “Twenty quiet breaths.”
> Sit without a screen and observe.

### Meaning quest
> “Remember why.”
> Write three sentences about something that matters to you.

The user should be free to complete a different behavior that achieves the same intent.

---

# 12. WEEKLY REFLECTION

Unlocked after enough data exists.

Example weekly card:

```text
YOUR WEEK

Grounding     warming ↑
Creativity    steady
Agency        flourishing ↑
Connection    warming
Expression    quiet
Reflection    warming ↑
Meaning       resting

You gave the most attention to movement,
finishing tasks, and reconnecting with people.

One idea for next week:
Bring a little more attention to Expression.
```

Do not call the user “weak” or “imbalanced”.

Use language like:

> “This area has received less attention lately.”

---

# 13. NOTIFICATIONS

Notifications are a support mechanism, not a retention weapon.

Default:

- minimal;
- user-controlled;
- context-sensitive;
- never guilt-based.

Good:

> “You usually take a short walk around now. Still useful today?”

Bad:

> “Your streak is dying! Open now!”

Allow notification intensity:

- quiet;
- balanced;
- frequent.

Default to quiet/balanced.

---

# 14. SOCIAL FEATURES

Do NOT make social comparison the core loop.

Future possibilities:

- private encouragement;
- shared quests with a friend;
- collaborative world-building;
- “grow together” sessions.

Avoid leaderboards for personal growth by default. Comparing people's life circumstances can distort the meaning of the system and undermine autonomy.

---

# 15. MOTIVATIONAL DESIGN GUARDRAILS

The app should be engaging and game-like, but not engineered to create compulsive use.

Use:

- surprise through discovery;
- meaningful progress;
- personalization;
- visual evolution;
- gentle challenges;
- narrative;
- mastery;
- autonomy;
- celebrations.

Avoid:

- loss aversion traps;
- shame for missed days;
- fear-based notifications;
- infinite reward loops with no real-life benefit;
- deceptive timers;
- artificial scarcity;
- randomized paid rewards;
- social pressure as default.

The desired success metric is **useful real-world behavior**, not minutes spent in the app.

---

# 16. CONTENT DESIGN

## 16.1 Voice

Charming, warm, observant, lightly mysterious.

The app can speak like a gentle guide:

> “Your evening walk warmed the roots.”

But not:

> “Your Root Chakra is now medically balanced.”

## 16.2 Avoid absolute promises

Never claim:

- chakra activation cures illness;
- balancing chakras changes medical conditions;
- food cleanses energy centers;
- meditation guarantees mental-health outcomes.

Frame yoga, breathing, meditation, reflection, movement, nutrition, relationships, and other behaviors as ordinary self-care practices with context-dependent benefits.

## 16.3 Microcopy examples

After action:

> “That counts.”

After tiny action:

> “Small is still movement.”

After missed days:

> “Your world is still here.”

After returning:

> “Welcome back. Nothing was lost.”

After repeated habit:

> “This is becoming part of your rhythm.”

---

# 17. PERSONALIZATION ENGINE

The application should learn from:

- which behaviors the user actually completes;
- which suggested actions are ignored;
- preferred times;
- typical effort tolerance;
- self-rated relevance;
- which aspects consistently receive attention;
- which reflections the user writes;
- whether reminders help or annoy.

## 17.1 Personal relevance model

Each user has a learned weight for behavior → aspect mapping.

Example:

```text
Generic mapping:
Walking → Grounding .7, Agency .3

User history:
Walking → Grounding .9, Agency .1
```

Allow correction:

> “What did this mean to you?”

Options:

- grounding;
- vitality;
- freedom;
- connection;
- focus;
- other.

## 17.2 Recommendation algorithm

Candidate action score:

```text
recommendationScore =
    relevance
  × ease
  × contextFit
  × novelty
  × desiredAspectBoost
  × recentSuccessProbability
```

Constrain recommendations to low cognitive load.

At most 3 candidate actions, but show only one as the primary suggestion.

---

# 18. AI FEATURES

AI may be valuable, but it should augment the user's agency rather than pretend to know them perfectly.

## 18.1 AI behavior interpretation

Input:

> “I stayed late at work, skipped the gym, but called my dad.”

Output draft:

```text
I noticed:
+ Connection — calling your dad
+ Agency — sustained effort at work

Anything you'd like to add?
```

User confirms before permanent scoring when classification is ambiguous.

## 18.2 AI reflection coach

Ask:

> “What would support you tomorrow?”

AI responds with one practical suggestion.

## 18.3 AI weekly synthesis

Summarize observed patterns without diagnosing.

Good:

> “You tended to feel more active on days when you took a morning walk.”

Bad:

> “You have an anxiety problem caused by low Ajna energy.”

---

# 19. DATA MODEL

Recommended entities:

```text
User
- id
- createdAt
- locale
- timezone
- preferences

Aspect
- id
- key
- displayName
- chakraName
- baseHue
- description

UserAspect
- userId
- aspectId
- energy
- momentum
- warmth
- level
- lastActivityAt
- lifetimeActions

Behavior
- id
- userId
- title
- timestamp
- duration
- effort
- source
- notes
- createdAt

BehaviorAspect
- behaviorId
- aspectId
- weight
- confidence
- userConfirmed

Routine
- id
- userId
- title
- cue
- schedule
- effort
- active
- aspectWeights

Quest
- id
- aspectId
- title
- description
- difficulty
- candidateBehaviors

QuestProgress
- userId
- questId
- progress
- startedAt
- completedAt

Reflection
- id
- userId
- prompt
- response
- timestamp

Trait
- id
- userId
- type
- confidence
- discoveredAt
- active

EvolutionEvent
- id
- userId
- aspectId
- type
- payload
- createdAt
```

---

# 20. FRONTEND ARCHITECTURE

Use a component architecture that supports progressive complexity.

Suggested structure:

```text
App
├── Onboarding
├── WorldHome
│   ├── LivingWorld
│   ├── AspectNode
│   ├── QuickLogButton
│   ├── NextActionCard
│   └── DailyReflection
├── LogFlow
│   ├── NaturalLanguageInput
│   ├── SuggestionPicker
│   └── Confirmation
├── AspectDetail
├── Routines
├── Quests
├── WeeklyReflection
├── Profile
└── Settings
```

Keep navigation minimal in MVP:

```text
World | Log | Me
```

More screens can be progressively surfaced when useful.

---

# 21. DESIGN SYSTEM

## 21.1 Visual language

Target aesthetic:

**evolutionary game × cozy nature × subtle mysticism × modern mobile design**.

Avoid:

- overly literal religious imagery;
- sterile corporate wellness visuals;
- neon “gambling app” aesthetics;
- excessive badges and popups.

## 21.2 Motion principles

Motion should communicate growth.

Examples:

- a plant subtly expands after a behavior;
- particles follow a path toward an active aspect;
- a muted color warms over 300–800 ms;
- a new trait appears as a small discovery;
- the world breathes slowly when idle.

Respect reduced-motion accessibility settings.

## 21.3 Typography

Use one expressive display face paired with a highly readable UI font, with a restrained hierarchy.

## 21.4 Sound

Optional ambient sounds can make evolution feel physical:

- root: low, warm texture;
- creative: light organic tones;
- agency: bright pulse;
- connection: soft harmonics;
- expression: airy movement;
- reflection: sparse tones;
- meaning: spacious chime.

All sound must be optional.

---

# 22. ACCESSIBILITY

Must support:

- WCAG-oriented contrast;
- color-blind-safe indicators;
- reduced motion;
- screen readers;
- large text;
- haptics optional;
- keyboard navigation where applicable;
- no color-only meaning;
- plain-language alternatives to metaphor.

Color warmth must always be accompanied by a textual state or iconography.

---

# 23. PRIVACY & DATA ETHICS

Personal growth data can reveal sensitive lifestyle patterns.

Principles:

- collect only what is necessary;
- explain why data is used;
- make AI processing transparent;
- provide export/delete controls;
- do not sell personal behavior data;
- do not infer sensitive medical or psychological conditions;
- keep wellness scores private by default;
- make social sharing opt-in.

If health integrations are added later, revisit the applicable privacy and regulatory requirements for each launch jurisdiction.

---

# 24. MVP SCOPE

The first implementation should be intentionally small.

## MVP must include

### Product

- onboarding;
- seven aspects;
- living-world home screen;
- quick behavior logging;
- manual aspect confirmation;
- growth engine;
- warmth/color transformation;
- simple history;
- daily reflection;
- one next-action suggestion;
- settings/privacy basics.

### Visual

- seven color tokens;
- muted → warm transition;
- basic evolutionary scene;
- lightweight micro-animation;
- empty states.

### Data

- user;
- behavior;
- behavior-aspect mapping;
- user-aspect energy;
- reflection.

## MVP should NOT include

- social network;
- leaderboards;
- complicated RPG inventory;
- wearable integrations;
- marketplace;
- payments;
- complex AI coach;
- dozens of quest types;
- elaborate avatar customization.

---

# 25. PHASED ROADMAP

## Phase 0 — Prototype

Goal: prove the emotional effect of the world changing.

Build:

- 7 nodes;
- manual “I did something” entry;
- simple aspect mapping;
- warmth interpolation;
- one evolution animation.

Success question:

> “Can a user understand the idea in under one minute and feel that their real actions are changing something?”

## Phase 1 — Habit foundation

Add:

- recurring routines;
- reminders;
- weekly reflection;
- trend views;
- personalized suggestions.

## Phase 2 — World evolution

Add:

- multiple environmental states;
- traits;
- discovery events;
- quests;
- richer narrative.

## Phase 3 — Intelligence

Add:

- natural-language logging;
- AI mapping suggestions;
- adaptive recommendations;
- pattern insights.

## Phase 4 — Optional social layer

Add:

- shared quests;
- friend support;
- co-growth experiences.

Only after core individual value is proven.

---

# 26. SUCCESS METRICS

Optimize for real growth behavior, not addictive screen time.

Primary:

- percentage of new users who complete one meaningful real-world action;
- weekly active users who log at least one meaningful action;
- percentage of users who return after 7/30 days;
- number of distinct life dimensions receiving attention;
- percentage of suggested actions accepted and completed;
- self-reported usefulness;
- percentage of users who keep a routine alive for several weeks.

Secondary:

- average time-to-first-action;
- logging completion rate;
- notification opt-in and mute rates;
- reflection completion;
- recommendation acceptance.

Guardrail metrics:

- notification disable rate;
- reported pressure/guilt;
- excessive session frequency;
- night-time usage spikes;
- users abandoning routines after punitive feedback.

Avoid optimizing for:

- raw session duration;
- infinite scrolling;
- number of taps;
- streak length alone.

---

# 27. EXPERIMENT FRAMEWORK

Every major feature should have a hypothesis.

Example:

```text
Hypothesis:
Visual warmth feedback helps users understand progress better than numeric scores.

Variant A:
Numeric progress only.

Variant B:
Color/world evolution only.

Variant C:
Color + concise text explanation.

Measure:
- comprehension
- repeat behavior
- perceived usefulness
- pressure/guilt
```

Favor experiments that improve understanding, autonomy, and real-world action.

---

# 28. EDGE CASES

## User logs nothing

Show a peaceful dormant world, not failure.

Prompt:

> “Start wherever you are.”

Offer one tiny action.

## User logs one aspect repeatedly

Do not force balance.

Say:

> “You’ve been putting energy here lately. Another area is quieter, too.”

Offer—not require—an alternative.

## User logs many actions

Prevent grinding.

Diminishing returns and a daily soft cap can preserve meaning without making a high-frequency user feel punished.

## User edits a behavior

Recalculate downstream aspect weights and evolution events deterministically where possible.

## User changes interpretation

Update future personalization without rewriting history unless the user explicitly edits the original record.

## User deletes data

Cascade-delete or anonymize dependent records according to product policy.

---

# 29. TECHNICAL RECOMMENDATION

The coding agent should choose a conventional, maintainable stack appropriate to the target platform. Keep these architectural requirements stable regardless of stack:

- typed domain model;
- deterministic growth engine separated from UI;
- design tokens for all visual semantics;
- local-first or resilient offline logging where feasible;
- server synchronization isolated from behavior scoring;
- analytics events defined through a typed schema;
- feature flags for experimental mechanics;
- migration strategy for evolving data models.

## Domain services

```text
BehaviorClassifier
AspectScoringEngine
GrowthEngine
WarmthRenderer
RecommendationEngine
QuestEngine
ReflectionEngine
NotificationScheduler
EvolutionEventEmitter
```

Keep `GrowthEngine` deterministic and unit-testable.

---

# 30. CORE ALGORITHMIC PSEUDOCODE

```pseudo
function logBehavior(user, behavior):
    candidates = classifyBehavior(behavior)
    mappings = user.confirmOrEdit(candidates)

    for mapping in mappings:
        gain = calculateGain(
            aspect=mapping.aspect,
            effort=behavior.effort,
            relevance=user.relevance(mapping.aspect, behavior),
            consistency=user.consistency(mapping.aspect),
            novelty=noveltyFactor(user, behavior)
        )

        userAspect[mapping.aspect].energy += gain * mapping.weight
        userAspect[mapping.aspect].momentum = updateMomentum(...)

    for aspect in allAspects:
        userAspect[aspect].warmth = smoothWarmth(
            userAspect[aspect].energy,
            userAspect[aspect].momentum
        )

    events = detectEvolutionChanges(user)
    persist(behavior, mappings, user)
    return events
```

---

# 31. ANALYTICS EVENT SCHEMA

Examples:

```text
onboarding_started
onboarding_completed
first_action_logged
behavior_logged
behavior_mapping_confirmed
behavior_mapping_edited
reflection_completed
suggestion_shown
suggestion_accepted
suggestion_completed
routine_created
routine_completed
quest_started
quest_completed
evolution_discovered
weekly_reflection_viewed
notification_opened
notification_muted
user_export_requested
user_delete_requested
```

Never send raw reflection text to analytics.

---

# 32. QA CHECKLIST

## Functional

- A new user can complete the first action quickly.
- Each action can map to multiple aspects.
- Growth persists across sessions.
- Colors respond smoothly.
- Missed days do not wipe progress.
- Editing an action recalculates correctly.
- Deleting an action removes its contribution.
- Time zones are handled correctly.

## UX

- User can understand the seven dimensions without prior chakra knowledge.
- User can skip chakra-specific language.
- Every growth message explains itself.
- No screen requires understanding hidden scoring rules.
- Primary action is always obvious.

## Accessibility

- Color is not the only indicator.
- Reduced-motion mode works.
- Text scaling works.
- Contrast is acceptable.
- Screen-reader labels describe aspect state.

## Ethical design

- No guilt-based reminders.
- No punitive streak reset.
- No manipulative scarcity.
- No medical promises.
- No diagnosis from behavior.
- No public ranking by default.

---

# 33. FIRST 10 SCREENS TO DESIGN

1. Welcome / value proposition
2. Seven aspects introduction
3. Tiny first action
4. First world reveal
5. Home world — empty-ish state
6. Quick log flow
7. Behavior → aspect confirmation
8. Growth animation / evolution event
9. Aspect detail
10. First weekly reflection

Design these before creating the full application.

---

# 34. FIRST 20 BEHAVIORS TO SUPPORT NATIVELY

The system should recognize common actions without requiring the user to manually categorize them:

1. Walked outside
2. Exercised
3. Slept on time / improved sleep routine
4. Cooked a meal
5. Drank water
6. Tidied a space
7. Completed an important task
8. Started something postponed
9. Set a boundary
10. Did something creative
11. Played music
12. Spent quality time with someone
13. Helped someone
14. Called/messaged someone
15. Had an honest conversation
16. Journaled
17. Read
18. Meditated
19. Took a screen break
20. Reflected on values / purpose

Natural-language input should allow unlimited additional behaviors.

---

# 35. SAMPLE USER JOURNEY

## Day 1

User cleans their room.

App:

> “Your Grounding space feels a little warmer.”

One root structure appears.

## Day 2

User calls a friend.

App:

> “Connection grew around something simple: showing up.”

A small bridge appears.

## Day 3

User goes for a walk.

Grounding warms further. Agency gets a small secondary boost.

## Day 5

User writes in a journal.

Reflection and Expression respond.

## Day 8

App notices repeated walking.

> “Walking keeps returning in your week. Want to turn it into a gentle routine?”

## Day 14

A trait appears:

> “Steady Mover”

Not because the user achieved a leaderboard rank, but because a behavior pattern emerged.

## Day 21

A new world element unfolds.

> “You’ve been giving your life more structure. Something new has taken root.”

This is the emotional product payoff: **the user's ordinary life visibly accumulates.**

---

# 36. PRODUCT LANGUAGE: CHAKRA VS MODERN FRAMEWORK

Recommended default:

```text
Grounding
Muladhara

Creativity
Svadhisthana

Agency
Manipura

Connection
Anahata

Expression
Vishuddha

Reflection
Ajna

Meaning
Sahasrara
```

This avoids requiring users to know Sanskrit while preserving the inspiration.

Settings can offer:

> “Show chakra names” — On / Off

Default can depend on onboarding preference.

---

# 37. DESIGN PRINCIPLES FOR THE CODING AGENT

1. **Start tiny.** The first version should feel understandable without a tutorial.
2. **Make real life the game board.** App activity is not the goal.
3. **Use the seven dimensions as a poetic organizing model.**
4. **Let any relevant healthy behavior count.**
5. **Growth should be visible, not merely numeric.**
6. **Color warmth is the emotional feedback language.**
7. **Weakness means “less recent attention,” not “something wrong with you.”**
8. **Complexity unlocks through need and behavior.**
9. **Prefer autonomy over pressure.**
10. **Make every major interaction reversible and understandable.**
11. **AI suggests; the user remains the authority on meaning.**
12. **Optimize for beneficial life change, not compulsive app engagement.**

---

# 38. DEFINITION OF DONE FOR V1

V1 is ready when a first-time user can:

1. understand the seven dimensions;
2. perform or log a real-world action within the first minute;
3. see that action influence one or more aspects;
4. understand the muted → warm visual metaphor;
5. return later and see accumulated growth;
6. receive one sensible next action;
7. use the system without knowing anything about chakras;
8. miss several days without feeling punished;
9. understand and edit how an action was interpreted;
10. delete/export their data.

The product is successful when users say some version of:

> “It makes me notice that the small things I do are building a life.”

---

# 39. REFERENCE NOTES

The habit-design portions of this blueprint are informed by research and established behavior-design frameworks rather than by claims that chakras are scientifically established.

- Systematic review of digital behavior-change interventions for habit formation, including self-monitoring, goal setting, prompts/cues, feedback, personalization, and virtual rewards: https://pmc.ncbi.nlm.nih.gov/articles/PMC11161714/ citeturn819869search2
- Systematic review/meta-analysis on health behavior habit formation and determinants: https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/ citeturn819869search7
- Fogg Behavior Model overview: https://www.behaviormodel.org/ citeturn819869search0
- Fogg on simplicity/ability: https://www.behaviormodel.org/ability citeturn819869search3
- Recent review discussion of gamification, self-determination theory, and autonomy/competence/relatedness: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1839092/full citeturn819869search9
- Recent review discussion of gamification feature richness and self-determination in exercise adherence: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1671543/full citeturn819869search11

---

# 40. FINAL BUILD BRIEF

Build a mobile-first personal growth application where the user's **life is the source of progress**.

The seven chakra-inspired dimensions provide the mental model. Ordinary activities provide the inputs. The growth engine turns those actions into a soft, non-judgmental progression state. The visual world makes that progression tangible. The system gradually learns what matters to the person and only adds complexity when the user has earned or requested it through use.

The signature UX is:

**Do something real → log it effortlessly → watch your world respond → understand what it nourished → choose one next useful action → return to life.**

The product should feel like an evolutionary game, but the player never wins by spending more time inside the game. They win by living a little more deliberately outside it.
