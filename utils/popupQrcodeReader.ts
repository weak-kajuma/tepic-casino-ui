const readQRCode = async (regexStr: string): Promise<string> => {
    const w2 = window.open(`https://weak-kajuma.github.io/popup-qrcode-reader/index.html?origin=${encodeURIComponent(window.location.origin)}&regex=${encodeURIComponent(regexStr)}`, '_blank', 'popup=yes,width=680,height=640');
    let receivedMessage;
    window.addEventListener('message', e => {
        if (e.origin === 'https://weak-kajuma.github.io') receivedMessage = e.data;
    });
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!receivedMessage) {
        // eslint-disable-next-line no-loop-func
        await new Promise<void>(resolve => {
            setTimeout(() => {
                resolve();
            }, 1);
        });
    }
    w2?.close();
    window.removeEventListener('message', e => {
        if (e.origin === 'https://weak-kajuma.github.io') receivedMessage = e.data;
    });
    return receivedMessage;
};

export default readQRCode;