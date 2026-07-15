export default function Card({ children, flat = false, className = "", ...props }) {
  return (
    <div className={`card${flat ? " flat" : ""} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
