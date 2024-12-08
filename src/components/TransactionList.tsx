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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onUpdate: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onDelete, onUpdate }: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm(transaction);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdate(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleInputChange = (field: keyof Transaction, value: string | number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: field === 'amount' ? 
          (editForm.type === 'expense' ? -Math.abs(Number(value)) : Math.abs(Number(value))) :
          value
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {editingId === transaction.id ? (
                  <Input
                    type="date"
                    value={editForm?.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                ) : (
                  new Date(transaction.date).toLocaleDateString()
                )}
              </TableCell>
              <TableCell>
                {editingId === transaction.id ? (
                  <Input
                    value={editForm?.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                ) : (
                  transaction.description
                )}
              </TableCell>
              <TableCell>
                {editingId === transaction.id ? (
                  <Select
                    value={editForm?.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  CATEGORIES.find(cat => cat.id === transaction.category)?.name
                )}
              </TableCell>
              <TableCell className={`text-right ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                {editingId === transaction.id ? (
                  <Input
                    type="number"
                    value={Math.abs(editForm?.amount || 0)}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-32 ml-auto"
                  />
                ) : (
                  `₦${Math.abs(transaction.amount).toFixed(2)}`
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {editingId === transaction.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveEdit}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}