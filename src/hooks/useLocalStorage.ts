import { useState, useEffect } from 'react';

const useLocalStorage = (key: string, initialValue: string) => {
    const [value, setValue] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(key);
            if (saved !== null) return saved;
        }
        return initialValue;
    });

    useEffect(() => {
        if (value !== '') {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    }, [key, value]);

    const removeValue = () => {
        localStorage.removeItem(key);
        setValue(initialValue);
    };

    return [value, setValue, removeValue] as const;
};

export default useLocalStorage;




// import { useState, useEffect } from 'react';

// const useLocalStorage = (key: string, initialValue: string) => {
//     const [value, setValue] = useState<string>(() => {
//         if (typeof window !== 'undefined') {
//             const saved = localStorage.getItem(key);
//             if (saved !== null) return saved;
//         }
//         return initialValue;
//     });

//     useEffect(() => {
//         if (value !== '') {
//             localStorage.setItem(key, value);
//         }
//     }, [key, value]);

//     return [value, setValue] as const;
// };

// export default useLocalStorage;


