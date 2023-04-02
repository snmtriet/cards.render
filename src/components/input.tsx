import { InputProps, Sort } from "@/model";
import { useRouter } from "next/router";
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

  const router = useRouter();
  const collectionQuery = router.query.collection;

  return (
    <div className="input__container">
      <div className="input__title">{title}</div>
      <div
        className="input__wrapper"
        onClick={() => {
          disabled && collectionQuery && setSortOpen((prev) => !prev);
        }}
      >
        <input
          type={type}
          inputMode={inputMode}
          value={title === "Sort" ? (value ? value : "Sort value") : value}
          min={0}
          onChange={(e) => {
            handleChange(e, keyValue);
          }}
          disabled={disabled}
          className="input__input"
          onBlur={() => {
            disabled && setSortOpen(false);
          }}
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
                {Object.keys(Sort).map((item) => {
                  if (Sort[item as keyof typeof Sort]) {
                    return (
                      <div
                        className="items-center"
                        key={item}
                        onClick={() => handleChange(item, keyValue)}
                      >
                        <span>{Sort[item as keyof typeof Sort]}</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </CSSTransition>
        )}
      </div>
    </div>
  );
}
