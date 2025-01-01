import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface LoginProps {
  onLogin: (username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }
    onLogin(username.trim());
    toast({
      title: "Welcome!",
      description: `Successfully ${localStorage.getItem(username) ? 'logged in' : 'created new profile'} as ${username}`,
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">FinSmart</h1>
        <p className="text-center text-muted-foreground mb-6">
          Enter a username to login or create a new expense profile
        </p>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login / Create Profile
        </Button>
      </form>
    </div>
  );
}