import propTypes, { shape } from "prop-types";

const shapes = {
    square: "rounded-[0px]",
};
const variants = {
    fill: {
        blk: "bg-blk text-white-a700",
        white_A700: "bg-white-a700 text-blk",
    },
};
const sizes = {
    md: "h-[36px] px-[34px] text-[12px]",
    sm: "h-[32px] px-1.5 text-[18px]",
    xs: "h-[28px] px-6 text-[12px]",
};

const COLORS = {
    white_A700: "var(--white_a700)",
    blk: "var(--blk)"
};

const Button =({
    children,
    className = "",
    leftIcon,
    rightIcon,
    shape,
    variant = "fill",
    size = "xs",
    color = "",
    ...restProps
}) => {
    return (
        <button
            style={{ backgroundColor: COLORS[color] }}
            className={`${className} flex flex-row items-center justify-center sm:px-5 text-center cursor-pointer 
            whitespace-nowrap text-blk text-[12px] border-blk border border-solid bg-white-a700 min-w-[124px] ${shape && shapes[shape]}
            ${size && sizes[size]} $variant && variants[variant]?.[color]}`}
            {...restProps}
            >
                {!! leftIcon && leftIcon}
                {children}
                {!! rightIcon && rightIcon}
            </button>
    );
};

Button.propTypes = {
    className: propTypes.string,
    children: propTypes.node,
    leftIcon: propTypes.node,
    rightIcon: propTypes.node,
    shape: propTypes.oneOf(["square"]),
    size: propTypes.oneOf(["md", "sm", "xs"]),
    variant: propTypes.oneOf(["fill"]),
    color: propTypes.oneOf(["blk", "white_a700"]),
};

export { Button };