import { useState, useEffect } from 'react';
import { MessageCircle, Clock, AlertCircle } from 'lucide-react';

interface Question {
  ID: number;
  question: string;
  sender_username: string | null;
  created_at: string;
}

export default function NotificationsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [posted, setPosted] = useState(true);
  const [popups, setPopups] = useState<{ id: number, text: string, offset: number }[]>([]);
  const [posting, setPosting] = useState(false);

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
        alert('Failed to fetch questions: ' + error);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedQuestion)
      fetchQuestions();
  }, [selectedQuestion]);

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (posted) {
      const id = Date.now();
      setPopups((prev) => [...prev, { id, text: '+1', offset: Math.floor(Math.random() * 40) - 20 }]);
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 800);
    }

    if (!selectedQuestion) return;
    await fetch(`${import.meta.env.VITE_API_URL}/question/answer/${selectedQuestion.ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: response, posted: posted }),
      credentials: 'include'
    });

    if (posted)
      await new Promise((resolve) => {
        setPosting(true);
        setTimeout((arg) => {
          setPosting(false);
          resolve(arg)
        }, 1000);
      });
    setSelectedQuestion(null);
    setResponse('');
    setPosted(true);
  };

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
    <div>
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
              <button
                onClick={() => setSelectedQuestion(q)}
                className="mt-4 text-xs font-black text-slate-400 group-hover:text-indigo-600 transition uppercase tracking-widest">
                Reply to Question
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSendQuestion} className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <span className='text-xl font-bold text-slate-800'>{selectedQuestion.sender_username ? `@${selectedQuestion.sender_username}` : 'Anonymous'} </span>
            <span className='text-xl text-slate-700'>asked:</span>
            <p className='pt-3 pb-3 text-slate-700'>{selectedQuestion.question}</p>
            <textarea
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] mb-4"
              placeholder="Answer the question..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-slate-600">Post after answering</span>
              <button
                type="button"
                onClick={() => setPosted(!posted)}
                className={`w-12 h-6 rounded-full transition-colors relative ${posted ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${posted ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">
                Cancel
              </button>
              <button
                type="submit"
                disabled={posting}
                className="relative flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200">
                {popups.map((popup) => (
                  <span
                    key={popup.id}
                    style={{ left: `calc(50% + ${popup.offset}px)` }}
                    className="absolute top-0 -translate-x-1/2 pointer-events-none font-black text-xl animate-fly-up z-50 text-emerald-500"
                  >
                    {popup.text}
                  </span>
                ))}
                {posted ? posting ? 'Posting...' : 'Answer & Post' : 'Answer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
