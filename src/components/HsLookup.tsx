import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface HsCode {
  code: string;
  description: string;
}

interface HsLookupProps {
  value: string;
  onChange: (code: string, description: string) => void;
  placeholder?: string;
  className?: string;
}

// Mock HS code database - in production, this would be an API call
const mockHsCodes: HsCode[] = [
  { code: '6109.10', description: 'T-shirts, singlets and other vests, of cotton' },
  { code: '6109.90', description: 'T-shirts, singlets and other vests, of other textile materials' },
  { code: '8517.12', description: 'Smartphones and mobile phones' },
  { code: '8517.18', description: 'Other apparatus for transmission or reception of voice, images or other data' },
  { code: '6403.91', description: 'Footwear with outer soles of rubber, plastics, leather or composition leather' },
  { code: '6403.99', description: 'Other footwear with outer soles of rubber, plastics, leather' },
  { code: '9401.80', description: 'Other seats (office furniture and seating)' },
  { code: '9401.71', description: 'Seats with metal frames, upholstered' },
  { code: '8528.72', description: 'Reception apparatus for television, color, LCD monitors and displays' },
  { code: '8528.73', description: 'Reception apparatus for television, color, OLED displays' },
  { code: '6204.62', description: 'Women\'s or girls\' trousers and shorts, of cotton' },
  { code: '6204.69', description: 'Women\'s or girls\' trousers and shorts, of other textile materials' },
  { code: '8471.30', description: 'Portable automatic data processing machines, laptops' },
  { code: '8471.41', description: 'Data processing machines comprising CPU and input/output units' },
  { code: '9503.00', description: 'Tricycles, scooters, pedal cars and similar wheeled toys; dolls\' carriages' },
  { code: '6110.20', description: 'Jerseys, pullovers, cardigans, waistcoats, of cotton' },
  { code: '6110.30', description: 'Jerseys, pullovers, cardigans, waistcoats, of man-made fibres' },
  { code: '8414.51', description: 'Table, floor, wall, window, ceiling or roof fans' },
  { code: '8414.59', description: 'Other fans' },
  { code: '7013.49', description: 'Glassware of a kind used for table, kitchen, toilet, office' }
];

const HsLookup: React.FC<HsLookupProps> = ({
  value,
  onChange,
  placeholder = "Enter HS code or product name...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<HsCode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function - simulates API call with 300ms delay
  const searchHsCodes = useCallback(async (query: string): Promise<HsCode[]> => {
    if (!query.trim()) return [];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Filter mock data based on code or description match
    const filtered = mockHsCodes.filter(item => 
      item.code.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, 5); // Limit to 5 suggestions
  }, []);

  // Debounced search effect - triggers API call after 300ms of no typing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (inputValue.trim().length > 0) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await searchHsCodes(inputValue);
          setSuggestions(results);
          setIsOpen(results.length > 0);
          setHighlightedIndex(-1);
        } catch (error) {
          console.error('Error fetching HS codes:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, searchHsCodes]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // If user clears the input, also clear the parent component
    if (!newValue.trim()) {
      onChange('', '');
    }
  };

  // Handle suggestion selection
  const handleSelect = (hsCode: HsCode) => {
    setInputValue(hsCode.code);
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    onChange(hsCode.code, hsCode.description);
    inputRef.current?.blur();
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Search for HS codes"
          aria-describedby="hs-lookup-help"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-500 border-t-transparent" />
          ) : (
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {/* Helper Text */}
      <p id="hs-lookup-help" className="sr-only">
        Type to search for HS codes. Use arrow keys to navigate suggestions, Enter to select.
      </p>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-label="HS code suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.code}
              onClick={() => handleSelect(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                index === highlightedIndex ? 'bg-teal-50 text-teal-900' : 'text-gray-900'
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
              }`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {suggestion.code}
                </span>
                <span className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {suggestion.description}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && !isLoading && inputValue.trim() && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No HS codes found for "{inputValue}"
        </div>
      )}
    </div>
  );
};

export default HsLookup;