import PropTypes from 'prop-types';

export const ImagePlaceholder = ({width, height, fill_color, className}) => {
    ImagePlaceholder.propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        fill_color: PropTypes.any,
        className: PropTypes.string,
    };
    return (
        <div className={className}>
            <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <rect width="100%" height="100%" fill={fill_color}/>
                <text x="50%" y="50%" className="small" textAnchor="middle"
                      alignmentBaseline="central">{`${width} × ${height}`}</text>
            </svg>
        </div>
    );
};
