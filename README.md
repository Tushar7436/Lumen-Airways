# ✈️ Lumen Airways (Frontend)

This repository contains the frontend client for a comprehensive, microservices-based flight booking platform. It provides a modern, responsive, and user-friendly interface for searching flights, managing bookings, and handling user authentication.

This application is built with **Next.js**, **Tailwind CSS**, and **TypeScript**.

## ✨ Features

  * **Flight Search:** Search for available flights by origin, destination, and date.
  * **Booking Management:** Securely book flights and view booking history.
  * **User Authentication:** Sign up, sign in, and manage user profiles.
  * **Responsive Design:** Fully functional and visually appealing on both desktop and mobile devices.
  * **Real-time Updates:** Receive real-time notifications after booking.
  * **Added Razor pay:** Provides a real life interaction by integrating a test payment system.

-----

## 🏛️ System Architecture

This frontend application is the primary client in a distributed microservice architecture. It does **not** connect directly to individual services. Instead, it communicates with a central **API Gateway**, which routes requests to the appropriate backend microservice.

[Image of a microservice architecture diagram]

This decoupled approach ensures scalability, resilience, and maintainability. The complete system is composed of the following repositories:

  * **Frontend (This Repo):** The Next.js client application.
  * **[API Gateway](https://github.com/Tushar7436/API-Gateway):** The single entry point for all client requests. It handles routing, authentication, and rate limiting.
  * **[Flight Service](https://github.com/Tushar7436/Flight-Service):** Manages all flight-related data, including schedules, availability, and pricing.
  * **[Booking Service](https://github.com/Tushar7436/Flight-Booking-Service):** Handles the entire booking lifecycle, from creation to payment and confirmation.
  * **[Notification Service](https://github.com/Tushar7436/Airline-Notification-Service):** Manages sending email or push notifications for events like booking confirmation, delays, etc.

-----

## 💻 Tech Stack

  * **Framework:** [Next.js](https://nextjs.org/)
  * **Language:** [TypeScript](https://www.typescriptlang.org/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)

-----

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

  * Node.js (v18.x or later)
  * npm, yarn, or pnpm
  * **Running Backend Services:** You must have the [API Gateway](https://github.com/Tushar7436/API-Gateway) and other backend microservices running locally.

### Installation

1.  **Clone this repository:**

    ```bash
    git clone https://github.com/Tushar7436/Lumen-Airways
    cd YOUR-FRONTEND-REPO-NAME
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project. You must add the URL of your locally running API Gateway.

    ```env
    # Example:
    NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

-----

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----
