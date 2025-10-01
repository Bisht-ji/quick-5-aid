import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Query {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

interface QueryHistoryProps {
  queries: Query[];
  onSelectQuery: (query: Query) => void;
}

const QueryHistory = ({ queries, onSelectQuery }: QueryHistoryProps) => {
  return (
    <Card className="p-6 border shadow-sm hover:shadow-md transition-shadow bg-card sticky top-24">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="p-2 bg-primary/10 rounded-lg">
          <History className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-bold text-lg">Recent Queries</h2>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        {queries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="p-4 bg-secondary/50 rounded-full w-fit mx-auto mb-4">
              <MessageSquare className="w-12 h-12 mx-auto opacity-40" />
            </div>
            <p className="text-sm font-medium">No queries yet</p>
            <p className="text-xs mt-2">Ask your first question to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queries.map((query) => (
              <button
                key={query.id}
                onClick={() => onSelectQuery(query)}
                className="w-full text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 hover:shadow-sm transition-all group"
              >
                <p className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
                  {query.question}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}
                </p>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default QueryHistory;