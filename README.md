# ☀️ HeliosOps — Solar Equipment Distribution & Operations OS
### Enterprise Logistics, Inventory, Pre-Dispatch QC & Fleet Operations Portal for the Indian Solar Market

![HeliosOps Banner](https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80)

**HeliosOps** is a modern operational dashboard engineered specifically for high-volume solar equipment distributors handling Tier-1 Photovoltaic (PV) Modules, Commercial/String Inverters, Lithium Iron Phosphate (LiFePO4) Battery Energy Storage Systems (BESS), Aluminium Mounting Structures, and High-Voltage Solar Cabling.

Localized specifically for the Indian solar supply chain (Bhiwandi Central Depot, Sanand Solar Park, Pune, Peenya, NCR corridors) with authentic Indian manufacturers (Waaree, Tata Power Solar, Vikram Solar, Sungrow India, Havells, Polycab, Exide) and fleet transporters (V-Trans India, Safexpress, TCI Express, Delhivery Freight).

---

## 🌟 Key Modules & Functional Overview

### 1. Operational Dashboard Overview (Command Center)
- **KPI Cards**:
  - **Total Revenue (Current Month)**: Displays gross wholesale revenue in Indian Rupees (`₹1.48+ Crore` / `₹84.5 Lakh`) with month-over-month growth percentage (`+18.4% vs last month`).
  - **Combined Active Orders & Pending Dispatches**: Consolidates active pipeline load into a single card with sub-breakdowns: *In-Transit Shipments* (e.g., 16 Fleet) and *Pending Dispatches Staged on Dock* (e.g., 12 Staged).
  - **Total Inventory Valuation**: Real-time calculated worth of all warehouse assets (`₹4.85 Crore`) with audit timestamps.
  - **Active Low-Stock Alerts**: Interactive sticker badge icons for each equipment domain:
    - ☀️ **Panels** (e.g., Waaree 545W below threshold)
    - ⚡ **Inverters** (e.g., Sungrow 50kW)
    - 🔋 **Batteries** (e.g., Luminous LFP 48V Rack)
    - 🏗️ **Racking** (e.g., Rayzon Clamps)
    - 🔌 **Cabling** (e.g., Polycab 4mm² DC Drum)
- **Interactive Multi-Chart View (Selectable via Dropdown)**:
  - 📈 **Spline Chart**: Compares Current Month vs. Last Month solar panel order sales volume (units dispatched weekly).
  - 📊 **Bar Chart**: Direct comparison of unit procurement cost price vs. current market selling price with remaining bay units.
  - 🥧 **Pie Chart**: Order fulfillment health, on-time deliveries, minor transit delays, and ongoing staging.
- **Real-Time Activity Stream**:
  - Live table of ongoing dispatches: **Order ID**, **Customer Name & EPC**, **Purchased Merchandise**, **Logistics Partner**, **Date**, **Amount (₹)**, and **Status**.
  - Frontend instant search bar and multi-status filter dropdown.
- **Quick Actions Bar**: Fast shortcuts to generate sales orders, raise manufacturer POs, launch the dock checklist, or audit warehouse bays.

---

### 2. Team Management & Floor Operations Roster
- **Dual View Modes**:
  - **Simple Cards View**: Employee cards with photos, designations, department, current active tasks, shift schedules, official contact (`+91 ...`), today's check-in timestamp (e.g., `08:45 AM Today`), and workload status tags (`Active on Dock`, `Reviewing POs`, `On Break`, `Offline`).
  - **Hierarchical Org Tree (Claymorphic Architecture)**: Redesigned visual tree representation with claymorphic elevation, wireframe connection stems, department color badges, and direct contact shortcuts from Leadership (*Rajesh Sharma - Operations Head*) down through Logistics (*Sunita Rao*), Warehouse Dock Supervisors (*Vikram Deshmukh*), QC (*Priya Patel*), Floor Packers (*Amit Verma*), and Technical Sales (*Suresh Nair*).
