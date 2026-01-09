import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './CourierDropdown.css';

const CourierDropdown = ({ options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="courier-dropdown" ref={dropdownRef}>
            <div className="dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
                {selected ? (
                    <>
                        <img src={selected.logo} alt={selected.name} className="selected-logo" />
                        <span>{selected.name}</span>
                    </>
                ) : (
                    <span className="placeholder">Select a courier...</span>
                )}
                <ChevronDown size={20} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
            </div>

            {isOpen && (
                <div className="dropdown-options">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search couriers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ul className="options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li key={option.code} onClick={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}>
                                    <img src={option.logo} alt={option.name} className="option-logo" />
                                    <span>{option.name}</span>
                                </li>
                            ))
                        ) : (
                            <li className="no-results">No couriers found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CourierDropdown;