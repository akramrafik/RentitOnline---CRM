import Button from "../ui/Button";
import { Icon } from "@iconify/react";

const Toolbar = ({ selectedCount = 0, onClear, actions = [] }) => {
  return (
    <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between 
      px-6 py-2 bg-white text-dark shadow-[0px_15px_50px_rgba(0,0,0,0.3)] 
      rounded-md mb-4 min-w-[320px] w-fit max-w-full overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide">
      <div className="flex items-center space-x-3 flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
          {selectedCount}
        </div>
        <span className="font-semibold"> selected</span>
      </div>
       <div className="h-6 w-px bg-gray-300 mx-4 flex-shrink-0"></div>
      <div className="flex items-center space-x-3 overflow-x-auto max-w-full">
        {actions.map((action, idx) => {
          const isDisabled =
            selectedCount > 1 && action.allowMultiple === false;

          // Either disable it or skip rendering entirely
          if (isDisabled) {
            return (
              <Button
                key={idx}
                variant="ghost"
                className="text-dark flex items-center space-x-1 px-2 flex-col opacity-40 cursor-not-allowed"
                disabled
              >
                {action.icon && <Icon icon={action.icon} className="w-4 h-4" />}
                <span className="text-sm">{action.label}</span>
              </Button>
            );
            // Or: return null; // to hide instead
          }

          return (
            <Button
              key={idx}
              variant="ghost"
              className="text-dark flex items-center space-x-1 px-2 flex-col"
              onClick={action.onClick}
            >
              {action.icon && <Icon icon={action.icon} className="w-4 h-4" />}
              <span className="text-sm">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Toolbar;
