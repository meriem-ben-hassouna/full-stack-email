





import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import Lmanager from"../../assets/icons/managerl.png"
import Lemployee from"../../assets/icons/employeel.png"

export default function Register() {
  const [role, setRole] = useState("manager"); // "manager" | "employee"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyCode: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: no database yet — once connected, a manager account should
    // generate/store a company code, and an employee account should be
    // validated against that code before creating the account.
    navigate("/dashboard");
  };

  return (
    <>
      <h1 className="auth-title">Create account</h1>
      <p className="auth-subtitle">Choose your role to get started</p>

      <div className="role-cards" style={{ marginBottom: 20 }}>
        <button
          type="button"
          className={`role-card${role === "manager" ? " selected" : ""}`}
          onClick={() => setRole("manager")}
        >
          <span className="role-icon-box">
            <img 
                src={Lmanager}
                alt="Role icon" 
                style={{ width: '46px', height: '46px' }} 
            />
</span>
          <span>
            <p className="role-title">Company Manager</p>
            <p className="role-desc">Set up workspace, manage employees, upload contacts.</p>
          </span>
        </button>

        <button
          type="button"
          className={`role-card${role === "employee" ? " selected" : ""}`}
          onClick={() => setRole("employee")}
        >
          <span className="role-icon-box">
            <img 
                src={Lemployee}
                alt="Role icon" 
                style={{ width: '46px', height: '46px' }} 
            />
</span>
          <span>
            <p className="role-title">Employee</p>
            <p className="role-desc">Join an existing workspace with a company code.</p>
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        <div className="field">
          <label>Full Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Sarah Miller"
            required
          />
        </div>

        <div className="field">
          <label>Email address</label>
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
          <label>Password</label>
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
        <label>Company name</label>
        <input
          name="companyName"
          type="text"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Acme Inc."
          required
        />
      </div>


      <div className="field">
        <label>Company code</label>
        <input
          name="companyCode"
          type="text"
          value={form.companyCode}
          onChange={handleChange}
          placeholder="Example: ACM458"
          required
        />
      </div>

        <Button type="submit" className="btn-block" style={{ marginTop: 4 }}>
          Create Workspace
        </Button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  );
}
