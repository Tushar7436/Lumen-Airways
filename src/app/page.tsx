import HeroSection from "@/(components)/HeroSection";
import { Suspense } from "react";
import Extra from "@/(components)/Extra";
import FAQ from "@/(components)/FAQ";
import Recommendations from "@/(components)/Recommendations";
import ErrorBoundary from "@/(components)/ErrorBoundary";

// Loading component for better UX
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Flight Data</h2>
        <p className="text-gray-600">Please wait while we fetch the latest flight information...</p>
      </div>
    </div>
  );
}


export default function HomePage() {
  return (
    <>
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary>
        <HeroSection />
        <Recommendations />
        <FAQ />
        <Extra />
      </ErrorBoundary>
    </Suspense>
    </>
  );
}
