import { useEffect, useState, useMemo } from 'react';
import { loadContextData, loadGeoJSONShard } from './utils/dataLoader';
import MapArea from './components/MapArea';

function App() {
  const [data, setData] = useState({ context: { lookup: {}, cityMap: {} }, berlinShard: null });
  const [loading, setLoading] = useState(true);
  const [selectedZones, setSelectedZones] = useState(new Set());

  useEffect(() => {
    async function init() {
      const context = await loadContextData();
      const berlinShard = await loadGeoJSONShard(1);
      setData({ context, berlinShard });
      setLoading(false);
    }
    init();
  }, []);

  const handleSelectZone = (plz) => {
    const next = new Set(selectedZones);
    if (next.has(plz)) {
      next.delete(plz);
    } else {
      next.add(plz);
    }
    setSelectedZones(next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading data...
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      <div className="w-80 border-r border-zinc-800 p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-4">Reach Map</h1>
        <div className="flex-1 overflow-auto">
          <div className="text-sm text-zinc-400 mb-2">Selected Zones: {selectedZones.size}</div>
          {/* Sidebar content placeholder */}
          <div className="space-y-2">
            {[...selectedZones].map(plz => (
              <div key={plz} className="bg-zinc-800 p-2 rounded text-sm flex justify-between">
                <span>{plz}</span>
                <span>{data.context.lookup[plz]?.city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapArea
          data={data}
          selectedZones={selectedZones}
          onSelectZone={handleSelectZone}
        />
      </div>
    </div>
  );
}

export default App;
