import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

// Fix for default Leaflet markers if needed (though we use polygons)
import L from 'leaflet';

const MAP_CENTER = [51.1657, 10.4515]; // Center of Germany
const DEFAULT_ZOOM = 6;

function MapArea({ data, selectedZones, onSelectZone }) {
    const { context, berlinShard } = data;

    // Style function
    const style = (feature) => {
        const plz = feature.properties.plz;
        const isSelected = selectedZones.has(plz);

        if (isSelected) {
            return {
                fillColor: '#ffffff',
                fillOpacity: 0.2,
                color: '#ffffff',
                weight: 2,
                opacity: 1
            };
        }

        // Default style (invisible/hover-only logic handled mostly via CSS/interactive or base style)
        // Requirement: "clickable but invisible by default"
        return {
            fillColor: 'transparent',
            fillOpacity: 0,
            color: '#22c55e', // Green-500
            weight: 0, // Invisible border by default
            opacity: 0
        };
    };

    const onEachFeature = (feature, layer) => {
        const plz = feature.properties.plz;

        // Enrich feature with context data if available (though data loader might have done this, 
        // passing raw GeoJSON often means properties are just what's in the file.
        // We should ensure properties have the data needed for tooltips)
        if (context.lookup[plz]) {
            feature.properties = { ...feature.properties, ...context.lookup[plz] };
        }

        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                if (!selectedZones.has(plz)) {
                    layer.setStyle({
                        weight: 2,
                        opacity: 1,
                        color: '#22c55e'
                    });
                    layer.bringToFront();
                }
            },
            mouseout: (e) => {
                const layer = e.target;
                if (!selectedZones.has(plz)) {
                    // Reset to invisible
                    layer.setStyle({
                        weight: 0,
                        opacity: 0
                    });
                }
            },
            click: () => {
                onSelectZone(plz);
            }
        });
    };

    return (
        <div className="h-full w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative">
            <MapContainer
                center={MAP_CENTER}
                zoom={DEFAULT_ZOOM}
                className="h-full w-full"
                zoomControl={false}
                style={{ background: '#000' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {berlinShard && (
                    <GeoJSON
                        data={berlinShard}
                        style={style}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>

            {/* Overlay controls or stats can go here */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-black/80 p-2 rounded text-xs text-white">
                Loaded Shards: Berlin
            </div>
        </div>
    );
}

export default MapArea;
