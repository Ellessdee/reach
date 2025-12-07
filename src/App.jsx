import { useEffect, useState } from 'react';
import { loadContextData, loadGeoJSONShard } from './utils/dataLoader';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      console.log("Loading context data...");
      const context = await loadContextData();
      console.log("Context data loaded:", context);

      console.log("Loading Berlin shard (1)...");
      const berlinShard = await loadGeoJSONShard(1);
      console.log("Berlin shard loaded:", berlinShard ? "Success" : "Failed");

      setData({ context, berlinShard });
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading data...
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Reach Map Data Loaded</h1>
      <div className="bg-zinc-900 p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl mb-2">Statistics</h2>
        <p>Total Cities Loaded: {Object.keys(data.context.cityMap).length}</p>
        <p>Total PLZs Loaded: {Object.keys(data.context.lookup).length}</p>
        <p>Berlin Shard Features: {data.berlinShard?.features?.length || 0}</p>

        <h2 className="text-xl mt-4 mb-2">Example Entry (10115)</h2>
        <pre className="bg-zinc-800 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(data.context.lookup['10115'], null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;
