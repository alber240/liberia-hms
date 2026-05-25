import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db, Drug } from '../db/database';

const DrugInventory: React.FC = () => {
    const { t } = useTranslation();
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        genericName: '',
        category: '',
        manufacturer: '',
        batchNumber: '',
        quantityInStock: 0,
        unit: 'tablet',
        unitPrice: 0,
        sellingPrice: 0,
        expiryDate: '',
        reorderLevel: 0,
        location: '',
        requiresPrescription: false
    });

    useEffect(() => {
        loadDrugs();
    }, []);

    const loadDrugs = async () => {
        const allDrugs = await db.getAllDrugs();
        setDrugs(allDrugs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingDrug) {
            await db.drugs.update(editingDrug.id!, {
                ...formData,
                updatedAt: new Date().toISOString(),
                synced: 0
            });
        } else {
            await db.addDrug(formData);
        }
        
        setShowAddForm(false);
        setEditingDrug(null);
        setFormData({
            name: '', genericName: '', category: '', manufacturer: '', batchNumber: '',
            quantityInStock: 0, unit: 'tablet', unitPrice: 0, sellingPrice: 0,
            expiryDate: '', reorderLevel: 0, location: '', requiresPrescription: false
        });
        await loadDrugs();
    };

    const handleEdit = (drug: Drug) => {
        setEditingDrug(drug);
        setFormData({
            name: drug.name,
            genericName: drug.genericName,
            category: drug.category,
            manufacturer: drug.manufacturer,
            batchNumber: drug.batchNumber,
            quantityInStock: drug.quantityInStock,
            unit: drug.unit,
            unitPrice: drug.unitPrice,
            sellingPrice: drug.sellingPrice,
            expiryDate: drug.expiryDate,
            reorderLevel: drug.reorderLevel,
            location: drug.location,
            requiresPrescription: drug.requiresPrescription
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this drug?')) {
            await db.drugs.delete(id);
            await loadDrugs();
        }
    };

    const filteredDrugs = drugs.filter(drug => 
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.genericName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['Analgesics', 'Antibiotics', 'Antimalarials', 'Antihypertensives', 'Antidiabetics', 'Vitamins', 'Vaccines', 'Other'];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <input
                    type="text"
                    placeholder="Search drugs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '250px' }}
                />
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    + Add Drug
                </button>
            </div>
            
            {showAddForm && (
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h3>{editingDrug ? 'Edit Drug' : 'Add New Drug'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        <div><label>Drug Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Generic Name</label><input type="text" value={formData.genericName} onChange={(e) => setFormData({...formData, genericName: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}><option value="">Select</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div><label>Manufacturer</label><input type="text" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Batch Number *</label><input type="text" required value={formData.batchNumber} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Quantity *</label><input type="number" required value={formData.quantityInStock} onChange={(e) => setFormData({...formData, quantityInStock: parseInt(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Unit</label><select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}><option value="tablet">Tablet</option><option value="capsule">Capsule</option><option value="ml">ml</option><option value="bottle">Bottle</option><option value="injection">Injection</option></select></div>
                        <div><label>Unit Price ($)</label><input type="number" step="0.01" value={formData.unitPrice} onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Selling Price ($)</label><input type="number" step="0.01" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Expiry Date *</label><input type="date" required value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Reorder Level</label><input type="number" value={formData.reorderLevel} onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Storage Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label><input type="checkbox" checked={formData.requiresPrescription} onChange={(e) => setFormData({...formData, requiresPrescription: e.target.checked})} /> Requires Prescription</label></div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => { setShowAddForm(false); setEditingDrug(null); }} style={{ background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            )}
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: '#f1f5f9' }}>
                        <tr><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th>Category</th><th>Batch</th><th>Stock</th><th>Unit</th><th>Selling Price</th><th>Expiry</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredDrugs.map(drug => {
                            const isExpiring = new Date(drug.expiryDate) < new Date(Date.now() + 30*24*60*60*1000);
                            const isLowStock = drug.quantityInStock <= drug.reorderLevel;
                            return (
                                <tr key={drug.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px' }}><strong>{drug.name}</strong><br /><span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{drug.genericName}</span></td>
                                    <td style={{ padding: '12px' }}>{drug.category}</td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>{drug.batchNumber}</td>
                                    <td style={{ padding: '12px', color: isLowStock ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{drug.quantityInStock}</td>
                                    <td style={{ padding: '12px' }}>{drug.unit}</td>
                                    <td style={{ padding: '12px' }}>${drug.sellingPrice}</td>
                                    <td style={{ padding: '12px', color: isExpiring ? '#f59e0b' : 'inherit' }}>{drug.expiryDate}</td>
                                    <td style={{ padding: '12px' }}><button onClick={() => handleEdit(drug)} style={{ marginRight: '8px', background: '#6b7280', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button><button onClick={() => handleDelete(drug.id!)} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DrugInventory;
