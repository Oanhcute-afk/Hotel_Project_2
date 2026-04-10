import { useState } from "react";
import { SlidersHorizontal, Star, Search as SearchIcon } from "lucide-react";
import { AMENITIES, PROPERTY_TYPES } from "../data";

export function FilterSidebar({ initialQuery = "", onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [stars, setStars] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  // Derived update function
  const notifyChange = (newFilters) => {
    onFilterChange({
      searchTerm,
      priceRange,
      stars,
      amenities,
      propertyTypes,
      ...newFilters,
    });
  };

  const toggleStar = (star) => {
    const newStars = stars.includes(star)
      ? stars.filter((s) => s !== star)
      : [...stars, star];
    setStars(newStars);
    notifyChange({ stars: newStars });
  };

  const toggleAmenity = (amenity) => {
    const newAmenities = amenities.includes(amenity)
      ? amenities.filter((a) => a !== amenity)
      : [...amenities, amenity];
    setAmenities(newAmenities);
    notifyChange({ amenities: newAmenities });
  };

  const togglePropertyType = (type) => {
    const newTypes = propertyTypes.includes(type)
      ? propertyTypes.filter((t) => t !== type)
      : [...propertyTypes, type];
    setPropertyTypes(newTypes);
    notifyChange({ propertyTypes: newTypes });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
    notifyChange({ priceRange: [0, value] });
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    notifyChange({ searchTerm: e.target.value });
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-6 sticky top-24 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <SlidersHorizontal className="w-5 h-5 text-sky-500" />
        <h2 className="font-bold text-lg">Bộ lọc tìm kiếm</h2>
      </div>

      {/* Name/Location Search */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-800 mb-3">
          Tên khách sạn / Địa điểm
        </h3>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full pl-9 pr-4 py-2 bg-[#FDFAF6] border border-sky-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8 border-t border-slate-100 pt-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex justify-between">
          Khoảng giá
          <span className="text-sky-600 text-sm font-bold">
            Dưới {priceRange[1].toLocaleString("vi-VN")} ₫
          </span>
        </h3>

        <input
          type="range"
          min="500000"
          max="10000000"
          step="500000"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />

        <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
          <span>500K</span>
          <span>10M+</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-8 border-t border-slate-100 pt-6">
        <h3 className="font-semibold text-slate-800 mb-3">Hạng sao</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2].map((star) => (
            <label
              key={star}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={stars.includes(star)}
                onChange={() => toggleStar(star)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 border-sky-200"
              />

              <span className="flex items-center gap-1 text-sm text-slate-600 group-hover:text-slate-800">
                {[...Array(star)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-8 border-t border-slate-100 pt-6">
        <h3 className="font-semibold text-slate-800 mb-3">Loại chỗ nghỉ</h3>
        <div className="space-y-3">
          {PROPERTY_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={propertyTypes.includes(type)}
                onChange={() => togglePropertyType(type)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 border-sky-200"
              />

              <span className="text-sm text-slate-600 group-hover:text-slate-800">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="font-semibold text-slate-800 mb-3">Tiện nghi</h3>

        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 border-sky-200"
              />

              <span className="text-sm text-slate-600 group-hover:text-slate-800">
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}