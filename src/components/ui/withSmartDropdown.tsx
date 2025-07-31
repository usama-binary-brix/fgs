import React from 'react';
import { MoreDotIcon } from '@/icons';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { useSmartDropdown } from '@/hooks/useSmartDropdown';
import { DropdownAction } from './smart-dropdown/types';

interface WithSmartDropdownProps {
  id: string;
  actions: DropdownAction[];
  children: React.ReactNode;
  buttonClassName?: string;
  dropdownClassName?: string;
  iconClassName?: string;
  dropdownPosition?: 'right-9' | 'right-0' | string;
}

export const WithSmartDropdown: React.FC<WithSmartDropdownProps> = ({
  id,
  actions,
  children,
  buttonClassName = "dropdown-toggle p-1 rounded hover:bg-gray-50",
  dropdownClassName = "w-40 bg-white shadow-md border rounded-sm",
  iconClassName = "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
  dropdownPosition = "right-9"
}) => {
  const { openDropdown, dropdownPosition: position, toggleDropdown, closeDropdown } = useSmartDropdown();

  const handleActionClick = (action: DropdownAction) => {
    if (!action.disabled) {
      action.onClick();
      closeDropdown();
    }
  };

  // Filter actions based on conditions
  const visibleActions = actions.filter(action => action.condition !== false);

  return (
    <div className="relative inline-block">
      <button
        onClick={(event) => toggleDropdown(id, event)}
        className={`${buttonClassName} ${openDropdown === id ? 'bg-gray-100' : ''}`}
      >
        <MoreDotIcon className={iconClassName} />
      </button>

      {openDropdown === id && (
        <div 
          className={`absolute ${dropdownPosition} ${
            position === 'top' 
              ? 'bottom-full mb-1' 
              : 'top-[-4px] mt-1'
          } z-[999] ${dropdownClassName}`}
        >
          {visibleActions.map((action, index) => (
            <DropdownItem
              key={index}
              onItemClick={() => handleActionClick(action)}
              className={`flex w-full font-normal px-4 text-[12px] ${
                index < visibleActions.length - 1 ? 'border-b border-[#E9E9E9]' : ''
              } text-[#414141] ${action.className || ''}`}
              disabled={action.disabled}
            >
              {action.label}
            </DropdownItem>
          ))}
        </div>
      )}
      {children}
    </div>
  );
};