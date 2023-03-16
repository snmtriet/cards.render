/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import useNft from "@/hooks/useNft";
import Input from "@/components/input";
import { FiltersRow } from "@/components/Filters";
import { GridCard } from "../components/gridCard";
import { Notification } from "@/components/notification";
import { FiltersTop } from "@/components/Filters/filtersTop";
import useWindowDimensions from "@/hooks/useWindowDimensions";

export default function Home() {
  const { width, height } = useWindowDimensions();
  const columnConfig = width
    ? width > 1440
      ? 6
      : width < 1440 && width > 1000
      ? 5
      : width < 1000 && width > 768
      ? 3
      : width < 768 && width > 480
      ? 2
      : 1
    : 6;
  const [rowGap, setRowGap] = useState(10);
  const [columnGap, setColumnGap] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [column, setColumn] = useState(columnConfig);
  const [isShowFilter, setIsShowFilter] = useState(true);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isShowProperties, setIsShowProperties] = useState(true);
  const [query, setQuery] = useState({});

  const { nfts, traits, hasMore, loading, filterTraits, found } = useNft(
    pageNumber,
    query,
    isRefetch
  );

  const toggleFilter = useCallback(() => {
    if (loading) return;
    setIsShowFilter((prev) => !prev);
  }, [loading]);

  const toggleProperties = useCallback(() => {
    setIsShowProperties((prev) => !prev);
  }, []);

  const toggleColumns = useCallback(
    (type: "default" | "more") => {
      setColumn(type === "default" ? columnConfig : columnConfig + 2);
    },
    [columnConfig]
  );

  useEffect(() => {
    setColumn(columnConfig);

    if (width && width < 768) {
      setIsShowFilter(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    if (width && width < 768) {
      if (isShowFilter) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "visible";
      }
    } else {
      setIsRefetch((prev) => !prev);
    }
  }, [isShowFilter, width]);

  useEffect(() => {
    if (height) {
      const filter = document.getElementById("filters");
      if (filter) filter.style.height = `${height - 50}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  const pushQuery = useCallback(
    (trait: string, value: string, type: "ADD" | "REMOVE") => {
      if (type === "ADD")
        setQuery((prev) => {
          const prevTraits: string[] | undefined =
            prev[trait as keyof typeof prev];
          return {
            ...prev,
            [trait]: prevTraits ? [prevTraits, value].flat() : [value],
          };
        });
      filterTraits(trait, value, type);
      setPageNumber(1);
      if (type === "REMOVE") {
        setQuery((prev) => {
          const prevTraits: string[] = prev[trait as keyof typeof prev];
          const filter = prevTraits.filter((val: string) => val !== value);
          if (filter.length > 0) {
            return {
              ...prev,
              [trait]: filter,
            };
          } else {
            return Object.keys(prev)
              .filter((traitName: any) => {
                return traitName !== trait;
              })
              .reduce((obj, key) => {
                obj[key as keyof typeof obj] = prev[key as keyof typeof prev];
                return obj;
              }, {});
          }
        });
        setPageNumber(1);
      }
    },
    [filterTraits]
  );

  const observer: any = useRef();
  const lastNftElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === "column") setColumn(+e.target.value);
    if (type === "rowGap") setRowGap(+e.target.value);
    if (type === "columnGap") setColumnGap(+e.target.value);
  };

  return (
    <main>
      <Notification />
      <FiltersTop
        loading={loading}
        columnConfig={columnConfig}
        column={column}
        toggleFilter={toggleFilter}
        isShowFilter={isShowFilter}
        toggleColumns={toggleColumns}
      />
      <div className="total-found">
        <h3>
          Total:{" "}
          {new Intl.NumberFormat("en-IN", {
            maximumSignificantDigits: 10,
          }).format(found)}{" "}
          items
        </h3>
      </div>
      <div className="container">
        <div className="container__wrapper">
          <div
            className={classNames("filters", {
              hidden: !isShowFilter,
            })}
            id="filters"
          >
            <button className="filters__toggle mb-20" onClick={toggleFilter}>
              {isShowFilter ? <IconArrow /> : <IconFilter />}
              <span>Filters</span>
            </button>
            <Input
              title="Columns: "
              handleChange={handleChange}
              keyValue="column"
              value={column}
            />
            <Input
              title="Row gap: "
              handleChange={handleChange}
              keyValue="rowGap"
              value={rowGap}
            />
            <Input
              title="Column gap: "
              handleChange={handleChange}
              keyValue="columnGap"
              value={columnGap}
            />
            <FiltersRow
              title="Properties"
              toggleProperties={toggleProperties}
              isShowProperties={isShowProperties}
              traits={traits}
              pushQuery={pushQuery}
            />
          </div>

          <div className="list">
            <GridCard
              ref={lastNftElementRef}
              data={nfts}
              column={column <= 0 ? 1 : column}
              rowGap={rowGap}
              columnGap={columnGap}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

const IconArrow = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      style={{ transform: "rotate(90deg)" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.46967 9.46967C7.76256 9.17678 8.23744 9.17678 8.53033 9.46967L12 12.9393L15.4697 9.46967C15.7626 9.17678 16.2374 9.17678 16.5303 9.46967C16.8232 9.76256 16.8232 10.2374 16.5303 10.5303L12.5303 14.5303C12.2374 14.8232 11.7626 14.8232 11.4697 14.5303L7.46967 10.5303C7.17678 10.2374 7.17678 9.76256 7.46967 9.46967Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

const IconFilter = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width="24"
      height="24"
      style={{ marginRight: 4 }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 7.5C13.3096 7.5 12.75 8.05964 12.75 8.75C12.75 9.44036 13.3096 10 14 10C14.6904 10 15.25 9.44036 15.25 8.75C15.25 8.05964 14.6904 7.5 14 7.5ZM11.3535 8C11.68 6.84575 12.7412 6 14 6C15.2588 6 16.32 6.84575 16.6465 8H18C18.4142 8 18.75 8.33579 18.75 8.75C18.75 9.16421 18.4142 9.5 18 9.5H16.6465C16.32 10.6543 15.2588 11.5 14 11.5C12.7412 11.5 11.68 10.6543 11.3535 9.5H6C5.58579 9.5 5.25 9.16421 5.25 8.75C5.25 8.33579 5.58579 8 6 8H11.3535ZM10 14C9.30964 14 8.75 14.5596 8.75 15.25C8.75 15.9404 9.30964 16.5 10 16.5C10.6904 16.5 11.25 15.9404 11.25 15.25C11.25 14.5596 10.6904 14 10 14ZM7.35352 14.5C7.67998 13.3457 8.74122 12.5 10 12.5C11.2588 12.5 12.32 13.3457 12.6465 14.5H18C18.4142 14.5 18.75 14.8358 18.75 15.25C18.75 15.6642 18.4142 16 18 16H12.6465C12.32 17.1543 11.2588 18 10 18C8.74122 18 7.67998 17.1543 7.35352 16H6C5.58579 16 5.25 15.6642 5.25 15.25C5.25 14.8358 5.58579 14.5 6 14.5H7.35352Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
