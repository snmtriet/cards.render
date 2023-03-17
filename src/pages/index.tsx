/* eslint-disable react-hooks/exhaustive-deps */

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import useNft from "@/hooks/useNft";
import { GridCard } from "../components/gridCard";
import SiteChat from "@/layout/components/siteChat";
import Header from "@/layout/components/Header/header";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { Notification } from "@/components/notification";
import useDebounce from "@/hooks/useDebounce";
import axios from "axios";
import useSearchCollection from "@/hooks/useSearchCollection";
import { useRouter } from "next/router";
import useCollection from "@/hooks/useCollection";

export default function Home() {
  const { width, height } = useWindowDimensions();
  const [isOpenNavMobile, setOpenNavMobile] = useState(false);
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
  const [query, setQuery] = useState({});
  const [rowGap, setRowGap] = useState(10);
  const [columnGap, setColumnGap] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [isRefetch, setIsRefetch] = useState(false);
  const [column, setColumn] = useState(columnConfig);
  const [isShowFilter, setIsShowFilter] = useState(true);
  const [isShowProperties, setIsShowProperties] = useState(true);
  const [collectionMain, setCollectionMain] = useState<any>({});

  const router = useRouter();

  const { collection, loading: loadingCollection } = useCollection(
    router.query.collection as string
  );

  const { nfts, traits, hasMore, loading, filterTraits, found } = useNft(
    pageNumber,
    query,
    collection
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
    width && width < 992 && setIsShowFilter(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    if (width && width > 1200) {
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
      if (type === "ADD") {
        setQuery((prev) => {
          const prevTraits: string[] | undefined =
            prev[trait as keyof typeof prev];
          return {
            ...prev,
            [trait]: prevTraits ? [prevTraits, value].flat() : [value],
          };
        });
      }
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
      }
      filterTraits(trait, value, type);
      setPageNumber(1);
      setIsRefetch((prev) => !prev);
    },
    []
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
    <div className="site-container">
      <div className="site-layout">
        <div className="site-layout__header">
          <Header
            column={column}
            loading={loading}
            columnConfig={columnConfig}
            toggleFilter={toggleFilter}
            isShowFilter={isShowFilter}
            toggleColumns={toggleColumns}
            isOpenNavMobile={isOpenNavMobile}
            setOpenNavMobile={setOpenNavMobile}
          />
        </div>
        <div className="site-layout__main">
          <div
            className={classNames("page-layout-relative", {
              contain: !isShowFilter,
            })}
          >
            <div className="page-layout-main">
              <div className="page-layout-inner">
                <Notification />
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
                    <div className="list">
                      <GridCard
                        ref={lastNftElementRef}
                        data={nfts}
                        column={column <= 0 ? 1 : column}
                        rowGap={rowGap}
                        columnGap={columnGap}
                        isRefetch={isRefetch}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="page-layout-footer">
                {/* <Footer /> */}Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteChat
        rowGap={rowGap}
        column={column}
        traits={traits}
        columnGap={columnGap}
        pushQuery={pushQuery}
        isShowFilter={isShowFilter}
        handleChange={handleChange}
        setIsShowFilter={setIsShowFilter}
        isOpenNavMobile={isOpenNavMobile}
        setOpenNavMobile={setOpenNavMobile}
        toggleProperties={toggleProperties}
        isShowProperties={isShowProperties}
        setCollectionMain={setCollectionMain}
      />
    </div>
  );
}
