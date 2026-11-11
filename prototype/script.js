/* ------------------------------------------------------------------
 * Arkhya Tech VMS — clickable prototype
 * Reference date for all sample data: Tue, 10 Nov 2026.
 * Current billing period under reconciliation: October 2026.
 * ------------------------------------------------------------------ */

/* ---------- Small render helpers ---------- */

const BADGE_TONES = {
  approved: ['Active', 'Valid', 'Approved', 'Matched', 'Signed', 'Submitted', 'Uploaded', 'Paid'],
  rejected: ['Rejected', 'Expired', 'Inactive', 'Mismatch', 'Missing'],
  warning: ['Expiring Soon', 'Review', 'Due', 'Due Soon', 'Action Needed', 'Draft'],
  progress: ['In Progress', 'Pending', 'Incomplete', 'Awaiting Client Invoice', 'Onboarding', 'Not Started', 'Invited'],
  neutral: ['Not Applicable', 'Closed', 'Ended']
};

function b(text) {
  const tone = Object.keys(BADGE_TONES).find((key) => BADGE_TONES[key].includes(text)) || 'neutral';
  return `<span class="status-badge status-${tone}">${text}</span>`;
}

function acts(...labels) {
  const targets = {
    'View / Edit': 'clientEdit',
    'Holiday Calendar': 'clientHolidayCalendar',
    'Client invoice': 'invoiceUpload',
    'Vendor Invoice': 'vendorInvoices',
    'Consultants': 'vendorConsultants',
    'Open': 'clientEdit',
    'Holidays': 'clientHolidayCalendar',
    'View': 'clients',
    'Edit': 'clientEdit',
    'View all': 'dashboard',
    'Correct': 'invoiceAudit'
  };

  return `<div class="row-actions">${labels.map((l) => `<button class="link-btn" data-target="${targets[l] || 'dashboard'}">${l}</button>`).join('')}</div>`;
}

function clientInvoiceAction(clientName) {
  return `<button class="link-btn" data-target="invoiceUpload" data-client="${clientName}">Client invoice</button>`;
}

