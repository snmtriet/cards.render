/* eslint-disable react/display-name */
import React, { memo } from "react";

export const Notification = memo(() => {
  return (
    <div className="notification__container">
      <div className="notification__wrapper">
        <div className="notification__inner">
          <div className="notification__content">
            <div className="notification__main">
              {new Array(20).fill(undefined).map((item, index) => (
                <div className="notification__text" key={index}>
                  <span>Cards render by mtriet vjp pro</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
