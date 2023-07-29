// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './OmsSyntaxHighlight.css';
import { useState } from 'react';
import React from 'react';

// vscDarkPlus vscode 暗色主题
// darcula  webstorm 暗色主题
// coyWithoutShadows 上面展示的效果

type tProps = {
  textContent: string;
  language: string;
  darkMode?: boolean;
}

const them = {
  dark: vscDarkPlus,
  light: darcula
};

const OmsSyntaxHighlight = (props: tProps) => {
  const { textContent, darkMode, language = 'txt' } = props;
  if (typeof darkMode === 'undefined') {
    them.light = darcula;
  }
  if (typeof darkMode === 'boolean') {
    them.light = darcula;
  }

  React.useEffect(() => {
    import('react-syntax-highlighter').then((module) => {
      const { PrismAsyncLight: SyntaxHighlighter } = module;
      setSyntaxHighlighter(() => SyntaxHighlighter);
    });
  }, []);

  const [SyntaxHighlighter, setSyntaxHighlighter] = useState<any>();

  if (!SyntaxHighlighter) {
    return <div>Loading...</div>;
  }

  return (
      <SyntaxHighlighter
        showLineNumbers={true} 
        lineNumberStyle={{ color: '#ddd', fontSize: 10 }} 
        style={darkMode ? them.dark : them.light}  
        language={language}
        PreTag='div'
        codeTagProps= {{
          style: {
            fontSize: "inherit",
            borderRadius: "inherit",
          }
        }}   
        customStyle={{ fontSize: '17px',borderRadius: "6px" }} 
      >
        {String(textContent).replace(/\n$/, '')}
      </SyntaxHighlighter>
  );
};

export default OmsSyntaxHighlight;