---
name: add-species
description: Add species from the suggestions file to the fixtures and update the suggest script. Use when the user says "add species", "add these species", or runs /add-species with species names. Takes scientific names or common names as arguments.
args: Species to add (scientific or common names, space-separated or comma-separated). If no arguments given, ask the user which species to add.
---

# Add Species to Fixtures

Add selected species from the latest suggestions file into `AppFixtures.php` and update `suggest-species.mjs`.

## Inputs

The user provides species names as arguments (scientific or common names). Match them case-insensitively against the latest suggestions file.

## Steps

### 1. Read source files

- Glob for `scripts/suggestions-*.md` and read the most recent one
- Read `api/src/DataFixtures/AppFixtures.php`
- Read `scripts/suggest-species.mjs`

### 2. Parse the suggestions

For each requested species, extract from the suggestions file:
- Scientific name, common name, kingdom, family
- Habitat, conservation status, and kingdom-specific attributes (wingspan for birds, maxHeight for trees, substrate for fungi)
- All proposed relationships (subject, object, type, description)
- The fixture snippet (use as reference, but adapt to match the actual variable names in AppFixtures.php)

If a requested species is not found in the suggestions file, warn the user and skip it.
If a requested species is already in the fixtures, warn the user and skip it.

### 3. Determine variable names

Map scientific names to PHP variable names using the convention in AppFixtures.php:
- Use camelCase based on the common name or a recognizable shorthand
- For references to existing species, find the actual variable name used in AppFixtures.php (e.g., `$oak` for Quercus robur, `$beech` for Fagus sylvatica)

### 4. Check for new families

If a species requires a family not yet in AppFixtures.php, add it in the Families section, maintaining alphabetical order within the kingdom group.

### 5. Edit AppFixtures.php

**Add species** in the correct kingdom section (Birds, Trees, or Fungi), at the end of that section:
- `$var = $this->species($manager, ...)` call
- `$this->names($manager, $var, 'English Name', 'French Name')` call

**Add relationships** before `$manager->flush()`:
- Group them under a comment with the species name
- Use `$this->rel($manager, ...)` calls
- Reference existing variables for species already in the fixtures

### 6. Update suggest-species.mjs

**Add to `EXISTING_SPECIES`**: Add the new species to the correct kingdom array, matching the format `'Scientific name (Common Name) | Family'`.

**Add to `EXISTING_RELATIONSHIPS`**: Add all new relationships, matching the format `'Subject Common Name → Object Common Name: relationship_type'`.

### 7. Handle skipped species

After adding the selected species, check if there are other new candidates in the suggestions file that were NOT selected. Ask the user if they want to add any of the remaining ones to `SKIPPED_SPECIES` with a reason but do not add them automatically. If the user provides reasons, add them to the `SKIPPED_SPECIES` array.

### 8. Summarize

Output a summary:
- Species added (with relationship count)
- New families created (if any)
- Files modified
