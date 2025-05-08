const debounce = (() => {
    let timeout: number | null = null;

    return (callback: () => void, delay = 50) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(callback, delay);
    }
})();

export default debounce;