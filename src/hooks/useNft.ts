import { formatFirstStringToLowerCase } from "@/utils/formatFirstString";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useCollection from "./useCollection";
import { Sort, traitData, traitType } from "@/model";

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

export default function useNft(
  pageNumber: number,
  query: {},
  collectionSlug: any,
  sort: Sort
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nfts, setNfts] = useState<any>([]);
  const [traits, setTraits] = useState<traitData[]>([]);
  const [found, setFound] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const queryRef = useRef({} as any);
  const collectionRef = useRef("");
  const sortRef = useRef("");

  let nftsClone: any[] = nfts;
  let pageNumberClone: number = pageNumber;

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

  const { collection, loading: loadingCollection } =
    useCollection(collectionSlug);

  useEffect(() => {
    const sort_by = sort
      ? `${formatFirstStringToLowerCase(
          sort
            .slice(0, sort.indexOf(":"))
            .replace(" ", "")
            .replace("price", "sortPrice")
        )}:${
          sort.includes("High to low")
            ? "desc"
            : sort.includes("Low to high")
            ? "asc"
            : ""
        }`.replace("price", "sortPrice")
      : "rank:asc,nftId:asc";

    setLoading(true);
    setError(false);
    const isEqualQuery =
      JSON.stringify(queryRef.current) === JSON.stringify(query);

    if (collection.collectionSlug !== collectionRef.current) {
      nftsClone = [];
      pageNumberClone = 1;
    }

    let cancel: any;

    let searchQuery = {};
    if (Object.keys(collection).length <= 0 && !collection.traitsData) {
      searchQuery = {
        query_by:
          "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name",
        sort_by: sort_by,
        highlight_full_fields:
          "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name",
        collection: "assets_mutant-ape-yacht-club",
        q: "*",
        facet_by:
          "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name,trait_traits-count,forSale,rank,nftId,sortPrice",
        max_facet_values: 87,
        page: pageNumberClone,
        per_page: 24,
      };
    } else {
      const query_by = Object.keys(collection.traitsData).map((trait) => {
        if (trait.includes(" ")) {
          return `trait_${trait.toLowerCase().replaceAll(" ", "-")}`;
        } else {
          return `trait_${trait.toLowerCase()}`;
        }
      });
      searchQuery = {
        query_by: query_by.slice(0, query_by.length - 1).join(","),
        sort_by: sort_by,
        highlight_full_fields: query_by.slice(0, query_by.length - 1).join(","),
        collection: `assets_${collection.collectionSlug}`,
        q: "*",
        facet_by: `${query_by.join(",")},forSale,rank,nftId,sortPrice`,
        max_facet_values: 87,
        page: pageNumberClone,
        per_page: 24,
      };
    }

    axios({
      method: "POST",
      url: "https://search.raritysniper.com/multi_search",
      params: {
        use_cache: true,
        "x-typesense-api-key": process.env.NEXT_PUBLIC_X_TYPESENSE_API_KEY,
      },
      data: {
        searches: [
          Object.keys(query).length > 0
            ? Object.assign(searchQuery, {
                filter_by: sort_by.includes("sortPrice:")
                  ? `${parseQuery(query)} && forSale:=[true]`
                  : parseQuery(query),
              })
            : searchQuery,
        ],
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then(({ data: { results } }) => {
        console.log("🍕 ~ results:", results);
        if (
          Object.keys(query).length === 0 &&
          Object.keys(queryRef.current).length === 0
        ) {
          //! FIRST TIME FETCH DATA
          setTraits(results[0].facet_counts);

          setNfts((prevNfts: any) => {
            if (collection.collectionSlug !== collectionRef.current) {
              return results[0].hits;
            } else {
              return [...nftsClone, ...results[0]?.hits];
            }
          });
          if (collectionRef.current !== collection.collectionSlug) {
            collectionRef.current = collection.collectionSlug;
          }

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

        if (sortRef.current !== sort) {
          setNfts(results[0].hits);
          setFound(results[0].found);
        }

        if (sortRef.current !== sort) {
          sortRef.current = sort;
        }

        setHasMore(results[0].hits.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [pageNumber, query, collection, sort]);

  return { loading, error, nfts, hasMore, traits, filterTraits, found };
}
