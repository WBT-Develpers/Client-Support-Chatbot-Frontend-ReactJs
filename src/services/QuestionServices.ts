export const getQuestions = async (selectedCategoryId: any, userData: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let backendUrl = `${baseURL}/faq`;

            const queryParams = new URLSearchParams();

            if (selectedCategoryId !== 'all') {
                backendUrl += `/${selectedCategoryId}`;
            }

            if (userData?.role !== 'admin') {
                queryParams.append("role_id", userData?._id || '');
            }

            if (queryParams.toString()) {
                backendUrl += `?${queryParams.toString()}`;
            }

            const fetchParameter = {
                method: 'GET'
            };
            const serverResponse = await fetch(backendUrl, fetchParameter);
            const response = await serverResponse.json();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const createFaq = async (actionType: string, data: string, id?: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = actionType === 'add' ? `${baseURL}/faq` : `${baseURL}/faq/${id}`;

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

export const deleteAnFaq = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/faq/${id}`;

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
