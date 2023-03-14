import React, { useState } from "react";
import classNames from "classnames";

type FiltersOptionProps = {
  item: { name: string; amount: number };
  pushQuery?: (property: string, value: string, type: "ADD" | "REMOVE") => void;
  title: string;
};

export const FiltersOption = ({
  item,
  pushQuery,
  title,
}: FiltersOptionProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <button className="filters__option">
      <div className="filters__checkbox">
        <div className="checkbox">
          <div className="checkbox__inner">
            <input
              type="checkbox"
              id={item.name}
              name={item.name}
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                const checked = e.target.checked;
                pushQuery &&
                  pushQuery(title, item.name, checked ? "ADD" : "REMOVE");
              }}
            />
            <label htmlFor={item.name} className="checkbox__fake">
              <div
                className={classNames("checkbox__wrapper", {
                  active: checked,
                })}
              >
                {checked && (
                  <svg viewBox="0 0 10 8" fill="none" width="10" height="10">
                    <path
                      d="M1 3.5L3.66667 6L9 1"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                    ></path>
                  </svg>
                )}
              </div>
            </label>
          </div>
          <span className="properties__name">{item.name}</span>
        </div>
      </div>
      <span>{item.amount}</span>
    </button>
  );
};
