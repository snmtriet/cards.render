/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { CSSProperties, useState } from "react";

type CardsRenderProps = {
  style?: CSSProperties;
  item: any;
  cardOffset: any;
};

export const CardsRender = ({ style, item, cardOffset }: CardsRenderProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <div className="card__container" style={style}>
      <div className="card__wrapper">
        <Link href="#" className="card__link">
          <div
            className={`card__image ${!isImageLoaded && "isLoading"}`}
            style={{
              width: cardOffset.w,
              height: cardOffset.h - 150,
            }}
          >
            <img
              src={
                `${item.source}=s400` ??
                "https://assets.raribleuserdata.com/prod/v1/image/t_image_preview/aHR0cHM6Ly9pcGZzLmlvL2lwZnMvUW1VRENCNzllQVlTNDh4WVlXZjhTMzJuVEZ4ZUJVbkE2UExNMXV6ck5SM3FFYw=="
              }
              onLoad={() => {
                setIsImageLoaded(true);
              }}
              style={{ opacity: isImageLoaded ? 1 : 0 }}
              referrerPolicy="no-referrer"
              loading="lazy"
              alt="card"
            />
          </div>
          <div className="card__info">
            <div className="card__title">
              <div className="card__titleTop">
                <span className="card__collection">MutantApeYachtClub</span>
                <div>
                  <Icon />
                </div>
              </div>
              <span className="card__nft">MutantApeYachtClub #255</span>
            </div>
            <div className="card__prize"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const Icon = () => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M4.78117 0.743103C5.29164 -0.247701 6.70826 -0.247701 7.21872 0.743103C7.52545 1.33846 8.21742 1.62509 8.8553 1.42099C9.91685 1.08134 10.9186 2.08304 10.5789 3.1446C10.3748 3.78247 10.6614 4.47445 11.2568 4.78117C12.2476 5.29164 12.2476 6.70826 11.2568 7.21872C10.6614 7.52545 10.3748 8.21742 10.5789 8.8553C10.9186 9.91685 9.91685 10.9186 8.8553 10.5789C8.21742 10.3748 7.52545 10.6614 7.21872 11.2568C6.70826 12.2476 5.29164 12.2476 4.78117 11.2568C4.47445 10.6614 3.78247 10.3748 3.1446 10.5789C2.08304 10.9186 1.08134 9.91685 1.42099 8.8553C1.62509 8.21742 1.33846 7.52545 0.743103 7.21872C-0.247701 6.70826 -0.247701 5.29164 0.743103 4.78117C1.33846 4.47445 1.62509 3.78247 1.42099 3.1446C1.08134 2.08304 2.08304 1.08134 3.1446 1.42099C3.78247 1.62509 4.47445 1.33846 4.78117 0.743103Z"
        fill="#feda03"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.43961 4.23998C8.64623 4.43922 8.65221 4.76823 8.45297 4.97484L5.40604 8.13462L3.54703 6.20676C3.34779 6.00014 3.35377 5.67113 3.56039 5.47189C3.76701 5.27266 4.09602 5.27864 4.29526 5.48525L5.40604 6.63718L7.70475 4.25334C7.90398 4.04672 8.23299 4.04074 8.43961 4.23998Z"
        fill="#000000"
      ></path>
    </svg>
  );
};
