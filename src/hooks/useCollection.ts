import { useEffect, useRef, useState } from "react";
import axios from "axios";

import dataJSON from "../../collection.json";

export default function useCollection(collectionName: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [collection, setCollection] = useState<any>({});
  const collectionNameRef = useRef<string>("");

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (!collectionName) {
      setLoading(false);
      setCollection({});
      collectionNameRef.current = collectionName;
      return;
    }

    if (collectionName !== collectionNameRef.current) {
      collectionNameRef.current = collectionName;
    } else {
      setLoading(false);
      setError(false);
      return;
    }

    if (dataJSON[collectionName as keyof typeof dataJSON]) {
      setCollection(dataJSON[collectionName as keyof typeof dataJSON]);
    }

    let cancel: any;

    axios({
      method: "GET",
      url: `https://api.raritysniper.com/public/collection/${collectionName}`,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(({ data }) => {
        if (data) {
          axios({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_FE_URL}/api/collections`,
            data: data,
          });
        }
        setCollection(data);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [collectionName]);

  return { loading, error, collection };
}
