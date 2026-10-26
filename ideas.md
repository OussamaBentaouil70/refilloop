# RefillLoop Design Direction

## Three stylistic approaches

### Theme Name: Quiet Utility
**Very Brief Intro:** A warm, editorial grocery-and-home aesthetic where everyday usefulness is elevated through calm composition, tactile materials, and natural color. It feels responsible without feeling worthy or precious.

**Probability:** 0.07

### Theme Name: Field Notes
**Very Brief Intro:** A compact, print-inspired system with handwritten annotations, label-like metadata, and modular storytelling. It frames refill shopping as a smart, practical habit built into modern domestic life.

**Probability:** 0.03

### Theme Name: Sunlit Loop
**Very Brief Intro:** A brighter, more optimistic direction that pairs soft kitchen light with strong green blocks and a terracotta signal color. It makes sustainability feel easy, sociable, and low-friction.

**Probability:** 0.09

## Chosen direction: Quiet Utility

### Design Movement
Contemporary editorial minimalism with the warmth of independent grocery packaging and the precision of a well-made utility catalogue. The interface should feel like a considered home object: familiar, useful, and built to last.

### Core Principles
1. **Useful before decorative.** Every surface should help customers understand, compare, or act.
2. **Warm restraint.** Cream, sage, forest green, and charcoal create a calm rhythm, with terracotta used sparingly as a directional signal.
3. **Tactile clarity.** Soft paper-like surfaces, fine rules, cropped photography, and quiet texture create depth without visual noise.
4. **Human-scale confidence.** Copy stays direct, specific, and encouraging; the brand never scolds or overclaims.

### Color Philosophy
Warm cream is the canvas: it reduces the environmental category's tendency toward cold clinical white and gives product photography a pantry-shelf feel. Deep forest green carries trust and durability. Sage provides breathable secondary fields. Charcoal keeps copy legible and grounded. Muted terracotta marks the moments that need a little energy: primary CTAs, savings, and small status cues. The signature brand color is **Loop Leaf #2F6B4F**, a medium forest that feels grown-in rather than glossy.

### Layout Paradigm
Use a left-anchored editorial composition rather than repeated centered marketing blocks. Large image-and-copy moments should have an off-center focal point, with narrow utility rails, irregular card spans, and generous negative space. Sections should feel like a sequence of purposeful spreads: promise, proof, choice, process, impact, invitation.

### Signature Elements
- A thin looping arrow-line motif that appears as a small graphic in section headers and behind process steps.
- Product cards with a small “refill / reuse / repeat” utility label and a paper-like warm surface.
- Terracotta action tabs and compact data callouts that behave like catalogue index marks.

### Interaction Philosophy
Interactions should reduce hesitation. Hover states lift the surface slightly and reveal practical information rather than ornamental motion. Quick view keeps users in context. Cart feedback is brief, visible, and anchored to the bag. Keyboard focus states are high-contrast, calm, and never hidden.

### Animation
Use short, tactile transitions: buttons compress to 97% on press, product imagery shifts up 3px on hover, and drawer/modal entry uses a 220ms ease-out with a 0.96 scale origin rather than appearing from zero. Section reveals use a subtle opacity-and-translate sequence only on first load. Respect reduced-motion preferences and do not animate high-frequency list interactions.

### Typography System
Use **DM Sans** for readable interface copy and **Fraunces** for editorial headlines. Headlines are sentence case, compact, and slightly characterful; labels use DM Sans at 11–12px with increased tracking. Body copy stays between 15–18px with a 1.55 line-height. Product prices use a heavier DM Sans weight for fast scanning. No all-caps paragraphs.

### Brand Essence
RefillLoop makes low-waste household shopping simple for busy people who want better routines without paying a premium for virtue. **Practical, optimistic, considered.**

### Brand Voice
Headlines are compact and affirmative. CTAs are active and concrete. Microcopy reassures with specifics: what arrives, when it arrives, and what the customer can change.

Example lines:
- “A cleaner cupboard, on repeat.”
- “Choose your bottle. We’ll handle the rest.”

### Wordmark & Logo
The wordmark is a sturdy lowercase “refillloop” with the double “o” transformed into a linked loop pair. The standalone mark is a circular arrow that wraps around a single leaf notch, designed to read clearly at favicon size and as a stamp on product cards.

### Signature Brand Color
**Loop Leaf — #2F6B4F**

## File-level implementation reminder
When editing CSS, components, or pages, preserve this direction: warm editorial minimalism, left-anchored layouts, tactile utility surfaces, DM Sans + Fraunces, Loop Leaf green, and terracotta action signals. Ask: *Does this reinforce or dilute Quiet Utility?*

## Style Decisions

- Use imagery as a quiet proof point rather than as a full-bleed lifestyle cliché.
- Prefer utility labels, thin rules, and compact data callouts over decorative badges.
- Keep actions terracotta and explanatory text forest/charcoal for readable hierarchy.

## Style Decisions

- Treat every page as a utility catalogue spread: add index tabs, thin rules, compact metadata rails, and small refill/reuse/repeat markers.
- Keep all imagery in one domestic refill world: amber bottles, pouches, pantry and bathroom surfaces, warm natural light, and no unrelated stock objects.
- Reserve terracotta for primary actions, savings, action tabs, and one rare campaign field; do not use it as a default section background.
- Use the looping-arrow line as a functional connector for process steps, impact timelines, and metadata—not as decoration.
