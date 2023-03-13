import { useEffect, useState } from "react";
import axios from "axios";

export default function useNft(pageNumber: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nfts, setNfts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel: any;
    axios({
      method: "GET",
      url: "https://api-sgz.onrender.com/v1/images/creator/63386a841863b522ba1f6e9d",
      params: { size: 100, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setNfts((prevNfts: any) => {
          return [...prevNfts, ...res.data.items];
        });
        setHasMore(res.data.items.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNumber]);

  return { loading, error, nfts, hasMore };
}
