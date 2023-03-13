/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";

import Input from "@/components/input";
import useNft from "@/hooks/useNft";
import { GridCard } from "../components/gridCard";
import { Notification } from "@/components/notification";
import useWindowDimensions from "@/hooks/useWindowDimensions";

export default function Home() {
  const { width } = useWindowDimensions();
  const widthConfig = width
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
  const [column, setColumn] = useState(widthConfig);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    setColumn(widthConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const { nfts, hasMore, loading, error } = useNft(pageNumber);

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

        <GridCard
          ref={lastNftElementRef}
          data={nfts}
          column={column <= 0 ? 1 : column}
          rowGap={rowGap}
          columnGap={columnGap}
        />

        {loading && (
          <div className="loading">
            <img
              src="http://pa1.narvii.com/6042/dcf403976bda4dec53e694369b3ff6f95a34df32_00.gif"
              alt="loading"
            />
          </div>
        )}
      </main>
    </>
  );
}
