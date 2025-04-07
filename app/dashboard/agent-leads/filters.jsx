import React, { useState } from "react";
import Card from "@/components/ui/Card";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Flatpickr from "react-flatpickr";
//import { options } from "@fullcalendar/core/preact";


const Filters = () => {
  return (
    <div className="space-y-5">
      <Card>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <label htmlFor="hh" className="form-label">
              Choose Leads
            </label>
            <ReactSelect />
          </div>
          <div>
            <label htmlFor="hh" className="form-label">
              Categories
            </label>
            <ReactSelect className="react-select" />
          </div>
          <div>
            <label htmlFor="hh" className="form-label">
              Emirates
            </label>
            <ReactSelect className="react-select" />
          </div>
          <div>
            <label htmlFor="hh" className="form-label">
              Choose Location
            </label>
            <ReactSelect className="react-select" />
          </div>
          <div>
            <label htmlFor="hh" className="form-label">
              Choose Agent
            </label>
            <ReactSelect className="react-select" />
          </div>
          <div>
            <label htmlFor="hh" className="form-label">
              Start Date
            </label>
             <Flatpickr className="form-control py-2"/>
          </div>
          <div>
            <label htmlFor="hh" className="form-label">
              End Date
            </label>
            <Flatpickr className="form-control py-2"/>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Filters;
