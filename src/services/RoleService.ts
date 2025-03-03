export const getRoles = async (debouncedSearchTerm?: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/roles`;

            const queryParams = new URLSearchParams();
            if (debouncedSearchTerm) queryParams.append("search", debouncedSearchTerm);

            if (queryParams.toString()) {
                apiUrl += `?${queryParams.toString()}`;
            }

            const fetchParameter = {
                method: 'GET'
            };
            const serverResponse = await fetch(apiUrl, fetchParameter);
            const response = await serverResponse.json();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const createRole = async (actionType: string, data: string, initialValue?: { name: string; login_name: string; password: string; _id: string }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = actionType === 'add' ? `${baseURL}/role` : `${baseURL}/role/${initialValue?._id}`;

            const fetchParameter = {
                method: actionType === "add" ? "POST" : "PUT",
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

export const deleteAnRole = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/role/${id}`;

            const fetchParameter = {
                method: 'DELETE'
            };
            const serverResponse = await fetch(apiUrl, fetchParameter);
            const response = await serverResponse.json();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};
