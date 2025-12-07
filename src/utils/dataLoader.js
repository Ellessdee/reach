import Papa from 'papaparse';
import { calculateDemographics, calculateSmartTVPotential } from './calculations';

export async function loadContextData() {
    try {
        const [plzData, mappingData] = await Promise.all([
            fetch('/data/plz-5stellig-daten.csv').then(r => r.text()),
            fetch('/data/zuordnung_plz_ort.csv').then(r => r.text())
        ]);

        const parsedPlz = Papa.parse(plzData, { header: true, skipEmptyLines: true }).data;
        const parsedMapping = Papa.parse(mappingData, { header: true, skipEmptyLines: true }).data;

        const lookup = {};
        const cityMap = {}; // Helper to aggregate by city

        // First pass: Create lookup from population data
        parsedPlz.forEach(row => {
            const plz = row.plz;
            const population = parseInt(row.einwohner, 10) || 0;

            lookup[plz] = {
                plz,
                population,
                lat: parseFloat(row.lat),
                lon: parseFloat(row.lon),
                smart_tv_potential: calculateSmartTVPotential(population),
                demographics: calculateDemographics(population),
                city: '', // Will be filled from mapping
                district: '',
                state: ''
            };
        });

        // Second pass: Enrich with city mapping
        parsedMapping.forEach(row => {
            const plz = row.plz;
            if (lookup[plz]) {
                lookup[plz].city = row.ort;
                lookup[plz].district = row.landkreis;
                lookup[plz].state = row.bundesland;

                // Populate city map for search/grouping
                const cityName = row.ort;
                if (!cityMap[cityName]) {
                    cityMap[cityName] = {
                        name: cityName,
                        plzs: [],
                        totalPopulation: 0,
                        totalReach: 0
                    };
                }
                cityMap[cityName].plzs.push(plz);
                cityMap[cityName].totalPopulation += lookup[plz].population;
                cityMap[cityName].totalReach += lookup[plz].smart_tv_potential;
            }
        });

        return { lookup, cityMap };
    } catch (error) {
        console.error("Failed to load context data:", error);
        return { lookup: {}, cityMap: {} };
    }
}

export async function loadGeoJSONShard(shardId) {
    try {
        const response = await fetch(`/data/plz_${shardId}.json`);
        if (!response.ok) throw new Error(`Failed to load shard ${shardId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading GeoJSON shard ${shardId}:`, error);
        return null;
    }
}
