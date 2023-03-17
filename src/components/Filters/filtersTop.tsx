/* eslint-disable react/display-name */
import React, { Dispatch, memo, SetStateAction } from "react";
import { FiltersSearch } from "./filtersSearch";

type FiltersProps = {
  column: number;
  loading: boolean;
  columnConfig: number;
  isShowFilter: boolean;
  toggleFilter: () => void;
  toggleColumns: (type: "default" | "more") => void;
};

export const FiltersTop = memo(
  ({
    column,
    loading,
    toggleFilter,
    isShowFilter,
    columnConfig,
    toggleColumns,
  }: FiltersProps) => {
    return (
      <div className="filters__container" id="filters-top">
        <div className="filters__wrapper">
          <button className="filters__toggle" onClick={toggleFilter}>
            {isShowFilter ? <IconArrow /> : <IconFilter />}
            <span>Filters</span>
          </button>
          <div className="filters__live">
            <button>{loading ? <IconLoading /> : <IconPause />}</button>
            <div className="texts">
              <span>Live data active</span>
              <span>Last update: 22 seconds ago</span>
            </div>
          </div>
          <FiltersSearch
            placeholder="Search by NFTs"
            setCollectionMain={undefined}
          />
          <div className="filters__list">
            <div
              className="active"
              style={{
                transform: `translateX(${column === columnConfig ? 5 : 59}px)`,
                width: 40,
              }}
            ></div>
            <button onClick={() => toggleColumns("default")}>
              <Icon4Dots />
            </button>
            <button onClick={() => toggleColumns("more")}>
              <Icon9Dots />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

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

const IconPause = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.375 5.5C7.33947 5.5 6.5 6.33947 6.5 7.375V16.625C6.5 17.6605 7.33947 18.5 8.375 18.5C9.41053 18.5 10.25 17.6605 10.25 16.625V7.375C10.25 6.33947 9.41053 5.5 8.375 5.5ZM15.625 5.5C14.5895 5.5 13.75 6.33947 13.75 7.375V16.625C13.75 17.6605 14.5895 18.5 15.625 18.5C16.6605 18.5 17.5 17.6605 17.5 16.625V7.375C17.5 6.33947 16.6605 5.5 15.625 5.5Z"
        fill="#FFF"
      ></path>
    </svg>
  );
};

const IconLoading = () => {
  return (
    <svg
      viewBox="0 0 25 24"
      fill="none"
      width="24"
      height="24"
      style={{
        animation: "1s linear 0s infinite normal forwards running loadingIcon",
      }}
    >
      <path
        d="M7.96997 12C7.96997 14.7614 10.2085 17 12.97 17C15.7314 17 17.97 14.7614 17.97 12C17.97 9.23858 15.7314 7 12.97 7"
        stroke="#FFF"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
    </svg>
  );
};

const Icon4Dots = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 4.9231C13.8954 4.9231 13 5.81853 13 6.9231V9.9231C13 11.0277 13.8954 11.9231 15 11.9231H18C19.1046 11.9231 20 11.0277 20 9.9231V6.9231C20 5.81853 19.1046 4.9231 18 4.9231H15ZM15 13.9231C13.8954 13.9231 13 14.8185 13 15.9231V18.9231C13 20.0277 13.8954 20.9231 15 20.9231H18C19.1046 20.9231 20 20.0277 20 18.9231V15.9231C20 14.8185 19.1046 13.9231 18 13.9231H15ZM4 15.9231C4 14.8185 4.89543 13.9231 6 13.9231H9C10.1046 13.9231 11 14.8185 11 15.9231V18.9231C11 20.0277 10.1046 20.9231 9 20.9231H6C4.89543 20.9231 4 20.0277 4 18.9231V15.9231ZM6 4.9231C4.89543 4.9231 4 5.81853 4 6.9231V9.9231C4 11.0277 4.89543 11.9231 6 11.9231H9C10.1046 11.9231 11 11.0277 11 9.9231V6.9231C11 5.81853 10.1046 4.9231 9 4.9231H6Z"
        fill="#FFF"
      ></path>
    </svg>
  );
};

const Icon9Dots = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 6.9231C4 5.81853 4.89543 4.9231 6 4.9231C7.10457 4.9231 8 5.81853 8 6.9231C8 8.02767 7.10457 8.9231 6 8.9231C4.89543 8.9231 4 8.02767 4 6.9231ZM4 12.9231C4 11.8185 4.89543 10.9231 6 10.9231C7.10457 10.9231 8 11.8185 8 12.9231C8 14.0277 7.10457 14.9231 6 14.9231C4.89543 14.9231 4 14.0277 4 12.9231ZM6 16.9231C4.89543 16.9231 4 17.8185 4 18.9231C4 20.0277 4.89543 20.9231 6 20.9231C7.10457 20.9231 8 20.0277 8 18.9231C8 17.8185 7.10457 16.9231 6 16.9231ZM10 6.9231C10 5.81853 10.8954 4.9231 12 4.9231C13.1046 4.9231 14 5.81853 14 6.9231C14 8.02767 13.1046 8.9231 12 8.9231C10.8954 8.9231 10 8.02767 10 6.9231ZM12 10.9231C10.8954 10.9231 10 11.8185 10 12.9231C10 14.0277 10.8954 14.9231 12 14.9231C13.1046 14.9231 14 14.0277 14 12.9231C14 11.8185 13.1046 10.9231 12 10.9231ZM10 18.9231C10 17.8185 10.8954 16.9231 12 16.9231C13.1046 16.9231 14 17.8185 14 18.9231C14 20.0277 13.1046 20.9231 12 20.9231C10.8954 20.9231 10 20.0277 10 18.9231ZM18 4.9231C16.8954 4.9231 16 5.81853 16 6.9231C16 8.02767 16.8954 8.9231 18 8.9231C19.1046 8.9231 20 8.02767 20 6.9231C20 5.81853 19.1046 4.9231 18 4.9231ZM16 12.9231C16 11.8185 16.8954 10.9231 18 10.9231C19.1046 10.9231 20 11.8185 20 12.9231C20 14.0277 19.1046 14.9231 18 14.9231C16.8954 14.9231 16 14.0277 16 12.9231ZM18 16.9231C16.8954 16.9231 16 17.8185 16 18.9231C16 20.0277 16.8954 20.9231 18 20.9231C19.1046 20.9231 20 20.0277 20 18.9231C20 17.8185 19.1046 16.9231 18 16.9231Z"
        fill="#FFF"
      ></path>
    </svg>
  );
};