- **Employee Extended Management Drawer**:
  - View & manage employee compensation payouts (₹ INR/mo), paid leave/holiday balances, performance ratings, and tenure.
- **On-Demand Non-Permanent Personnel Section**:
  - Roster for third-party freight drivers (*Manoj Kumar, MH 04 AB 4912*), certified solar rooftop installers (*Harish Salunke, Suryamitra certified*), and crane/rigging specialists.
  - Displays instant review ratings (e.g., 4.9 ★), completed job count, daily rates (`₹2,800/day`), and instant **"Call Pilot"** and **"Book / Assign"** actions.
- **Order Assignment Interlock**: Dispatch managers can directly reassign sales traders and QC inspectors to orders.

---

### 3. Solar Equipment Inventory & Warehouse Bins
- **Dedicated Equipment Management Sub-Dashboard**:
  - **Category KPI Cards**: Real-time stock counts for Panels, Inverters, Batteries, Racking, and Cabling, accompanied by live commodity market price trends (*Waaree -3.8% drop, Polycab Copper +6.4% surge*).
  - **Illustrated Empty States**: Smart filter recovery with an instant "Reset All Filters" action button when no SKU matches the criteria.
  - **Detailed Per-Product Catalog Table**:
    - High-resolution thumbnails.
    - Tier-1 Brands (Tata Power Solar, Waaree, Vikram, Sungrow, Havells, Luminous, Exide, Polycab, Pennar).
    - Technical Specifications (Wattage, Efficiency %, Voltage, Warranty, Dimensions).
    - In-Stock Units vs. Monthly Ordered Velocity.
    - Wholesale Selling Price vs. Cost Price.
    - Warehouse Bin & Pallet ID (Zone, Aisle, Pallet ID).
    - **Actions**: "Add to Cart/Staging", "Stock Recount Adjustment" with reason logging, and specs modal with scrollable viewport bounds.

---

### 4. Sales & Order Lifecycle Management
- **Horizontal Pipeline Filter Bar (Top Right)**:
  - Combined smart popover filter integrating Order Date Range and Order Category / Type with quick presets.
  - Status chips: `Ongoing Orders` | `Pending QC Inspection` | `Delivered / History` | `Cancelled` | `All Orders`.
- **Order Listing & Expandable Details**:
  - Balanced, fixed-width column table structure ensuring responsive layout stability across viewports.
  - **Visual Product Preview**: SVG-illustrated category badges for PV Modules, String Inverters, LiFePO4 BESS, and Mounting Clamps.
  - **Separated Quantity & Financial Totals**: Clear breakdown of line-item units, base price, GST, and total order valuation.
  - **Inspired Milestone Progression Timeline**: 5-stage vertical timeline inspired by enterprise courier manifests with bold milestone headers, timestamps, and secondary status annotations.
- **Enhanced Freight Delivery Booking & Dispatch Modal**:
  - Comprehensive consignee inputs (GSTIN, dock delivery contact, gate entry notes, transit insurance, priority levels, and scheduled delivery windows).

---

### 5. Pre-Dispatch Loading Checklist (Critical Component)
*A purpose-built dock tablet & desktop verification workstation designed to eliminate incomplete or damaged dispatches.*

- **Order Header & Carrier Verification**:
  - Order ID, Customer EPC address, Transporter name, Vehicle Registration Number (`MH 04 AB 4912`), Driver phone.
- **Itemized Required vs. Packed Quantity Counter**:
  - Tactile `+` and `-` quantity adjusters with a "Pack All" one-click button.
  - Visual completion progress bar (e.g., *70/70 units verified*).
- **Serial Number Tracking**:
  - Mandatory serial number bar-code logging for high-value Inverters and LiFePO4 batteries.
- **Multi-Point Physical Condition Verification**:
  - Four tactile toggles per line item:
    1. *Factory Seal Intact*
    2. *Visual Inspection OK (no cell microcracks or casing dents)*
    3. *Voltage / Continuity QC Passed*
    4. *Pallet Strapped & Corner Shielded*
