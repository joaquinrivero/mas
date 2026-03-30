/**
 * Returns a title unique among existingTitles.
 * If baseTitle already exists, appends -1, -2, … until unique.
 * If baseTitle ends with -N, strips the suffix before incrementing
 * so that successive clones produce -1, -2, -3 (not -1-1, -1-2).
 *
 * @param {string} baseTitle
 * @param {string[]} existingTitles
 * @returns {string}
 */
export function generateUniqueFragmentTitle(baseTitle, existingTitles) {
    const titleSet = new Set(existingTitles);
    if (!titleSet.has(baseTitle)) return baseTitle;

    const match = baseTitle.match(/^(.*)-(\d+)$/);
    const stem = match ? match[1] : baseTitle;
    let counter = 1;
    while (titleSet.has(`${stem}-${counter}`)) counter++;
    return `${stem}-${counter}`;
}
