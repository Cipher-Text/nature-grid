/**
 * Bangladesh administrative geography seed.
 * Source: Bangladesh Election Commission official division/district list.
 * District lat/lng sourced from the open-nature district registry.
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

export const DISTRICTS_BY_DIVISION: Record<
  string,
  { name: string; bnName: string; lat: number; lng: number }[]
> = {
  Barishal: [
    { name: 'Barishal',     bnName: 'বরিশাল',    lat: 22.7004179,  lng: 90.3731568 },
    { name: 'Barguna',      bnName: 'বরগুনা',    lat: 22.159182,   lng: 90.125581 },
    { name: 'Bhola',        bnName: 'ভোলা',      lat: 22.685923,   lng: 90.648179 },
    { name: 'Jhalokati',    bnName: 'ঝালকাঠি',   lat: 22.6422689,  lng: 90.2003932 },
    { name: 'Patuakhali',   bnName: 'পটুয়াখালী', lat: 22.3596316,  lng: 90.3298712 },
    { name: 'Pirojpur',     bnName: 'পিরোজপুর',  lat: 22.5781398,  lng: 89.9983909 },
  ],
  Chattogram: [
    { name: 'Chattogram',   bnName: 'চট্টগ্রাম',    lat: 22.335109,   lng: 91.834073 },
    { name: "Cox's Bazar",  bnName: "কক্সবাজার",   lat: 21.44315751, lng: 91.97381741 },
    { name: 'Cumilla',      bnName: 'কুমিল্লা',     lat: 23.4682747,  lng: 91.1788135 },
    { name: 'Brahmanbaria', bnName: 'ব্রাহ্মণবাড়িয়া', lat: 23.9570904,  lng: 91.1119286 },
    { name: 'Chandpur',     bnName: 'চাঁদপুর',      lat: 23.2332585,  lng: 90.6712912 },
    { name: 'Feni',         bnName: 'ফেনী',        lat: 23.023231,   lng: 91.3840844 },
    { name: 'Khagrachhari', bnName: 'খাগড়াছড়ি',    lat: 23.119285,   lng: 91.984663 },
    { name: 'Lakshmipur',   bnName: 'লক্ষ্মীপুর',   lat: 22.942477,   lng: 90.841184 },
    { name: 'Noakhali',     bnName: 'নোয়াখালী',    lat: 22.869563,   lng: 91.099398 },
    { name: 'Rangamati',    bnName: 'রাঙ্গামাটি',   lat: 22.65561018, lng: 92.17541121 },
    { name: 'Bandarban',    bnName: 'বান্দরবান',    lat: 22.1953275,  lng: 92.2183773 },
  ],
  Dhaka: [
    { name: 'Dhaka',        bnName: 'ঢাকা',       lat: 23.7115253,  lng: 90.4111451 },
    { name: 'Faridpur',     bnName: 'ফরিদপুর',    lat: 23.6070822,  lng: 89.8429406 },
    { name: 'Gazipur',      bnName: 'গাজীপুর',    lat: 24.0022858,  lng: 90.4264283 },
    { name: 'Gopalganj',    bnName: 'গোপালগঞ্জ',  lat: 23.0050857,  lng: 89.8266059 },
    { name: 'Kishoreganj',  bnName: 'কিশোরগঞ্জ',  lat: 24.444937,   lng: 90.776575 },
    { name: 'Madaripur',    bnName: 'মাদারীপুর',  lat: 23.164102,   lng: 90.1896805 },
    { name: 'Manikganj',    bnName: 'মানিকগঞ্জ',  lat: 23.8602262,  lng: 90.0018293 },
    { name: 'Munshiganj',   bnName: 'মুন্সীগঞ্জ',  lat: 23.5435742,  lng: 90.5354327 },
    { name: 'Narayanganj',  bnName: 'নারায়ণগঞ্জ', lat: 23.63366,    lng: 90.496482 },
    { name: 'Narsingdi',    bnName: 'নরসিংদী',    lat: 23.932233,   lng: 90.71541 },
    { name: 'Rajbari',      bnName: 'রাজবাড়ী',    lat: 23.7574305,  lng: 89.6444665 },
    { name: 'Shariatpur',   bnName: 'শরীয়তপুর',   lat: 23.2060195,  lng: 90.3477725 },
    { name: 'Tangail',      bnName: 'টাঙ্গাইল',   lat: 24.264145,   lng: 89.918029 },
  ],
  Khulna: [
    { name: 'Khulna',       bnName: 'খুলনা',      lat: 22.815774,   lng: 89.568679 },
    { name: 'Bagerhat',     bnName: 'বাগেরহাট',   lat: 22.651568,   lng: 89.785938 },
    { name: 'Chuadanga',    bnName: 'চুয়াডাঙ্গা', lat: 23.6401961,  lng: 88.841841 },
    { name: 'Jashore',      bnName: 'যশোর',       lat: 23.16643,    lng: 89.2081126 },
    { name: 'Jhenaidah',    bnName: 'ঝিনাইদহ',    lat: 23.5448176,  lng: 89.1539213 },
    { name: 'Kushtia',      bnName: 'কুষ্টিয়া',   lat: 23.901258,   lng: 89.120482 },
    { name: 'Magura',       bnName: 'মাগুরা',     lat: 23.487337,   lng: 89.419956 },
    { name: 'Meherpur',     bnName: 'মেহেরপুর',   lat: 23.762213,   lng: 88.631821 },
    { name: 'Narail',       bnName: 'নড়াইল',      lat: 23.172534,   lng: 89.512672 },
    { name: 'Satkhira',     bnName: 'সাতক্ষীরা',  lat: 22.7180905,  lng: 89.0687033 },
  ],
  Mymensingh: [
    { name: 'Mymensingh',   bnName: 'ময়মনসিংহ',  lat: 24.746567,   lng: 90.4072093 },
    { name: 'Jamalpur',     bnName: 'জামালপুর',   lat: 24.937533,   lng: 89.937775 },
    { name: 'Netrokona',    bnName: 'নেত্রকোণা',  lat: 24.870955,   lng: 90.727887 },
    { name: 'Sherpur',      bnName: 'শেরপুর',     lat: 25.0204933,  lng: 90.0152966 },
  ],
  Rajshahi: [
    { name: 'Rajshahi',     bnName: 'রাজশাহী',      lat: 24.37230298, lng: 88.56307623 },
    { name: 'Bogura',       bnName: 'বগুড়া',        lat: 24.8465228,  lng: 89.377755 },
    { name: 'Chapainawabganj', bnName: 'চাঁপাইনবাবগঞ্জ', lat: 24.5965034, lng: 88.2775122 },
    { name: 'Joypurhat',    bnName: 'জয়পুরহাট',     lat: 25.09636876, lng: 89.0400428 },
    { name: 'Naogaon',      bnName: 'নওগাঁ',         lat: 24.83256191, lng: 88.92485205 },
    { name: 'Natore',       bnName: 'নাটোর',         lat: 24.420556,   lng: 89.000282 },
    { name: 'Pabna',        bnName: 'পাবনা',         lat: 23.998524,   lng: 89.233645 },
    { name: 'Sirajganj',    bnName: 'সিরাজগঞ্জ',     lat: 24.4533978,  lng: 89.7006815 },
  ],
  Rangpur: [
    { name: 'Rangpur',      bnName: 'রংপুর',       lat: 25.7558096,  lng: 89.244462 },
    { name: 'Dinajpur',     bnName: 'দিনাজপুর',    lat: 25.6217061,  lng: 88.6354504 },
    { name: 'Gaibandha',    bnName: 'গাইবান্ধা',    lat: 25.328751,   lng: 89.528088 },
    { name: 'Kurigram',     bnName: 'কুড়িগ্রাম',   lat: 25.805445,   lng: 89.636174 },
    { name: 'Lalmonirhat',  bnName: 'লালমনিরহাট',  lat: 25.9165451,  lng: 89.4532409 },
    { name: 'Nilphamari',   bnName: 'নীলফামারী',   lat: 25.931794,   lng: 88.856006 },
    { name: 'Panchagarh',   bnName: 'পঞ্চগড়',      lat: 26.3411,     lng: 88.5541606 },
    { name: 'Thakurgaon',   bnName: 'ঠাকুরগাঁও',   lat: 26.0336945,  lng: 88.4616834 },
  ],
  Sylhet: [
    { name: 'Sylhet',       bnName: 'সিলেট',       lat: 24.8897956,  lng: 91.8697894 },
    { name: 'Habiganj',     bnName: 'হবিগঞ্জ',     lat: 24.374945,   lng: 91.41553 },
    { name: 'Moulvibazar',  bnName: 'মৌলভীবাজার',  lat: 24.482934,   lng: 91.777417 },
    { name: 'Sunamganj',    bnName: 'সুনামগঞ্জ',   lat: 25.0658042,  lng: 91.3950115 },
  ],
};
