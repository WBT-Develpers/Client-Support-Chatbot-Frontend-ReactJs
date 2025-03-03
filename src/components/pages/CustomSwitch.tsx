const CustomSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => {
    return (
        <div
            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-all duration-300 ${checked ? 'bg-green-500' : 'bg-gray-400'
                }`}
            onClick={onChange}
        >
            <span
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'
                    }`}
            />
        </div>
    );
};

export default CustomSwitch;