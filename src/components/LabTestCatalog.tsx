import React, { useState, useEffect } from 'react';
import { db, LabTest } from '../db/database';

const LabTestCatalog: React.FC = () => {
    const [tests, setTests] = useState<LabTest[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTest, setEditingTest] = useState<LabTest | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: 0,
        preparationInstructions: '',
        normalRange: '',
        unit: '',
        turnaroundHours: 24,
        requiresFasting: false,
        active: true
    });

    useEffect(() => { loadTests(); }, []);

    const loadTests = async () => {
        const allTests = await db.labTests.toArray();
        setTests(allTests);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTest) {
            await db.labTests.update(editingTest.id!, { ...formData, synced: 0 });
        } else {
            await db.labTests.add({ ...formData, synced: 0 });
        }
        setShowAddForm(false);
        setEditingTest(null);
        setFormData({ name: '', category: '', price: 0, preparationInstructions: '', normalRange: '', unit: '', turnaroundHours: 24, requiresFasting: false, active: true });
        await loadTests();
    };

    const handleEdit = (test: LabTest) => {
        setEditingTest(test);
        setFormData({
            name: test.name,
            category: test.category,
            price: test.price,
            preparationInstructions: test.preparationInstructions,
            normalRange: test.normalRange,
            unit: test.unit,
            turnaroundHours: test.turnaroundHours,
            requiresFasting: test.requiresFasting,
            active: test.active
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this test?')) {
            await db.labTests.delete(id);
            await loadTests();
        }
    };

    const categories = ['Hematology', 'Biochemistry', 'Microbiology', 'Parasitology', 'Urinalysis', 'Immunology', 'Other'];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>🔬 Lab Test Catalog</h3>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#0f2b3d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    + Add Test
                </button>
            </div>
            
            {showAddForm && (
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h3>{editingTest ? 'Edit Test' : 'Add New Test'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        <div><label>Test Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}><option value="">Select</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                        <div><label>Price ($)</label><input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Unit</label><input type="text" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} placeholder="mg/dL, cells/uL, etc." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Normal Range</label><input type="text" value={formData.normalRange} onChange={(e) => setFormData({...formData, normalRange: e.target.value})} placeholder="e.g., 4.5-11.0" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Turnaround (hours)</label><input type="number" value={formData.turnaroundHours} onChange={(e) => setFormData({...formData, turnaroundHours: parseInt(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label>Preparation Instructions</label><textarea value={formData.preparationInstructions} onChange={(e) => setFormData({...formData, preparationInstructions: e.target.value})} rows={2} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} /></div>
                        <div><label><input type="checkbox" checked={formData.requiresFasting} onChange={(e) => setFormData({...formData, requiresFasting: e.target.checked})} /> Requires Fasting</label></div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ background: '#0f2b3d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => { setShowAddForm(false); setEditingTest(null); }} style={{ background: '#e2e8f0', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            )}
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: '#f1f5f9' }}>
                        <tr><th style={{ padding: '12px', textAlign: 'left' }}>Test Name</th><th>Category</th><th>Normal Range</th><th>Unit</th><th>Price</th><th>Turnaround</th><th>Fasting</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {tests.map(test => (
                            <tr key={test.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px' }}><strong>{test.name}</strong></td>
                                <td style={{ padding: '12px' }}>{test.category}</td>
                                <td style={{ padding: '12px' }}>{test.normalRange}</td>
                                <td style={{ padding: '12px' }}>{test.unit}</td>
                                <td style={{ padding: '12px' }}>${test.price}</td>
                                <td style={{ padding: '12px' }}>{test.turnaroundHours}h</td>
                                <td style={{ padding: '12px' }}>{test.requiresFasting ? 'Yes' : 'No'}</td>
                                <td style={{ padding: '12px' }}><button onClick={() => handleEdit(test)} style={{ marginRight: '8px', background: '#6b7280', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button><button onClick={() => handleDelete(test.id!)} style={{ background: '#ef4444', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LabTestCatalog;
