import { useEffect, useState } from 'react';
import { loadContextData, loadGeoJSONShard } from './utils/dataLoader';
import MapArea from './components/MapArea';
import Sidebar from './components/Sidebar';
import SelectedItemsPanel from './components/SelectedItemsPanel';

import { useCampaigns } from './utils/useCampaigns';

function App() {
  const [data, setData] = useState({ context: { lookup: {}, cityMap: {} }, berlinShard: null });
  const [loading, setLoading] = useState(true);

  // App State
  const [selectedZones, setSelectedZones] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [demographicFilter, setDemographicFilter] = useState(null);
  const [topicFilter, setTopicFilter] = useState(null);
  const [frequencyMultiplier, setFrequencyMultiplier] = useState(3); // Default 3x

  // Campaign Management
  const {
    campaigns,
    activeCampaignId,
    saveCampaign,
    loadCampaign,
    deleteCampaign
  } = useCampaigns();

  const handleLoadCampaign = (id) => {
    const campaign = loadCampaign(id);
    if (campaign) {
      setSelectedZones(new Set(campaign.selectedZones));
      setDemographicFilter(campaign.demographicFilter);
      setTopicFilter(campaign.topicFilter);
      setFrequencyMultiplier(campaign.frequencyMultiplier);
    }
  };

  useEffect(() => {
    async function init() {
      // Load Data
      const context = await loadContextData();

      // Load Berlin first (shard 1)
      const berlinShard = await loadGeoJSONShard(1);

      setData({ context, berlinShard });
      setLoading(false);

      // Progressive Loading could happen here, scheduling other shards
      // For now, valid MVP loads Berlin.
      // TODO: Implement loadRemainingShards logic if needed.
    }
    init();
  }, []);

  // Handlers
  const handleSelectZone = (plz) => {
    const next = new Set(selectedZones);
    if (next.has(plz)) {
      next.delete(plz);
    } else {
      next.add(plz);
    }
    setSelectedZones(next);
  };

  const handleSelectCity = (city) => {
    const next = new Set(selectedZones);
    const cityPlzs = city.plzs;

    // Check if fully selected
    const allSelected = cityPlzs.every(plz => next.has(plz));

    if (allSelected) {
      // Deselect all
      cityPlzs.forEach(plz => next.delete(plz));
    } else {
      // Select all
      cityPlzs.forEach(plz => next.add(plz));
    }
    setSelectedZones(next);
  };

  const handleRemoveZone = (plzOrAll) => {
    if (plzOrAll === 'ALL') {
      setSelectedZones(new Set());
    } else {
      const next = new Set(selectedZones);
      next.delete(plzOrAll);
      setSelectedZones(next);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading data...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden font-sans">
      <Sidebar
        cityMap={data.context.cityMap}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectCity={handleSelectCity}
        selectedZones={selectedZones}
        demographicFilter={demographicFilter}
        setDemographicFilter={setDemographicFilter}
        topicFilter={topicFilter}
        setTopicFilter={setTopicFilter}
        campaignProps={{
          campaigns,
          activeCampaignId,
          onLoad: handleLoadCampaign,
          onSave: saveCampaign,
          onDelete: deleteCampaign,
          currentConfig: {
            selectedZones,
            demographicFilter,
            topicFilter,
            frequencyMultiplier
          }
        }}
      />

      <div className="flex-1 relative h-full">
        <MapArea
          data={data}
          selectedZones={selectedZones}
          onSelectZone={handleSelectZone}
        />

        <SelectedItemsPanel
          selectedZones={selectedZones}
          context={data.context}
          demographicFilter={demographicFilter}
          topicFilter={topicFilter}
          frequencyMultiplier={frequencyMultiplier}
          setFrequencyMultiplier={setFrequencyMultiplier}
          onRemoveZone={handleRemoveZone}
        />
      </div>
    </div>
  );
}

export default App;
