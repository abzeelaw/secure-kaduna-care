export interface DoctorProfile {
  id: string;
  full_name: string;
  specialty: string;
  years_experience: number;
  rating: number;
  location: string;
  hospital: { id: string; name: string; address: string };
  consultation_fee: string;
  bio: string;
  availability: string;
  weekly_schedule: string[];
  phone: string;
}

export interface HospitalProfile {
  id: string;
  name: string;
  type: string;
  rating: number;
  address: string;
  lga: string;
  has_emergency: boolean;
  phone: string;
}

export interface PharmacyProfile {
  id: string;
  name: string;
  area: string;
  price: string;
  distance: string;
  stock: boolean;
  phone: string;
}

export interface EducationArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  badge: string;
}

export const DEFAULT_DOCTORS: DoctorProfile[] = [
  {
    id: "dr-aminu",
    full_name: "Dr. Aminu Yusuf",
    specialty: "Cardiology",
    years_experience: 14,
    rating: 4.9,
    location: "Kaduna South",
    hospital: { id: "h-1", name: "Barau Dikko Teaching Hospital", address: "Kaduna South, Kaduna" },
    consultation_fee: "₦8,500",
    bio: "Dr. Aminu Yusuf is a senior cardiologist with 14 years of experience in heart care, hypertension and emergency cardiac support.",
    availability: "Mon - Fri • 9:00 AM - 4:00 PM",
    weekly_schedule: ["Monday 9:00 - 16:00", "Tuesday 9:00 - 16:00", "Wednesday 9:00 - 16:00", "Thursday 9:00 - 16:00", "Friday 9:00 - 16:00"],
    phone: "+234 803 222 1188",
  },
  {
    id: "dr-sani",
    full_name: "Dr. Sani Bello",
    specialty: "Pediatrics",
    years_experience: 11,
    rating: 4.8,
    location: "Kaduna North",
    hospital: { id: "h-2", name: "Yusuf Dantsoho Memorial Hospital", address: "Kaduna North, Kaduna" },
    consultation_fee: "₦6,500",
    bio: "A trusted pediatric specialist supporting children and mothers with family-focused care and immunization guidance.",
    availability: "Mon - Sat • 10:00 AM - 3:00 PM",
    weekly_schedule: ["Monday 10:00 - 15:00", "Tuesday 10:00 - 15:00", "Wednesday 10:00 - 15:00", "Thursday 10:00 - 15:00", "Friday 10:00 - 15:00", "Saturday 10:00 - 15:00"],
    phone: "+234 810 404 2200",
  },
  {
    id: "dr-ifeoma",
    full_name: "Dr. Ifeoma Okafor",
    specialty: "Obstetrics",
    years_experience: 13,
    rating: 4.9,
    location: "Zaria",
    hospital: { id: "h-3", name: "St. Gerald Catholic Hospital", address: "Kawo, Kaduna" },
    consultation_fee: "₦7,200",
    bio: "Experienced obstetrician providing prenatal care, delivery support and postnatal wellness services.",
    availability: "Tue - Fri • 8:00 AM - 2:00 PM",
    weekly_schedule: ["Tuesday 8:00 - 14:00", "Wednesday 8:00 - 14:00", "Thursday 8:00 - 14:00", "Friday 8:00 - 14:00"],
    phone: "+234 814 445 9001",
  },
  {
    id: "dr-kadiri",
    full_name: "Dr. Halima Kadiri",
    specialty: "Psychiatry",
    years_experience: 10,
    rating: 4.7,
    location: "Kafanchan",
    hospital: { id: "h-4", name: "Gwamna Awan General Hospital", address: "Jema'a, Kaduna" },
    consultation_fee: "₦6,800",
    bio: "Psychiatrist focused on mental wellness, stress management, and supporting families in Kaduna State.",
    availability: "Mon - Thu • 2:00 PM - 6:00 PM",
    weekly_schedule: ["Monday 14:00 - 18:00", "Tuesday 14:00 - 18:00", "Wednesday 14:00 - 18:00", "Thursday 14:00 - 18:00"],
    phone: "+234 815 333 4490",
  },
  {
    id: "dr-zubair",
    full_name: "Dr. Zubair Musa",
    specialty: "Dermatology",
    years_experience: 9,
    rating: 4.8,
    location: "Kaduna South",
    hospital: { id: "h-5", name: "Limi Hospital", address: "Kaduna South, Kaduna" },
    consultation_fee: "₦5,900",
    bio: "Skin health expert helping patients manage conditions like eczema, acne and wound care.",
    availability: "Wed - Sat • 10:00 AM - 1:00 PM",
    weekly_schedule: ["Wednesday 10:00 - 13:00", "Thursday 10:00 - 13:00", "Friday 10:00 - 13:00", "Saturday 10:00 - 13:00"],
    phone: "+234 909 001 8891",
  },
  {
    id: "dr-maryam",
    full_name: "Dr. Maryam Abdullahi",
    specialty: "Orthopedics",
    years_experience: 12,
    rating: 4.9,
    location: "Birnin Gwari",
    hospital: { id: "h-6", name: "Aminu Kano Specialist Hospital", address: "Birnin Gwari, Kaduna" },
    consultation_fee: "₦7,100",
    bio: "Orthopedic surgeon providing fracture care, joint health advice and rehabilitation referrals.",
    availability: "Mon - Wed • 3:00 PM - 7:00 PM",
    weekly_schedule: ["Monday 15:00 - 19:00", "Tuesday 15:00 - 19:00", "Wednesday 15:00 - 19:00"],
    phone: "+234 802 555 7712",
  },
];

