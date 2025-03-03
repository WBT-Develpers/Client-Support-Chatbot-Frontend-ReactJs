export const getAnswer = async (title: string, categoryId: string, document_id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const baseURL = import.meta.env.VITE_API_BASE_URL;
            let apiUrl = `${baseURL}/generate-document?title=${title}&category_id=${categoryId}&document_id=${document_id}`;
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