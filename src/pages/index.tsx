/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";

import useNft from "@/hooks/useNft";
import Input from "@/components/input";
import { GridCard } from "../components/gridCard";
import { Notification } from "@/components/notification";
import { FiltersTop } from "@/components/Filters/filtersTop";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { FiltersRow, FiltersSearch } from "@/components/Filters";

type traitType = {
  count: number;
  highlighted: string;
  value: string;
};

type traitData = {
  counts: traitType[];
  field_name: string;
  stats: {
    total_values: number;
  };
};

export default function Home() {
  const { width, height } = useWindowDimensions();
  const columnConfig = width
    ? width > 1440
      ? 6
      : width < 1440 && width > 1000
      ? 5
      : width < 1000 && width > 768
      ? 3
      : width < 768 && width > 500
      ? 2
      : 1
    : 6;
  const [rowGap, setRowGap] = useState(10);
  const [columnGap, setColumnGap] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [column, setColumn] = useState(columnConfig);
  const [isShowFilter, setIsShowFilter] = useState(true);
  const [query, setQuery] = useState({});

  useEffect(() => {
    setColumn(columnConfig);

    if (width && width < 768) setIsShowFilter(false);
    if (height) {
      const filter = document.getElementById("filters");
      if (filter) filter.style.height = `${height - 50}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  const { nfts, traits, hasMore, loading, error } = useNft(pageNumber, query);

  const pushQuery = (trait: string, value: string, type: "ADD" | "REMOVE") => {
    if (type === "ADD")
      setQuery((prev) => {
        const prevTraits: string[] | undefined =
          prev[trait as keyof typeof prev];
        return {
          ...prev,
          [trait]: prevTraits ? [prevTraits, value].flat() : [value],
        };
      });
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
  };

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
    <>
      <Head>
        <title>Cards render</title>
        <meta name="description" content="Cards render | mtriet vjp pro" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="referrer" content="no-referrer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: 20, background: "rgba(255, 255, 255, 0.08)" }}>
        <Notification />
        <FiltersTop setIsShowFilter={setIsShowFilter} />
        <div className="container">
          <div className="container__wrapper">
            {isShowFilter && (
              <div className="filters" id="filters">
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
                <FiltersRow title="Properties" />
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
              </div>
            )}

            <div className="list">
              <GridCard
                ref={lastNftElementRef}
                data={nfts}
                column={column <= 0 ? 1 : column}
                rowGap={rowGap}
                columnGap={columnGap}
                isShowFilter={isShowFilter}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
