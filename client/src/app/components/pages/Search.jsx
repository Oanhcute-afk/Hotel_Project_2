import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { FilterSidebar } from "../ui/FilterSidebar";
import { HotelCard } from "../ui/HotelCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [HOTELS, setHotels] = useState([]);

  useEffect(() => {
    fetch('/api/hotels')
      .then(res => res.json())
      .then(setHotels)
      .catch(console.error);
  }, []);

  const [filters, setFilters] = useState({
    searchTerm: initialQuery,
    priceRange: [0, 10000000],
    stars: [],
    amenities: [],
    propertyTypes: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredHotels = useMemo(() => {
    return HOTELS.filter((hotel) => {
      // Search
      const searchMatch = filters.searchTerm
        ? hotel.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          hotel.location.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;
      if (!searchMatch) return false;

      // Price
      const priceMatch =
        hotel.price >= filters.priceRange[0] &&
        hotel.price <= filters.priceRange[1];
      if (!priceMatch) return false;

      // Stars
      const starsMatch =
        filters.stars.length > 0
          ? filters.stars.includes(hotel.stars)
          : true;
      if (!starsMatch) return false;

      // Property Type
      const propertyTypeMatch =
        filters.propertyTypes.length > 0
          ? filters.propertyTypes.includes(hotel.propertyType)
          : true;
      if (!propertyTypeMatch) return false;

      // Amenities
      const amenitiesMatch =
        filters.amenities.length > 0
          ? filters.amenities.every((amenity) =>
              hotel.amenities.includes(amenity)
            )
          : true;
      if (!amenitiesMatch) return false;

      return true;
    });
  }, [filters, HOTELS]);

  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);

  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHotels.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHotels, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-[#FDFAF6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Tìm kiếm khách sạn ven biển
          </h1>
          <p className="text-slate-500 font-medium">
            Tìm thấy{" "}
            <span className="text-sky-600 font-bold">
              {filteredHotels.length}
            </span>{" "}
            chỗ nghỉ phù hợp với tiêu chí của bạn
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <FilterSidebar
              initialQuery={initialQuery}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Results */}
          <div className="w-full lg:w-3/4 flex-grow space-y-6">
            {paginatedHotels.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🏖️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Chúng tôi không tìm thấy chỗ nghỉ nào khớp với bộ lọc của bạn.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {paginatedHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-8">
                    <Pagination>
                      <PaginationContent>

                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1)
                                setCurrentPage(currentPage - 1);
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;

                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 &&
                              page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === page}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                setCurrentPage(currentPage + 1);
                            }}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}