import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function useNftOpensea(
  collectionAddress: string,
  nftId: string | number
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nftOpensea, setNftOpensea] = useState<any>({});
  const nftIdRef = useRef<string | number>("");

  useEffect(() => {
    setLoading(true);
    setError(false);
    if (nftId !== nftIdRef.current) {
      nftIdRef.current = nftId;
    } else {
      setLoading(false);
      setError(false);
      return;
    }

    // let cancel: any;

    axios({
      method: "GET",
      url: `https://api.opensea.io/api/v1/asset/${collectionAddress}/${nftId}`,
      // cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(({ data }) => {
        // console.log("🍕 ~ data:", data);
        setNftOpensea(data);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    // return () => cancel();
  }, [collectionAddress, nftId]);

  return { loading, error, nftOpensea };
}
