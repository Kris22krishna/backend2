import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

interface StudentSurveyProps {
  selectedGrade: string;
}

export default function StudentSurvey({ selectedGrade }: StudentSurveyProps) {
  const surveyData = [
    {
      id: 1,
      name: "Emma Johnson",
      math: 95,
      science: 92,
      english: 88,
      history: 90,
      attendance: "98%",
      assignments: "20/20",
      engagement: "High",
    },
    {
      id: 2,
      name: "Michael Chen",
      math: 93,
      science: 95,
      english: 85,
      history: 87,
      attendance: "95%",
      assignments: "19/20",
      engagement: "High",
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      math: 92,
      science: 88,
      english: 90,
      history: 89,
      attendance: "97%",
      assignments: "20/20",
      engagement: "High",
    },
    {
      id: 4,
      name: "Oliver Smith",
      math: 85,
      science: 87,
      english: 91,
      history: 88,
      attendance: "93%",
      assignments: "18/20",
      engagement: "Medium",
    },
    {
      id: 5,
      name: "Isabella Brown",
      math: 88,
      science: 90,
      english: 89,
      history: 92,
      attendance: "96%",
      assignments: "19/20",
      engagement: "High",
    },
    {
      id: 6,
      name: "Lucas Martin",
      math: 78,
      science: 82,
      english: 80,
      history: 79,
      attendance: "88%",
      assignments: "16/20",
      engagement: "Medium",
    },
    {
      id: 7,
      name: "Olivia Carter",
      math: 82,
      science: 85,
      english: 83,
      history: 81,
      attendance: "90%",
      assignments: "17/20",
      engagement: "Medium",
    },
    {
      id: 8,
      name: "Ethan Brooks",
      math: 75,
      science: 78,
      english: 76,
      history: 74,
      attendance: "85%",
      assignments: "15/20",
      engagement: "Low",
    },
    {
      id: 9,
      name: "Grace Kim",
      math: 72,
      science: 75,
      english: 73,
      history: 71,
      attendance: "82%",
      assignments: "14/20",
      engagement: "Low",
    },
    {
      id: 10,
      name: "Sarah Johnson",
      math: 68,
      science: 70,
      english: 69,
      history: 67,
      attendance: "63%",
      assignments: "12/20",
      engagement: "Low",
    },
    {
      id: 11,
      name: "James Lee",
      math: 65,
      science: 68,
      english: 66,
      history: 64,
      attendance: "60%",
      assignments: "11/20",
      engagement: "Low",
    },
    {
      id: 12,
      name: "Emily Davis",
      math: 62,
      science: 65,
      english: 63,
      history: 61,
      attendance: "70%",
      assignments: "13/20",
      engagement: "Low",
    },
  ];

  const handleDownloadExcel = () => {
    // Prepare data for Excel
    const excelData = surveyData.map((student) => ({
      "Student ID": student.id,
      "Student Name": student.name,
      "Math Score": student.math,
      "Science Score": student.science,
      "English Score": student.english,
      "History Score": student.history,
      "Average Score": ((student.math + student.science + student.english + student.history) / 4).toFixed(1),
      "Attendance": student.attendance,
      "Assignments Completed": student.assignments,
      "Engagement Level": student.engagement,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const wscols = [
      { wch: 12 },
      { wch: 20 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 },
      { wch: 20 },
      { wch: 18 },
    ];
    ws["!cols"] = wscols;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selectedGrade);

    // Download file
    XLSX.writeFile(wb, `${selectedGrade}_Student_Performance_${new Date().toLocaleDateString()}.xlsx`);
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "High":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detailed Student Performance Survey - {selectedGrade}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Comprehensive overview of all students</p>
          </div>
          <Button onClick={handleDownloadExcel} className="bg-green-600 hover:bg-green-700">
            <Download className="size-4 mr-2" />
            Download Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead className="min-w-[180px]">Student Name</TableHead>
                <TableHead className="text-center">Math</TableHead>
                <TableHead className="text-center">Science</TableHead>
                <TableHead className="text-center">English</TableHead>
                <TableHead className="text-center">History</TableHead>
                <TableHead className="text-center">Average</TableHead>
                <TableHead className="text-center">Attendance</TableHead>
                <TableHead className="text-center">Assignments</TableHead>
                <TableHead className="text-center">Engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveyData.map((student) => {
                const average = ((student.math + student.science + student.english + student.history) / 4).toFixed(1);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className={`text-center ${getScoreColor(student.math)}`}>
                      {student.math}
                    </TableCell>
                    <TableCell className={`text-center ${getScoreColor(student.science)}`}>
                      {student.science}
                    </TableCell>
                    <TableCell className={`text-center ${getScoreColor(student.english)}`}>
                      {student.english}
                    </TableCell>
                    <TableCell className={`text-center ${getScoreColor(student.history)}`}>
                      {student.history}
                    </TableCell>
                    <TableCell className={`text-center font-bold ${getScoreColor(Number(average))}`}>
                      {average}
                    </TableCell>
                    <TableCell className="text-center">{student.attendance}</TableCell>
                    <TableCell className="text-center">{student.assignments}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(student.engagement)}`}>
                        {student.engagement}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Class Average</p>
            <p className="text-2xl font-bold text-blue-600">79.8%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Above 80%</p>
            <p className="text-2xl font-bold text-green-600">7 students</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Below 70%</p>
            <p className="text-2xl font-bold text-orange-600">5 students</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg Attendance</p>
            <p className="text-2xl font-bold text-purple-600">84.3%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
