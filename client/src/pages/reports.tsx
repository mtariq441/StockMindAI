import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { downloadPDF, downloadCSV, downloadExcel, formatCurrency, formatDate } from "@/lib/exportUtils";

const reportTypes = [
  {
    id: "sales",
    title: "Sales Report",
    description: "Comprehensive sales analysis with trends and insights",
    icon: FileText,
    formats: ["PDF", "CSV", "Excel"],
  },
  {
    id: "inventory",
    title: "Inventory Report",
    description: "Complete inventory status with stock levels and valuation",
    icon: FileText,
    formats: ["PDF", "CSV", "Excel"],
  },
  {
    id: "forecast",
    title: "Forecast Report",
    description: "AI predictions and demand forecasting analysis",
    icon: FileText,
    formats: ["PDF", "CSV"],
  },
  {
    id: "supplier",
    title: "Supplier Report",
    description: "Supplier performance and delivery metrics",
    icon: FileText,
    formats: ["PDF", "Excel"],
  },
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: salesData, isLoading: salesLoading, error: salesError } = useQuery({
    queryKey: ['/api/reports/sales', selectedPeriod],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {};
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/reports/sales?period=${selectedPeriod}`, {
        headers,
        credentials: "include",
      });

      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }

      return await res.json();
    },
  });

  const { data: inventoryData, isLoading: inventoryLoading, error: inventoryError } = useQuery({
    queryKey: ['/api/reports/inventory'],
  });

  const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useQuery({
    queryKey: ['/api/reports/forecast'],
  });

  const { data: supplierData, isLoading: supplierLoading, error: supplierError } = useQuery({
    queryKey: ['/api/reports/supplier'],
  });

  const handleGenerateReport = (reportId: string, format: string) => {
    setGeneratingReport(`${reportId}-${format}`);
    
    try {
      let data;
      switch (reportId) {
        case 'sales':
          if (!salesData) {
            throw new Error("Sales data not available. Please check your connection.");
          }
          data = salesData;
          generateSalesReport(data, format);
          break;
        case 'inventory':
          if (!inventoryData) {
            throw new Error("Inventory data not available. Please check your connection.");
          }
          data = inventoryData;
          generateInventoryReport(data, format);
          break;
        case 'forecast':
          if (!forecastData) {
            throw new Error("Forecast data not available. Please check your connection.");
          }
          data = forecastData;
          generateForecastReport(data, format);
          break;
        case 'supplier':
          if (!supplierData) {
            throw new Error("Supplier data not available. Please check your connection.");
          }
          data = supplierData;
          generateSupplierReport(data, format);
          break;
      }

      const report = reportTypes.find(r => r.id === reportId);
      toast({
        title: "Report Generated",
        description: `Your ${report?.title} has been downloaded successfully.`,
      });
    } catch (error: any) {
      console.error('Report generation error:', error);
      toast({
        title: "Report Generation Failed",
        description: error.message || "Unable to generate report. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const generateSalesReport = (data: any, format: string) => {
    const sales = data.sales || [];
    const summary = data.summary || {};

    if (format === 'PDF') {
      const columns = [
        { header: 'Date', dataKey: 'createdAt' },
        { header: 'Product', dataKey: 'productName' },
        { header: 'SKU', dataKey: 'productSku' },
        { header: 'Customer', dataKey: 'customerName' },
        { header: 'Quantity', dataKey: 'quantity' },
        { header: 'Unit Price', dataKey: 'unitPrice' },
        { header: 'Total', dataKey: 'totalPrice' },
      ];

      const formattedData = sales.map((sale: any) => ({
        ...sale,
        createdAt: formatDate(sale.createdAt),
        unitPrice: formatCurrency(parseFloat(sale.unitPrice)),
        totalPrice: formatCurrency(parseFloat(sale.totalPrice)),
        customerName: sale.customerName || 'N/A',
      }));

      downloadPDF(
        'Sales Report',
        formattedData,
        columns,
        'sales_report',
        [
          { label: 'Total Revenue', value: formatCurrency(summary.totalRevenue || 0) },
          { label: 'Total Orders', value: summary.totalOrders || 0 },
          { label: 'Total Quantity', value: summary.totalQuantity || 0 },
          { label: 'Average Order Value', value: formatCurrency(summary.averageOrderValue || 0) },
        ]
      );
    } else if (format === 'CSV') {
      const headers = ['Date', 'Product', 'SKU', 'Customer', 'Quantity', 'Unit Price', 'Total'];
      const csvData = sales.map((sale: any) => ({
        date: formatDate(sale.createdAt),
        product: sale.productName,
        sku: sale.productSku,
        customer: sale.customerName || 'N/A',
        quantity: sale.quantity,
        unitprice: sale.unitPrice,
        total: sale.totalPrice,
      }));
      downloadCSV(csvData, 'sales_report', headers);
    } else if (format === 'Excel') {
      const excelData = sales.map((sale: any) => ({
        Date: formatDate(sale.createdAt),
        Product: sale.productName,
        SKU: sale.productSku,
        Customer: sale.customerName || 'N/A',
        Quantity: sale.quantity,
        'Unit Price': parseFloat(sale.unitPrice),
        Total: parseFloat(sale.totalPrice),
      }));
      downloadExcel(excelData, 'sales_report', 'Sales');
    }
  };

  const generateInventoryReport = (data: any, format: string) => {
    const inventory = data.inventory || [];
    const summary = data.summary || {};

    if (format === 'PDF') {
      const columns = [
        { header: 'SKU', dataKey: 'sku' },
        { header: 'Product', dataKey: 'name' },
        { header: 'Category', dataKey: 'categoryName' },
        { header: 'Supplier', dataKey: 'supplierName' },
        { header: 'Quantity', dataKey: 'quantity' },
        { header: 'Stock Value', dataKey: 'stockValue' },
        { header: 'Status', dataKey: 'stockStatus' },
      ];

      const formattedData = inventory.map((item: any) => ({
        ...item,
        stockValue: formatCurrency(item.stockValue),
      }));

      downloadPDF(
        'Inventory Report',
        formattedData,
        columns,
        'inventory_report',
        [
          { label: 'Total Products', value: summary.totalProducts || 0 },
          { label: 'Total Stock Value', value: formatCurrency(summary.totalStockValue || 0) },
          { label: 'Low Stock Items', value: summary.lowStockItems || 0 },
          { label: 'Potential Profit', value: formatCurrency(summary.potentialProfit || 0) },
        ]
      );
    } else if (format === 'CSV') {
      const headers = ['SKU', 'Product', 'Category', 'Supplier', 'Quantity', 'Min Stock', 'Stock Value', 'Status'];
      const csvData = inventory.map((item: any) => ({
        sku: item.sku,
        product: item.name,
        category: item.categoryName,
        supplier: item.supplierName,
        quantity: item.quantity,
        minstock: item.minStock,
        stockvalue: item.stockValue,
        status: item.stockStatus,
      }));
      downloadCSV(csvData, 'inventory_report', headers);
    } else if (format === 'Excel') {
      const excelData = inventory.map((item: any) => ({
        SKU: item.sku,
        Product: item.name,
        Category: item.categoryName,
        Supplier: item.supplierName,
        Quantity: item.quantity,
        'Min Stock': item.minStock,
        'Stock Value': item.stockValue,
        'Cost Value': item.costValue,
        Profit: item.profit,
        Status: item.stockStatus,
      }));
      downloadExcel(excelData, 'inventory_report', 'Inventory');
    }
  };

  const generateForecastReport = (data: any, format: string) => {
    const forecast = data.forecast || [];
    const summary = data.summary || {};

    if (format === 'PDF') {
      const columns = [
        { header: 'Product', dataKey: 'name' },
        { header: 'Current Stock', dataKey: 'currentStock' },
        { header: 'Daily Avg', dataKey: 'dailyAverage' },
        { header: 'Weekly Forecast', dataKey: 'weeklyForecast' },
        { header: 'Monthly Forecast', dataKey: 'monthlyForecast' },
        { header: 'Days to Stock Out', dataKey: 'daysUntilStockOut' },
        { header: 'Reorder', dataKey: 'reorderRecommended' },
      ];

      const formattedData = forecast.map((item: any) => ({
        ...item,
        reorderRecommended: item.reorderRecommended ? 'Yes' : 'No',
      }));

      downloadPDF(
        'Forecast Report',
        formattedData,
        columns,
        'forecast_report',
        [
          { label: 'Total Products', value: summary.totalProducts || 0 },
          { label: 'Products Needing Reorder', value: summary.productsNeedingReorder || 0 },
          { label: 'Avg Days to Stock Out', value: summary.avgDaysToStockOut || 0 },
        ]
      );
    } else if (format === 'CSV') {
      const headers = ['Product', 'SKU', 'Current Stock', 'Daily Avg', 'Weekly Forecast', 'Monthly Forecast', 'Days to Stock Out', 'Reorder'];
      const csvData = forecast.map((item: any) => ({
        product: item.name,
        sku: item.sku,
        currentstock: item.currentStock,
        dailyavg: item.dailyAverage,
        weeklyforecast: item.weeklyForecast,
        monthlyforecast: item.monthlyForecast,
        daystostockout: item.daysUntilStockOut,
        reorder: item.reorderRecommended ? 'Yes' : 'No',
      }));
      downloadCSV(csvData, 'forecast_report', headers);
    }
  };

  const generateSupplierReport = (data: any, format: string) => {
    const suppliers = data.suppliers || [];
    const summary = data.summary || {};

    if (format === 'PDF') {
      const columns = [
        { header: 'Supplier', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Total Orders', dataKey: 'totalOrders' },
        { header: 'Total Spent', dataKey: 'totalSpent' },
        { header: 'Avg Order Cost', dataKey: 'avgOrderCost' },
        { header: 'Products Supplied', dataKey: 'productsSupplied' },
      ];

      const formattedData = suppliers.map((supplier: any) => ({
        ...supplier,
        email: supplier.email || 'N/A',
        totalSpent: formatCurrency(supplier.totalSpent),
        avgOrderCost: formatCurrency(supplier.avgOrderCost),
      }));

      downloadPDF(
        'Supplier Report',
        formattedData,
        columns,
        'supplier_report',
        [
          { label: 'Total Suppliers', value: summary.totalSuppliers || 0 },
          { label: 'Total Spent', value: formatCurrency(summary.totalSpent || 0) },
          { label: 'Avg Supplier Spend', value: formatCurrency(summary.avgSupplierSpend || 0) },
        ]
      );
    } else if (format === 'Excel') {
      const excelData = suppliers.map((supplier: any) => ({
        Supplier: supplier.name,
        Email: supplier.email || 'N/A',
        Phone: supplier.phone || 'N/A',
        'Total Orders': supplier.totalOrders,
        'Total Spent': supplier.totalSpent,
        'Total Quantity': supplier.totalQuantity,
        'Avg Order Cost': supplier.avgOrderCost,
        'Products Supplied': supplier.productsSupplied,
        'Last Order Date': supplier.lastOrderDate ? formatDate(supplier.lastOrderDate) : 'N/A',
      }));
      downloadExcel(excelData, 'supplier_report', 'Suppliers');
    }
  };

  const hasError = salesError || inventoryError || forecastError || supplierError;
  const isLoading = salesLoading || inventoryLoading || forecastLoading || supplierLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and download comprehensive reports</p>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to the database. Reports cannot be generated. 
            Please check your database connection and refresh the page to try again.
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Loading report data from the database...
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select time period for report generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="period">Time Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger id="period" data-testid="select-report-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const isReportLoading = 
            (report.id === 'sales' && salesLoading) ||
            (report.id === 'inventory' && inventoryLoading) ||
            (report.id === 'forecast' && forecastLoading) ||
            (report.id === 'supplier' && supplierLoading);

          const hasReportError = 
            (report.id === 'sales' && !!salesError) ||
            (report.id === 'inventory' && !!inventoryError) ||
            (report.id === 'forecast' && !!forecastError) ||
            (report.id === 'supplier' && !!supplierError);

          const isDisabled = isReportLoading || hasReportError;

          return (
            <Card key={report.id} data-testid={`card-report-${report.id}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <report.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="mt-1">{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium">Export Formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {report.formats.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateReport(report.id, format)}
                        disabled={isDisabled || generatingReport === `${report.id}-${format}`}
                        data-testid={`button-export-${report.id}-${format.toLowerCase()}`}
                      >
                        {generatingReport === `${report.id}-${format}` ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : format === "PDF" ? (
                          <FileText className="h-4 w-4 mr-2" />
                        ) : (
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                        )}
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>Generate reports with real-time data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong>1. Select Time Period:</strong> Choose the date range for your report (Last 7 Days, 30 Days, Quarter, or Year).
            </p>
            <p>
              <strong>2. Choose Report Type:</strong> Select from Sales, Inventory, Forecast, or Supplier reports.
            </p>
            <p>
              <strong>3. Export Format:</strong> Click on PDF, CSV, or Excel to download your report in the desired format.
            </p>
            <p className="text-xs italic">
              Note: Reports are generated in real-time from your database. If the database connection fails, 
              an error message will be displayed and report generation will be disabled until the connection is restored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
