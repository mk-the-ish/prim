import React, { useState, useEffect } from 'react';
import { fetchFees, fetchBankTransactions } from '../../api/viewPaymentsApi';
import Loader from '../../ui/loader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import supabase from '../../../db/SupaBaseConfig';
import {generateFeeReportWithAI, generateCashflowReportWithAI } from '../../../db/firebaseConfig';

const DailyReport = () => {
    
};

export default DailyReport;


