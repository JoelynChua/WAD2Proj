// const localURL = 'http://localhost:8000';
const cloudURL = "https://wad-2-proj.vercel.app"
const finalURL = cloudURL;

async function getGoogleClientId() {
    const response = await fetch(`${finalURL}/api/google-client-id`);
    const data = await response.json();
    return data;
}

export { getGoogleClientId };
