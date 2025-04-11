import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface MuiDatePickerProps {
  name: string;
  label?: string;
  onChange?: (value: string | null) => void;
  value?: string | null;
  className?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  size?: "small" | "medium";
  width?: string;
  defaultDate?: string | null;
}

const MuiDatePicker: React.FC<MuiDatePickerProps> = ({
  name,
  label,
  onChange,
  value,
  className,
  minDate = dayjs(),
  maxDate,
  disabled = false,
  size = "small",
  width,
  defaultDate,
}) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        className={`${className} mui-custom-date-picker`}
        value={value ? dayjs(value) : null} 
        onChange={(newValue) => {
          const formattedDate = newValue ? newValue.format("YYYY-MM-DD") : null; 
          onChange?.(formattedDate); 
        }}
        // minDate={minDate}
        // maxDate={maxDate}
        // shouldDisableDate={(date) => minDate && date.isBefore(minDate, "day")}
        disabled={disabled}
        slotProps={{
          textField: {
            size,
            fullWidth: !width,
            sx: {
              width: width ? width : "100%",
              borderColor: '#E8E8E8',
              "& .MuiOutlinedInput-root": {
                height: size === "small" ? 38 : undefined, // Set height for small size
                "& fieldset": {
                  borderColor: '#E8E8E8',
                },
                "& input": {
                  fontSize: "14px",
                  padding: "8px 14px", // Adjust padding if needed
                },
              },
            },
            
            // sx: width ? { width } : undefined,
          } as any,
        }}
      />
    </LocalizationProvider>
  );
};

export default MuiDatePicker;
