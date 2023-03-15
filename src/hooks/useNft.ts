import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function useNft(pageNumber: number, query: any) {
  console.log("🍕 ~ query:", query);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nfts, setNfts] = useState<any>([]);
  const [nftsFiltered, setNftsFiltered] = useState<any>([]);
  const [hasMore, setHasMore] = useState(false);
  const nextPageRef = useRef(0);
  const queryRef = useRef();

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel: any;

    axios({
      method: "GET",
      url: `https://us-central1-bayc-metadata.cloudfunctions.net/api/tokens/traits/${nextPageRef.current}/24`,
      params: query,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (Object.keys(query).length <= 0 || query === undefined || !query) {
          queryRef.current = undefined;
          setNfts((prevNfts: any) => {
            return [...prevNfts, ...res.data.tokenData];
          });
          setNftsFiltered([]);
        } else {
          const isEqualQuery =
            JSON.stringify(queryRef.current) === JSON.stringify(query);
          setNftsFiltered((prevNfts: any) => {
            return isEqualQuery
              ? [...prevNfts, ...res.data.tokenData]
              : res.data.tokenData;
          });
          if (!isEqualQuery) {
            queryRef.current = query;
          }
        }
        nextPageRef.current =
          res.data.tokenData.length < 24 && res.data.tokenData.length > 0
            ? 1500
            : res.data.nextPageStartingIndex;

        setHasMore(res.data.tokenData.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNumber, query]);

  return { loading, error, nfts, hasMore, nftsFiltered };
}
