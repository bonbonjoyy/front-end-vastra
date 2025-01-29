const Img = ({ className, src = "hero.png", alt = "Hero", ...restProps }) => {
    return <img className={className} src={src} alt={alt} {...restProps} loading={"lazy"} />;
};

export { Img };