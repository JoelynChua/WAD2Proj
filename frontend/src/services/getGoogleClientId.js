const localURL = 'http://localhost:8000';
const finalURL = localURL;

async function getGoogleClientId() {
    const response = await fetch(`${finalURL}/api/google-client-id`);
    const data = await response.json();
    return data;
}

export { getGoogleClientId };
