import { memo, Dispatch, SetStateAction } from "react";

import HeaderMain from "./headerMain";
import HeaderMobile from "./headerMobile";

interface HeaderProps {
  setOpenNavMobile: Dispatch<SetStateAction<boolean>>;
  isOpenNavMobile: boolean;
  column: number;
  loading: boolean;
  columnConfig: number;
  toggleFilter: () => void;
  isShowFilter: boolean;
  toggleColumns: (type: "default" | "more") => void;
  setSearchTerm: React.Dispatch<SetStateAction<string>>;
  searchTerm: string;
}

export default memo(function Header({
  setOpenNavMobile,
  isOpenNavMobile,
  column,
  loading,
  columnConfig,
  toggleFilter,
  isShowFilter,
  toggleColumns,
  searchTerm,
  setSearchTerm,
}: HeaderProps) {
  return (
    <>
      <HeaderMain
        loading={loading}
        columnConfig={columnConfig}
        column={column}
        toggleFilter={toggleFilter}
        isShowFilter={isShowFilter}
        toggleColumns={toggleColumns}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <HeaderMobile
        setOpenNavMobile={setOpenNavMobile}
        isOpenNavMobile={isOpenNavMobile}
      />
    </>
  );
});
