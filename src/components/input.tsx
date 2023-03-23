import { InputProps, Sort } from "@/model";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

export default function Input({
  title,
  value,
  keyValue,
  disabled = false,
  type = "number",
  inputMode = "decimal",
  handleChange,
}: InputProps) {
  const nodeRef = useRef(null);
  const [sortOpen, setSortOpen] = useState(false);
  return (
    <div className="input__container">
      <div className="input__title">{title}</div>
      <div className="input__wrapper">
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          min={0}
          onChange={(e) => {
            handleChange(e, keyValue);
          }}
          onClick={() => {
            disabled && setSortOpen((prev) => !prev);
          }}
          onBlur={() => {
            disabled && setSortOpen(false);
          }}
          className="input__input"
        />
        {title === "Sort" && (
          <CSSTransition
            in={sortOpen}
            nodeRef={nodeRef}
            timeout={300}
            classNames="result-collection"
            unmountOnExit
          >
            <div className="sort__result" ref={nodeRef}>
              <div className="sort__wrapper">
                {Object.keys(Sort).map((item) => (
                  <div
                    className="items-center"
                    key={item}
                    onClick={() => handleChange(item, keyValue)}
                  >
                    <span>{Sort[item as keyof typeof Sort]}</span>
                  </div>
                ))}
              </div>
            </div>
          </CSSTransition>
        )}
      </div>
    </div>
  );
}
