import { useEffect, useState } from "react";
import axios from "axios";

import dataJSON from "../../collection.json";

export default function useCollection(collectionName: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [collection, setCollection] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (!collectionName) {
      setLoading(false);
      setCollection({});
      return;
    }

    if (dataJSON[collectionName as keyof typeof dataJSON]) {
      setCollection(dataJSON[collectionName as keyof typeof dataJSON]);
    }

    let cancel: any;

    axios({
      method: "GET",
      url: `https://api.raritysniper.com/public/collection/${collectionName}`,
      withCredentials: false,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(({ data }) => {
        setCollection(data);
        setLoading(false);
        if (data) {
          axios({
            method: "POST",
            url: "http://localhost:3000/api/collections",
            data: data,
          });
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [collectionName]);

  return { loading, error, collection };
}
