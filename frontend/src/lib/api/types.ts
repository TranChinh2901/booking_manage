export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedItems<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type Destination = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type TourImage = {
  url: string;
  isThumbnail?: boolean;
  sortOrder?: number;
};

export type Tour = {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  destinationId: number;
  destination?: Destination;
  categoryId: number;
  category?: Category;
  priceAdult: number;
  priceChild: number;
  durationDays: number;
  durationNights: number;
  departureLocation?: string;
  transport?: string;
  maxPeople: number;
  status: string;
  images: TourImage[];
  createdAt: string;
  updatedAt: string;
};

export type TourListQuery = {
  keyword?: string;
  destinationId?: number;
  categoryId?: number;
  page?: number;
  limit?: number;
};

export type TourSchedule = {
  id: number;
  tourId: number;
  tour?: Tour;
  startDate: string;
  endDate: string;
  availableSeats: number;
  bookedSeats: number;
  remainingSeats: number;
  priceAdult: number;
  priceChild: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingPayload = {
  tourScheduleId: number;
  adultCount: number;
  childCount?: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note?: string;
};

export type Booking = {
  id: number;
  bookingCode: string;
  userId: number;
  user?: User;
  tourScheduleId: number;
  tourSchedule?: TourSchedule;
  adultCount: number;
  childCount: number;
  totalAmount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note?: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: number;
  userId: number;
  user?: User;
  tourId: number;
  tour?: Tour;
  rating: number;
  comment?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactRequest = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  totalUsers: number;
  totalTours: number;
  activeTours: number;
  totalSchedules: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalRevenue: number;
};

export type RevenueByMonth = {
  month: number;
  revenue: number;
  bookingCount: number;
};

export type TopTour = {
  tourId: number;
  title: string;
  slug: string;
  totalGuests: number;
  bookingCount: number;
};
