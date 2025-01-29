import React from 'react';
import propTypes from "prop-types";

const shapes = {
    square: "rounded-[0px]",
};

const variants = {
    outline: {
        blk: "border-blk border border-solid text-black-900_7f",
    },
};

const sizes = {
    xs: "h-[36px] px-4 text-[14px]",
};

const Input = React.forwardRef(
    (
        {
            className = "",
            name = "",
            placeholder = "",
            type = "text",
            label = "",
            prefix,
            suffix,
            onChange,
            shape,
            variant = "outline",
            size = "xs",
            color = "blk gray_600",
            ...restProps
        },
        ref,
    ) => {
        return (
            <div className={`flex flex-col ${className}`}>
                {!!label && <label className="text-black-900_7f text-[14px]">{label}</label>}
                <div className={`flex items-center border ${variant && (variants[variant]?.[color] || variants[variant])} ${shape && shapes[shape]} ${size && sizes[size]}`}>
                    {!!prefix && <span className="mr-2">{prefix}</span>}
                    <input
                        ref={ref}
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        onChange={onChange}
                        className="flex-1 outline-none"
                        {...restProps}
                    />
                    {!!suffix && <span className="ml-2">{suffix}</span>}
                </div>
            </div>
        );
    },
);

Input.propTypes = {
    className: propTypes.string,
    name: propTypes.string,
    placeholder: propTypes.string,
    type: propTypes.string,
    label: propTypes.string,
    prefix: propTypes.node,
    suffix: propTypes.node,
    shape: propTypes.oneOf(["square"]),
    size: propTypes.oneOf(["xs"]),
    variant: propTypes.oneOf(["outline"]),
    color: propTypes.oneOf(["blk"]),
};

export { Input };