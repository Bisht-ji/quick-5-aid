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
    <Card className="p-4 border-2 sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h2 className="font-semibold">Recent Queries</h2>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        {queries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No queries yet</p>
            <p className="text-xs mt-1">Ask your first question!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queries.map((query) => (
              <button
                key={query.id}
                onClick={() => onSelectQuery(query)}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
              >
                <p className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {query.question}
                </p>
                <p className="text-xs text-muted-foreground">
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