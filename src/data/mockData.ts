import { ServiceCategory, Service, Technician } from '../types';

export const FALLBACK_CATEGORIES: ServiceCategory[] = [
  {
    id: 1,
    name: 'Electrician',
    slug: 'electrician',
    description: 'Fan repair, switchboard replacement, MCB wiring, and appliance circuit installation.',
    icon: 'Zap',
    is_active: true,
    services: [
      { id: 1, category_id: 1, name: 'Ceiling Fan Repair & Installation', description: 'Motor diagnosis, capacitor change, bearing lubrication, and blade balancing.', price_estimate_min: 299, price_estimate_max: 499, icon: 'Zap', duration_estimate: '45 mins', is_active: true },
      { id: 2, category_id: 1, name: 'Switchboard & Socket Repair', description: 'Modular switch replacement, plug point rewiring, and surge testing.', price_estimate_min: 249, price_estimate_max: 449, icon: 'Zap', duration_estimate: '30 mins', is_active: true },
      { id: 3, category_id: 1, name: 'MCB & Fuse Box Short Circuit Fix', description: 'Main distribution board load balancing and tripped breaker fault tracing.', price_estimate_min: 399, price_estimate_max: 899, icon: 'Zap', duration_estimate: '60 mins', is_active: true },
      { id: 4, category_id: 1, name: 'Inverter & Home Wiring Check', description: 'Complete safety inspection of earthing, battery terminals, and back-up load.', price_estimate_min: 499, price_estimate_max: 1199, icon: 'Zap', duration_estimate: '90 mins', is_active: true }
    ]
  },
  {
    id: 2,
    name: 'Plumber',
    slug: 'plumber',
    description: 'Leakage detection, tap cartridge replacement, flush cisterns, and water pipeline repair.',
    icon: 'Droplets',
    is_active: true,
    services: [
      { id: 5, category_id: 2, name: 'Tap & Mixer Leakage Repair', description: 'Ceramic disc cartridge replacement, Teflon sealing, and washer overhaul.', price_estimate_min: 249, price_estimate_max: 399, icon: 'Droplets', duration_estimate: '30 mins', is_active: true },
      { id: 6, category_id: 2, name: 'Drainage & Pipe Blockage Clearing', description: 'Under-sink bottle trap and bathroom drain unclogging using pressure auger.', price_estimate_min: 349, price_estimate_max: 649, icon: 'Droplets', duration_estimate: '45 mins', is_active: true },
      { id: 7, category_id: 2, name: 'Toilet Flush Tank Repair', description: 'Syphon flapper, fill valve, and dual flush button calibration.', price_estimate_min: 299, price_estimate_max: 549, icon: 'Droplets', duration_estimate: '45 mins', is_active: true },
      { id: 8, category_id: 2, name: 'Water Tank & Pipe Installation', description: 'Overhead PVC water tank connection, float valve, and union joint fixing.', price_estimate_min: 699, price_estimate_max: 1899, icon: 'Droplets', duration_estimate: '120 mins', is_active: true }
    ]
  },
  {
    id: 3,
    name: 'AC Repair',
    slug: 'ac-repair',
    description: 'Split & window AC jet foam servicing, compressor capacitor, and gas refilling.',
    icon: 'Snowflake',
    is_active: true,
    services: [
      { id: 9, category_id: 3, name: 'Deep Clean Foam Jet Servicing', description: 'High-pressure water pump cleaning of cooling coils, blower wheel, and tray.', price_estimate_min: 499, price_estimate_max: 799, icon: 'Snowflake', duration_estimate: '60 mins', is_active: true },
      { id: 10, category_id: 3, name: 'AC Not Cooling / Gas Refill', description: 'Nitrogen leak testing, brazing repair, vacuuming, and pure R32/R410A gas charge.', price_estimate_min: 899, price_estimate_max: 2499, icon: 'Snowflake', duration_estimate: '90 mins', is_active: true },
      { id: 11, category_id: 3, name: 'Compressor Capacitor Replacement', description: 'Testing dual run capacitor microfarad rating and replacement with OEM parts.', price_estimate_min: 449, price_estimate_max: 899, icon: 'Snowflake', duration_estimate: '40 mins', is_active: true },
      { id: 12, category_id: 3, name: 'AC Installation & Uninstallation', description: 'Bracket mounting, copper piping flare connection, and core hole drilling.', price_estimate_min: 799, price_estimate_max: 1499, icon: 'Snowflake', duration_estimate: '90 mins', is_active: true }
    ]
  },
  {
    id: 4,
    name: 'RO Water Purifier',
    slug: 'ro-service',
    description: 'Sediment & carbon filter replacement, membrane scaling, and TDS balancing.',
    icon: 'Activity',
    is_active: true,
    services: [
      { id: 13, category_id: 4, name: 'Complete RO Service & Filter Change', description: 'Pre-filter spun candle, sediment filter, carbon block, and TDS check.', price_estimate_min: 499, price_estimate_max: 1299, icon: 'Activity', duration_estimate: '60 mins', is_active: true },
      { id: 14, category_id: 4, name: 'Booster Pump & SMPS Repair', description: '24V power supply replacement and booster pump diaphragm inspection.', price_estimate_min: 599, price_estimate_max: 1499, icon: 'Activity', duration_estimate: '60 mins', is_active: true },
      { id: 15, category_id: 4, name: 'RO Membrane Descaling', description: 'High-rejection membrane replacement for borewell / high TDS water.', price_estimate_min: 899, price_estimate_max: 1799, icon: 'Activity', duration_estimate: '60 mins', is_active: true }
    ]
  },
  {
    id: 5,
    name: 'Carpenter',
    slug: 'carpenter',
    description: 'Door lock replacement, hinge repair, modular cabinet fitting, and furniture fix.',
    icon: 'Hammer',
    is_active: true,
    services: [
      { id: 16, category_id: 5, name: 'Door Lock & Handle Fitting', description: 'Mortise lock, cylindrical latch, and deadbolt alignment for main/room doors.', price_estimate_min: 299, price_estimate_max: 599, icon: 'Hammer', duration_estimate: '45 mins', is_active: true },
      { id: 17, category_id: 5, name: 'Cabinet & Wardrobe Hinge Fix', description: 'Soft-close hydraulic concealed hinge replacement and drawer slide realignment.', price_estimate_min: 249, price_estimate_max: 499, icon: 'Hammer', duration_estimate: '45 mins', is_active: true },
      { id: 18, category_id: 5, name: 'Bed & Furniture Assembly / Repair', description: 'Wooden joint tightening, bracket bracing, and plywood reinforcement.', price_estimate_min: 449, price_estimate_max: 999, icon: 'Hammer', duration_estimate: '75 mins', is_active: true }
    ]
  },
  {
    id: 6,
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'Washing machine drum repair, microwave magnetron, and refrigerator cooling.',
    icon: 'Tv',
    is_active: true,
    services: [
      { id: 19, category_id: 6, name: 'Washing Machine Drum & Drain Fix', description: 'Pulsator check, belt replacement, water inlet valve, and drain pump unclog.', price_estimate_min: 499, price_estimate_max: 1299, icon: 'Tv', duration_estimate: '60 mins', is_active: true },
      { id: 20, category_id: 6, name: 'Refrigerator Thermostat & Defrost Fix', description: 'Defrost timer, bimetal sensor, fan motor, and capillary inspection.', price_estimate_min: 499, price_estimate_max: 1499, icon: 'Tv', duration_estimate: '60 mins', is_active: true }
    ]
  }
];

