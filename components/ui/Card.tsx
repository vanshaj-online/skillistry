import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, className = "", id, style }: CardProps) {
  return (
    <div id={id} className={`card p-5 ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