export const DEFAULT_HOSPITALS: HospitalProfile[] = [
  {
    id: "h-1",
    name: "Barau Dikko Teaching Hospital",
    type: "Teaching",
    rating: 4.9,
    address: "Kaduna South, Kaduna",
    lga: "Kaduna South",
    has_emergency: true,
    phone: "+234 703 123 4567",
  },
  {
    id: "h-2",
    name: "Yusuf Dantsoho Memorial Hospital",
    type: "Government",
    rating: 4.8,
    address: "Kaduna North, Kaduna",
    lga: "Kaduna North",
    has_emergency: true,
    phone: "+234 703 456 7890",
  },
  {
    id: "h-3",
    name: "St. Gerald Catholic Hospital",
    type: "Private",
    rating: 4.7,
    address: "Kawo, Kaduna",
    lga: "Kaduna North",
    has_emergency: true,
    phone: "+234 704 555 1212",
  },
  {
    id: "h-4",
    name: "Gwamna Awan General Hospital",
    type: "Government",
    rating: 4.6,
    address: "Kafanchan, Kaduna",
    lga: "Jema'a",
    has_emergency: true,
    phone: "+234 706 222 3344",
  },
  {
    id: "h-5",
    name: "Limi Hospital",
    type: "Private",
    rating: 4.5,
    address: "Zaria, Kaduna",
    lga: "Zaria",
    has_emergency: false,
    phone: "+234 809 111 8888",
  },
  {
    id: "h-6",
    name: "Aminu Kano Specialist Hospital",
    type: "Teaching",
    rating: 4.8,
    address: "Birnin Gwari, Kaduna",
    lga: "Birnin Gwari",
    has_emergency: true,
    phone: "+234 802 444 9000",
  },
];

export const DEFAULT_PHARMACIES: PharmacyProfile[] = [
  {
    id: "p-1",
    name: "HealthPlus Pharmacy",
    area: "Kaduna South",
    price: "₦500",
    distance: "300m away",
    stock: true,
    phone: "+234 808 294 7211",
  },
  {
    id: "p-2",
    name: "MediCare Pharmacy",
    area: "Kaduna North",
    price: "₦650",
    distance: "1.2km away",
    stock: true,
    phone: "+234 813 102 4432",
  },
  {
    id: "p-3",
    name: "CityCare Pharmacy",
    area: "Kawo",
    price: "₦480",
    distance: "2.1km away",
    stock: false,
    phone: "+234 816 404 5510",
  },
  {
    id: "p-4",
    name: "CareBridge Pharmacy",
    area: "Zaria",
    price: "₦560",
    distance: "4.0km away",
    stock: true,
    phone: "+234 811 770 6700",
  },
  {
    id: "p-5",
    name: "PrimeMed Pharmacy",
    area: "Kafanchan",
    price: "₦610",
    distance: "900m away",
    stock: true,
    phone: "+234 806 551 9900",
  },
];

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: "edu-1",
    title: "Preventing Malaria in Kaduna Homes",
    summary: "Practical steps to reduce mosquito exposure for families and children.",
    category: "Preventive Care",
    badge: "Recommended",
    content: "Use screened windows, sleep under treated nets, clear stagnant water around homes, and seek care early if you develop fever. Regular clinic visits and quick testing can reduce complications for children and pregnant mothers.",
  },
  {
    id: "edu-2",
    title: "Managing Hypertension Without Stress",
    summary: "Simple daily habits that help control high blood pressure and keep you strong.",
    category: "Heart Health",
    badge: "New",
    content: "Limit salty foods, stay active, take medication as prescribed, and keep follow-up appointments. Track your readings at home and contact a clinician if you notice severe headaches, chest pain or sudden weakness.",
  },
  {
    id: "edu-3",
    title: "Child Nutrition for Healthy Growth",
    summary: "Balanced meals and safe feeding habits for toddlers and school-age children.",
    category: "Child Health",
    badge: "Popular",
    content: "Offer a mix of protein, vegetables, fruits, and whole grains. Breastfeeding, handwashing and safe water are still the most important habits for healthy development and fewer infections.",
  },
  {
    id: "edu-4",
    title: "Diabetes Awareness and Early Action",
    summary: "Know the warning signs and what to do before complications develop.",
    category: "Diabetes",
    badge: "Must Read",
    content: "Watch for frequent urination, unusual thirst, blurry vision and slow wound healing. Early screening and consistent treatment help prevent kidney and eye disease.",
  },
];
