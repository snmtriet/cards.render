/* eslint-disable @next/next/no-img-element */
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";

import useDebounce from "@/hooks/useDebounce";
import useSearchCollection from "@/hooks/useSearchCollection";
import { IconLoading } from "@/layout/components/svg";
import { useRouter } from "next/router";
import Link from "next/link";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { CollectionBoxProps, FiltersSearchProps } from "@/model";
import { formatFirstStringToUpperCase } from "@/utils/formatFirstString";

export const FiltersSearch = ({ isAside, placeholder }: FiltersSearchProps) => {
  const nodeRef = useRef(null);
  const { width } = useWindowDimensions();
  const [searchTermDebounce, searchTerm, setSearchTerm] = useDebounce("", 300);

  const { collections, loading } = useSearchCollection(searchTermDebounce);

  return (
    <div
      className={classNames("filters__search", {
        aside: isAside,
      })}
    >
      <div className="icon">
        {loading ? (
          <IconLoading color="#FFF" />
        ) : (
          <svg viewBox="0 0 25 24" fill="none" width="24" height="24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.74658 11.125C7.74658 8.70875 9.70534 6.75 12.1216 6.75C14.5378 6.75 16.4966 8.70875 16.4966 11.125C16.4966 13.5412 14.5378 15.5 12.1216 15.5C9.70534 15.5 7.74658 13.5412 7.74658 11.125ZM12.1216 5C8.73884 5 5.99658 7.74226 5.99658 11.125C5.99658 14.5077 8.73884 17.25 12.1216 17.25C13.5005 17.25 14.773 16.7943 15.7967 16.0253C15.8212 16.0579 15.8482 16.0891 15.8779 16.1187L18.5029 18.7437C18.8446 19.0854 19.3986 19.0854 19.7403 18.7437C20.082 18.402 20.082 17.848 19.7403 17.5063L17.1153 14.8813C17.0857 14.8516 17.0545 14.8246 17.0219 14.8001C17.7909 13.7764 18.2466 12.5039 18.2466 11.125C18.2466 7.74226 15.5043 5 12.1216 5Z"
              fill="currentColor"
            ></path>
          </svg>
        )}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <CSSTransition
        in={collections && collections.length > 0}
        nodeRef={nodeRef}
        timeout={300}
        classNames="result-collection"
        unmountOnExit
      >
        <div
          className="collections-result"
          ref={nodeRef}
          style={{
            width: width && width < 468 ? width : "100%",
            left: width && width < 468 ? "-1.25rem" : 0,
          }}
        >
          {collections &&
            collections.length > 0 &&
            collections.map((item: any) => (
              <CollectionBox
                key={item.document.collectionSlug}
                item={item}
                loading={loading}
                setSearchTerm={setSearchTerm}
              />
            ))}
        </div>
      </CSSTransition>
    </div>
  );
};

const CollectionBox = ({
  setSearchTerm,
  loading,
  item,
}: CollectionBoxProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>();
  return (
    <Link
      href={`/?collection=${item.document.collectionSlug}`}
      className="collection"
      onClick={() => {
        setSearchTerm("");
      }}
    >
      <div
        className={classNames("collection__image", {
          isLoading: !isImageLoaded,
        })}
      >
        <img
          src={item.document.image || item.document.openseaImage}
          alt={item.document.searchName}
          loading="lazy"
          style={{
            opacity: !isImageLoaded ? 0 : 1,
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <div className="collection__info">
        <div className="collection__text">
          <span>{item.document.searchName}</span>
          <span>
            Floor: {item.document.floorPrice} ETH -{" "}
            {formatFirstStringToUpperCase(item.document.blockchain)}
          </span>
        </div>
      </div>
    </Link>
  );
};
