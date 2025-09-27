/** @jsxRuntime automatic */ /** @jsxImportSource npm:react@^19.1.0 */ /** @jsxImportSourceTypes npm:@types/react@^19.1.5 */ /** @jsxFactory React.createElement */ /** @jsxFragmentFactory React.Fragment */ "use client";

import { Slot } from "npm:@radix-ui/react-slot@^1.2.3";
import { type ReactNode, useCallback } from "npm:react@^19.1.0";

type ControllerValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | Record<string, string | number | null | undefined>
  | Array<string | number>;

interface SearchParamControllerProps {
  paramName: string | string[];
  children: ReactNode;
  currentValue?: ControllerValue;
  valueType?: "text" | "select" | "checkbox" | "radix";
  multiple?: boolean;
}

const toParamArray = (param: string | string[]): string[] => {
  return Array.isArray(param) ? param : [param];
};

const toValueObject = (
  params: string[],
  value: ControllerValue
): Record<string, string | number | boolean> => {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "undefined" ||
    typeof value === "object"
  ) {
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      return value as Record<string, string | number | boolean>;
    }
    if (
      params.length > 0 &&
      (typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean")
    ) {
      return { [params[0]]: value };
    }
    return {};
  }
  return params.length > 0 ? { [params[0]]: value } : {};
};

export const SearchParamController: React.FC<SearchParamControllerProps> = ({
  paramName,
  children,
  currentValue,
  valueType = "text",
  multiple = false,
}) => {
  const updateSearchParam = useCallback(
    (value: ControllerValue) => {
      const url = new URL(globalThis.location.href);
      const params = toParamArray(paramName);

      if (multiple && Array.isArray(value)) {
        if (params.length !== 1) {
          console.error(
            "SearchParamController: `paramName` must be a single string when `multiple` is true."
          );
          return;
        }
        const singleParamName = params[0];
        url.searchParams.delete(singleParamName);
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== "") {
            url.searchParams.append(singleParamName, String(item));
          }
        });
      } else {
        for (const param of params) {
          url.searchParams.delete(param);
        }
        const obj = toValueObject(params, value);
        for (const [key, val] of Object.entries(obj)) {
          if (valueType === "checkbox") {
            if (typeof value === "boolean" && value) {
              url.searchParams.set(key, "true");
            } else if (typeof value !== "boolean" && val) {
              url.searchParams.set(key, String(val));
            }
          } else if (val !== undefined && val !== null && val !== "") {
            url.searchParams.set(key, String(val));
          }
        }
      }

      globalThis.location.href = (url.href.replace(url.origin, ""));
    },
    [paramName, valueType, multiple]
  );

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        | ControllerValue
    ) => {
      if (valueType === "radix") {
        updateSearchParam(e as ControllerValue);
      } else if (e && typeof e === "object" && "target" in e) {
        const target = e.target;

        if (valueType === "checkbox" && target instanceof HTMLInputElement) {
          updateSearchParam(target.checked);
        } else if (multiple && target instanceof HTMLSelectElement) {
          const selectedValues = Array.from(target.selectedOptions).map(
            (option) => option.value
          );
          updateSearchParam(selectedValues);
        } else if (
          target instanceof HTMLSelectElement ||
          target instanceof HTMLInputElement
        ) {
          updateSearchParam(target.value);
        }
      } else {
        console.warn("SearchParamController: Unhandled change event type", e);
      }
    },
    [updateSearchParam, valueType, multiple]
  );

  const controlProps: Record<string, any> = {};
  const eventHandlerProp = valueType === "radix" ? "onValueChange" : "onChange";
  controlProps[eventHandlerProp] = handleChange;

  if (valueType === "checkbox") {
    controlProps["checked"] = currentValue ?? false;
  } else if (valueType === "radix") {
    controlProps["value"] = currentValue as string | undefined;
  } else if (valueType === "select") {
    if (!multiple) {
      controlProps["value"] = currentValue ?? "";
    }
  } else if (valueType === "text") {
    controlProps["defaultValue"] = currentValue ?? "";
  }

  return <Slot {...controlProps}>{children as any}</Slot>;
};
