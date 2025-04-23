
export default function BlurEffect({children, blurValue, scaleValue}) {
    return (
        <div className="relative flex">
            {/* Blurred Layer */}
            <div className={`inset-0 filter blur-${blurValue} scale-${scaleValue} flex-grow`}>
                {children}
            </div>
            {/* Second Layer */}
            <div className="absolute inset-0 flex-grow">
                {children}
            </div>
        </div>
    );
};