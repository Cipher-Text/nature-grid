import type { ComplianceStatus, FacilityType } from '@prisma/client';

export interface FacilitySeedEntry {
  name: string;
  bnName?: string;
  description: string;
  facilityType: FacilityType;
  complianceStatus: ComplianceStatus;
  companyName: string;
  lat?: number;
  lng?: number;
  districtName: string;
  establishedYear?: number;
  productionCapacity?: string;
  landArea?: number;
  etpInstalled?: boolean;
}

/**
 * Real industrial facilities in Bangladesh with verified environmental impact.
 * - districtName must match the seeded District.name exactly.
 * - companyName must match a Company.name from companies.seed.ts exactly.
 */
export const FACILITY_SEED_DATA: FacilitySeedEntry[] = [
  // ─── Tanneries ──────────────────────────────────────────────────────────────
  {
    name: 'Hazaribagh Tannery Area',
    bnName: 'হাজারীবাগ ট্যানারি এলাকা',
    description:
      "Historical tannery cluster notorious for hexavalent chromium and toxic effluent discharge into the Buriganga River. Declared one of the world's top ten most polluted sites by Blacksmith Institute. Officially ordered to relocate to Savar; legacy contamination remains.",
    facilityType: 'TANNERY',
    complianceStatus: 'NON_COMPLIANT',
    companyName: 'Private Tannery Operators (Hazaribagh)',
    lat: 23.7347,
    lng: 90.3694,
    districtName: 'Dhaka',
    etpInstalled: false,
  },
  {
    name: 'BSCIC Leather Industrial City (Savar Tannery Estate)',
    bnName: 'বিএসটিআই চামড়া শিল্প নগরী, সাভার',
    description:
      'Relocation site for Hazaribagh tanneries at Hemayetpur, Savar. Houses ~155 tannery units. Central effluent treatment plant remains non-functional, discharging untreated chromium waste directly into the Dhaleshwari River.',
    facilityType: 'TANNERY',
    complianceStatus: 'NON_COMPLIANT',
    companyName: 'BSCIC',
    lat: 23.8583,
    lng: 90.2667,
    districtName: 'Dhaka',
    productionCapacity: '~155 tannery units',
    etpInstalled: true,
  },

  // ─── Power Plants ────────────────────────────────────────────────────────────
  {
    name: 'Rampal Power Station (Maitree Super Thermal)',
    bnName: 'রামপাল বিদ্যুৎ কেন্দ্র (মৈত্রী সুপার থার্মাল)',
    description:
      '1,320 MW coal-fired power plant in Rampal Upazila, Bagerhat, located ~14 km from the Sundarbans UNESCO World Heritage Site. Major environmental controversy — feared to threaten mangrove forest via air pollution, coal ash, and ship traffic through Passur River.',
    facilityType: 'POWER_PLANT',
    complianceStatus: 'NON_COMPLIANT',
    companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)',
    lat: 22.5956,
    lng: 89.5540,
    districtName: 'Bagerhat',
    productionCapacity: '1,320 MW',
  },
  {
    name: 'Payra Coal Power Plant',
    bnName: 'পায়রা কয়লা বিদ্যুৎ কেন্দ্র',
    description:
      '1,320 MW coal-fired plant at Kalapara, Patuakhali. Operational since 2020. Located in a coastal zone; concerns over coal ash pond failure risks, marine ecosystem impact, and displacement of fishing communities.',
    facilityType: 'POWER_PLANT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Bangladesh-China Power Company (BCPCL)',
    lat: 21.9700,
    lng: 90.2200,
    districtName: 'Patuakhali',
    establishedYear: 2020,
    productionCapacity: '1,320 MW',
  },
  {
    name: 'Barapukuria Power Station',
    bnName: 'বড়পুকুরিয়া বিদ্যুৎ কেন্দ্র',
    description:
      "250 MW coal-fired power station integrated with the Barapukuria underground coal mine at Phulbari, Dinajpur. One of Bangladesh's few coal extraction sites. Subsidence and groundwater issues associated with the adjacent mine.",
    facilityType: 'POWER_PLANT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Barapukuria Coal Mining Company (BCMCL)',
    lat: 25.1900,
    lng: 89.0300,
    districtName: 'Dinajpur',
    productionCapacity: '250 MW',
  },
  {
    name: 'Matarbari Ultra Super Critical Coal Power Plant',
    bnName: 'মাতারবাড়ী আলট্রা সুপার ক্রিটিকাল কয়লা বিদ্যুৎ কেন্দ্র',
    description:
      "1,200 MW ultra-supercritical coal plant under construction in Maheshkhali, Cox's Bazar. Financed by JICA (Japan). Includes a deep-sea port. Environmental concerns around coral reef and marine habitat disturbance during construction.",
    facilityType: 'POWER_PLANT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)',
    lat: 21.6800,
    lng: 91.8900,
    districtName: 'Coxsbazar',
    productionCapacity: '1,200 MW',
  },
  {
    name: 'Rooppur Nuclear Power Plant',
    bnName: 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র',
    description:
      '2,400 MW dual-reactor nuclear power plant located at Rooppur, Ishwardi, Pabna along the Padma River. Built with Rosatom (Russia) technology. Primary environmental considerations include thermal discharge into the Padma River and nuclear waste safety management.',
    facilityType: 'POWER_PLANT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Nuclear Power Company of Bangladesh (NPCBL)',
    lat: 24.0628,
    lng: 89.0478,
    districtName: 'Pabna',
    productionCapacity: '2,400 MW',
  },
  {
    name: 'Summit Meghnaghat Power Complex',
    bnName: 'সামিট মেঘনাঘাট বিদ্যুৎ কেন্দ্র',
    description:
      'Major combined-cycle natural gas and dual-fuel power generation hub at Meghnaghat, Sonargaon, Narayanganj. Supplies electricity to the national grid. Monitored for nitrogen oxide (NOx) emissions and aquatic habitat impact on the Meghna River.',
    facilityType: 'POWER_PLANT',
    complianceStatus: 'COMPLIANT',
    companyName: 'Summit Power International',
    lat: 23.6083,
    lng: 90.5989,
    districtName: 'Narayanganj',
  },
  {
    name: 'Ashuganj Power Station Complex',
    bnName: 'আশুগঞ্জ বিদ্যুৎ কেন্দ্র',
    description:
      'One of the largest thermal power complexes in Bangladesh, situated on the bank of the Meghna River at Ashuganj, Brahmanbaria. Comprises multiple natural gas-fired combined cycle plants. Key considerations include cooling water extraction and thermal pollution.',
    facilityType: 'POWER_PLANT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Ashuganj Power Station Company (APSCL)',
    lat: 24.0381,
    lng: 91.0117,
    districtName: 'Brahmanbaria',
  },
  {
    name: 'Sirajganj Power Station',
    bnName: 'সিরাজগঞ্জ বিদ্যুৎ কেন্দ্র',
    description:
      'Multi-unit gas/dual-fuel power generation hub located at Soydabad, Sirajganj near the Jamuna Bridge. Provides major grid supply to northern and central Bangladesh. Monitored for air emissions and riverine water usage.',
    facilityType: 'POWER_PLANT',
    complianceStatus: 'COMPLIANT',
    companyName: 'North-West Power Generation Company (NWPGCL)',
    lat: 24.3831,
    lng: 89.7433,
    districtName: 'Sirajganj',
  },
  {
    name: 'Karnaphuli Hydroelectric Power Station',
    bnName: 'কর্ণফুলী জলবিদ্যুৎ কেন্দ্র',
    description:
      "Bangladesh's only hydroelectric plant, located across the Karnaphuli River at Kaptai, Rangamati. Generates 230 MW of clean energy but historically created significant ecological and local socio-environmental changes due to the creation of Kaptai Lake.",
    facilityType: 'POWER_PLANT',
    complianceStatus: 'COMPLIANT',
    companyName: 'Bangladesh Power Development Board (BPDB)',
    lat: 22.4939,
    lng: 92.2228,
    districtName: 'Rangamati',
    productionCapacity: '230 MW',
  },

  // ─── Shipbreaking ────────────────────────────────────────────────────────────
  {
    name: 'Sitakunda Shipbreaking Zone',
    bnName: 'সীতাকুণ্ড জাহাজ ভাঙা শিল্পাঞ্চল',
    description:
      "An 18 km coastal strip at Sitakunda, Chittagong — the world's largest shipbreaking coast, dismantling ~38% of global end-of-life vessels. Severe environmental contamination from asbestos, PCBs, heavy metals, and oil spills. Consistently cited for worker fatalities and beach/intertidal habitat destruction.",
    facilityType: 'SHIPBREAKING',
    complianceStatus: 'NON_COMPLIANT',
    companyName: 'Private Ship Recycling Operators (Sitakunda)',
    lat: 22.6100,
    lng: 91.6700,
    districtName: 'Chattogram',
    productionCapacity: '~100 active yards',
    etpInstalled: false,
  },

  // ─── Steel ───────────────────────────────────────────────────────────────────
  {
    name: 'BSRM Steels (Nasirabad)',
    bnName: 'বিএসআরএম স্টিলস লিমিটেড',
    description:
      "Bangladesh's largest steel manufacturer. Electric arc furnace (EAF) facility in Nasirabad, Chittagong. Produces TMT rebar from steel scrap. EAF process has lower emissions than blast furnaces but generates significant slag and particulate pollution.",
    facilityType: 'STEEL',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)',
    lat: 22.3800,
    lng: 91.8200,
    districtName: 'Chattogram',
    establishedYear: 1952,
  },
  {
    name: 'KSRM Steel Plant (Sitakunda)',
    bnName: 'কেএসআরএম স্টিল প্ল্যান্ট, সীতাকুণ্ড',
    description:
      'Major integrated steel plant at Ghoramara, Sitakunda, Chittagong. Produces billets, rods, and angles. Adjacent to the shipbreaking zone, leveraging scrap steel from dismantled vessels.',
    facilityType: 'STEEL',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Kabir Steel Rolling Mills (KSRM)',
    lat: 22.4998,
    lng: 91.7158,
    districtName: 'Chattogram',
  },
  {
    name: 'GPH Ispat (Sitakunda)',
    bnName: 'জিপিএইচ ইস্পাত, সীতাকুণ্ড',
    description:
      "Steel billets and TMT rebar manufacturer at Sitakunda, Chittagong. Operates an electric induction furnace. One of Bangladesh's top five steel producers.",
    facilityType: 'STEEL',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'GPH Ispat',
    lat: 22.5100,
    lng: 91.7200,
    districtName: 'Chattogram',
  },

  // ─── Cement ──────────────────────────────────────────────────────────────────
  {
    name: 'LafargeHolcim Cement Plant (Chhatak)',
    bnName: 'লাফার্জহোলসিম সিমেন্ট প্ল্যান্ট, ছাতক',
    description:
      "Bangladesh's only fully integrated limestone-based cement plant. Located on the Surma River at Chhatak, Sunamganj. Limestone quarried from Meghalaya, India, transported via conveyor belt across the border. Certified with ISO 14001 environmental management.",
    facilityType: 'CEMENT',
    complianceStatus: 'COMPLIANT',
    companyName: 'LafargeHolcim Bangladesh',
    lat: 24.8791,
    lng: 91.6652,
    districtName: 'Sunamganj',
    etpInstalled: true,
  },
  {
    name: 'Chhatak Cement Factory',
    bnName: 'ছাতক সিমেন্ট কারখানা',
    description:
      "Bangladesh's oldest cement factory, established in 1941 on the Surma River bank in Chhatak, Sunamganj. State-owned. Aging infrastructure results in dust emissions and riverine effluent; running below capacity.",
    facilityType: 'CEMENT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Bangladesh Chemical Industries Corporation (BCIC)',
    lat: 24.8800,
    lng: 91.6700,
    districtName: 'Sunamganj',
    establishedYear: 1941,
  },
  {
    name: 'Bashundhara Cement (Madanpur Plant)',
    bnName: 'বসুন্ধরা সিমেন্ট, মদনপুর',
    description:
      'Large VRM-technology cement manufacturing unit at Madanpur, Narayanganj. Processes imported clinker, slag, and gypsum. Air quality monitoring is required due to fugitive cement dust during material handling.',
    facilityType: 'CEMENT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Bashundhara Group',
    lat: 23.6828,
    lng: 90.5361,
    districtName: 'Narayanganj',
  },
  {
    name: 'Crown Cement (West Mukterpur)',
    bnName: 'ক্রাউন সিমেন্ট, পশ্চিম মুক্তারপুর',
    description:
      'Major cement production facility located at West Mukterpur, Munshiganj along the Dhaleshwari River. Utilizes deep-river berths for raw material discharge. Environmental measures address airborne particulate matter.',
    facilityType: 'CEMENT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Crown Cement',
    lat: 23.5714,
    lng: 90.5186,
    districtName: 'Munshiganj',
  },

  // ─── Fertilizer ──────────────────────────────────────────────────────────────
  {
    name: 'Karnaphuli Fertilizer Company (KAFCO)',
    bnName: 'কর্ণফুলী ফার্টিলাইজার কোম্পানি লিমিটেড',
    description:
      'Gas-based urea fertilizer plant at Rangadia, Anwara, Chittagong, situated on the southern bank of the Karnaphuli River. Joint-venture with Japan. Covers 100 acres. Key concern is ammonia and urea dust emissions into the river estuary.',
    facilityType: 'FERTILIZER',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Karnaphuli Fertilizer Company (KAFCO)',
    lat: 22.2312,
    lng: 91.8252,
    districtName: 'Chattogram',
    landArea: 40.5,
  },
  {
    name: 'Chittagong Urea Fertilizer (CUFL)',
    bnName: 'চট্টগ্রাম ইউরিয়া সার কারখানা',
    description:
      'Ageing state-owned urea fertilizer plant at Rangadia, Chittagong. Persistent untreated effluent discharge into the Karnaphuli River. Operates below rated capacity due to aging equipment and gas supply shortfalls.',
    facilityType: 'FERTILIZER',
    complianceStatus: 'NON_COMPLIANT',
    companyName: 'Bangladesh Chemical Industries Corporation (BCIC)',
    lat: 22.2130,
    lng: 91.8318,
    districtName: 'Chattogram',
    etpInstalled: false,
  },
  {
    name: 'Ashuganj Fertilizer & Chemical Company (AFCCL)',
    bnName: 'আশুগঞ্জ সার ও রাসায়নিক কোম্পানি লিমিটেড',
    description:
      'Natural gas-based urea fertilizer plant in Ashuganj, Brahmanbaria. Located on the bank of the Meghna River. State-owned. An important source of agricultural urea for northern and central Bangladesh.',
    facilityType: 'FERTILIZER',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)',
    lat: 24.0333,
    lng: 91.0167,
    districtName: 'Brahmanbaria',
  },
  {
    name: 'Ghorashal Urea Fertilizer Factory',
    bnName: 'ঘোড়াশাল ইউরিয়া সার কারখানা',
    description:
      "One of Bangladesh's largest state-run fertilizer complexes at Ghorashal, Narsingdi. Gas-based, dating to the 1960s–1980s. Multiple units with aging infrastructure; ammonia leakage incidents have been recorded.",
    facilityType: 'FERTILIZER',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Bangladesh Chemical Industries Corporation (BCIC)',
    lat: 23.9700,
    lng: 90.6800,
    districtName: 'Narsingdi',
  },

  // ─── Pharmaceutical ──────────────────────────────────────────────────────────
  {
    name: 'Square Pharmaceuticals (Kaliakoir Plant)',
    bnName: 'স্কয়ার ফার্মাসিউটিক্যালস, কালিয়াকৈর',
    description:
      "Bangladesh's largest pharmaceutical company's primary manufacturing facility at Kaliakoir, Gazipur. WHO GMP, UK MHRA, and EU GMP certified. Exports to 40+ countries. Strong environmental management system with certified effluent treatment.",
    facilityType: 'PHARMACEUTICAL',
    complianceStatus: 'COMPLIANT',
    companyName: 'Square Pharmaceuticals',
    lat: 24.0800,
    lng: 90.2900,
    districtName: 'Gazipur',
    etpInstalled: true,
  },
  {
    name: 'Incepta Pharmaceuticals (Zirabo)',
    bnName: 'ইনসেপ্টা ফার্মাসিউটিক্যালস, জিরাবো',
    description:
      'Large-scale pharmaceutical manufacturer at Zirabo, Savar. WHO GMP and UK MHRA approved. One of Bangladesh\'s top five pharma exporters. A second plant has been established at Dhamrai.',
    facilityType: 'PHARMACEUTICAL',
    complianceStatus: 'COMPLIANT',
    companyName: 'Incepta Pharmaceuticals',
    lat: 23.8600,
    lng: 90.2200,
    districtName: 'Dhaka',
    etpInstalled: true,
  },
  {
    name: 'Beximco Pharmaceuticals (Kashimpur)',
    bnName: 'বেক্সিমকো ফার্মাসিউটিক্যালস, কাশিমপুর',
    description:
      'Major pharmaceutical manufacturer at Beximco Industrial Park, Kashimpur, Gazipur. WHO GMP certified. Produces active pharmaceutical ingredients (APIs) and finished dosage forms. Exports to over 50 countries.',
    facilityType: 'PHARMACEUTICAL',
    complianceStatus: 'COMPLIANT',
    companyName: 'Beximco Pharmaceuticals',
    lat: 23.9600,
    lng: 90.3700,
    districtName: 'Gazipur',
    etpInstalled: true,
  },
  {
    name: 'Renata Limited (Mirpur Plant)',
    bnName: 'রেনাটা লিমিটেড, মিরপুর',
    description:
      'Major pharmaceutical manufacturing unit in Section-7, Mirpur, Dhaka. Produces human health products and animal health therapeutics. Complies with UK MHRA and WHO GMP standards.',
    facilityType: 'PHARMACEUTICAL',
    complianceStatus: 'COMPLIANT',
    companyName: 'Renata Limited',
    lat: 23.8089,
    lng: 90.3642,
    districtName: 'Dhaka',
    etpInstalled: true,
  },
  {
    name: 'ACME Laboratories (Dhamrai Plant)',
    bnName: 'দি এসিএমই ল্যাবরেটরিজ, ধামরাই',
    description:
      'Comprehensive pharmaceutical manufacturing plant located at Dhulivita, Dhamrai, Dhaka. Produces oral solid dosage forms, injectables, and herbal medicine under international GMP protocols.',
    facilityType: 'PHARMACEUTICAL',
    complianceStatus: 'COMPLIANT',
    companyName: 'ACME Laboratories',
    lat: 23.9167,
    lng: 90.1833,
    districtName: 'Dhaka',
    etpInstalled: true,
  },

  // ─── Garment / Textile ───────────────────────────────────────────────────────
  {
    name: 'Ashulia RMG Industrial Zone',
    bnName: 'আশুলিয়া তৈরি পোশাক শিল্পাঞ্চল',
    description:
      "High-density readymade garment cluster in Ashulia, Savar. One of the world's largest concentrations of garment factories, supplying global brands. Major environmental concerns include untreated dyeing/washing effluents, groundwater depletion, and chemical runoff into the Bangshi River.",
    facilityType: 'GARMENT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Multiple RMG Manufacturers (Ashulia)',
    lat: 23.8900,
    lng: 90.2800,
    districtName: 'Dhaka',
    productionCapacity: '1,700+ factories',
  },
  {
    name: 'Gazipur RMG Industrial Cluster',
    bnName: 'গাজীপুর তৈরি পোশাক শিল্পাঞ্চল',
    description:
      "Bangladesh's densest garment district with over 1,900 active factories. Key exporters include Viyellatex, DBL Group, and Ha-Meem Group. Effluent from washing and dyeing units discharges into the Turag and Balu rivers.",
    facilityType: 'GARMENT',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Multiple RMG Manufacturers (Gazipur)',
    lat: 24.0000,
    lng: 90.4200,
    districtName: 'Gazipur',
    productionCapacity: '1,900+ factories',
  },
  {
    name: 'Narayanganj Textile & Dyeing Industrial Zone',
    bnName: 'নারায়ণগঞ্জ বস্ত্র ও রঞ্জন শিল্পাঞ্চল',
    description:
      'Known as the "Dundee of Bangladesh", Narayanganj is the hub for knitwear, hosiery, and dyeing mills. Untreated dyeing effluents — containing reactive dyes, acids, and heavy metals — are a primary cause of the Buriganga and Shitalakshya river pollution.',
    facilityType: 'TEXTILE',
    complianceStatus: 'NON_COMPLIANT',
    companyName: 'Multiple Textile & Dyeing Manufacturers (Narayanganj)',
    lat: 23.6238,
    lng: 90.5000,
    districtName: 'Narayanganj',
    etpInstalled: false,
  },
  {
    name: 'Envoy Textiles (Valuka)',
    bnName: 'এনভয় টেক্সটাইলস লিমিটেড, ভালুকা',
    description:
      "World's first LEED-certified Platinum denim manufacturing mill, located at Jamirdia, Valuka, Mymensingh. Incorporates energy-efficient yarn dyeing, water recycling plants, and zero liquid discharge (ZLD) technologies.",
    facilityType: 'TEXTILE',
    complianceStatus: 'COMPLIANT',
    companyName: 'Envoy Group',
    lat: 24.3783,
    lng: 90.3800,
    districtName: 'Mymensingh',
    etpInstalled: true,
  },
  {
    name: 'DBL Industrial Park (Kashimpur)',
    bnName: 'ডিবিএল ইন্ডাস্ট্রিয়াল পার্ক, কাশিমপুর',
    description:
      'Large vertical garment and textile knitting complex at Kashimpur, Gazipur. Features advanced eco-friendly dyeing lines, rooftop solar arrays, and high-efficiency wastewater treatment plants.',
    facilityType: 'GARMENT',
    complianceStatus: 'COMPLIANT',
    companyName: 'DBL Group',
    lat: 23.9781,
    lng: 90.3292,
    districtName: 'Gazipur',
    etpInstalled: true,
  },
  {
    name: 'Viyellatex Eco Park (Gazipur)',
    bnName: 'ভায়ালেটেক্স ইকো পার্ক, গাজীপুর',
    description:
      'State-of-the-art eco-friendly readymade garment and apparel complex at Gazipur Sadar. Certified for sustainable manufacturing, rainwater harvesting, and low-carbon emissions.',
    facilityType: 'GARMENT',
    complianceStatus: 'COMPLIANT',
    companyName: 'Viyellatex Group',
    lat: 23.9892,
    lng: 90.3811,
    districtName: 'Gazipur',
    etpInstalled: true,
  },

  // ─── Export Processing Zones ─────────────────────────────────────────────────
  {
    name: 'Dhaka Export Processing Zone (DEPZ)',
    bnName: 'ঢাকা রপ্তানি প্রক্রিয়াকরণ অঞ্চল',
    description:
      'Premier export-oriented industrial enclosure established in 1993 at Savar, Dhaka. Features over 100 operating enterprises producing textiles, RMG, sweater items, plastic goods, and footwear. Effluent management monitored under strict BEPZA environmental standards.',
    facilityType: 'GARMENT',
    complianceStatus: 'COMPLIANT',
    companyName: 'Bangladesh Export Processing Zones Authority (BEPZA)',
    lat: 23.8442,
    lng: 90.2511,
    districtName: 'Dhaka',
    establishedYear: 1993,
    etpInstalled: true,
  },
  {
    name: 'Chittagong Export Processing Zone (CEPZ)',
    bnName: 'চট্টগ্রাম রপ্তানি প্রক্রিয়াকরণ অঞ্চল',
    description:
      "Bangladesh's first export processing zone, established in 1983 at South Halishahar near Chattogram Port. Houses over 160 active foreign and local manufacturing firms producing garments, electronics, precision tools, and leather goods.",
    facilityType: 'GARMENT',
    complianceStatus: 'COMPLIANT',
    companyName: 'Bangladesh Export Processing Zones Authority (BEPZA)',
    lat: 22.3833,
    lng: 91.8667,
    districtName: 'Chattogram',
    establishedYear: 1983,
    etpInstalled: true,
  },
  {
    name: 'Adamjee Export Processing Zone (AEPZ)',
    bnName: 'আদমজী রপ্তানি প্রক্রিয়াকরণ অঞ্চল',
    description:
      'Established in 2006 on 245 acres of the historic former Adamjee Jute Mills site in Siddhirganj, Narayanganj. Major hub for textile dyeing, knitwear, and accessories manufacturing with integrated industrial wastewater treatment systems.',
    facilityType: 'TEXTILE',
    complianceStatus: 'COMPLIANT',
    companyName: 'Bangladesh Export Processing Zones Authority (BEPZA)',
    lat: 23.6778,
    lng: 90.5238,
    districtName: 'Narayanganj',
    establishedYear: 2006,
    landArea: 99.2,
    etpInstalled: true,
  },
  {
    name: 'Karnaphuli Export Processing Zone (KEPZ)',
    bnName: 'কর্ণফুলী রপ্তানি প্রক্রিয়াকরণ অঞ্চল',
    description:
      'Specialized EPZ set up on the grounds of the former Chittagong Steel Mills in North Patenga, Chattogram. Hosts high-density garment, headwear, and shoe manufacturing units close to the Karnaphuli River estuary.',
    facilityType: 'GARMENT',
    complianceStatus: 'COMPLIANT',
    companyName: 'Bangladesh Export Processing Zones Authority (BEPZA)',
    lat: 22.2758,
    lng: 91.7922,
    districtName: 'Chattogram',
    etpInstalled: true,
  },
  {
    name: 'Uttara Export Processing Zone (UEPZ)',
    bnName: 'উত্তরা রপ্তানি প্রক্রিয়াকরণ অঞ্চল',
    description:
      'Key economic growth driver in Northern Bangladesh, located at Shongalshi, Nilphamari. Spans 230 acres and houses sweater, wig, toy, and leather processing units designed to foster regional industrial growth.',
    facilityType: 'OTHER',
    complianceStatus: 'COMPLIANT',
    companyName: 'Bangladesh Export Processing Zones Authority (BEPZA)',
    lat: 25.8569,
    lng: 88.8639,
    districtName: 'Nilphamari',
    landArea: 93.1,
    etpInstalled: true,
  },
  {
    name: 'Mongla Export Processing Zone',
    bnName: 'মংলা রপ্তানি প্রক্রিয়াকরণ অঞ্চল',
    description:
      'Strategic EPZ situated adjacent to Mongla Port in Bagerhat. Focuses on agro-processing, jute goods, garment accessories, and manufacturing for export to Southwest Asian markets.',
    facilityType: 'OTHER',
    complianceStatus: 'COMPLIANT',
    companyName: 'Bangladesh Export Processing Zones Authority (BEPZA)',
    lat: 22.4839,
    lng: 89.6019,
    districtName: 'Bagerhat',
    etpInstalled: true,
  },

  // ─── Oil Refinery ────────────────────────────────────────────────────────────
  {
    name: 'Eastern Refinery (Patenga)',
    bnName: 'ইস্টার্ন রিফাইনারি লিমিটেড, পতেঙ্গা',
    description:
      "Bangladesh's only crude oil refinery, established in 1968 at Patenga, Chittagong. Processes imported crude oil with a capacity of ~1.5 million tonnes per year. Age-related leakages have caused recurring coastal contamination near the Bay of Bengal.",
    facilityType: 'OIL_REFINERY',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Eastern Refinery (ERL)',
    lat: 22.2700,
    lng: 91.7700,
    districtName: 'Chattogram',
    establishedYear: 1968,
    productionCapacity: '1.5 million tonnes/year',
  },

  // ─── Consumer Goods & Chemicals ─────────────────────────────────────────────
  {
    name: 'Unilever Bangladesh Kalurghat Factory',
    bnName: 'ইউনিলিভার বাংলাদেশ, কালুরঘাট',
    description:
      'Primary consumer goods manufacturing facility at Kalurghat Industrial Area, Chattogram. Produces personal care items, soaps, and home care products. Holds ISO environmental certifications with zero-waste-to-landfill protocols.',
    facilityType: 'CHEMICAL',
    complianceStatus: 'COMPLIANT',
    companyName: 'Unilever Bangladesh',
    lat: 22.3881,
    lng: 91.8594,
    districtName: 'Chattogram',
    etpInstalled: true,
  },
  {
    name: 'British American Tobacco Bangladesh (Dhaka Factory)',
    bnName: 'ব্রিটিশ আমেরিকান টোব্যাকো বাংলাদেশ, ঢাকা ফ্যাক্টরি',
    description:
      'Large-scale leaf processing and cigarette manufacturing facility at Mohakhali, Dhaka. High compliance standards regarding airborne dust emissions and industrial odor control within a dense urban surroundings.',
    facilityType: 'OTHER',
    complianceStatus: 'COMPLIANT',
    companyName: 'British American Tobacco Bangladesh',
    lat: 23.7778,
    lng: 90.4039,
    districtName: 'Dhaka',
  },

  // ─── Food Processing ─────────────────────────────────────────────────────────
  {
    name: 'PRAN Industrial Park (Narsingdi)',
    bnName: 'প্রাণ ইন্ডাস্ট্রিয়াল পার্ক, নরসিংদী',
    description:
      'Sprawling agro-processing and beverage manufacturing park at Ghorashal, Narsingdi. Processes juice, confectionery, dairy, and snacks. Operates continuous industrial effluent treatment systems discharging near the Shitalakshya River.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'COMPLIANT',
    companyName: 'PRAN-RFL Group',
    lat: 23.9556,
    lng: 90.6272,
    districtName: 'Narsingdi',
    etpInstalled: true,
  },
  {
    name: 'Akij Food & Beverage (Dhamrai)',
    bnName: 'আকিজ ফুড অ্যান্ড বেভারেজ, ধামরাই',
    description:
      'Large beverage, dairy, and food processing plant located at Krishnapur, Dhamrai, Dhaka. Employs automated bottling and packaging lines with dedicated biological ETP units.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'COMPLIANT',
    companyName: 'Akij Group',
    lat: 23.9189,
    lng: 90.1692,
    districtName: 'Dhaka',
    etpInstalled: true,
  },

  // ─── Paper & Packaging ───────────────────────────────────────────────────────
  {
    name: 'Bashundhara Paper Mills (Unit 2)',
    bnName: 'বসুন্ধরা পেপার মিলস (ইউনিট ২)',
    description:
      'Integrated paper and packaging material plant situated at Meghna Ghat, Anowarpur, Munshiganj. Processes recycled pulp and virgin fiber. Subject to strict wastewater BOD/COD testing before discharge into river bodies.',
    facilityType: 'PAPER_MILL',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Bashundhara Paper Mills',
    lat: 23.6081,
    lng: 90.5892,
    districtName: 'Munshiganj',
  },

  // ─── Heavy Industries ────────────────────────────────────────────────────────
  {
    name: 'Walton Hi-Tech Industries (Chandra)',
    bnName: 'ওয়ালটন হাই-টেক ইন্ডাস্ট্রিজ পিএলসি',
    description:
      'Mega electronics and appliance manufacturing complex in Chandra, Gazipur. Produces refrigerators, air conditioners, compressors, and televisions. Features advanced industrial effluent and E-waste recycling systems.',
    facilityType: 'OTHER',
    complianceStatus: 'COMPLIANT',
    companyName: 'Walton Group',
    lat: 24.0414,
    lng: 90.2378,
    districtName: 'Gazipur',
    etpInstalled: true,
  },
  {
    name: 'Bangladesh Machine Tools Factory (BMTF)',
    bnName: 'বাংলাদেশ মেশিন টুলস ফ্যাক্টরি',
    description:
      'Major state-owned defense engineering and heavy manufacturing complex at Gazipur Cantonment, Joydebpur. Produces structural steel, footbridge components, assembled vehicles, and industrial hardware.',
    facilityType: 'OTHER',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Bangladesh Army',
    lat: 23.9989,
    lng: 90.4192,
    districtName: 'Gazipur',
  },

  // ─── Brick Fields ────────────────────────────────────────────────────────────
  {
    name: 'Keraniganj Brick Field Cluster',
    bnName: 'কেরানীগঞ্জ ইটভাটা শিল্পাঞ্চল',
    description:
      "Dense cluster of Fixed Chimney Kilns (FCKs) and Bull's Trench Kilns on the Keraniganj river floodplain south of Dhaka. A leading contributor to winter PM2.5 and black carbon in Dhaka. The Department of Environment classifies most kilns as non-compliant with the Brick Kiln Act.",
    facilityType: 'BRICK_FIELD',
    complianceStatus: 'NON_COMPLIANT',
    companyName: 'Private Brick Kiln Operators (Keraniganj)',
    lat: 23.6900,
    lng: 90.4000,
    districtName: 'Dhaka',
    etpInstalled: false,
  },
];
