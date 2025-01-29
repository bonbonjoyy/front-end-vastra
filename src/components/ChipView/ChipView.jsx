import React from "react";
import propTypes from "prop-types";

const noOp = () => {};
const defaultList = [];

function ChipView(props) {
  const {
    options = defaultList,
    setOptions = noOp,
    values = defaultList,
    setValues = noOp,
    children,
    ...restProps
  } = props;

  const deleteOption = (value) => (event) => {
    event?.preventDefault();
    setValues((values) => {
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      return options
        .filter((option) => newValues.includes(option.value))
        .map((option) => option.value);
    });
  };

  const toggle = (value) => (event) => {
    event?.preventDefault();
    setValues((values) => {
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      return options
        .filter((option) => newValues.includes(option.value))
        .map((option) => option.value);
    });
  };

  React.useEffect(() => {
    setValues((values) => {
      if (
        values.every((value) =>
          options.find((option) => option.value === value)
        )
      ) {
        return values;
      }
      return options
        .filter((option) => values.includes(option.value))
        .map((option) => option.value);
    });
  }, [options]);

  return (
    <div {...restProps}>
      {children instanceof Function
        ? options.map((option, index) =>
            children({
              index,
              value: option.value,
              label: option.label,
              isSelected: values.includes(option.value),
              toggle: toggle(option.value),
              delete: deleteOption(option.value),
            })
          )
        : children}
    </div>
  );
}

ChipView.propTypes = {
  className: propTypes.string,
  options: propTypes.arrayOf(
    propTypes.shape({ label: propTypes.string, value: propTypes.string })
  ),
  setOptions: propTypes.func,
  values: propTypes.arrayOf(propTypes.string),
  setValues: propTypes.func,
  children: propTypes.oneOfType([propTypes.func, propTypes.node]),
};

export { ChipView };
