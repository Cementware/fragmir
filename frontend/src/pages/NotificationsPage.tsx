import { useState, useEffect } from 'react';
import { MessageCircle, Clock, AlertCircle } from 'lucide-react';

interface Question {
  ID: number;
  question: string;
  sender_username: string | null;
  created_at: string;
}

export default function NotificationsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/question/list`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load questions');
        }

        const data = await response.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        <p className="font-medium">Loading your inbox...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex items-center gap-3">
        <AlertCircle size={20} />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800">Inbox</h2>
        <span className="bg-indigo-100 text-indigo-600 text-xs font-black px-3 py-1 rounded-full uppercase">
          {questions.length} Total
        </span>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <MessageCircle size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium">No questions yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.ID} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600 text-sm">
                    {q.sender_username ? `@${q.sender_username}` : 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase">{q.created_at}</span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {q.question}
              </p>
              <button className="mt-4 text-xs font-black text-slate-400 group-hover:text-indigo-600 transition uppercase tracking-widest">
                Reply to Question
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
