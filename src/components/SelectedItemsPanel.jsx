import { X } from 'lucide-react';
import { useMemo } from 'react';
import { calculateReach, calculateImpressions } from '../utils/calculations';

function SelectedItemsPanel({
    selectedZones,
    context,
    demographicFilter,
    topicFilter,
    frequencyMultiplier,
    setFrequencyMultiplier,
    onRemoveZone
}) {
    const selectedList = Array.from(selectedZones);

    // Calculate Aggregated Stats
    const stats = useMemo(() => {
        // Get array of selected zone objects
        const zones = selectedList.map(plz => context.lookup[plz]).filter(Boolean);

        const uniqueReach = calculateReach(zones, demographicFilter, topicFilter);
        const impressions = calculateImpressions(uniqueReach, frequencyMultiplier);

        return { uniqueReach, impressions };
    }, [selectedList, context, demographicFilter, topicFilter, frequencyMultiplier]);

    if (selectedList.length === 0) return null;

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-zinc-900/95 backdrop-blur border border-zinc-800 rounded-xl shadow-2xl p-4 text-white z-[2000]">
            <div className="flex gap-6">
                {/* Left Col: Selected Chips */}
                <div className="flex-1 border-r border-zinc-800 pr-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-zinc-400">Selected Areas ({selectedList.length})</h3>
                        <button
                            onClick={() => onRemoveZone('ALL')}
                            className="text-xs text-red-400 hover:text-red-300"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {selectedList.map(plz => {
                            const city = context.lookup[plz]?.city || 'Unknown';
                            return (
                                <div key={plz} className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded text-xs">
                                    <span>{city} ({plz})</span>
                                    <button onClick={() => onRemoveZone(plz)} className="text-zinc-500 hover:text-white">
                                        <X size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Col: Stats & Frequency */}
                <div className="w-64 flex flex-col gap-4">
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Unique Devices (Reach)</div>
                            <div className="text-2xl font-bold">{stats.uniqueReach.toLocaleString()}</div>
                        </div>

                        <div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Impressions</div>
                            <div className="text-2xl font-bold text-green-400">{stats.impressions.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium">Frequency</span>
                            <span className="text-xs font-bold bg-white text-black px-1.5 rounded">{frequencyMultiplier}x</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={frequencyMultiplier}
                            onChange={(e) => setFrequencyMultiplier(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedItemsPanel;
