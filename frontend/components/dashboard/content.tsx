"use client";
import React from "react";
import dynamic from "next/dynamic";

import { CardBalance1 } from "../card/card-balance1";
import { CardBalance2 } from "../card/card-balance2";
import { CardBalance3 } from "../card/card-balance3";
import { CardAgents } from "../card/card-agents";
import { CardTransactions } from "../card/card-transactions";

const ProductAnalystComponent = dynamic(
  () => import("@/components/charts/product-analyst"),
  {
    ssr: false,
  },
);

export const Content = () => (
  <div className="h-full lg:px-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
      <div className="mt-6 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Báo cáo</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
            <CardBalance1 />
            <CardBalance2 />
            <CardBalance3 />
          </div>
        </div>

        {/* Chart */}
        <div className="h-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Thống kê</h3>
          <ProductAnalystComponent />
        </div>
      </div>

      {/* Left Section */}
      <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
        <h3 className="text-xl font-semibold">Mục lục</h3>
        <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
          <CardAgents />
          <CardTransactions />
        </div>
      </div>
    </div>

    {/* Table Latest Users */}
    {/*<div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">*/}
    {/*  <div className="flex  flex-wrap justify-between">*/}
    {/*    <h3 className="text-center text-xl font-semibold">Latest Users</h3>*/}
    {/*    <Link*/}
    {/*      href="/accounts"*/}
    {/*      as={NextLink}*/}
    {/*      color="primary"*/}
    {/*      className="cursor-pointer"*/}
    {/*    >*/}
    {/*      View All*/}
    {/*    </Link>*/}
    {/*  </div>*/}
    {/*  <TableWrapper />*/}
    {/*</div>*/}
  </div>
);
