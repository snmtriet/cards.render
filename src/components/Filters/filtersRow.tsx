/* eslint-disable react/display-name */
import formatFirstStringToUpperCase from "@/utils/formatFirstString";
import classNames from "classnames";
import {
  CSSProperties,
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FiltersOption } from "./filtersOption";
import { FiltersSearch } from "./filtersSearch";

type FilterRowProps = {
  title: string;
  isTraitsProperty?: boolean;
  data?: traitType[];
  count?: number;
  pushQuery?: (property: string, value: string, type: "ADD" | "REMOVE") => void;
  toggleProperties?: () => void;
  isShowProperties?: boolean;
  traits?: traitData[];
};

type traitType = {
  count: number;
  highlighted: string;
  value: string;
  checked?: boolean;
};

type traitData = {
  counts: traitType[];
  field_name: string;
  stats: {
    total_values: number;
  };
};

export const FiltersRow = memo(
  ({
    title,
    isTraitsProperty,
    data,
    count,
    pushQuery,
    toggleProperties,
    isShowProperties,
    traits,
  }: FilterRowProps) => {
    const [isShowTraits, setIsShowTraits] = useState(false);
    const [countSelected, setCountSelected] = useState(0);

    const toggleTraits = () => {
      setIsShowTraits((prevBoolean) => !prevBoolean);
      if (!isTraitsProperty) {
        toggleProperties && toggleProperties();
      }
    };
    useEffect(() => {
      if (isTraitsProperty && data && data.length > 0) {
        const count = data.filter((trait: traitType) =>
          Boolean(trait.checked)
        ).length;
        setCountSelected(count);
      }
    }, [data, isTraitsProperty]);

    const style: CSSProperties = isTraitsProperty
      ? {
          height: !isShowTraits
            ? 45
            : data && data.length > 6
            ? 6 * 36 + 20
            : data && data.length * 36 + 20,
          transition: "height ease-in-out .3s",
          overflow: "hidden",
          maxHeight: 270,
        }
      : {
          height: !isShowProperties ? 45 : "100%",
          transition: "height ease-in-out .3s",
        };

    return (
      <div style={{ position: "relative" }}>
        <div
          className={classNames("filters__rows", {
            traits: isTraitsProperty,
          })}
          style={style}
        >
          <div
            className={classNames("wrapper", {
              active: isTraitsProperty ? isShowTraits : isShowProperties,
            })}
            onClick={toggleTraits}
          >
            {countSelected > 0 ? (
              <div className="badge__count">
                <span>{countSelected}</span>
              </div>
            ) : null}

            <h3>
              {formatFirstStringToUpperCase(
                title.replace("trait_", "")
              ).replace("-", " ")}
            </h3>
            <div className="value">
              {isTraitsProperty && <span>{count}</span>}
              <IconArrow
                style={{
                  transform: `rotate(${isShowTraits ? 180 : 0}deg)`,
                  transition: "transform ease-in-out .3s",
                }}
              />
            </div>
          </div>

          {!isTraitsProperty && isShowProperties && (
            <>
              <FiltersSearch isAside placeholder="Search by traits" />
              {traits &&
                traits.length > 0 &&
                traits.map((trait: traitData) => {
                  if (trait.field_name.includes("trait_")) {
                    return (
                      <FiltersRow
                        key={trait.field_name}
                        title={trait.field_name}
                        isTraitsProperty
                        data={trait.counts}
                        count={trait.stats.total_values}
                        pushQuery={pushQuery}
                      />
                    );
                  }
                })}
            </>
          )}

          {isTraitsProperty && (
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
      </div>
    );
  }
);

const IconArrow = ({ style }: { style: CSSProperties }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24" style={style}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.46967 9.46967C7.76256 9.17678 8.23744 9.17678 8.53033 9.46967L12 12.9393L15.4697 9.46967C15.7626 9.17678 16.2374 9.17678 16.5303 9.46967C16.8232 9.76256 16.8232 10.2374 16.5303 10.5303L12.5303 14.5303C12.2374 14.8232 11.7626 14.8232 11.4697 14.5303L7.46967 10.5303C7.17678 10.2374 7.17678 9.76256 7.46967 9.46967Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