export const FALLBACK_ALL_SERVICES: Service[] = FALLBACK_CATEGORIES.flatMap(c => c.services);

export const FALLBACK_TECHNICIANS: Technician[] = [
  {
    id: 1,
    user_id: 3,
    full_name: 'Rajesh Kumar',
    email: 'rajesh.electrician@example.com',
    phone: '+91 98230 12345',
    category_id: 1,
    category_name: 'Electrician',
    experience_years: 8,
    service_area: 'Kothrud, Pune',
    address: 'Near Karve Statue, Kothrud',
    city: 'Pune',
    latitude: 18.5074,
    longitude: 73.8077,
    bio: 'Certified master wireman with 8+ years experience in domestic wiring, fan overhauls, and inverter installation. Immediate emergency dispatch available.',
    status: 'APPROVED',
    rating: 4.9,
    total_reviews: 128,
    hourly_rate: 299,
    avatar_url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200',
    is_available: true
  },
  {
    id: 2,
    user_id: 4,
    full_name: 'Dinesh Pawar',
    email: 'dinesh.pawar@example.com',
    phone: '+91 98230 23456',
    category_id: 2,
    category_name: 'Plumber',
    experience_years: 6,
    service_area: 'Baner, Pune',
    address: 'Pan Card Club Road, Baner',
    city: 'Pune',
    latitude: 18.5590,
    longitude: 73.7868,
    bio: 'Specialist in concealed bathroom leakage detection, CPVC pipeline joining, and pressure-jet drain unblocking.',
    status: 'APPROVED',
    rating: 4.8,
    total_reviews: 94,
    hourly_rate: 249,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    is_available: true
  },
  {
    id: 3,
    user_id: 5,
    full_name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone: '+91 98230 34567',
    category_id: 3,
    category_name: 'AC Repair',
    experience_years: 10,
    service_area: 'Viman Nagar, Pune',
    address: 'Near Phoenix Market City, Viman Nagar',
    city: 'Pune',
    latitude: 18.5679,
    longitude: 73.9143,
    bio: 'HVAC certified technician specializing in Daikin, Voltas, and LG inverter AC diagnostics, PCB card repair, and foam jet cleaning.',
    status: 'APPROVED',
    rating: 4.9,
    total_reviews: 156,
    hourly_rate: 499,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    is_available: true
  },
  {
    id: 4,
    user_id: 6,
    full_name: 'Sunita Patil',
    email: 'sunita.patil@example.com',
    phone: '+91 98230 45678',
    category_id: 4,
    category_name: 'RO Water Purifier',
    experience_years: 5,
    service_area: 'Hadapsar, Pune',
    address: 'Magarpatta City, Hadapsar',
    city: 'Pune',
    latitude: 18.5089,
    longitude: 73.9260,
    bio: 'Expert water purification technician. Kent, Aquaguard, and Pureit membrane testing, TDS meter calibration, and filter replacements.',
    status: 'APPROVED',
    rating: 4.7,
    total_reviews: 82,
    hourly_rate: 399,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    is_available: true
  },
  {
    id: 5,
    user_id: 7,
    full_name: 'Ganesh Shinde',
    email: 'ganesh.shinde@example.com',
    phone: '+91 98230 56789',
    category_id: 5,
    category_name: 'Carpenter',
    experience_years: 7,
    service_area: 'Shivajinagar, Pune',
    address: 'FC Road, Shivajinagar',
    city: 'Pune',
    latitude: 18.5314,
    longitude: 73.8446,
    bio: 'Precision woodworker and hardware specialist. Locks, modular kitchen hinges, sliding wardrobe channels, and bed frame bracing.',
    status: 'APPROVED',
    rating: 4.8,
    total_reviews: 110,
    hourly_rate: 349,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    is_available: true
  }
];
