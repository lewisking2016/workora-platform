---
name: "taste-skill"
description: "Anti-slop frontend skill for high-quality, professional designs. Prevents templated AI looks and ensures stylistic consistency. Invoke when redesigning landing pages or portfolios."
---

# Taste Skill: Anti-Slop Frontend

This skill ensures that frontend development has "good taste" and avoids common AI design pitfalls.

## Core Rules
1. **Design Read**: Before coding, infer the design direction (e.g., "Premium B2B", "Technical Professional").
2. **Anti-AI Tells**: 
   - No generic "AI purple" or blue/purple gradients unless specifically requested.
   - No em-dashes (—) in marketing copy.
   - Avoid centered hero sections as the only option.
3. **Dials**:
   - `DESIGN_VARIANCE`: How experimental the layout is.
   - `MOTION_INTENSITY`: Complexity of animations.
   - `VISUAL_DENSITY`: Amount of information per screen.
4. **Typography & Spacing**: 
   - Use non-standard fonts (avoid Inter as default if possible).
   - Strict adherence to corner-radius consistency.
   - Generous, purposeful whitespace.

## Layout Principles
- Viewport-fitting heroes.
- Minimalist "eyebrow" labels.
- No repeating section layouts (alternate between grid, flex, text-heavy, etc.).
