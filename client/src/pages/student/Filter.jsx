import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const categories = [
  { id: "Next JS", label: "Next JS" },
  { id: "Data Science", label: "Data Science" },
  { id: "Frontend Development", label: "Frontend Development" },
  { id: "Fullstack Development", label: "Fullstack Development" },
  { id: "MERN Stack Development", label: "MERN Stack Development" },
  { id: "Backend Development", label: "Backend Development" },
  { id: "Javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "Docker", label: "Docker" },
  { id: "MongoDB", label: "MongoDB" },
  { id: "HTML", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleCategoryChange = (categoryId) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updated);
    handleFilterChange(updated, sortByPrice);
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  };

  const resetFilters = () => {
    setIsResetting(true);
    setSelectedCategories([]);
    handleFilterChange([], sortByPrice);
    setTimeout(() => setIsResetting(false), 500);
  };

  return (
    <div className="w-full md:w-[20%] bg-[#1e293b] text-white p-5 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger className="w-[130px] bg-[#334155] text-white border border-gray-600">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e293b] text-white">
            <SelectGroup>
              <SelectLabel className="text-gray-400">Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4 bg-gray-600" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base text-gray-200">CATEGORY</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 p-0 h-auto flex items-center gap-1 hover:bg-transparent focus:ring-0"
            onClick={resetFilters}
          >
            <RotateCcw
              size={14}
              className={
                isResetting
                  ? "transition-transform animate-[spin-ccw_0.5s_linear]"
                  : ""
              }
            />
          </Button>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm text-gray-300 font-medium"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
