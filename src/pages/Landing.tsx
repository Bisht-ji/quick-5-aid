import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Shield } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered Answers</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Hovering
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Ask any question and receive concise, actionable answers powered by advanced AI.
            No fluff, just clarity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 hover:scale-105 transition-all"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 border-2"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-primary transition-all">
            <div className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Get instant AI-powered responses formatted in exactly 5 clear bullet points
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-primary transition-all">
            <div className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Always Actionable</h3>
            <p className="text-muted-foreground">
              Every answer is practical, precise, and ready to use immediately
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:border-primary transition-all">
            <div className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <Shield className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Your History, Secured</h3>
            <p className="text-muted-foreground">
              All your queries are saved securely for easy access anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;