import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("Manager");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call auth API via Axios once backend is connected
    navigate("/dashboard");
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

        <Button type="submit" className="btn-block">
          Sign in
        </Button>
      </form>

      <p className="auth-footer">
        No account? <Link to="/register">Create Workspace</Link>
      </p>
    </>
  );
}
