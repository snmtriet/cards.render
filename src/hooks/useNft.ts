import { useEffect, useRef, useState } from "react";
import axios from "axios";

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

const parseQuery = (query: {}): string => {
  return JSON.stringify(query)
    .replace("{", "")
    .replace("}", "")
    .replaceAll('"', "`")
    .replaceAll("`:", ":=")
    .replaceAll("],`", "] && ")
    .replace("`", "")
    .replace("]`", "]");
};

export default function useNft(pageNumber: number, query: {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nfts, setNfts] = useState<any>([]);
  const [traits, setTraits] = useState<traitData[]>([]);
  const [found, setFound] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const queryRef = useRef({} as any);

  function filterTraits(
    traitName: string,
    value: string,
    type: "ADD" | "REMOVE"
  ) {
    setTraits((prevTraits: traitData[]) => {
      return prevTraits.map((trait: traitData) => {
        if (trait.field_name === traitName) {
          return {
            ...trait,
            counts: trait.counts.map((traitType: traitType) => {
              if (traitType.value === value) {
                return { ...traitType, checked: type === "ADD" ? true : false };
              }
              return traitType;
            }),
          };
        }
        return trait;
      });
    });
  }

  useEffect(() => {
    setLoading(true);
    setError(false);
    const isEqualQuery =
      JSON.stringify(queryRef.current) === JSON.stringify(query);

    let cancel: any;

    const searchQuery = {
      query_by:
        "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name",
      sort_by: "rank:asc,nftId:asc",
      highlight_full_fields:
        "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name",
      collection: "assets_mutant-ape-yacht-club",
      q: "*",
      facet_by:
        "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name,trait_traits-count,forSale,rank,nftId,sortPrice",
      max_facet_values: 87,
      page: pageNumber,
      per_page: 24,
    };

    axios({
      method: "POST",
      url: "https://search2.raritysniper.com/multi_search?use_cache=true&x-typesense-api-key=L1NoMW9ITm1SYWNodFk4cWpmaHphQWZTS2tuaTVFWDNGdmxjT1llcEpLdz1uNWhMeyJmaWx0ZXJfYnkiOiJwdWJsaXNoZWQ6dHJ1ZSJ9",
      data: {
        searches: [
          Object.keys(query).length > 0
            ? Object.assign(searchQuery, {
                filter_by: parseQuery(query),
              })
            : searchQuery,
        ],
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(({ data: { results } }) => {
        //! FIRST TIME FETCH DATA
        if (
          Object.keys(query).length === 0 &&
          Object.keys(queryRef.current).length === 0
        ) {
          setTraits(results[0].facet_counts);
          setNfts((prevNfts: any) => {
            return [...prevNfts, ...results[0].hits];
          });
          setFound(results[0].found);
        }

        //! WHEN USER REMOVED ALL TRAIT VALUE IN FILTER
        if (
          Object.keys(query).length === 0 &&
          Object.keys(queryRef.current).length > 0
        ) {
          setNfts(results[0].hits);
          setFound(results[0].found);
          queryRef.current = {};
        }

        //! WHEN USER CHOOSE TRAIT VALUE IN FILTER
        if (Object.keys(query).length > 0) {
          setNfts((prevNfts: any) => {
            return isEqualQuery
              ? [...prevNfts, ...results[0].hits]
              : results[0].hits;
          });
          setFound(results[0].found);

          // CHECK QUERY DUPLICATE
          if (!isEqualQuery) {
            queryRef.current = query as any;
          }
        }

        setHasMore(results[0].hits.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNumber, query]);

  return { loading, error, nfts, hasMore, traits, filterTraits, found };
}
