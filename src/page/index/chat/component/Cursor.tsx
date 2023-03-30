import React from 'react';
import './Cursor.css';

interface CursorProps {
  width?: number;
}

const Cursor: React.FC<CursorProps> = ({ width = 2 }) => {
  const cursorStyle: React.CSSProperties = {
    width: `${width}px`,
    height: '26px',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationFillMode: 'both',
    animationTimingFunction: 'ease-in-out',
  };

  return (<div className="cursor" style={cursorStyle}></div>);
};

export default Cursor;