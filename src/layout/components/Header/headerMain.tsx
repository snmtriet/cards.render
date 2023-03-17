/* eslint-disable @next/next/no-img-element */
import React, { memo, SetStateAction } from "react";

import { FiltersTop } from "@/components/Filters/filtersTop";

interface HeaderMainProps {
  column: number;
  loading: boolean;
  columnConfig: number;
  toggleFilter: () => void;
  isShowFilter: boolean;
  toggleColumns: (type: "default" | "more") => void;
  setSearchTerm: React.Dispatch<SetStateAction<string>>;
  searchTerm: string;
}

const HeaderMain = ({
  column,
  loading,
  columnConfig,
  toggleFilter,
  isShowFilter,
  toggleColumns,
  setSearchTerm,
  searchTerm,
}: HeaderMainProps) => {
  return (
    <div className="header-container">
      <div className="header-layout">
        <div className="header-layout__actions">
          <FiltersTop
            column={column}
            loading={loading}
            columnConfig={columnConfig}
            toggleFilter={toggleFilter}
            isShowFilter={isShowFilter}
            toggleColumns={toggleColumns}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(HeaderMain);
