const sizes = {
    heading: "text-[48] font-bold md:text-[44px] sm:text-[38px]",
    sub_heading: "text-[18px] font-bold",
};

const Heading = ({ children, className = "", size = "", as, ...restProps }) => {
    const Component = as || "h6";

    return (
        <Component className={` ${className} ${sizes[size]}`} {...restProps}>
            {children}
        </Component>
    );
};

export { Heading };