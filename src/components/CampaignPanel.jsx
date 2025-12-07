import { useState } from 'react';
import { Save, Plus, Trash2, FolderOpen } from 'lucide-react';
import clsx from 'clsx';

function CampaignPanel({
    campaigns,
    activeCampaignId,
    onLoad,
    onSave,
    onDelete,
    currentConfig // { selectedZones, demographicFilter, topicFilter, frequencyMultiplier }
}) {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");

    const handleSaveNew = () => {
        if (!newName.trim()) return;
        onSave({
            name: newName,
            ...currentConfig,
            selectedZones: Array.from(currentConfig.selectedZones) // Convert Set to Array for storage
        });
        setNewName("");
        setIsCreating(false);
    };

    const handleUpdateCurrent = () => {
        if (!activeCampaignId) return;
        const current = campaigns.find(c => c.id === activeCampaignId);
        if (current) {
            onSave({
                ...current,
                ...currentConfig,
                selectedZones: Array.from(currentConfig.selectedZones)
            });
        }
    };

    return (
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Campaigns</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="text-zinc-400 hover:text-white"
                    title="New Campaign"
                >
                    <Plus size={16} />
                </button>
            </div>

            {isCreating && (
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Campaign Name"
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                        autoFocus
                    />
                    <button
                        onClick={handleSaveNew}
                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                        Save
                    </button>
                </div>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {campaigns.length === 0 && !isCreating && (
                    <div className="text-xs text-zinc-600 text-center py-2">No saved campaigns</div>
                )}

                {campaigns.map(campaign => (
                    <div
                        key={campaign.id}
                        className={clsx(
                            "group p-2 rounded flex items-center justify-between transition-colors cursor-pointer",
                            activeCampaignId === campaign.id ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                        )}
                        onClick={() => onLoad(campaign.id)}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FolderOpen size={14} className={activeCampaignId === campaign.id ? "text-green-400" : "text-zinc-600"} />
                            <div className="truncate">
                                <div className="text-sm font-medium text-zinc-200">{campaign.name}</div>
                                <div className="text-[10px] text-zinc-500">
                                    {new Date(campaign.updatedAt).toLocaleDateString()} • {campaign.selectedZones.length} Areas
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {activeCampaignId === campaign.id && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleUpdateCurrent(); }}
                                    className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
                                    title="Save Changes"
                                >
                                    <Save size={12} />
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(campaign.id); }}
                                className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400"
                                title="Delete"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CampaignPanel;
