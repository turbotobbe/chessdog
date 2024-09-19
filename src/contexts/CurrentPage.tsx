import { noPageInfo, pageInfos, PageName } from '@/components/SiteMenu';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CurrentPageContextType {
    currentPageName: PageName;
}

export const CurrentPageContext = createContext<CurrentPageContextType | undefined>(undefined);

export const CurrentPageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPageName, setCurrentPage] = useState<PageName>(noPageInfo.name);

    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const pageInfo = pageInfos.find(page => {
            return path === page.path || (page.path !== '/' && path.startsWith(page.path));
        });
        if (pageInfo) {
            setCurrentPage(pageInfo.name);
        } else {
            setCurrentPage(noPageInfo.name);
        }
    }, [location]);

    return (
        <CurrentPageContext.Provider value={{ currentPageName }}>
            {children}
        </CurrentPageContext.Provider>
    );
};

export const useCurrentPage = (): CurrentPageContextType => {
    const context = useContext(CurrentPageContext);
    if (context === undefined) {
        throw new Error('useCurrentPage must be used within an CurrentPageProvider');
    }
    return context;
};
