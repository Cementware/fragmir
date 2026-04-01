import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [msg, setMsg] = useState(`Connecting to backend at ${API_URL}...`);
  const [status, setStatus] = useState("loading");
  console.log(`Backend at ${API_URL}`);

  useEffect(() => {
    // We fetch from localhost:3000 because the browser is outside the Docker network
    fetch(API_URL + '/api/status')
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        setMsg(data.message);
        setStatus("success");
      })
      .catch((err) => {
        setMsg("Backend unreachable. Check if the backend container is running!");
        setStatus("error");
        console.error(err);
      });
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white font-sans">
      <div className={`p-8 rounded-2xl shadow-2xl border ${status === 'success' ? 'border-cyan-500/50 bg-slate-800' : 'border-red-500/50 bg-red-900/20'
        }`}>
        <h1 className="text-4xl font-black mb-4 tracking-tight">
          System <span className="text-cyan-400">Status</span>
        </h1>

        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${status === 'success' ? 'bg-cyan-400' : 'bg-red-500'
            }`} />
          <p className="text-lg text-slate-300 font-medium">
            {msg}
          </p>
        </div>
      </div>

      <p className="mt-8 text-slate-500 text-sm uppercase tracking-widest">
        Docker Replicable Environment v1.0
      </p>
    </div>
  )
}

export default App
