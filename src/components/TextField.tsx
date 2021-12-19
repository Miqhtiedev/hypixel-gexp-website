import { FunctionComponent, useEffect } from "react";

interface TextFieldProps {
  placeholder: string;
  localStorageKey?: string;
  value: string;
  valueUpdate: (value: string) => void;
  class?: string;
}

const TextField: FunctionComponent<TextFieldProps> = (props) => {
  if (props.localStorageKey) {
    useEffect(() => {
      props.valueUpdate(localStorage.getItem(props.localStorageKey!) ?? "");
    }, []);

    useEffect(() => {
      localStorage.setItem(props.localStorageKey!, props.value);
    }, [props.value]);
  }

  return (
    <div className={`relative ${props.class ?? ""}`}>
      <input placeholder=" " value={props.value} type="text" onChange={(e) => props.valueUpdate(e.target.value)} className="textInput" />
      <label className="textLabel">{props.placeholder}</label>
    </div>
  );
};

export default TextField;
