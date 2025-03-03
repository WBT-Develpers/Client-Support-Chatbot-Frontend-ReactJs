export const getTrainedData = async (categoryFilter: any, statusFilter: any, page: any, debouncedSearchTerm: any, userData: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let backendUrl = `${baseURL}/train/documents`;

            const queryParams = new URLSearchParams();

            if (categoryFilter !== 'all') {
                backendUrl += `/${categoryFilter}`;
            }
            if (userData?.role !== 'admin') {
                queryParams.append("role_id", userData?._id || '');
            }
            queryParams.append("page", page.toString());
            if (debouncedSearchTerm) queryParams.append("search", debouncedSearchTerm);
            if (statusFilter) queryParams.append("is_active", statusFilter);
            if (statusFilter === 'all_status') {
                queryParams.delete('is_active');
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

export const trainFiles = async (formData: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/train/upload`;

            const fetchParameter = {
                method: "POST",
                body: formData
            };
            const serverResponse = await fetch(apiUrl, fetchParameter);
            const response = await serverResponse.json();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const trainLinks = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/train/train-link`;

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

export const toggleAnStatus = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/train/documents/toggle/${id}`;

            const fetchParameter = {
                method: 'PUT'
            };
            const serverResponse = await fetch(apiUrl, fetchParameter);
            const response = await serverResponse.json();
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
};

export const categorizeAlltheDocuments = async (id: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/category/${id}/modules-ai`;

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


export const getTrainedDataByCategoryId = async (categoryId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let backendUrl = `${baseURL}/train/documents/${categoryId}`;

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