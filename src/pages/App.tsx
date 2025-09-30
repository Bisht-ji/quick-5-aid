import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Send, Sparkles, Copy, Check } from "lucide-react";
import QueryHistory from "@/components/QueryHistory";

interface Query {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

const AppPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadQueries();
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadQueries = async () => {
    const { data, error } = await supabase
      .from("queries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error loading queries:", error);
      return;
    }

    setQueries(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setCurrentAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke("ask-ai", {
        body: { question },
      });

      if (error) throw error;

      setCurrentAnswer(data.answer);
      setQuestion("");
      loadQueries();

      toast({
        title: "Answer received!",
        description: "Your question has been answered.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Answer copied to clipboard.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">AI Quick Helper</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Input */}
            <Card className="p-6 border-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Ask your question
                  </label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What do you want to know?"
                    className="min-h-[120px] resize-none"
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-600"
                  disabled={loading || !question.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting answer...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Get Answer
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Current Answer */}
            {currentAnswer && (
              <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your Answer
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(currentAnswer)}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="space-y-3 text-foreground">
                    {currentAnswer.split('\n').map((line, i) => (
                      <p key={i} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Query History */}
          <div className="lg:col-span-1">
            <QueryHistory queries={queries} onSelectQuery={(query) => {
              setCurrentAnswer(query.answer);
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;