- **Photo Evidence System**:
  - Capture or attach dock loading photos with stage tags (*Pallet Strapping*, *Serial Label*, *High-Voltage Crate*, *Truck Bay Loading*).
  - Gallery of pre-loaded verified dock snapshots with full-screen preview modal (`max-h-[90vh] overflow-y-auto`).
- **Missing / Damaged Reporting Mechanism**:
  - Flag discrepancies with severity classification (*Blocker* vs *Minor*), quantity affected, and immediate warehouse quarantine notes.
- **Dual Verification & Supervisor Sign-Off**:
  - Warehouse Packer confirmation checkbox.
  - Supervisor remarks input.
  - Tamper-evident Security Seal # generation (`SEAL-MH-2026-9042`).
  - **Safety Interlock**: Prevents transitioning to "Dispatched" unless the checklist is signed off.
  - **Printable Manifest**: Generate clean warehouse gate pass and Bill of Lading (BOL).

---

### 6. Fleet Logistics & Live Order Tracking
- **Carrier Profile**: Transporter fleet details (V-Trans, Safexpress, TCI Express, Delhivery), Vehicle plate #, Trailer specifications, Waybill / LR number.
- **Dual View Modes (Switchable via Top-Right Segmented Controller)**:
  - 🗺️ **Live Map View**: Interactive vector GPS tracking display with animated vehicle markers, waypoint nodes (origin depot, transit hubs, customer destination site), simulated telemetry telemetry chips (speed, engine load, battery), and dynamic zoom controls.
  - 🛣️ **Expressway Corridor Telemetry**: Progress indicator showing real-time kilometer progress along key Indian freight expressways (NH-48, Samruddhi Mahamarg, NE-1).
- **Carrier Check-in Logs**: Timestamped audit trail of toll plaza checkpoints, driver check-ins, and automated timestamp logs.

---

### 7. Purchase Order (PO) Management
- **Supplier Directory**: Indian manufacturers (Waaree Surat, Sungrow Bengaluru, Polycab Halol, Luminous Gurugram).
- **Line Items & Costing**: Landed costs, GST validation, and expected delivery targets.
- **Interactive Inbound Receiving Workflow**:
  - Warehouse operators inspect incoming shipments and input received quantities.
  - **Automatic Stock Increment**: Automatically updates the central inventory when goods are marked as received!

---

## 🎨 Design Philosophy & UX Decisions

### 1. Warm Clay Design System & Color Tokens
- **Canvas & Elevation**:
  - Light mode uses a warm, soothing eggshell/clay base (`#FBF9F5`) to prevent warehouse fluorescent glare, contrasted with deep espresso typography (`#1C1613`).
  - Dark mode employs a rich charred espresso canvas (`#120F0D`) with subtle chocolate-tinted borders (`#2D2520`).
  - **Borderless Light-Mode Containers**: Replaced harsh 1px borders on outer card containers with organic soft ambient shadows (`shadow-[0_2px_12px_-2px_rgba(40,30,20,0.04)]`), retaining crisp dark borders (`dark:border dark:border-[#2D2520]`) for optimal contrast.
- **Solar Brand Accents**:
  - Solar saffron gold (`#FCD34D`) serves as the brand hero accent for active tabs, status chips, and GPS fleet telemetry.
  - Emerald green (`#10B981` / `#168051`) validates verified QC steps, intact seals, and completed deliveries.
  - Terracotta and amber indicate pending stages and dock inspections.
- **Indian Solar Market Localization**:
  - Currency natively rendered in Indian Rupee format (`₹` Lakhs and Crores).
  - Indian mobile number conventions (`+91 98...`).
  - Real-world Indian solar industrial corridors (Bhiwandi Central Depot, Sanand Solar Park, Peenya, Pune, Talegaon, Bikaner).
  - Authentic logistics partners (V-Trans India, Safexpress, TCI Express, Delhivery Freight) with valid state RTO vehicle registration patterns (`MH 04`, `GJ 06`, `KA 05`, `RJ 14`).

