import { useState } from "react";
import { supabase } from "../supabase"; // adjust path if neede

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert("Login failed: " + error.message);
    else window.location.href = "/";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert("Signup failed: " + error.message);
    else alert("Signup successful! Check your email.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-8 max-w-md w-full bg-card rounded-lg shadow-lg border border-border">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login / Signup</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2 justify-between">
            <button
              onClick={handleLogin}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 w-full"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="bg-muted text-black px-4 py-2 rounded hover:bg-muted/80 w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
