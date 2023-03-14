import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function useNft(pageNumber: number, query: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nfts, setNfts] = useState<any>([]);
  const [nftsFiltered, setNftsFiltered] = useState<any>([]);
  const [hasMore, setHasMore] = useState(false);
  const queryRef = useRef();

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel: any;
    axios({
      method: "GET",
      url: `https://us-central1-bayc-metadata.cloudfunctions.net/api/tokens/traits/${pageNumber}/24`,
      params: query,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (Object.keys(query).length <= 0) {
          setNfts((prevNfts: any) => {
            return [...prevNfts, ...res.data.tokenData];
          });
        } else {
          queryRef.current = query;
          if (JSON.stringify(queryRef.current) === JSON.stringify(query)) {
            setNftsFiltered((prevNfts: any) => {
              return [...prevNfts, ...res.data.tokenData];
            });
          } else {
            setNftsFiltered(res.data.tokenData);
          }
        }
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
