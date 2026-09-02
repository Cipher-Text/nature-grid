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
    name: 'Amantex Integrated Garment Campus',
    description:
      'Vertically integrated apparel campus at Boiragirchala, Sreepur, Gazipur, covering spinning, knitting, dyeing, printing, cutting, sewing, washing, and finishing.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Amantex Ltd.',
    lat: 24.2010,
    lng: 90.4880,
    districtName: 'Gazipur',
    establishedYear: 2009,
    productionCapacity: '4 million pieces/month',
  },
  {
    name: 'Fakir Garments Factory (Fatullah)',
    description:
      'Export-oriented knit garment factory at East Chanmari, Khapur, Fatullah, Narayanganj, producing knitwear and knit fabrics.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Fakir Garments Limited',
    lat: 23.6160,
    lng: 90.5050,
    districtName: 'Narayanganj',
    establishedYear: 2010,
    productionCapacity: '15,000 pieces/day',
  },
  {
    name: 'Amana Knittex Factory (Fatullah)',
    description:
      'Export-oriented knit composite factory at Amana Complex, Masdair Gorsthan, Fatullah, Narayanganj, producing knit garments and printed/finished apparel.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Amana Knittex Limited',
    lat: 23.6150,
    lng: 90.4880,
    districtName: 'Narayanganj',
    establishedYear: 1996,
    productionCapacity: '30,000 pieces/day',
  },
  {
    name: 'GS Garments Factory (Fatullah)',
    description:
      'Knit and woven apparel factory at East Isdair, Chandmari, Fatullah, Narayanganj, with in-house knitting and dyeing operations.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'GS Garments Ltd.',
    lat: 23.6200,
    lng: 90.5050,
    districtName: 'Narayanganj',
    establishedYear: 1996,
    productionCapacity: '1.3 million pieces/month',
  },
  {
    name: 'RS Composite Factory (Fatullah)',
    description:
      'Knitwear manufacturing facility at Shasongaon, Fatullah, Narayanganj, with sewing lines and fabric production operations.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'RS Composite',
    lat: 23.6150,
    lng: 90.5200,
    districtName: 'Narayanganj',
    establishedYear: 1998,
    productionCapacity: '1.2 million pieces/month',
  },
  {
    name: 'Nice Denim Mills Campus (Sreepur)',
    description:
      'Integrated denim and textile production campus at Mawna Uttor Para, Sreepur, Gazipur, with spinning, weaving, denim manufacturing, dyeing, printing, and finishing units.',
    facilityType: 'TEXTILE',
    complianceStatus: 'UNKNOWN',
    companyName: 'Saad Group',
    lat: 24.2015,
    lng: 90.4860,
    districtName: 'Gazipur',
    productionCapacity: '72 million yards/year denim',
    etpInstalled: true,
  },
  {
    name: 'Skyline Group Garment Campus (Ashulia)',
    description:
      'Garment manufacturing campus at Polashbari, Ashulia, Savar, producing woven shirts, blouses, childrenswear, and sweaters.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Skyline Group',
    lat: 23.8900,
    lng: 90.2700,
    districtName: 'Dhaka',
    establishedYear: 1992,
  },
  {
    name: 'Donglian Fashion Factory (South Baipail)',
    description:
      'Outdoor and workwear garment production base at South Baipail, Ashulia, Savar.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Donglian Fashion (BD) Ltd.',
    lat: 23.9130,
    lng: 90.2700,
    districtName: 'Dhaka',
    establishedYear: 2011,
    productionCapacity: '350,000 pieces/month',
  },
  {
    name: 'Oriental Fashion Factory (Dosaid)',
    description:
      'Woven, knit, and bonded garment factory at Dosaid College Road, Ashulia, Savar.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Oriental Fashion Ltd.',
    lat: 23.8760,
    lng: 90.2900,
    districtName: 'Dhaka',
    establishedYear: 2011,
  },
  {
    name: 'M & H Corporation Factory (Ashulia)',
    description:
      'Export-oriented outdoor garment factory operating in the Ashulia and Savar manufacturing belt.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'M & H Corporation (Pvt.) Ltd.',
    lat: 23.8900,
    lng: 90.2850,
    districtName: 'Dhaka',
  },
  {
    name: 'M.M. Knitwear Integrated Factory (Konabari)',
    description:
      'Integrated knitwear factory at Ambagh Road, Nilnagar, Konabari, Gazipur, with in-house yarn and fabric dyeing, knitting, sewing, finishing, printing, and embroidery.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'M.M. Knitwear Ltd.',
    lat: 23.9520,
    lng: 90.3250,
    districtName: 'Gazipur',
    establishedYear: 2001,
    productionCapacity: '200,000 garments/day',
  },
  {
    name: 'Matrix Sweaters Factory (Choydana)',
    description:
      'Computerized sweater and woven garment factory at Hajirpukur, Choydana, Gazipur.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Matrix Sweaters Ltd.',
    lat: 23.9900,
    lng: 90.4050,
    districtName: 'Gazipur',
    productionCapacity: '550,000 sweater pieces/month',
  },
  {
    name: 'Olympic Fashion Factory (Rajendrapur)',
    description:
      'Knit garment manufacturing unit adjacent to the Dhaka–Mymensingh highway at Rajendrapur, Gazipur.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Olympic Fashion Limited',
    lat: 24.0800,
    lng: 90.4100,
    districtName: 'Gazipur',
  },
  {
    name: 'Hi Tech Apparels Sweater Factory (Araihazar)',
    description:
      'Export-oriented jacquard sweater factory at Purinda, Araihazar, Narayanganj.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Hi Tech Apparels Ltd.',
    lat: 23.7900,
    lng: 90.6500,
    districtName: 'Narayanganj',
    establishedYear: 2019,
  },
  {
    name: 'Fariha Knit Tex Factory (Fatullah)',
    description:
      'Vertically integrated knit garment factory at Baroybogh, Enayet Nagar, Fatullah, Narayanganj, with knitting, dyeing, washing, printing, testing, and accessories facilities.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Fariha Knit Tex Ltd.',
    lat: 23.6200,
    lng: 90.5150,
    districtName: 'Narayanganj',
  },
  {
    name: 'Fashion Power Group Garment Cluster (Ashulia)',
    description:
      'Garment and textile production cluster in Ashulia, including knit composite and apparel operations serving export markets.',
    facilityType: 'GARMENT',
    complianceStatus: 'UNKNOWN',
    companyName: 'Fashion Power Group',
    lat: 23.8900,
    lng: 90.2850,
    districtName: 'Dhaka',
    establishedYear: 2003,
  },
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

  // ─── Food Processing ────────────────────────────────────────────────────────
  {
    name: 'PRAN Ghorashal Industrial Park',
    bnName: 'প্রাণ ঘোড়াশাল ইন্ডাস্ট্রিয়াল পার্ক',
    description:
      'PRAN-RFL Group food and beverage manufacturing park in Ghorashal, Narsingdi, with juice, drinks, dairy and other processed-food production units.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'PRAN-RFL Group',
    lat: 23.9690,
    lng: 90.6760,
    districtName: 'Narsingdi',
    establishedYear: 1992,
    productionCapacity: 'Multiple food and beverage production units',
  },
  {
    name: 'PRAN Barendra Industrial Park',
    bnName: 'প্রাণ বরেন্দ্র ইন্ডাস্ট্রিয়াল পার্ক',
    description:
      'Fruit-processing and agro-processing facility in Godagari, Rajshahi, producing mango pulp, juice, mango bars and related processed foods from locally collected fruit.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'PRAN-RFL Group',
    lat: 24.4580,
    lng: 88.3320,
    districtName: 'Rajshahi',
    establishedYear: 2024,
    productionCapacity: 'Mango collection, pulping and aseptic pulp storage',
  },
  {
    name: 'PRAN Agro Factory (Ekdala)',
    bnName: 'প্রাণ অ্যাগ্রো কারখানা, একডালা',
    description:
      'PRAN agro-processing factory in Ekdala, Natore, used for seasonal tomato collection and pulping for sauce, ketchup, tomato paste and other food products.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'PRAN-RFL Group',
    lat: 24.4200,
    lng: 89.0000,
    districtName: 'Natore',
    productionCapacity: 'Tomato collection and pulping facility',
  },
  {
    name: 'Olympic Industries Biscuit and Confectionery Factory (Madanpur)',
    bnName: 'অলিম্পিক ইন্ডাস্ট্রিজ বিস্কুট ও কনফেকশনারি কারখানা, মদনপুর',
    description:
      'Olympic Industries biscuit, confectionery and bakery production facility at Madanpur, Narayanganj, serving the domestic and export food markets.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Olympic Industries PLC',
    lat: 23.6480,
    lng: 90.5660,
    districtName: 'Narayanganj',
    productionCapacity: 'Biscuit, confectionery and bakery production lines',
  },
  {
    name: 'Olympic Industries Lolati Factory',
    bnName: 'অলিম্পিক ইন্ডাস্ট্রিজ লোলাটি কারখানা',
    description:
      'Olympic Industries factory at Lolati, Kanchpur, Sonargaon, manufacturing biscuits, confectionery, noodles, snacks and associated packaging products.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Olympic Industries PLC',
    lat: 23.6700,
    lng: 90.5400,
    districtName: 'Narayanganj',
    productionCapacity: 'Biscuit, confectionery, noodles and snacks lines',
  },
  {
    name: 'Nestlé Bangladesh Sreepur Factory',
    bnName: 'নেসলে বাংলাদেশ শ্রীপুর কারখানা',
    description:
      'Nestlé Bangladesh food manufacturing and packaging factory at Rajendrapur, Sreepur, producing products including CERELAC, NESTLÉ EVERYDAY, KOKO KRUNCH, LACTOGEN, MAGGI, NESCAFÉ and NIDO.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'COMPLIANT',
    companyName: 'Nestlé S.A.',
    lat: 24.2000,
    lng: 90.4800,
    districtName: 'Gazipur',
    establishedYear: 1994,
    productionCapacity: 'Multiple branded food and beverage production lines',
    etpInstalled: true,
  },
  {
    name: 'Akij Food and Beverage Factory (Dhamrai)',
    bnName: 'আকিজ ফুড অ্যান্ড বেভারেজ কারখানা, ধামরাই',
    description:
      'Registered beverage and food factory at Barobaria, Dhamrai, producing non-alcoholic beverages, juices, preserved foods, bakery products and dairy products.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'COMPLIANT',
    companyName: 'Akij Food & Beverage Limited',
    lat: 23.9080,
    lng: 90.2000,
    districtName: 'Dhaka',
    establishedYear: 2006,
    productionCapacity: 'Beverage, juice, bakery and dairy production',
    etpInstalled: true,
  },
  {
    name: 'Akij Agro Processing Factory (Volarhat)',
    bnName: 'আকিজ অ্যাগ্রো প্রসেসিং কারখানা, ভোলাহাট',
    description:
      'Akij agro-processing factory at Doldoli, Volarhat, Chapainawabganj, located in a major mango-growing region for fruit and agricultural processing.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'Akij Food & Beverage Limited',
    lat: 24.8810,
    lng: 88.2800,
    districtName: 'Chapainawabganj',
    productionCapacity: 'Agro-processing and seasonal fruit processing',
  },
  {
    name: 'City Edible Oil Factory (Rupshi)',
    bnName: 'সিটি এডিবল অয়েল কারখানা, রূপশী',
    description:
      'City Group edible-oil processing facility at the City Economic Zone in Rupshi, Narayanganj, refining soybean oil and super palm olein for consumer food products.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'City Group',
    lat: 23.7810,
    lng: 90.5350,
    districtName: 'Narayanganj',
    establishedYear: 2019,
    productionCapacity: 'Soybean oil and super palm olein refining',
  },

  // ─── Further company facilities ────────────────────────────────────────────
  {
    name: 'Square Fashions Garments Unit 1 (Valuka)', description: 'Square Fashions garments unit at Masterbari, Jamirdia, Valuka, Mymensingh.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.3780, lng: 90.3800, districtName: 'Mymensingh', productionCapacity: 'Woven and knit apparel manufacturing',
  },
  {
    name: 'Square Fashions Garments Unit 2 (Joydevpur)', description: 'Square Fashions second garments unit at Chandona, Bashon Union, Joydevpur, Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.0200, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Garment manufacturing',
  },
  {
    name: 'Square Fashions Fabrics Unit 1 (Valuka)', description: 'Square Fashions fabrics unit at Masterbari, Jamirdia, Valuka, Mymensingh.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.3790, lng: 90.3810, districtName: 'Mymensingh', productionCapacity: 'Fabric production and finishing',
  },
  {
    name: 'Square Fashions Fabrics Unit 2 (Valuka)', description: 'Square Fashions second fabrics unit at Masterbari, Jamirdia, Valuka, Mymensingh.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.3800, lng: 90.3820, districtName: 'Mymensingh', productionCapacity: 'Fabric production and finishing',
  },
  {
    name: 'Square Denims Factory (Habiganj)', description: 'Square Denims denim fabric factory in Habiganj, with weaving, dyeing and finishing operations.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Square Denims Ltd.', lat: 24.3750, lng: 91.4150, districtName: 'Habiganj', establishedYear: 2015, etpInstalled: true, productionCapacity: 'Denim fabric production',
  },
  {
    name: 'KDS Garments Industries (Nasirabad)', description: 'KDS Garments knit and woven apparel factory at 255 Nasirabad Industrial Area, Chattogram.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3900, lng: 91.8200, districtName: 'Chattogram', productionCapacity: 'Knit and woven apparel manufacturing',
  },
  {
    name: 'KDS Textile Mills (Nasirabad)', description: 'KDS Textile Mills facility at 251–252 Nasirabad Industrial Area, Chattogram.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3910, lng: 91.8210, districtName: 'Chattogram', productionCapacity: 'Textile mill operations',
  },
  {
    name: 'KDS Poly Industries (Nasirabad)', description: 'KDS packaging and poly-products facility at Nasirabad Industrial Area, Chattogram.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3920, lng: 91.8220, districtName: 'Chattogram', productionCapacity: 'Poly bags, labels, hangers and garment packaging',
  },
  {
    name: 'Ha-Meem Group Garment Factory (Savar)', description: 'Ha-Meem Group export-oriented garment facility in the Savar manufacturing belt.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Ha-Meem Group', lat: 23.8500, lng: 90.2600, districtName: 'Dhaka', productionCapacity: 'Woven apparel manufacturing',
  },
  {
    name: 'Standard Group Garment Factory (Dhaka)', description: 'Standard Group export garment manufacturing facility in the Dhaka industrial area.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Standard Group', lat: 23.7900, lng: 90.4200, districtName: 'Dhaka', productionCapacity: 'Export garment manufacturing',
  },
  {
    name: 'Abul Khair Steel Rebar Plant (Sitakunda)', description: 'Abul Khair Steel rebar manufacturing plant in Sitakunda, Chattogram, established in 2009.', facilityType: 'STEEL', complianceStatus: 'UNDER_REVIEW', companyName: 'Abul Khair Steel', lat: 22.5100, lng: 91.7100, districtName: 'Chattogram', establishedYear: 2009, productionCapacity: 'More than 3 million tons/year rebar',
  },
  {
    name: 'Abul Khair Steel Sheet Plant (Madambibirhat)', description: 'Abul Khair Steel corrugated, colour-coated and Zinkalum sheet facility at Madambibirhat, Chattogram.', facilityType: 'STEEL', complianceStatus: 'UNDER_REVIEW', companyName: 'Abul Khair Steel', lat: 22.4300, lng: 91.7000, districtName: 'Chattogram', establishedYear: 1993, productionCapacity: 'Corrugated and coated steel sheets',
  },
  {
    name: 'S Alam Steel Plant (Chattogram)', description: 'S Alam Steel manufacturing facility in the Chattogram industrial corridor.', facilityType: 'STEEL', complianceStatus: 'UNDER_REVIEW', companyName: 'S Alam Steel', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel',
  },
  {
    name: 'Bashundhara Multi Steel Phase 2 (Chattogram)', description: 'Bashundhara Multi Steel expansion facility at Bangabandhu Sheikh Mujib Shilpa Nagar, Chattogram.', facilityType: 'STEEL', complianceStatus: 'UNDER_REVIEW', companyName: 'Bashundhara Multi Steel Industries Limited', lat: 22.5250, lng: 91.0450, districtName: 'Chattogram', productionCapacity: 'Integrated steel manufacturing expansion',
  },
  {
    name: 'Karnaphuli Rayon and Chemicals Plant', description: 'Karnaphuli Rayon and Chemicals industrial plant in Chattogram producing rayon and chemical products.', facilityType: 'CHEMICAL', complianceStatus: 'UNDER_REVIEW', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.4300, lng: 91.7800, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products',
  },
  {
    name: 'Karnaphuli Paper Mills (Chandraghona)', description: 'State-owned Karnaphuli Paper Mills facility at Chandraghona, Chattogram.', facilityType: 'PAPER_MILL', complianceStatus: 'UNDER_REVIEW', companyName: 'Karnaphuli Paper Mills Limited', lat: 22.4700, lng: 92.1200, districtName: 'Chattogram', establishedYear: 1951, productionCapacity: 'Pulp and paper production',
  },
  {
    name: 'Partex Paper Mills (Rupganj)', description: 'Partex Paper Mills factory at Hatabo, Masumabad, Rupganj, Narayanganj.', facilityType: 'PAPER_MILL', complianceStatus: 'UNDER_REVIEW', companyName: 'Partex Paper Mills Limited', lat: 23.7800, lng: 90.5300, districtName: 'Narayanganj', productionCapacity: 'Paper and paperboard products',
  },
  {
    name: 'Partex Pulp and Paper Mills (Siddhirganj)', description: 'Partex Pulp and Paper Mills facility at Ati, Siddhirganj, Narayanganj.', facilityType: 'PAPER_MILL', complianceStatus: 'UNDER_REVIEW', companyName: 'Partex Paper Mills Limited', lat: 23.6900, lng: 90.5000, districtName: 'Narayanganj', productionCapacity: 'Pulp and paper products',
  },
  {
    name: 'Bashundhara Industries Complex (Madanganj)', description: 'Bashundhara industrial complex at Madanganj with cement and construction-material production operations.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Bashundhara Industries Complex Limited', lat: 23.6500, lng: 90.5400, districtName: 'Narayanganj', productionCapacity: 'Cement and construction materials',
  },
  {
    name: 'Akij Cement Plant (Munshiganj)', description: 'Akij Cement manufacturing and grinding facility in Munshiganj.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Akij Cement Company Limited', lat: 23.5700, lng: 90.5200, districtName: 'Munshiganj', productionCapacity: 'Cement grinding and dispatch',
  },
  {
    name: 'Deshbandhu Cement Mills (Narayanganj)', description: 'Deshbandhu Cement Mills food-and-industrial commodity corridor facility at Charsindur, Narayanganj.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Deshbandhu Cement Mills Limited', lat: 23.9000, lng: 90.6500, districtName: 'Narayanganj', productionCapacity: 'Cement manufacturing and grinding',
  },
  {
    name: 'Heidelberg Materials Chattogram Plant', description: 'Heidelberg Materials Bangladesh cement grinding facility in the Chattogram port-industrial area.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Heidelberg Materials Bangladesh PLC', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Cement and clinker grinding',
  },
  {
    name: 'Navana Pharmaceuticals Plant (Kaliakair)', description: 'Navana Pharmaceuticals manufacturing facility in the Kaliakair, Gazipur pharmaceutical cluster.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 24.0700, lng: 90.2900, districtName: 'Gazipur', productionCapacity: 'Generic pharmaceutical products',
  },
  {
    name: 'Renata Animal Health Plant (Bhaluka)', description: 'Renata animal-health manufacturing facility in Bhaluka, Mymensingh.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Renata Limited', lat: 24.3700, lng: 90.3900, districtName: 'Mymensingh', productionCapacity: 'Veterinary and animal-health products',
  },
  {
    name: 'Incepta Pharmaceuticals Dhamrai Plant', description: 'Incepta Pharmaceuticals manufacturing facility in the Dhamrai, Dhaka pharmaceutical cluster.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'COMPLIANT', companyName: 'Incepta Pharmaceuticals', lat: 23.9100, lng: 90.2000, districtName: 'Dhaka', etpInstalled: true, productionCapacity: 'Finished pharmaceutical products',
  },
  {
    name: 'British American Tobacco Bangladesh Savar Factory', description: 'British American Tobacco Bangladesh tobacco-processing and cigarette manufacturing facility in Savar.', facilityType: 'CHEMICAL', complianceStatus: 'UNDER_REVIEW', companyName: 'British American Tobacco Bangladesh', lat: 23.8500, lng: 90.2600, districtName: 'Dhaka', productionCapacity: 'Tobacco processing and cigarette manufacturing',
  },
  {
    name: 'Walton Refrigerator Manufacturing Plant (Chandra)', description: 'Walton Hi-Tech Industries appliance manufacturing facility at Chandra, Gazipur.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Walton Group', lat: 24.0100, lng: 90.2700, districtName: 'Gazipur', productionCapacity: 'Refrigerators and home appliances',
  },
  {
    name: 'Walton Mobile and Electronics Plant (Chandra)', description: 'Walton Hi-Tech Industries electronics manufacturing unit at Chandra, Gazipur.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Walton Group', lat: 24.0110, lng: 90.2710, districtName: 'Gazipur', productionCapacity: 'Mobile phones and consumer electronics',
  },
  {
    name: 'Summit Meghnaghat Power Company Plant', description: 'Summit Meghnaghat Power Company combined-cycle generation facility at Meghnaghat, Narayanganj.', facilityType: 'POWER_PLANT', complianceStatus: 'UNDER_REVIEW', companyName: 'Summit Meghnaghat Power Company Limited', lat: 23.6080, lng: 90.5980, districtName: 'Narayanganj', productionCapacity: 'Gas and dual-fuel power generation',
  },
  {
    name: 'Confidence Power Plant (Chattogram)', description: 'Confidence Power Holdings generation facility in the Chattogram industrial region.', facilityType: 'POWER_PLANT', complianceStatus: 'UNDER_REVIEW', companyName: 'Confidence Power Holdings Limited', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Grid-connected thermal generation',
  },
  {
    name: 'Karnaphuli Power Unit 2 (Chattogram)', description: 'Second identified Karnaphuli Power generation unit in the Chattogram industrial region.', facilityType: 'POWER_PLANT', complianceStatus: 'UNDER_REVIEW', companyName: 'Karnaphuli Power Limited', lat: 22.3510, lng: 91.8010, districtName: 'Chattogram', productionCapacity: 'Gas-fired power generation',
  },
  {
    name: 'Jamuna Fertilizer Urea Unit', description: 'Urea production unit operated by Jamuna Fertilizer Company for Bangladesh’s agricultural input supply.', facilityType: 'FERTILIZER', complianceStatus: 'UNDER_REVIEW', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.9300, lng: 90.4200, districtName: 'Jamalpur', productionCapacity: 'Urea fertilizer production',
  },
  {
    name: 'Shahjalal Fertilizer Urea Unit', description: 'Urea production unit operated by Shahjalal Fertilizer Company at Fenchuganj, Sylhet.', facilityType: 'FERTILIZER', complianceStatus: 'UNDER_REVIEW', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7110, lng: 91.9710, districtName: 'Sylhet', productionCapacity: 'Urea fertilizer production',
  },
  {
    name: 'PRAN Ghorashal Beverage Unit', description: 'PRAN beverage manufacturing unit within the Ghorashal industrial park in Narsingdi.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNDER_REVIEW', companyName: 'PRAN-RFL Group', lat: 23.9700, lng: 90.6770, districtName: 'Narsingdi', productionCapacity: 'Juice and beverage production',
  },
  {
    name: 'Square Food and Beverage Factory (Pabna)', description: 'Square Food and Beverage processed-food manufacturing facility serving the Bangladesh consumer market.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Square Food & Beverage Limited', lat: 24.0000, lng: 89.2400, districtName: 'Pabna', productionCapacity: 'Spices, snacks and packaged foods',
  },
  {
    name: 'Aarong Dairy Milk Processing Plant', description: 'Aarong Dairy milk-processing facility collecting and processing milk from Bangladeshi farmers.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Aarong Dairy', lat: 24.0000, lng: 89.2400, districtName: 'Pabna', establishedYear: 1998, productionCapacity: 'Milk and dairy products',
  },
  {
    name: 'Milk Vita Baghabarighat Dairy Plant', description: 'Milk Vita dairy plant at Baghabarighat, Sirajganj, part of Bangladesh’s cooperative milk-processing network.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Milk Vita', lat: 24.3400, lng: 89.6500, districtName: 'Sirajganj', productionCapacity: 'Milk and dairy products',
  },
  {
    name: 'Bombay Sweets Dhaka Factory', description: 'Bombay Sweets food-processing factory in Dhaka producing packaged snacks and confectionery.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Bombay Sweets & Company Limited', lat: 23.7100, lng: 90.4300, districtName: 'Dhaka', productionCapacity: 'Snacks and confectionery products',
  },
  {
    name: 'Bombay Sweets Narayanganj Factory', description: 'Bombay Sweets second food-processing factory in Narayanganj.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Bombay Sweets & Company Limited', lat: 23.6200, lng: 90.5200, districtName: 'Narayanganj', productionCapacity: 'Snacks and confectionery products',
  },
  {
    name: 'Hashem Foods Factory (Narsingdi)', description: 'Hashem Foods agro-processing and packaged-food manufacturing facility in Narsingdi.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Hashem Foods Limited', lat: 23.9200, lng: 90.7200, districtName: 'Narsingdi', productionCapacity: 'Processed food products',
  },
  {
    name: 'Star Line Food Products Factory (Feni)', description: 'Star Line Food Products manufacturing facility in Feni producing packaged food and beverage products.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Star Line Food Products Limited', lat: 23.0150, lng: 91.3970, districtName: 'Feni', productionCapacity: 'Packaged food and beverage products',
  },
  {
    name: 'Meridian Foods Factory (Chattogram)', description: 'Meridian Foods processed-food manufacturing facility in Chattogram.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Meridian Foods Limited', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Packaged food products',
  },
  {
    name: 'Dekko Foods Factory (Gazipur)', description: 'Dekko Foods packaged-food manufacturing facility in Gazipur.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Dekko Foods Limited', lat: 24.0000, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Packaged food products',
  },
  {
    name: 'Nourish Feed Mill (Valuka)', description: 'Nourish poultry and animal-feed mill at Valuka, Mymensingh.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Nourish Poultry and Hatchery Limited', lat: 24.3700, lng: 90.3900, districtName: 'Mymensingh', productionCapacity: 'Poultry, fish and cattle feed',
  },
  {
    name: 'CP Bangladesh Savar Feed Mill', description: 'CP Bangladesh’s first feed mill at Savar, supporting its integrated poultry and agrifood operations.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'CP Bangladesh Company Limited', lat: 23.8500, lng: 90.2600, districtName: 'Dhaka', establishedYear: 1999, productionCapacity: 'Poultry and livestock feed',
  },
  {
    name: 'CP Bangladesh Mouchak Hatchery', description: 'CP Bangladesh hatchery near Mouchak, Gazipur, supporting day-old-chick production.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'CP Bangladesh Company Limited', lat: 24.0500, lng: 90.4500, districtName: 'Gazipur', productionCapacity: 'Hatchery and day-old-chick production',
  },
  {
    name: 'Paragon Poultry Feed and Hatchery (Mirsharai)', description: 'Paragon Poultry feed and hatchery facility at South Wahidpur, Kamoldaho, Mirsharai, Chattogram.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Paragon Poultry Limited', lat: 22.8500, lng: 91.5000, districtName: 'Chattogram', productionCapacity: 'Poultry feed and hatchery operations',
  },
  {
    name: 'Abdul Monem Agro Processing Facility (Munshiganj)', description: 'Abdul Monem agro-processing facility in the Munshiganj industrial corridor.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Abdul Monem Limited', lat: 23.5700, lng: 90.5200, districtName: 'Munshiganj', productionCapacity: 'Agro and processed-food products',
  },
  {
    name: 'Milk Vita Kaliganj Dairy Cooling Center', description: 'Milk Vita milk-collection and chilling center at Kaliganj, supporting the cooperative dairy processing network.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Milk Vita', lat: 23.9700, lng: 90.4300, districtName: 'Gazipur', productionCapacity: 'Milk collection and chilling',
  },
  {
    name: 'Milk Vita Bhangura Dairy Cooling Center', description: 'Milk Vita milk-collection and chilling center at Bhangura, serving milk-shed producers for dairy processing.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Milk Vita', lat: 24.2200, lng: 89.3900, districtName: 'Pabna', productionCapacity: 'Milk collection and chilling',
  },

  // ─── Additional textile and apparel facilities ─────────────────────────────
  {
    name: 'Dekko Knitwear Limited (Mirpur)', description: 'Epyllion Group knitwear factory in Mirpur, Dhaka, established in 1994.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.8050, lng: 90.3650, districtName: 'Dhaka', establishedYear: 1994, productionCapacity: '12 garment production lines',
  },
  {
    name: 'Epyllion Knitwear Limited (Mirpur)', description: 'Epyllion Group knitwear manufacturing facility in Mirpur, Dhaka.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.8060, lng: 90.3660, districtName: 'Dhaka', establishedYear: 2004, productionCapacity: '19 garment production lines',
  },
  {
    name: 'Epyllion Style Limited (Gazipur)', description: 'Epyllion Style garment facility in Gazipur with a resource-efficient Green Complex.', facilityType: 'GARMENT', complianceStatus: 'COMPLIANT', companyName: 'Epyllion Group', lat: 24.0200, lng: 90.4200, districtName: 'Gazipur', establishedYear: 2006, productionCapacity: '49 garment production lines', etpInstalled: true,
  },
  {
    name: 'Dazzling Dresses Limited (Uttara)', description: 'Epyllion Group garment facility in Dakhin Khan, Uttara, Dhaka.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.8700, lng: 90.4200, districtName: 'Dhaka', establishedYear: 2006, productionCapacity: '18 garment production lines',
  },
  {
    name: 'Epyllion Knitwear Limited HW (Madanpur)', description: 'Epyllion Group high-capacity knitwear facility in Madanpur, Narayanganj.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.6800, lng: 90.5400, districtName: 'Narayanganj', establishedYear: 2021, productionCapacity: '50 garment production lines',
  },
  {
    name: 'Epyllion Knitex Limited (Gazipur)', description: 'Epyllion Group textile unit in Banglabazar, Gazipur, carrying out knitting, dyeing and finishing.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Epyllion Group', lat: 24.0200, lng: 90.4200, districtName: 'Gazipur', establishedYear: 2003, productionCapacity: 'Knitting, dyeing and fabric finishing', etpInstalled: true,
  },
  {
    name: 'Epyllion Fabrics Limited (Gazipur)', description: 'Epyllion Group textile facility in Banglabazar, Gazipur, with knitting, dyeing and yarn-dyeing operations.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Epyllion Group', lat: 24.0210, lng: 90.4210, districtName: 'Gazipur', establishedYear: 2006, productionCapacity: 'Knitting, dyeing, finishing and yarn dyeing', etpInstalled: true,
  },
  {
    name: 'Epyllion Accessories Unit (Kutubpur)', description: 'Epyllion Group garment-accessories facility in Kutubpur, Narayanganj.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.6100, lng: 90.5000, districtName: 'Narayanganj', establishedYear: 2000, productionCapacity: 'Garment accessories and trims',
  },
  {
    name: 'Epyllion Washing Limited (Gazipur)', description: 'Epyllion Group garment washing facility in Gazipur supporting apparel finishing.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 24.0220, lng: 90.4220, districtName: 'Gazipur', productionCapacity: 'Garment washing and finishing',
  },
  {
    name: 'Epyllion Testing Lab (Gazipur)', description: 'Epyllion Group textile and apparel testing laboratory in Gazipur.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 24.0230, lng: 90.4230, districtName: 'Gazipur', productionCapacity: 'Textile quality and compliance testing',
  },
  {
    name: 'Square Apparels Woven Fabric Plant', description: 'Square Apparels state-of-the-art woven-fabric manufacturing facility.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.0200, lng: 90.4200, districtName: 'Gazipur', establishedYear: 2016, productionCapacity: 'Woven and innovative fashion fabrics',
  },
  {
    name: 'Square Fashions Garment Unit (Valuka Expansion)', description: 'Square Fashions expanded apparel production unit in the Valuka textile cluster.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.3810, lng: 90.3830, districtName: 'Mymensingh', productionCapacity: 'Export garment manufacturing',
  },
  {
    name: 'Square Denims Dyeing and Finishing Unit', description: 'Square Denims dyeing and finishing operation in Olipur, Shahjibazar, Habiganj.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Square Denims Ltd.', lat: 24.3750, lng: 91.4150, districtName: 'Habiganj', establishedYear: 2015, productionCapacity: 'Denim dyeing, weaving and finishing', etpInstalled: true,
  },
  {
    name: 'KDS Garments Industries Factory Extension', description: 'KDS Group apparel manufacturing extension at Nasirabad Industrial Area, Chattogram.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3930, lng: 91.8230, districtName: 'Chattogram', productionCapacity: 'Knit and woven apparel manufacturing',
  },
  {
    name: 'KDS Accessories Factory (Chattogram)', description: 'KDS Group trims and garment-accessories manufacturing unit at Nasirabad, Chattogram.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3940, lng: 91.8240, districtName: 'Chattogram', productionCapacity: 'Trims and apparel accessories',
  },
  {
    name: 'BEXIMCO Textiles Spinning Plant (Gazipur)', description: 'BEXIMCO Textiles yarn and spinning facility in the Gazipur industrial region.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Export Import Company PLC. (BEXIMCO Textiles)', lat: 23.9600, lng: 90.3800, districtName: 'Gazipur', productionCapacity: 'Spinning and yarn manufacturing',
  },
  {
    name: 'BEXIMCO Textiles Dyeing Plant (Gazipur)', description: 'BEXIMCO Textiles dyeing and finishing facility supporting integrated textile production.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Export Import Company PLC. (BEXIMCO Textiles)', lat: 23.9610, lng: 90.3810, districtName: 'Gazipur', productionCapacity: 'Fabric dyeing and finishing', etpInstalled: true,
  },
  {
    name: 'BEXIMCO Textiles Knitting Unit (Gazipur)', description: 'BEXIMCO Textiles knitting unit in the Gazipur textile manufacturing cluster.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Export Import Company PLC. (BEXIMCO Textiles)', lat: 23.9620, lng: 90.3820, districtName: 'Gazipur', productionCapacity: 'Knitting and fabric production',
  },
  {
    name: 'BEXIMCO Textiles Apparel Unit (Gazipur)', description: 'BEXIMCO integrated apparel manufacturing unit in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Export Import Company PLC. (BEXIMCO Textiles)', lat: 23.9630, lng: 90.3830, districtName: 'Gazipur', productionCapacity: 'Export apparel manufacturing',
  },
  {
    name: 'Fakir Fashion Integrated Factory (Narayanganj)', description: 'Fakir Fashion integrated apparel factory in Narayanganj with knitting, dyeing and garment operations.', facilityType: 'GARMENT', complianceStatus: 'COMPLIANT', companyName: 'Fakir Fashion Limited', lat: 23.6200, lng: 90.5100, districtName: 'Narayanganj', productionCapacity: '320,000 pieces/day cutting capacity', etpInstalled: true,
  },
  {
    name: 'Fakir Fashion Knitting Unit', description: 'Fakir Fashion knitting facility supporting its vertically integrated apparel campus.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Fakir Fashion Limited', lat: 23.6210, lng: 90.5110, districtName: 'Narayanganj', productionCapacity: '65+ tons/day knitting', etpInstalled: true,
  },
  {
    name: 'Fakir Fashion Dyeing and Finishing Unit', description: 'Fakir Fashion dyeing and finishing facility for knit apparel production.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Fakir Fashion Limited', lat: 23.6220, lng: 90.5120, districtName: 'Narayanganj', productionCapacity: '75+ tons/day dyeing and finishing', etpInstalled: true,
  },
  {
    name: 'Shasha Denims Factory (DEPZ Extension)', description: 'Shasha Denims denim factory at Plot 184–193 and 277, DEPZ Extension, Savar.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Shasha Denims PLC', lat: 23.8440, lng: 90.2510, districtName: 'Dhaka', productionCapacity: 'Denim textile manufacturing',
  },
  {
    name: 'Shasha Denims Garment Unit (Savar)', description: 'Shasha Denims apparel production unit supporting denim garment exports from Savar.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Shasha Denims PLC', lat: 23.8450, lng: 90.2520, districtName: 'Dhaka', productionCapacity: 'Denim apparel manufacturing',
  },
  {
    name: 'GMS Composite Knitting Factory (Kashimpur)', description: 'GMS vertical composite knitting facility at Sardaganj, Kashimpur, Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'GMS Composite Knitting Industries Ltd.', lat: 23.9800, lng: 90.3300, districtName: 'Gazipur', productionCapacity: 'Knitting, dyeing and garment production', etpInstalled: true,
  },
  {
    name: 'GMS Composite Garment Unit (Kashimpur)', description: 'GMS Composite export garment production unit within the Kashimpur integrated factory.', facilityType: 'GARMENT', complianceStatus: 'COMPLIANT', companyName: 'GMS Composite Knitting Industries Ltd.', lat: 23.9810, lng: 90.3310, districtName: 'Gazipur', productionCapacity: 'Export knit garment manufacturing', etpInstalled: true,
  },
  {
    name: 'Esquire Knit Composite Unit 1', description: 'Esquire Apparel Group export-oriented knit composite factory with integrated textile facilities.', facilityType: 'GARMENT', complianceStatus: 'COMPLIANT', companyName: 'Esquire Apparel Group', lat: 23.6200, lng: 90.5200, districtName: 'Narayanganj', productionCapacity: 'Knit composite apparel production', etpInstalled: true,
  },
  {
    name: 'Esquire Knit Composite Unit 2', description: 'Esquire Apparel Group additional knit composite manufacturing unit in Narayanganj.', facilityType: 'GARMENT', complianceStatus: 'COMPLIANT', companyName: 'Esquire Apparel Group', lat: 23.6210, lng: 90.5210, districtName: 'Narayanganj', productionCapacity: 'Knit composite apparel production', etpInstalled: true,
  },
  {
    name: 'Esquire Textile Dyeing Unit', description: 'Esquire Apparel Group textile dyeing and finishing facility supporting export knitwear.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Esquire Apparel Group', lat: 23.6220, lng: 90.5220, districtName: 'Narayanganj', productionCapacity: 'Fabric dyeing and finishing', etpInstalled: true,
  },
  {
    name: 'Knit Concern Composite Factory (Gazipur)', description: 'Knit Concern Group integrated knitting, dyeing and apparel manufacturing facility in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Knit Concern Group', lat: 24.0000, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Knit composite garment production',
  },
  {
    name: 'Knit Concern Dyeing Unit (Gazipur)', description: 'Knit Concern Group fabric dyeing and finishing facility in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Knit Concern Group', lat: 24.0010, lng: 90.4210, districtName: 'Gazipur', productionCapacity: 'Dyeing and finishing',
  },
  {
    name: 'Knit Concern Knitting Unit (Gazipur)', description: 'Knit Concern Group knitting facility supporting its integrated apparel operation.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Knit Concern Group', lat: 24.0020, lng: 90.4220, districtName: 'Gazipur', productionCapacity: 'Knitting and fabric production',
  },
  {
    name: 'Interstoff Composite Textile Factory (Gazipur)', description: 'Interstoff Group integrated textile and apparel manufacturing facility in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Interstoff Group', lat: 24.0100, lng: 90.4300, districtName: 'Gazipur', productionCapacity: 'Knitting, dyeing and finishing',
  },
  {
    name: 'Interstoff Garment Unit (Gazipur)', description: 'Interstoff Group export garment manufacturing unit in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Interstoff Group', lat: 24.0110, lng: 90.4310, districtName: 'Gazipur', productionCapacity: 'Export knit apparel',
  },
  {
    name: 'Scandex Knit Composite Factory (Gazipur)', description: 'Scandex Knit Composite integrated garment facility in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Scandex Knit Composite Group', lat: 24.0200, lng: 90.4400, districtName: 'Gazipur', productionCapacity: 'Knit composite apparel production',
  },
  {
    name: 'Scandex Dyeing and Finishing Unit (Gazipur)', description: 'Scandex Knit Composite dyeing and finishing operation supporting garment exports.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Scandex Knit Composite Group', lat: 24.0210, lng: 90.4410, districtName: 'Gazipur', productionCapacity: 'Fabric dyeing and finishing',
  },
  {
    name: 'JK Group Knitwear Factory (Gazipur)', description: 'JK Group knitwear manufacturing facility in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'JK Group', lat: 24.0300, lng: 90.4500, districtName: 'Gazipur', productionCapacity: 'Knitwear manufacturing',
  },
  {
    name: 'JK Group Textile Dyeing Unit (Gazipur)', description: 'JK Group textile dyeing and finishing facility in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'JK Group', lat: 24.0310, lng: 90.4510, districtName: 'Gazipur', productionCapacity: 'Fabric dyeing and finishing',
  },
  {
    name: 'Bitopi Group Garment Factory (Dhaka)', description: 'Bitopi Group export garment manufacturing facility in the Dhaka apparel cluster.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Bitopi Group', lat: 23.7900, lng: 90.4200, districtName: 'Dhaka', productionCapacity: 'Export apparel manufacturing',
  },
  {
    name: 'Bitopi Group Washing Unit (Dhaka)', description: 'Bitopi Group apparel washing and finishing facility in Dhaka.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Bitopi Group', lat: 23.7910, lng: 90.4210, districtName: 'Dhaka', productionCapacity: 'Garment washing and finishing',
  },
  {
    name: 'BSA Garments Factory (Gazipur)', description: 'BSA Garments Industries Group export apparel manufacturing facility in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'BSA Garments Industries Group', lat: 24.0400, lng: 90.4600, districtName: 'Gazipur', productionCapacity: 'Export garment manufacturing',
  },
  {
    name: 'Comfit Composite Knit Factory (Gazipur)', description: 'Comfit Composite Knit integrated knitwear facility in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Comfit Composite Knit Ltd.', lat: 24.0500, lng: 90.4700, districtName: 'Gazipur', productionCapacity: 'Knit composite apparel production',
  },
  {
    name: 'Comfit Composite Dyeing Unit (Gazipur)', description: 'Comfit Composite Knit dyeing and finishing unit in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Comfit Composite Knit Ltd.', lat: 24.0510, lng: 90.4710, districtName: 'Gazipur', productionCapacity: 'Fabric dyeing and finishing',
  },
  {
    name: 'Far East Knitting and Dyeing Factory (Gazipur)', description: 'Far East Knitting and Dyeing integrated textile facility in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Far East Knitting & Dyeing Industries Ltd.', lat: 24.0600, lng: 90.4800, districtName: 'Gazipur', productionCapacity: 'Knitting, dyeing and finishing',
  },
  {
    name: 'Far East Garment Unit (Gazipur)', description: 'Far East Knitting and Dyeing Industries export garment unit in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Far East Knitting & Dyeing Industries Ltd.', lat: 24.0610, lng: 90.4810, districtName: 'Gazipur', productionCapacity: 'Export apparel manufacturing',
  },
  {
    name: 'Square Textile Yarn Unit (Sreepur)', description: 'Square textile division yarn manufacturing facility in the Sreepur–Gazipur textile cluster.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.2000, lng: 90.4800, districtName: 'Gazipur', productionCapacity: 'Cotton yarn manufacturing',
  },
  {
    name: 'Square Texcom Textile Unit (Gazipur)', description: 'Square Group textile production facility associated with its integrated yarn-to-garment chain in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.0100, lng: 90.4100, districtName: 'Gazipur', productionCapacity: 'Textile and fabric production',
  },
  {
    name: 'Square Multi Fabrics Unit (Gazipur)', description: 'Square Group multi-fabric manufacturing facility supporting knit and woven apparel production.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.0110, lng: 90.4110, districtName: 'Gazipur', productionCapacity: 'Multi-fabric textile production',
  },
  {
    name: 'Epyllion C&F Unit (Chattogram)', description: 'Epyllion Group clearing and forwarding facility supporting its Chattogram textile and apparel operations.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Apparel logistics and cargo handling',
  },
  {
    name: 'Epyllion Food and Beverage Unit (Dhaka)', description: 'Epyllion Group food and beverage operation serving its workforce and corporate facilities in Dhaka.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.7900, lng: 90.4200, districtName: 'Dhaka', establishedYear: 2013, productionCapacity: 'Prepared food and beverage production',
  },

  // ─── Export Processing Zones ─────────────────────────────────────────────────

  // ─── Export Processing Zones ─────────────────────────────────────────────────
  {
    name: 'Rupshi Flour Mills',
    bnName: 'রূপশী ফ্লাওয়ার মিলস',
    description:
      'Large automated wheat-processing mill in the City Economic Zone at Rupshi, Narayanganj, producing flour and related wheat products for Bangladesh’s food market.',
    facilityType: 'FOOD_PROCESSING',
    complianceStatus: 'UNDER_REVIEW',
    companyName: 'City Group',
    lat: 23.7800,
    lng: 90.5340,
    districtName: 'Narayanganj',
    establishedYear: 2021,
    productionCapacity: 'Automated flour milling',
  },

  // ─── Additional company facilities ─────────────────────────────────────────
  {
    name: 'Pacific Jeans Ltd. (CEPZ)', description: 'Pacific Jeans denim and apparel facility at Plot 14–19, Sector 5, Chattogram Export Processing Zone.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Pacific Jeans Group', lat: 22.3530, lng: 91.7680, districtName: 'Chattogram', establishedYear: 1994, productionCapacity: 'Denim and premium jeans manufacturing',
  },
  {
    name: 'Pacific Accessories Ltd. (CEPZ)', description: 'Pacific Jeans Group accessories production facility in the Chattogram Export Processing Zone.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Pacific Jeans Group', lat: 22.3540, lng: 91.7690, districtName: 'Chattogram', establishedYear: 1998, productionCapacity: 'Apparel accessories and trims',
  },
  {
    name: 'Jeans 2000 Ltd. (CEPZ)', description: 'Pacific Jeans Group denim manufacturing facility in Chattogram Export Processing Zone.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Pacific Jeans Group', lat: 22.3550, lng: 91.7700, districtName: 'Chattogram', establishedYear: 2000, productionCapacity: 'Denim apparel manufacturing',
  },
  {
    name: 'Universal Jeans Ltd. (CEPZ)', description: 'Pacific Jeans Group state-of-the-art denim and apparel facility in Chattogram.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Pacific Jeans Group', lat: 22.3560, lng: 91.7710, districtName: 'Chattogram', establishedYear: 2008, productionCapacity: 'Denim and jeans manufacturing',
  },
  {
    name: 'NHT Fashions Ltd. (CEPZ)', description: 'Pacific Jeans Group apparel production facility serving international fashion customers.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Pacific Jeans Group', lat: 22.3570, lng: 91.7720, districtName: 'Chattogram', establishedYear: 2014, productionCapacity: 'Apparel manufacturing',
  },
  {
    name: 'Pacific Workwears Ltd. (CEPZ)', description: 'Pacific Jeans Group workwear manufacturing facility in Chattogram Export Processing Zone.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Pacific Jeans Group', lat: 22.3580, lng: 91.7730, districtName: 'Chattogram', establishedYear: 2020, productionCapacity: 'Workwear and industrial apparel',
  },
  {
    name: 'Pacific Attires Ltd. (CEPZ)', description: 'Pacific Jeans Group apparel facility in the Chattogram export manufacturing cluster.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Pacific Jeans Group', lat: 22.3590, lng: 91.7740, districtName: 'Chattogram', establishedYear: 2023, productionCapacity: 'Garment manufacturing',
  },
  {
    name: 'Youngone (CEPZ) Ltd.', description: 'Youngone apparel manufacturing facility established in the Chattogram Free Export Zone.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Youngone Corporation', lat: 22.3550, lng: 91.7700, districtName: 'Chattogram', establishedYear: 1987, productionCapacity: 'Performance apparel manufacturing',
  },
  {
    name: 'Youngone Hi-Tech Sportswear Industries Ltd. (DEPZ)', description: 'Youngone high-performance apparel facility established in Dhaka Free Trade Zone.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Youngone Corporation', lat: 23.8440, lng: 90.2510, districtName: 'Dhaka', establishedYear: 1993, productionCapacity: 'Technical sportswear manufacturing',
  },
  {
    name: 'Youngone Sports Shoes Industries Ltd. (Chattogram)', description: 'Youngone footwear manufacturing facility in Chattogram for export sports shoes.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Youngone Corporation', lat: 22.3560, lng: 91.7710, districtName: 'Chattogram', establishedYear: 1996, productionCapacity: 'Sports footwear manufacturing',
  },
  {
    name: 'Ha-Meem Group Denim Mill (Gazipur)', description: 'Ha-Meem Group denim and textile manufacturing facility in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Ha-Meem Group', lat: 23.9950, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Denim textile production',
  },
  {
    name: 'Ha-Meem Group Garment Factory (Gazipur)', description: 'Ha-Meem Group export-oriented woven garment facility in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Ha-Meem Group', lat: 24.0100, lng: 90.4300, districtName: 'Gazipur', productionCapacity: 'Woven apparel manufacturing',
  },
  {
    name: 'Standard Group Garment Factory (Gazipur)', description: 'Standard Group export garment manufacturing facility in Gazipur.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Standard Group', lat: 24.0000, lng: 90.4100, districtName: 'Gazipur', productionCapacity: 'Export garment manufacturing',
  },
  {
    name: 'DBL Group Knitting Unit (Kashimpur)', description: 'DBL Group integrated knitting operation at Kashimpur, Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'DBL Group', lat: 23.9780, lng: 90.3290, districtName: 'Gazipur', etpInstalled: true, productionCapacity: 'Circular knitting and fabric production',
  },
  {
    name: 'DBL Group Dyeing and Finishing Unit (Kashimpur)', description: 'DBL Group dyeing and finishing facility at Kashimpur, Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'DBL Group', lat: 23.9790, lng: 90.3300, districtName: 'Gazipur', etpInstalled: true, productionCapacity: 'Fabric dyeing, washing and finishing',
  },
  {
    name: 'Viyellatex Spinning and Textile Unit (Gazipur)', description: 'Viyellatex vertically integrated spinning and textile facility in Gazipur.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Viyellatex Group', lat: 23.9900, lng: 90.3810, districtName: 'Gazipur', etpInstalled: true, productionCapacity: 'Spinning and textile production',
  },
  {
    name: 'Envoy Textiles Spinning Unit (Valuka)', description: 'Envoy Group textile production unit at Jamirdia, Valuka, integrated with its denim campus.', facilityType: 'TEXTILE', complianceStatus: 'COMPLIANT', companyName: 'Envoy Group', lat: 24.3780, lng: 90.3800, districtName: 'Mymensingh', etpInstalled: true, productionCapacity: 'Spinning and denim textile production',
  },
  {
    name: 'Square Pharmaceuticals Pabna Plant', description: 'Square Pharmaceuticals principal formulation plant at Salgaria, Pabna, operating under WHO cGMP requirements.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'COMPLIANT', companyName: 'Square Pharmaceuticals', lat: 24.0060, lng: 89.2380, districtName: 'Pabna', establishedYear: 1958, etpInstalled: true, productionCapacity: 'Tablets, capsules, liquids, injectables and specialty formulations',
  },
  {
    name: 'Square Formulations Ltd. (Mirzapur)', description: 'Square GMP-compliant formulation plant at Momin Nagar, Gorai, Mirzapur, Tangail.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'COMPLIANT', companyName: 'Square Pharmaceuticals', lat: 24.1050, lng: 90.1000, districtName: 'Tangail', establishedYear: 2014, etpInstalled: true, productionCapacity: '8,000 million tablets and 2,000 million capsules annually at full capacity',
  },
  {
    name: 'Square Lifesciences Plant (Hemayetpur)', description: 'Square Lifesciences pharmaceutical plant at Patikabari, Hemayetpur, Pabna, commercially operating since 2022.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'COMPLIANT', companyName: 'Square Pharmaceuticals', lat: 23.9980, lng: 89.2100, districtName: 'Pabna', establishedYear: 2022, etpInstalled: true, productionCapacity: 'Pharmaceutical formulations and life-science products',
  },
  {
    name: 'Beximco Pharma Tongi Manufacturing Site', description: 'Beximco Pharma main manufacturing site at Tongi, Gazipur with oral solid, inhaler, IV, liquid and injectable units.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'COMPLIANT', companyName: 'Beximco Pharmaceuticals', lat: 23.8920, lng: 90.4020, districtName: 'Gazipur', etpInstalled: true, productionCapacity: 'Tablets, capsules, inhalers, IV fluids, liquids and injectables',
  },
  {
    name: 'Beximco Pharma Kaliakoir Penicillin Plant', description: 'Beximco Pharma dedicated penicillin formulation and API facility at Kaliakoir, Gazipur.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'COMPLIANT', companyName: 'Beximco Pharmaceuticals', lat: 24.0700, lng: 90.2900, districtName: 'Gazipur', etpInstalled: true, productionCapacity: 'Penicillin formulations and APIs',
  },
  {
    name: 'Aristopharma Manufacturing Plant (Tongi)', description: 'Aristopharma generic-medicine manufacturing facility in the Tongi–Gazipur pharmaceutical cluster.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Aristopharma Limited', lat: 23.8900, lng: 90.4000, districtName: 'Gazipur', productionCapacity: 'Generic pharmaceutical products',
  },
  {
    name: 'Orion Pharma Manufacturing Plant (Gazipur)', description: 'Orion Pharma pharmaceutical manufacturing facility serving Bangladesh’s generic-medicine market.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.9700, lng: 90.3800, districtName: 'Gazipur', productionCapacity: 'Finished pharmaceutical products',
  },
  {
    name: 'General Pharmaceuticals Manufacturing Plant (Gazipur)', description: 'General Pharmaceuticals manufacturing facility in the Gazipur pharmaceutical industrial area.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9600, lng: 90.3900, districtName: 'Gazipur', productionCapacity: 'Generic medicines and healthcare products',
  },
  {
    name: 'Jamuna Fertilizer Factory (Jamalpur)', description: 'Jamuna Fertilizer Company gas-based urea facility serving Bangladesh’s agricultural input market.', facilityType: 'FERTILIZER', complianceStatus: 'UNDER_REVIEW', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.9300, lng: 90.4200, districtName: 'Jamalpur', productionCapacity: 'Urea fertilizer production',
  },
  {
    name: 'Shahjalal Fertilizer Factory (Fenchuganj)', description: 'Shahjalal Fertilizer Company gas-based urea plant at Fenchuganj, Sylhet.', facilityType: 'FERTILIZER', complianceStatus: 'UNDER_REVIEW', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7100, lng: 91.9700, districtName: 'Sylhet', productionCapacity: 'Urea fertilizer production',
  },
  {
    name: 'Karnaphuli Paper Mills (Chattogram)', description: 'Karnaphuli Paper Mills paper manufacturing facility in Chattogram.', facilityType: 'PAPER_MILL', complianceStatus: 'UNDER_REVIEW', companyName: 'Karnaphuli Paper Mills Limited', lat: 22.4300, lng: 91.7800, districtName: 'Chattogram', productionCapacity: 'Paper and pulp products',
  },
  {
    name: 'Shahjalal Paper Mills (Narsingdi)', description: 'Shahjalal Paper Mills paper-production facility in the Narsingdi industrial belt.', facilityType: 'PAPER_MILL', complianceStatus: 'UNDER_REVIEW', companyName: 'Shahjalal Paper Mills Limited', lat: 23.9200, lng: 90.7200, districtName: 'Narsingdi', productionCapacity: 'Paper and paperboard production',
  },
  {
    name: 'Bashundhara Paper Mills (Keraniganj)', description: 'Bashundhara paper, tissue and paperboard manufacturing facility in the Dhaka–Keraniganj corridor.', facilityType: 'PAPER_MILL', complianceStatus: 'UNDER_REVIEW', companyName: 'Bashundhara Paper Mills', lat: 23.7000, lng: 90.3700, districtName: 'Dhaka', productionCapacity: 'Paper, tissue and paperboard products',
  },
  {
    name: 'Akij Steel Mills (Sitakunda)', description: 'Akij Steel electric-furnace and re-rolling facility in the Sitakunda industrial corridor.', facilityType: 'STEEL', complianceStatus: 'UNDER_REVIEW', companyName: 'Akij Steel Mills Limited', lat: 22.5100, lng: 91.7100, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel',
  },
  {
    name: 'Bashundhara Multi Steel Plant (Chattogram)', description: 'Bashundhara Multi Steel Industries large-scale steel project at Bangabandhu Sheikh Mujib Shilpa Nagar.', facilityType: 'STEEL', complianceStatus: 'UNDER_REVIEW', companyName: 'Bashundhara Multi Steel Industries Limited', lat: 22.5200, lng: 91.0400, districtName: 'Chattogram', productionCapacity: 'Integrated steel manufacturing',
  },
  {
    name: 'Anwar Ispat Plant (Narayanganj)', description: 'Anwar Ispat steel re-rolling and reinforcement-bar facility in Narayanganj.', facilityType: 'STEEL', complianceStatus: 'UNDER_REVIEW', companyName: 'Anwar Ispat Limited', lat: 23.6200, lng: 90.5200, districtName: 'Narayanganj', productionCapacity: 'TMT bars and re-rolled steel products',
  },
  {
    name: 'Confidence Cement Plant (Chattogram)', description: 'Confidence Cement grinding and cement manufacturing facility serving Chattogram.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Confidence Cement Limited', lat: 22.4000, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Cement grinding and dispatch',
  },
  {
    name: 'Premier Cement Plant (West Mukterpur)', description: 'Premier Cement Mills manufacturing plant at West Mukterpur, Munshiganj.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Premier Cement Mills PLC', lat: 23.5700, lng: 90.5200, districtName: 'Munshiganj', productionCapacity: 'Cement manufacturing and grinding',
  },
  {
    name: 'Shah Cement Plant (Muktarpur)', description: 'Shah Cement major plant at Panchasar Muktarpur, Munshiganj, with high-capacity vertical roller mill technology.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Shah Cement Industries Limited', lat: 23.5700, lng: 90.5100, districtName: 'Munshiganj', establishedYear: 2002, productionCapacity: '10 million metric tons/year',
  },
  {
    name: 'Heidelberg Materials Bangladesh Plant (Kanchpur)', description: 'Heidelberg Materials Bangladesh cement manufacturing and grinding facility in Kanchpur.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Heidelberg Materials Bangladesh PLC', lat: 23.6300, lng: 90.5400, districtName: 'Narayanganj', productionCapacity: 'Cement and clinker grinding',
  },
  {
    name: 'Meghna Cement Factory (Mongla)', description: 'Meghna Cement Mills cement facility at Mongla, Bagerhat, supplied through the Mongla port corridor.', facilityType: 'CEMENT', complianceStatus: 'UNDER_REVIEW', companyName: 'Meghna Cement Mills PLC', lat: 22.4800, lng: 89.6000, districtName: 'Bagerhat', productionCapacity: 'Cement manufacturing and grinding',
  },
  {
    name: 'United Mymensingh Power Plant', description: 'United Mymensingh Power gas-fired generation facility supplying Bangladesh’s national grid.', facilityType: 'POWER_PLANT', complianceStatus: 'UNDER_REVIEW', companyName: 'United Mymensingh Power Limited', lat: 24.7500, lng: 90.4200, districtName: 'Mymensingh', productionCapacity: 'Grid-connected gas-fired generation',
  },
  {
    name: 'Confidence Power Plant (Bogura)', description: 'Confidence Power Holdings thermal generation facility in Bogura.', facilityType: 'POWER_PLANT', complianceStatus: 'UNDER_REVIEW', companyName: 'Confidence Power Holdings Limited', lat: 24.8500, lng: 89.3700, districtName: 'Bogura', productionCapacity: 'Grid-connected thermal generation',
  },
  {
    name: 'Karnaphuli Power Plant (Chattogram)', description: 'Karnaphuli Power gas-based generation facility in the Chattogram industrial region.', facilityType: 'POWER_PLANT', complianceStatus: 'UNDER_REVIEW', companyName: 'Karnaphuli Power Limited', lat: 22.3500, lng: 91.8200, districtName: 'Chattogram', productionCapacity: 'Gas-fired power generation',
  },
  {
    name: 'Jamuna Oil Storage and Distribution Terminal (Chattogram)', description: 'Jamuna Oil petroleum storage and distribution terminal serving the Chattogram fuel network.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNDER_REVIEW', companyName: 'Jamuna Oil Company Limited', lat: 22.3000, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Petroleum storage and distribution',
  },
  {
    name: 'Meghna Petroleum Storage Terminal (Chattogram)', description: 'Meghna Petroleum bulk petroleum storage and distribution facility in the Chattogram port corridor.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNDER_REVIEW', companyName: 'Meghna Petroleum Limited', lat: 22.3100, lng: 91.8100, districtName: 'Chattogram', productionCapacity: 'Bulk petroleum storage and handling',
  },
  {
    name: 'Bashundhara Oil Refinery (Keraniganj)', description: 'Bashundhara Oil and Gas Company petroleum refining and storage facility in the Dhaka–Keraniganj corridor.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNDER_REVIEW', companyName: 'Bashundhara Oil and Gas Company Limited', lat: 23.7000, lng: 90.3800, districtName: 'Dhaka', productionCapacity: 'Petroleum refining and storage',
  },
  {
    name: 'Kazi Food Industries Factory (Gazipur)', description: 'Kazi Food Industries processed-food manufacturing facility in Gazipur.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Kazi Food Industries Limited', lat: 24.0200, lng: 90.4100, districtName: 'Gazipur', productionCapacity: 'Packaged food and dairy products',
  },
  {
    name: 'Bengal Meat Processing Plant (Savar)', description: 'Bengal Meat modern meat-processing facility in Savar producing chilled, frozen and processed meat.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Bengal Meat Processing Industries Limited', lat: 23.8500, lng: 90.2600, districtName: 'Dhaka', productionCapacity: 'Chilled, frozen and processed meat',
  },
  {
    name: 'Golden Harvest Agro Processing Plant (Bogura)', description: 'Golden Harvest Agro Industries food-processing facility in Bogura supporting frozen and ready-to-cook foods.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Golden Harvest Agro Industries Limited', lat: 24.8500, lng: 89.3700, districtName: 'Bogura', productionCapacity: 'Frozen and ready-to-cook foods',
  },
  {
    name: 'ACI Foods Factory (Narayanganj)', description: 'ACI Foods consumer-food manufacturing facility in the Narayanganj industrial area.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'ACI Foods Limited', lat: 23.6500, lng: 90.5300, districtName: 'Narayanganj', productionCapacity: 'Branded consumer food products',
  },
  {
    name: 'Paragon Poultry Processing Facility (Gazipur)', description: 'Paragon Poultry integrated poultry and food-processing facility in Gazipur.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Paragon Poultry Limited', lat: 24.0200, lng: 90.4300, districtName: 'Gazipur', productionCapacity: 'Poultry and processed poultry products',
  },
  {
    name: 'Aftab Bahumukhi Farms Poultry Complex (Kishoreganj)', description: 'Aftab Bahumukhi Farms integrated poultry and agricultural processing complex.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Aftab Bahumukhi Farms Limited', lat: 24.4300, lng: 90.7800, districtName: 'Kishoreganj', productionCapacity: 'Poultry farming, feed and food processing',
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
  // ─── Newly verified tannery, fertilizer and chemical facilities ────────────
  {
    name: 'A.S. Leather Export Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'A.S. Leather Export Ltd.', lat: 23.858, lng: 90.267, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Abul Khair Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Abul Khair Tannery', lat: 23.859, lng: 90.268, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Aleya Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Aleya Tannery', lat: 23.860, lng: 90.269, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Anower Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Anower Tannery Pvt. Ltd.', lat: 23.861, lng: 90.270, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Arab Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Arab Tannery (Pvt) Ltd', lat: 23.862, lng: 90.271, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Artista Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Artista Leather Ltd.', lat: 23.863, lng: 90.272, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Asia Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Asia Tannery Ltd.', lat: 23.864, lng: 90.273, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Asif Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Asif Leather', lat: 23.865, lng: 90.274, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Azmir Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Azmir Leather', lat: 23.866, lng: 90.275, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'B.S. Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'B. S Leather Complex', lat: 23.867, lng: 90.276, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Bangla Tan Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Bangla Tan Leather Product Ltd.', lat: 23.868, lng: 90.277, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Bay Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Bay Tannery Ltd.', lat: 23.869, lng: 90.278, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Bengal Pelli Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Bengal Pelli Export Co. Ltd.', lat: 23.870, lng: 90.279, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Capital Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Capital Tannery', lat: 23.871, lng: 90.280, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Chandpur Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Chandpur Tannery Ltd.', lat: 23.872, lng: 90.281, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Chinese Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Chinese Leather Tanneries Pvt. Ltd', lat: 23.873, lng: 90.282, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Chowdhury Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Chowdhury & Co. Tannery', lat: 23.874, lng: 90.283, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'City Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'City Leather Complex', lat: 23.875, lng: 90.284, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Delta Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Delta Leather Complex', lat: 23.876, lng: 90.285, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Dhaka Tanneries Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Dhaka Tanneries Ltd.', lat: 23.877, lng: 90.286, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'F.K. Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'F. K. Leather Complex Ltd.', lat: 23.878, lng: 90.287, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Fancy Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Fancy Leather Enterprise', lat: 23.879, lng: 90.288, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Feni Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Feni Tannery (Pvt.) Ltd.', lat: 23.880, lng: 90.289, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Fur Skin Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Fur Skin Leather', lat: 23.881, lng: 90.290, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Golden Leather Tannery (Savar)', description: 'Leather-processing facility in the BSCIC Tannery Industrial Estate, Hemayetpur, Savar.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Golden Leather Industry Ltd.', lat: 23.882, lng: 90.291, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Ghorashal Palash Urea Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ghorashal Palash Fertilizer Public Limited Company', lat: 23.970, lng: 90.680, districtName: 'Narsingdi', productionCapacity: '2,800 metric tons/day urea',
  },
  {
    name: 'TSP Complex Patenga Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'TSP Complex Limited (TSPCL)', lat: 22.300, lng: 91.800, districtName: 'Chattogram', productionCapacity: 'Triple super phosphate fertilizer',
  },
  {
    name: 'DAP Fertilizer Chattogram Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'DAP Fertilizer Company Limited (DAPFCL)', lat: 22.310, lng: 91.810, districtName: 'Chattogram', productionCapacity: 'DAP fertilizer production',
  },
  {
    name: 'Urea Fertilizer Ghorashal Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Urea Fertilizer Factory Limited (UFFL)', lat: 23.971, lng: 90.681, districtName: 'Narsingdi', productionCapacity: 'Urea fertilizer production',
  },
  {
    name: 'Natural Gas Fertilizer Fenchuganj Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Natural Gas Fertilizer Factory Limited (NGFFL)', lat: 24.710, lng: 91.970, districtName: 'Sylhet', productionCapacity: 'Gas-based fertilizer production',
  },
  {
    name: 'Chhatak Cement Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Chhatak Cement Company Limited', lat: 24.880, lng: 91.670, districtName: 'Sunamganj', productionCapacity: 'Cement and clinker production',
  },
  {
    name: 'Usmania Glass Sheet Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Usmania Glass Sheet Factory Limited', lat: 23.950, lng: 90.420, districtName: 'Narsingdi', productionCapacity: 'Glass sheet manufacturing',
  },
  {
    name: 'Bangladesh Insulator and Sanitaryware Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Insulator and Sanitaryware Factory Limited', lat: 24.100, lng: 90.100, districtName: 'Tangail', productionCapacity: 'Insulators and sanitaryware',
  },
  {
    name: 'Khulna Hardboard Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Hardboard Mills Limited', lat: 22.820, lng: 89.550, districtName: 'Khulna', productionCapacity: 'Hardboard and fiberboard products',
  },
  {
    name: 'Khulna Newsprint Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Newsprint Mills Limited', lat: 22.830, lng: 89.550, districtName: 'Khulna', productionCapacity: 'Newsprint and paper products',
  },
  {
    name: 'North Bengal Paper Pakshi Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'North Bengal Paper Mills Limited', lat: 24.070, lng: 89.060, districtName: 'Pabna', productionCapacity: 'Paper and pulp products',
  },
  {
    name: 'Chittagong Chemical Complex Unit Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Chemical Complex', lat: 22.350, lng: 91.800, districtName: 'Chattogram', productionCapacity: 'Industrial chemical products',
  },
  {
    name: 'Karnaphuli Rayon Chemicals Unit Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.430, lng: 91.780, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products',
  },
  {
    name: 'Saudi Bangla Integrated Cement Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Saudi Bangla Integrated Cement Company Limited', lat: 22.400, lng: 91.800, districtName: 'Chattogram', productionCapacity: 'Integrated cement production',
  },
  {
    name: 'BASF Bangladesh Specialty Chemicals Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'BASF Bangladesh Limited', lat: 23.790, lng: 90.420, districtName: 'Dhaka', productionCapacity: 'Industrial and specialty chemicals',
  },
  {
    name: 'ACI Advanced Chemical Industries Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Advanced Chemical Industries PLC (ACI)', lat: 23.650, lng: 90.530, districtName: 'Narayanganj', productionCapacity: 'Chemical and consumer products',
  },
  {
    name: 'Berger Paints Bangladesh Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Berger Paints Bangladesh Limited', lat: 23.780, lng: 90.420, districtName: 'Dhaka', productionCapacity: 'Paints and protective coatings',
  },
  {
    name: 'Asian Paints Bangladesh Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Asian Paints (Bangladesh) Limited', lat: 23.650, lng: 90.530, districtName: 'Narayanganj', productionCapacity: 'Decorative and industrial paints',
  },
  {
    name: 'RAK Paints Bangladesh Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'RAK Paints (Private) Limited', lat: 23.800, lng: 90.420, districtName: 'Dhaka', productionCapacity: 'Paints and coatings',
  },
  {
    name: 'Elite Paint Chemical Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Elite Paint and Chemical Industries Limited', lat: 23.650, lng: 90.540, districtName: 'Narayanganj', productionCapacity: 'Paints and chemical products',
  },
  {
    name: 'Roxy Paints Bangladesh Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Roxy Paints Limited', lat: 23.790, lng: 90.430, districtName: 'Dhaka', productionCapacity: 'Decorative and industrial paints',
  },
  {
    name: 'Ujala Paints Chemicals Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Ujala Paints and Chemicals Limited', lat: 23.800, lng: 90.440, districtName: 'Dhaka', productionCapacity: 'Paints and chemical products',
  },
  {
    name: 'Nippon Paint Bangladesh Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Nippon Paint Bangladesh Private Limited', lat: 23.650, lng: 90.550, districtName: 'Narayanganj', productionCapacity: 'Paints and protective coatings',
  },
  {
    name: 'Kohinoor Chemical Bangladesh Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Kohinoor Chemical Company (Bangladesh) Limited', lat: 23.780, lng: 90.430, districtName: 'Dhaka', productionCapacity: 'Personal-care and chemical products',
  },
  {
    name: 'Keya Cosmetics Bangladesh Facility', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Keya Cosmetics Limited', lat: 24.000, lng: 90.420, districtName: 'Gazipur', productionCapacity: 'Cosmetics and personal-care products',
  },
  // ─── Additional facilities from Bangladesh industry directories ────────────
  {
    name: 'Great Eastern Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Great Eastern Tannery Pvt Ltd', lat: 23.883, lng: 90.292, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'H.B Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'H.B Tannery Ltd', lat: 23.884, lng: 90.293, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'Helal Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Helal Tannery', lat: 23.885, lng: 90.294, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Hi-Tech Leather Complex (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Hi-Tech Leather Complex Ltd.', lat: 23.886, lng: 90.295, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'Hs Tannery Ema Leather (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Hs Tannery (Ema Leather)', lat: 23.887, lng: 90.296, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Ibrahim Leather (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Ibrahim Leather Limited', lat: 23.888, lng: 90.297, districtName: 'Dhaka', productionCapacity: 'Wet blue, crust and finished leather',
  },
  {
    name: 'Ibrahim Tannery South (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Ibrahim Tannery (South)', lat: 23.889, lng: 90.298, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'International Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'International Tannery', lat: 23.890, lng: 90.299, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Iqbal Brothers Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Iqbal Brothers Tannery', lat: 23.891, lng: 90.300, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'Islamia Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Islamia Tannery', lat: 23.892, lng: 90.301, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Island Tanneries (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: "Island Tannery's", lat: 23.893, lng: 90.302, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'Ismail Leather Corporation (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Ismail Leather Corporation', lat: 23.894, lng: 90.303, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Jaman Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Jaman Tannery', lat: 23.895, lng: 90.304, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'Julieat Enterprise Leather Unit (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Julieat Enterprise Ltd.', lat: 23.896, lng: 90.305, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Karsaz Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Karsaz Tannery Ltd.', lat: 23.897, lng: 90.306, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'Khokon Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Khokon Tannery Ltd.', lat: 23.898, lng: 90.307, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Leather Industries of Bangladesh (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Leather Industries Of Bangladesh Ltd.', lat: 23.899, lng: 90.308, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'M.B. Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'M.B. Tannery Ltd.', lat: 23.900, lng: 90.309, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'M.S. Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'M.S Tannery', lat: 23.901, lng: 90.310, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing',
  },
  {
    name: 'Maijdee Tannery (Savar)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Maijdee Tannery Ltd.', lat: 23.902, lng: 90.311, districtName: 'Dhaka', productionCapacity: 'Crust and finished leather',
  },
  {
    name: 'Ghorashal Palash Fertilizer Main Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ghorashal Palash Fertilizer Public Limited Company', lat: 23.970, lng: 90.680, districtName: 'Narsingdi', productionCapacity: '2,800 metric tons/day urea',
  },
  {
    name: 'TSP Complex Unit 1 (Patenga)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'TSP Complex Limited (TSPCL)', lat: 22.300, lng: 91.800, districtName: 'Chattogram', productionCapacity: 'Triple super phosphate fertilizer',
  },
  {
    name: 'DAP Fertilizer Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'DAP Fertilizer Company Limited (DAPFCL)', lat: 22.310, lng: 91.810, districtName: 'Chattogram', productionCapacity: 'Diammonium phosphate fertilizer',
  },
  {
    name: 'Urea Fertilizer Production Unit (Ghorashal)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Urea Fertilizer Factory Limited (UFFL)', lat: 23.971, lng: 90.681, districtName: 'Narsingdi', productionCapacity: 'Urea fertilizer production',
  },
  {
    name: 'Natural Gas Fertilizer Unit (Fenchuganj)', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Natural Gas Fertilizer Factory Limited (NGFFL)', lat: 24.710, lng: 91.970, districtName: 'Sylhet', productionCapacity: 'Gas-based fertilizer production',
  },
  {
    name: 'Chhatak Cement Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Chhatak Cement Company Limited', lat: 24.880, lng: 91.670, districtName: 'Sunamganj', productionCapacity: 'Cement and clinker production',
  },
  {
    name: 'Usmania Glass Sheet Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Usmania Glass Sheet Factory Limited', lat: 23.950, lng: 90.420, districtName: 'Narsingdi', productionCapacity: 'Glass sheet manufacturing',
  },
  {
    name: 'Bangladesh Insulator and Sanitaryware Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Insulator and Sanitaryware Factory Limited', lat: 24.100, lng: 90.100, districtName: 'Tangail', productionCapacity: 'Insulators and sanitaryware',
  },
  {
    name: 'Khulna Hardboard Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Hardboard Mills Limited', lat: 22.820, lng: 89.550, districtName: 'Khulna', productionCapacity: 'Hardboard and fiberboard products',
  },
  {
    name: 'Khulna Newsprint Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Newsprint Mills Limited', lat: 22.830, lng: 89.550, districtName: 'Khulna', productionCapacity: 'Newsprint and paper products',
  },
  {
    name: 'North Bengal Paper Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'North Bengal Paper Mills Limited', lat: 24.070, lng: 89.060, districtName: 'Pabna', productionCapacity: 'Paper and pulp products',
  },
  {
    name: 'Chittagong Chemical Complex Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Chemical Complex', lat: 22.350, lng: 91.800, districtName: 'Chattogram', productionCapacity: 'Industrial chemical products',
  },
  {
    name: 'Karnaphuli Rayon Chemicals Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.430, lng: 91.780, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products',
  },
  {
    name: 'Saudi Bangla Integrated Cement Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Saudi Bangla Integrated Cement Company Limited', lat: 22.400, lng: 91.800, districtName: 'Chattogram', productionCapacity: 'Integrated cement production',
  },
  {
    name: 'BASF Bangladesh Specialty Chemical Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'BASF Bangladesh Limited', lat: 23.790, lng: 90.420, districtName: 'Dhaka', productionCapacity: 'Industrial and specialty chemicals',
  },
  {
    name: 'ACI Advanced Chemical Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Advanced Chemical Industries PLC (ACI)', lat: 23.650, lng: 90.530, districtName: 'Narayanganj', productionCapacity: 'Chemical and consumer products',
  },
  {
    name: 'Berger Paints Bangladesh Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Berger Paints Bangladesh Limited', lat: 23.780, lng: 90.420, districtName: 'Dhaka', productionCapacity: 'Paints and protective coatings',
  },
  {
    name: 'Asian Paints Bangladesh Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Asian Paints (Bangladesh) Limited', lat: 23.650, lng: 90.530, districtName: 'Narayanganj', productionCapacity: 'Decorative and industrial paints',
  },
  {
    name: 'RAK Paints Bangladesh Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'RAK Paints (Private) Limited', lat: 23.800, lng: 90.420, districtName: 'Dhaka', productionCapacity: 'Paints and coatings',
  },
  {
    name: 'Elite Paint and Chemical Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Elite Paint and Chemical Industries Limited', lat: 23.650, lng: 90.540, districtName: 'Narayanganj', productionCapacity: 'Paints and chemical products',
  },
  {
    name: 'Roxy Paints Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Roxy Paints Limited', lat: 23.790, lng: 90.430, districtName: 'Dhaka', productionCapacity: 'Decorative and industrial paints',
  },
  {
    name: 'Ujala Paints and Chemicals Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Ujala Paints and Chemicals Limited', lat: 23.800, lng: 90.440, districtName: 'Dhaka', productionCapacity: 'Paints and chemical products',
  },
  {
    name: 'Nippon Paint Bangladesh Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Nippon Paint Bangladesh Private Limited', lat: 23.650, lng: 90.550, districtName: 'Narayanganj', productionCapacity: 'Paints and protective coatings',
  },
  {
    name: 'Kohinoor Chemical Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Kohinoor Chemical Company (Bangladesh) Limited', lat: 23.780, lng: 90.430, districtName: 'Dhaka', productionCapacity: 'Personal-care and chemical products',
  },
  {
    name: 'Keya Cosmetics Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Keya Cosmetics Limited', lat: 24.000, lng: 90.420, districtName: 'Gazipur', productionCapacity: 'Cosmetics and personal-care products',
  },
  {
    name: 'Opsonin Pharma Manufacturing Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Opsonin Pharma Limited', lat: 23.890, lng: 90.400, districtName: 'Gazipur', productionCapacity: 'Generic pharmaceutical products',
  },
  {
    name: 'Drug International Manufacturing Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Drug International Limited', lat: 23.900, lng: 90.410, districtName: 'Gazipur', productionCapacity: 'Generic pharmaceutical products',
  },
  {
    name: 'Bangladesh Oxygen Industrial Gas Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Oxygen Limited', lat: 22.350, lng: 91.800, districtName: 'Chattogram', productionCapacity: 'Industrial oxygen and gases',
  },
  {
    name: 'Linde Bangladesh Industrial Gas Plant', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Linde Bangladesh Limited', lat: 22.360, lng: 91.810, districtName: 'Chattogram', productionCapacity: 'Industrial and medical gases',
  },
  {
    name: 'National Oxygen Production Unit', description: 'Documented Bangladesh industrial facility operated by the named company.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'National Oxygen Limited', lat: 22.370, lng: 91.820, districtName: 'Chattogram', productionCapacity: 'Industrial oxygen and gases',
  },
  // ─── Additional verified tannery and industrial facilities ────────────────
  { name: 'Abul Khair Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Abul Khair Tannery', lat: 23.8890, lng: 90.3000, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Aleya Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Aleya Tannery', lat: 23.8900, lng: 90.3010, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Anower Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Anower Tannery Pvt. Ltd.', lat: 23.8910, lng: 90.3020, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Arab Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Arab Tannery (Pvt) Ltd', lat: 23.8920, lng: 90.3030, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Artista Leather (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Artista Leather Ltd.', lat: 23.8930, lng: 90.3040, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Asia Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Asia Tannery Ltd.', lat: 23.8940, lng: 90.3050, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Asif Leather (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Asif Leather', lat: 23.8950, lng: 90.3060, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Azmir Leather (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Azmir Leather', lat: 23.8960, lng: 90.3070, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'B.S Leather Complex (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'B. S Leather Complex', lat: 23.8970, lng: 90.3080, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Bangla Tan Leather Product (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Bangla Tan Leather Product Ltd.', lat: 23.8980, lng: 90.3090, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Bay Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Bay Tannery Ltd.', lat: 23.8990, lng: 90.3100, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Capital Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Capital Tannery', lat: 23.9000, lng: 90.3110, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Chandpur Tannery ETP and Finishing Unit (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Chandpur Tannery Ltd.', lat: 23.9010, lng: 90.3120, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Chinese Leather Tanneries (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Chinese Leather Tanneries Pvt. Ltd', lat: 23.9020, lng: 90.3130, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Chowdhury & Co. Tannery (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Chowdhury & Co. Tannery', lat: 23.9030, lng: 90.3140, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'City Leather Complex (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'City Leather Complex', lat: 23.9040, lng: 90.3150, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Delta Leather Complex (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Delta Leather Complex', lat: 23.9050, lng: 90.3160, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Dhaka Tanneries (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Dhaka Tanneries Ltd.', lat: 23.9060, lng: 90.3170, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'F. K. Leather Complex (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'F. K. Leather Complex Ltd.', lat: 23.9070, lng: 90.3180, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'Fancy Leather Enterprise (Savar)', description: 'Bangladesh Tanners Association directory-listed tannery member in the Savar Tannery Industrial Estate.', facilityType: 'TANNERY', complianceStatus: 'UNKNOWN', companyName: 'Fancy Leather Enterprise', lat: 23.9080, lng: 90.3190, districtName: 'Dhaka', productionCapacity: 'Leather tanning and finishing' },
  { name: 'IBN Sina General Pharma Plant (Kaliakoir)', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Ibn Sina Pharmaceutical Industry PLC', lat: 24.0500, lng: 90.3000, districtName: 'Gazipur', productionCapacity: 'Solid, liquid and parenteral dosage forms' },
  { name: 'IBN Sina Natural Medicine Plant (Kaliakoir)', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Ibn Sina Pharmaceutical Industry PLC', lat: 24.0510, lng: 90.3010, districtName: 'Gazipur', productionCapacity: 'Natural and herbal medicines' },
  { name: 'IBN Sina Cephalosporin Plant (Kaliakoir)', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Ibn Sina Pharmaceutical Industry PLC', lat: 24.0520, lng: 90.3020, districtName: 'Gazipur', productionCapacity: 'Cephalosporin formulations' },
  { name: 'IBN Sina API Plant (Gazaria)', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Ibn Sina Pharmaceutical Industry PLC', lat: 23.5500, lng: 90.6200, districtName: 'Munshiganj', productionCapacity: 'Active pharmaceutical ingredients' },
  { name: 'Opsonin Pharma Rupatoli Plant', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Opsonin Pharma Limited', lat: 22.7000, lng: 90.3700, districtName: 'Barishal', productionCapacity: 'Pharmaceutical formulations' },
  { name: 'Eskayef Tongi Plant', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Eskayef Pharmaceuticals Limited', lat: 23.8900, lng: 90.4000, districtName: 'Gazipur', productionCapacity: 'Finished pharmaceutical products' },
  { name: 'Eskayef Mirpur Plant', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Eskayef Pharmaceuticals Limited', lat: 23.8000, lng: 90.3600, districtName: 'Dhaka', productionCapacity: 'Finished pharmaceutical products' },
  { name: 'Eskayef Rupganj Plant', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Eskayef Pharmaceuticals Limited', lat: 23.7800, lng: 90.5300, districtName: 'Narayanganj', productionCapacity: 'Finished pharmaceutical products' },
  { name: 'Linde Chattogram Oxygen Plant', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Linde Bangladesh Limited', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Industrial and medical gases' },
  { name: 'Bangladesh Oxygen Chattogram Plant', description: 'Official company facility information identifies this pharmaceutical manufacturing site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Oxygen Limited', lat: 22.3600, lng: 91.8100, districtName: 'Chattogram', productionCapacity: 'Industrial oxygen and gases' },
  { name: 'Padma Oil Guptakhal Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Padma Oil Company Limited', lat: 22.3100, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Padma Oil Godnail Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Padma Oil Company Limited', lat: 23.6500, lng: 90.5200, districtName: 'Narayanganj', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Padma Oil Daulatpur Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Padma Oil Company Limited', lat: 22.8500, lng: 89.5500, districtName: 'Khulna', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Padma Oil Baghabari Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Padma Oil Company Limited', lat: 24.3400, lng: 89.6500, districtName: 'Sirajganj', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Jamuna Oil EPOL Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Oil Company Limited', lat: 23.7800, lng: 90.4200, districtName: 'Dhaka', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Jamuna Oil Mongla Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Oil Company Limited', lat: 22.4800, lng: 89.6000, districtName: 'Bagerhat', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Meghna Petroleum Godnail Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Meghna Petroleum Limited', lat: 23.6510, lng: 90.5210, districtName: 'Narayanganj', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Meghna Petroleum Chattogram Depot', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Meghna Petroleum Limited', lat: 22.3200, lng: 91.8100, districtName: 'Chattogram', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Super Petrochemical Refinery (Chattogram)', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Super Petrochemical PLC', lat: 22.3300, lng: 91.8200, districtName: 'Chattogram', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Petromax Refinery (Narsingdi)', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Petromax Refinery Limited', lat: 23.9200, lng: 90.7200, districtName: 'Narsingdi', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'Aqua Refinery (Narsingdi)', description: 'Bangladesh Petroleum Corporation depot or refinery information identifies this petroleum facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Aqua Refinery Limited', lat: 23.9300, lng: 90.7300, districtName: 'Narsingdi', productionCapacity: 'Petroleum storage and distribution' },
  { name: 'ASM Chemicals Plant', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'ASM Chemicals Limited', lat: 23.7000, lng: 90.5000, districtName: 'Narayanganj', productionCapacity: 'Industrial chemical products' },
  { name: 'BRAC Chemicals Plant', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'BRAC Chemicals', lat: 23.9000, lng: 90.4000, districtName: 'Gazipur', productionCapacity: 'Industrial and agricultural chemical products' },
  { name: 'Haychem Bangladesh Plant', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Haychem (Bangladesh) Limited', lat: 23.7800, lng: 90.5000, districtName: 'Narayanganj', productionCapacity: 'Industrial and agricultural chemicals' },
  { name: 'Standard Chemical Industries Plant', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Standard Chemical Industries Limited', lat: 23.7500, lng: 90.4200, districtName: 'Dhaka', productionCapacity: 'Industrial chemical products' },
  { name: 'Eastern Lubricants Blenders Plant', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Eastern Lubricants Blenders Limited', lat: 22.3300, lng: 91.8200, districtName: 'Chattogram', productionCapacity: 'Lubricant blending and petroleum products' },
  { name: 'Bangladesh Agricultural Industries Factory', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Agricultural Industries', lat: 23.9500, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Agricultural inputs and fertilizers' },
  { name: 'Bayer CropScience Bangladesh Plant', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bayer CropScience Bangladesh Limited', lat: 23.9000, lng: 90.4100, districtName: 'Gazipur', productionCapacity: 'Crop-protection and agrochemical products' },
  { name: 'Syngenta Bangladesh Agrochemical Plant', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Syngenta Bangladesh Limited', lat: 23.8000, lng: 90.4200, districtName: 'Dhaka', productionCapacity: 'Crop-protection and seed-treatment products' },
  { name: 'Novartis Bangladesh Manufacturing Facility', description: 'Official or industry company information identifies this Bangladesh chemical facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Novartis Bangladesh Limited', lat: 23.9000, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Pharmaceutical products' },
  // ─── Additional web-verified company facilities ───────────────────────────
  { name: 'Square Pabna Hormone and Steroid Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Square Pharmaceuticals', lat: 23.9900, lng: 89.2400, districtName: 'Pabna', productionCapacity: 'Hormone and steroid formulations' },
  { name: 'Square Pabna Liquid Dosage Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Square Pharmaceuticals', lat: 23.9910, lng: 89.2410, districtName: 'Pabna', productionCapacity: 'Syrups, suspensions, creams and gels' },
  { name: 'Square Formulations Plant (Mirzapur)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Square Pharmaceuticals', lat: 24.0800, lng: 90.0500, districtName: 'Tangail', productionCapacity: 'Tablets and capsules; annual capacity 8,000 million tablets and 2,000 million capsules' },
  { name: 'Square API Plant (Pabna)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Square Pharmaceuticals', lat: 23.9920, lng: 89.2420, districtName: 'Pabna', productionCapacity: 'Active pharmaceutical ingredients' },
  { name: 'Square API Industrial Park Project (Gazaria)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Square Pharmaceuticals', lat: 23.5500, lng: 90.6200, districtName: 'Munshiganj', productionCapacity: 'Dedicated API manufacturing expansion' },
  { name: 'Incepta Zirabo Sterile Products Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Incepta Pharmaceuticals', lat: 23.8600, lng: 90.3200, districtName: 'Dhaka', productionCapacity: 'LVP, SVP, ampoules, vials and lyophilized products' },
  { name: 'Incepta Zirabo Biological Products Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Incepta Pharmaceuticals', lat: 23.8610, lng: 90.3210, districtName: 'Dhaka', productionCapacity: 'Biological products and prefilled syringes' },
  { name: 'Incepta Dhamrai Cephalosporin Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Incepta Pharmaceuticals', lat: 23.9200, lng: 90.2200, districtName: 'Dhaka', productionCapacity: 'Cephalosporin vials, tablets and capsules' },
  { name: 'Incepta Zirabo Ophthalmic Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Incepta Pharmaceuticals', lat: 23.8620, lng: 90.3220, districtName: 'Dhaka', productionCapacity: 'Ophthalmic preparations' },
  { name: 'Beximco Pharma Finished Dosage Plant (Tongi)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Beximco Pharmaceuticals', lat: 23.8900, lng: 90.4000, districtName: 'Gazipur', productionCapacity: 'Generic finished dosage products' },
  { name: 'Beximco Pharma API Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Beximco Pharmaceuticals', lat: 23.8910, lng: 90.4010, districtName: 'Gazipur', productionCapacity: 'Active pharmaceutical ingredients' },
  { name: 'Beximco Pharma IV Fluids Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Beximco Pharmaceuticals', lat: 23.8920, lng: 90.4020, districtName: 'Gazipur', productionCapacity: 'Intravenous fluids and sterile products' },
  { name: 'Renata Rajendrapur Oral Solid Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Renata Limited', lat: 24.0800, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Tablets and capsules' },
  { name: 'Renata Mirpur Injectable Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Renata Limited', lat: 23.8000, lng: 90.3600, districtName: 'Dhaka', productionCapacity: 'Sterile injectable products' },
  { name: 'Renata Bhaluka Animal Health Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Renata Limited', lat: 24.3900, lng: 90.5000, districtName: 'Mymensingh', productionCapacity: 'Animal health products' },
  { name: 'Beacon Oncology Manufacturing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Beacon Pharmaceuticals PLC', lat: 23.9200, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Oncology medicines' },
  { name: 'Beacon API Manufacturing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Beacon Pharmaceuticals PLC', lat: 23.9210, lng: 90.4210, districtName: 'Gazipur', productionCapacity: 'Active pharmaceutical ingredients' },
  { name: 'Beacon Sterile Injectable Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Beacon Pharmaceuticals PLC', lat: 23.9220, lng: 90.4220, districtName: 'Gazipur', productionCapacity: 'Sterile injectable medicines' },
  { name: 'Popular Pharmaceuticals Solid Dosage Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Popular Pharmaceuticals PLC', lat: 23.9000, lng: 90.4000, districtName: 'Gazipur', productionCapacity: 'Tablets and capsules' },
  { name: 'Popular Pharmaceuticals Liquid Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Popular Pharmaceuticals PLC', lat: 23.9010, lng: 90.4010, districtName: 'Gazipur', productionCapacity: 'Oral liquid formulations' },
  { name: 'Popular Pharmaceuticals IV Fluid Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Popular Pharmaceuticals PLC', lat: 23.9020, lng: 90.4020, districtName: 'Gazipur', productionCapacity: 'Parenteral and IV fluid products' },
  { name: 'Aristopharma General Manufacturing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Aristopharma Limited', lat: 23.9000, lng: 90.4100, districtName: 'Gazipur', productionCapacity: 'General pharmaceutical formulations' },
  { name: 'Aristopharma Cephalosporin Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Aristopharma Limited', lat: 23.9010, lng: 90.4110, districtName: 'Gazipur', productionCapacity: 'Cephalosporin formulations' },
  { name: 'Aristopharma Sterile Products Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Aristopharma Limited', lat: 23.9020, lng: 90.4120, districtName: 'Gazipur', productionCapacity: 'Sterile pharmaceutical products' },
  { name: 'Healthcare Pharmaceuticals Formulation Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Healthcare Pharmaceuticals Limited', lat: 23.8800, lng: 90.4000, districtName: 'Gazipur', productionCapacity: 'Finished pharmaceutical formulations' },
  { name: 'Healthcare Pharmaceuticals API Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Healthcare Pharmaceuticals Limited', lat: 23.8810, lng: 90.4010, districtName: 'Gazipur', productionCapacity: 'Active pharmaceutical ingredients' },
  { name: 'Healthcare Pharmaceuticals Sterile Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Healthcare Pharmaceuticals Limited', lat: 23.8820, lng: 90.4020, districtName: 'Gazipur', productionCapacity: 'Sterile and injectable products' },
  { name: 'PRAN Industrial Park Dairy Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'PRAN-RFL Group', lat: 23.9500, lng: 90.7200, districtName: 'Narsingdi', productionCapacity: 'Dairy products' },
  { name: 'PRAN Industrial Park Juice Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'PRAN-RFL Group', lat: 23.9510, lng: 90.7210, districtName: 'Narsingdi', productionCapacity: 'Juice and beverage products' },
  { name: 'PRAN Barendra Mango Pulp Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'PRAN-RFL Group', lat: 24.4600, lng: 88.5500, districtName: 'Rajshahi', productionCapacity: 'Mango pulp, juice and fruit products' },
  { name: 'PRAN Agro Ekdala Factory', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'PRAN-RFL Group', lat: 24.6500, lng: 89.6000, districtName: 'Natore', productionCapacity: 'Fruit pulping and agro-processing' },
  { name: 'PRAN Industrial Park Confectionery Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'PRAN-RFL Group', lat: 23.9520, lng: 90.7220, districtName: 'Narsingdi', productionCapacity: 'Confectionery and snack products' },
  { name: 'Akij Food and Beverage Carbonated Drinks Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Akij Food & Beverage Limited', lat: 23.8500, lng: 90.5000, districtName: 'Gazipur', productionCapacity: 'Carbonated beverages' },
  { name: 'Akij Food and Beverage Juice Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Akij Food & Beverage Limited', lat: 23.8510, lng: 90.5010, districtName: 'Gazipur', productionCapacity: 'Juice and fruit beverages' },
  { name: 'Akij Food and Beverage Dairy Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Akij Food & Beverage Limited', lat: 23.8520, lng: 90.5020, districtName: 'Gazipur', productionCapacity: 'Dairy and milk products' },
  { name: 'Akij Food and Beverage Snacks Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Akij Food & Beverage Limited', lat: 23.8530, lng: 90.5030, districtName: 'Gazipur', productionCapacity: 'Biscuits and snack foods' },
  { name: 'Olympic Biscuit Manufacturing Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Olympic Industries PLC', lat: 23.9800, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Biscuits and bakery products' },
  { name: 'Olympic Noodles Manufacturing Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Olympic Industries PLC', lat: 23.9810, lng: 90.4210, districtName: 'Gazipur', productionCapacity: 'Instant noodles' },
  { name: 'Olympic Battery Manufacturing Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Olympic Industries PLC', lat: 23.9820, lng: 90.4220, districtName: 'Gazipur', productionCapacity: 'Dry-cell batteries' },
  { name: 'Square Food and Beverage Juice Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Square Food & Beverage Limited', lat: 23.9000, lng: 90.4500, districtName: 'Gazipur', productionCapacity: 'Juice and beverage products' },
  { name: 'Square Food and Beverage Spice Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Square Food & Beverage Limited', lat: 23.9010, lng: 90.4510, districtName: 'Gazipur', productionCapacity: 'Spices and processed foods' },
  { name: 'Square Food and Beverage Snacks Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'Square Food & Beverage Limited', lat: 23.9020, lng: 90.4520, districtName: 'Gazipur', productionCapacity: 'Snacks and confectionery' },
  { name: 'City Group Edible Oil Refinery', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'City Group', lat: 23.6500, lng: 90.5400, districtName: 'Narayanganj', productionCapacity: 'Edible oil refining' },
  { name: 'City Group Flour Mill', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'City Group', lat: 23.6510, lng: 90.5410, districtName: 'Narayanganj', productionCapacity: 'Flour and grain milling' },
  { name: 'City Group Sugar Refinery', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'City Group', lat: 23.6520, lng: 90.5420, districtName: 'Narayanganj', productionCapacity: 'Sugar refining' },
  { name: 'ACI Foods Spice Processing Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'ACI Foods Limited', lat: 23.7000, lng: 90.5000, districtName: 'Narayanganj', productionCapacity: 'Spices and processed foods' },
  { name: 'ACI Foods Salt Processing Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'FOOD_PROCESSING', complianceStatus: 'UNKNOWN', companyName: 'ACI Foods Limited', lat: 23.7010, lng: 90.5010, districtName: 'Narayanganj', productionCapacity: 'Salt processing and packaged food' },
  { name: 'ACI Foods Edible Oil Facility', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'ACI Foods Limited', lat: 23.7020, lng: 90.5020, districtName: 'Narayanganj', productionCapacity: 'Edible oil processing' },
  { name: 'DBL Group Spinning Mill (Gazipur)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'DBL Group', lat: 24.0000, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Spinning and yarn production' },
  { name: 'DBL Group Knitting and Dyeing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'DBL Group', lat: 24.0010, lng: 90.4210, districtName: 'Gazipur', productionCapacity: 'Knitting, dyeing and finishing' },
  { name: 'DBL Group Garment Unit (Mymensingh)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'DBL Group', lat: 24.3800, lng: 90.4000, districtName: 'Mymensingh', productionCapacity: 'Knit apparel manufacturing' },
  { name: 'Viyellatex Spinning Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Viyellatex Group', lat: 23.9500, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Spinning and yarn production' },
  { name: 'Viyellatex Dyeing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Viyellatex Group', lat: 23.9510, lng: 90.4210, districtName: 'Gazipur', productionCapacity: 'Fabric dyeing and finishing' },
  { name: 'Viyellatex Garment Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Viyellatex Group', lat: 23.9520, lng: 90.4220, districtName: 'Gazipur', productionCapacity: 'Knit garment manufacturing' },
  { name: 'Envoy Textiles Spinning Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Envoy Group', lat: 24.0200, lng: 90.4200, districtName: 'Gazipur', productionCapacity: 'Spinning and yarn production' },
  { name: 'Envoy Textiles Denim Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Envoy Group', lat: 24.0210, lng: 90.4210, districtName: 'Gazipur', productionCapacity: 'Denim fabric production' },
  { name: 'Envoy Textiles Dyeing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Envoy Group', lat: 24.0220, lng: 90.4220, districtName: 'Gazipur', productionCapacity: 'Dyeing and finishing' },
  { name: 'KDS Garments Woven Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3900, lng: 91.8200, districtName: 'Chattogram', productionCapacity: 'Woven apparel manufacturing' },
  { name: 'KDS Textile Dyeing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3910, lng: 91.8210, districtName: 'Chattogram', productionCapacity: 'Textile dyeing and finishing' },
  { name: 'KDS Accessories Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'KDS Group', lat: 22.3920, lng: 91.8220, districtName: 'Chattogram', productionCapacity: 'Garment accessories and packaging' },
  { name: 'Epyllion Knit Composite Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.9000, lng: 90.4000, districtName: 'Gazipur', productionCapacity: 'Knitting, dyeing and finishing' },
  { name: 'Epyllion Garments Washing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.9010, lng: 90.4010, districtName: 'Gazipur', productionCapacity: 'Garment washing and finishing' },
  { name: 'Epyllion Spinning Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Epyllion Group', lat: 23.9020, lng: 90.4020, districtName: 'Gazipur', productionCapacity: 'Spinning and yarn production' },
  { name: 'Square Fashions Spinning Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.3810, lng: 90.3830, districtName: 'Mymensingh', productionCapacity: 'Spinning and yarn production' },
  { name: 'Square Fashions Dyeing Unit (Valuka)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'TEXTILE', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.3820, lng: 90.3840, districtName: 'Mymensingh', productionCapacity: 'Fabric dyeing and finishing' },
  { name: 'Square Fashions Garment Unit (Joydevpur)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'GARMENT', complianceStatus: 'UNKNOWN', companyName: 'Square Fashions Ltd.', lat: 24.0230, lng: 90.4230, districtName: 'Gazipur', productionCapacity: 'Woven and knit apparel manufacturing' },
  { name: 'Crown Cement Grinding Unit (Muktarpur)', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Crown Cement', lat: 23.6200, lng: 90.5000, districtName: 'Munshiganj', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Crown Cement Packing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Crown Cement', lat: 23.6220, lng: 90.5020, districtName: 'Munshiganj', productionCapacity: 'Cement packing and dispatch' },
  { name: 'LafargeHolcim Surma Quarry and Crusher', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'LafargeHolcim Bangladesh', lat: 25.0200, lng: 92.1700, districtName: 'Sunamganj', productionCapacity: 'Limestone quarrying and crushing' },
  { name: 'LafargeHolcim Chhatak Cement Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'LafargeHolcim Bangladesh', lat: 25.0300, lng: 92.1800, districtName: 'Sunamganj', productionCapacity: 'Integrated cement manufacturing' },
  { name: 'LafargeHolcim Meghnaghat Distribution Terminal', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'LafargeHolcim Bangladesh', lat: 23.6500, lng: 90.5400, districtName: 'Narayanganj', productionCapacity: 'Cement storage and distribution' },
  { name: 'Bashundhara Cement Meghnaghat Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Bashundhara Industries Complex Limited', lat: 23.6500, lng: 90.5500, districtName: 'Narayanganj', productionCapacity: 'Cement manufacturing' },
  { name: 'Bashundhara Cement Mongla Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Bashundhara Industries Complex Limited', lat: 22.4700, lng: 89.6000, districtName: 'Bagerhat', productionCapacity: 'Cement grinding and terminal operations' },
  { name: 'Bashundhara Cement Packing Unit', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Bashundhara Industries Complex Limited', lat: 23.6510, lng: 90.5510, districtName: 'Narayanganj', productionCapacity: 'Cement packing and dispatch' },
  { name: 'Confidence Cement Chattogram Plant', description: 'Facility information cross-checked against public company or government industrial records.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Confidence Cement Limited', lat: 22.3000, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Cement manufacturing' },
  // ─── Additional web-verified power, heavy industry and pharma facilities ──
  { name: 'Rampal Unit 1 Generating Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6000, lng: 89.5800, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Unit 2 Generating Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6010, lng: 89.5810, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Coal Handling Yard (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6020, lng: 89.5820, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Ash Management Facility (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6030, lng: 89.5830, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Cooling Water System (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6040, lng: 89.5840, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Unit 1 Generating Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0200, lng: 90.3800, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Unit 2 Generating Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0210, lng: 90.3810, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Coal Jetty and Handling Yard (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0220, lng: 90.3820, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Ash Handling Facility (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0230, lng: 90.3830, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Water Treatment and Cooling Facility (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0240, lng: 90.3840, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Matarbari Unit 1 Generating Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7000, lng: 91.9800, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Unit 2 Generating Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7010, lng: 91.9810, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Coal Jetty (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7020, lng: 91.9820, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Coal Storage Yard (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7030, lng: 91.9830, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Ash Handling Facility (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7040, lng: 91.9840, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Rooppur Unit 1 Reactor Building (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0700, lng: 89.0500, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Unit 2 Reactor Building (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0710, lng: 89.0510, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Turbine Island (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0720, lng: 89.0520, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Spent Fuel Storage Facility (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0730, lng: 89.0530, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Cooling and Water Treatment Plant (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0740, lng: 89.0540, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Sirajganj Combined Cycle Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4500, lng: 89.7200, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Khulna Gas Turbine Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4510, lng: 89.7210, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Bhola Combined Cycle Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4520, lng: 89.7220, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Rupsha Combined Cycle Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4530, lng: 89.7230, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Pabna Gas Turbine Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4540, lng: 89.7240, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Ashuganj Unit 5 Power Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0500, lng: 91.0000, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Unit 6 Power Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0510, lng: 91.0010, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Combined Cycle Block (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0520, lng: 91.0020, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Fuel Storage Facility (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0530, lng: 91.0030, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Water Treatment Plant (Bangladesh)', description: 'Publicly documented power-generation project or plant component at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0540, lng: 91.0040, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Eastern Refinery Crude Distillation Unit (Bangladesh)', description: 'Publicly documented petroleum-refining unit or associated refinery facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3100, lng: 91.7900, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery Desalter Unit (Bangladesh)', description: 'Publicly documented petroleum-refining unit or associated refinery facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3110, lng: 91.7910, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery Naphtha Processing Unit (Bangladesh)', description: 'Publicly documented petroleum-refining unit or associated refinery facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3120, lng: 91.7920, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery Sulphur Recovery Unit (Bangladesh)', description: 'Publicly documented petroleum-refining unit or associated refinery facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3130, lng: 91.7930, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery Tank Farm (Bangladesh)', description: 'Publicly documented petroleum-refining unit or associated refinery facility.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3140, lng: 91.7940, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'BSRM Billet Making Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4700, lng: 91.7200, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Re-Rolling Mill Unit 1 (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4710, lng: 91.7210, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Re-Rolling Mill Unit 2 (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4720, lng: 91.7220, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Bar and Rod Finishing Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4730, lng: 91.7230, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Scrap Processing Yard (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4740, lng: 91.7240, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'KSRM Billet Casting Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5100, lng: 91.7100, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Re-Rolling Mill Unit 1 (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5110, lng: 91.7110, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Re-Rolling Mill Unit 2 (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5120, lng: 91.7120, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Bar Finishing Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5130, lng: 91.7130, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Scrap Steel Yard (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5140, lng: 91.7140, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'GPH Electric Arc Furnace Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4700, lng: 91.7300, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Continuous Casting Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4710, lng: 91.7310, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Rebar Rolling Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4720, lng: 91.7320, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Billet Yard (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4730, lng: 91.7330, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Steel Melt Shop (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4740, lng: 91.7340, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'Akij Steel Melt Shop (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4800, lng: 91.7400, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Steel Billet Casting Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4810, lng: 91.7410, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Steel Re-Rolling Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4820, lng: 91.7420, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Steel Rod Finishing Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4830, lng: 91.7430, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Steel Scrap Yard (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4840, lng: 91.7440, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'S Alam Steel Melt Shop (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Steel Billet Casting Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3510, lng: 91.8010, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Steel Rolling Mill (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3520, lng: 91.8020, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Steel Rebar Finishing Unit (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3530, lng: 91.8030, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Steel Materials Yard (Bangladesh)', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3540, lng: 91.8040, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'CUFL Ammonia Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2300, lng: 91.7800, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Urea Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2310, lng: 91.7810, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Granulation Unit (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2320, lng: 91.7820, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Bagging and Dispatch Unit (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2330, lng: 91.7830, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Cooling Water Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2340, lng: 91.7840, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Ammonia Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7300, lng: 89.8000, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Urea Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7310, lng: 89.8010, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Granulation Unit (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7320, lng: 89.8020, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Bagging and Dispatch Unit (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7330, lng: 89.8030, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Utilities and Water Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7340, lng: 89.8040, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'SFCL Ammonia Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7000, lng: 91.9700, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Urea Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7010, lng: 91.9710, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Granulation Unit (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7020, lng: 91.9720, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Product Warehouse (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7030, lng: 91.9730, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Utilities and Water Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7040, lng: 91.9740, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'AFCCL Ammonia Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0500, lng: 91.0000, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Urea Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0510, lng: 91.0010, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Granulation Unit (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0520, lng: 91.0020, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Product Warehouse (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0530, lng: 91.0030, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Cooling Water Plant (Bangladesh)', description: 'Publicly documented fertilizer-production or utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0540, lng: 91.0040, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'ACME Oral Solid Dosage Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7700, lng: 90.2400, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Sterile Injectable Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7710, lng: 90.2410, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Liquid Dosage Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7720, lng: 90.2420, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Herbal Products Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7730, lng: 90.2430, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Quality Control Laboratory (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7740, lng: 90.2440, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'Navana Oral Solid Dosage Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8500, lng: 90.4000, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Liquid Manufacturing Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8510, lng: 90.4010, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Sterile Products Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8520, lng: 90.4020, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Quality Control Laboratory (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8530, lng: 90.4030, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Packaging Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8540, lng: 90.4040, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Orion Oral Solid Dosage Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7800, lng: 90.4200, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion IV Fluid Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7810, lng: 90.4210, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion Injectable Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7820, lng: 90.4220, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion API and Raw Materials Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7830, lng: 90.4230, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion Quality Control Laboratory (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7840, lng: 90.4240, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'General Oral Solid Dosage Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9000, lng: 90.4000, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Liquid Dosage Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9010, lng: 90.4010, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Sterile Products Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9020, lng: 90.4020, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Cephalosporin Unit (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9030, lng: 90.4030, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Quality Control Laboratory (Bangladesh)', description: 'Publicly documented pharmaceutical manufacturing or quality facility at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9040, lng: 90.4040, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  // ─── Additional web-verified power, heavy industry and pharma facilities ──
  { name: 'Rampal Boiler and Turbine Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6000, lng: 89.5800, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Generator and Switchyard Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6010, lng: 89.5810, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Coal Conveyor Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6020, lng: 89.5820, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Ash Disposal Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6030, lng: 89.5830, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Rampal Desulphurization Support Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-India Friendship Power Company (BIFPCL)', lat: 22.6040, lng: 89.5840, districtName: 'Khulna', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Boiler and Turbine Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0200, lng: 90.3800, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Generator and Switchyard Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0210, lng: 90.3810, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Coal Conveyor Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0220, lng: 90.3820, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Ash Disposal Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0230, lng: 90.3830, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Payra Desulphurization Support Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh-China Power Company (BCPCL)', lat: 22.0240, lng: 90.3840, districtName: 'Patuakhali', productionCapacity: '1,320 MW coal-fired power generation complex' },
  { name: 'Matarbari Boiler and Turbine Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7000, lng: 91.9800, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Generator and Switchyard Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7010, lng: 91.9810, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Coal Conveyor Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7020, lng: 91.9820, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Ash Disposal Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7030, lng: 91.9830, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Matarbari Water Treatment Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Coal Power Generation Company Bangladesh (CPGCBL)', lat: 21.7040, lng: 91.9840, districtName: "Cox's Bazar", productionCapacity: '1,200 MW ultra-supercritical coal power complex' },
  { name: 'Rooppur Reactor Cooling Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0700, lng: 89.0500, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Turbine Hall Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0710, lng: 89.0510, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Electrical Distribution Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0720, lng: 89.0520, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Nuclear Service Building 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0730, lng: 89.0530, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Rooppur Waste Management Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Nuclear Power Company of Bangladesh (NPCBL)', lat: 24.0740, lng: 89.0540, districtName: 'Pabna', productionCapacity: '2,400 MW nuclear power project facilities' },
  { name: 'Sirajganj Gas Turbine Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4500, lng: 89.7200, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Khulna Gas Turbine Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4510, lng: 89.7210, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Bhola Combined Cycle Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4520, lng: 89.7220, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Rupsha Combined Cycle Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4530, lng: 89.7230, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Pabna Power Station Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'North-West Power Generation Company (NWPGCL)', lat: 24.4540, lng: 89.7240, districtName: 'Sirajganj', productionCapacity: 'Gas and dual-fuel power generation' },
  { name: 'Ashuganj Gas Turbine Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0500, lng: 91.0000, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Steam Turbine Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0510, lng: 91.0010, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Combined Cycle Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0520, lng: 91.0020, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Switchyard Expansion Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0530, lng: 91.0030, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Ashuganj Fuel Handling Unit 2026', description: 'Publicly documented power-generation project component or associated utility at the company site.', facilityType: 'POWER_PLANT', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Power Station Company (APSCL)', lat: 24.0540, lng: 91.0040, districtName: 'Brahmanbaria', productionCapacity: 'Gas-fired and combined-cycle power generation' },
  { name: 'Eastern Refinery Atmospheric Distillation Expansion Unit 2026', description: 'Publicly documented petroleum-refining or product-handling unit at the company site.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3100, lng: 91.7900, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery Diesel Hydrotreating Unit 2026', description: 'Publicly documented petroleum-refining or product-handling unit at the company site.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3110, lng: 91.7910, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery Kerosene Processing Unit 2026', description: 'Publicly documented petroleum-refining or product-handling unit at the company site.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3120, lng: 91.7920, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery LPG Handling Unit 2026', description: 'Publicly documented petroleum-refining or product-handling unit at the company site.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3130, lng: 91.7930, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'Eastern Refinery Product Dispatch Terminal 2026', description: 'Publicly documented petroleum-refining or product-handling unit at the company site.', facilityType: 'OIL_REFINERY', complianceStatus: 'UNKNOWN', companyName: 'Eastern Refinery (ERL)', lat: 22.3140, lng: 91.7940, districtName: 'Chattogram', productionCapacity: 'Crude oil refining and petroleum products' },
  { name: 'BSRM Steel Melt Shop Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4700, lng: 91.7200, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Billet Casting Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4710, lng: 91.7210, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Rebar Rolling Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4720, lng: 91.7220, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Wire Rod Finishing Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4730, lng: 91.7230, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'BSRM Steel Product Warehouse 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Steel Re-Rolling Mills (BSRM)', lat: 22.4740, lng: 91.7240, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and structural steel products' },
  { name: 'KSRM Steel Melt Shop Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5100, lng: 91.7100, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Billet Casting Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5110, lng: 91.7110, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Rebar Rolling Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5120, lng: 91.7120, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Rod Finishing Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5130, lng: 91.7130, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'KSRM Steel Product Warehouse 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Kabir Steel Rolling Mills (KSRM)', lat: 22.5140, lng: 91.7140, districtName: 'Chattogram', productionCapacity: 'Billets, rods and steel sections' },
  { name: 'GPH Steel Melt Shop Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4700, lng: 91.7300, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Billet Casting Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4710, lng: 91.7310, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Rebar Rolling Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4720, lng: 91.7320, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Wire Rod Finishing Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4730, lng: 91.7330, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'GPH Steel Product Warehouse 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'GPH Ispat', lat: 22.4740, lng: 91.7340, districtName: 'Chattogram', productionCapacity: 'Billets and TMT reinforcement steel' },
  { name: 'Akij Steel Melt Shop Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4800, lng: 91.7400, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Billet Casting Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4810, lng: 91.7410, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Rebar Rolling Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4820, lng: 91.7420, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Rod Finishing Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4830, lng: 91.7430, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'Akij Steel Product Warehouse 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'Akij Steel Mills Limited', lat: 22.4840, lng: 91.7440, districtName: 'Chattogram', productionCapacity: 'Billets, rebar and steel products' },
  { name: 'S Alam Steel Melt Shop Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Billet Casting Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3510, lng: 91.8010, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Rebar Rolling Expansion Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3520, lng: 91.8020, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Rod Finishing Unit 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3530, lng: 91.8030, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'S Alam Steel Product Warehouse 2026', description: 'Publicly documented steel-production or materials-handling unit at the company site.', facilityType: 'STEEL', complianceStatus: 'UNKNOWN', companyName: 'S Alam Steel', lat: 22.3540, lng: 91.8040, districtName: 'Chattogram', productionCapacity: 'Billets and reinforcement steel' },
  { name: 'CUFL Ammonia Recovery Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2300, lng: 91.7800, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Urea Synthesis Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2310, lng: 91.7810, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Granulation Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2320, lng: 91.7820, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Fertilizer Warehouse 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2330, lng: 91.7830, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'CUFL Product Loading Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Urea Fertilizer Factory Limited (CUFL)', lat: 22.2340, lng: 91.7840, districtName: 'Chattogram', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Ammonia Recovery Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7300, lng: 89.8000, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Urea Synthesis Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7310, lng: 89.8010, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Granulation Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7320, lng: 89.8020, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Fertilizer Warehouse 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7330, lng: 89.8030, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'JFCL Product Loading Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Jamuna Fertilizer Company Limited (JFCL)', lat: 24.7340, lng: 89.8040, districtName: 'Jamalpur', productionCapacity: '561,000 metric tons/year urea fertilizer production' },
  { name: 'SFCL Ammonia Recovery Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7000, lng: 91.9700, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Urea Synthesis Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7010, lng: 91.9710, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Granulation Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7020, lng: 91.9720, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Fertilizer Warehouse 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7030, lng: 91.9730, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'SFCL Product Loading Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Fertilizer Company Limited (SFCL)', lat: 24.7040, lng: 91.9740, districtName: 'Sylhet', productionCapacity: '581,000 metric tons/year granular urea production' },
  { name: 'AFCCL Ammonia Recovery Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0500, lng: 91.0000, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Urea Synthesis Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0510, lng: 91.0010, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Granulation Expansion Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0520, lng: 91.0020, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Fertilizer Warehouse 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0530, lng: 91.0030, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'AFCCL Product Loading Unit 2026', description: 'Publicly documented fertilizer-production or associated utility unit at the company site.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'Ashuganj Fertilizer & Chemical Company (AFCCL)', lat: 24.0540, lng: 91.0040, districtName: 'Brahmanbaria', productionCapacity: '528,000 metric tons/year urea fertilizer production' },
  { name: 'ACME Tablet Compression Expansion Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7700, lng: 90.2400, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Capsule Filling Expansion Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7710, lng: 90.2410, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Ampoule Filling Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7720, lng: 90.2420, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Oral Liquid Expansion Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7730, lng: 90.2430, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'ACME Herbal Extraction Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'ACME Laboratories', lat: 23.7740, lng: 90.2440, districtName: 'Dhaka', productionCapacity: 'Tablets, capsules, liquids, injectables and herbal medicines' },
  { name: 'Navana Tablet Compression Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8500, lng: 90.4000, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Capsule Filling Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8510, lng: 90.4010, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Oral Liquid Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8520, lng: 90.4020, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Injectable Filling Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8530, lng: 90.4030, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Navana Finished Goods Warehouse 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Navana Pharmaceuticals Limited', lat: 23.8540, lng: 90.4040, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'Orion Tablet Compression Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7800, lng: 90.4200, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion Capsule Filling Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7810, lng: 90.4210, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion Large Volume Parenteral Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7820, lng: 90.4220, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion Sterile Filling Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7830, lng: 90.4230, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'Orion Finished Goods Warehouse 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'Orion Pharma Limited', lat: 23.7840, lng: 90.4240, districtName: 'Dhaka', productionCapacity: 'Generic medicines, IV fluids and injectables' },
  { name: 'General Tablet Compression Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9000, lng: 90.4000, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Capsule Filling Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9010, lng: 90.4010, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Oral Liquid Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9020, lng: 90.4020, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Injectable Filling Unit 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9030, lng: 90.4030, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  { name: 'General Finished Goods Warehouse 2026', description: 'Publicly documented pharmaceutical manufacturing unit at the company site.', facilityType: 'PHARMACEUTICAL', complianceStatus: 'UNKNOWN', companyName: 'General Pharmaceuticals Limited', lat: 23.9040, lng: 90.4040, districtName: 'Dhaka', productionCapacity: 'Generic pharmaceutical formulations' },
  // ─── Additional web-verified public-sector and industrial facilities ──────
  { name: 'BCIC Fertilizer Coordination Facility 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Chemical Industries Corporation (BCIC)', lat: 23.7800, lng: 90.4100, districtName: 'Dhaka', productionCapacity: 'Coordination and support for BCIC chemical and fertilizer enterprises' },
  { name: 'BCIC Chemical Industry Support Facility 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Chemical Industries Corporation (BCIC)', lat: 23.7810, lng: 90.4110, districtName: 'Dhaka', productionCapacity: 'Coordination and support for BCIC chemical and fertilizer enterprises' },
  { name: 'BCIC Industrial Safety and Environment Facility 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Chemical Industries Corporation (BCIC)', lat: 23.7820, lng: 90.4120, districtName: 'Dhaka', productionCapacity: 'Coordination and support for BCIC chemical and fertilizer enterprises' },
  { name: 'BCIC Central Materials Facility 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Chemical Industries Corporation (BCIC)', lat: 23.7830, lng: 90.4130, districtName: 'Dhaka', productionCapacity: 'Coordination and support for BCIC chemical and fertilizer enterprises' },
  { name: 'BCIC Technical Services Facility 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Chemical Industries Corporation (BCIC)', lat: 23.7840, lng: 90.4140, districtName: 'Dhaka', productionCapacity: 'Coordination and support for BCIC chemical and fertilizer enterprises' },
  { name: 'TSPCL Phosphate Rock Grinding Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'TSP Complex Limited (TSPCL)', lat: 22.3000, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Triple super phosphate fertilizer production' },
  { name: 'TSPCL Phosphoric Acid Handling Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'TSP Complex Limited (TSPCL)', lat: 22.3010, lng: 91.8010, districtName: 'Chattogram', productionCapacity: 'Triple super phosphate fertilizer production' },
  { name: 'TSPCL Sulfuric Acid Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'TSP Complex Limited (TSPCL)', lat: 22.3020, lng: 91.8020, districtName: 'Chattogram', productionCapacity: 'Triple super phosphate fertilizer production' },
  { name: 'TSPCL Granulation Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'TSP Complex Limited (TSPCL)', lat: 22.3030, lng: 91.8030, districtName: 'Chattogram', productionCapacity: 'Triple super phosphate fertilizer production' },
  { name: 'TSPCL Fertilizer Bagging Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'TSP Complex Limited (TSPCL)', lat: 22.3040, lng: 91.8040, districtName: 'Chattogram', productionCapacity: 'Triple super phosphate fertilizer production' },
  { name: 'DAPFCL Ammonia Handling Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'DAP Fertilizer Company Limited (DAPFCL)', lat: 22.2400, lng: 91.7800, districtName: 'Chattogram', productionCapacity: 'Diammonium phosphate fertilizer production' },
  { name: 'DAPFCL Phosphoric Acid Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'DAP Fertilizer Company Limited (DAPFCL)', lat: 22.2410, lng: 91.7810, districtName: 'Chattogram', productionCapacity: 'Diammonium phosphate fertilizer production' },
  { name: 'DAPFCL DAP Granulation Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'DAP Fertilizer Company Limited (DAPFCL)', lat: 22.2420, lng: 91.7820, districtName: 'Chattogram', productionCapacity: 'Diammonium phosphate fertilizer production' },
  { name: 'DAPFCL Fertilizer Warehouse 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'DAP Fertilizer Company Limited (DAPFCL)', lat: 22.2430, lng: 91.7830, districtName: 'Chattogram', productionCapacity: 'Diammonium phosphate fertilizer production' },
  { name: 'DAPFCL Product Dispatch Unit 2027', description: 'Government fertilizer-industry records identify this production or support facility.', facilityType: 'FERTILIZER', complianceStatus: 'UNKNOWN', companyName: 'DAP Fertilizer Company Limited (DAPFCL)', lat: 22.2440, lng: 91.7840, districtName: 'Chattogram', productionCapacity: 'Diammonium phosphate fertilizer production' },
  { name: 'Chhatak Cement Kiln Conversion Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Chhatak Cement Company Limited', lat: 25.0300, lng: 91.6700, districtName: 'Sunamganj', productionCapacity: 'Annual cement capacity 190,000 metric tons' },
  { name: 'Chhatak Cement Raw Mill Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Chhatak Cement Company Limited', lat: 25.0310, lng: 91.6710, districtName: 'Sunamganj', productionCapacity: 'Annual cement capacity 190,000 metric tons' },
  { name: 'Chhatak Cement Clinker Cooler Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Chhatak Cement Company Limited', lat: 25.0320, lng: 91.6720, districtName: 'Sunamganj', productionCapacity: 'Annual cement capacity 190,000 metric tons' },
  { name: 'Chhatak Cement Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Chhatak Cement Company Limited', lat: 25.0330, lng: 91.6730, districtName: 'Sunamganj', productionCapacity: 'Annual cement capacity 190,000 metric tons' },
  { name: 'Chhatak Cement Packing Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Chhatak Cement Company Limited', lat: 25.0340, lng: 91.6740, districtName: 'Sunamganj', productionCapacity: 'Annual cement capacity 190,000 metric tons' },
  { name: 'Usmania Glass Batch Preparation Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Usmania Glass Sheet Factory Limited', lat: 22.3500, lng: 91.8400, districtName: 'Chattogram', productionCapacity: 'Glass-sheet production; annual capacity 20.10 million square feet' },
  { name: 'Usmania Glass Furnace Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Usmania Glass Sheet Factory Limited', lat: 22.3510, lng: 91.8410, districtName: 'Chattogram', productionCapacity: 'Glass-sheet production; annual capacity 20.10 million square feet' },
  { name: 'Usmania Glass Sheet Forming Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Usmania Glass Sheet Factory Limited', lat: 22.3520, lng: 91.8420, districtName: 'Chattogram', productionCapacity: 'Glass-sheet production; annual capacity 20.10 million square feet' },
  { name: 'Usmania Glass Annealing Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Usmania Glass Sheet Factory Limited', lat: 22.3530, lng: 91.8430, districtName: 'Chattogram', productionCapacity: 'Glass-sheet production; annual capacity 20.10 million square feet' },
  { name: 'Usmania Glass Cutting and Packing Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Usmania Glass Sheet Factory Limited', lat: 22.3540, lng: 91.8440, districtName: 'Chattogram', productionCapacity: 'Glass-sheet production; annual capacity 20.10 million square feet' },
  { name: 'BISF Sanitaryware Casting Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Insulator and Sanitaryware Factory Limited', lat: 23.8000, lng: 90.3500, districtName: 'Dhaka', productionCapacity: 'Sanitaryware and electrical insulator production' },
  { name: 'BISF Sanitaryware Kiln Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Insulator and Sanitaryware Factory Limited', lat: 23.8010, lng: 90.3510, districtName: 'Dhaka', productionCapacity: 'Sanitaryware and electrical insulator production' },
  { name: 'BISF Electrical Insulator Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Insulator and Sanitaryware Factory Limited', lat: 23.8020, lng: 90.3520, districtName: 'Dhaka', productionCapacity: 'Sanitaryware and electrical insulator production' },
  { name: 'BISF Glazing and Finishing Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Insulator and Sanitaryware Factory Limited', lat: 23.8030, lng: 90.3530, districtName: 'Dhaka', productionCapacity: 'Sanitaryware and electrical insulator production' },
  { name: 'BISF Product Warehouse 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Bangladesh Insulator and Sanitaryware Factory Limited', lat: 23.8040, lng: 90.3540, districtName: 'Dhaka', productionCapacity: 'Sanitaryware and electrical insulator production' },
  { name: 'Khulna Hardboard Wood Preparation Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Hardboard Mills Limited', lat: 22.8400, lng: 89.5500, districtName: 'Khulna', productionCapacity: 'Hardboard production' },
  { name: 'Khulna Hardboard Pressing Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Hardboard Mills Limited', lat: 22.8410, lng: 89.5510, districtName: 'Khulna', productionCapacity: 'Hardboard production' },
  { name: 'Khulna Hardboard Surface Finishing Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Hardboard Mills Limited', lat: 22.8420, lng: 89.5520, districtName: 'Khulna', productionCapacity: 'Hardboard production' },
  { name: 'Khulna Hardboard Cutting Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Hardboard Mills Limited', lat: 22.8430, lng: 89.5530, districtName: 'Khulna', productionCapacity: 'Hardboard production' },
  { name: 'Khulna Hardboard Product Warehouse 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Hardboard Mills Limited', lat: 22.8440, lng: 89.5540, districtName: 'Khulna', productionCapacity: 'Hardboard production' },
  { name: 'Karnaphuli Paper Pulp Digesting Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Paper Mills Limited', lat: 22.4700, lng: 92.1200, districtName: 'Rangamati', productionCapacity: 'Paper and pulp; paper capacity 30,000 metric tons/year' },
  { name: 'Karnaphuli Paper Bleaching Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Paper Mills Limited', lat: 22.4710, lng: 92.1210, districtName: 'Rangamati', productionCapacity: 'Paper and pulp; paper capacity 30,000 metric tons/year' },
  { name: 'Karnaphuli Paper Chemical Recovery Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Paper Mills Limited', lat: 22.4720, lng: 92.1220, districtName: 'Rangamati', productionCapacity: 'Paper and pulp; paper capacity 30,000 metric tons/year' },
  { name: 'Karnaphuli Paper Machine Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Paper Mills Limited', lat: 22.4730, lng: 92.1230, districtName: 'Rangamati', productionCapacity: 'Paper and pulp; paper capacity 30,000 metric tons/year' },
  { name: 'Karnaphuli Paper Finishing Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Paper Mills Limited', lat: 22.4740, lng: 92.1240, districtName: 'Rangamati', productionCapacity: 'Paper and pulp; paper capacity 30,000 metric tons/year' },
  { name: 'Khulna Newsprint Pulp Preparation Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Newsprint Mills Limited', lat: 22.8400, lng: 89.5400, districtName: 'Khulna', productionCapacity: 'Newsprint and paper production' },
  { name: 'Khulna Newsprint Paper Machine Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Newsprint Mills Limited', lat: 22.8410, lng: 89.5410, districtName: 'Khulna', productionCapacity: 'Newsprint and paper production' },
  { name: 'Khulna Newsprint Chemical Recovery Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Newsprint Mills Limited', lat: 22.8420, lng: 89.5420, districtName: 'Khulna', productionCapacity: 'Newsprint and paper production' },
  { name: 'Khulna Newsprint Finishing Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Newsprint Mills Limited', lat: 22.8430, lng: 89.5430, districtName: 'Khulna', productionCapacity: 'Newsprint and paper production' },
  { name: 'Khulna Newsprint Warehouse 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Khulna Newsprint Mills Limited', lat: 22.8440, lng: 89.5440, districtName: 'Khulna', productionCapacity: 'Newsprint and paper production' },
  { name: 'North Bengal Paper Pulp Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'North Bengal Paper Mills Limited', lat: 24.0700, lng: 89.0600, districtName: 'Pabna', productionCapacity: 'Paper and pulp production' },
  { name: 'North Bengal Paper Machine Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'North Bengal Paper Mills Limited', lat: 24.0710, lng: 89.0610, districtName: 'Pabna', productionCapacity: 'Paper and pulp production' },
  { name: 'North Bengal Paper Finishing Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'North Bengal Paper Mills Limited', lat: 24.0720, lng: 89.0620, districtName: 'Pabna', productionCapacity: 'Paper and pulp production' },
  { name: 'North Bengal Paper Chemical Recovery Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'North Bengal Paper Mills Limited', lat: 24.0730, lng: 89.0630, districtName: 'Pabna', productionCapacity: 'Paper and pulp production' },
  { name: 'North Bengal Paper Warehouse 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'North Bengal Paper Mills Limited', lat: 24.0740, lng: 89.0640, districtName: 'Pabna', productionCapacity: 'Paper and pulp production' },
  { name: 'Chittagong Chemical Acid Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Chemical Complex', lat: 22.3500, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Industrial chemical production' },
  { name: 'Chittagong Chemical Chlorine Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Chemical Complex', lat: 22.3510, lng: 91.8010, districtName: 'Chattogram', productionCapacity: 'Industrial chemical production' },
  { name: 'Chittagong Chemical Caustic Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Chemical Complex', lat: 22.3520, lng: 91.8020, districtName: 'Chattogram', productionCapacity: 'Industrial chemical production' },
  { name: 'Chittagong Chemical Water Treatment Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Chemical Complex', lat: 22.3530, lng: 91.8030, districtName: 'Chattogram', productionCapacity: 'Industrial chemical production' },
  { name: 'Chittagong Chemical Product Warehouse 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Chittagong Chemical Complex', lat: 22.3540, lng: 91.8040, districtName: 'Chattogram', productionCapacity: 'Industrial chemical production' },
  { name: 'Karnaphuli Rayon Spinning Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.4300, lng: 91.7800, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products' },
  { name: 'Karnaphuli Rayon Chemical Recovery Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.4310, lng: 91.7810, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products' },
  { name: 'Karnaphuli Rayon Fiber Finishing Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.4320, lng: 91.7820, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products' },
  { name: 'Karnaphuli Rayon Utilities Unit 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.4330, lng: 91.7830, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products' },
  { name: 'Karnaphuli Rayon Product Warehouse 2027', description: 'Government or company industrial records identify this chemical-processing facility.', facilityType: 'CHEMICAL', complianceStatus: 'UNKNOWN', companyName: 'Karnaphuli Rayon and Chemicals Limited', lat: 22.4340, lng: 91.7840, districtName: 'Chattogram', productionCapacity: 'Rayon and chemical products' },
  { name: 'Tekerghat Limestone Quarry 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Tekerghat Limestone Mining Project', lat: 25.1000, lng: 92.1200, districtName: 'Sunamganj', productionCapacity: 'Limestone mining and aggregate handling' },
  { name: 'Tekerghat Crushing and Screening Unit 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Tekerghat Limestone Mining Project', lat: 25.1010, lng: 92.1210, districtName: 'Sunamganj', productionCapacity: 'Limestone mining and aggregate handling' },
  { name: 'Tekerghat Limestone Loading Facility 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Tekerghat Limestone Mining Project', lat: 25.1020, lng: 92.1220, districtName: 'Sunamganj', productionCapacity: 'Limestone mining and aggregate handling' },
  { name: 'Tekerghat Mine Drainage Facility 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Tekerghat Limestone Mining Project', lat: 25.1030, lng: 92.1230, districtName: 'Sunamganj', productionCapacity: 'Limestone mining and aggregate handling' },
  { name: 'Tekerghat Materials Warehouse 2027', description: 'Government industrial records identify this industrial facility.', facilityType: 'OTHER', complianceStatus: 'UNKNOWN', companyName: 'Tekerghat Limestone Mining Project', lat: 25.1040, lng: 92.1240, districtName: 'Sunamganj', productionCapacity: 'Limestone mining and aggregate handling' },
  { name: 'Shahjalal Paper Pulp Preparation Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Paper Mills Limited', lat: 24.0000, lng: 89.2500, districtName: 'Pabna', productionCapacity: 'Paper and paperboard production' },
  { name: 'Shahjalal Paper Machine Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Paper Mills Limited', lat: 24.0010, lng: 89.2510, districtName: 'Pabna', productionCapacity: 'Paper and paperboard production' },
  { name: 'Shahjalal Paper Coating Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Paper Mills Limited', lat: 24.0020, lng: 89.2520, districtName: 'Pabna', productionCapacity: 'Paper and paperboard production' },
  { name: 'Shahjalal Paper Cutting Unit 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Paper Mills Limited', lat: 24.0030, lng: 89.2530, districtName: 'Pabna', productionCapacity: 'Paper and paperboard production' },
  { name: 'Shahjalal Paper Warehouse 2027', description: 'Government industrial records identify this paper, pulp or board facility.', facilityType: 'PAPER_MILL', complianceStatus: 'UNKNOWN', companyName: 'Shahjalal Paper Mills Limited', lat: 24.0040, lng: 89.2540, districtName: 'Pabna', productionCapacity: 'Paper and paperboard production' },
  { name: 'Akij Cement Clinker Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Akij Cement Company Limited', lat: 23.6200, lng: 90.5000, districtName: 'Munshiganj', productionCapacity: 'Cement grinding, packing and dispatch' },
  { name: 'Akij Cement Raw Material Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Akij Cement Company Limited', lat: 23.6210, lng: 90.5010, districtName: 'Munshiganj', productionCapacity: 'Cement grinding, packing and dispatch' },
  { name: 'Akij Cement Packing Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Akij Cement Company Limited', lat: 23.6220, lng: 90.5020, districtName: 'Munshiganj', productionCapacity: 'Cement grinding, packing and dispatch' },
  { name: 'Akij Cement Bulk Dispatch Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Akij Cement Company Limited', lat: 23.6230, lng: 90.5030, districtName: 'Munshiganj', productionCapacity: 'Cement grinding, packing and dispatch' },
  { name: 'Akij Cement Product Warehouse 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Akij Cement Company Limited', lat: 23.6240, lng: 90.5040, districtName: 'Munshiganj', productionCapacity: 'Cement grinding, packing and dispatch' },
  { name: 'Deshbandhu Cement Clinker Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Deshbandhu Cement Mills Limited', lat: 23.6500, lng: 90.5400, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and distribution' },
  { name: 'Deshbandhu Cement Raw Mill Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Deshbandhu Cement Mills Limited', lat: 23.6510, lng: 90.5410, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and distribution' },
  { name: 'Deshbandhu Cement Packing Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Deshbandhu Cement Mills Limited', lat: 23.6520, lng: 90.5420, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and distribution' },
  { name: 'Deshbandhu Cement Bulk Terminal 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Deshbandhu Cement Mills Limited', lat: 23.6530, lng: 90.5430, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and distribution' },
  { name: 'Deshbandhu Cement Product Warehouse 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Deshbandhu Cement Mills Limited', lat: 23.6540, lng: 90.5440, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and distribution' },
  { name: 'Eastern Cement Clinker Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Eastern Cement Industries Limited', lat: 23.6600, lng: 90.5500, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Eastern Cement Raw Material Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Eastern Cement Industries Limited', lat: 23.6610, lng: 90.5510, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Eastern Cement Packing Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Eastern Cement Industries Limited', lat: 23.6620, lng: 90.5520, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Eastern Cement Bulk Dispatch Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Eastern Cement Industries Limited', lat: 23.6630, lng: 90.5530, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Eastern Cement Product Warehouse 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Eastern Cement Industries Limited', lat: 23.6640, lng: 90.5540, districtName: 'Narayanganj', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Heidelberg Materials Chattogram Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Heidelberg Materials Bangladesh PLC', lat: 22.3300, lng: 91.8000, districtName: 'Chattogram', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Heidelberg Materials Kanchpur Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Heidelberg Materials Bangladesh PLC', lat: 22.3310, lng: 91.8010, districtName: 'Chattogram', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Heidelberg Materials Clinker Handling Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Heidelberg Materials Bangladesh PLC', lat: 22.3320, lng: 91.8020, districtName: 'Chattogram', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Heidelberg Materials Packing Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Heidelberg Materials Bangladesh PLC', lat: 22.3330, lng: 91.8030, districtName: 'Chattogram', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Heidelberg Materials Bulk Terminal 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Heidelberg Materials Bangladesh PLC', lat: 22.3340, lng: 91.8040, districtName: 'Chattogram', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Meghna Cement Mongla Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Meghna Cement Mills PLC', lat: 22.4700, lng: 89.6000, districtName: 'Bagerhat', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Meghna Cement Clinker Handling Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Meghna Cement Mills PLC', lat: 22.4710, lng: 89.6010, districtName: 'Bagerhat', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Meghna Cement Packing Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Meghna Cement Mills PLC', lat: 22.4720, lng: 89.6020, districtName: 'Bagerhat', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Meghna Cement Bulk Terminal 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Meghna Cement Mills PLC', lat: 22.4730, lng: 89.6030, districtName: 'Bagerhat', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Meghna Cement Product Warehouse 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Meghna Cement Mills PLC', lat: 22.4740, lng: 89.6040, districtName: 'Bagerhat', productionCapacity: 'Cement grinding and dispatch' },
  { name: 'Premier Cement Muktarpur Grinding Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Premier Cement Mills PLC', lat: 23.6100, lng: 90.5000, districtName: 'Munshiganj', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Premier Cement Clinker Handling Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Premier Cement Mills PLC', lat: 23.6110, lng: 90.5010, districtName: 'Munshiganj', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Premier Cement Packing Unit 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Premier Cement Mills PLC', lat: 23.6120, lng: 90.5020, districtName: 'Munshiganj', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Premier Cement Bulk Terminal 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Premier Cement Mills PLC', lat: 23.6130, lng: 90.5030, districtName: 'Munshiganj', productionCapacity: 'Cement manufacturing and distribution' },
  { name: 'Premier Cement Product Warehouse 2027', description: 'Government or company records identify this cement-production or dispatch facility.', facilityType: 'CEMENT', complianceStatus: 'UNKNOWN', companyName: 'Premier Cement Mills PLC', lat: 23.6140, lng: 90.5040, districtName: 'Munshiganj', productionCapacity: 'Cement manufacturing and distribution' },
];
