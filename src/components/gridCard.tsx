/* eslint-disable react/display-name */
import useWindowDimensions from "@/hooks/useWindowDimensions";
import React, { createRef, useEffect, useState } from "react";
import { CardsRender } from "./cardsRender";
import { CSSTransition, TransitionGroup } from "react-transition-group";
type GridCardProps = {
  data: any;
  column: number;
  rowGap: number;
  columnGap: number;
  isRefetch: boolean;
};

export const GridCard = React.forwardRef(
  (props: GridCardProps, ref: React.Ref<HTMLDivElement>) => {
    const { data, column, rowGap, columnGap, isRefetch } = props;
    const [cardOffset, setCardOffset] = useState({
      w: 0,
      h: 0,
    });
    const [dataRender, setDataRender] = useState([]);
    const { width } = useWindowDimensions();

    useEffect(() => {
      const grid = document.getElementById("dynamic-grid");
      if (grid) {
        let { clientWidth } = grid;
        let cardWidth = (clientWidth - rowGap * (column - 1)) / column;
        const cardHeight = cardWidth + 150; // added height 150px
        setCardOffset({ w: cardWidth, h: cardHeight });
        let rowIndex = 1;
        let left = 0;
        const newArray = data.map((item: any, index: number) => {
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
              nodeRef: ref,
            };
          } else {
            return {
              ...item,
              row: rowIndex,
              top: (rowIndex - 2) * (cardHeight + columnGap),
              left: left,
              nodeRef: createRef(),
            };
          }
        });
        setDataRender(newArray);
      }
    }, [column, data, rowGap, columnGap, width, isRefetch, ref]);

    function calculateHeightGrid() {
      return Math.ceil(dataRender.length / column) * (cardOffset.h + columnGap);
    }

    return (
      <div
        className="dynamic-grid"
        id="dynamic-grid"
        style={{
          position: "relative",
          height: calculateHeightGrid(),
          maxHeight: calculateHeightGrid(),
        }}
      >
        <TransitionGroup className="todo-list">
          {dataRender.map((item: any, index: number) => {
            return (
              <CSSTransition
                key={`${item.document.nftId}-${index}-${item.document.image}`}
                nodeRef={item.nodeRef}
                timeout={500}
                classNames="item"
              >
                <CardsRender
                  ref={item.nodeRef}
                  cardOffset={cardOffset}
                  key={`${item.document.nftId}-${index}-${item.document.image}`}
                  item={item}
                  index={index}
                  style={{
                    position: "absolute",
                    top: item.top,
                    left: item.left,
                    width: cardOffset.w,
                    height: cardOffset.h,
                  }}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    );
  }
);
