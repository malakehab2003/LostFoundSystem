import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  topSellingProducts: Array<{
    product_id: number;
    salesCount: string;
    product: { name: string };
  }>;
  leastSellingProducts: Array<{
    product_id: number;
    salesCount: string;
    product: { name: string };
  }>;
  salesByCategory: Array<{
    category: string;
    totalSales: string;
  }>;
}

interface MonthlyOrders {
  month: string;
  year: string;
  orders: Array<{
    id: number;
    total_price: string;
    order_status: string;
    payment_type: string;
    created_at: string;
  }>;
  totalOrders: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyOrders | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("3");
  const [selectedYear, setSelectedYear] = useState("2026");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMonthlyOrders();
    }
  }, [selectedMonth, selectedYear]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchMonthlyOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/dashboard/month-orders?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMonthlyData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching monthly orders:", error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your store overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-700 mt-1">
                    ${stats?.totalRevenue?.toFixed(2) || "0"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">+12.5% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    {stats?.totalOrders || "0"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">+8% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-emerald-700 mt-1">
                    ${stats?.totalRevenue && stats?.totalOrders
                      ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                      : "0"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">+5% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales by Category - Simple Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.salesByCategory.map((category, index) => {
                  const totalSales = stats.salesByCategory.reduce(
                    (sum, c) => sum + parseInt(c.totalSales),
                    0
                  );
                  const percentage = (parseInt(category.totalSales) / totalSales) * 100;
                  const colors = ["bg-purple-500", "bg-pink-500", "bg-cyan-500", "bg-emerald-500", "bg-amber-500"];
                  return (
                    <div key={category.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{category.category}</span>
                        <span className="font-semibold text-gray-800">{category.totalSales} sales</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors[index % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Products - Simple Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topSellingProducts.map((product, index) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.product.name}</p>
                        <p className="text-xs text-gray-400">ID: {product.product_id}</p>
                      </div>
                    </div>
                    <p className="font-bold text-purple-600">{product.salesCount} sales</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Orders Table */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Monthly Orders</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData?.orders?.slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>${parseFloat(order.total_price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.order_status)}>
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{order.payment_type}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {(!monthlyData?.orders || monthlyData.orders.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No orders found for this month
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Total Orders: <span className="font-semibold text-gray-700">{monthlyData?.totalOrders || 0}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Total Revenue: <span className="font-semibold text-gray-700">${monthlyData?.totalRevenue?.toFixed(2) || "0"}</span>
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top vs Least Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ArrowUp className="w-5 h-5 text-green-500" />
                Top 5 Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topSellingProducts.map((product) => (
                  <div key={product.product_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{product.product.name}</p>
                      <p className="text-sm text-gray-500">Product ID: {product.product_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{product.salesCount} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ArrowDown className="w-5 h-5 text-red-500" />
                Least Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.leastSellingProducts.map((product) => (
                  <div key={product.product_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{product.product.name}</p>
                      <p className="text-sm text-gray-500">Product ID: {product.product_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{product.salesCount} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;