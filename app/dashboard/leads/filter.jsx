import React, {useState}  from "react";
import Card from '@/components/ui/Card';
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Flatpickr from "react-flatpickr";

const LeadFilter = () => {
    const [dates, setDates] = useState(new Date());
    console.log('dates', dates);
return(
<div>
<Card>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 last:mb-0">
<div className="col-span-1 md:col-span-2 lg:col-span-2">
          <ReactSelect
          />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <ReactSelect
          />
          </div>
          <div className="col-span-1">
          <Flatpickr
                       value={dates}
                       id="range-picker"
                       className="form-control py-2"
                       onChange={(date) => setDates(date)}
                       options={{
                         mode: "range",
                         defaultDate: ["2020-02-01", "2020-02-15"],
                       }}
                     />
          </div>
          <div className="lg:col-span-2 col-span-1">
          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark  text-center">Clear FIlter</button>
          </div>
        </div>
        
        </div>
</Card>
</div>  
);
};
export default LeadFilter;