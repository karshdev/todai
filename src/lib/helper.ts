import axios from "axios";

const toTimeString = (sec: any, showMilliSeconds = true) => {
    sec = parseFloat(sec);
    let hours: any = Math.floor(sec / 3600); // get hours
    let minutes: any = Math.floor((sec - hours * 3600) / 60); // get minutes
    let seconds: any = sec - hours * 3600 - minutes * 60; //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    let maltissaRegex = /\..*$/; // matches the decimal point and the digits after it e.g if the number is 4.567 it matches .567

    let millisec = String(seconds).match(maltissaRegex);
    return (
        hours +
        ":" +
        minutes +
        ":" +
        String(seconds).replace(maltissaRegex, "") +
        (showMilliSeconds ? (millisec ? millisec[0] : ".000") : "")
    );
};

const readFileAsBase64 = async (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const download = (url: any) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    link.click();
};

const isValidURL = (text: string) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return urlPattern.test(text);
};

const getFileBlob = async (fileInput: File | string): Promise<File> => {
    if (fileInput instanceof File) {
        // If the input is a File object (local file)
        return fileInput;
    } else if (typeof fileInput === 'string') {
        // Check if the input is a Base64 string
        if (fileInput.startsWith('data:')) {
            try {
                const arr = fileInput.split(',');
                const mime = arr[0].match(/:(.*?);/)?.[1] || '';
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], 'base64-file', { type: mime });
               
            } catch (error) {
                console.error('Error processing Base64 string:', error);
                throw error;
            }
        } else {
            // If the input is a URL (string)
            try {
                const response = await axios.get<Blob>(fileInput, { responseType: 'blob' });
                const blob = response.data;
                const fileName = fileInput.split('/').pop() || 'downloaded-file'; // Extract the file name from URL or default name
                return new File([blob], fileName, { type: blob.type });
            } catch (error) {
                console.error('Error downloading file:', error);
                throw error;
            }
        }
    } else {
        throw new Error('Invalid input: must be a File object, a URL string, or a Base64 string.');
    }
};

export { toTimeString, readFileAsBase64, download, isValidURL, getFileBlob };