import axios from "axios";
import { useEffect } from "react";

axios.create({
  withCredentials: false,
});

export default function TestPage() {
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { results },
        } = await axios.post(
          "https://search2.raritysniper.com/multi_search?use_cache=true&x-typesense-api-key=L1NoMW9ITm1SYWNodFk4cWpmaHphQWZTS2tuaTVFWDNGdmxjT1llcEpLdz1uNWhMeyJmaWx0ZXJfYnkiOiJwdWJsaXNoZWQ6dHJ1ZSJ9",
          {
            searches: [
              {
                query_by:
                  "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name",
                sort_by: "rank:asc,nftId:asc",
                highlight_full_fields:
                  "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name",
                collection: "assets_mutant-ape-yacht-club",
                q: "*",
                facet_by:
                  "trait_background,trait_clothes,trait_earring,trait_eyes,trait_fur,trait_hat,trait_mouth,trait_name,trait_traits-count,forSale,rank,nftId,sortPrice",
                filter_by: "trait_background:=[`M2 Orange`]",
                max_facet_values: 87,
                page: 1,
                per_page: 24,
              },
            ],
          }
        );
        console.log({ results });
      } catch (error) {
        console.log("🍕 ~ error:", error);
      }
    })();
  }, []);

  return <div>heehe</div>;
}
