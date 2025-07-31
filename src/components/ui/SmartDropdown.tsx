import React from 'react';
import { MoreDotIcon } from '@/icons';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { useSmartDropdown } from '@/hooks/useSmartDropdown';
import { DropdownAction } from './smart-dropdown/types';

interface SmartDropdownProps {
  id: string;
  actions: DropdownAction[];
  buttonClassName?: string;
  dropdownClassName?: string;
  iconClassName?: string;
}

export const SmartDropdown: React.FC<SmartDropdownProps> = ({
  id,
  actions,
  buttonClassName = "dropdown-toggle p-1 rounded hover:bg-gray-50",
  dropdownClassName = "w-40 bg-white shadow-md border rounded-sm",
  iconClassName = "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
}) => {
  const { openDropdown, dropdownPosition, toggleDropdown, closeDropdown } = useSmartDropdown();

  const handleActionClick = (action: DropdownAction) => {
    if (!action.disabled) {
      action.onClick();
      closeDropdown();
    }
  };

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
          className={`absolute right-9 ${
            dropdownPosition === 'top' 
              ? 'bottom-full mb-1' 
              : 'top-[-4px] mt-1'
          } z-[999] ${dropdownClassName}`}
        >
          {actions.map((action, index) => (
            <DropdownItem
              key={index}
              onItemClick={() => handleActionClick(action)}
              className={`flex w-full font-normal px-4 text-[12px] ${
                index < actions.length - 1 ? 'border-b border-[#E9E9E9]' : ''
              } text-[#414141] ${action.className || ''}`}
              disabled={action.disabled}
            >
              {action.label}
            </DropdownItem>
          ))}
        </div>
      )}
    </div>
  );
};