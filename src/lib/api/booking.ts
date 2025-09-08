import api from "@/lib/axios";

export interface CreateBookingDto {
  userId: number;
  flightId: number;
  noOfSeats: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    userId: number;
    flightId: number;
    noOfSeats: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    createdAt: string;
    totalAmount: number;
  };
}

export const bookingService = {
  createBooking: async (bookingData: CreateBookingDto): Promise<BookingResponse> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
};
