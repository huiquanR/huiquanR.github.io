# Website publication list maintenance

When adding, removing, or correcting a publication, update the **entire** `Selected Publications` section in `index.htm` against the current PDF CV linked from the website. The PDF CV is the authority for the publication count, order, year, authors, title, journal, volume, issue, and pages. Do not update only the visible top items.

- Keep the visible top list and the expandable remainder disjoint: each publication appears exactly once across both lists.
- Preserve the PDF CV's publication order. If there are `N` publications and `T` visible top items, the top reversed `<ol>` starts at `N` and contains `T` items; the expandable reversed `<ol>` starts at `N - T` and contains the remaining `N - T` items. Together the rendered numbers must run consecutively from `N` to `1`, with no repeated or missing number.
- Update the expandable summary's count to the number of items it actually reveals. Do not call it a complete list when it contains only the remainder.
- After every publication edit, verify the total against the PDF CV, compare all entries across both lists for duplicate papers or links, and check the first and last displayed numbers in each list. Check both collapsed and expanded views before publishing.
