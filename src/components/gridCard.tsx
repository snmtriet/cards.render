/* eslint-disable react/display-name */
import useWindowDimensions from "@/hooks/useWindowDimensions";
import React, { createRef, forwardRef, memo, useEffect, useState } from "react";
import { CardsRender } from "./cardsRender";
import { CSSTransition, TransitionGroup } from "react-transition-group";
type GridCardProps = {
  data: any;
  column: number;
  rowGap: number;
  columnGap: number;
  isRefetch: boolean;
};

const cardBottomHeight = 150;

export const GridCard = memo(
  forwardRef((props: GridCardProps, ref: React.Ref<HTMLDivElement>) => {
    const { data, column, rowGap, columnGap, isRefetch } = props;
    const [dataRender, setDataRender] = useState<any[]>([]);
    const { width } = useWindowDimensions();

    useEffect(() => {
      const grid = document.getElementById("dynamic-grid");
      if (grid) {
        let { clientWidth } = grid;
        let cardWidth = (clientWidth - rowGap * (column - 1)) / column;
        const cardHeight = cardWidth + cardBottomHeight; // added height 150px
        let rowIndex = 1;
        let left = 0;
        let count = 0;
        const newArray =
          data &&
          data.length > 0 &&
          data.map((item: any, index: number) => {
            if (count > 24) {
              count = 0;
            } else {
              count++;
            }
            if (Number.isInteger(index / column)) {
              rowIndex++;
              left = 0;
            } else {
              left = left + (cardWidth + rowGap);
            }
            if (index + 1 === data.length) {
              return {
                ...item,
                row: rowIndex,
                top: (rowIndex - 2) * (cardHeight + columnGap),
                left: left,
                width: cardWidth,
                height: cardHeight,
                nodeRef: ref,
                count,
              };
            } else {
              return {
                ...item,
                row: rowIndex,
                top: (rowIndex - 2) * (cardHeight + columnGap),
                left: left,
                width: cardWidth,
                height: cardHeight,
                nodeRef: createRef(),
                count,
              };
            }
          });
        setDataRender(newArray);
      }
    }, [column, data, rowGap, columnGap, width, isRefetch, ref]);

    useEffect(() => {
      const grid = document.getElementById("dynamic-grid");
      if (
        dataRender &&
        dataRender.length > 0 &&
        grid &&
        grid?.childNodes.length > 0
      ) {
        const { childNodes } = grid;
        grid.style.cssText = `
              position: relative;
              height: ${
                Math.ceil(dataRender.length / column) *
                (dataRender[0].height + columnGap)
              }px;
              maxHeight: ${
                Math.ceil(dataRender.length / column) *
                (dataRender[0].height + columnGap)
              }px;
          `;

        dataRender.map((item: any, index) => {
          if (childNodes[index] as HTMLElement) {
            const card__image = (childNodes[index] as HTMLElement).children[0]
              .children[0].children[0] as HTMLElement;

            (childNodes[index] as HTMLElement).style.cssText = `
                      position: absolute;
                      top: ${item.top}px;
                      left: ${item.left}px;
                      width: ${item.width}px;
                      height: ${item.height}px;
                  `;

            card__image.style.height = `${item.height - cardBottomHeight}px`;
          }
        });
      }
    }, [dataRender, column, data, rowGap, columnGap, width, isRefetch, ref]);

    return (
      <TransitionGroup className="dynamic-grid" id="dynamic-grid">
        {dataRender &&
          dataRender.length > 0 &&
          dataRender.map((item: any, index: number) => {
            return (
              <CSSTransition
                key={`${item.document.nftId}-${index}-${item.document.image}`}
                nodeRef={item.nodeRef}
                timeout={500}
                classNames="item"
              >
                <CardsRender
                  ref={item.nodeRef}
                  key={`${item.document.nftId}-${index}-${item.document.image}`}
                  item={item}
                />
              </CSSTransition>
            );
          })}
      </TransitionGroup>
    );
  })
);
