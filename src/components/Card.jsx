export default function Card({ children, flat = false, className = "" }) {
  return (
    <div className={`card${flat ? " flat" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
