import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { Charts } from "@/components/Charts";
import { Transaction } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Add history states for undo/redo
  const [history, setHistory] = useState<Transaction[][]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Helper function to update transactions and history
  const updateTransactionsWithHistory = (newTransactions: Transaction[]) => {
    // Remove any future history entries when a new action is performed
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push([...transactions]);
    
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
    setTransactions(newTransactions);
  };

  const handleAddTransaction = (transaction: Transaction) => {
    updateTransactionsWithHistory([transaction, ...transactions]);
    toast({
      title: "Transaction added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of ₦${Math.abs(transaction.amount)} has been added.`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    updateTransactionsWithHistory(transactions.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed.",
    });
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    updateTransactionsWithHistory(
      transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    toast({
      title: "Transaction updated",
      description: "The transaction has been modified successfully.",
    });
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setTransactions(history[currentHistoryIndex - 1]);
      toast({
        title: "Action undone",
        description: "The last action has been reversed.",
      });
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setTransactions(history[currentHistoryIndex + 1]);
      toast({
        title: "Action redone",
        description: "The action has been reapplied.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">FinSmart</h1>
          <p className="text-muted-foreground">Personal Finance Tracker</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={currentHistoryIndex <= 0}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={currentHistoryIndex >= history.length - 1}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <Summary transactions={transactions} />
      
      <div className="grid gap-8 md:grid-cols-[350px,1fr]">
        <div>
          <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>
        <div className="space-y-8">
          <Charts transactions={transactions} />
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <TransactionList 
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onUpdate={handleUpdateTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}