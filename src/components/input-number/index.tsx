import {
  FocusEvent,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import Input from "@mui/material/Input";
import { isNil, isNumber, isUndefined } from "lodash";
import "./main.css";

interface InputNumberProps {
  value: number | string | null | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  precision?: number | undefined;
  onChange: (value: number | string | null | undefined) => void;
}

export default function InputNumber(props: InputNumberProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentDataValue, setCurrentDataValue] = useState<
    number | string | null | undefined
  >(props.value);
  const [userInput, setUserInput] = useState<null | number | string>(null);

  const config = {
    step: 1,
    precision: 0,
    placeholder: "请输入",
    readOnly: false,
    disabled: false,
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY,
    stepStrictly: false,
    valueOnClear: null,
    ...props,
  };

  const getPrecision = (value: number | string | null | undefined) => {
    if (isNil(value)) return 0;
    const valueString = value.toString();
    const dotPosition = valueString.indexOf(".");
    let precision = 0;
    if (dotPosition !== -1) {
      precision = valueString.length - dotPosition - 1;
    }
    return precision;
  };

  const numPrecision = useMemo(() => {
    const stepPrecision = getPrecision(config.step);
    if (!isUndefined(config.precision)) {
      if (stepPrecision > config.precision) {
        new Error(
          "InputNumber precision should not be less than the decimal places of step"
        );
      }
      return config.precision;
    } else {
      return Math.max(getPrecision(props.value), stepPrecision);
    }
  }, [props.value, config.step, config.precision]);

  const toPrecision = useCallback(
    (num: number, pre?: number) => {
      if (isUndefined(pre)) pre = numPrecision;
      if (pre === 0) return Math.round(num);
      let snum = String(num);
      const pointPos = snum.indexOf(".");
      if (pointPos === -1) return num;
      const nums = snum.replace(".", "").split("");
      const datum = nums[pointPos + pre];
      if (!datum) return num;
      const length = snum.length;
      if (snum.charAt(length - 1) === "5") {
        snum = `${snum.slice(0, Math.max(0, length - 1))}6`;
      }
      return Number.parseFloat(Number(snum).toFixed(pre));
    },
    [numPrecision]
  );

  const ensurePrecision = useCallback(
    (val: number | string, coefficient: 1 | -1 = 1) => {
      if (!isNumber(val)) return currentDataValue;
      // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
      return toPrecision(val + config.step * coefficient);
    },
    [currentDataValue, config.step, toPrecision]
  );

  const minDisabled = useMemo(
    () =>
      isNumber(props.value) &&
      Number(ensurePrecision(props.value, -1)!) < config.min,
    [props.value, config.min, ensurePrecision]
  );

  const maxDisabled = useMemo(
    () =>
      isNumber(props.value) &&
      Number(ensurePrecision(props.value)!) > config.max,
    [props.value, config.max, ensurePrecision]
  );

  const displayValue = useMemo(() => {
    if (userInput !== null) {
      return userInput;
    }
    let currentValue: number | string | undefined | null = currentDataValue;
    if (isNil(currentValue)) return "";
    if (isNumber(currentValue)) {
      if (Number.isNaN(currentValue)) return "";
      if (!isUndefined(config.precision)) {
        currentValue = currentValue.toFixed(config.precision);
      }
    }

    return currentValue;
  }, [userInput, currentDataValue, config.precision]);

  const increase = () => {
    if (config.readOnly || config.disabled || maxDisabled) return;
    const value = props.value || 0;
    const newVal = ensurePrecision(value);
    setCurrentValue(newVal);
  };

  const decrease = () => {
    if (config.readOnly || config.disabled || minDisabled) return;
    const value = props.value || 0;
    const newVal = ensurePrecision(value, -1);
    setCurrentValue(newVal);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // upCode(38) downCode(40)
    if (event.code === "38") {
      event.preventDefault();
      increase();
    } else if (event.code === "40") {
      event.preventDefault();
      decrease();
    }
  };

  const verifyValue = (
    value: number | string | null | undefined,
    update?: boolean
  ): number | string | null | undefined => {
    const { max, min, step, precision, stepStrictly, valueOnClear } = config;
    let newVal = Number(value);
    if (isNil(value) || Number.isNaN(newVal)) {
      return null;
    }

    if (value === "") {
      if (valueOnClear === null) {
        return null;
      }
      newVal = valueOnClear;
    }
    if (stepStrictly) {
      newVal = toPrecision(Math.round(newVal / step) * step, precision);
    }
    if (!isUndefined(precision)) {
      newVal = toPrecision(newVal, precision);
    }
    if (newVal > max || newVal < min) {
      newVal = newVal > max ? max : min;
    }

    return newVal;
  };

  const setCurrentValue = (value: number | string | null | undefined) => {
    const oldVal = currentDataValue;
    const newVal = verifyValue(value);
    if (oldVal === newVal) return;

    props.onChange(newVal);
    setCurrentDataValue(newVal);
  };

  // mui的input组件会在onInput时触发onChange
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.currentTarget.value);
  };

  // 失去焦点后再格式化数据
  const handleInputChange = (event: FocusEvent<HTMLInputElement>) => {
    let value = event.currentTarget.value;

    const newVal = value !== "" ? Number(value) : "";
    if ((isNumber(newVal) && !Number.isNaN(newVal)) || value === "") {
      setCurrentValue(newVal);
    }
    setUserInput(null);
  };

  return (
    <Input
      className="input-number"
      ref={inputRef}
      type="number"
      value={displayValue}
      placeholder={config.placeholder}
      readOnly={config.readOnly}
      disabled={config.disabled}
      inputProps={{ min: config.min, max: config.max }}
      onChange={handleInput}
      onBlur={handleInputChange}
    />
  );
}
