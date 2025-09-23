import { Card } from '@/app/ui/dashboard/user/cards';
import React from 'react'

export default function CustomerDashboard() {
  return (
    <main>
      <h1 className={` mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
                    <Card title="Pending" value={totalPendingInvoices} type="pending" />
                    <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        <Card title="This week bookings" value="200" type="collected" />
        <Card title="Last Booking" value="2025-10-02" type="customers" />
        <Card title="Total Bookings" value="10" type="pending" />
        <Card title="Total Spent" value="10000" type="invoices" />

        {/* <Card
          title="Total Customers"
          value="6"
          type="customers"
        /> */}
        {/* <Suspense fallback={<CardSkeleton />}>
                        <CardWrapper />
                    </Suspense> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={400} /> */}
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
                        <RevenueChart />
                    </Suspense>
                    <Suspense fallback={<LatestInvoicesSkeleton />}>
                        <LatestInvoices />
                    </Suspense> */}
      </div>
    </main>
  )
}
