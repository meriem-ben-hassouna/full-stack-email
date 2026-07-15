import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("Manager");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email: form.email, password: form.password });

      // "Sign in as" is a UI hint only — the account's real role (set at
      // registration) always decides which interface is shown.
      if (
        (role === "Manager" && user.role !== "MANAGER") ||
        (role === "Employee" && user.role !== "EMPLOYEE")
      ) {
        alert(
          `This account is registered as ${user.role === "MANAGER" ? "a Manager" : "an Employee"}. Signing you in with the correct interface.`
        );
      }

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your workspace</p>

      <form onSubmit={handleSubmit} className="stack">
        <div className="field">
          <label className="login-label">Email address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />
        </div>

        <div className="field">
          <label className="login-label">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="field">
          <label className="login-label">Sign in as</label>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${role === "Manager" ? " active" : ""}`}
              onClick={() => setRole("Manager")}
            >
              Manager
            </button>
            <button
              type="button"
              className={`role-btn${role === "Employee" ? " active" : ""}`}
              onClick={() => setRole("Employee")}
            >
              Employee
            </button>
          </div>
        </div>

        <Button type="submit" className="btn-block" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="auth-footer">
        No account? <Link to="/register">Create Workspace</Link>
      </p>
    </>
  );
}
