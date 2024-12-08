import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { CATEGORIES } from "@/lib/constants";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ChartsProps {
  transactions: Transaction[];
}

export function Charts({ transactions }: ChartsProps) {
  // Prepare data for pie chart
  const expensesByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const category = CATEGORIES.find(cat => cat.id === t.category)!;
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([categoryId, value]) => ({
    name: CATEGORIES.find(cat => cat.id === categoryId)?.name,
    value,
    color: CATEGORIES.find(cat => cat.id === categoryId)?.color
  }));

  // Prepare data for bar chart
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 };
    }
    if (t.amount > 0) {
      acc[month].income += t.amount;
    } else {
      acc[month].expenses += Math.abs(t.amount);
    }
    return acc;
  }, {} as Record<string, { month: string; income: number; expenses: number }>);

  const barData = Object.values(monthlyData);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#22C55E" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}