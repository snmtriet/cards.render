/* eslint-disable @next/next/no-img-element */
import React, { memo } from "react";

import { FiltersTop } from "@/components/Filters/filtersTop";

interface HeaderMainProps {
  column: number;
  loading: boolean;
  columnConfig: number;
  toggleFilter: () => void;
  isShowFilter: boolean;
  toggleColumns: (type: "default" | "more") => void;
}

const HeaderMain = ({
  column,
  loading,
  columnConfig,
  toggleFilter,
  isShowFilter,
  toggleColumns,
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
          />
        </div>
      </div>
    </div>
  );
};

export default memo(HeaderMain);
