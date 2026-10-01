import React, { useState, useEffect } from 'react';
import './App.css';

// ---------- Minimal SVG Icons ----------

const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconFile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconRobot = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const IconClose = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ---------- Helpers ----------

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const todayDDMMYYYY = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// ---------- App ----------

function App() {
  const [wbFile, setWbFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Status check state
  const [statusDate, setStatusDate] = useState(todayDDMMYYYY());
  const [statusLoading, setStatusLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleWBFileChange = (e) => {
    if (e.target.files.length > 0) setWbFile(e.target.files[0]);
  };

  const removeFile = (e, setter) => {
    e.preventDefault();
    e.stopPropagation();
    setter(null);
    const input = e.currentTarget.closest('label')?.querySelector('input[type="file"]');
    if (input) input.value = '';
  };

  // ----- Upload WB -----
  const handleUploadWB = async () => {
    if (!wbFile) {
      setMessage('Please select the WB file.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Uploading WB file...');
    setMessageType('info');

    const formData = new FormData();
    formData.append('wb_file', wbFile);

    try {
      const response = await fetch('http://localhost:8000/upload-wb', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setMessage(data.message || 'WB file uploaded successfully.');
      setMessageType('success');
      setWbFile(null);
      document.querySelectorAll('input[type="file"]').forEach((el) => (el.value = ''));
      // Update status date to the uploaded date
      if (data.date) setStatusDate(data.date);
      // Fetch status
      fetchStatus(data.date);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // ----- Fetch Status -----
  const fetchStatus = async (dateStr) => {
    const dt = dateStr || statusDate;
    if (!dt) return;

    setStatusLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/status/${dt}`);
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setStatus(null);
    } finally {
      setStatusLoading(false);
    }
  };

  // Auto-fetch status on load
  useEffect(() => {
    fetchStatus(statusDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Download Merged -----
  const handleDownloadMerged = async () => {
    if (!status?.merged_ready) return;
    try {
      const response = await fetch(`http://localhost:8000/download/${statusDate}`);
      if (!response.ok) {
        throw new Error('Merged file not ready yet.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Merged_${statusDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    }
  };

  const resetAll = () => {
    setWbFile(null);
    setMessage('');
    setMessageType('');
    document.querySelectorAll('input[type="file"]').forEach((el) => (el.value = ''));
  };

  const hasStatus = status !== null;

  return (
    <div className="app-shell">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">R</div>
            <div>
              <div className="brand-title">Reconciliation Suite</div>
              <div className="brand-sub">Data Operations Platform</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <div className="page-header">
          <h1>Excel Data Reconciliation</h1>
          <p>
            Upload the Weight Bridge report. The ZV07 report will be automatically
            fetched from SAP by the RPA bot overnight. The merged file will be
            available for download the next morning.
          </p>
        </div>

        {/* STEP 01 — WB Upload */}
        <section className="panel">
          <div className="panel-header">
            <span className="panel-step">01</span>
            <span className="panel-title">Upload Weight Bridge Report</span>
          </div>

          <label className={`file-slot ${wbFile ? 'filled' : ''}`}>
            <input type="file" accept=".xlsx,.xls" onChange={handleWBFileChange} hidden />
            <div className="file-slot-head">
              <span className="file-slot-icon"><IconFile /></span>
              <div>
                <div className="file-slot-title">Weight Bridge Report</div>
                <div className="file-slot-hint">.xlsx or .xls</div>
              </div>
            </div>
            <div className="file-slot-body">
              {wbFile ? (
                <div className="file-selected">
                  <div className="file-selected-meta">
                    <span className="file-selected-name" title={wbFile.name}>{wbFile.name}</span>
                    <span className="file-selected-size">{formatSize(wbFile.size)}</span>
                  </div>
                  <span className="file-selected-tag">Ready</span>
                  <button
                    type="button"
                    className="file-remove"
                    onClick={(e) => removeFile(e, setWbFile)}
                    aria-label="Remove file"
                    title="Remove file"
                    disabled={loading}
                  >
                    <IconClose />
                  </button>
                </div>
              ) : (
                <div className="file-empty">
                  <IconUpload />
                  <span>Click to select file</span>
                </div>
              )}
            </div>
          </label>

          <div className="actions" style={{ marginTop: '16px' }}>
            <button
              className="btn-primary"
              onClick={handleUploadWB}
              disabled={loading || !wbFile}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Uploading...
                </>
              ) : (
                'Upload WB File'
              )}
            </button>
            {wbFile && !loading && (
              <button className="btn-secondary" onClick={resetAll}>
                Clear
              </button>
            )}
          </div>

          {message && (
            <div
              className={`notice notice-${messageType}`}
              role={messageType === 'error' ? 'alert' : 'status'}
            >
              <span className="notice-icon">
                {messageType === 'success' && <IconCheck />}
                {messageType === 'error' && <IconAlert />}
                {messageType === 'info' && <IconInfo />}
              </span>
              <span>{message}</span>
            </div>
          )}
        </section>

        {/* STEP 02 — ZV07 Info */}
        <section className="panel">
          <div className="panel-header">
            <span className="panel-step">02</span>
            <span className="panel-title">ZV07 Report — Auto-fetched</span>
          </div>

          <div className="info-block">
            <div className="info-icon"><IconRobot /></div>
            <div className="info-text">
              <div className="info-title">ZV07 will be automatically downloaded from SAP</div>
              <div className="info-sub">
                The RPA bot runs overnight and fetches today's ZV07 report from SAP.
                No manual upload is required.
              </div>
            </div>
          </div>
        </section>

        {/* STEP 03 — Status & Download */}
        <section className="panel">
          <div className="panel-header">
            <span className="panel-step">03</span>
            <span className="panel-title">Status & Download</span>
          </div>

          <div className="status-bar">
            <div className="date-field">
              <label className="date-label">Report Date</label>
              <input
                type="text"
                className="date-input"
                placeholder="DD-MM-YYYY"
                value={statusDate}
                onChange={(e) => setStatusDate(e.target.value)}
              />
            </div>
            <button
              className="btn-refresh"
              onClick={() => fetchStatus(statusDate)}
              disabled={statusLoading}
              title="Refresh status"
            >
              {statusLoading ? <span className="spinner spinner-dark" /> : <IconRefresh />}
              Refresh
            </button>
          </div>

          {hasStatus && (
            <div className="status-list">
              <div className={`status-row ${status.wb_uploaded ? 'ok' : 'pending'}`}>
                <span className="status-dot">{status.wb_uploaded ? <IconCheck /> : '—'}</span>
                <span className="status-label">WB File</span>
                <span className="status-value">
                  {status.wb_uploaded ? 'Uploaded' : 'Not uploaded yet'}
                </span>
              </div>

              <div className={`status-row ${status.zv07_downloaded ? 'ok' : 'pending'}`}>
                <span className="status-dot">{status.zv07_downloaded ? <IconCheck /> : '—'}</span>
                <span className="status-label">ZV07 File</span>
                <span className="status-value">
                  {status.zv07_downloaded ? 'Downloaded by RPA' : 'Pending (RPA will fetch overnight)'}
                </span>
              </div>

              <div className={`status-row ${status.merged_ready ? 'ok' : 'pending'}`}>
                <span className="status-dot">{status.merged_ready ? <IconCheck /> : '—'}</span>
                <span className="status-label">Merged File</span>
                <span className="status-value">
                  {status.merged_ready ? 'Ready for download' : 'Not ready yet'}
                </span>
              </div>
            </div>
          )}

          {status?.merged_ready && (
            <div className="download-block">
              <button className="btn-download-merged" onClick={handleDownloadMerged}>
                <IconDownload /> Download Merged File
              </button>
            </div>
          )}

          {!status && !statusLoading && (
            <div className="notice notice-info">
              <span className="notice-icon"><IconInfo /></span>
              <span>Enter a date and click Refresh to see the status.</span>
            </div>
          )}
        </section>

        <footer className="page-footer">
          © {new Date().getFullYear()} Reconciliation Suite. Internal use only.
        </footer>
      </main>
    </div>
  );
}

export default App;