"use client";

import Card from "@/components/ui/Card";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";
import SelectMonth from "@/components/partials/SelectMonth";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import BarChart from "@/components/partials/chart/chartjs/Bar";

const CrmPage = () => {
  return (
    <div>
     
      <div className="space-y-5">
        <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-12 space-y-5">
        <Card>
              <div className="grid xl:grid-cols-4 lg:grid-cols-2 col-span-1 gap-3">
                <GroupChart3 />
              </div>
            </Card>
        </div>
          <div className="lg:col-span-8 col-span-12 space-y-5">
          
          <Card title="Overview" headerslot={<SelectMonth />}>
            <BasicArea height={310} />
          </Card>
          </div>
          <div className="lg:col-span-4 col-span-12 space-y-5">
            <div className="lg:col-span-4 col-span-12 space-y-5">
            <Card title="Last 7 Days">
        <BarChart />
      </Card>
              {/* <Card title="Categories" headerslot={<SelectMonth />}>
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                    <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                      <div className="flex justify-between">
                        <span>Car Rental</span>
                        <span>30</span>
                      </div>
                    </li>
                    <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                      <div className="flex justify-between">
                        <span>Property Rental</span>
                        <span>30</span>
                      </div>
                    </li>
                    <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                      <div className="flex justify-between">
                        <span>Room Rental</span>
                        <span>30</span>
                      </div>
                    </li>
                    <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                      <div className="flex justify-between">
                        <span>Hospitality</span>
                        <span>30</span>
                      </div>
                    </li>
                    <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                      <div className="flex justify-between">
                        <span>Event Rental</span>
                        <span>30</span>
                      </div>
                    </li>
                    <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                      <div className="flex justify-between">
                        <span>Sports & Entertainment Rental</span>
                        <span>30</span>
                      </div>
                    </li>
                </ul>
              </Card> */}
            </div>
          </div>
        </div>

        {/* <ExampleTwo title="Latest Transaction" /> */}
      </div>
    </div>
  );
};

export default CrmPage;
