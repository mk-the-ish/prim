import React, { useEffect, useState } from 'react';
import supabase from '../../db/SupaBaseConfig';
import TopBar from '../ui/topbar';
import DataTable from '../ui/dataTable';
import FAB from '../ui/FAB';
import { useToast } from '../../contexts/ToastContext';

// Modal for adding a vendor
const VendorModal = ({ open, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        Name: '',
        Description: '',
        Category: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(form);
        onClose();
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Add Vendor</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label>
                        Name:
                        <input type="text" name="Name" value={form.Name} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="Description" value={form.Description} onChange={handleChange} className="border rounded px-2 py-1 ml-2" />
                    </label>
                    <label>
                        Category:
                        <input type="text" name="Category" value={form.Category} onChange={handleChange} className="border rounded px-2 py-1 ml-2" required />
                    </label>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const { addToast } = useToast();

    // Fetch vendors
    useEffect(() => {
        const fetchVendors = async () => {
            const { data, error } = await supabase
                .from('Vendors')
                .select('id, created_at, Name, Description, Category');
            if (!error && data) setVendors(data);
        };
        fetchVendors();
    }, [modalOpen]);

    // Add vendor
    const handleAddVendor = async (form) => {
        const { error } = await supabase
            .from('Vendors')
            .insert([form]);
        if (error) addToast('Failed to add vendor', 'error');
        else addToast('Vendor added!', 'success');
    };

    // Table columns
    const columns = [
        { header: 'Name', accessor: 'Name' },
        { header: 'Description', accessor: 'Description' },
        { header: 'Category', accessor: 'Category' },
        { header: 'Created At', accessor: 'created_at' }
    ];

    // FAB actions
    const fabActions = [
        <button key="add-vendor" className="w-48 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90" onClick={() => setModalOpen(true)}>
            <span role="img" aria-label="Add Vendor">➕</span> Add Vendor
        </button>
    ];

    return (
        <div className="p-6 bg-background min-h-screen relative">
            <TopBar title="Vendors" />
            <div className="p-4">
                <VendorModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleAddVendor}
                />
                <DataTable
                    columns={columns}
                    data={vendors}
                    currentPage={1}
                    totalPages={1}
                    itemsPerPage={vendors.length}
                    onPageChange={() => {}}
                />
                <FAB actions={fabActions} />
            </div>
        </div>
    );
};
export default Vendors;