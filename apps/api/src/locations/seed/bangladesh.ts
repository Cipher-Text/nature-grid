/**
 * Bangladesh administrative geography seed.
 * Source: Bangladesh Election Commission official division/district list.
 * All 8 divisions and 64 districts.
 */

export const DIVISIONS = [
  { name: 'Barishal',   bnName: 'বরিশাল' },
  { name: 'Chattogram', bnName: 'চট্টগ্রাম' },
  { name: 'Dhaka',      bnName: 'ঢাকা' },
  { name: 'Khulna',     bnName: 'খুলনা' },
  { name: 'Mymensingh', bnName: 'ময়মনসিংহ' },
  { name: 'Rajshahi',   bnName: 'রাজশাহী' },
  { name: 'Rangpur',    bnName: 'রংপুর' },
  { name: 'Sylhet',     bnName: 'সিলেট' },
] as const;

export const DISTRICTS_BY_DIVISION: Record<string, { name: string; bnName: string }[]> = {
  Barishal: [
    { name: 'Barishal',     bnName: 'বরিশাল' },
    { name: 'Barguna',      bnName: 'বরগুনা' },
    { name: 'Bhola',        bnName: 'ভোলা' },
    { name: 'Jhalokati',    bnName: 'ঝালকাঠি' },
    { name: 'Patuakhali',   bnName: 'পটুয়াখালী' },
    { name: 'Pirojpur',     bnName: 'পিরোজপুর' },
  ],
  Chattogram: [
    { name: 'Chattogram',   bnName: 'চট্টগ্রাম' },
    { name: "Cox's Bazar",  bnName: "কক্সবাজার" },
    { name: 'Cumilla',      bnName: 'কুমিল্লা' },
    { name: 'Brahmanbaria', bnName: 'ব্রাহ্মণবাড়িয়া' },
    { name: 'Chandpur',     bnName: 'চাঁদপুর' },
    { name: 'Feni',         bnName: 'ফেনী' },
    { name: 'Khagrachhari', bnName: 'খাগড়াছড়ি' },
    { name: 'Lakshmipur',   bnName: 'লক্ষ্মীপুর' },
    { name: 'Noakhali',     bnName: 'নোয়াখালী' },
    { name: 'Rangamati',    bnName: 'রাঙ্গামাটি' },
    { name: 'Bandarban',    bnName: 'বান্দরবান' },
  ],
  Dhaka: [
    { name: 'Dhaka',        bnName: 'ঢাকা' },
    { name: 'Faridpur',     bnName: 'ফরিদপুর' },
    { name: 'Gazipur',      bnName: 'গাজীপুর' },
    { name: 'Gopalganj',    bnName: 'গোপালগঞ্জ' },
    { name: 'Kishoreganj',  bnName: 'কিশোরগঞ্জ' },
    { name: 'Madaripur',    bnName: 'মাদারীপুর' },
    { name: 'Manikganj',    bnName: 'মানিকগঞ্জ' },
    { name: 'Munshiganj',   bnName: 'মুন্সীগঞ্জ' },
    { name: 'Narayanganj',  bnName: 'নারায়ণগঞ্জ' },
    { name: 'Narsingdi',    bnName: 'নরসিংদী' },
    { name: 'Rajbari',      bnName: 'রাজবাড়ী' },
    { name: 'Shariatpur',   bnName: 'শরীয়তপুর' },
    { name: 'Tangail',      bnName: 'টাঙ্গাইল' },
  ],
  Khulna: [
    { name: 'Khulna',       bnName: 'খুলনা' },
    { name: 'Bagerhat',     bnName: 'বাগেরহাট' },
    { name: 'Chuadanga',    bnName: 'চুয়াডাঙ্গা' },
    { name: 'Jashore',      bnName: 'যশোর' },
    { name: 'Jhenaidah',    bnName: 'ঝিনাইদহ' },
    { name: 'Kushtia',      bnName: 'কুষ্টিয়া' },
    { name: 'Magura',       bnName: 'মাগুরা' },
    { name: 'Meherpur',     bnName: 'মেহেরপুর' },
    { name: 'Narail',       bnName: 'নড়াইল' },
    { name: 'Satkhira',     bnName: 'সাতক্ষীরা' },
  ],
  Mymensingh: [
    { name: 'Mymensingh',   bnName: 'ময়মনসিংহ' },
    { name: 'Jamalpur',     bnName: 'জামালপুর' },
    { name: 'Netrokona',    bnName: 'নেত্রকোণা' },
    { name: 'Sherpur',      bnName: 'শেরপুর' },
  ],
  Rajshahi: [
    { name: 'Rajshahi',     bnName: 'রাজশাহী' },
    { name: 'Bogura',       bnName: 'বগুড়া' },
    { name: 'Chapainawabganj', bnName: 'চাঁপাইনবাবগঞ্জ' },
    { name: 'Joypurhat',    bnName: 'জয়পুরহাট' },
    { name: 'Naogaon',      bnName: 'নওগাঁ' },
    { name: 'Natore',       bnName: 'নাটোর' },
    { name: 'Pabna',        bnName: 'পাবনা' },
    { name: 'Sirajganj',    bnName: 'সিরাজগঞ্জ' },
  ],
  Rangpur: [
    { name: 'Rangpur',      bnName: 'রংপুর' },
    { name: 'Dinajpur',     bnName: 'দিনাজপুর' },
    { name: 'Gaibandha',    bnName: 'গাইবান্ধা' },
    { name: 'Kurigram',     bnName: 'কুড়িগ্রাম' },
    { name: 'Lalmonirhat',  bnName: 'লালমনিরহাট' },
    { name: 'Nilphamari',   bnName: 'নীলফামারী' },
    { name: 'Panchagarh',   bnName: 'পঞ্চগড়' },
    { name: 'Thakurgaon',   bnName: 'ঠাকুরগাঁও' },
  ],
  Sylhet: [
    { name: 'Sylhet',       bnName: 'সিলেট' },
    { name: 'Habiganj',     bnName: 'হবিগঞ্জ' },
    { name: 'Moulvibazar',  bnName: 'মৌলভীবাজার' },
    { name: 'Sunamganj',    bnName: 'সুনামগঞ্জ' },
  ],
};
