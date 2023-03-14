import classNames from "classnames";
import { useState } from "react";
import { FiltersOption } from "./filtersOption";

type FilterRowProps = {
  title: string;
  isTraitsProperty?: boolean;
  data?: { name: string; amount: number }[];
  pushQuery?: (property: string, value: string, type: "ADD" | "REMOVE") => void;
};

export const FiltersRow = ({
  title,
  isTraitsProperty,
  data,
  pushQuery,
}: FilterRowProps) => {
  const [isShowTraits, setIsShowTraits] = useState(false);
  const toggleTraits = () => setIsShowTraits((prevBoolean) => !prevBoolean);

  return (
    <div
      className={classNames("filters__rows", {
        traits: isTraitsProperty,
      })}
    >
      <div className="wrapper" onClick={toggleTraits}>
        <h3>{title}</h3>
        <div className="value">
          {isTraitsProperty && <span>24</span>}
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.46967 9.46967C7.76256 9.17678 8.23744 9.17678 8.53033 9.46967L12 12.9393L15.4697 9.46967C15.7626 9.17678 16.2374 9.17678 16.5303 9.46967C16.8232 9.76256 16.8232 10.2374 16.5303 10.5303L12.5303 14.5303C12.2374 14.8232 11.7626 14.8232 11.4697 14.5303L7.46967 10.5303C7.17678 10.2374 7.17678 9.76256 7.46967 9.46967Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {isTraitsProperty && isShowTraits && data && (
        <div className="filters__properties">
          <div className="filters__scroll">
            <div className="filters__scroll-wrapper">
              {data &&
                data.length > 0 &&
                data.map((item, index) => (
                  <FiltersOption
                    key={index}
                    item={item}
                    pushQuery={pushQuery}
                    title={title}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
