/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import katex from "katex";

interface MathRendererProps {
  math: string;
  block?: boolean;
}

export function MathRenderer({ math, block = false }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          trust: true,
        });
      } catch (err) {
        console.error("Katex Error:", err);
        containerRef.current.textContent = math;
      }
    }
  }, [math, block]);

  return <span ref={containerRef} className="inline-block select-all" />;
}

interface MathTextParserProps {
  text: string;
}

/**
 * 텍스트 중간에 섞여 있는 $...$ 형태의 LaTeX 수식을 파싱하여 텍스트와 KaTeX 컴포넌트로 믹싱해 렌더링합니다.
 */
export function MathTextParser({ text }: MathTextParserProps) {
  if (!text) return null;

  // $...$ 패턴을 파싱하기 위해 정규식을 사용합니다
  const parts = text.split(/(\$[^\$]+\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const rawMath = part.slice(1, -1);
          return <span key={index} className="inline-block"><MathRenderer math={rawMath} block={false} /></span>;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
