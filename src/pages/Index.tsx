import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { Charts } from "@/components/Charts";
import { Transaction } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    toast({
      title: "Transaction added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of ₦${Math.abs(transaction.amount)} has been added.`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed.",
    });
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    toast({
      title: "Transaction updated",
      description: "The transaction has been modified successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">FinSmart</h1>
          <p className="text-muted-foreground">Personal Finance Tracker</p>
        </div>
        <ThemeToggle />
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