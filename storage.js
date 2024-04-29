const STORAGE_TOKEN = 'K859VMPOLXX0Q73H3YUL23WCJMSV67LGBJAG91IB';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
* this function is to get the user from the server with the key
* @param STORAGE_URL - the url of the backendserver
* @param STORAGE_TOKEN - the token who communicate with the backendserver
* @param key - to get the data from the backendserver is only the key necessary
**/
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not found data with "${key}".`;
    });
}