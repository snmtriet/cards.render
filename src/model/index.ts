import React, {
  ChangeEvent,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react";

export enum Sort {
  "R-desc" = "Rank: High to low",
  "R-asc" = "Rank: Low to high",
  "P-desc" = "Price: High to low",
  "P-asc" = "Price: Low to high",
  "NFT-desc" = "Nft Id: High to low",
  "NFT-asc" = "Nft Id: Low to high",
}

export type CardsRenderProps = {
  item: any;
};

export type GridCardProps = {
  data: any;
  column: number;
  rowGap: number;
  columnGap: number;
  isRefetch: boolean;
};

export type InputProps = {
  title: string;
  value: string | number;
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | string,
    type: string
  ) => void;
  keyValue: string;
  disabled?: boolean;
  type?: string;
  inputMode?:
    | "search"
    | "text"
    | "none"
    | "email"
    | "tel"
    | "url"
    | "numeric"
    | "decimal"
    | undefined;
};

export type traitType = {
  count: number;
  highlighted: string;
  value: string;
  checked?: boolean;
};

export type FiltersOptionProps = {
  item: traitType;
  pushQuery?: (property: string, value: string, type: "ADD" | "REMOVE") => void;
  title: string;
};

export type FilterRowProps = {
  title: string;
  isTraitsProperty?: boolean;
  data?: traitType[];
  count?: number;
  pushQuery?: (property: string, value: string, type: "ADD" | "REMOVE") => void;
  toggleProperties?: () => void;
  isShowProperties?: boolean;
  traits?: traitData[];
};

export type traitData = {
  counts: traitType[];
  field_name: string;
  stats: {
    total_values: number;
  };
};

export type FiltersSearchProps = {
  isAside?: boolean;
  placeholder?: string;
};

export type CollectionBoxProps = {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  loading: boolean;
  item: any;
};

export type SiteChatProps = {
  sort: string;
  column: number;
  rowGap: number;
  columnGap: number;
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | string,
    type: string
  ) => void;
  isShowFilter: boolean;
  traits: traitData[];
  isOpenNavMobile: boolean;
  isShowProperties: boolean;
  toggleProperties: () => void;
  setIsShowFilter: Dispatch<SetStateAction<boolean>>;
  setOpenNavMobile: Dispatch<SetStateAction<boolean>>;
  pushQuery: (property: string, value: string, type: "ADD" | "REMOVE") => void;
};
