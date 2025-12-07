import { DEMOGRAPHIC_DISTRIBUTION, TOPICS } from '../utils/calculations';
import { Users, Tag } from 'lucide-react';
import clsx from 'clsx';

function FilterControls({ demographicFilter, setDemographicFilter, topicFilter, setTopicFilter }) {

    const demographics = Object.keys(DEMOGRAPHIC_DISTRIBUTION);

    return (
        <div className="space-y-6">
            {/* Demographic Filter */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-zinc-400">
                    <Users size={16} />
                    <span>Demographic Target</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setDemographicFilter(null)}
                        className={clsx(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                            !demographicFilter
                                ? "bg-white text-black border-white"
                                : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500"
                        )}
                    >
                        All
                    </button>
                    {demographics.map(key => (
                        <button
                            key={key}
                            onClick={() => setDemographicFilter(key)}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                                demographicFilter === key
                                    ? "bg-white text-black border-white"
                                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500"
                            )}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>

            {/* Topic Filter */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-zinc-400">
                    <Tag size={16} />
                    <span>Topic Interest (Themenumfeld)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setTopicFilter(null)}
                        className={clsx(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                            !topicFilter
                                ? "bg-white text-black border-white"
                                : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500"
                        )}
                    >
                        All
                    </button>
                    {TOPICS.map(topic => (
                        <button
                            key={topic}
                            onClick={() => setTopicFilter(topic)}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                                topicFilter === topic
                                    ? "bg-white text-black border-white"
                                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500"
                            )}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FilterControls;
