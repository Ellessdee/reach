import CityList from './CityList';
import FilterControls from './FilterControls';

function Sidebar({
    cityMap,
    searchTerm,
    onSearchChange,
    onSelectCity,
    selectedZones,
    demographicFilter,
    setDemographicFilter,
    topicFilter,
    setTopicFilter,
    campaignProps
}) {
    return (
        <div className="w-96 bg-black border-r border-zinc-800 flex flex-col h-full">
            <div className="p-6 pb-2">
                <h1 className="text-2xl font-bold text-white mb-1">Reach Map</h1>
                <p className="text-xs text-zinc-500">Campaign Planning Tool</p>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Filters Section - Hidden when searching */}
                {!searchTerm && (
                    <div className="p-6 border-b border-zinc-800">
                        <FilterControls
                            demographicFilter={demographicFilter}
                            setDemographicFilter={setDemographicFilter}
                            topicFilter={topicFilter}
                            setTopicFilter={setTopicFilter}
                        />
                    </div>
                )}

                {/* City List Section */}
                <div className="flex-1 overflow-hidden p-4">
                    <h3 className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">Cities & Areas</h3>
                    <CityList
                        cityMap={cityMap}
                        searchTerm={searchTerm}
                        onSearchChange={onSearchChange}
                        onSelectCity={onSelectCity}
                        selectedZones={selectedZones}
                    />
                </div>

                {/* Campaign Panel */}
                {campaignProps && (
                    <CampaignPanel {...campaignProps} />
                )}
            </div>
        </div>
    );
}

export default Sidebar;
