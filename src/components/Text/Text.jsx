const sizes = {
    nav_bar: "text-[18px] font-normal",
};

const Text = ({ children, className = "", as, size ="nav_bar", ...restProps }) => {
    const Component = as || "p";

    return (
        <Component className={`text-blk font-helvetica1 ${className} $sizes[size]}`} {...restProps}>
            {children}
        </Component>
    );
};

export { Text };