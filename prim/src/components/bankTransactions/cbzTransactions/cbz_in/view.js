import React, { useState } from 'react';
import ViewInUSD from './viewUSD';
import ViewInZWG from './viewZWG';
import ViewOutUSD from '../cbz_out/viewUSD';
import ViewOutZWG from '../cbz_out/viewZWG';
import ContextSwitch from '../../../ui/contextSwitch';
import TopBar from '../../../ui/topbar';
import Button from '../../../ui/button';
import { useTheme } from '../../../../contexts/ThemeContext';

function CBZView() {
    const [direction, setDirection] = useState('incoming'); // 'incoming' or 'outgoing'
    const [currency, setCurrency] = useState('usd'); // 'usd' or 'zwg'
    const { currentTheme } = useTheme();

    let TableComponent;
    if (direction === 'incoming') {
        TableComponent = currency === 'usd' ? <ViewInUSD /> : <ViewInZWG />;
    } else {
        TableComponent = currency === 'usd' ? <ViewOutUSD /> : <ViewOutZWG />;
    }

    return (
        <div style={{ background: currentTheme.background?.default, minHeight: '100vh' }}>
            <div className="flex justify-between items-center mb-4 px-6 pt-6">
                <div className="flex space-x-2">
                    <Button
                        variant={direction === 'incoming' ? 'primary' : 'secondary'}
                        onClick={() => setDirection('incoming')}
                    >
                        Incoming
                    </Button>
                    <Button
                        variant={direction === 'outgoing' ? 'primary' : 'secondary'}
                        onClick={() => setDirection('outgoing')}
                    >
                        Outgoing
                    </Button>
                </div>
                <h2 className="text-2xl font-bold">CBZ Bank Transactions</h2>
                <ContextSwitch
                    options={[
                        { label: 'USD', value: 'usd' },
                        { label: 'ZWG', value: 'zwg' }
                    ]}
                    value={currency}
                    onChange={setCurrency}
                />
            </div>
            <div className="px-6 pb-6">{TableComponent}</div>
        </div>
    );
}

export default CBZView;