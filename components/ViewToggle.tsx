import React from 'react';
import { ViewMode } from '../App';

interface ViewToggleProps {
    mode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    isDisabled: boolean;
}

const GridIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM11 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
    </svg>
);

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onModeChange, isDisabled }) => {
    const commonClasses = "p-2 rounded-md transition-colors";
    const activeClasses = "bg-primary-600 text-white";
    const inactiveClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";

    return (
        <div className={`flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <button
                onClick={() => onModeChange('grid')}
                disabled={isDisabled}
                className={`${commonClasses} ${mode === 'grid' ? activeClasses : inactiveClasses}`}
                aria-label="Grid view"
            >
                <GridIcon />
            </button>
            <button
                onClick={() => onModeChange('list')}
                disabled={isDisabled}
                className={`${commonClasses} ${mode === 'list' ? activeClasses : inactiveClasses}`}
                aria-label="List view"
            >
                <ListIcon />
            </button>
        </div>
    );
};

export default ViewToggle;