import { useEffect, useState } from "react";
import axios from "axios";

export default function useSearchCollection(searchTermDebounce: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (!searchTermDebounce) {
      setLoading(false);
      setCollections([]);
      return;
    }

    let cancel: any;

    axios({
      method: "GET",
      url: "https://search.raritysniper.com/collections/collections/documents/search",
      params: {
        "x-typesense-api-key": process.env.NEXT_PUBLIC_X_TYPESENSE_API_KEY,
        use_cache: true,
        q: searchTermDebounce,
        query_by: "searchName",
        highlight_fields: "name",
        page: 1,
        per_page: 10,
        sort_by: "sevenDayVolume:desc",
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(({ data }) => {
        setCollections(data.hits);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [searchTermDebounce]);

  return { loading, error, collections };
}
