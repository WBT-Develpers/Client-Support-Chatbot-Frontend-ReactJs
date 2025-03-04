import ClockLoader from "react-spinners/ClockLoader";

const PageLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[100%] max-w-lg">
                <div className="flex flex-col items-center justify-center">
                    <ClockLoader color="#36d7b7" />
                    <h2 className="text-lg font-normal mt-2">Fetching Data</h2>
                </div>
            </div>
        </div>
    )
}

export default PageLoader