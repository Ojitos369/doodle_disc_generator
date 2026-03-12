import { Route, Routes } from 'react-router-dom';
import { P404 } from '../P404';

import { Test as TestPage } from './Test';

export const Test = () => {

    return (
        <Routes>
            <Route path="test" element={ <TestPage /> } />
            <Route path="*" element={ <P404 /> } />
        </Routes>
    )
}