### 2. Ergonomics, Responsive Navigation & Layout Stability
- **Responsive Navigation Architecture**:
  - **Desktop View (`lg+`)**: Sidebar remains permanently anchored (`lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]`) with an expandable/collapsible toggle. Navigation labels and icons have been enlarged by 10% for high legibility on dock monitors.
  - **Mobile & Tablet View (`< lg`)**: Automatically transforms into a horizontal touch-scrollable chip strip (`overflow-x-auto scrollbar-none`), ensuring zero vertical screen occlusion on mobile devices.
  - **Sticky Glassmorphism Navbar**: `backdrop-blur-md` sticky top navigation bar with quick theme toggle, IST warehouse clock, and full-text global search.
- **Live Instant Global Search**:
  - Real-time reactive search popover that indexes across Sales Orders (by ID and EPC customer), Solar Inventory (by brand, model, and wattage), and Manufacturer POs.
  - Keyboard accessibility with `Esc` listener, click-outside dismissal, and single-click tab routing with automated entity selection.
- **Modal Viewport Safety**:
  - All interactive dialogs (Photo Evidence Viewer, Physical Stock Adjustment, Logistics Booking, Raise PO, Inbound Goods Receiving) are safeguarded with `max-h-[90vh] overflow-y-auto` to eliminate viewport overflow on small laptops and tablets.

### 3. Key UX Decisions for the Pre-Dispatch Loading Checklist
- **Preventing Accidental Incomplete Shipments**: The system enforces an architectural interlock — an order *cannot* be marked as "Dispatched" until the Pre-Dispatch Checklist is 100% itemized, condition-checked, and signed off by a supervisor.
- **Tablet-Optimized Large Touch Targets**: Designed for forklift operators and QC inspectors wearing warehouse gloves; includes tactile `+` / `-` steppers and bold checkboxes.
- **Photographic Audit Trail**: Mandatory visual evidence attached to each dispatch file to protect against transit damage disputes with logistics carriers.

### 4. Rationale for Animation & Interactions
- **Subtle Pulse Indicators**: Low-stock warnings and live dock loading gates feature gentle pulses to draw immediate operator attention without being distracting.
- **Celebratory QC Sign-Off**: Certified supervisor sign-off triggers confetti feedback (`canvas-confetti`) to provide satisfying positive reinforcement upon completing rigorous audits.
- **Smooth Spline Curves**: Recharts monotone spline curves illustrate solar sales velocity far more naturally than rigid linear charts.

### 5. Key Technical Challenges & Solutions
- **Multi-Module Reactive State Synchronization**:
  - *Challenge*: Receiving an inbound PO or performing physical cycle counts needed to instantaneously reflect across the Inventory module, Dashboard valuation metrics, and low-stock alert badges without a heavy backend.
  - *Solution*: Designed a unified React Context store with optimistic local mutations and `localStorage` persistence, ensuring all user actions persist across page tabs.
- **Preventing Hydration Mismatches**:
  - *Challenge*: Dynamic IST clocks, date formatters, and dark/light mode toggles can cause Next.js SSR hydration mismatches.
  - *Solution*: Encapsulated client-only clocks in `useEffect` lifecycles and utilized standard `suppressHydrationWarning` on the HTML root.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Solar Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Interactive Feedback**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **State Management**: React Context with Local Storage Persistence

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js `v18.17.0` or higher (`v20+` or `v24+` recommended)
- npm, yarn, or pnpm

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SolarDashBoard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to access HeliosOps.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📦 Deployment

The application is fully optimized for one-click deployment on **Vercel** or **Netlify**:

```bash
# Deploy with Vercel CLI
npx vercel
```
*Build Command*: `npm run build`  
*Output Directory*: `.next`

---

## 📄 License
MIT License. Created for the Solar Equipment Distributor Operational Dashboard Assessment.

