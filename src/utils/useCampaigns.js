import { useState, useEffect } from 'react';

const STORAGE_KEY = 'reach_map_campaigns';

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [activeCampaignId, setActiveCampaignId] = useState(null);

    // Load from storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setCampaigns(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse campaigns", e);
            }
        }
    }, []);

    // Sync to storage on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    }, [campaigns]);

    const saveCampaign = (campaignData) => {
        const now = new Date().toISOString();

        if (campaignData.id) {
            // Update existing
            setCampaigns(prev => prev.map(c =>
                c.id === campaignData.id
                    ? { ...c, ...campaignData, updatedAt: now }
                    : c
            ));
        } else {
            // Create new
            const newCampaign = {
                ...campaignData,
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now
            };
            setCampaigns(prev => [...prev, newCampaign]);
            setActiveCampaignId(newCampaign.id);
        }
    };

    const loadCampaign = (id) => {
        const campaign = campaigns.find(c => c.id === id);
        if (campaign) {
            setActiveCampaignId(id);
            return campaign;
        }
        return null;
    };

    const deleteCampaign = (id) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        if (activeCampaignId === id) {
            setActiveCampaignId(null);
        }
    };

    return {
        campaigns,
        activeCampaignId,
        saveCampaign,
        loadCampaign,
        deleteCampaign,
        setActiveCampaignId
    };
}
