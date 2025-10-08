import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

//todo: remove mock functionality
const reportTypes = [
  {
    id: 1,
    title: "Sales Report",
    description: "Comprehensive sales analysis with trends and insights",
    icon: FileText,
    formats: ["PDF", "CSV", "Excel"],
  },
  {
    id: 2,
    title: "Inventory Report",
    description: "Complete inventory status with stock levels and valuation",
    icon: FileText,
    formats: ["PDF", "CSV", "Excel"],
  },
  {
    id: 3,
    title: "Forecast Report",
    description: "AI predictions and demand forecasting analysis",
    icon: FileText,
    formats: ["PDF", "CSV"],
  },
  {
    id: 4,
    title: "Supplier Report",
    description: "Supplier performance and delivery metrics",
    icon: FileText,
    formats: ["PDF", "Excel"],
  },
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const handleGenerateReport = (reportTitle: string, format: string) => {
    console.log(`Generating ${reportTitle} in ${format} format for ${selectedPeriod}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and download comprehensive reports</p>
      </div>

      {/* Report Configuration */}
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

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
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
                      onClick={() => handleGenerateReport(report.title, format)}
                      data-testid={`button-export-${report.id}-${format.toLowerCase()}`}
                    >
                      {format === "PDF" && <FileText className="h-4 w-4 mr-2" />}
                      {format === "CSV" && <FileSpreadsheet className="h-4 w-4 mr-2" />}
                      {format === "Excel" && <FileSpreadsheet className="h-4 w-4 mr-2" />}
                      {format}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border hover-elevate">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Sales Report - January 2025</p>
                    <p className="text-sm text-muted-foreground">Generated on Jan {i}, 2025</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" data-testid={`button-download-report-${i}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
