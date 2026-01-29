import React from 'react';
import { adminSubmitForReview as submitForReview, adminPublishOrganization as publishOrganization, adminArchiveOrganization as archiveOrganization } from '../../services/api';

export default function AdminList({ organizations, onRefresh, onSelect }) {

    const handleAction = async (id, actionFn, label) => {
        if (!confirm(`¿Seguro que quieres ${label} esta organización?`)) return;
        try {
            await actionFn(id);
            onRefresh();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3>Gestión de Organizaciones</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nombre</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Estado</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {organizations.map(org => (
                        <tr key={org.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{org.id}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{org.name}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: org.status === 'PUBLISHED' ? '#dcfce7' : '#f3f4f6',
                                    color: org.status === 'PUBLISHED' ? '#166534' : '#374151',
                                    fontSize: '0.75rem'
                                }}>
                                    {org.status}
                                </span>
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <button onClick={() => onSelect(org)} style={{ ...btnStyle('#6b7280'), marginRight: '10px' }}>Editar/Coords</button>

                                {org.status === 'DRAFT' && (
                                    <button onClick={() => handleAction(org.id, submitForReview, 'enviar a revisión')} style={btnStyle('#3b82f6')}>Review</button>
                                )}
                                {org.status === 'IN_REVIEW' && (
                                    <button onClick={() => handleAction(org.id, publishOrganization, 'publicar')} style={btnStyle('#10b981')}>Publish</button>
                                )}
                                {org.status === 'PUBLISHED' && (
                                    <button onClick={() => handleAction(org.id, archiveOrganization, 'archivar')} style={btnStyle('#ef4444')}>Archive</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const btnStyle = (color) => ({
    marginRight: '5px',
    padding: '4px 8px',
    background: color,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
});
