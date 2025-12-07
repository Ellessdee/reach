import { Search } from 'lucide-react';
import clsx from 'clsx';
import { useMemo } from 'react';

function CityList({ cityMap, searchTerm, onSearchChange, onSelectCity, selectedZones }) {

    // Filter and sort cities
    const filteredCities = useMemo(() => {
        const cities = Object.values(cityMap);
        if (!searchTerm) {
            // Sort by population desc
            return cities.sort((a, b) => b.totalPopulation - a.totalPopulation);
        }
        const lowerTerm = searchTerm.toLowerCase();
        return cities.filter(city =>
            city.name.toLowerCase().includes(lowerTerm) ||
            city.plzs.some(plz => plz.includes(lowerTerm))
        ).sort((a, b) => b.totalPopulation - a.totalPopulation);
    }, [cityMap, searchTerm]);

    // Helper to check selection state
    const getSelectionState = (city) => {
        const total = city.plzs.length;
        const selectedCount = city.plzs.filter(plz => selectedZones.has(plz)).length;
        if (selectedCount === 0) return 'none';
        if (selectedCount === total) return 'all';
        return 'partial';
    };

    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-black z-10 pb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search city or PLZ..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-600 placeholder-zinc-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                {filteredCities.length === 0 ? (
                    <div className="text-center text-zinc-500 py-8 text-sm">No cities found</div>
                ) : (
                    filteredCities.map(city => {
                        const status = getSelectionState(city);
                        return (
                            <button
                                key={city.name}
                                onClick={() => onSelectCity(city)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors border",
                                    status === 'all'
                                        ? "bg-zinc-800 border-zinc-600"
                                        : status === 'partial'
                                            ? "bg-zinc-900 border-zinc-700"
                                            : "bg-transparent border-transparent hover:bg-zinc-900"
                                )}
                            >
                                <div>
                                    <div className="font-medium text-sm text-white">{city.name}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">
                                        {city.plzs.length} PLZ • {city.totalPopulation.toLocaleString()} Pop
                                    </div>
                                </div>
                                {status !== 'none' && (
                                    <div className={clsx("w-2 h-2 rounded-full", status === 'all' ? "bg-white" : "bg-zinc-500")} />
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default CityList;
