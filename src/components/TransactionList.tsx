import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types";
import { CATEGORIES } from "@/lib/constants";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                {CATEGORIES.find(cat => cat.id === transaction.category)?.name}
              </TableCell>
              <TableCell className={`text-right ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </TableCell>
            </TableRow>
          )TableBody>
        </Table>
      </div>
    );
}