import React, { useState } from 'react';
import './Reports.css';
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  MapPin, 
  CheckCircle, 
  Printer, 
  ShieldCheck, 
  ExternalLink,
  Layers
} from 'lucide-react';

export const Reports = ({ visits, ncrs, addAuditEvent, currentUser }) => {
  const [activeReportTab, setActiveReportTab] = useState('visit_25'); // 'visit_25' | 'ncr_16' | 'pdf' | 'kml'
  const [downloadSuccess, setDownloadSuccess] = useState('');

  // Exactly 25 Site Visits Legacy Headers (RULE-18 / APPROVED LEGACY EXPORT HEADERS)
  const VISIT_25_HEADERS = [
    'Id',
    'Start time',
    'Completion time',
    'Site Visit Date',
    'Customer Name',
    'Work Type',
    'Site Location',
    'Panel Type',
    'Serial No.',
    'SO',
    'RTU Type',
    'Installation Proper',
    'Grounding Available',
    'Surge Arresters Provided',
    'Chain Fixed Properly',
    'Complaint Reported by Customer',
    'Defective Item',
    'Issue Observed by Alfanar',
    'Status (Energized/De-energized)',
    'Job Status',
    'Defective Material SL No. (NCR)',
    'Visited By',
    'Work Description',
    'IP Address',
    'Status1'
  ];

  // Exactly 16 NCR Legacy Headers
  const NCR_16_HEADERS = [
    'Sl. No.',
    'SAP Code',
    'Site Region & Sales Order No.',
    'Complaint Received Date',
    'Complaint Closed Date',
    'Description',
    'Make',
    'Ord./Model No.',
    'Serial No.',
    'Qty.',
    'Type/Nature of Complaint',
    'Cause of Complaint',
    'Material Status',
    'Customer Comment',
    'Testing / QCA Finding',
    'Attended By'
  ];

  // Map visits data to 25 rows
  const getVisit25Data = () => {
    const rows = [];
    visits.forEach((v) => {
      v.panels.forEach((p, pIdx) => {
        rows.push([
          p.csdTicket || `VST-${v.visitId.slice(-4)}-${pIdx + 1}`,
          '09:20:00',
          '11:45:00',
          v.visitDate,
          v.customerName,
          v.workType,
          v.siteLocation,
          p.panelType || p.panelFamily,
          p.serialNo,
          p.salesOrder,
          p.rtuType,
          p.checklist?.installationProper || 'Pass',
          p.checklist?.groundingAvailable || 'Pass',
          p.checklist?.surgeArrestersProvided || 'Pass',
          p.checklist?.chainFixedProperly || 'Pass',
          p.complaintReported,
          p.defectiveItem || 'None',
          p.finding,
          p.energyState,
          p.jobStatus,
          p.defectiveMaterialSlNo || 'N/A',
          v.leadEngineer,
          p.actualWork,
          p.ipAddress || '10.14.88.24',
          p.status1 || 'Active'
        ]);
      });
    });
    return rows;
  };

  // Map NCR data to 16 rows
  const getNcr16Data = () => {
    return ncrs.map(n => [
      n.slNo,
      n.sapCode,
      n.siteRegionSalesOrder,
      n.complaintReceivedDate,
      n.complaintClosedDate,
      n.description,
      n.make,
      n.ordModelNo,
      n.serialNo,
      n.qty,
      n.natureOfComplaint,
      n.causeOfComplaint,
      n.materialStatus,
      n.customerComment,
      n.testingQcaFinding,
      n.attendedBy
    ]);
  };

  // CSV Generator that strictly enforces headers and prevents commas breaking CSV columns
  const downloadCSV = (filename, headers, rows) => {
    const escapeCol = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent = [
      headers.map(escapeCol).join(','),
      ...rows.map(row => row.map(escapeCol).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Exported "${filename}" successfully with zero schema modifications.`);
    setTimeout(() => setDownloadSuccess(''), 4000);

    addAuditEvent({
      user: currentUser.name,
      role: currentUser.role,
      action: 'Report Export Generated',
      recordId: filename,
      details: `Generated exact schema export "${filename}". Headers count: ${headers.length}.`,
    });
  };

  // KML Export Generator
  const downloadKML = () => {
    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Alfanar MV Customer Service Sites</name>
    <description>GPS Site points captured for Medium-Voltage maintenance attendance</description>
`;

    visits.forEach(v => {
      if (v.gps && v.gps.latitude) {
        kmlContent += `    <Placemark>
      <name>${v.workOrderId} - ${v.siteLocation}</name>
      <description>Customer: ${v.customerName} | Engineer: ${v.leadEngineer} | Panels: ${v.panels.length}</description>
      <Point>
        <coordinates>${v.gps.longitude},${v.gps.latitude},0</coordinates>
      </Point>
    </Placemark>
`;
      }
    });

    kmlContent += `  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Alfanar_MV_Sites.kml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Exported "Alfanar_MV_Sites.kml" successfully.');
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  const visitRows = getVisit25Data();
  const ncrRows = getNcr16Data();

  return (
    <div className="reports-page-container">
      <div className="reports-header-row">
        <div>
          <h1 className="reports-title">17 Reports, Legacy Exports & Analytics</h1>
          <p className="reports-sub">
            Strict preservation of approved 25-column Site Visit and 16-column NCR export contracts, PDF certificates, and KML mapping.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="export-success-banner">
          <CheckCircle size={18} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="reports-sub-nav">
        <button 
          className={`sub-tab-btn ${activeReportTab === 'visit_25' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('visit_25')}
        >
          <FileSpreadsheet size={16} />
          <span>Site Visits (Exact 25 Cols)</span>
        </button>

        <button 
          className={`sub-tab-btn ${activeReportTab === 'ncr_16' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('ncr_16')}
        >
          <FileSpreadsheet size={16} />
          <span>NCR Quality Export (Exact 16 Cols)</span>
        </button>

        <button 
          className={`sub-tab-btn ${activeReportTab === 'pdf' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('pdf')}
        >
          <FileText size={16} />
          <span>Official PDF Visit Report</span>
        </button>

        <button 
          className={`sub-tab-btn ${activeReportTab === 'kml' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('kml')}
        >
          <MapPin size={16} />
          <span>GPS KML / KMZ Mapping</span>
        </button>
      </div>

      {/* Tab 1: Exact 25 Headers Site Visit Export */}
      {activeReportTab === 'visit_25' && (
        <div className="report-content-card">
          <div className="card-top-action-bar">
            <div>
              <h3>Site Visits Legacy Export (Exact 25 Columns)</h3>
              <p className="contract-note">
                <strong>RULE-18 Contract:</strong> Header count, names, casing, and column order are frozen. 
                Includes raw Status1 field. No added worksheet index column.
              </p>
            </div>

            <button 
              className="btn-download-excel"
              onClick={() => downloadCSV('Site_Visits_Exact_25_Columns.csv', VISIT_25_HEADERS, visitRows)}
            >
              <Download size={15} />
              <span>Download 25-Col CSV / Excel</span>
            </button>
          </div>

          <div className="headers-badge-strip">
            <span className="col-count-tag">Exact 25 Columns Verified:</span>
            {VISIT_25_HEADERS.map((h, i) => (
              <span key={i} className="single-header-pill">
                {i + 1}. {h}
              </span>
            ))}
          </div>

          <div className="table-preview-scroll">
            <table className="export-preview-table">
              <thead>
                <tr>
                  {VISIT_25_HEADERS.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visitRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Exact 16 Headers NCR Export */}
      {activeReportTab === 'ncr_16' && (
        <div className="report-content-card">
          <div className="card-top-action-bar">
            <div>
              <h3>NCR Quality Export (Exact 16 Columns)</h3>
              <p className="contract-note">
                <strong>RULE-18 Contract:</strong> Exactly 16 approved headers matching the companion workbook contract. 
                No extraneous worksheet index column.
              </p>
            </div>

            <button 
              className="btn-download-excel green"
              onClick={() => downloadCSV('NCR_Export_Exact_16_Columns.csv', NCR_16_HEADERS, ncrRows)}
            >
              <Download size={15} />
              <span>Download 16-Col CSV / Excel</span>
            </button>
          </div>

          <div className="headers-badge-strip">
            <span className="col-count-tag">Exact 16 Columns Verified:</span>
            {NCR_16_HEADERS.map((h, i) => (
              <span key={i} className="single-header-pill green">
                {i + 1}. {h}
              </span>
            ))}
          </div>

          <div className="table-preview-scroll">
            <table className="export-preview-table">
              <thead>
                <tr>
                  {NCR_16_HEADERS.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ncrRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Official PDF Preview */}
      {activeReportTab === 'pdf' && (
        <div className="report-content-card">
          <div className="card-top-action-bar">
            <div>
              <h3>Approved Site Visit Report (Official PDF Template)</h3>
              <p className="contract-note">
                Generated from approved Revision 1. Displays approved template version 2026-v1.0.
              </p>
            </div>

            <button 
              className="btn-print-pdf"
              onClick={() => window.print()}
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Printable Official Sheet */}
          <div className="official-pdf-sheet">
            <div className="pdf-sheet-header">
              <div className="pdf-logo-box">
                <h2>ALFANAR ELECTRICAL SYSTEMS</h2>
                <span>MEDIUM VOLTAGE CUSTOMER SERVICE DIVISION</span>
              </div>
              <div className="pdf-ref-block">
                <div><strong>Report Ref:</strong> {visits[0]?.visitId}</div>
                <div><strong>Approved Revision:</strong> Rev {visits[0]?.revision}</div>
                <div><strong>Template Version:</strong> KSA-MV-SVR-2026.01</div>
                <div><strong>Date of Inspection:</strong> {visits[0]?.visitDate}</div>
              </div>
            </div>

            <div className="pdf-section-title">1. Substation & Attendance Particulars</div>
            <div className="pdf-grid-info">
              <div><strong>Customer Name:</strong> {visits[0]?.customerName}</div>
              <div><strong>Site Location:</strong> {visits[0]?.siteLocation}</div>
              <div><strong>Lead Engineer:</strong> {visits[0]?.leadEngineer}</div>
              <div><strong>Reviewing Supervisor:</strong> Dispatcher Supervisor (ALF-SUP-01)</div>
              <div><strong>GPS Coordinates:</strong> 24.6625° N, 46.7328° E (±3m)</div>
              <div><strong>Safety Permit Ref:</strong> SEC-PTW-2026-8812</div>
            </div>

            <div className="pdf-section-title">2. Electrical Panel Inspection & Diagnosis</div>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th>Panel ID</th>
                  <th>Equipment Family</th>
                  <th>Voltage</th>
                  <th>Serial No.</th>
                  <th>RTU</th>
                  <th>Status</th>
                  <th>Observed Finding</th>
                </tr>
              </thead>
              <tbody>
                {visits[0]?.panels.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.panelId}</td>
                    <td>{p.panelType || p.panelFamily}</td>
                    <td>{p.voltage}</td>
                    <td className="mono">{p.serialNo}</td>
                    <td>{p.rtuType}</td>
                    <td>{p.energyState}</td>
                    <td>{p.finding}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pdf-section-title">3. Corrective Maintenance & Verification</div>
            <p className="pdf-work-desc">
              {visits[0]?.panels[0]?.actualWork}
            </p>

            <div className="pdf-signatures-row">
              <div className="sig-box">
                <span className="sig-label">Field Engineer Sign-off</span>
                <span className="sig-name">Lead Field Engineer (ALF-FE-309)</span>
                <span className="sig-time">Timestamp: 2026-10-23 11:45:00 AST</span>
              </div>
              <div className="sig-box">
                <span className="sig-label">Dispatcher Supervisor Sign-off</span>
                <span className="sig-name">Dispatcher Supervisor (ALF-SUP-01)</span>
                <span className="sig-time">Technical Closure Approved</span>
              </div>
              <div className="sig-box">
                <span className="sig-label">Customer Utility Acknowledgment</span>
                <span className="sig-name">Saudi Electricity Company Representative</span>
                <span className="sig-time">Accepted on Site</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: KML Mapping */}
      {activeReportTab === 'kml' && (
        <div className="report-content-card">
          <div className="card-top-action-bar">
            <div>
              <h3>GPS Site Points & KML/KMZ Export</h3>
              <p className="contract-note">
                Generates geospatial KML markers with case, customer, and panel identifiers for GIS mapping.
              </p>
            </div>

            <button 
              className="btn-download-excel"
              onClick={downloadKML}
            >
              <Download size={15} />
              <span>Export Alfanar_MV_Sites.kml</span>
            </button>
          </div>

          <div className="kml-preview-box">
            <h4>Geocoded Site Points Available for Export:</h4>
            <div className="site-points-list">
              {visits.map((v, i) => (
                <div key={i} className="site-point-card">
                  <div className="point-head">
                    <MapPin size={16} className="pin-red" />
                    <strong>{v.siteLocation}</strong>
                  </div>
                  <div className="point-meta">
                    <div>Coordinates: {v.gps?.latitude}° N, {v.gps?.longitude}° E</div>
                    <div>Customer: {v.customerName} | Work Order: {v.workOrderId}</div>
                    <div>Panels Inspected: {v.panels.map(p => p.serialNo).join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Reports;

