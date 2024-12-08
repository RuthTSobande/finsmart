import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { Summary } from "@/components/Summary";
import { TransactionList } from "@/components/TransactionList";
import { Charts } from "@/components/Charts";
import { Transaction } from "@/types";
import { useToast } from "@/components/ui/use-toast";

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
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${Math.abs(transaction.amount)} has been added.`,
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">FinSmart</h1>
        <p className="text-muted-foreground">Personal Finance Tracker</p>
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
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}