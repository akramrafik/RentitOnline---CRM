'use client'
import React from "react";
import Card from "@/components/ui/Card";
import ReactSelect from "@/components/partials/froms/ReactSelect";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";

const creatInsight = () => {
    return(
<div>
      <Card title="Add Record">
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        <ReactSelect 
          placeholder={'Choose Emirates'}
          
        />
        <ReactSelect 
          placeholder={'Select Location'}
        />
        <ReactSelect 
          placeholder={'Select Category'}
        />
        <ReactSelect 
          placeholder={'Source of Data'}
        />
        <ReactSelect 
          placeholder={'Type'}
        />
        <Textinput
          placeholder="Enter Ad Count"
        />
        <Textinput
          placeholder="Enter Vendor Count"
        />
        <div className="lg:col-span-2 col-span-1">
          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark  text-center">Submit</button>
          </div>
        </div>
        </div>
      </Card>
    </div>
    );

};
export default creatInsight;