/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useState, useEffect } from "react";

import cx from "classnames";

export default function Mutant() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_FE_URL}/api/mutant`,
    }).then(({ data }) => {
      console.log(data);
      setNfts(data);
    });
  }, []);

  return (
    <div className="grid-data">
      {nfts &&
        nfts.length > 0 &&
        nfts.map((item: { id: string; name: string }, index: number) => (
          <Card key={item.id} item={item} />
        ))}
    </div>
  );
}

const Card = ({ item }: { item: { id: string; name: string } }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <div
      className={cx("grid-card", {
        isLoading: !isImageLoaded,
      })}
    >
      <img
        src={`${item.id}=s400`}
        alt={item.name}
        onLoad={() => {
          setIsImageLoaded(true);
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{ opacity: isImageLoaded ? 1 : 0 }}
      />
    </div>
  );
};