function getClientInvoiceRows(clientName) {
  const rowsByClient = {
    'Blue Harbor Health': [
      [person('Deepa Kumar', 'Coral Staffing'), 'Consultant', '160', fileChip('BH-Oct26-Kumar.pdf', '420 KB'), '<input class="cell-input" value="168" />', b('Rejected')],
      [person('Kevin Singh', 'Summit IT'), 'Consultant', '160', fileChip('BH-Oct26-Singh.pdf', '418 KB'), '<input class="cell-input" value="152" />', b('Rejected')],
      [person('Lena Fischer', 'Summit IT'), 'Consultant', '168', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')],
      [person('Omar Haddad', 'Coral Staffing'), 'Consultant', '144', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')],
      [person('Grace Liu', 'W-2'), 'W-2', '168', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')]
    ],
    'Northwind Labs': [
      [person('Jordan Blake', '1099'), '1099', '152', fileChip('NL-Oct26-Blake.pdf', '402 KB'), '<input class="cell-input" value="152" />', b('Approved')],
      [person('Maya Reed', 'W-2'), 'W-2', '168', fileChip('NL-Oct26-Maya.pdf', '405 KB'), '<input class="cell-input" value="168" />', b('Approved')],
      [person('Ava Chen', 'Contractor'), '1099', '160', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')]
    ],
    'Meridian Retail Group': [
      [person('Priya Shah', 'Coral Staffing'), 'Consultant', '164', fileChip('MR-Oct26-Shah.pdf', '431 KB'), '<input class="cell-input" value="168" />', b('Rejected')],
      [person('Maya Reed', 'W-2'), 'W-2', '168', fileChip('MR-Oct26-Maya.pdf', '410 KB'), '<input class="cell-input" value="168" />', b('Approved')],
      [person('Natalie Brooks', 'Consultant'), 'Consultant', '152', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')]
    ],
    'Lumen Logistics': [
      [person('Alex Morgan', 'W-2'), 'W-2', '160', fileChip('LL-Oct26-Morgan.pdf', '390 KB'), '<input class="cell-input" value="160" />', b('Approved')],
      [person('Ravi Menon', 'Consultant'), 'Consultant', '144', fileChip('LL-Oct26-Menon.pdf', '410 KB'), '<input class="cell-input" value="144" />', b('Approved')],
      [person('Alicia Ross', 'Account Manager'), 'W-2', '168', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')]
    ]
  };

  return rowsByClient[clientName] || rowsByClient['Blue Harbor Health'];
}

const DASHBOARD_KPI_TARGETS = {
  superadmin: ['clients', 'vendors', 'teamMembers', 'teamMembers'],
  accountmanager: ['clients', 'vendorList', 'invoiceUpload', 'reconciliation'],
  vendor: ['consultants', 'invoices', 'rejectedInvoice', 'docs'],
  w2: ['engagements', 'status', 'status', 'docs'],
  w9: ['engagements', 'status', 'correction', 'docs']
};

function person(name, sub) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  return `<div class="person-cell"><span class="avatar">${initials}</span><span><span class="person-name">${name}</span>${sub ? `<span class="person-sub">${sub}</span>` : ''}</span></div>`;
}

function sub(main, secondary) {
  return `<span class="person-name">${main}</span><span class="person-sub">${secondary}</span>`;
}

function mono(text) {
  return `<span class="mono">${text}</span>`;
}

function diff(text) {
  return `<span class="diff-bad">${text}</span>`;
}

function fileChip(name, size) {
  return `<span class="file-chip"><span class="file-ext">${name.split('.').pop().toUpperCase()}</span>${name}${size ? `<span class="person-sub inline">${size}</span>` : ''}</span>`;
}

/* ---------- Personas ---------- */

const personaConfig = {
  /* =============================================================== */
  superadmin: {
    name: 'Super Admin',
    user: { name: 'Arun Krishnan', role: 'Super Admin', email: 'a.krishnan@arkhyatech.com' },
    notifications: 6,
    nav: [
      { label: 'Dashboard', target: 'dashboard' },
      { label: 'Clients', target: 'clients' },
      { label: 'Vendors', target: 'vendors' },
      { label: 'Team Members', target: 'teamMembers' },
      { label: 'Invoices', target: 'invoiceAudit' },
      { label: 'Document Tracker', target: 'documentTracker' },
      { label: 'Audit Log', target: 'audit' }
    ],
    screens: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Platform-wide view of clients, vendors, people and the October 2026 billing cycle.',
        actions: [
          { label: 'Add Client', target: 'clientAdd', primary: true },
          { label: 'Review Invoices', target: 'invoiceAudit' }
        ],
        kpis: [
          { label: 'Active clients', value: '128', trend: '+4 this quarter', tone: 'up' },
          { label: 'Active vendors', value: '84', trend: '+3 this quarter', tone: 'up' },
          { label: 'Vendor consultants', value: '492', trend: '+27 this quarter', tone: 'up' },
          { label: 'W-2 / 1099 resources', value: '215', trend: '142 W-2 · 73 1099', tone: 'neutral' }
        ],
        panels: [
          {
            title: 'Invoices by status — Oct 2026',
            chip: '707 total',
            bars: [
              { label: 'Approved', value: 512, pct: 72, tone: 'approved' },
              { label: 'In Progress (awaiting client invoice)', value: 141, pct: 20, tone: 'progress' },
              { label: 'Rejected', value: 38, pct: 5, tone: 'rejected' },
              { label: 'Not yet submitted', value: 16, pct: 3, tone: 'neutral' }
            ]
          },
          {
            title: 'Expiring in the next 30 days',
            chip: '20 documents',
            items: [
              { label: sub('COI — Coral Staffing LLC', 'Vendor document'), value: b('Expiring Soon'), meta: 'Nov 25' },
              { label: sub('Work authorization — Deepa Kumar', 'Consultant · Coral Staffing'), value: b('Expiring Soon'), meta: 'Nov 30' },
              { label: sub('MSA — Blue Harbor Health', 'Client document'), value: b('Expiring Soon'), meta: 'Dec 09' },
              { label: sub('PO — Summit IT Solutions', 'Vendor document'), value: b('Expiring Soon'), meta: 'Dec 04' }
            ]
          }
        ],
        activity: [
          { who: 'Alicia Ross', what: 'uploaded Oct 2026 client invoices for <b>Blue Harbor Health</b> (2 of 5 people)', when: '12 min ago' },
          { who: 'System', what: 'auto-rejected <b>INV-2026-10-0187</b> (Kevin Singh) — hours mismatch', when: '12 min ago' },
          { who: 'Daniel Ortiz', what: 'added consultant <b>Priya Shah</b> to Coral Staffing LLC', when: '39 min ago' },
          { who: 'Benjamin Cole', what: 'onboarded vendor <b>Keystone Tech Partners</b>', when: '2 hrs ago' },
          { who: 'Arun Krishnan', what: 'renewed MSA for <b>Apex Systems</b> through Jan 30, 2028', when: 'Yesterday' }
        ]
      },
      {
        id: 'clients',
        title: 'Client Management',
        description: 'Every client, its assigned account manager, and MSA coverage.',
        actions: [{ label: 'Add Client', target: 'clientAdd', primary: true }],
        table: {
          title: 'All clients',
          total: 128,
          headers: ['Client', 'Region', 'Account Manager', 'MSA Expiry', 'Client invoice status', 'Actions'],
          rows: [
            [sub('Northwind Labs', 'USD · America/New_York'), 'US-East', 'Alicia Ross', 'Feb 12, 2027', b('Uploaded'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">View / Edit</button><button class="link-btn" data-target="clientHolidayCalendar">Holiday Calendar</button>${clientInvoiceAction('Northwind Labs')}</div>`],
            [sub('Apex Systems', 'USD · America/Los_Angeles'), 'US-West', 'Benjamin Cole', 'Jan 30, 2028', b('Uploaded'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">View / Edit</button><button class="link-btn" data-target="clientHolidayCalendar">Holiday Calendar</button>${clientInvoiceAction('Apex Systems')}</div>`],
            [sub('Blue Harbor Health', 'USD · America/Chicago'), 'Central', 'Alicia Ross', `Dec 09, 2026 ${b('Expiring Soon')}`, `${b('In Progress')} <span class="person-sub inline">2 of 5</span>`, `<div class="row-actions"><button class="link-btn" data-target="clientEdit">View / Edit</button><button class="link-btn" data-target="clientHolidayCalendar">Holiday Calendar</button>${clientInvoiceAction('Blue Harbor Health')}</div>`],
            [sub('GlobalCare Insurance', 'USD · America/New_York'), 'US-East', 'Priya Natarajan', 'Jun 30, 2027', b('Pending'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">View / Edit</button><button class="link-btn" data-target="clientHolidayCalendar">Holiday Calendar</button>${clientInvoiceAction('GlobalCare Insurance')}</div>`],
            [sub('Meridian Retail Group', 'CAD · America/Toronto'), 'Canada', 'Alicia Ross', 'Mar 31, 2027', b('Pending'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">View / Edit</button><button class="link-btn" data-target="clientHolidayCalendar">Holiday Calendar</button>${clientInvoiceAction('Meridian Retail Group')}</div>`],
            [sub('Helix Biotech', 'USD · America/Denver'), 'Mountain', 'Benjamin Cole', `Oct 31, 2026 ${b('Expired')}`, b('Missing'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">View / Edit</button><button class="link-btn" data-target="clientHolidayCalendar">Holiday Calendar</button>${clientInvoiceAction('Helix Biotech')}</div>`]
          ]
        }
      },
      {
        id: 'clientAdd',
        parent: 'clients',
        title: 'Add Client',
        description: 'Create a client, assign its account manager and upload the MSA.',
        form: {
          sections: [
            {
              title: 'Client details',
              fields: [
                { label: 'Client name', value: 'Lakeshore Financial', required: true },
                { label: 'Billing email', value: 'ap@lakeshorefinancial.com', required: true },
                { label: 'Address', value: '200 N LaSalle St, Suite 1400, Chicago, IL 60601', full: true },
                { label: 'Currency', type: 'select', options: ['USD — US Dollar', 'CAD — Canadian Dollar'] },
                { label: 'Time zone', type: 'select', options: ['America/Chicago (CST)', 'America/New_York (EST)', 'America/Los_Angeles (PST)'] },
                { label: 'Account manager', type: 'select', options: ['Alicia Ross', 'Benjamin Cole', 'Priya Natarajan'], required: true }
              ]
            },
            {
              title: 'Holiday calendar',
              hint: 'Select up to 10 holidays. 7 of 10 selected.',
              fields: [
                { type: 'chips', full: true, options: ['Jan 1 · New Year’s Day', 'May 25 · Memorial Day', 'Jul 3 · Independence Day (obs.)', 'Sep 7 · Labor Day', 'Nov 26 · Thanksgiving', 'Nov 27 · Day after Thanksgiving', 'Dec 25 · Christmas Day'] }
              ]
            },
            {
              title: 'Master Services Agreement',
              fields: [
                { label: 'MSA start date', type: 'date', value: '2026-12-01', required: true },
                { label: 'MSA end date', type: 'date', value: '2028-11-30', required: true },
                { label: 'MSA document', type: 'upload', full: true, file: 'Lakeshore_MSA_signed.pdf', size: '1.8 MB' }
              ]
            }
          ],
          submit: { label: 'Save Client', target: 'clients' },
          cancel: { label: 'Cancel', target: 'clients' }
        }
      },
      {
        id: 'clientEdit',
        parent: 'clients',
        title: 'Edit Client',
        description: 'Review and update the client profile, account assignment and holiday schedule.',
        form: {
          sections: [
            {
              title: 'Client details',
              fields: [
                { label: 'Client name', value: 'Lakeshore Financial', required: true },
                { label: 'Billing email', value: 'ap@lakeshorefinancial.com', required: true },
                { label: 'Address', value: '200 N LaSalle St, Suite 1400, Chicago, IL 60601', full: true },
                { label: 'Currency', type: 'select', options: ['USD — US Dollar', 'CAD — Canadian Dollar'] },
                { label: 'Time zone', type: 'select', options: ['America/Chicago (CST)', 'America/New_York (EST)', 'America/Los_Angeles (PST)'] },
                { label: 'Account manager', type: 'select', options: ['Alicia Ross', 'Benjamin Cole', 'Priya Natarajan'], required: true }
              ]
            },
            {
              title: 'Holiday calendar',
              hint: 'Select up to 10 holidays. 7 of 10 selected.',
              fields: [
                { type: 'chips', full: true, options: ['Jan 1 · New Year’s Day', 'May 25 · Memorial Day', 'Jul 3 · Independence Day (obs.)', 'Sep 7 · Labor Day', 'Nov 26 · Thanksgiving', 'Nov 27 · Day after Thanksgiving', 'Dec 25 · Christmas Day'] }
              ]
            },
            {
              title: 'Master Services Agreement',
              fields: [
                { label: 'MSA start date', type: 'date', value: '2026-12-01', required: true },
                { label: 'MSA end date', type: 'date', value: '2028-11-30', required: true },
                { label: 'MSA document', type: 'upload', full: true, file: 'Lakeshore_MSA_signed.pdf', size: '1.8 MB' }
              ]
            }
          ],
          submit: { label: 'Save Client', target: 'clients' },
          cancel: { label: 'Cancel', target: 'clients' },
          delete: { label: 'Delete Client', target: 'clients' }
        }
      },
      {
        id: 'clientHolidayCalendar',
        parent: 'clients',
        title: 'Holiday Calendar',
        description: 'Holidays mapped for Lakeshore Financial. These are used to calculate project working days and client-specific availability.',
        table: {
          title: 'Lakeshore Financial · Holiday list',
          total: 7,
          headers: ['Holiday', 'Date', 'Type', 'Status'],
          rows: [
            ['New Year’s Day', 'Jan 1, 2027', 'Observed holiday', b('Active')],
            ['Memorial Day', 'May 25, 2027', 'Federal holiday', b('Active')],
            ['Independence Day', 'Jul 3, 2027', 'Observed holiday', b('Active')],
            ['Labor Day', 'Sep 7, 2027', 'Federal holiday', b('Active')],
            ['Thanksgiving', 'Nov 26, 2027', 'Client holiday', b('Active')],
            ['Day after Thanksgiving', 'Nov 27, 2027', 'Client holiday', b('Active')],
            ['Christmas Day', 'Dec 25, 2027', 'Federal holiday', b('Active')]
          ]
        }
      },
      {
        id: 'invoiceUpload',
        title: 'Invoice Management',
        description: 'Upload each client’s monthly invoice and billable hours per person. Saving triggers reconciliation automatically.',
        filters: [
          { label: 'Client', options: ['Blue Harbor Health', 'Northwind Labs', 'Meridian Retail Group', 'Lumen Logistics'] },
          { label: 'Billing period', options: ['October 2026', 'September 2026', 'August 2026'] }
        ],
        table: {
          title: 'Blue Harbor Health · October 2026',
          chip: '5 people · 3 awaiting client invoice',
          noSearch: true,
          headers: ['Person', 'Type', 'Submitted Hours', 'Client Invoice', 'Client Billable Hours', 'Submission'],
          rows: [
            [person('Deepa Kumar', 'Coral Staffing'), 'Consultant', '160', fileChip('BH-Oct26-Kumar.pdf', '420 KB'), '<input class="cell-input" value="168" />', b('Rejected')],
            [person('Kevin Singh', 'Summit IT'), 'Consultant', '160', fileChip('BH-Oct26-Singh.pdf', '418 KB'), '<input class="cell-input" value="152" />', b('Rejected')],
            [person('Lena Fischer', 'Summit IT'), 'Consultant', '168', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')],
            [person('Omar Haddad', 'Coral Staffing'), 'Consultant', '144', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')],
            [person('Grace Liu', 'W-2'), 'W-2', '168', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')]
          ]
        },
        footerActions: [
          { label: 'Save & Reconcile', target: 'reconciliation', primary: true },
          { label: 'Save Draft', target: 'invoiceUpload' }
        ]
      },
      {
        id: 'vendors',
        title: 'Vendor Management',
        description: 'All vendors, their account manager and onboarding document status.',
        actions: [{ label: 'Add Vendor', target: 'vendorAdd', primary: true }],
        table: {
          title: 'All vendors',
          total: 84,
          headers: ['Vendor', 'Account Manager', 'Consultants', 'Status', 'Actions'],
          rows: [
            [sub('Coral Staffing LLC', 'Austin, TX'), 'Alicia Ross', '12', b('Active'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('Ridgeline Talent Group', 'Charlotte, NC'), 'Benjamin Cole', '4', b('Onboarding'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('BluePeak Consulting Inc.', 'Denver, CO'), 'Benjamin Cole', '8', b('Active'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('Summit IT Solutions', 'Edison, NJ'), 'Alicia Ross', '19', b('Active'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('Keystone Tech Partners', 'Pittsburgh, PA'), 'Priya Natarajan', '0', b('Invited'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('Orbit Systems Group', 'San Jose, CA'), 'Priya Natarajan', '6', b('Inactive'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`]
          ]
        }
      },
      {
        id: 'vendorEdit',
        parent: 'vendors',
        title: 'Edit Vendor',
        description: 'Update vendor profile details and the vendor’s account manager.',
        form: {
          sections: [
            {
              title: 'Company',
              fields: [
                { label: 'Vendor name', value: 'Coral Staffing LLC', readonly: true, lock: 'Admin-managed' },
                { label: 'Federal ID (EIN)', value: '74-3029118', readonly: true, lock: 'Admin-managed' },
                { label: 'Email', value: 'ap@coralstaffing.com', readonly: true, lock: 'Admin-managed' },
                { label: 'State of incorporation', value: 'Texas', readonly: true, lock: 'Admin-managed' },
                { label: 'Address', value: '401 Congress Ave, Suite 1540, Austin, TX 78701', full: true },
                { label: 'Phone', value: '(512) 555-0136' },
                { label: 'Account manager', type: 'select', options: ['Alicia Ross', 'Benjamin Cole', 'Priya Natarajan'], required: true }
              ]
            },
            {
              title: 'Authorized signatory',
              fields: [
                { label: 'Name', value: 'Daniel Ortiz' },
                { label: 'Phone', value: '(512) 555-0161' }
              ]
            }
          ],
          submit: { label: 'Save Changes', target: 'vendors' },
          cancel: { label: 'Cancel', target: 'vendors' }
        }
      },
      {
        id: 'vendorInvoices',
        parent: 'vendors',
        title: 'Vendor Invoices',
        description: 'Lists of invoices submitted by the selected vendor for reconciliation and payment review.',
        table: {
          title: 'Coral Staffing LLC · Invoices',
          total: 12,
          headers: ['Invoice #', 'Consultant', 'Client', 'Hours', 'Amount', 'Submitted', 'Status', 'Actions'],
          rows: [
            [mono('INV-2026-10-0203'), person('Deepa Kumar'), 'Blue Harbor Health', '160', '$12,800.00', 'Nov 3', b('Rejected'), '<button class="link-btn" data-target="rejectedInvoice">Correct</button>'],
            [mono('INV-2026-10-0142'), person('Rinaldo Silva'), 'Apex Systems', '168', '$12,096.00', 'Nov 4 (v2)', b('Approved'), acts('View')],
            [mono('INV-2026-10-0198'), person('Omar Haddad'), 'Blue Harbor Health', '144', '$12,096.00', 'Nov 3', b('In Progress'), acts('View')],
            [mono('INV-2026-10-0176'), person('Sofia Marin'), 'Meridian Retail Group', '168', '$12,768.00', 'Nov 2', b('In Progress'), acts('View')]
          ]
        }
      },
      {
        id: 'vendorConsultants',
        parent: 'vendors',
        title: 'Vendor Consultants',
        description: 'Consultants associated with the selected vendor and their current client engagements.',
        table: {
          title: 'Coral Staffing consultants',
          total: 12,
          headers: ['Consultant', 'Client', 'Hourly Rate', 'Engagement', 'Location', 'Status', 'Actions'],
          rows: [
            [person('Deepa Kumar', 'Business Analyst'), 'Blue Harbor Health', '$80.00', 'Jan 12 – Dec 31, 2026', 'Hybrid', b('Active'), acts('View', 'Edit')],
            [person('Rinaldo Silva', 'QA Engineer'), 'Apex Systems', '$72.00', 'Sep 14, 2026 – Mar 12, 2027', 'Remote', b('Active'), acts('View', 'Edit')],
            [person('Omar Haddad', 'DevOps Engineer'), 'Blue Harbor Health', '$84.00', 'Feb 2, 2026 – Jan 29, 2027', 'Onsite', b('Active'), acts('View', 'Edit')],
            [person('Sofia Marin', 'Scrum Master'), 'Meridian Retail Group', '$76.00', 'May 4, 2026 – Nov 27, 2026', 'Remote', b('Active'), acts('View', 'Edit')],
            [person('Priya Shah', 'Data Engineer'), 'Meridian Retail Group', '$88.00', 'Nov 16, 2026 – May 14, 2027', 'Remote', b('Onboarding'), acts('View', 'Edit')]
          ]
        }
      },
      {
        id: 'vendorAdd',
        parent: 'vendors',
        title: 'Add Vendor',
        description: 'Create the vendor record. A single-use magic link (valid 72 h) is emailed on save.',
        form: {
          sections: [
            {
              title: 'Company',
              fields: [
                { label: 'Vendor name', value: 'Harborview Staffing LLC', required: true },
                { label: 'Federal ID (EIN)', value: '47-2810356', required: true },
                { label: 'Email', value: 'contracts@harborviewstaffing.com', required: true },
                { label: 'Phone', value: '(617) 555-0142' },
                { label: 'Address', value: '75 State St, Floor 9, Boston, MA 02109', full: true },
                { label: 'State of incorporation', type: 'select', options: ['Massachusetts', 'Delaware', 'New York'] },
                { label: 'Account manager', type: 'select', options: ['Alicia Ross', 'Benjamin Cole', 'Priya Natarajan'], required: true }
              ]
            },
            {
              title: 'Authorized signatory',
              fields: [
                { label: 'Name', value: 'Rachel Moreno' },
                { label: 'Phone', value: '(617) 555-0198' }
              ]
            },
            {
              title: 'Onboarding documents',
              hint: 'Documents not uploaded now are marked Incomplete in the Document Tracker.',
              fields: [
                { label: 'MSA (Nov 15, 2026 – Nov 14, 2028)', type: 'upload', file: 'Harborview_MSA.pdf', size: '2.1 MB' },
                { label: 'PO (Nov 15, 2026 – May 14, 2027)', type: 'upload', file: 'PO-44120.pdf', size: '340 KB' },
                { label: 'W-9', type: 'upload', file: 'Harborview_W9_2026.pdf', size: '210 KB' },
                { label: 'COI', type: 'upload' },
                { label: 'ACH form', type: 'upload' }
              ]
            }
          ],
          submit: { label: 'Save & Send Invite', target: 'vendors' },
          cancel: { label: 'Cancel', target: 'vendors' }
        }
      },
      {
        id: 'teamMembers',
        title: 'Team Members',
        description: 'Vendor consultants plus in-house W-2 and 1099 resources, per client engagement.',
        actions: [{ label: 'Add Resource', target: 'resourceAdd', primary: true }],
        table: {
          title: 'All team members',
          total: 707,
          headers: ['Name', 'Type', 'Client', 'Hourly Rate', 'Engagement', 'Status', 'Actions'],
          rows: [
            [person('Maya Reed', 'Data Analyst'), 'W-2', 'Northwind Labs', '$62.00', 'Mar 2, 2026 – Feb 26, 2027', b('Active'), acts('View')],
            [person('Jordan Blake', 'UX Consultant'), '1099', 'Northwind Labs', '$90.00', 'Jul 6, 2026 – Jan 8, 2027', b('Active'), acts('View')],
            [person('Deepa Kumar', 'Business Analyst · Coral Staffing'), 'Consultant', 'Blue Harbor Health', '$80.00', 'Jan 12, 2026 – Dec 31, 2026', b('Active'), acts('View')],
            [person('Rinaldo Silva', 'QA Engineer · Coral Staffing'), 'Consultant', 'Apex Systems', '$72.00', 'Sep 14, 2026 – Mar 12, 2027', b('Active'), acts('View')],
            [person('Kevin Singh', 'Java Developer · Summit IT'), 'Consultant', 'Blue Harbor Health', '$85.00', 'Apr 1, 2026 – Mar 31, 2027', b('Active'), acts('View')],
            [person('Priya Shah', 'Data Engineer · Coral Staffing'), 'Consultant', 'Meridian Retail Group', '$88.00', 'Nov 16, 2026 – May 14, 2027', b('Onboarding'), acts('View')]
          ]
        }
      },
      {
        id: 'resourceAdd',
        parent: 'teamMembers',
        title: 'Add Resource',
        description: 'Add a W-2 or 1099 resource with personal, engagement and payment details.',
        form: {
          sections: [
            {
              title: 'Resource type',
              fields: [{ type: 'segmented', full: true, options: ['W-2 Employee', '1099 Contractor'], selected: 0 }]
            },
            {
              title: 'Personal details',
              fields: [
                { label: 'Full name', value: 'Samuel Okafor', required: true },
                { label: 'SSN', value: '•••-••-4417', required: true },
                { label: 'Email', value: 'samuel.okafor@gmail.com', required: true },
                { label: 'Phone', value: '(312) 555-0173' },
                { label: 'Address', value: '1840 W Division St, Apt 3R, Chicago, IL 60622', full: true }
              ]
            },
            {
              title: 'Engagement',
              fields: [
                { label: 'Client', type: 'select', options: ['Blue Harbor Health', 'Northwind Labs', 'Apex Systems'] },
                { label: 'Role', value: 'Cloud Engineer' },
                { label: 'Hourly rate (USD)', value: '68.00' },
                { label: 'Work location', type: 'select', options: ['Hybrid — Chicago, IL', 'Remote', 'Onsite'] },
                { label: 'Start date', type: 'date', value: '2026-12-01' },
                { label: 'End date', type: 'date', value: '2027-11-30' },
                { label: 'Payment term', type: 'select', options: ['Net 15', 'Net 7', 'Net 30', 'Net 45', 'Net 60', 'Immediate', 'Custom'] },
                { label: 'Duration', value: '12 months', readonly: true }
              ]
            }
          ],
          submit: { label: 'Save & Send Invite', target: 'teamMembers' },
          cancel: { label: 'Cancel', target: 'teamMembers' }
        }
      },
      {
        id: 'invoiceAudit',
        title: 'Invoices',
        description: 'All vendor and resource submissions with their reconciliation result. Super Admin can edit any invoice.',
        actions: [{ label: 'Export CSV', target: 'invoiceAudit' }],
        tabs: ['All (707)', 'Approved (512)', 'In Progress (141)', 'Rejected (38)'],
        table: {
          title: 'October 2026 submissions',
          total: 707,
          headers: ['Invoice #', 'Submitted by', 'Client', 'Period', 'Hours (sub / client)', 'Amount', 'Status', 'Actions'],
          rows: [
            [mono('INV-2026-10-0142'), person('Rinaldo Silva', 'Coral Staffing'), 'Apex Systems', 'Oct 2026', '168 / 168', '$12,096.00', b('Approved'), acts('View', 'Edit')],
            [mono('INV-2026-10-0151'), person('Jordan Blake', '1099'), 'Northwind Labs', 'Oct 2026', '152 / —', '$13,680.00', b('In Progress'), acts('View', 'Edit')],
            [mono('INV-2026-10-0187'), person('Kevin Singh', 'Summit IT'), 'Blue Harbor Health', 'Oct 2026', `${diff('160')} / 152`, '$13,600.00', b('Rejected'), acts('View', 'Edit')],
            [mono('TS-2026-10-0093'), person('Maya Reed', 'W-2 · timesheet'), 'Northwind Labs', 'Oct 2026', '168 / 168', '—', b('Approved'), acts('View')],
            [mono('INV-2026-10-0203'), person('Deepa Kumar', 'Coral Staffing'), 'Blue Harbor Health', 'Oct 2026', `${diff('160')} / 168`, '$12,800.00', b('Rejected'), acts('View', 'Edit')],
            [mono('INV-2026-10-0211'), person('Ana Torres', 'BluePeak Consulting'), 'GlobalCare Insurance', 'Oct 2026', '176 / 176', '$15,488.00', b('Approved'), acts('View', 'Edit')]
          ]
        }
      },
      {
        id: 'documentTracker',
        title: 'Document Tracker',
        description: 'Every client, vendor, consultant and resource document. Owners and AMs are alerted 30 days before expiry.',
        tabs: ['All (2,184)', 'Expiring Soon (20)', 'Expired (3)', 'Incomplete (41)'],
        table: {
          title: 'Documents',
          total: 2184,
          headers: ['Document', 'Owner', 'Owner Type', 'Version', 'Expires', 'Status', 'Actions'],
          rows: [
            ['MSA', 'Northwind Labs', 'Client', 'v3', 'Feb 12, 2027', b('Valid'), acts('View')],
            ['COI', 'Coral Staffing LLC', 'Vendor', 'v2', 'Nov 25, 2026', b('Expiring Soon'), acts('View', 'Remind')],
            ['Work authorization (H-1B)', 'Deepa Kumar', 'Consultant', 'v1', 'Nov 30, 2026', b('Expiring Soon'), acts('View', 'Remind')],
            ['MSA', 'Helix Biotech', 'Client', 'v1', 'Oct 31, 2026', b('Expired'), acts('View', 'Remind')],
            ['I-9', 'Maya Reed', 'W-2 Resource', '—', '—', b('Incomplete'), acts('Request')],
            ['E-Verify', 'Ana Torres', 'Consultant', '—', '—', b('Not Applicable'), acts('View')]
          ]
        }
      },
      {
        id: 'audit',
        title: 'Audit Log',
        description: 'Immutable record of every create, update, delete, upload, login and status change. Tax documents retained 7 years.',
        actions: [{ label: 'Export', target: 'audit' }],
        table: {
          title: 'Today — Nov 10, 2026',
          total: 1316,
          headers: ['Time', 'User', 'Action', 'Record', 'Before → After'],
          rows: [
            ['10:12 AM', person('Arun Krishnan', 'Super Admin'), 'Updated client', 'Apex Systems', `MSA end: Jan 30, 2027 → <b>Jan 30, 2028</b>`],
            ['09:58 AM', person('Alicia Ross', 'Account Manager'), 'Uploaded client invoice', 'Blue Harbor Health · Oct 2026', '— → BH-Oct26-Singh.pdf, BH-Oct26-Kumar.pdf'],
            ['09:58 AM', person('System', 'Reconciliation'), 'Status change', 'INV-2026-10-0187', `In Progress → ${b('Rejected')}`],
            ['09:31 AM', person('Daniel Ortiz', 'Vendor · Coral Staffing'), 'Created consultant', 'Priya Shah', '— → Data Engineer, $88.00/hr'],
            ['09:05 AM', person('Priya Natarajan', 'Account Manager'), 'Changed vendor status', 'Orbit Systems Group', `${b('Active')} → ${b('Inactive')}`],
            ['08:47 AM', person('Jordan Blake', '1099 Resource'), 'Login (OTP verified)', 'Session', '—']
          ]
        }
      }
    ]
  },

  /* =============================================================== */
  accountmanager: {
    name: 'Account Manager',
    user: { name: 'Alicia Ross', role: 'Account Manager', email: 'a.ross@arkhyatech.com' },
    notifications: 4,
    nav: [
      { label: 'Dashboard', target: 'dashboard' },
      { label: 'My Clients', target: 'clients' },
      { label: 'My Vendors', target: 'vendorList' },
      { label: 'Team Members', target: 'teamMembers' },
      { label: 'Invoice Management', target: 'invoiceUpload' },
      { label: 'Reconciliation', target: 'reconciliation' },
      { label: 'Document Tracker', target: 'docs' },
      { label: 'Audit Log', target: 'auditLog' }
    ],
    screens: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Your 12 clients and 18 vendors. October 2026 billing closes Nov 15.',
        actions: [
          { label: 'Upload Client Invoice', target: 'invoiceUpload', primary: true },
          { label: 'Review Rejections', target: 'reconciliation' }
        ],
        kpis: [
          { label: 'Assigned clients', value: '12', trend: '+1 this quarter', tone: 'up' },
          { label: 'Vendors in scope', value: '18', trend: '2 onboarding', tone: 'neutral' },
          { label: 'Awaiting client invoice', value: '9', trend: '3 clients outstanding', tone: 'warn' },
          { label: 'Rejected this cycle', value: '4', trend: '−3 vs. September', tone: 'up' }
        ],
        panels: [
          {
            title: 'Needs your attention',
            chip: '3 tasks',
            items: [
              { label: sub('Finish Oct client invoices — Blue Harbor Health', '3 of 5 people still waiting'), value: b('Due'), meta: 'Nov 12' },
              { label: sub('Upload Oct client invoice — Meridian Retail Group', '4 submissions waiting on it'), value: b('Due'), meta: 'Nov 12' },
              { label: sub('COI expiring — Coral Staffing LLC', 'Vendor notified Oct 26'), value: b('Expiring Soon'), meta: 'Nov 25' }
            ]
          },
          {
            title: 'October reconciliation',
            chip: '64 submissions',
            bars: [
              { label: 'Approved', value: 51, pct: 80, tone: 'approved' },
              { label: 'Awaiting client invoice', value: 9, pct: 14, tone: 'progress' },
              { label: 'Rejected', value: 4, pct: 6, tone: 'rejected' }
            ]
          }
        ],
        activity: [
          { who: 'System', what: 'rejected <b>INV-2026-10-0187</b> (Kevin Singh, Blue Harbor) — 160 h submitted vs. 152 h on client invoice', when: '12 min ago' },
          { who: 'Alicia Ross', what: 'uploaded Blue Harbor Health client invoices for Kevin Singh and Deepa Kumar', when: '12 min ago' },
          { who: 'Daniel Ortiz', what: 'resubmitted <b>INV-2026-10-0142</b> (Rinaldo Silva) — now Approved', when: '1 hr ago' },
          { who: 'Maya Reed', what: 'submitted October timesheet (168 h)', when: 'Yesterday' }
        ]
      },
      {
        id: 'clients',
        title: 'My Clients',
        description: 'Clients assigned to you and the people working on each.',
        table: {
          title: 'Assigned clients',
          total: 12,
          headers: ['Client', 'Region', 'Vendors', 'People', 'MSA Expiry', 'Client invoice status', 'Actions'],
          rows: [
            [sub('Northwind Labs', 'America/New_York'), 'US-East', '3', '9', 'Feb 12, 2027', b('Uploaded'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">Open</button><button class="link-btn" data-target="clientHolidayCalendar">Holidays</button>${clientInvoiceAction('Northwind Labs')}</div>`],
            [sub('Blue Harbor Health', 'America/Chicago'), 'Central', '2', '5', `Dec 09, 2026 ${b('Expiring Soon')}`, `${b('In Progress')} <span class="person-sub inline">2 of 5</span>`, `<div class="row-actions"><button class="link-btn" data-target="clientEdit">Open</button><button class="link-btn" data-target="clientHolidayCalendar">Holidays</button>${clientInvoiceAction('Blue Harbor Health')}</div>`],
            [sub('Meridian Retail Group', 'America/Toronto'), 'Canada', '2', '4', 'Mar 31, 2027', b('Pending'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">Open</button><button class="link-btn" data-target="clientHolidayCalendar">Holidays</button>${clientInvoiceAction('Meridian Retail Group')}</div>`],
            [sub('Lumen Logistics', 'America/New_York'), 'US-East', '1', '3', 'Aug 15, 2027', b('Uploaded'), `<div class="row-actions"><button class="link-btn" data-target="clientEdit">Open</button><button class="link-btn" data-target="clientHolidayCalendar">Holidays</button>${clientInvoiceAction('Lumen Logistics')}</div>`]
          ]
        }
      },
      {
        id: 'vendorList',
        title: 'My Vendors',
        description: 'Vendors assigned to you. You can onboard new vendors and update their details.',
        actions: [{ label: 'Add Vendor', target: 'vendorAdd', primary: true }],
        table: {
          title: 'Assigned vendors',
          total: 18,
          headers: ['Vendor', 'Primary Contact', 'Consultants', 'Clients', 'Status', 'Actions'],
          rows: [
            [sub('Coral Staffing LLC', 'Austin, TX'), sub('Daniel Ortiz', 'd.ortiz@coralstaffing.com'), '12', 'Blue Harbor, Apex, Meridian', b('Active'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('Summit IT Solutions', 'Edison, NJ'), sub('Ravi Menon', 'ravi@summitits.com'), '19', 'Blue Harbor, Northwind', b('Active'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('Ridgeline Talent Group', 'Charlotte, NC'), sub('Megan Price', 'mprice@ridgelinetalent.com'), '4', 'Northwind Labs', b('Onboarding'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`],
            [sub('Cascade Data Partners', 'Seattle, WA'), sub('Tom Hughes', 'tom@cascadedata.io'), '2', 'Lumen Logistics', b('Active'), `<div class="row-actions"><button class="link-btn" data-target="vendorEdit">View / Edit</button><button class="link-btn" data-target="vendorInvoices">Vendor Invoice</button><button class="link-btn" data-target="vendorConsultants">Consultants</button></div>`]
          ]
        }
      },
      {
        id: 'vendorEdit',
        parent: 'vendorList',
        title: 'Edit Vendor',
        description: 'Update vendor profile details and the vendor’s account manager.',
        form: {
          sections: [
            {
              title: 'Company',
              fields: [
                { label: 'Vendor name', value: 'Coral Staffing LLC', readonly: true, lock: 'Admin-managed' },
                { label: 'Federal ID (EIN)', value: '74-3029118', readonly: true, lock: 'Admin-managed' },
                { label: 'Email', value: 'ap@coralstaffing.com', readonly: true, lock: 'Admin-managed' },
                { label: 'State of incorporation', value: 'Texas', readonly: true, lock: 'Admin-managed' },
                { label: 'Address', value: '401 Congress Ave, Suite 1540, Austin, TX 78701', full: true },
                { label: 'Phone', value: '(512) 555-0136' },
                { label: 'Account manager', type: 'select', options: ['Alicia Ross', 'Benjamin Cole', 'Priya Natarajan'], required: true }
              ]
            },
            {
              title: 'Authorized signatory',
              fields: [
                { label: 'Name', value: 'Daniel Ortiz' },
                { label: 'Phone', value: '(512) 555-0161' }
              ]
            }
          ],
          submit: { label: 'Save Changes', target: 'vendorList' },
          cancel: { label: 'Cancel', target: 'vendorList' }
        }
      },
      {
        id: 'vendorInvoices',
        parent: 'vendorList',
        title: 'Vendor Invoices',
        description: 'Lists of invoices submitted by the selected vendor for reconciliation and payment review.',
        table: {
          title: 'Coral Staffing LLC · Invoices',
          total: 12,
          headers: ['Invoice #', 'Consultant', 'Client', 'Hours', 'Amount', 'Submitted', 'Status', 'Actions'],
          rows: [
            [mono('INV-2026-10-0203'), person('Deepa Kumar'), 'Blue Harbor Health', '160', '$12,800.00', 'Nov 3', b('Rejected'), '<button class="link-btn" data-target="rejectedInvoice">Correct</button>'],
            [mono('INV-2026-10-0142'), person('Rinaldo Silva'), 'Apex Systems', '168', '$12,096.00', 'Nov 4 (v2)', b('Approved'), acts('View')],
            [mono('INV-2026-10-0198'), person('Omar Haddad'), 'Blue Harbor Health', '144', '$12,096.00', 'Nov 3', b('In Progress'), acts('View')],
            [mono('INV-2026-10-0176'), person('Sofia Marin'), 'Meridian Retail Group', '168', '$12,768.00', 'Nov 2', b('In Progress'), acts('View')]
          ]
        }
      },
      {
        id: 'vendorConsultants',
        parent: 'vendorList',
        title: 'Vendor Consultants',
        description: 'Consultants associated with the selected vendor and their current client engagements.',
        actions: [{ label: 'Add Consultant', target: 'consultantAdd', primary: true }],
        table: {
          title: 'Coral Staffing consultants',
          total: 12,
          headers: ['Consultant', 'Client', 'Hourly Rate', 'Engagement', 'Location', 'Status', 'Actions'],
          rows: [
            [person('Deepa Kumar', 'Business Analyst'), 'Blue Harbor Health', '$80.00', 'Jan 12 – Dec 31, 2026', 'Hybrid', b('Active'), acts('View', 'Edit')],
            [person('Rinaldo Silva', 'QA Engineer'), 'Apex Systems', '$72.00', 'Sep 14, 2026 – Mar 12, 2027', 'Remote', b('Active'), acts('View', 'Edit')],
            [person('Omar Haddad', 'DevOps Engineer'), 'Blue Harbor Health', '$84.00', 'Feb 2, 2026 – Jan 29, 2027', 'Onsite', b('Active'), acts('View', 'Edit')],
            [person('Sofia Marin', 'Scrum Master'), 'Meridian Retail Group', '$76.00', 'May 4, 2026 – Nov 27, 2026', 'Remote', b('Active'), acts('View', 'Edit')],
            [person('Priya Shah', 'Data Engineer'), 'Meridian Retail Group', '$88.00', 'Nov 16, 2026 – May 14, 2027', 'Remote', b('Onboarding'), acts('View', 'Edit')]
          ]
        }
      },
      {
        id: 'consultantAdd',
        parent: 'vendorConsultants',
        title: 'Add Consultant',
        description: 'Add a consultant and their first client engagement.',
        form: {
          sections: [
            {
              title: 'Consultant & engagement',
              fields: [
                { label: 'Consultant name', value: 'Marcus Lee', required: true },
                { label: 'Role', value: 'Salesforce Developer', required: true },
                { label: 'Client', type: 'select', options: ['Apex Systems', 'Blue Harbor Health', 'Meridian Retail Group'], required: true },
                { label: 'Hourly rate (USD)', value: '92.00', required: true },
                { label: 'Start date', type: 'date', value: '2026-12-07' },
                { label: 'End date', type: 'date', value: '2027-06-04' },
                { label: 'Duration', value: '26 weeks', readonly: true },
                { label: 'Work location', type: 'select', options: ['Remote', 'Hybrid — San Francisco, CA', 'Onsite'] }
              ]
            },
            {
              title: 'Documents',
              hint: 'PDF, DOCX, JPG or PNG · max 5 MB each. Missing documents can be added later.',
              fields: [
                { label: 'Resume', type: 'upload', file: 'Marcus_Lee_Resume.pdf', size: '186 KB' },
                { label: 'Work authorization (start / end date)', type: 'upload', file: 'Lee_EAD_2026.pdf', size: '1.2 MB' },
                { label: 'I-9 audit report', type: 'upload' },
                { label: 'E-Verify document', type: 'upload' }
              ]
            }
          ],
          submit: { label: 'Save Consultant', target: 'vendorConsultants' },
          cancel: { label: 'Cancel', target: 'vendorConsultants' }
        }
      },
      {
        id: 'teamMembers',
        title: 'Team Members',
        description: 'Consultants and resources working on your clients.',
        actions: [{ label: 'Add Resource', target: 'resourceAdd', primary: true }],
        table: {
          title: 'People on your clients',
          total: 23,
          headers: ['Name', 'Type', 'Client', 'Hourly Rate', 'Oct Submission', 'Status'],
          rows: [
            [person('Maya Reed', 'Data Analyst'), 'W-2', 'Northwind Labs', '$62.00', b('Approved'), b('Active')],
            [person('Jordan Blake', 'UX Consultant'), '1099', 'Northwind Labs', '$90.00', b('In Progress'), b('Active')],
            [person('Deepa Kumar', 'Business Analyst · Coral Staffing'), 'Consultant', 'Blue Harbor Health', '$80.00', b('Rejected'), b('Active')],
            [person('Kevin Singh', 'Java Developer · Summit IT'), 'Consultant', 'Blue Harbor Health', '$85.00', b('Rejected'), b('Active')],
            [person('Priya Shah', 'Data Engineer · Coral Staffing'), 'Consultant', 'Meridian Retail Group', '$88.00', b('Not Started'), b('Onboarding')]
          ]
        }
      },
      {
        id: 'invoiceUpload',
        title: 'Invoice Management',
        description: 'Upload each client’s monthly invoice and billable hours per person. Saving triggers reconciliation automatically.',
        filters: [
          { label: 'Client', options: ['Blue Harbor Health', 'Northwind Labs', 'Meridian Retail Group', 'Lumen Logistics'] },
          { label: 'Billing period', options: ['October 2026', 'September 2026', 'August 2026'] }
        ],
        table: {
          title: 'Blue Harbor Health · October 2026',
          chip: '5 people · 3 awaiting client invoice',
          noSearch: true,
          headers: ['Person', 'Type', 'Submitted Hours', 'Client Invoice', 'Client Billable Hours', 'Submission'],
          rows: [
            [person('Deepa Kumar', 'Coral Staffing'), 'Consultant', '160', fileChip('BH-Oct26-Kumar.pdf', '420 KB'), '<input class="cell-input" value="168" />', b('Rejected')],
            [person('Kevin Singh', 'Summit IT'), 'Consultant', '160', fileChip('BH-Oct26-Singh.pdf', '418 KB'), '<input class="cell-input" value="152" />', b('Rejected')],
            [person('Lena Fischer', 'Summit IT'), 'Consultant', '168', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')],
            [person('Omar Haddad', 'Coral Staffing'), 'Consultant', '144', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')],
            [person('Grace Liu', 'W-2'), 'W-2', '168', '<button class="upload-mini">Upload</button>', '<input class="cell-input" placeholder="0" />', b('Awaiting Client Invoice')]
          ]
        },
        footerActions: [
          { label: 'Save & Reconcile', target: 'reconciliation', primary: true },
          { label: 'Save Draft', target: 'invoiceUpload' }
        ]
      },
      {
        id: 'reconciliation',
        title: 'Reconciliation',
        description: 'Automatic match of each submission against the client invoice on billing period and total hours.',
        tabs: ['All (64)', 'Approved (51)', 'Awaiting Client Invoice (9)', 'Rejected (4)'],
        table: {
          title: 'October 2026',
          total: 64,
          headers: ['Person', 'Client', 'Period', 'Submitted', 'Client Invoice', 'Result', 'Reason'],
          rows: [
            [person('Maya Reed', 'W-2'), 'Northwind Labs', 'Oct 2026', '168 h', '168 h', b('Approved'), '—'],
            [person('Rinaldo Silva', 'Coral Staffing'), 'Apex Systems', 'Oct 2026', '168 h', '168 h', b('Approved'), 'Matched on resubmission (v2)'],
            [person('Jordan Blake', '1099'), 'Northwind Labs', 'Oct 2026', '152 h', '—', b('Awaiting Client Invoice'), '—'],
            [person('Kevin Singh', 'Summit IT'), 'Blue Harbor Health', 'Oct 2026', diff('160 h'), '152 h', b('Rejected'), 'Total hours: expected 152, submitted 160'],
            [person('Deepa Kumar', 'Coral Staffing'), 'Blue Harbor Health', 'Oct 2026', diff('160 h'), '168 h', b('Rejected'), 'Total hours: expected 168, submitted 160']
          ]
        }
      },
      {
        id: 'docs',
        title: 'Document Tracker',
        description: 'Documents for your clients, vendors and people.',
        tabs: ['All (318)', 'Expiring Soon (6)', 'Expired (0)', 'Incomplete (11)'],
        table: {
          title: 'Documents',
          total: 318,
          headers: ['Document', 'Owner', 'Owner Type', 'Expires', 'Status', 'Actions'],
          rows: [
            ['COI', 'Coral Staffing LLC', 'Vendor', 'Nov 25, 2026', b('Expiring Soon'), acts('View', 'Remind')],
            ['Work authorization (H-1B)', 'Deepa Kumar', 'Consultant', 'Nov 30, 2026', b('Expiring Soon'), acts('View', 'Remind')],
            ['MSA', 'Blue Harbor Health', 'Client', 'Dec 09, 2026', b('Expiring Soon'), acts('View')],
            ['ACH form', 'Ridgeline Talent Group', 'Vendor', '—', b('Incomplete'), acts('Request')],
            ['W-9', 'Summit IT Solutions', 'Vendor', 'Jul 01, 2027', b('Valid'), acts('View')]
          ]
        }
      },
      {
        id: 'auditLog',
        title: 'Audit Log',
        description: 'Activity on your clients, vendors and people.',
        table: {
          title: 'Today — Nov 10, 2026',
          total: 142,
          headers: ['Time', 'User', 'Action', 'Record', 'Before → After'],
          rows: [
            ['09:58 AM', person('Alicia Ross', 'Account Manager'), 'Uploaded client invoice', 'Blue Harbor Health · Oct 2026', '— → BH-Oct26-Singh.pdf, BH-Oct26-Kumar.pdf'],
            ['09:58 AM', person('System', 'Reconciliation'), 'Status change', 'INV-2026-10-0187', `In Progress → ${b('Rejected')}`],
            ['09:31 AM', person('Daniel Ortiz', 'Vendor · Coral Staffing'), 'Created consultant', 'Priya Shah', '— → Data Engineer, $88.00/hr'],
            ['08:56 AM', person('Daniel Ortiz', 'Vendor · Coral Staffing'), 'Resubmitted invoice', 'INV-2026-10-0142 (v2)', 'Hours: 160 → <b>168</b>']
          ]
        }
      }
    ]
  },

  /* =============================================================== */
  vendor: {
    name: 'Vendor',
    user: { name: 'Daniel Ortiz', role: 'Coral Staffing LLC', email: 'd.ortiz@coralstaffing.com' },
    notifications: 3,
    nav: [
      { label: 'Dashboard', target: 'dashboard' },
      { label: 'Consultants', target: 'consultants' },
      { label: 'Invoices', target: 'invoices' },
      { label: 'Submit Invoice', target: 'invoiceSubmit' },
      { label: 'Documents', target: 'docs' },
      { label: 'Company Profile', target: 'profile' }
    ],
    screens: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'Coral Staffing LLC · Account manager: Alicia Ross. October 2026 invoices are due Nov 15.',
        actions: [
          { label: 'Submit Invoice', target: 'invoiceSubmit', primary: true },
          { label: 'Add Consultant', target: 'consultantAdd' }
        ],
        alert: {
          tone: 'danger',
          title: '1 invoice was rejected and needs correction',
          text: 'INV-2026-10-0203 · Deepa Kumar · Blue Harbor Health — total hours do not match the client invoice.',
          action: { label: 'Fix now', target: 'rejectedInvoice' }
        },
        kpis: [
          { label: 'Active consultants', value: '12', trend: '1 starting Nov 16', tone: 'neutral' },
          { label: 'Approved — Oct 2026', value: '8', trend: 'of 12 submitted', tone: 'up' },
          { label: 'Rejected to fix', value: '1', trend: 'Action needed', tone: 'down' },
          { label: 'Expiring documents', value: '2', trend: 'Next: COI · Nov 25', tone: 'warn' }
        ],
        panels: [
          {
            title: 'October 2026 submissions',
            chip: '12 consultants',
            bars: [
              { label: 'Approved', value: 8, pct: 67, tone: 'approved' },
              { label: 'Awaiting client invoice', value: 3, pct: 25, tone: 'progress' },
              { label: 'Rejected', value: 1, pct: 8, tone: 'rejected' }
            ]
          },
          {
            title: 'Documents',
            chip: '4 of 5 valid',
            items: [
              { label: sub('COI', 'Certificate of insurance'), value: b('Expiring Soon'), meta: 'Nov 25' },
              { label: sub('Work authorization — Deepa Kumar', 'Consultant document'), value: b('Expiring Soon'), meta: 'Nov 30' },
              { label: sub('MSA', 'Jan 1, 2026 – Dec 31, 2027'), value: b('Valid'), meta: '' },
              { label: sub('W-9', 'Tax year 2026'), value: b('Valid'), meta: '' }
            ]
          }
        ],
        activity: [
          { who: 'System', what: 'rejected <b>INV-2026-10-0203</b> (Deepa Kumar) — 160 h submitted vs. 168 h on client invoice', when: '12 min ago' },
          { who: 'Daniel Ortiz', what: 'added consultant <b>Priya Shah</b>', when: '39 min ago' },
          { who: 'System', what: 'approved <b>INV-2026-10-0142</b> (Rinaldo Silva) after resubmission', when: '1 hr ago' }
        ]
      },
      {
        id: 'consultants',
        title: 'Consultants',
        description: 'Your consultants and their client engagements.',
        actions: [{ label: 'Add Consultant', target: 'consultantAdd', primary: true }],
        table: {
          title: 'Coral Staffing consultants',
          total: 12,
          headers: ['Consultant', 'Client', 'Hourly Rate', 'Engagement', 'Location', 'Status', 'Actions'],
          rows: [
            [person('Deepa Kumar', 'Business Analyst'), 'Blue Harbor Health', '$80.00', 'Jan 12 – Dec 31, 2026', 'Hybrid', b('Active'), acts('View', 'Edit')],
            [person('Rinaldo Silva', 'QA Engineer'), 'Apex Systems', '$72.00', 'Sep 14, 2026 – Mar 12, 2027', 'Remote', b('Active'), acts('View', 'Edit')],
            [person('Omar Haddad', 'DevOps Engineer'), 'Blue Harbor Health', '$84.00', 'Feb 2, 2026 – Jan 29, 2027', 'Onsite', b('Active'), acts('View', 'Edit')],
            [person('Sofia Marin', 'Scrum Master'), 'Meridian Retail Group', '$76.00', 'May 4, 2026 – Nov 27, 2026', 'Remote', b('Active'), acts('View', 'Edit')],
            [person('Priya Shah', 'Data Engineer'), 'Meridian Retail Group', '$88.00', 'Nov 16, 2026 – May 14, 2027', 'Remote', b('Onboarding'), acts('View', 'Edit')]
          ]
        }
      },
      {
        id: 'consultantAdd',
        parent: 'consultants',
        title: 'Add Consultant',
        description: 'Add a consultant and their first client engagement.',
        form: {
          sections: [
            {
              title: 'Consultant & engagement',
              fields: [
                { label: 'Consultant name', value: 'Marcus Lee', required: true },
                { label: 'Role', value: 'Salesforce Developer', required: true },
                { label: 'Client', type: 'select', options: ['Apex Systems', 'Blue Harbor Health', 'Meridian Retail Group'], required: true },
                { label: 'Hourly rate (USD)', value: '92.00', required: true },
                { label: 'Start date', type: 'date', value: '2026-12-07' },
                { label: 'End date', type: 'date', value: '2027-06-04' },
                { label: 'Duration', value: '26 weeks', readonly: true },
                { label: 'Work location', type: 'select', options: ['Remote', 'Hybrid — San Francisco, CA', 'Onsite'] }
              ]
            },
            {
              title: 'Documents',
              hint: 'PDF, DOCX, JPG or PNG · max 5 MB each. Missing documents can be added later.',
              fields: [
                { label: 'Resume', type: 'upload', file: 'Marcus_Lee_Resume.pdf', size: '186 KB' },
                { label: 'Work authorization (start / end date)', type: 'upload', file: 'Lee_EAD_2026.pdf', size: '1.2 MB' },
                { label: 'I-9 audit report', type: 'upload' },
                { label: 'E-Verify document', type: 'upload' }
              ]
            }
          ],
          submit: { label: 'Save Consultant', target: 'consultants' },
          cancel: { label: 'Cancel', target: 'consultants' }
        }
      },
      {
        id: 'invoices',
        title: 'Invoices',
        description: 'Every invoice you have submitted, with its reconciliation result.',
        actions: [{ label: 'Submit Invoice', target: 'invoiceSubmit', primary: true }],
        tabs: ['All (12)', 'Approved (8)', 'In Progress (3)', 'Rejected (1)'],
        table: {
          title: 'October 2026',
          total: 12,
          headers: ['Invoice #', 'Consultant', 'Client', 'Hours', 'Amount', 'Submitted', 'Status', 'Actions'],
          rows: [
            [mono('INV-2026-10-0203'), person('Deepa Kumar'), 'Blue Harbor Health', '160', '$12,800.00', 'Nov 3', b('Rejected'), '<button class="link-btn" data-target="rejectedInvoice">Correct</button>'],
            [mono('INV-2026-10-0142'), person('Rinaldo Silva'), 'Apex Systems', '168', '$12,096.00', 'Nov 4 (v2)', b('Approved'), acts('View')],
            [mono('INV-2026-10-0198'), person('Omar Haddad'), 'Blue Harbor Health', '144', '$12,096.00', 'Nov 3', b('In Progress'), acts('View')],
            [mono('INV-2026-10-0176'), person('Sofia Marin'), 'Meridian Retail Group', '168', '$12,768.00', 'Nov 2', b('In Progress'), acts('View')]
          ]
        }
      },
      {
        id: 'invoiceSubmit',
        parent: 'invoices',
        title: 'Submit Invoice',
        description: 'One invoice per consultant, client and billing period, with timesheet and evidence.',
        form: {
          sections: [
            {
              title: 'Engagement',
              fields: [
                { label: 'Consultant', type: 'select', options: ['Omar Haddad — Blue Harbor Health', 'Sofia Marin — Meridian Retail Group'], required: true },
                { label: 'Billing period', type: 'select', options: ['October 2026', 'September 2026'], required: true },
                { label: 'Total billed hours', value: '144', required: true },
                { label: 'Hourly rate', value: '$84.00', readonly: true },
                { label: 'Invoice amount (USD)', value: '$12,096.00', readonly: true },
                { label: 'Payment term', value: 'Net 30', readonly: true }
              ]
            },
            {
              title: 'Attachments',
              hint: 'PDF, DOCX, JPG, JPEG or PNG · max 5 MB per file.',
              fields: [
                { label: 'Invoice', type: 'upload', file: 'CS-INV-10482.pdf', size: '212 KB' },
                { label: 'Timesheet', type: 'upload', file: 'Haddad_Oct2026_timesheet.xlsx.pdf', size: '96 KB' },
                { label: 'Evidence (multiple allowed)', type: 'upload', full: true, file: 'BH_portal_approval_Oct.png', size: '640 KB' }
              ]
            }
          ],
          submit: { label: 'Submit for Reconciliation', target: 'invoices' },
          cancel: { label: 'Cancel', target: 'invoices' }
        }
      },
      {
        id: 'rejectedInvoice',
        parent: 'invoices',
        title: 'Correct Rejected Invoice',
        description: 'INV-2026-10-0203 · Deepa Kumar · Blue Harbor Health · October 2026',
        alert: {
          tone: 'danger',
          title: 'Rejected on Nov 10, 2026 at 9:58 AM',
          text: 'Total hours did not match the client invoice uploaded by Alicia Ross. Correct the hours and timesheet, then resubmit. Previous versions are kept in history.'
        },
        table: {
          title: 'Mismatch details',
          noSearch: true,
          headers: ['Field', 'Expected (client invoice)', 'Submitted (v1)', 'Result'],
          rows: [
            ['Billing period', 'October 2026', 'October 2026', b('Matched')],
            ['Total hours', '168', diff('160'), b('Mismatch')]
          ]
        },
        form: {
          sections: [
            {
              title: 'Corrected submission (v2)',
              fields: [
                { label: 'Total billed hours', value: '168', required: true },
                { label: 'Invoice amount (USD)', value: '$13,440.00', readonly: true },
                { label: 'Corrected timesheet', type: 'upload', file: 'Kumar_Oct2026_timesheet_v2.pdf', size: '102 KB' },
                { label: 'Corrected invoice', type: 'upload', file: 'CS-INV-10477-R1.pdf', size: '214 KB' },
                { label: 'Note to account manager', type: 'textarea', full: true, value: 'Timesheet v1 omitted Oct 29–30 (16 h). Corrected timesheet attached, approved by client manager.' }
              ]
            }
          ],
          submit: { label: 'Resubmit', target: 'invoices' },
          cancel: { label: 'Cancel', target: 'invoices' }
        }
      },
      {
        id: 'docs',
        title: 'Documents',
        description: 'Company documents. Replacing a document keeps the earlier version in history.',
        table: {
          title: 'Coral Staffing LLC',
          total: 5,
          headers: ['Document', 'Validity', 'Version', 'Last Updated', 'Status', 'Actions'],
          rows: [
            ['MSA', 'Jan 1, 2026 – Dec 31, 2027', 'v2', 'Jan 3, 2026', b('Valid'), acts('Download', 'Replace')],
            ['PO #PO-38817', 'Jan 1 – Dec 31, 2026', 'v1', 'Jan 3, 2026', b('Valid'), acts('Download', 'Replace')],
            ['W-9', 'Tax year 2026', 'v3', 'Feb 11, 2026', b('Valid'), acts('Download', 'Replace')],
            ['COI', 'Nov 26, 2025 – Nov 25, 2026', 'v2', 'Nov 20, 2025', b('Expiring Soon'), acts('Download', 'Replace')],
            ['ACH form', '—', 'v1', 'Jan 3, 2026', b('Valid'), acts('Download', 'Replace')]
          ]
        }
      },
      {
        id: 'profile',
        title: 'Company Profile',
        description: 'You can update address, phone and authorized signatory. Other fields are managed by your account manager.',
        form: {
          sections: [
            {
              title: 'Company',
              fields: [
                { label: 'Vendor name', value: 'Coral Staffing LLC', readonly: true, lock: 'Admin-managed' },
                { label: 'Federal ID (EIN)', value: '74-3029118', readonly: true, lock: 'Admin-managed' },
                { label: 'Email', value: 'ap@coralstaffing.com', readonly: true, lock: 'Admin-managed' },
                { label: 'State of incorporation', value: 'Texas', readonly: true, lock: 'Admin-managed' },
                { label: 'Address', value: '401 Congress Ave, Suite 1540, Austin, TX 78701', full: true },
                { label: 'Phone', value: '(512) 555-0136' },
                { label: 'Account manager', value: 'Alicia Ross', readonly: true, lock: 'Admin-managed' }
              ]
            },
            {
              title: 'Authorized signatory',
              fields: [
                { label: 'Name', value: 'Daniel Ortiz' },
                { label: 'Phone', value: '(512) 555-0161' }
              ]
            }
          ],
          submit: { label: 'Save Changes', target: 'dashboard' },
          cancel: { label: 'Cancel', target: 'dashboard' }
        }
      }
    ]
  },

  /* =============================================================== */
  w2: {
    name: 'W-2 Resource',
    user: { name: 'Maya Reed', role: 'W-2 Resource', email: 'maya.reed@outlook.com' },
    notifications: 1,
    nav: [
      { label: 'Dashboard', target: 'dashboard' },
      { label: 'My Engagements', target: 'engagements' },
      { label: 'Timesheets', target: 'status' },
      { label: 'Submit Timesheet', target: 'timesheet' },
      { label: 'My Documents', target: 'docs' }
    ],
    screens: [
      {
        id: 'dashboard',
        title: 'Welcome back, Maya',
        description: 'W-2 employees submit a monthly timesheet with evidence. No invoice is needed.',
        actions: [{ label: 'Submit Timesheet', target: 'timesheet', primary: true }],
        alert: {
          tone: 'warning',
          title: 'Your I-9 is incomplete',
          text: 'Upload your I-9 so your onboarding file is complete. Your account manager, Alicia Ross, has been notified.',
          action: { label: 'Upload', target: 'docs' }
        },
        kpis: [
          { label: 'Active engagements', value: '2', trend: 'Northwind · Meridian', tone: 'neutral' },
          { label: 'October timesheets', value: '2 of 2', trend: 'Submitted', tone: 'up' },
          { label: 'Approved this year', value: '17', trend: 'No open rejections', tone: 'up' },
          { label: 'Documents to action', value: '1', trend: 'I-9 incomplete', tone: 'warn' }
        ],
        panels: [
          {
            title: 'Current engagements',
            chip: '2 active',
            items: [
              { label: sub('Northwind Labs', 'Data Analyst · Remote · through Feb 26, 2027'), value: b('Active'), meta: '' },
              { label: sub('Meridian Retail Group', 'Reporting Analyst · part-time · through Dec 18, 2026'), value: b('Active'), meta: '' }
            ]
          },
          {
            title: 'Submission status by month',
            chip: 'Last 3 months',
            items: [
              { label: sub('October 2026', 'Northwind 168 h · Meridian 40 h'), value: b('In Progress'), meta: '' },
              { label: sub('September 2026', 'Northwind 160 h · Meridian 40 h'), value: b('Approved'), meta: '' },
              { label: sub('August 2026', 'Northwind 168 h · Meridian 36 h'), value: b('Approved'), meta: '' }
            ]
          }
        ]
      },
      {
        id: 'engagements',
        title: 'My Engagements',
        description: 'Your active client engagements.',
        table: {
          title: 'Engagements',
          total: 2,
          headers: ['Client', 'Role', 'Location', 'Start', 'End', 'Payment Term', 'Status'],
          rows: [
            ['Northwind Labs', 'Data Analyst', 'Remote', 'Mar 2, 2026', 'Feb 26, 2027', 'Net 15', b('Active')],
            ['Meridian Retail Group', 'Reporting Analyst (part-time)', 'Remote', 'Sep 8, 2026', 'Dec 18, 2026', 'Net 15', b('Active')]
          ]
        }
      },
      {
        id: 'status',
        title: 'Timesheets',
        description: 'Each timesheet is matched against the client invoice hours.',
        actions: [{ label: 'Submit Timesheet', target: 'timesheet', primary: true }],
        table: {
          title: 'Submission history',
          total: 6,
          headers: ['Period', 'Client', 'Hours', 'Evidence', 'Submitted', 'Status'],
          rows: [
            ['October 2026', 'Northwind Labs', '168', fileChip('Reed_Oct26.pdf'), 'Nov 2', b('Approved')],
            ['October 2026', 'Meridian Retail Group', '40', fileChip('Reed_Meridian_Oct26.pdf'), 'Nov 2', b('Awaiting Client Invoice')],
            ['September 2026', 'Northwind Labs', '160', fileChip('Reed_Sep26_v2.pdf'), 'Oct 6 (v2)', b('Approved')],
            ['September 2026', 'Meridian Retail Group', '40', fileChip('Reed_Meridian_Sep26.pdf'), 'Oct 2', b('Approved')]
          ]
        }
      },
      {
        id: 'timesheet',
        parent: 'status',
        title: 'Submit Timesheet',
        description: 'One timesheet per client engagement and month.',
        form: {
          sections: [
            {
              title: 'Timesheet',
              fields: [
                { label: 'Engagement', type: 'select', options: ['Meridian Retail Group — Reporting Analyst', 'Northwind Labs — Data Analyst'], required: true },
                { label: 'Billing period', type: 'select', options: ['November 2026', 'October 2026'], required: true },
                { label: 'Total hours', value: '40', required: true },
                { label: 'Client holidays in period', value: 'Nov 26, Nov 27', readonly: true },
                { label: 'Timesheet', type: 'upload', file: 'Reed_Meridian_Nov26.pdf', size: '88 KB' },
                { label: 'Evidence', type: 'upload', file: 'Meridian_manager_approval.png', size: '410 KB' }
              ]
            }
          ],
          submit: { label: 'Submit Timesheet', target: 'status' },
          cancel: { label: 'Cancel', target: 'status' }
        }
      },
      {
        id: 'docs',
        title: 'My Documents',
        description: 'Onboarding and employment documents on file.',
        table: {
          title: 'Documents',
          total: 8,
          headers: ['Document', 'Last Updated', 'Expires', 'Status', 'Actions'],
          rows: [
            ['W-4', 'Mar 2, 2026', '—', b('Valid'), acts('View')],
            ['I-9', '—', '—', b('Incomplete'), '<button class="btn btn-primary btn-sm">Upload</button>'],
            ['Employment contract', 'Feb 24, 2026', 'Feb 26, 2027', b('Valid'), acts('View')],
            ['ACH form', 'Mar 2, 2026', '—', b('Valid'), acts('View', 'Replace')],
            ['Payslips', 'Nov 6, 2026', '—', b('Uploaded'), acts('View')],
            ['W-2 (year end)', '—', '—', b('Not Applicable'), '<span class="person-sub inline">Available Jan 2027</span>']
          ]
        }
      }
    ]
  },

  /* =============================================================== */
  w9: {
    name: '1099 Resource',
    user: { name: 'Jordan Blake', role: '1099 Resource', email: 'jordan@blakeux.studio' },
    notifications: 2,
    nav: [
      { label: 'Dashboard', target: 'dashboard' },
      { label: 'My Engagements', target: 'engagements' },
      { label: 'Invoices', target: 'status' },
      { label: 'Submit Invoice', target: 'invoiceSubmit' },
      { label: 'My Documents', target: 'docs' }
    ],
    screens: [
      {
        id: 'dashboard',
        title: 'Welcome back, Jordan',
        description: '1099 contractors submit a monthly invoice and timesheet with evidence.',
        actions: [{ label: 'Submit Invoice', target: 'invoiceSubmit', primary: true }],
        alert: {
          tone: 'danger',
          title: 'Your September invoice for Apex Systems was rejected',
          text: 'INV-2026-09-0388 — billing period did not match the client invoice.',
          action: { label: 'Correct invoice', target: 'correction' }
        },
        kpis: [
          { label: 'Active engagements', value: '2', trend: 'Northwind · Apex', tone: 'neutral' },
          { label: 'Billed in October', value: '$22,044', trend: '152 h + 102 h', tone: 'neutral' },
          { label: 'Rejected to fix', value: '1', trend: 'Action needed', tone: 'down' },
          { label: 'Documents', value: 'All valid', trend: '1099 form due Jan 2027', tone: 'up' }
        ],
        panels: [
          {
            title: 'Invoices by month',
            chip: 'Last 3 months',
            items: [
              { label: sub('October 2026', 'Northwind $13,680.00 · Apex $8,364.00'), value: b('In Progress'), meta: '' },
              { label: sub('September 2026', 'Northwind $14,400.00 · Apex $8,856.00'), value: b('Rejected'), meta: '' },
              { label: sub('August 2026', 'Northwind $15,120.00 · Apex $9,184.00'), value: b('Approved'), meta: '' }
            ]
          },
          {
            title: 'Current engagements',
            chip: '2 active',
            items: [
              { label: sub('Northwind Labs', 'UX Consultant · $90.00/hr · Net 15'), value: b('Active'), meta: '' },
              { label: sub('Apex Systems', 'Product Analyst · $82.00/hr · Net 30'), value: b('Active'), meta: '' }
            ]
          }
        ]
      },
      {
        id: 'engagements',
        title: 'My Engagements',
        description: 'Your active 1099 engagements.',
        table: {
          title: 'Engagements',
          total: 2,
          headers: ['Client', 'Job Title', 'Hourly Rate', 'Location', 'Term', 'Payment Term', 'Status'],
          rows: [
            ['Northwind Labs', 'UX Consultant', '$90.00', 'Remote', 'Jul 6, 2026 – Jan 8, 2027', 'Net 15', b('Active')],
            ['Apex Systems', 'Product Analyst', '$82.00', 'Remote', 'Aug 3, 2026 – Feb 5, 2027', 'Net 30', b('Active')]
          ]
        }
      },
      {
        id: 'status',
        title: 'Invoices',
        description: 'Your submitted invoices and their reconciliation result.',
        actions: [{ label: 'Submit Invoice', target: 'invoiceSubmit', primary: true }],
        table: {
          title: 'Invoice history',
          total: 8,
          headers: ['Invoice #', 'Client', 'Period', 'Hours', 'Amount', 'Status', 'Actions'],
          rows: [
            [mono('INV-2026-10-0151'), 'Northwind Labs', 'Oct 2026', '152', '$13,680.00', b('Awaiting Client Invoice'), acts('View')],
            [mono('INV-2026-10-0164'), 'Apex Systems', 'Oct 2026', '102', '$8,364.00', b('Approved'), acts('View')],
            [mono('INV-2026-09-0388'), 'Apex Systems', 'Sep 2026', '108', '$8,856.00', b('Rejected'), '<button class="link-btn" data-target="correction">Correct</button>'],
            [mono('INV-2026-09-0352'), 'Northwind Labs', 'Sep 2026', '160', '$14,400.00', b('Approved'), acts('View')]
          ]
        }
      },
      {
        id: 'invoiceSubmit',
        parent: 'status',
        title: 'Submit Invoice',
        description: 'Invoice and timesheet with evidence, per client engagement and month.',
        form: {
          sections: [
            {
              title: 'Invoice',
              fields: [
                { label: 'Engagement', type: 'select', options: ['Northwind Labs — UX Consultant', 'Apex Systems — Product Analyst'], required: true },
                { label: 'Billing period', type: 'select', options: ['November 2026', 'October 2026'], required: true },
                { label: 'Total billed hours', value: '136', required: true },
                { label: 'Hourly rate', value: '$90.00', readonly: true },
                { label: 'Invoice amount (USD)', value: '$12,240.00', readonly: true },
                { label: 'Payment term', value: 'Net 15', readonly: true }
              ]
            },
            {
              title: 'Attachments',
              hint: 'PDF, DOCX, JPG, JPEG or PNG · max 5 MB per file.',
              fields: [
                { label: 'Invoice', type: 'upload', file: 'BlakeUX-0047.pdf', size: '154 KB' },
                { label: 'Timesheet', type: 'upload' },
                { label: 'Evidence (multiple allowed)', type: 'upload', full: true }
              ]
            }
          ],
          submit: { label: 'Submit Invoice', target: 'status' },
          cancel: { label: 'Cancel', target: 'status' }
        }
      },
      {
        id: 'correction',
        parent: 'status',
        title: 'Correct Rejected Invoice',
        description: 'INV-2026-09-0388 · Apex Systems · Product Analyst',
        alert: {
          tone: 'danger',
          title: 'Rejected on Oct 9, 2026',
          text: 'The billing period on your invoice did not match the client invoice. Correct the period and resubmit. Earlier versions are kept.'
        },
        table: {
          title: 'Mismatch details',
          noSearch: true,
          headers: ['Field', 'Expected (client invoice)', 'Submitted (v1)', 'Result'],
          rows: [
            ['Billing period', 'September 2026', diff('August 2026'), b('Mismatch')],
            ['Total hours', '108', '108', b('Matched')]
          ]
        },
        form: {
          sections: [
            {
              title: 'Corrected submission (v2)',
              fields: [
                { label: 'Billing period', type: 'select', options: ['September 2026', 'August 2026'] },
                { label: 'Total billed hours', value: '108' },
                { label: 'Corrected invoice', type: 'upload', file: 'BlakeUX-0041-R1.pdf', size: '150 KB' },
                { label: 'Timesheet', type: 'upload', file: 'Blake_Apex_Sep26.pdf', size: '92 KB' }
              ]
            }
          ],
          submit: { label: 'Resubmit', target: 'status' },
          cancel: { label: 'Cancel', target: 'status' }
        }
      },
      {
        id: 'docs',
        title: 'My Documents',
        description: 'Tax and contract documents. Tax documents are retained for 7 years.',
        table: {
          title: 'Documents',
          total: 5,
          headers: ['Document', 'Last Updated', 'Expires', 'Status', 'Actions'],
          rows: [
            ['1099 contract — Northwind Labs', 'Jul 1, 2026', 'Jan 8, 2027', b('Signed'), acts('View')],
            ['1099 contract — Apex Systems', 'Jul 28, 2026', 'Feb 5, 2027', b('Signed'), acts('View')],
            ['W-9', 'Jun 30, 2026', '—', b('Valid'), acts('View', 'Replace')],
            ['ACH form', 'Jun 30, 2026', '—', b('Valid'), acts('View', 'Replace')],
            ['1099-NEC (2026)', '—', '—', b('Not Applicable'), '<span class="person-sub inline">Issued by Jan 31, 2027</span>']
          ]
        }
      }
    ]
  }
};

/* Account managers onboard vendors and resources with the same forms,
   pre-assigned to themselves. */
(function shareOnboardingForms() {
  const am = personaConfig.accountmanager;
  const parents = { vendorAdd: 'vendorList', resourceAdd: 'teamMembers' };
  Object.entries(parents).forEach(([id, parent]) => {
    const source = personaConfig.superadmin.screens.find((s) => s.id === id);
    const copy = JSON.parse(JSON.stringify(source));
    copy.parent = parent;
    copy.form.submit.target = parent;
    copy.form.cancel.target = parent;
    copy.form.sections.forEach((section) => {
      section.fields = section.fields.map((f) => (f.label === 'Account manager' ? { label: 'Account manager', value: 'Alicia Ross (you)', readonly: true, lock: 'Assigned to you' } : f));
    });
    am.screens.push(copy);
  });

  // Client edit and holiday calendar for the AM's own clients (PRD: R, U own clients; no delete).
  ['clientEdit', 'clientHolidayCalendar'].forEach((id) => {
    const source = personaConfig.superadmin.screens.find((s) => s.id === id);
    if (!source) return;
    const copy = JSON.parse(JSON.stringify(source));
    copy.parent = 'clients';
    if (copy.form) {
      delete copy.form.delete;
      copy.form.sections.forEach((section) => {
        section.fields = section.fields.map((f) => (f.label === 'Account manager' ? { label: 'Account manager', value: 'Alicia Ross (you)', readonly: true, lock: 'Assigned by Super Admin' } : f));
      });
    }
    am.screens.push(copy);
  });
})();

/* Buttons shared across personas can name a screen another persona owns.
   Send those to the nearest equivalent; ignore anything else unmatched. */
const TARGET_ALIASES = {
  superadmin: { reconciliation: 'invoiceAudit', rejectedInvoice: 'invoiceAudit' },
  accountmanager: { rejectedInvoice: 'reconciliation' }
};

function resolveTarget(target) {
  const screens = personaConfig[activePersona].screens;
  const alias = (TARGET_ALIASES[activePersona] || {})[target];
  const resolved = alias || target;
  return screens.some((s) => s.id === resolved) ? resolved : null;
}

/* ---------- DOM refs & state ---------- */

const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const personaNav = document.getElementById('personaNav');
const leftNav = document.getElementById('leftNav');
const screenContainer = document.getElementById('screenContainer');
const pageTitle = document.getElementById('pageTitle');
const breadcrumb = document.getElementById('breadcrumb');
const loginButton = document.getElementById('loginButton');
const userName = document.getElementById('userName');
const userRole = document.getElementById('userRole');
const userPill = document.getElementById('userPill');
const notifCount = document.getElementById('notifCount');

let activePersona = 'superadmin';
let activeScreen = 'dashboard';
let selectedClientInvoiceClient = 'Blue Harbor Health';

/* ---------- Sign-in: staff password, or one-time code for vendors / resources ---------- */

function enterApp(personaKey) {
  activePersona = personaKey;
  activeScreen = 'dashboard';
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  render();
}

loginButton.addEventListener('click', () => enterApp('superadmin'));

document.getElementById('signOut').addEventListener('click', () => {
  appShell.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  showPane('paneStaff');
});

const otpAccounts = {
  'd.ortiz@coralstaffing.com': 'vendor',
  'maya.reed@outlook.com': 'w2',
  'jordan@blakeux.studio': 'w9'
};
const inactiveAccounts = ['billing@orbitsystems.com'];

const otpEmail = document.getElementById('otpEmail');
const otpEmailError = document.getElementById('otpEmailError');
const otpCodeError = document.getElementById('otpCodeError');
const otpInputs = [...document.querySelectorAll('#otpBoxes input')];
const verifyCode = document.getElementById('verifyCode');
const resendCode = document.getElementById('resendCode');
let resendInterval = null;
let attemptsLeft = 5;

function showPane(id) {
  document.querySelectorAll('.login-pane').forEach((pane) => pane.classList.toggle('hidden', pane.id !== id));
  if (id === 'paneOtpEmail') otpEmail.focus();
  if (id === 'paneOtpCode') otpInputs[0].focus();
}

function showError(el, message) {
  el.textContent = message;
  el.classList.toggle('hidden', !message);
}

document.getElementById('openOtp').addEventListener('click', () => showPane('paneOtpEmail'));
document.querySelectorAll('.back-link').forEach((btn) => btn.addEventListener('click', () => showPane(btn.dataset.pane)));

document.querySelectorAll('.demo-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    otpEmail.value = chip.dataset.email;
    showError(otpEmailError, '');
  });
});

function startResendTimer() {
  let seconds = 30;
  clearInterval(resendInterval);
  resendCode.disabled = true;
  resendCode.innerHTML = `Resend code in <span id="resendTimer">${seconds}</span>s`;
  resendInterval = setInterval(() => {
    seconds -= 1;
    if (seconds <= 0) {
      clearInterval(resendInterval);
      resendCode.disabled = false;
      resendCode.textContent = 'Resend code';
    } else {
      document.getElementById('resendTimer').textContent = seconds;
    }
  }, 1000);
}

function resetCodeInputs() {
  otpInputs.forEach((input) => { input.value = ''; input.classList.remove('filled', 'invalid'); });
  verifyCode.disabled = true;
  showError(otpCodeError, '');
}

function sendCode() {
  const email = otpEmail.value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(otpEmailError, 'Enter a valid email address.');
    return;
  }
  if (inactiveAccounts.includes(email)) {
    showError(otpEmailError, 'This account is inactive. Contact your account manager to restore access.');
    return;
  }
  if (!otpAccounts[email]) {
    showError(otpEmailError, 'We couldn’t find a vendor or resource account for this email. Check the address or contact your account manager.');
    return;
  }
  showError(otpEmailError, '');
  document.getElementById('otpSentTo').textContent = email;
  attemptsLeft = 5;
  resetCodeInputs();
  showPane('paneOtpCode');
  startResendTimer();
}

document.getElementById('sendCode').addEventListener('click', sendCode);
otpEmail.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendCode(); });

function currentCode() {
  return otpInputs.map((input) => input.value).join('');
}

function updateCodeState() {
  otpInputs.forEach((input) => { input.classList.toggle('filled', !!input.value); input.classList.remove('invalid'); });
  if (attemptsLeft <= 0) return;
  verifyCode.disabled = currentCode().length !== 6;
  showError(otpCodeError, '');
}

otpInputs.forEach((input, i) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(-1);
    if (input.value && i < otpInputs.length - 1) otpInputs[i + 1].focus();
    updateCodeState();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && i > 0) otpInputs[i - 1].focus();
    if (e.key === 'Enter' && !verifyCode.disabled) verifyCode.click();
  });
  input.addEventListener('paste', (e) => {
    const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    otpInputs.forEach((box, j) => { box.value = digits[j] || ''; });
    otpInputs[Math.min(digits.length, 5)].focus();
    updateCodeState();
  });
});

verifyCode.addEventListener('click', () => {
  if (currentCode() === '000000') {
    attemptsLeft -= 1;
    otpInputs.forEach((input) => input.classList.add('invalid'));
    showError(otpCodeError, attemptsLeft > 0
      ? `That code is incorrect. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`
      : 'Too many incorrect attempts. Request a new code to continue.');
    verifyCode.disabled = true;
    return;
  }
  clearInterval(resendInterval);
  enterApp(otpAccounts[document.getElementById('otpSentTo').textContent]);
});

resendCode.addEventListener('click', () => {
  attemptsLeft = 5;
  resetCodeInputs();
  startResendTimer();
  const note = document.createElement('div');
  note.className = 'login-success';
  note.textContent = 'A new code is on its way.';
  resendCode.parentElement.after(note);
  setTimeout(() => note.remove(), 3000);
  otpInputs[0].focus();
});

function setPersona(personaKey) {
  activePersona = personaKey;
  activeScreen = 'dashboard';
  render();
}

function goToScreen(screenId, clientName) {
  if (screenId === 'invoiceUpload' && clientName) {
    selectedClientInvoiceClient = clientName;
  }
  activeScreen = screenId;
  render();
  window.scrollTo({ top: 0 });
}

function currentPersona() {
  return personaConfig[activePersona];
}

function findScreen(id) {
  const screens = currentPersona().screens;
  return screens.find((s) => s.id === id) || screens[0];
}

/* ---------- Chrome ---------- */

function renderLeftNav(screen) {
  const navKey = screen.parent || screen.id;
  leftNav.innerHTML = '';
  currentPersona().nav.forEach((item) => {
    const button = document.createElement('button');
    button.textContent = item.label;
    button.className = item.target === screen.id || item.target === navKey ? 'active' : '';
    button.addEventListener('click', () => goToScreen(item.target));
    leftNav.appendChild(button);
  });
}

function renderPersonaButtons() {
  personaNav.innerHTML = '';
  Object.entries(personaConfig).forEach(([key, persona]) => {
    const button = document.createElement('button');
    button.className = 'persona-button' + (key === activePersona ? ' active' : '');
    button.innerHTML = `<span>${persona.name}</span><span class="persona-sub">${persona.user.name}</span>`;
    button.addEventListener('click', () => setPersona(key));
    personaNav.appendChild(button);
  });
}

function renderUser() {
  const { user, notifications } = currentPersona();
  userName.textContent = user.name;
  userRole.textContent = user.role;
  userPill.textContent = user.name.split(' ').map((p) => p[0]).join('');
  notifCount.textContent = notifications;
  notifCount.style.display = notifications ? '' : 'none';
}

function renderBreadcrumb(screen) {
  const crumbs = ['Home'];
  if (screen.parent) {
    const parent = findScreen(screen.parent);
    crumbs.push(`<button class="crumb-link" data-target="${parent.id}">${parent.title}</button>`);
  }
  if (screen.id !== 'dashboard') crumbs.push(screen.title);
  breadcrumb.innerHTML = crumbs.join('<span class="crumb-sep">/</span>');
}

/* ---------- Content blocks ---------- */

function actionButtons(actions) {
  if (!actions) return '';
  return actions.map((a) => `<button class="btn ${a.primary ? 'btn-primary' : 'btn-secondary'}" data-target="${a.target}">${a.label}</button>`).join('');
}

function createAlert(alert) {
  if (!alert) return '';
  return `
    <div class="alert alert-${alert.tone}">
      <div>
        <div class="alert-title">${alert.title}</div>
        <div class="alert-text">${alert.text}</div>
      </div>
      ${alert.action ? `<button class="btn btn-alert" data-target="${alert.action.target}">${alert.action.label}</button>` : ''}
    </div>
  `;
}

function createKpiRow(kpis) {
  if (!kpis) return '';
  const targets = DASHBOARD_KPI_TARGETS[activePersona] || ['dashboard', 'dashboard', 'dashboard', 'dashboard'];

  return `
    <div class="kpi-row">
      ${kpis.map((kpi, index) => `
        <button type="button" class="kpi-card" data-target="${targets[index] || 'dashboard'}">
          <div class="kpi-label">${kpi.label}</div>
          <div class="kpi-value">${kpi.value}</div>
          <div class="kpi-trend trend-${kpi.tone || 'neutral'}">${kpi.trend}</div>
        </button>
      `).join('')}
    </div>
  `;
}

function createPanel(panel) {
  const body = panel.bars
    ? `<div class="bar-list">${panel.bars.map((bar) => `
        <div class="bar-row">
          <div class="bar-meta"><span>${bar.label}</span><span class="mini-stat">${bar.value}</span></div>
          <div class="bar-track"><div class="bar-fill fill-${bar.tone}" style="width:${bar.pct}%"></div></div>
        </div>`).join('')}</div>`
    : `<ul class="list-plain">${panel.items.map((item) => `
        <li>
          <span class="li-label">${item.label}</span>
          <span class="li-right">${item.meta ? `<span class="li-meta">${item.meta}</span>` : ''}${item.value}</span>
        </li>`).join('')}</ul>`;

  return `
    <div class="widget">
      <div class="widget-header">
        <div class="widget-title">${panel.title}</div>
        ${panel.chip ? `<div class="action-chip">${panel.chip}</div>` : ''}
      </div>
      ${body}
    </div>
  `;
}

function createPanels(panels) {
  if (!panels) return '';
  return `<div class="content-grid">${panels.map(createPanel).join('')}</div>`;
}

function createActivity(activity) {
  if (!activity) return '';
  return `
    <div class="widget activity">
      <div class="widget-header">
        <div class="widget-title">Recent activity</div>
        <button class="link-btn">View all</button>
      </div>
      <ul class="activity-list">
        ${activity.map((a) => `
          <li>
            <span class="avatar ${a.who === 'System' ? 'avatar-system' : ''}">${a.who === 'System' ? '⚙' : a.who.split(' ').map((p) => p[0]).join('')}</span>
            <span class="activity-text"><b>${a.who}</b> ${a.what}</span>
            <span class="li-meta">${a.when}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

function createTabs(tabs) {
  if (!tabs) return '';
  return `<div class="tabs">${tabs.map((t, i) => `<button class="tab ${i === 0 ? 'active' : ''}">${t}</button>`).join('')}</div>`;
}

function createFilters(filters) {
  if (!filters) return '';
  return `
    <div class="filter-bar">
      ${filters.map((f) => `
        <div class="field inline-field">
          <label>${f.label}</label>
          <select>${f.options.map((o) => `<option ${f.label === 'Client' && o === (selectedClientInvoiceClient || 'Blue Harbor Health') ? 'selected' : ''}>${o}</option>`).join('')}</select>
        </div>
      `).join('')}
    </div>
  `;
}

function createTable(table) {
  if (!table) return '';
  const shown = table.rows.length;
  return `
    <div class="table-card">
      <div class="table-header-row">
        <div class="table-heading">
          <div class="card-title">${table.title}</div>
          ${table.chip ? `<span class="action-chip">${table.chip}</span>` : ''}
        </div>
        ${table.noSearch ? '' : `
          <div class="table-tools">
            <input class="table-search" placeholder="Search…" />
            <button class="btn btn-secondary">Filter</button>
          </div>`}
      </div>
      <div class="table-scroll">
        <table>
          <thead><tr>${table.headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${table.total ? `
        <div class="table-footer">
          <span>Showing 1–${shown} of ${table.total.toLocaleString('en-US')}</span>
          ${table.total > shown ? '<span class="pager"><button class="pager-btn" disabled>‹</button><button class="pager-btn active">1</button><button class="pager-btn">2</button><button class="pager-btn">3</button><button class="pager-btn">›</button></span>' : ''}
        </div>` : ''}
    </div>
  `;
}

function createField(field) {
  const req = field.required ? '<span class="req">*</span>' : '';
  const label = field.label ? `<label>${field.label}${req}${field.readonly ? `<span class="lock">${field.lock || 'Auto-filled'}</span>` : ''}</label>` : '';
  let control = '';

  switch (field.type) {
    case 'select':
      control = `<select>${field.options.map((o) => `<option>${o}</option>`).join('')}</select>`;
      break;
    case 'date':
      control = `<input type="date" value="${field.value || ''}" />`;
      break;
    case 'textarea':
      control = `<textarea>${field.value || ''}</textarea>`;
      break;
    case 'upload':
      control = field.file
        ? `<div class="upload-done">${fileChip(field.file, field.size)}<button class="link-btn">Replace</button></div>`
        : '<div class="upload-box">Drop file or <span class="link-text">browse</span><span class="person-sub">PDF, DOCX, JPG, PNG · max 5 MB</span></div>';
      break;
    case 'chips':
      control = `<div class="chip-row">${field.options.map((o) => `<span class="chip">${o}<span class="chip-x">×</span></span>`).join('')}<button class="chip chip-add">+ Add holiday</button></div>`;
      break;
    case 'segmented':
      control = `<div class="segmented">${field.options.map((o, i) => `<button class="seg ${i === field.selected ? 'active' : ''}">${o}</button>`).join('')}</div>`;
      break;
    default:
      control = `<input value="${field.value || ''}" ${field.readonly ? 'readonly class="readonly"' : ''} />`;
  }

  return `<div class="field ${field.full ? 'full' : ''}">${label}${control}</div>`;
}

function createForm(form) {
  if (!form) return '';
  return `
    <div class="form-card">
      ${form.sections.map((section) => `
        <div class="form-section">
          <div class="section-head">
            <div class="section-title">${section.title}</div>
            ${section.hint ? `<div class="section-hint">${section.hint}</div>` : ''}
          </div>
          <div class="form-grid">${section.fields.map(createField).join('')}</div>
        </div>
      `).join('')}
      <div class="form-footer">
        <span class="person-sub inline"><span class="req">*</span> Required</span>
        <div class="form-buttons">
          ${form.delete ? `<button class="btn btn-secondary btn-delete" data-target="${form.delete.target}">${form.delete.label}</button>` : ''}
          ${form.cancel ? `<button class="btn btn-secondary" data-target="${form.cancel.target}">${form.cancel.label}</button>` : ''}
          <button class="btn btn-primary" data-target="${form.submit.target}">${form.submit.label}</button>
        </div>
      </div>
    </div>
  `;
}

function createFooterActions(actions) {
  if (!actions) return '';
  return `<div class="form-buttons page-footer">${[...actions].reverse().map((a) => `<button class="btn ${a.primary ? 'btn-primary' : 'btn-secondary'}" data-target="${a.target}">${a.label}</button>`).join('')}</div>`;
}

function resolveScreenState(screen) {
  if (screen.id !== 'invoiceUpload') return screen;

  const clientName = selectedClientInvoiceClient || 'Blue Harbor Health';
  return {
    ...screen,
    filters: screen.filters.map((filter) => ({
      ...filter,
      options: filter.label === 'Client' ? ['Blue Harbor Health', 'Northwind Labs', 'Meridian Retail Group', 'Lumen Logistics'] : filter.options
    })),
    table: {
      ...screen.table,
      title: `${clientName} · October 2026`,
      rows: getClientInvoiceRows(clientName)
    }
  };
}

function screenMarkup(screen) {
  return `
    <div class="screen">
      <div class="screen-head">
        <p class="screen-desc">${screen.description}</p>
        <div class="screen-actions">${actionButtons(screen.actions)}</div>
      </div>
      ${createAlert(screen.alert)}
      ${createKpiRow(screen.kpis)}
      ${createPanels(screen.panels)}
      ${createActivity(screen.activity)}
      ${createFilters(screen.filters)}
      ${createTabs(screen.tabs)}
      ${createTable(screen.table)}
      ${createForm(screen.form)}
      ${createFooterActions(screen.footerActions)}
    </div>
  `;
}

function handleTargetClick(event) {
  const trigger = event.target.closest('[data-target]');
  if (!trigger) return;
  const target = trigger.getAttribute('data-target');
  const clientName = trigger.getAttribute('data-client');
  const resolved = target && resolveTarget(target);
  if (resolved) {
    goToScreen(resolved, clientName || undefined);
  }
}

function render() {
  const screen = resolveScreenState(findScreen(activeScreen));
  activeScreen = screen.id;

  renderLeftNav(screen);
  renderPersonaButtons();
  renderUser();
  renderBreadcrumb(screen);

  pageTitle.textContent = screen.title;
  document.title = `${screen.title} · Arkhya Tech VMS`;
  screenContainer.innerHTML = screenMarkup(screen);
  screenContainer.onclick = handleTargetClick;

  breadcrumb.onclick = handleTargetClick;

  // Inline "Add holiday" input (browser prompt() dialogs are blocked in the hosted viewer).
  // PRD CL-5: at most 10 holidays per client; an 11th is blocked with a message.
  screenContainer.querySelectorAll('.chip-add').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const chipRow = button.closest('.chip-row');
      const field = chipRow.parentElement;
      const showLimit = (message) => {
        let note = field.querySelector('.chip-limit');
        if (!note) {
          note = document.createElement('div');
          note.className = 'chip-limit';
          field.appendChild(note);
        }
        note.textContent = message;
      };
      if (chipRow.querySelectorAll('.chip:not(.chip-add)').length >= 10) {
        showLimit('A client can have up to 10 holidays. Remove one to add another.');
        return;
      }
      if (chipRow.querySelector('.chip-input')) {
        chipRow.querySelector('.chip-input').focus();
        return;
      }
      const input = document.createElement('input');
      input.className = 'chip-input';
      input.id = 'newHolidayInput';
      input.placeholder = 'e.g. Dec 24 · Christmas Eve';
      chipRow.insertBefore(input, button);
      input.focus();
      const commit = () => {
        const value = input.value.trim();
        input.remove();
        if (!value) return;
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = value;
        const close = document.createElement('span');
        close.className = 'chip-x';
        close.textContent = '×';
        close.addEventListener('click', (e) => { e.stopPropagation(); chip.remove(); });
        chip.appendChild(close);
        chipRow.insertBefore(chip, button);
        const count = chipRow.querySelectorAll('.chip:not(.chip-add)').length;
        const hint = field.closest('.form-section')?.querySelector('.section-hint');
        if (hint) hint.textContent = `Select up to 10 holidays. ${count} of 10 selected.`;
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') { input.value = ''; commit(); }
      });
      input.addEventListener('blur', commit);
    });
  });

  screenContainer.querySelectorAll('.chip-x').forEach((closeBtn) => {
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      event.currentTarget.parentElement.remove();
    });
  });

  screenContainer.querySelectorAll('.tab, .seg').forEach((el) => {
    el.addEventListener('click', () => {
      el.parentElement.querySelectorAll('.active').forEach((a) => a.classList.remove('active'));
      el.classList.add('active');
    });
  });
}

render();
