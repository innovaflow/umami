'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/components/hooks';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefono: string | null;
  salone: string | null;
  tipo: string | null;
  messaggio: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  created_at: string;
}

const tipoLabels: Record<string, string> = {
  barbiere: '💈 Barbiere',
  parrucchiere: '✂️ Parrucchiere',
  'centro-estetico': '💆 Centro estetico',
  altro: '🏪 Altro',
};

export function LeadsPage() {
  const { get } = useApi();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/leads')
      .then((data: Lead[]) => setLeads(data || []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Leads InnovaBeauty
        </h1>
        <p style={{ opacity: 0.6 }}>Caricamento...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
          Leads InnovaBeauty
        </h1>
        <p style={{ opacity: 0.6 }}>
          Nessun lead ancora. Arriveranno qui quando qualcuno compila il form su
          innovaflow.it/contatti.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Leads InnovaBeauty</h1>
        <span style={{ fontSize: '0.875rem', opacity: 0.6 }}>
          {leads.length} lead{leads.length !== 1 ? 's' : ''} totali
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {leads.map(lead => (
          <div
            key={lead.id}
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.5rem',
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{lead.nome}</span>
                {lead.tipo && (
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
                    {tipoLabels[lead.tipo] || lead.tipo}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                {new Date(lead.created_at).toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.85rem',
                opacity: 0.8,
                flexWrap: 'wrap',
              }}
            >
              <span>📧 {lead.email}</span>
              {lead.telefono && <span>📱 {lead.telefono}</span>}
              {lead.salone && <span>💈 {lead.salone}</span>}
            </div>

            {lead.messaggio && (
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  opacity: 0.7,
                  fontStyle: 'italic',
                }}
              >
                &quot;{lead.messaggio}&quot;
              </p>
            )}

            {(lead.utm_source || lead.referrer) && (
              <div
                style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
              >
                {lead.utm_source && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      background: 'rgba(0,47,167,0.2)',
                      color: 'rgb(100,150,255)',
                    }}
                  >
                    {lead.utm_source}
                  </span>
                )}
                {lead.utm_medium && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      background: 'rgba(255,79,0,0.15)',
                      color: 'rgb(255,130,60)',
                    }}
                  >
                    {lead.utm_medium}
                  </span>
                )}
                {lead.referrer && !lead.utm_source && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      background: 'rgba(255,255,255,0.1)',
                      opacity: 0.6,
                    }}
                  >
                    via {lead.referrer}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
