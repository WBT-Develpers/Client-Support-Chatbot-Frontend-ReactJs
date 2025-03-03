export const getCategories = async (page = 1, limit = 100, searchTerm = '', roleId?: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/categories?page=${page}&limit=${limit}`;

            if (roleId) {
                apiUrl += `&role_id=${roleId}`
            }
            if (searchTerm) {
                apiUrl += `&search=${encodeURIComponent(searchTerm)}`;
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


export const getCategoriesByRoles = async (roleId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/categories/role/${roleId !== 'all' ? roleId : ''}`;

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

export const createCategory = async (actionType: string, data: string, id?: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = actionType === 'add' ? `${baseURL}/categories` : `${baseURL}/categories/${id}`;

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

export const deleteAnCategory = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/categories/${id}`;

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
