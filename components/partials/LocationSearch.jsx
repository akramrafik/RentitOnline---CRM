import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { locationSearch } from "@/lib/api";
import Spinner from "../Loading";

const LocationAutoCompleteSelect = ({ emirateId, selectedLocation, setSelectedLocation }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef(null);

  // Debounced fetch function
  const fetchSuggestions = useCallback(
    debounce(async (keyword, emirateId) => {
      if (!keyword) {
        setSuggestions([]);
        return;
      }
      try {
        setLoading(true);
        const res = await locationSearch({ keyword, emirate_id: emirateId });
        setSuggestions(res.data || []);
      } catch (error) {
        console.error("Failed to fetch locations", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Fetch suggestions on input change
  useEffect(() => {
    if (inputValue.trim() && isOpen) {
      fetchSuggestions(inputValue, emirateId);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, emirateId, fetchSuggestions, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedLocation(null);
    setIsOpen(true);
    setHighlightIndex(-1);
  };

  const handleSelect = (location) => {
    setSelectedLocation(location);
    setInputValue(location.name);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSelect(suggestions[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", maxWidth: "400px" }}
      tabIndex={0} // make div focusable for better keyboard handling
    >
      <input
        type="text"
        placeholder="Search location..."
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="location-listbox"
        aria-activedescendant={
          highlightIndex >= 0 && suggestions[highlightIndex] ? `location-item-${suggestions[highlightIndex].id}` : undefined
        }
        style={{
          width: "100%",
          padding: "5px 50px 5px 5px", 
          border: "1px solid #cbd5e1",
          borderRadius: "4px",
          boxSizing: "border-box",
          fontSize: "14px",
          height: "38px"

        }}
      />

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "13px",
            transform: "translateY(-50%)",
            fontSize: "12px",
            color: "#666",
            userSelect: "none",
          }}
        >
          <Spinner/>
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          id="location-listbox"
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {suggestions.map((location, index) => (
            <li
              id={`location-item-${location.id}`}
              key={location.id}
              role="option"
              aria-selected={highlightIndex === index}
              onClick={() => handleSelect(location)}
              onMouseEnter={() => setHighlightIndex(index)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: highlightIndex === index ? "#bde4ff" : "white",
                borderBottom: "1px solid #eee",
              }}
            >
              {location.name}
            </li>
          ))}
        </ul>
      )}

      {/* {selectedLocation && (
        <div style={{ marginTop: "8px", fontSize: "14px", color: "green" }}>
          Selected: {selectedLocation.city} (ID: {selectedLocation.value})
        </div>
      )} */}
    </div>
  );
};

export default LocationAutoCompleteSelect;
