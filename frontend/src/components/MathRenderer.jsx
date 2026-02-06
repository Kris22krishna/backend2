import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * Renders text containing LaTeX math expressions wrapped in $$...$$
 * Example input: "Solve $$ x^2 + 4 $$ for x"
 */
const MathRenderer = ({ text, inline = true }) => {
    if (text === null || text === undefined) return null;

    // Ensure string
    const stringText = String(text);

    // Split by $$ ... $$ pattern
    // The regex captures the content inside $$
    const parts = stringText.split(/\$\$(.*?)\$\$/g);

    return (
        <span>
            {parts.map((part, index) => {
                // Odd indices are the captured math expressions
                if (index % 2 === 1) {
                    return inline ? (
                        <InlineMath key={index} math={part} />
                    ) : (
                        <BlockMath key={index} math={part} />
                    );
                }
                // Even indices are regular text
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

export default MathRenderer;
