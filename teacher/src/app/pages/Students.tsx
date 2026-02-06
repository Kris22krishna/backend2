import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import StudentSurvey from "../components/StudentSurvey";

export default function Students() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 8");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <Header title="Student Performance & Analytics" />

        {/* Grade Navigation */}
        <div className="mb-8">
          <Tabs value={selectedGrade} onValueChange={setSelectedGrade}>
            <TabsList>
              <TabsTrigger value="Grade 6">Grade 6</TabsTrigger>
              <TabsTrigger value="Grade 7">Grade 7</TabsTrigger>
              <TabsTrigger value="Grade 8">Grade 8</TabsTrigger>
              <TabsTrigger value="Grade 9">Grade 9</TabsTrigger>
              <TabsTrigger value="Grade 10">Grade 10</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Student Survey Table */}
        <StudentSurvey selectedGrade={selectedGrade} />
      </div>
    </div>
  );
}
