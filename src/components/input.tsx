import { ChangeEvent } from "react";

type InputProps = {
  title: string;
  value: string | number;
  handleChange: (e: ChangeEvent<HTMLInputElement>, type: string) => void;
  keyValue: string;
};

export default function Input({
  title,
  value,
  handleChange,
  keyValue,
}: InputProps) {
  return (
    <div className="input__container">
      <div className="input__title">{title}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          handleChange(e, keyValue);
        }}
        className="input__input"
      />
    </div>
  );
}
