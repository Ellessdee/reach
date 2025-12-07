
// Demographic percentages based on total population
export const DEMOGRAPHIC_DISTRIBUTION = {
    "Erw. 16+": 0.8539,
    "Erw. 18+": 0.8350,
    "Erw. 18-29": 0.1363,
    "Erw. 20-39": 0.2461,
    "Erw. 18-49": 0.3884,
    "Erw. 20-59": 0.5302,
    "Erw. 30-49": 0.2521,
    "Erw. 30-59": 0.4138,
    "Erw. 50+": 0.4471,
    "Erw. 60+": 0.2854,
    "Frauen 18-29": 0.0652,
    "Frauen 20-39": 0.1191,
    "Frauen 18-49": 0.1895,
    "Frauen 30-49": 0.1243,
    "Frauen 30-59": 0.2047,
    "Männer 18-29": 0.0711,
    "Männer 20-39": 0.1270,
    "Männer 18-49": 0.1989,
    "Männer 30-49": 0.1279,
    "Männer 30-59": 0.2091
};

export const TOPICS = [
    "Auto", "Beauty & Fashion", "Wirtschaft, Finanzen & News",
    "Food", "Gesundheit", "Lifestyle", "Living",
    "Entertainment", "Reise", "Sport", "Technik"
];

// Base assumption: 25% of population has Smart TV
const SMART_TV_RATIO = 0.25;

// Topic filter multiplier: 20%
const TOPIC_MULTIPLIER = 0.20;

export function calculateDemographics(population) {
    const demographics = {};
    for (const [key, ratio] of Object.entries(DEMOGRAPHIC_DISTRIBUTION)) {
        demographics[key] = Math.round(population * ratio);
    }
    return demographics;
}

export function calculateSmartTVPotential(population) {
    return Math.round(population * SMART_TV_RATIO);
}

export function calculateReach(selectedZones, demographicFilter, topicFilter) {
    let uniqueReach = 0;

    if (demographicFilter) {
        // Demographic specific reach
        uniqueReach = selectedZones.reduce((sum, zone) => {
            // Access demographics from the enriched properties
            // Note: Implementation depends on where we store this data. 
            // Assuming zone.properties.demographics or we look it up.
            // For now, assume it's attached to the zone properties
            const demographicValue = zone.properties.demographics?.[demographicFilter] || 0;
            return sum + Math.round(demographicValue * SMART_TV_RATIO);
        }, 0);
    } else {
        // Total Smart TV potential
        uniqueReach = selectedZones.reduce((sum, zone) =>
            sum + (zone.properties.smart_tv_potential || 0), 0
        );
    }

    // Apply topic filter
    if (topicFilter) {
        uniqueReach = Math.round(uniqueReach * TOPIC_MULTIPLIER);
    }

    return uniqueReach;
}

export function calculateImpressions(uniqueReach, frequency) {
    return uniqueReach * frequency;
}
