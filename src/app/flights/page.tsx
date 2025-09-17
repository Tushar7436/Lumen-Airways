'use client';

import { Suspense } from "react";
import FlightSearchForm from "@/(components)/flight-search-form";
import { FiltersSidebar } from "@/(components)/filters-sidebar";
import { ResultsList } from "@/(components)/results-list";
import { useFlights } from "@/hooks/useFlights";

function FlightsPageContent() {
  const { flights, loading, error, filters, setFilters } = useFlights();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <FlightSearchForm />
      </div>

      <div className="flex gap-8">
        <aside className="w-1/4">
          <FiltersSidebar filters={filters} onFiltersChange={setFilters} />
        </aside>

        <main className="flex-1">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ResultsList flights={flights} isLoading={loading} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div>Loading flights...</div>}>
      <FlightsPageContent />
    </Suspense>
  );
}
