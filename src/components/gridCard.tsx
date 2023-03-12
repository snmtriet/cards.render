import useWindowDimensions from "@/hooks/useWindowDimensions";
import React, { useEffect, useState } from "react";
import { CardsRender } from "./cardsRender";

type GridCardProps = {
  data: any;
  column: number;
  rowGap: number;
  columnGap: number;
};

export const GridCard = ({
  data,
  column,
  rowGap,
  columnGap,
}: GridCardProps) => {
  const [cardOffset, setCardOffset] = useState({
    w: 0,
    h: 0,
  });
  const [dataRender, setDataRender] = useState([]);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const grid = document.getElementById("dynamic-grid");
    if (grid) {
      const { clientWidth } = grid;
      const cardWidth = (clientWidth - rowGap * (column - 1)) / column;
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
        return {
          ...item,
          row: rowIndex,
          top: (rowIndex - 2) * (cardHeight + columnGap),
          left: left,
        };
      });
      setDataRender(newArray);
    }
  }, [column, data, rowGap, columnGap, width]);

  return (
    <div
      className="dynamic-grid"
      id="dynamic-grid"
      style={{
        height:
          Math.ceil(dataRender.length / column) * (cardOffset.h + columnGap),
        maxHeight:
          Math.ceil(dataRender.length / column) * (cardOffset.h + columnGap),
        position: "relative",
      }}
    >
      {dataRender.map((item: any, index: number) => {
        return (
          <CardsRender
            cardOffset={cardOffset}
            key={index}
            item={item}
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              width: cardOffset.w,
              height: cardOffset.h,
              paddingBottom: 8,
              paddingTop: 8,
            }}
          />
        );
      })}
    </div>
  );
};
