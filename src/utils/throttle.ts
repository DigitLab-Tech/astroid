const throttle = (() => {
    let canExecute = true;
    let timeout = 0;

    console.log("test");

    return (callback: () => void, delay = 50) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            canExecute = true;
        }, delay);

        if (canExecute) {
            callback();
            canExecute = false;
        }
    }
})();

export default throttle;