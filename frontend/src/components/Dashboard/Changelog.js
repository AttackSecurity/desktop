import {Icon} from "@iconify/react";

export function Improved({ changeList }){
    return (
        <div className="border-l-4 border-green-500 pl-4">
            <div className="flex items-center space-x-2">
                <Icon icon="ph:minus-fill" className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                    Improved
                </h2>
            </div>
            <ul className="list-disc pl-6">
                {changeList.map((change, index) => (
                    <li key={index} className="text-lg text-white/70">
                        {change}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Fixed({ changeList }){
    return (
    <div className="border-l-4 border-red-500 pl-4 items-center rounded-b-large">
        <div className="flex items-center space-x-2">
            <Icon icon="ph:plus-fill" className="w-6 h-6 text-red-400"/>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                Fixed
            </h2>
        </div>
        <ul className="list-disc pl-6">
            {changeList.map((change, index) => (
                <li key={index} className="text-lg text-white/70">
                    {change}
                </li>
            ))}
        </ul>
    </div>
)
    ;
}

export function Added({changeList}) {
    return (
        <div className="border-l-4 border-blue-500 pl-4 items-center rounded-t-large">
            <div className="flex items-center space-x-2">
                <Icon icon="ph:plus-fill" className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Added
                </h2>
            </div>
            <ul className="list-disc pl-6">
                {changeList.map((change, index) => (
                    <li key={index} className="text-lg text-white/70">
                        {change}
                    </li>
                ))}
            </ul>
        </div>
    );
}