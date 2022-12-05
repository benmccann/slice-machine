import React from "react";
import { Flex, useThemeUI } from "theme-ui";
import hljs from "highlight.js";

import { ThemeUIStyleObject } from "@theme-ui/css";

export type Language = "javascript" | "bash" | "xml" | "html" | "json";

const DEFAULT_LANGUAGES: Array<Language> = [
  "javascript",
  "bash",
  "xml",
  "html",
  "json",
];

const CodeBlock: React.FC<{
  children: string;
  lang?: Language;
  sx?: ThemeUIStyleObject;
  codeStyle?: React.CSSProperties;
  codeClass?: string;
  Header?: React.FC;
}> = ({ children, lang, sx, codeStyle, codeClass, Header }) => {
  const { theme } = useThemeUI();
  const text = lang
    ? hljs.highlight(children, { language: lang }).value
    : hljs.highlightAuto(children, DEFAULT_LANGUAGES).value;

  return (
    <Flex as="pre" sx={sx}>
      {Header ? <Header /> : null}
      <code
        className={`hljs${codeClass ? ` ${codeClass}` : ""}`}
        style={{
          overflowX: "auto",
          padding: "3px 5px",
          borderRadius: "6px",
          border: "1px solid",
          borderColor: String(theme.colors?.textClear),
          ...codeStyle,
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </Flex>
  );
};

export default CodeBlock;
