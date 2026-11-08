import {useEffect, useState} from 'react';

const query = '(max-width: 767px)';

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = (e) => setIsMobile(e.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return isMobile;
};
