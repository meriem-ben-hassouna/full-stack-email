export default function Navbar({ onMenuClick }) {
  return (
    <header className="navbar">
      <button onClick={onMenuClick} className="menu-toggle" aria-label="Open menu">
        ☰
      </button>

      <input type="text" placeholder="Search" className="search-input" />

      <div className="navbar-right">
        <div className="navbar-date">
            {new Date().toLocaleDateString('en-GB', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
            })}
        </div>
        <div className="navbar-user">
          <div className="navbar-avatar">SM</div>
          <div>
            <p className="navbar-user-name">Sarah Miller</p>
            <p className="navbar-user-role">Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
