/* eslint-disable @next/next/no-img-element */
import Input from "@/components/input";
import { Notification } from "@/components/notification";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import { GridCard } from "../components/gridCard";

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
  const [data, setData] = useState([]);
  const [rowGap, setRowGap] = useState(10);
  const [columnGap, setColumnGap] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [column, setColumn] = useState(widthConfig);

  useEffect(() => {
    setColumn(widthConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    (async () => {
      fetch(
        "https://api-sgz.onrender.com/v1/images/creator/63386a841863b522ba1f6e9d?size=200&page=0&sortBy=createdAt&sortType=desc"
      )
        .then((response) => response.json())
        .then(({ items }) => {
          setData(items);
          setIsLoading(false);
        });
    })();
  }, []);

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
        {isLoading ? (
          <div className="loading">
            <span>Waiting...</span>
            <img
              src="https://media.tenor.com/2roX3uxz_68AAAAM/cat-space.gif"
              alt="nyan"
            />
          </div>
        ) : (
          <GridCard
            data={data}
            column={column <= 0 ? 1 : column}
            rowGap={rowGap}
            columnGap={columnGap}
          />
        )}
      </main>
    </>
  );
}
