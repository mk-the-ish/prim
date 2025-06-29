import React, { useState } from 'react';
import LevyUSD from './levy_usd';
import LevyZWG from './levy_zwg';
import TuitionUSD from '../tuition/tuition_usd';
import TuitionZWG from '../tuition/tuition_zwg';
import ContextSwitch from '../../ui/contextSwitch';
import TopBar from '../../ui/topbar';
import Button from '../../ui/button';

const Fees = () => {
    const [view, setView] = useState('levy'); // 'levy' or 'tuition'
    const [currency, setCurrency] = useState('usd'); // 'usd' or 'zwg'

    let TableComponent;
    if (view === 'levy') {
        TableComponent = currency === 'usd' ? <LevyUSD /> : <LevyZWG />;
    } else {
        TableComponent = currency === 'usd' ? <TuitionUSD /> : <TuitionZWG />;
    }

    return (
        <div>
            <TopBar title="Fees Payments" />
            <div className="flex justify-between items-center mb-4 px-6 pt-6">
                <div className="flex space-x-2">
                    <Button
                        variant={view === 'levy' ? 'primary' : 'secondary'}
                        onClick={() => setView('levy')}
                    >
                        Levy
                    </Button>
                    <Button
                        variant={view === 'tuition' ? 'primary' : 'secondary'}
                        onClick={() => setView('tuition')}
                    >
                        Tuition
                    </Button>
                </div>
                <ContextSwitch
                    options={[
                        { label: 'USD', value: 'usd' },
                        { label: 'ZWG', value: 'zwg' }
                    ]}
                    value={currency}
                    onChange={setCurrency}
                />
            </div>
            {TableComponent}
        </div>
    );
};

export { Fees };
