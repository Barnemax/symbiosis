---
name: review-suggestions
description: Review species suggestions and recommend which to add to the fixtures. Use when the user says "review suggestions", "which species should we add", or runs /review-suggestions. Reads the latest suggestions file and current fixtures, then provides a prioritized recommendation.
---

# Review Species Suggestions

Analyze the latest species suggestions against the current fixture data and recommend which to add.

## Steps

1. **Find the suggestions file.** Glob for `scripts/suggestions-*.md` and read the most recent one (by filename date).

2. **Read the current fixtures.** Read `api/src/DataFixtures/AppFixtures.php` to understand what species and relationships already exist.

3. **Read the suggest script.** Read `scripts/suggest-species.mjs` to see the `EXISTING_SPECIES`, `EXISTING_RELATIONSHIPS`, and `SKIPPED_SPECIES` arrays. This tells you what was already processed.

4. **Cross-reference.** For each suggested species in the suggestions file:
   - Check if it's already in the fixtures (by scientific name), mark as "already added"
   - Check if it's in `SKIPPED_SPECIES`, mark as "previously skipped"
   - Otherwise it's a new candidate

5. **Evaluate each new candidate.** Consider:
   - How many new relationships does it create?
   - Does it fill a coverage gap (species with few/no partners)?
   - Does it create chain connections between existing species?
   - Does it require a new family, or reuse an existing one?
   - Does it overlap significantly with something already in the database?

6. **Present your recommendation.** Group candidates into:
   - **Strong additions**: high relationship count, fills clear gaps, creates chains
   - **Decent but less impactful**: fewer relationships or overlaps with existing coverage
   - **Skip**: redundant or low value

For each candidate, briefly explain why in 1-2 sentences. End with a clear recommendation of which to add.

Do NOT make any file changes. This skill is read-only, it only analyzes and recommends.
