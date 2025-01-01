import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { Charts } from "@/components/Charts";
import { Transaction, UserProfile } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, LogOut } from "lucide-react";
import { Login } from "@/components/Login";

export default function Index() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('currentUser');
  });
  
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem('userProfiles');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [history, setHistory] = useState<Transaction[][]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      const userProfile = userProfiles[currentUser];
      if (userProfile) {
        setTransactions(userProfile.transactions || []);
      }
    }
  }, [currentUser, userProfiles]);

  useEffect(() => {
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
  }, [userProfiles]);

  const updateTransactionsWithHistory = (newTransactions: Transaction[]) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push([...transactions]);
    
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
    setTransactions(newTransactions);

    if (currentUser) {
      setUserProfiles(prev => ({
        ...prev,
        [currentUser]: {
          username: currentUser,
          transactions: newTransactions
        }
      }));
    }
  };

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    
    if (!userProfiles[username]) {
      setUserProfiles(prev => ({
        ...prev,
        [username]: {
          username,
          transactions: []
        }
      }));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setTransactions([]);
    setHistory([]);
    setCurrentHistoryIndex(-1);
    toast({
      title: "Logged out",
      description: "Successfully logged out",
    });
  };

  const handleAddTransaction = (transaction: Transaction) => {
    const transactionWithUser = {
      ...transaction,
      userId: currentUser as string
    };
    updateTransactionsWithHistory([transactionWithUser, ...transactions]);
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
      const previousTransactions = history[currentHistoryIndex - 1];
      setTransactions(previousTransactions);
      
      if (currentUser) {
        setUserProfiles(prev => ({
          ...prev,
          [currentUser]: {
            username: currentUser,
            transactions: previousTransactions
          }
        }));
      }
      
      toast({
        title: "Action undone",
        description: "The last action has been reversed.",
      });
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      const nextTransactions = history[currentHistoryIndex + 1];
      setTransactions(nextTransactions);
      
      if (currentUser) {
        setUserProfiles(prev => ({
          ...prev,
          [currentUser]: {
            username: currentUser,
            transactions: nextTransactions
          }
        }));
      }
      
      toast({
        title: "Action redone",
        description: "The action has been reapplied.",
      });
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">FinSmart</h1>
          <p className="text-muted-foreground">Welcome, {currentUser}!</p>
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
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
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