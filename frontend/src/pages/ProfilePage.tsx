import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle, User, MessageSquareQuote } from 'lucide-react';

interface QuestionPost {
  ID: string;
  sender_username: string;
  question: string;
  answer: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user_id } = useParams<{ user_id: string }>();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [posts, setPosts] = useState<QuestionPost[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/question/posts/${user_id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      alert('Failed to fetch questions: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserName = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/by-id/${user_id}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsername(data.username);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      alert('Failed to fetch username: ' + error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserName();
    fetchUserPosts();
  }, [user_id]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="cursor-pointer p-2 hover:bg-slate-100 rounded-full transition">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-800">User Profile</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">

        {/* Profile Header Placeholder */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center text-indigo-600">
            <User size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">{username ? `@${username}` : 'Loading'}</h2>
          <p className="text-slate-500 font-medium">Community Member</p>
        </section>

        {/* Answered Questions List */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold px-2 flex items-center gap-2">
            <MessageCircle size={20} className="text-indigo-500" />
            Answered Questions
          </h3>

          {loading ? (
            <div className="p-10 text-center text-slate-400 font-medium">Loading posts...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.ID} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4 relative overflow-hidden">

                {/* 1. Created At Timestamp (Top Right) */}
                <span className="absolute top-4 right-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>

                {/* 2. The Question Section */}
                <div className="flex gap-3 pr-20"> {/* pr-20 ensures text doesn't overlap the date */}
                  <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-tight mb-1">
                      {post.sender_username || 'Anonymous'} asked:
                    </p>
                    <p className="text-slate-800 font-semibold leading-snug italic">
                      "{post.question}"
                    </p>
                  </div>
                </div>

                {/* 3. The Answer Section */}
                <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 border-l-4 border-indigo-500">
                  <MessageSquareQuote size={20} className="text-indigo-400 shrink-0" />
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {post.answer}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No answered questions yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
