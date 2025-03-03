export const adminLogin = async (data: any, endPoint: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/auth/${endPoint}`;

            const fetchParameter = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const serverResponse = await fetch(apiUrl, fetchParameter);
            const response = await serverResponse.json();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};