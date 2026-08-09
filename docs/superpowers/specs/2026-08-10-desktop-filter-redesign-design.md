# Desktop Filter Redesign

## Goal

Make PickleTagum's desktop filters readable and easy to scan, without changing the existing filtering logic or mobile-first behavior.

## Approved design

Desktop filters will use three distinct, wrapping groups rather than one compressed horizontal row:

1. **Location**: the existing area chips, including Everywhere and the More areas menu.
2. **Venue type**: the existing Indoor and Outdoor multi-select chips.
3. **Court capacity**: multi-select capacity chips labelled `1`, `2`, `3`, and `4+`.

The group labels replace the current ambiguous `Court` and `Courts` labels. The capacity label supplies the unit, so its chips remain compact numeric choices. Each capacity chip will retain an accessible label that states the number of courts represented.

## Behavior

- Location remains a single selection; Everywhere clears a specific area choice.
- Venue type remains a multi-select: Indoor and Outdoor may be active together.
- Court capacity remains a multi-select: a venue matches any active capacity value.
- Capacity mapping is exact for 1, 2, and 3 courts; `4+` matches four or more courts.
- Tapping/clicking an active type or capacity chip clears that selection.
- All filters continue to combine with text search using the current AND-between-groups and OR-within-group behavior.

## Responsive and accessibility requirements

- Desktop groups wrap cleanly inside the site shell without collisions or horizontal overflow.
- On wide screens, Location is the primary first row; Venue type and Court capacity appear as separate secondary controls below it.
- The existing mobile filter treatment remains compact and horizontally scrollable where needed.
- Filter controls remain native buttons with `aria-pressed`, visible keyboard focus, and readable group labels.

## Scope

Modify only the filter component, its client-side capacity logic, and the related responsive styles. Do not change the Supabase schema, add dependencies, or alter analytics.
