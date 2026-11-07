import React, { useState } from 'react';
import './EquipmentRegister.css';
import { 
  Cpu, 
  Search, 
  History, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Layers,
  Activity
} from 'lucide-react';

export const EquipmentRegister = ({ EQUIPMENT_CATALOGUE, visits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('ALL');

  // Registered MV assets from documents & visits
  const registeredAssets = [
    {
      serialNo: 'ALF-MV-2024-8841',
      family: 'LBS / SLBS',
      subtype: 'SLBS',
      voltage: '13.8 kV',
      customer: 'Saudi Electricity Company (SEC)',
      site: 'Riyadh Substation 8044 — Al-Malaz',
      salesOrder: 'SO-99214',
      sapId: 'SAP-AST-88410',
      rtuType: 'ZIV',
      energyState: 'Energized',
      faultHistoryCount: 1,
      lastServiceDate: '2026-10-23',
      repeatFaultSummary: 'Gas pressure sensor manifold seal replacement; pressure restored to 0.15 MPa.',
    },
    {
      serialNo: 'ALF-MV-2024-9102',
      family: 'Auto-Recloser',
      subtype: 'Standard Auto-Recloser',
      voltage: '33 kV',
      customer: 'Red Sea Global Infrastructure',
      site: 'Southern Dunes Solar Grid Station',
      salesOrder: 'SO-99430',
      sapId: 'SAP-AST-91020',
      rtuType: 'Ingeteam',
      energyState: 'De-energized',
      faultHistoryCount: 1,
      lastServiceDate: '2026-10-24 (Assigned)',
      repeatFaultSummary: 'Protection trip under solar cycling; mechanical linkage bound.',
    },
    {
      serialNo: 'ALF-MV-2023-7419',
      family: 'RMU / MRMU / SRMU',
      subtype: 'Modular RMU (MRMU)',
      voltage: '13.8 kV',
      customer: 'Saudi Electricity Company (SEC)',
      site: 'Jeddah Industrial Feeder 14B',
      salesOrder: 'SO-88102',
      sapId: 'SAP-AST-74190',
      rtuType: 'IKI-55',
      energyState: 'Energized',
      faultHistoryCount: 1,
      lastServiceDate: '2026-10-23',
      repeatFaultSummary: 'Mechanical interlock lever stiff during scheduled bus transfer.',
    },
    {
      serialNo: 'ALF-MV-2024-9988',
      family: 'LBS / SLBS',
      subtype: 'Smart OH-LBS',
      voltage: '33 kV',
      customer: 'Saudi Electricity Company (SEC)',
      site: 'Riyadh Substation 8044 — Al-Malaz',
      salesOrder: 'SO-99880',
      sapId: 'SAP-AST-99880',
      rtuType: 'DFE',
      energyState: 'Energized',
      faultHistoryCount: 0,
      lastServiceDate: '2026-09-15',
      repeatFaultSummary: 'Commissioning health check normal. Zero repeat faults.',
    },
  ];

  const filteredAssets = registeredAssets.filter(a => {
    const matchesSearch = 
      a.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.sapId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFamily = selectedFamily === 'ALL' || a.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  return (
    <div className="equipment-page-container">
      <div className="equip-head-row">
        <div>
          <h1 className="equip-title">06 Equipment Register & Repeat-Fault History</h1>
          <p className="equip-sub">
            Track serial numbers, rated voltages (13.8 kV & 33 kV), customer-site relationships, and component degradation trends.
          </p>
        </div>
      </div>

      {/* Equipment Selection Tree Overview */}
      <div className="catalog-tree-banner">
        <div className="tree-head">
          <Layers size={16} />
          <strong>Approved Equipment Tree & Voltage Dependents (Document Section 2)</strong>
        </div>
        <div className="tree-chips-grid">
          <div className="tree-chip">
            <span className="chip-fam">LBS / SLBS</span>
            <span className="chip-volts">13.8 kV; 33 kV</span>
            <span className="chip-sub">Subtypes: SLBS, Smart OH-LBS, Other LBS</span>
          </div>
          <div className="tree-chip">
            <span className="chip-fam">Auto-Recloser</span>
            <span className="chip-volts">13.8 kV; 33 kV</span>
            <span className="chip-sub">Ingeteam / ZIV controller (Not a voltage)</span>
          </div>
          <div className="tree-chip">
            <span className="chip-fam">RMU / MRMU / SRMU</span>
            <span className="chip-volts">13.8 kV; 33 kV</span>
            <span className="chip-sub">Approved catalogue makes & models</span>
          </div>
          <div className="tree-chip">
            <span className="chip-fam">Other MV equipment</span>
            <span className="chip-volts">Exact rating</span>
            <span className="chip-sub">Requires admin review & typed description</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="equip-filter-bar">
        <div className="search-wrap">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search Serial Number, SAP ID, Substation, or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
          className="family-select"
        >
          <option value="ALL">All Equipment Families</option>
          <option value="LBS / SLBS">LBS / SLBS</option>
          <option value="Auto-Recloser">Auto-Recloser</option>
          <option value="RMU / MRMU / SRMU">RMU / MRMU / SRMU</option>
        </select>
      </div>

      {/* Assets Grid */}
      <div className="assets-cards-grid">
        {filteredAssets.map(asset => (
          <div key={asset.serialNo} className="asset-card">
            <div className="asset-card-top">
              <div className="serial-badge-group">
                <span className="serial-bold">{asset.serialNo}</span>
                <span className="voltage-tag">{asset.voltage}</span>
              </div>
              <span className={`energy-state-tag ${asset.energyState.toLowerCase().replace(/\s+/g, '-')}`}>
                {asset.energyState}
              </span>
            </div>

            <div className="asset-family-line">
              <strong>{asset.family}</strong> — <span className="sub-type">{asset.subtype}</span>
            </div>

            <div className="asset-site-line">
              <MapPin size={13} className="pin-icon" />
              <span>{asset.site}</span>
            </div>

            <div className="asset-customer-line">
              <span>Customer: <strong>{asset.customer}</strong></span>
            </div>

            <div className="asset-tech-specs">
              <div><span>RTU Type:</span> <strong>{asset.rtuType}</strong></div>
              <div><span>Sales Order:</span> <strong>{asset.salesOrder}</strong></div>
              <div><span>SAP Asset ID:</span> <strong className="mono">{asset.sapId}</strong></div>
            </div>

            {/* Repeat Fault History */}
            <div className="fault-history-box">
              <div className="fault-head">
                <History size={13} />
                <span>Repeat Fault History ({asset.faultHistoryCount} Event)</span>
              </div>
              <p className="fault-desc">"{asset.repeatFaultSummary}"</p>
              <div className="last-serv">Last Attendance: {asset.lastServiceDate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EquipmentRegister;

