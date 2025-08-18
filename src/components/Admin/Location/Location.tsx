"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Filter, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import LiveLocationMap from "./LiveLocationMap";

const Location = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPosition, setSearchedPosition] = useState<
    [number, number] | null
  >(null);

  // 1. Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSearchedPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // You could set a default fallback position here if you want
        }
      );
    }
  }, []);

  // 2. Search handler
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setSearchedPosition([lat, lon]);
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // 3. Handle enter key in search input
  const onSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Add filtering logic here based on your needs
  };

  return (
    <section>
      <div>
        {/* header title */}
        <div className=" rounded-2xl p-6 flex justify-between items-center mb-4">
          <h1 className="lg:text-3xl font-semibold">Flagged Locations</h1>
          <div>
            <Filter className="h-10 w-10 text-gray-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl">
          <div className="w-full space-y-4">
            {/* Header with filters */}
            <div className="flex items-center justify-between l">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Flagged Locations
                </h1>
              </div>
              <div className="flex lg:flex-row flex-col  items-center gap-4">
                {/* Search Input */}
                <div className="relative flex min-w-0">
                  <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onSearchInputKeyDown}
                    className="pr-10 py-2 flex-grow bg-white border border-gray-200 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300 truncate"
                  />
                  <Search
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <Filter className="h-4 w-4" />
                    Filter
                  </SelectTrigger>
                  <SelectContent className="z-40">
                    <SelectItem value="all">All Category</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="cases">Cases</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                  </SelectContent>
                </Select>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 py-2 text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  Refresh
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="bg-white p-6 rounded-2xl">
                <div className="w-full space-y-4">
                  <div className="relative w-full h-[600px] mt-4 overflow-hidden rounded-lg">
                    <LiveLocationMap searchedPosition={searchedPosition} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
