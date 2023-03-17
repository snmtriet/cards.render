/* eslint-disable @next/next/no-img-element */
import React, { Dispatch, SetStateAction, memo } from "react";
import Link from "next/link";
import classNames from "classnames";

import { IconNav } from "../svg";

interface HeaderMobileProps {
  setOpenNavMobile: Dispatch<SetStateAction<boolean>>;
  isOpenNavMobile: boolean;
}

const HeaderMobile = ({
  setOpenNavMobile,
  isOpenNavMobile,
}: HeaderMobileProps) => {
  return (
    <div className="header-container-mobile">
      <div className="header-mobile__wrapper">
        <Link href="/" className="logo-wtf">
          <div className="logo-label">
            <span className="text">
              Cards
              <span className="text strong">Render</span>
            </span>
          </div>
        </Link>

        <div className="nav-mobile">
          <button
            className={classNames("nav", { active: isOpenNavMobile })}
            onClick={() => setOpenNavMobile((prev: any) => !prev)}
          >
            <IconNav />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(HeaderMobile);