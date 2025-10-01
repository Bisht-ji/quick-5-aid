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
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Hovering</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut} size="sm" className="hover:bg-secondary">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Question Input */}
            <Card className="p-8 border shadow-sm hover:shadow-md transition-shadow bg-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Ask your question
                  </label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What do you want to know?"
                    className="min-h-[140px] resize-none text-base focus:ring-2 focus:ring-primary/20 border-muted-foreground/20"
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-6 text-base font-medium shadow-sm hover:shadow-md transition-all"
                  disabled={loading || !question.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Getting answer...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Get Answer
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Current Answer */}
            {currentAnswer && (
              <Card className="p-8 border-2 border-primary/30 bg-card shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    Your Answer
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentAnswer)}
                    className="hover:bg-secondary hover:border-primary/50 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
                  <div className="space-y-4 text-foreground">
                    {currentAnswer.split('\n').map((line, i) => (
                      <p key={i} className="leading-relaxed text-base">
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